import { AdditiveBlending, MeshBasicMaterial, NormalBlending } from 'three';
import { PLAYER, TILE } from '../config';
import { isFloor } from '../dungeon/generator';
import { buildProjectileMesh } from '../models/monsters';
import type { BonusKey } from '../data/bonus';
import { awakenCharges, AWAKEN_HOLD_POWER, effectTier, SKILL_AWAKEN, STORM_RESUME, type AwakenBranch } from '../data/awaken';
import { ultCooldown, ultPower, ULT_COOLDOWN, ULTIMATES, type ClassId } from '../data/classes';
import type { Monster } from './Monster';
import type { Player } from './Player';
import type { Stats } from './Progress';
import type { Projectile } from './Projectiles';
import type { DungeonScene } from './scenes/DungeonScene';
import type { Level } from './scenes/Level';

export interface CombatHost {
  player: Player;
  stats: () => Stats;
  level: () => Level;
  dungeon: () => DungeonScene | null;
  /** 몬스터에게 피해 (치명타·방어 계산 포함) */
  damageMonster: (m: Monster, mult: number, knock: number, fromX: number, fromZ: number) => void;
  shake: (a: number) => void;
  hitStop: (t: number) => void;
  sfx: (name: string) => void;
  /** 스킬 레벨 (0 = 배우지 않음) */
  skillLevel: (index: number) => number;
  /** 각인·칭호 등 보너스 (재사용 대기 감소, 궁극기 위력) */
  bonus: (k: BonusKey) => number;
  /** true: 가까운 적에게 자동 조준 · false: 바라보는 방향으로 */
  autoAim: () => boolean;
  /** 각성 방향 ('s0'~'s5' 스킬, 'u0'·'u1' 궁극기). 각성하지 않았으면 null */
  awaken: (key: string) => AwakenBranch | null;
}

type Target = { kind: 'monster'; m: Monster; x: number; z: number };

/** 직업별 기본 효과 색: 검사=푸른 강철, 마법사=보랏빛 마력, 궁수=초록 바람 */
const COLORS: Record<ClassId, number> = { sword: 0x4aa8ff, mage: 0xa070ff, archer: 0x5aff8a };

/** 공격과 스킬의 실제 판정 */
export class Combat {
  private combo = 0;
  private comboTimer = 0;
  /** 스킬 번호별 재사용 대기 */
  cooldowns: number[] = [0, 0, 0, 0, 0, 0];
  /** 스킬 번호별 남은 충전 수 (보통 1, 충전형 각성이면 최대 2)와 마지막 재사용 대기 길이 (HUD 비율용) */
  stock: number[] = [1, 1, 1, 1, 1, 1];
  cdMax: number[] = [1, 1, 1, 1, 1, 1];
  /** 궁극기를 쓸 수 있는지 (재사용 대기가 끝났으면 1) */
  ultStock = 1;
  /**
   * 천검난무 (B 검무 보류): 남은 칼날 폭풍 횟수. 도는 중에 궁극기를 다시 누르면 멈추고(paused),
   * 10초 안에 다시 누르면 남은 만큼 이어서 돈다
   */
  storm: { left: number; paused: boolean; resumeLeft: number; tick: number; pow: number; d: DungeonScene; spin: number } | null = null;
  /** 바람의 칼날 (궁수 바람 걸음 B) 간격 */
  private bladeT = 0;
  /** 가시 갑옷 (검사 철벽 A) 간격 */
  private thornT = 0;
  /** 궁극기 재사용 대기 */
  ultCooldown = 0;
  /** 마지막으로 쓴 궁극기의 재사용 대기 (HUD 비율용) */
  ultCooldownMax = ULT_COOLDOWN;
  /** 시간이 걸리는 공격 (칼날 폭풍·화살비 등): 같은 던전에 있을 때만 이어진다 */
  private timers: { at: number; every: number; left: number; d: DungeonScene; fn: () => void }[] = [];

  constructor(private host: CombatHost) {}

  update(dt: number): void {
    this.comboTimer = Math.max(0, this.comboTimer - dt);
    if (this.comboTimer === 0) this.combo = 0;
    // 재사용 대기: 충전이 모자라면 흐르고, 다 되면 충전이 하나 찬다 (충전형은 다 찰 때까지 이어서)
    for (let i = 0; i < this.cooldowns.length; i++) {
      const max = this.maxStock(i);
      if (this.stock[i] > max) this.stock[i] = max;
      if (this.stock[i] >= max) {
        this.cooldowns[i] = 0;
        continue;
      }
      if (this.cooldowns[i] <= 0) this.cooldowns[i] = this.cdMax[i];
      this.cooldowns[i] -= dt;
      if (this.cooldowns[i] <= 0) {
        this.stock[i]++;
        this.cooldowns[i] = this.stock[i] < max ? this.cdMax[i] : 0;
      }
    }
    if (this.ultStock < 1) {
      this.ultCooldown -= dt;
      if (this.ultCooldown <= 0) {
        this.ultStock = 1;
        this.ultCooldown = 0;
      }
    }
    this.thornT = Math.max(0, this.thornT - dt);
    this.updateStorm(dt);
    // 바람의 칼날: 바람 걸음 동안 0.45초마다 몸 주위 적을 벤다
    const d = this.host.dungeon();
    const pl = this.host.player;
    if (d && pl.buff('windblade')) {
      this.bladeT -= dt;
      if (this.bladeT <= 0) {
        this.bladeT = 0.45;
        const p = pl.position;
        d.effects.slash(p.x, p.z, pl.facing + Math.random() * 6, 2.4, 0x9affc8, Math.PI * 2, 0.6);
        for (const m of d.monsters) if (m.targetable && Math.hypot(m.x - p.x, m.z - p.z) < 2.4 + m.radius) this.host.damageMonster(m, 0.6, 0.3, p.x, p.z);
      }
    }
    for (let i = this.timers.length - 1; i >= 0; i--) {
      const t = this.timers[i];
      if (this.host.dungeon() !== t.d) {
        this.timers.splice(i, 1);
        continue;
      }
      t.at -= dt;
      while (t.at <= 0 && t.left > 0) {
        t.left--;
        t.at += t.every;
        t.fn();
      }
      if (t.left <= 0) this.timers.splice(i, 1);
    }
  }

  /** delay초 뒤부터 every초마다 times번 fn */
  private repeat(d: DungeonScene, delay: number, every: number, times: number, fn: () => void): void {
    this.timers.push({ at: delay, every, left: times, d, fn });
  }

  /** 궁극기를 지금 쓸 수 있는지 (useSkill과 같은 규칙) */
  ultBlock(index: number): string | null {
    const player = this.host.player;
    const ult = ULTIMATES[player.cls.id][index];
    if (!ult) return '궁극기가 없습니다';
    if (!this.host.dungeon()) return '궁극기는 던전에서만 쓸 수 있습니다';
    if (player.buff('silence')) return '침묵 상태라 궁극기를 쓸 수 없습니다';
    if (this.ultStock < 1) return '';
    if (!player.canAct && player.state !== 'dash') return '';
    if (player.mp < ult.mp) return 'MP가 부족합니다';
    return null;
  }

  /** 천검난무 B: 도는 중이면 멈추고, 멈춰 있으면 이어서 돈다. 처리했으면 true */
  toggleStorm(): boolean {
    const s = this.storm;
    if (!s || this.host.dungeon() !== s.d) return false;
    const pl = this.host.player;
    if (!s.paused) {
      s.paused = true;
      s.resumeLeft = STORM_RESUME;
      s.d.effects.ring(pl.position.x, pl.position.z, 2, 0x9fd8ff, 0.3);
    } else {
      s.paused = false;
      this.startSpin(s.left * 0.2);
    }
    return true;
  }

  private startSpin(duration: number): void {
    const pl = this.host.player;
    pl.invulnFor(duration + 0.1);
    pl.startAction({ pose: 'spin', duration, hitAt: 0.99, moveMult: 0.8, onHit: () => {} }, null);
  }

  /** 칼날 폭풍 한 박자 (천검난무) */
  private updateStorm(dt: number): void {
    const s = this.storm;
    if (!s) return;
    if (this.host.dungeon() !== s.d || !this.host.player.alive) {
      this.storm = null;
      return;
    }
    if (s.paused) {
      s.resumeLeft -= dt;
      if (s.resumeLeft <= 0) this.storm = null;
      return;
    }
    s.tick -= dt;
    if (s.tick > 0) return;
    s.tick = 0.2;
    const p = this.host.player.position;
    const d = s.d;
    s.spin++;
    const col = s.spin % 2 ? 0x9fd8ff : 0x4aa8ff;
    d.effects.slash(p.x, p.z, this.host.player.facing + s.spin, 3.6, col, Math.PI * 2, 0.7 + (s.spin % 3) * 0.3);
    d.effects.sparks(p.x, 1, p.z, 0xdff4ff, 6, { speed: 6 });
    for (const m of d.monsters) if (m.targetable && Math.hypot(m.x - p.x, m.z - p.z) < 3.8 + m.radius) this.host.damageMonster(m, 1.4 * s.pow, 0.4, p.x, p.z);
    this.host.sfx('swing');
    s.left--;
    if (s.left <= 0) {
      d.effects.ring(p.x, p.z, 5, 0x4aa8ff, 0.4);
      for (const m of d.monsters) if (m.targetable && Math.hypot(m.x - p.x, m.z - p.z) < 4.5 + m.radius) this.host.damageMonster(m, 2 * s.pow, 1.8, p.x, p.z);
      this.host.shake(0.35);
      this.storm = null;
    }
  }

  // ---- 맞았을 때·막았을 때 반응하는 각성 (Game이 부른다) ----
  /** 가시 갑옷 (검사 철벽 A): 맞으면 주변에 가시 충격파 */
  thorns(): void {
    const d = this.host.dungeon();
    if (!d || this.thornT > 0) return;
    this.thornT = 0.4;
    const p = this.host.player.position;
    d.effects.ring(p.x, p.z, 3, 0x9fc4ff, 0.3, 1);
    d.effects.sparks(p.x, 1, p.z, 0xcfe0ff, 10, { speed: 6 });
    for (const m of d.monsters) if (m.targetable && Math.hypot(m.x - p.x, m.z - p.z) < 3 + m.radius) this.host.damageMonster(m, 1.2, 1.2, p.x, p.z);
  }

  /** 반격 방패 (검사 수호의 방패 A): 막을 때마다 주변을 벤다 */
  counter(): void {
    const d = this.host.dungeon();
    if (!d) return;
    const p = this.host.player.position;
    d.effects.slash(p.x, p.z, this.host.player.facing, 3, 0xffd84a, Math.PI * 2, 1.1);
    this.arcHit(3, Math.PI * 2, 1.6, 1.4);
    this.host.sfx('swing');
  }

  /** 반사 실드 (마법사 마나 실드 A): 맞으면 가까운 적에게 번개 */
  manaZap(): void {
    const d = this.host.dungeon();
    if (!d || this.thornT > 0) return;
    this.thornT = 0.3;
    const t = this.findTarget(8);
    if (!t) return;
    const p = this.host.player.position;
    d.effects.bolt(p.x, p.z, t.x, t.z, 0x9fd8ff);
    this.host.damageMonster(t.m, 1.5, 0.4, p.x, p.z);
  }

  /** 땅에 남아 계속 타는 장판 (불·독·불길). every초마다 반경 안의 적에게 mult 피해 */
  private burnZone(d: DungeonScene, x: number, z: number, r: number, duration: number, mult: number, color: number, every = 0.5): void {
    d.effects.zone(x, z, r, color, duration);
    this.repeat(d, 0.2, every, Math.round(duration / every), () => {
      d.effects.sparks(x + (Math.random() - 0.5) * r, 0.4, z + (Math.random() - 0.5) * r, color, 3, { speed: 2, up: true });
      for (const m of d.monsters) if (m.targetable && Math.hypot(m.x - x, m.z - z) < r + m.radius) this.host.damageMonster(m, mult, 0, x, z);
    });
  }

  /** 궁극기 (0/1). 실패 이유를 돌려준다 */
  useUlt(index: number, level = 1): string | null {
    const block = this.ultBlock(index);
    if (block !== null) return block || null;
    const player = this.host.player;
    const d = this.host.dungeon()!;
    const ult = ULTIMATES[player.cls.id][index];
    const aw = this.host.awaken(`u${index}`);
    player.mp -= ult.mp;
    this.ultStock = 0;
    this.ultCooldownMax = this.ultCooldown = ultCooldown(level);
    const pow = ultPower(level) * (1 + this.host.bonus('ult'));
    const p = player.position;
    const target = this.findTarget(14);
    const aim = this.angleTo(target) ?? player.facing;
    // 몬스터가 가장 많이 모인 곳 (범위 궁극기 조준)
    const crowd = (range: number, r: number, cx = p.x, cz = p.z) => {
      let best = { x: cx + Math.sin(aim) * 5, z: cz + Math.cos(aim) * 5, n: 0 };
      for (const m of d.monsters) {
        if (!m.targetable || Math.hypot(m.x - cx, m.z - cz) > range) continue;
        const n = d.monsters.filter((o) => o.targetable && Math.hypot(o.x - m.x, o.z - m.z) < r).length;
        if (n > best.n) best = { x: m.x, z: m.z, n };
      }
      return best;
    };
    const hitAround = (x: number, z: number, r: number, mult: number, knock: number, stun = 0, frozen = false) => {
      for (const m of d.monsters) {
        if (!m.targetable || Math.hypot(m.x - x, m.z - z) > r + m.radius) continue;
        this.host.damageMonster(m, mult * pow, knock, x, z);
        if (stun && m.targetable) {
          m.stun = Math.max(m.stun, stun);
          m.frozen = frozen;
        }
      }
    };
    this.host.shake(0.3);
    switch (`${player.cls.id}:${index}`) {
      case 'sword:0': {
        d.effects.aura(p.x, p.z, 0x4aa8ff);
        this.host.sfx('level');
        if (aw === 'B') {
          // 검무 보류: 1.5배 길게, 다시 누르면 멈췄다가 10초 안에 이어서
          this.storm = { left: 18, paused: false, resumeLeft: 0, tick: 0.05, pow, d, spin: 0 };
          this.startSpin(18 * 0.2);
          break;
        }
        // 천검난무 (A 뇌신 검무: 범위 1.4배 + 도는 동안 천둥 번개)
        const R = aw === 'A' ? 1.4 : 1;
        player.invulnFor(2.5);
        player.startAction({ pose: 'spin', duration: 2.4, hitAt: 2, moveMult: 0.8, onHit: () => {} }, null);
        let i = 0;
        this.repeat(d, 0.05, 0.2, 12, () => {
          const col = i++ % 2 ? 0x9fd8ff : 0x4aa8ff;
          d.effects.slash(p.x, p.z, player.facing + i, 3.6 * R, col, Math.PI * 2, 0.7 + (i % 3) * 0.3);
          d.effects.sparks(p.x, 1, p.z, 0xdff4ff, 6, { speed: 6 });
          hitAround(p.x, p.z, 3.8 * R, 1.4, 0.4);
          if (aw === 'A') {
            const near = d.monsters.filter((m) => m.targetable && Math.hypot(m.x - p.x, m.z - p.z) < 8 + m.radius);
            for (let k = 0; k < 2 && near.length; k++) {
              const m = near.splice(Math.floor(Math.random() * near.length), 1)[0];
              d.effects.bolt(m.x, m.z - 0.01, m.x, m.z, 0xfff6c0);
              d.effects.pillar(m.x, m.z, 0x9fe8ff, 3);
              this.host.damageMonster(m, 1.3 * pow, 0.3, m.x, m.z);
              if (m.targetable) m.stun = Math.max(m.stun, m.isBoss ? 0.1 : 0.3);
            }
          }
          this.host.sfx('swing');
        });
        this.repeat(d, 2.4, 1, 1, () => {
          d.effects.ring(p.x, p.z, 5 * R, 0x4aa8ff, 0.4);
          hitAround(p.x, p.z, 4.5 * R, 2, 1.8);
          this.host.shake(0.35);
        });
        break;
      }
      case 'sword:1': {
        // 대지 붕괴: 뛰어올라 내려찍기 + 기절 (B 천공 낙하: 더 높이·넓게·두 배)
        const big = aw === 'B';
        const t = crowd(9, 3);
        const dist = Math.min(big ? 10 : 8, Math.hypot(t.x - p.x, t.z - p.z));
        const dir = Math.atan2(t.x - p.x, t.z - p.z);
        const air = big ? 0.8 : 0.45;
        const R = big ? 1.5 : 1;
        player.facing = dir;
        player.invulnFor(air + 0.45);
        d.effects.glyph(p.x + Math.sin(dir) * dist, p.z + Math.cos(dir) * dist, 5 * R, 0xffa24a, air + 0.15);
        player.startDash({
          dirX: Math.sin(dir),
          dirZ: Math.cos(dir),
          speed: Math.max(4, dist / air),
          duration: air,
          pose: 'leap',
          invuln: true,
          onEnd: () => {
            d.effects.explosion(p.x, p.z, 5 * R, 0xff8a2a);
            d.effects.ring(p.x, p.z, 6.5 * R, 0xffd08a, 0.5);
            d.particles.burst(p.x, 0.4, p.z, 0x7a5a3a, 30, 2);
            hitAround(p.x, p.z, 5 * R, big ? 24 : 12, 2.2, 2.5);
            this.host.shake(big ? 1 : 0.8);
            this.host.hitStop(0.12);
            this.host.sfx('slam');
            // 연쇄 붕괴: 여진이 세 번 더 넓게
            if (aw === 'A') {
              const cx = p.x;
              const cz = p.z;
              let w = 0;
              this.repeat(d, 0.4, 0.4, 3, () => {
                const r = 7 + w++ * 2;
                d.effects.ring(cx, cz, r, 0xffb86a, 0.4, 0.8);
                d.particles.burst(cx, 0.3, cz, 0x7a5a3a, 14, 1.8);
                hitAround(cx, cz, r, 3, 1);
                this.host.shake(0.35);
                this.host.sfx('slam');
              });
            }
          },
        });
        this.host.sfx('dash');
        break;
      }
      case 'mage:0': {
        const t = crowd(13, 3.2);
        player.startAction({ pose: 'cast', duration: 0.6, hitAt: 0.3, onHit: () => {} }, Math.atan2(t.x - p.x, t.z - p.z));
        d.effects.glyph(p.x, p.z, 1.8, 0xff7a30, 0.9);
        this.host.sfx('magic');
        if (aw === 'B') {
          // 거대 운석: 하나가 크게 떨어지고 불타는 구덩이를 남긴다
          d.effects.glyph(t.x, t.z, 6, 0xff5a1a, 1.1);
          this.repeat(d, 0.3, 1, 1, () =>
            d.effects.meteor(t.x, t.z, 0xff4a10, 0.9, () => {
              if (this.host.dungeon() !== d) return;
              d.effects.explosion(t.x, t.z, 6, 0xff5a1a);
              d.effects.ring(t.x, t.z, 7, 0xffd08a, 0.6);
              hitAround(t.x, t.z, 6, 16, 2.4, 1);
              this.burnZone(d, t.x, t.z, 4.5, 4, 1.2 * pow, 0xff6a20);
              this.host.shake(0.9);
              this.host.hitStop(0.1);
              this.host.sfx('boom');
            }),
          );
          break;
        }
        // 메테오 (A 유성우: 작은 운석 일곱 개가 넓게)
        const count = aw === 'A' ? 7 : 3;
        const spread = aw === 'A' ? 4.5 : 3;
        for (let i = 0; i < count; i++) {
          const a = Math.random() * Math.PI * 2;
          const r = i === 0 ? 0 : 1.2 + Math.random() * spread;
          const mx = t.x + Math.cos(a) * r;
          const mz = t.z + Math.sin(a) * r;
          const small = aw === 'A';
          this.repeat(d, i * (small ? 0.22 : 0.45), 1, 1, () =>
            d.effects.meteor(mx, mz, 0xff6a20, small ? 0.4 : 0.55, () => {
              if (this.host.dungeon() !== d) return;
              d.effects.explosion(mx, mz, small ? 2.6 : 3.4, 0xff5a1a);
              hitAround(mx, mz, small ? 2.6 : 3.4, small ? 3.8 : 6, 1.3, 0.4);
              this.host.shake(small ? 0.3 : 0.45);
              this.host.sfx('boom');
            }),
          );
        }
        break;
      }
      case 'mage:1': {
        // 절대영도 (A 산산조각 · B 얼음 요새)
        const fort = aw === 'B';
        const R = fort ? 1.4 : 1;
        const freeze = fort ? 5 : 3;
        player.startAction({ pose: 'cast', duration: 0.5, hitAt: 0.4, onHit: () => {} }, null);
        if (fort) {
          player.invulnFor(3);
          d.effects.pillar(p.x, p.z, 0xbff4ff, 3);
          d.effects.aura(p.x, p.z, 0x9ff4ff);
        }
        d.effects.glyph(p.x, p.z, 4 * R, 0x9ff4ff, 1.2);
        d.effects.zone(p.x, p.z, 8 * R, 0x6ad8ff, freeze);
        const cx = p.x;
        const cz = p.z;
        this.repeat(d, 0.35, 1, 1, () => {
          d.effects.ring(cx, cz, 9 * R, 0xdff8ff, 0.6);
          d.effects.ring(cx, cz, 6 * R, 0x6ad8ff, 0.5);
          d.effects.sparks(cx, 0.5, cz, 0xdff8ff, 40, { speed: 9 });
          const frozen = d.monsters.filter((m) => m.targetable && Math.hypot(m.x - cx, m.z - cz) <= 8 * R + m.radius);
          hitAround(cx, cz, 8 * R, 8, 0, freeze, true);
          this.host.shake(0.4);
          this.host.sfx('ice');
          // 산산조각: 풀리는 순간 한 번 더 큰 피해
          if (aw === 'A')
            this.repeat(d, freeze - 0.1, 1, 1, () => {
              for (const m of frozen) {
                if (!m.targetable) continue;
                d.effects.sparks(m.x, 1, m.z, 0xdff8ff, 14, { speed: 7 });
                d.effects.ring(m.x, m.z, 1.4, 0xbff4ff, 0.3);
                this.host.damageMonster(m, 10 * pow, 1, m.x, m.z);
              }
              this.host.sfx('ice');
              this.host.shake(0.3);
            });
        });
        break;
      }
      case 'archer:0': {
        // 화살비 (A 추적 화살비 · B 불화살비)
        const t = crowd(13, 4);
        const fire = aw === 'B';
        const col = fire ? 0xff8a3a : 0x7aff9a;
        player.startAction({ pose: 'shoot', duration: 0.5, hitAt: 0.5, onHit: () => {} }, Math.atan2(t.x - p.x, t.z - p.z));
        const center = { x: t.x, z: t.z };
        d.effects.arrowRain(center.x, center.z, 4.2, col, 3.2);
        this.host.sfx('bow');
        let n = 0;
        this.repeat(d, 0.3, 0.25, 12, () => {
          // 추적: 1초마다 적이 가장 많이 모인 곳으로 옮겨 간다
          if (aw === 'A' && ++n % 4 === 0) {
            const c2 = crowd(9, 4, center.x, center.z);
            if (c2.n > 0) {
              center.x = c2.x;
              center.z = c2.z;
              d.effects.arrowRain(center.x, center.z, 4.2, col, 1.1);
            }
          }
          hitAround(center.x, center.z, 4.2, fire ? 1.2 : 0.9, 0.1);
          this.host.sfx('bow');
        });
        if (fire) this.repeat(d, 3.3, 1, 1, () => this.burnZone(d, center.x, center.z, 4.2, 3, 0.9 * pow, 0xff6a20));
        break;
      }
      case 'archer:1':
      default: {
        // 용의 사격 (A 쌍룡 사격 · B 용의 숨결)
        player.invulnFor(0.7);
        player.startAction({ pose: 'shoot', duration: 0.8, hitAt: 0.75, onHit: () => {} }, aim);
        d.effects.glyph(p.x, p.z, 2, 0xffd04a, 0.8);
        d.effects.sparks(p.x, 1.1, p.z, 0xffd04a, 20, { up: true, spread: 0.6 });
        this.repeat(d, 0.6, 1, 1, () => {
          const f = player.facing;
          const angles = aw === 'A' ? [f - 0.14, f + 0.14] : [f];
          for (const a of angles) {
            d.spawnPlayerProjectile({ x: p.x, z: p.z, angle: a, speed: 30, damage: 14 * pow, color: 0xffc04a, kind: 'wave', radius: 1.5, pierce: 99, life: 0.8, knock: 2, y: 1 });
            d.effects.streak(p.x, p.z, p.x + Math.sin(a) * 24, p.z + Math.cos(a) * 24, 0xffd04a, 2);
          }
          d.effects.ring(p.x + Math.sin(f) * 1.2, p.z + Math.cos(f) * 1.2, 2.5, 0xffd04a, 0.3, 1);
          // 용의 숨결: 지나간 길을 따라 불길이 연달아 폭발
          if (aw === 'B') {
            const sx = p.x;
            const sz = p.z;
            let k = 1;
            this.repeat(d, 0.25, 0.08, 9, () => {
              const x = sx + Math.sin(f) * k * 2.4;
              const z = sz + Math.cos(f) * k * 2.4;
              k++;
              if (!isFloor(d.grid, Math.floor(x / TILE), Math.floor(z / TILE))) return;
              d.effects.explosion(x, z, 2.2, 0xff6a20);
              hitAround(x, z, 2.2, 3, 0.8);
            });
            this.host.sfx('boom');
          }
          this.host.shake(0.5);
          this.host.sfx('boom');
        });
        break;
      }
    }
    return null;
  }

  /**
   * 궁수 회피 (후방 도약): 입력 방향으로, 입력이 없으면 적 반대쪽으로 뛰며 무적. 던전에서는 제자리에 덫을 남긴다
   */
  backstep(move: { x: number; y: number }): boolean {
    const player = this.host.player;
    if (player.buff('stun') || !player.canDodge || player.state === 'dash' || !player.alive) return false;
    const p = player.position;
    const d = this.host.dungeon();
    const target = this.findTarget(12);
    const input = Math.hypot(move.x, move.y) > 0.12;
    const away = this.angleTo(target);
    let dir: { x: number; z: number };
    if (input) dir = player.dodgeDir(move);
    else if (away !== null) dir = { x: -Math.sin(away), z: -Math.cos(away) };
    else dir = { x: -Math.sin(player.facing), z: -Math.cos(player.facing) };
    const face = player.facing;
    player.startDash({ dirX: dir.x, dirZ: dir.z, speed: 14, duration: 0.35, pose: 'leap', invuln: true });
    // 뒤로 뛸 때는 적(또는 원래 방향)을 계속 바라본다
    if (!input) player.facing = away ?? face;
    player.useDodge(PLAYER.backstepCooldown);
    this.host.sfx('dash');
    if (d) {
      const tx = p.x;
      const tz = p.z;
      d.effects.zone(tx, tz, 1.2, 0xffb040, 1.2);
      d.effects.glyph(tx, tz, 1.2, 0xffb040, 1.2);
      this.repeat(d, 1.2, 1, 1, () => {
        d.effects.explosion(tx, tz, 3, 0xff8a2a);
        d.particles.burst(tx, 0.4, tz, 0x6a4a2a, 12, 1.3);
        this.host.sfx('boom');
        this.host.shake(0.2);
        for (const m of d.monsters) if (m.targetable && Math.hypot(m.x - tx, m.z - tz) < 3 + m.radius) this.host.damageMonster(m, 1.8, 1.5, tx, tz);
      });
    }
    return true;
  }

  /** 자동 조준: 사거리 안의 가장 가까운 몬스터 */
  findTarget(range: number): Target | null {
    const p = this.host.player.position;
    const d = this.host.dungeon();
    if (!d) return null;
    let best: Target | null = null;
    let bestD = range;
    for (const m of d.monsters) {
      if (!m.targetable) continue;
      const dist = Math.hypot(m.x - p.x, m.z - p.z) - m.radius;
      if (dist < bestD) {
        bestD = dist;
        best = { kind: 'monster', m, x: m.x, z: m.z };
      }
    }
    return best;
  }

  private angleTo(t: Target | null): number | null {
    if (!t) return null;
    const p = this.host.player.position;
    return Math.atan2(t.x - p.x, t.z - p.z);
  }

  /** 부채꼴 안의 몬스터를 친다 */
  private arcHit(range: number, angle: number, mult: number, knock: number): number {
    const p = this.host.player.position;
    const f = this.host.player.facing;
    const fx = Math.sin(f);
    const fz = Math.cos(f);
    let hits = 0;
    const d = this.host.dungeon();
    if (!d) return 0;
    const inArc = (x: number, z: number, r: number) => {
      const dx = x - p.x;
      const dz = z - p.z;
      const dist = Math.hypot(dx, dz);
      if (dist - r > range) return false;
      if (dist < r + 0.4) return true;
      return (dx * fx + dz * fz) / dist >= Math.cos(angle / 2);
    };
    for (const m of d.monsters) {
      if (m.targetable && inArc(m.x, m.z, m.radius)) {
        this.host.damageMonster(m, mult, knock, p.x, p.z);
        hits++;
      }
    }
    if (hits > 0) {
      this.host.hitStop(0.045);
      this.host.shake(0.15);
    }
    return hits;
  }

  basicAttack(): void {
    const player = this.host.player;
    if (!player.canAct) return;
    const cls = player.cls.id;
    const ranged = cls !== 'sword';
    const target = this.findTarget(ranged ? 11 : 4.5);
    const level = this.host.level();
    const color = COLORS[cls];

    const speed = this.host.stats().speed;
    // 검사: 3타 베기 콤보 (마을·차원집에서도 같다)
    if (cls === 'sword') {
      const combo = this.combo;
      const big = combo === 2;
      player.startAction(
        {
          pose: 'swing',
          combo,
          duration: (player.cls.attackTime * (big ? 1.25 : 1)) / speed,
          hitAt: 0.45,
          onHit: () => {
            const range = big ? 2.9 : 2.3;
            level.effects.slash(player.position.x, player.position.z, player.facing, range, color, big ? 3 : 2.2);
            if (big) level.effects.ring(player.position.x + Math.sin(player.facing) * 1.2, player.position.z + Math.cos(player.facing) * 1.2, 2, color, 0.3);
            this.host.sfx('swing');
            this.arcHit(range, big ? 3 : 2.3, big ? 1.7 : combo === 1 ? 1.1 : 1, big ? 1.6 : 0.6);
          },
        },
        this.angleTo(target),
      );
      this.combo = (this.combo + 1) % 3;
      this.comboTimer = 0.9;
      return;
    }

    // 마을·차원집: 맞힐 적은 없지만 던전과 똑같은 마탄·화살이 날아간다 (보기만)
    const d = this.host.dungeon();
    if (!d) {
      const mage = cls === 'mage';
      player.startAction(
        {
          pose: mage ? 'cast' : 'shoot',
          duration: player.cls.attackTime / speed,
          hitAt: mage ? 0.5 : 0.55,
          onHit: () => {
            this.host.sfx(mage ? 'magic' : 'bow');
            this.fakeShot(level, player.position.x, player.position.z, player.facing, color, mage);
          },
        },
        player.facing,
      );
      return;
    }

    const aim = this.angleTo(target) ?? player.facing;
    if (cls === 'mage') {
      player.startAction(
        {
          pose: 'cast',
          duration: player.cls.attackTime / speed,
          hitAt: 0.5,
          onHit: () => {
            this.host.sfx('magic');
            d.spawnPlayerProjectile({ x: player.position.x, z: player.position.z, angle: player.facing, speed: 17, damage: 1, color, kind: 'orb', radius: 0.35, y: 1.2 });
          },
        },
        aim,
      );
    } else {
      player.startAction(
        {
          pose: 'shoot',
          duration: player.cls.attackTime / speed,
          hitAt: 0.55,
          onHit: () => {
            this.host.sfx('bow');
            d.spawnPlayerProjectile({ x: player.position.x, z: player.position.z, angle: player.facing, speed: 26, damage: 0.95, color, kind: 'arrow', radius: 0.3, y: 1.1 });
          },
        },
        aim,
      );
    }
  }

  /** 던전 밖에서 보여 주기만 하는 기본 공격 투사체 (던전의 마탄·화살과 같은 모델·속도) */
  private fakeShot(level: Level, x0: number, z0: number, angle: number, color: number, orb: boolean): void {
    const mat = new MeshBasicMaterial({ color, transparent: true, opacity: 0.95, blending: orb ? AdditiveBlending : NormalBlending, depthWrite: false });
    const mesh = buildProjectileMesh(mat, orb ? 'orb' : 'arrow');
    if (!orb) mesh.material = new MeshBasicMaterial({ vertexColors: true });
    mesh.rotation.y = angle;
    const speed = orb ? 17 : 26;
    const life = 1.6;
    const sx = Math.sin(angle);
    const sz = Math.cos(angle);
    const y = orb ? 1.2 : 1.1;
    let gone = false;
    level.effects.add(mesh, life, (k) => {
      if (gone) return;
      const d = 0.6 + speed * life * k;
      const x = x0 + sx * d;
      const z = z0 + sz * d;
      mesh.position.set(x, y, z);
      // 벽에 닿으면 튀고 사라진다
      if (!isFloor(level.grid, Math.floor(x / TILE), Math.floor(z / TILE))) {
        gone = true;
        mesh.visible = false;
        level.effects.sparks(x - sx * 0.3, y, z - sz * 0.3, color, 4, { speed: 2 });
        return;
      }
      if (orb || Math.random() < 0.5) level.effects.sparks(x, y, z, color, 1, { speed: 0.3, life: 0.25, size: orb ? 0.8 : 0.5 });
    });
  }

  /** 스킬 번호별 최대 충전 수 (돌진 베기 A 연속 돌진이면 2) */
  maxStock(index: number): number {
    return awakenCharges(SKILL_AWAKEN[this.host.player.cls.id][index], this.host.awaken(`s${index}`));
  }

  /** 스킬을 지금 쓸 수 있는지. 쓸 수 없으면 이유(빈 문자열 = 조용히 무시) */
  skillBlock(index: number): string | null {
    const player = this.host.player;
    const skill = player.cls.skills[index];
    const lv = this.host.skillLevel(index);
    if (lv <= 0) return `${skill.name}: 아직 배우지 않았습니다 (마을의 교관 카엘)`;
    if (!this.host.dungeon()) return '스킬은 던전에서만 쓸 수 있습니다';
    if (player.buff('silence')) return '침묵 상태라 스킬을 쓸 수 없습니다';
    if (this.stock[index] < 1) return '';
    if (!player.canAct && player.state !== 'dash') return '';
    if (player.mp < skill.mp) return 'MP가 부족합니다';
    return null;
  }

  /** 스킬 레벨 효과 단계: Lv.4~6은 고리·불꽃이 더해지고, Lv.7~10은 문양·빛기둥·금빛 불꽃까지 */
  private flair(d: DungeonScene, x: number, z: number, color: number, tier: number, scale = 1): void {
    if (tier <= 0) return;
    d.effects.ring(x, z, 2.2 * scale, color, 0.35, 0.9);
    d.effects.sparks(x, 1, z, color, 12, { speed: 6 });
    if (tier >= 2) {
      d.effects.glyph(x, z, 1.7 * scale, 0xffe08a, 0.55);
      d.effects.pillar(x, z, color, 2.2);
      d.effects.sparks(x, 1.2, z, 0xffe08a, 16, { speed: 7, up: true });
    }
  }

  /** 집중형 각성을 끝까지 모았을 때 터지는 금빛 섬광 */
  private fullCharge(d: DungeonScene, x: number, z: number, color: number): void {
    d.effects.ring(x, z, 3.2, 0xffe08a, 0.45, 1.2);
    d.effects.ring(x, z, 2, color, 0.35, 1);
    d.effects.sparks(x, 1, z, 0xfff0b0, 24, { speed: 8, up: true });
    this.host.shake(0.3);
  }

  /**
   * 스킬 사용. 실패 이유를 문자열로 돌려준다.
   * charge: 섬광 돌진(돌진 베기 B)에서 모은 정도 (0~1, 3초 = 1)
   */
  useSkill(index: number, charge = 0): string | null {
    const player = this.host.player;
    const skill = player.cls.skills[index];
    const block = this.skillBlock(index);
    if (block !== null) return block || null;
    const d = this.host.dungeon()!;
    const lv = this.host.skillLevel(index);
    const tier = effectTier(lv);
    const aw = this.host.awaken(`s${index}`);
    const c = Math.max(0, Math.min(1, charge));
    const full = c >= 0.99;
    // 스킬 레벨마다 위력 +15%. 모으는 스킬은 모은 만큼 위력 최대 3배
    const k = (1 + (lv - 1) * 0.15) * (1 + (AWAKEN_HOLD_POWER - 1) * c);
    const dmg = (m: Monster, mult: number, knock: number, fx: number, fz: number) => this.host.damageMonster(m, mult * k, knock, fx, fz);
    const around = (x: number, z: number, r: number, mult: number, knock: number) => {
      for (const m of d.monsters) if (m.targetable && Math.hypot(m.x - x, m.z - z) < r + m.radius) dmg(m, mult, knock, x, z);
    };
    player.mp -= skill.mp;
    // 재사용 대기: Lv.5까지 레벨마다 -6%, 그 뒤로는 -2%씩 (Lv.10: -34%)
    const cdLv = Math.min(4, lv - 1) * 0.06 + Math.max(0, lv - 5) * 0.02;
    const cd = skill.cooldown * (1 - cdLv) * (1 - this.host.bonus('cdr'));
    this.stock[index]--;
    if (this.cooldowns[index] <= 0) this.cooldowns[index] = cd;
    this.cdMax[index] = cd;
    const p = player.position;
    // 설정에서 '바라보는 방향'을 고르면 스킬은 자동 조준 없이 캐릭터가 보는 쪽으로 나간다
    const target = this.host.autoAim() ? this.findTarget(12) : null;
    const aim = this.angleTo(target) ?? player.facing;
    const color = COLORS[player.cls.id];
    const fx = () => Math.sin(player.facing);
    const fz = () => Math.cos(player.facing);
    if (full) this.fullCharge(d, p.x, p.z, color);

    switch (`${player.cls.id}:${index}`) {
      // ================= 검사 =================
      case 'sword:0': {
        // 돌진 베기 (A 연속 돌진: 충전 2회 · B 섬광 돌진: 꾹 눌러 모으기)
        player.facing = aim;
        const hit = new Set<Monster>();
        const sx = p.x;
        const sz = p.z;
        d.effects.ring(sx, sz, 1.6, color, 0.25);
        const far = 1 + c;
        player.startDash({
          dirX: Math.sin(aim),
          dirZ: Math.cos(aim),
          speed: 20 * far,
          duration: 0.28,
          pose: 'lunge',
          invuln: true,
          onStep: () => {
            for (const m of d.monsters) {
              if (m.targetable && !hit.has(m) && Math.hypot(m.x - p.x, m.z - p.z) < m.radius + 1.3 + c * 0.6) {
                hit.add(m);
                dmg(m, 2.2, 1.2, p.x, p.z);
                d.effects.slash(m.x, m.z, player.facing + Math.PI / 2, 1.6, color, 1.6);
                d.effects.sparks(m.x, 1, m.z, 0xffffff, 8, { speed: 5 });
              }
            }
          },
          onEnd: () => {
            d.effects.streak(sx, sz, p.x, p.z, tier >= 2 ? 0xffe08a : color, 1.1 + c);
            this.flair(d, p.x, p.z, color, tier);
            if (c > 0.3) {
              d.effects.explosion(p.x, p.z, 2 + c * 1.5, color);
              around(p.x, p.z, 2.2 + c * 1.5, 1.2, 1.6);
              this.host.shake(0.3);
            }
            if (hit.size) this.host.shake(0.2);
          },
        });
        this.host.sfx('dash');
        break;
      }
      case 'sword:1': {
        // 회전 베기 (A 회오리 베기 · B 진공 회전)
        const spin = () => {
          d.effects.ring(p.x, p.z, 3.6, color, 0.35, 0.3);
          d.effects.slash(p.x, p.z, player.facing, 3.2, color, Math.PI * 2);
          d.effects.slash(p.x, p.z, player.facing + Math.PI, 2.4, tier >= 2 ? 0xffe08a : 0xbfe4ff, Math.PI * 2, 1.2);
          this.host.sfx('swing');
          this.arcHit(3.2, Math.PI * 2, 2.4 * k, 1.4);
          this.flair(d, p.x, p.z, color, tier, 1.3);
        };
        if (aw === 'A') {
          // 회오리: 1.5초 동안 계속 돈다 (움직일 수 있다)
          player.startAction({ pose: 'spin', duration: 1.5, hitAt: 0.99, moveMult: 0.75, onHit: () => {} }, null);
          this.repeat(d, 0.1, 0.3, 5, () => {
            d.effects.slash(p.x, p.z, player.facing + Math.random() * 6, 3.2, color, Math.PI * 2, 0.9);
            d.effects.sparks(p.x, 1, p.z, 0xdff4ff, 5, { speed: 5 });
            this.arcHit(3.2, Math.PI * 2, 1.3 * k, 0.5);
            this.host.sfx('swing');
          });
          this.flair(d, p.x, p.z, color, tier, 1.3);
          break;
        }
        player.startAction({ pose: 'spin', duration: 0.45, hitAt: 0.5, moveMult: 0.5, onHit: spin }, null);
        if (aw === 'B') {
          // 진공: 끌어당긴 뒤 더 큰 충격파 + 기절
          for (const m of d.monsters) if (m.targetable && Math.hypot(m.x - p.x, m.z - p.z) < 7) m.pull(p.x, p.z, 3);
          d.effects.ring(p.x, p.z, 7, 0x9fd8ff, 0.3, 0.6);
          this.repeat(d, 0.6, 1, 1, () => {
            d.effects.ring(p.x, p.z, 5, 0xdff4ff, 0.4, 1.2);
            d.effects.explosion(p.x, p.z, 4.5, color);
            for (const m of d.monsters) {
              if (!m.targetable || Math.hypot(m.x - p.x, m.z - p.z) > 4.8 + m.radius) continue;
              dmg(m, 1.8, 2, p.x, p.z);
              if (m.targetable) m.stun = Math.max(m.stun, m.isBoss ? 0.2 : 1);
            }
            this.host.shake(0.4);
            this.host.sfx('slam');
          });
        }
        break;
      }
      case 'sword:2':
        // 대지 가르기 (A 삼중 파동 · B 균열 폭발)
        player.startAction(
          {
            pose: 'swing',
            combo: 2,
            duration: 0.5,
            hitAt: 0.5,
            onHit: () => {
              this.host.shake(0.25);
              this.host.sfx('slam');
              const f = player.facing;
              const ex = p.x + Math.sin(f) * 1.4;
              const ez = p.z + Math.cos(f) * 1.4;
              d.effects.ring(ex, ez, 2.2, 0xffa24a, 0.3);
              d.effects.sparks(ex, 0.3, ez, 0xffb86a, 14, { speed: 5 });
              d.particles.burst(ex, 0.3, ez, 0x8a6a4a, 12, 1.2);
              this.flair(d, ex, ez, 0xffa24a, tier);
              const col = tier >= 2 ? 0xffc04a : 0xff9a3a;
              const angles = aw === 'A' ? [f - 0.35, f, f + 0.35] : [f];
              for (const a of angles) d.spawnPlayerProjectile({ x: p.x, z: p.z, angle: a, speed: 16, damage: 3 * k * (aw === 'A' ? 0.75 : 1), color: col, kind: 'wave', radius: 0.9, pierce: 99, life: 0.6, knock: 1.5, y: 0.2 });
              if (aw === 'B') {
                // 균열: 지나간 길을 따라 0.7초 뒤 연달아 폭발
                const sx = p.x;
                const sz = p.z;
                for (let i = 1; i <= 5; i++) {
                  const x = sx + Math.sin(f) * i * 1.9;
                  const z = sz + Math.cos(f) * i * 1.9;
                  if (!isFloor(d.grid, Math.floor(x / TILE), Math.floor(z / TILE))) break;
                  d.effects.glyph(x, z, 0.9, 0xff7a2a, 0.7 + i * 0.08);
                  this.repeat(d, 0.7 + i * 0.08, 1, 1, () => {
                    d.effects.explosion(x, z, 1.9, 0xff7a2a);
                    d.particles.burst(x, 0.3, z, 0x6a4a2a, 8, 1.2);
                    around(x, z, 1.9, 1.5, 1);
                    this.host.shake(0.15);
                  });
                }
                this.repeat(d, 0.75, 1, 1, () => this.host.sfx('boom'));
              }
            },
          },
          aim,
        );
        break;
      case 'sword:3':
        // 철벽 태세 (A 가시 갑옷 · B 불굴)
        player.addBuff('ironwall', '철벽', 8 + lv);
        if (aw === 'A') player.addBuff('thorns', '가시 갑옷', 8 + lv);
        if (aw === 'B') player.addBuff('undying', '불굴', 8 + lv);
        d.effects.aura(p.x, p.z, aw === 'B' ? 0xffd84a : 0x7ab4ff);
        d.effects.ring(p.x, p.z, 2, 0x9fc4ff, 0.4);
        this.flair(d, p.x, p.z, 0x7ab4ff, tier);
        this.host.sfx('level');
        break;
      case 'sword:4': {
        // 수호의 방패 (A 반격 방패 · B 방패 돌격)
        const stacks = 3 + Math.floor((lv - 1) / 2);
        const shield = () => {
          player.addBuff('block', '방패', 12, stacks);
          if (aw === 'A') player.addBuff('counter', '반격', 12);
          d.effects.aura(p.x, p.z, 0xffd84a);
          this.flair(d, p.x, p.z, 0xffd84a, tier);
        };
        if (aw === 'B') {
          player.facing = aim;
          const hit = new Set<Monster>();
          player.startDash({
            dirX: Math.sin(aim),
            dirZ: Math.cos(aim),
            speed: 16,
            duration: 0.32,
            pose: 'lunge',
            invuln: true,
            onStep: () => {
              for (const m of d.monsters) {
                if (!m.targetable || hit.has(m) || Math.hypot(m.x - p.x, m.z - p.z) > m.radius + 1.3) continue;
                hit.add(m);
                dmg(m, 1.6, 2.2, p.x, p.z);
                if (m.targetable) m.stun = Math.max(m.stun, m.isBoss ? 0.2 : 1);
                d.effects.ring(m.x, m.z, 1.4, 0xffd84a, 0.3);
              }
            },
            onEnd: shield,
          });
          this.host.sfx('dash');
        } else {
          shield();
          this.host.sfx('level');
        }
        break;
      }
      case 'sword:5': {
        // 전투 함성 (A 공포의 함성 · B 피의 함성)
        player.addBuff('warcry', '함성', 10 + lv);
        if (aw === 'B') player.addBuff('bloodcry', '피의 함성', 10 + lv);
        player.hp = Math.min(player.maxHp, player.hp + player.maxHp * 0.15);
        d.effects.ring(p.x, p.z, 4.5, 0xff5a2a, 0.5);
        d.effects.aura(p.x, p.z, aw === 'B' ? 0xff2a2a : 0xff6a3a);
        d.effects.sparks(p.x, 1, p.z, 0xffa04a, 24, { speed: 7 });
        if (aw === 'A') {
          d.effects.ring(p.x, p.z, 7, 0xffd08a, 0.5, 1.4);
          for (const m of d.monsters) {
            if (!m.targetable || Math.hypot(m.x - p.x, m.z - p.z) > 7 + m.radius) continue;
            m.stun = Math.max(m.stun, m.isBoss ? 0.3 : 1.5);
            m.slow = Math.max(m.slow, 4);
          }
        }
        this.flair(d, p.x, p.z, 0xff6a3a, tier, 1.3);
        this.host.shake(0.2);
        this.host.sfx('boom');
        break;
      }

      // ================= 마법사 =================
      case 'mage:0': {
        // 화염구 (A 세 갈래 · B 불의 장판)
        player.startAction(
          {
            pose: 'cast',
            duration: 0.45,
            hitAt: 0.5,
            onHit: () => {
              this.host.sfx('magic');
              d.effects.glyph(p.x, p.z, 1.3, 0xff7a30, 0.5);
              const angles = aw === 'A' ? [player.facing - 0.3, player.facing, player.facing + 0.3] : [player.facing];
              const mul = aw === 'A' ? 0.7 : 1;
              for (const a of angles)
                d.spawnPlayerProjectile({
                  x: p.x,
                  z: p.z,
                  angle: a,
                  speed: 13,
                  damage: 1.2 * k * mul,
                  color: 0xff7a30,
                  kind: 'orb',
                  radius: 0.45,
                  y: 1.2,
                  onEnd: (x, z) => {
                    d.effects.explosion(x, z, 3, 0xff6a20);
                    d.particles.burst(x, 0.6, z, 0x5a3a2a, 10, 1.3);
                    this.flair(d, x, z, 0xff7a30, tier);
                    this.host.sfx('boom');
                    this.host.shake(0.2);
                    around(x, z, 2.8, 2.4 * mul, 1.3);
                    if (aw === 'B') this.burnZone(d, x, z, 2.6, 4, 0.5 * k, 0xff6a20);
                  },
                });
            },
          },
          aim,
        );
        break;
      }
      case 'mage:1': {
        // 얼음 장판 (A 빙결 장판 · B 얼음 가시)
        const tx = target ? target.x : p.x + fx() * 4;
        const tz = target ? target.z : p.z + fz() * 4;
        player.startAction(
          {
            pose: 'cast',
            duration: 0.45,
            hitAt: 0.5,
            onHit: () => {
              this.host.sfx('ice');
              const duration = 4;
              d.effects.glyph(p.x, p.z, 1.3, 0x7fe0ff, 0.5);
              d.effects.zone(tx, tz, 3, 0x6ad8ff, duration);
              d.effects.ring(tx, tz, 3.2, 0xbff4ff, 0.4);
              d.effects.sparks(tx, 0.4, tz, 0xdff8ff, 20, { speed: 4, spread: 1.5 });
              this.flair(d, tx, tz, 0x7fe0ff, tier);
              if (aw === 'A')
                for (const m of d.monsters) {
                  if (!m.targetable || Math.hypot(m.x - tx, m.z - tz) > 3 + m.radius) continue;
                  m.stun = Math.max(m.stun, m.isBoss ? 0.4 : 1.5);
                  m.frozen = true;
                }
              if (aw === 'B')
                this.repeat(d, 2, 1, 1, () => {
                  for (let i = 0; i < 7; i++) {
                    const a = (i / 7) * Math.PI * 2;
                    const r = i ? 1.6 : 0;
                    d.effects.pillar(tx + Math.cos(a) * r, tz + Math.sin(a) * r, 0xbff4ff, 2.2);
                  }
                  d.effects.sparks(tx, 0.6, tz, 0xdff8ff, 30, { speed: 8, up: true });
                  d.effects.ring(tx, tz, 3.4, 0xdff8ff, 0.4, 1.2);
                  around(tx, tz, 3.2, 4, 1.6);
                  this.host.shake(0.35);
                  this.host.sfx('ice');
                });
              let ticks = 0;
              const tick = () => {
                if (ticks++ >= 8 || this.host.dungeon() !== d) return;
                for (const m of d.monsters) {
                  if (m.targetable && Math.hypot(m.x - tx, m.z - tz) < 3 + m.radius) {
                    m.slow = 0.8;
                    dmg(m, 0.55, 0, tx, tz);
                  }
                }
                window.setTimeout(tick, duration * 125);
              };
              tick();
            },
          },
          aim,
        );
        break;
      }
      case 'mage:2': {
        // 번개 연쇄 (A 무한 연쇄 · B 과부하)
        const jumps = aw === 'A' ? 10 : 5;
        player.startAction(
          {
            pose: 'cast',
            duration: 0.4,
            hitAt: 0.45,
            onHit: () => {
              this.host.sfx('zap');
              d.effects.glyph(p.x, p.z, 1.3, 0xfff06a, 0.45);
              let fromX = p.x;
              let fromZ = p.z;
              const hit: Monster[] = [];
              for (let i = 0; i < jumps; i++) {
                let best: Monster | null = null;
                let bestD = i === 0 ? 10 : aw === 'A' ? 8 : 6;
                for (const m of d.monsters) {
                  if (!m.targetable || hit.includes(m)) continue;
                  const dist = Math.hypot(m.x - fromX, m.z - fromZ);
                  if (dist < bestD) {
                    bestD = dist;
                    best = m;
                  }
                }
                if (!best) break;
                hit.push(best);
                d.effects.bolt(fromX, fromZ, best.x, best.z, tier >= 2 ? 0xfff6c0 : 0xffe24a);
                if (tier >= 1) d.effects.sparks(best.x, 1, best.z, 0xfff06a, 8, { speed: 5 });
                dmg(best, aw === 'A' ? 2.1 : Math.max(0.8, 2.1 - i * 0.2), 0.4, fromX, fromZ);
                fromX = best.x;
                fromZ = best.z;
              }
              this.flair(d, fromX, fromZ, 0xffe24a, tier);
              if (aw === 'B')
                // 과부하: 맞은 적마다 1초 뒤 폭발해 주변을 감전시킨다
                this.repeat(d, 1, 1, 1, () => {
                  for (const m of hit) {
                    const x = m.x;
                    const z = m.z;
                    d.effects.ring(x, z, 2.2, 0xfff06a, 0.3, 1);
                    d.effects.sparks(x, 1, z, 0xfff6c0, 10, { speed: 6 });
                    for (const o of d.monsters) {
                      if (!o.targetable || Math.hypot(o.x - x, o.z - z) > 2.2 + o.radius) continue;
                      dmg(o, 1.3, 0.6, x, z);
                      if (o.targetable) o.stun = Math.max(o.stun, o.isBoss ? 0.1 : 0.4);
                    }
                  }
                  if (hit.length) {
                    this.host.sfx('zap');
                    this.host.shake(0.25);
                  }
                });
            },
          },
          aim,
        );
        break;
      }
      case 'mage:3':
        // 마나 실드 (A 반사 실드 · B 재생 실드)
        player.addBuff('manashield', '마나 실드', 15 + lv * 2);
        if (aw === 'A') player.addBuff('manareflect', '반사', 15 + lv * 2);
        if (aw === 'B') player.addBuff('shieldregen', '재생', 15 + lv * 2);
        d.effects.aura(p.x, p.z, aw === 'B' ? 0x7affb0 : 0x6ab4ff);
        d.effects.ring(p.x, p.z, 1.8, 0xa8d8ff, 0.4, 1);
        this.flair(d, p.x, p.z, 0x6ab4ff, tier);
        this.host.sfx('level');
        break;
      case 'mage:4': {
        // 번개 폭풍 (A 연쇄 낙뢰 · B 뇌운)
        const cloud = aw === 'B';
        const t = cloud ? (target ? { x: target.x, z: target.z } : { x: p.x + fx() * 5, z: p.z + fz() * 5 }) : null;
        const cx = () => (t ? t.x : p.x);
        const cz = () => (t ? t.z : p.z);
        const r = cloud ? 6 : 9;
        player.startAction({ pose: 'cast', duration: 0.4, hitAt: 0.3, onHit: () => {} }, null);
        d.effects.glyph(cx(), cz(), cloud ? 3 : 2.2, 0x9fe8ff, 1);
        d.effects.zone(cx(), cz(), r, cloud ? 0x5a6aa8 : 0x6ab8ff, 2.4);
        this.flair(d, cx(), cz(), 0x9fe8ff, tier, 1.4);
        this.host.sfx('magic');
        const strikes = 8 + lv;
        this.repeat(d, 0.25, 0.22, strikes, () => {
          const near = d.monsters.filter((m) => m.targetable && Math.hypot(m.x - cx(), m.z - cz()) < r + m.radius);
          if (!near.length) return;
          const bolts = cloud ? 2 : 1;
          for (let b = 0; b < bolts && near.length; b++) {
            const m = near.splice(Math.floor(Math.random() * near.length), 1)[0];
            d.effects.bolt(m.x, m.z - 0.01, m.x, m.z, tier >= 2 ? 0xfff6c0 : 0xbfe8ff);
            d.effects.pillar(m.x, m.z, 0x9fe8ff, 3);
            d.effects.sparks(m.x, 0.5, m.z, 0xdff4ff, 8, { speed: 5 });
            dmg(m, 1.5, 0.3, m.x, m.z);
            if (m.targetable) m.stun = Math.max(m.stun, m.isBoss ? 0.1 : cloud ? 0.7 : 0.35);
            // 연쇄 낙뢰: 주변 두 마리에게 옮겨 붙는다
            if (aw === 'A') {
              const next = d.monsters.filter((o) => o !== m && o.targetable && Math.hypot(o.x - m.x, o.z - m.z) < 5).slice(0, 2);
              for (const o of next) {
                d.effects.bolt(m.x, m.z, o.x, o.z, 0xbfe8ff);
                dmg(o, 0.8, 0.2, m.x, m.z);
              }
            }
          }
          this.host.sfx('hit');
        });
        break;
      }
      case 'mage:5': {
        // 마력 순환 (A 마력 폭발 · B 시간 가속)
        player.mp = Math.min(player.maxMp, player.mp + player.maxMp * 0.4);
        player.hp = Math.min(player.maxHp, player.hp + player.maxHp * 0.15);
        player.addBuff('focus', '마력 순환', 10 + lv);
        d.effects.pillar(p.x, p.z, 0x8a6aff, 3.5);
        d.effects.glyph(p.x, p.z, 1.6, 0x5ee0ff, 0.9);
        if (aw === 'A') {
          d.effects.explosion(p.x, p.z, 5, 0x8a6aff);
          d.effects.ring(p.x, p.z, 5.5, 0xc8a8ff, 0.45, 1.2);
          around(p.x, p.z, 5, 2.5, 2.4);
          this.host.shake(0.35);
          this.host.sfx('boom');
        }
        if (aw === 'B') {
          for (let i = 0; i < this.cooldowns.length; i++) if (i !== index) this.cooldowns[i] *= 0.5;
          d.effects.ring(p.x, p.z, 2.4, 0x5ee0ff, 0.5, 1.4);
          d.effects.sparks(p.x, 1, p.z, 0x5ee0ff, 18, { speed: 5, up: true });
        }
        this.flair(d, p.x, p.z, 0x8a6aff, tier);
        this.host.sfx('level');
        break;
      }

      // ================= 궁수 =================
      case 'archer:0':
        // 관통 화살 (A 갈래 화살 · B 저격)
        player.startAction(
          {
            pose: 'shoot',
            duration: aw === 'B' ? 0.6 : 0.45,
            hitAt: 0.6,
            onHit: () => {
              this.host.sfx('bow');
              const f = player.facing;
              if (aw === 'B') {
                d.spawnPlayerProjectile({ x: p.x, z: p.z, angle: f, speed: 40, damage: 2.6 * 2.5 * k, color: 0xffe08a, kind: 'arrow', radius: 0.5, pierce: 0, life: 1, knock: 3, y: 1.1 });
                d.effects.ring(p.x + fx() * 0.8, p.z + fz() * 0.8, 1.8, 0xffe08a, 0.3, 1.2);
                this.host.shake(0.2);
              } else if (aw === 'A') {
                // 첫 적을 맞히면 그 자리에서 두 갈래로 (갈래는 꿰뚫는다)
                d.spawnPlayerProjectile({
                  x: p.x,
                  z: p.z,
                  angle: f,
                  speed: 32,
                  damage: 2.6 * k,
                  color: 0xffd04a,
                  kind: 'arrow',
                  radius: 0.45,
                  pierce: 0,
                  life: 1,
                  knock: 1,
                  y: 1.1,
                  onEnd: (x, z) => {
                    if (!d.monsters.some((m) => m.targetable && Math.hypot(m.x - x, m.z - z) < m.radius + 1.2)) return;
                    d.effects.sparks(x, 1.1, z, 0xffd04a, 10, { speed: 5 });
                    for (const a of [f - 0.4, f + 0.4]) d.spawnPlayerProjectile({ x: x - Math.sin(a) * 0.4, z: z - Math.cos(a) * 0.4, angle: a, speed: 30, damage: 2 * k, color: 0xffe08a, kind: 'arrow', radius: 0.4, pierce: 99, life: 0.8, knock: 0.8, y: 1.1 });
                  },
                });
              } else d.spawnPlayerProjectile({ x: p.x, z: p.z, angle: f, speed: 32, damage: 2.6 * k, color: 0xffd04a, kind: 'arrow', radius: 0.45, pierce: 99, life: 1, knock: 1, y: 1.1 });
              d.effects.ring(p.x + fx() * 0.8, p.z + fz() * 0.8, 1.4, 0xffd04a, 0.25, 1.1);
              d.effects.streak(p.x + fx() * 0.8, p.z + fz() * 0.8, p.x + fx() * 14, p.z + fz() * 14, 0xffd04a, aw === 'B' ? 0.8 : 0.35);
              this.flair(d, p.x + fx() * 1.2, p.z + fz() * 1.2, 0xffd04a, tier, 0.8);
            },
          },
          aim,
        );
        break;
      case 'archer:1': {
        // 부채꼴 연사 (A 이중 연사 · B 집중 연사)
        const volley = () => {
          this.host.sfx('bow');
          d.effects.slash(p.x, p.z, player.facing, 1.6, color, 1.2, 1.1);
          const spread = aw === 'B' ? 0.04 : 0.2;
          for (let i = -2; i <= 2; i++) {
            d.spawnPlayerProjectile({ x: p.x, z: p.z, angle: player.facing + i * spread, speed: 24, damage: 1.1 * k, color: tier >= 2 ? 0xbfffcf : color, kind: 'arrow', radius: 0.3, pierce: aw === 'B' ? 1 : 0, y: 1.1 });
          }
          this.flair(d, p.x + fx() * 1.2, p.z + fz() * 1.2, color, tier, 0.8);
        };
        player.startAction({ pose: 'shoot', duration: aw === 'A' ? 0.6 : 0.4, hitAt: 0.55, onHit: volley }, aim);
        if (aw === 'A') this.repeat(d, 0.5, 1, 1, volley);
        break;
      }
      case 'archer:2':
        // 폭발 화살 (A 집속탄 · B 화염 지대)
        player.startAction(
          {
            pose: 'shoot',
            duration: 0.45,
            hitAt: 0.6,
            onHit: () => {
              this.host.sfx('bow');
              d.spawnPlayerProjectile({
                x: p.x,
                z: p.z,
                angle: player.facing,
                speed: 26,
                damage: 1.4 * k,
                color: 0xff8a3a,
                kind: 'arrow',
                radius: 0.4,
                life: 0.7,
                y: 1.1,
                onEnd: (x, z) => {
                  d.effects.explosion(x, z, 3.2, 0xff7a2a);
                  d.effects.ring(x, z, 3.4, 0xffd08a, 0.35);
                  d.particles.burst(x, 0.6, z, 0x5a3a2a, 12, 1.4);
                  this.flair(d, x, z, 0xff8a3a, tier);
                  this.host.sfx('boom');
                  this.host.shake(0.25);
                  around(x, z, 3, 2.8, 1.4);
                  if (aw === 'A')
                    for (let i = 0; i < 5; i++) {
                      const a = (i / 5) * Math.PI * 2 + Math.random() * 0.5;
                      const r = 2.2 + Math.random() * 1.6;
                      const bx = x + Math.cos(a) * r;
                      const bz = z + Math.sin(a) * r;
                      d.effects.glyph(bx, bz, 0.6, 0xff8a3a, 0.45);
                      this.repeat(d, 0.4 + i * 0.06, 1, 1, () => {
                        d.effects.explosion(bx, bz, 1.8, 0xff7a2a);
                        around(bx, bz, 1.8, 1.2, 0.8);
                      });
                    }
                  if (aw === 'B') this.burnZone(d, x, z, 3, 4, 0.6 * k, 0xff6a20);
                },
              });
              d.effects.streak(p.x + fx() * 0.8, p.z + fz() * 0.8, p.x + fx() * 10, p.z + fz() * 10, 0xff8a3a, 0.3);
            },
          },
          aim,
        );
        break;
      case 'archer:3':
        // 바람 걸음 (A 질풍 · B 바람의 칼날)
        player.addBuff('windwalk', '바람 걸음', 8 + lv);
        if (aw === 'A') {
          player.addBuff('haste', '질풍', 8 + lv);
          player.dodgeStock = player.dodgeCharges;
          player.rollCooldown = 0;
        }
        if (aw === 'B') player.addBuff('windblade', '칼바람', 8 + lv);
        d.effects.aura(p.x, p.z, 0x7affb0);
        this.flair(d, p.x, p.z, 0x7affb0, tier);
        this.host.sfx('dash');
        break;
      case 'archer:4': {
        // 연막탄 (A 독 연막 · B 섬광탄)
        const t = 6 + lv * 0.5;
        player.addBuff('smoke', '연막', t);
        d.effects.zone(p.x, p.z, 4, aw === 'A' ? 0x6a9a4a : 0x8a8a9a, t);
        d.particles.burst(p.x, 0.6, p.z, aw === 'A' ? 0x8ac06a : 0xb0b0c0, 20, 1.5);
        this.flair(d, p.x, p.z, 0xb0b0c0, tier);
        for (const m of d.monsters) if (m.targetable && Math.hypot(m.x - p.x, m.z - p.z) < 6) m.slow = Math.max(m.slow, 4);
        if (aw === 'A') this.burnZone(d, p.x, p.z, 4, t, 0.45 * k, 0x7ac05a, 0.6);
        if (aw === 'B') {
          d.effects.ring(p.x, p.z, 6, 0xffffff, 0.4, 1.4);
          d.effects.sparks(p.x, 1.2, p.z, 0xffffff, 30, { speed: 9 });
          for (const m of d.monsters) if (m.targetable && Math.hypot(m.x - p.x, m.z - p.z) < 6 + m.radius) m.stun = Math.max(m.stun, m.isBoss ? 0.5 : 2);
          this.host.shake(0.2);
        }
        this.host.sfx('boom');
        break;
      }
      case 'archer:5': {
        // 사냥꾼의 집중 (A 약점 포착 · B 사냥 표적)
        player.addBuff('hunter', '집중', 10 + lv);
        if (aw === 'A') player.addBuff('hunt2', '약점 포착', 10 + lv);
        if (aw === 'B') {
          const prey = d.monsters.filter((m) => m.targetable && Math.hypot(m.x - p.x, m.z - p.z) < 16).sort((a, b) => Number(b.isBoss) - Number(a.isBoss) || b.hp - a.hp)[0];
          if (prey) {
            prey.marked = 10;
            d.effects.glyph(prey.x, prey.z, 1.6, 0xff4a4a, 1);
            d.effects.pillar(prey.x, prey.z, 0xff4a4a, 2.4);
          }
        }
        d.effects.aura(p.x, p.z, 0xffc84a);
        this.flair(d, p.x, p.z, 0xffc84a, tier);
        this.host.sfx('level');
        break;
      }
    }
    return null;
  }

  /** 투사체가 몬스터에 맞았을 때 */
  projectileHit(m: Monster, proj: Projectile): void {
    this.host.damageMonster(m, proj.damage, proj.knock, proj.x - proj.vx * 0.05, proj.z - proj.vz * 0.05);
  }
}
