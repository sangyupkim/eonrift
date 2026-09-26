import { AdditiveBlending, MeshBasicMaterial, NormalBlending } from 'three';
import { PLAYER, TILE } from '../config';
import { isFloor } from '../dungeon/generator';
import { buildProjectileMesh } from '../models/monsters';
import type { BonusKey } from '../data/bonus';
import { AWAKEN_CHARGES, AWAKEN_HOLD_POWER, AWAKEN_ULT_HOLD_POWER, effectTier, type AwakenBranch } from '../data/awaken';
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
  /** 궁극기 충전 (충전형 각성이면 최대 2) */
  ultStock = 1;
  private ultIdx = 0;
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
    {
      const max = this.host.awaken(`u${this.ultIdx}`) === 'A' ? AWAKEN_CHARGES : 1;
      if (this.ultStock > max) this.ultStock = max;
      if (this.ultStock >= max) this.ultCooldown = 0;
      else {
        if (this.ultCooldown <= 0) this.ultCooldown = this.ultCooldownMax;
        this.ultCooldown -= dt;
        if (this.ultCooldown <= 0) {
          this.ultStock++;
          this.ultCooldown = this.ultStock < max ? this.ultCooldownMax : 0;
        }
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

  /** 궁극기 (0/1). 실패 이유를 돌려준다 */
  /** 궁극기를 지금 쓸 수 있는지 (useSkill과 같은 규칙) */
  ultBlock(index: number): string | null {
    const player = this.host.player;
    const ult = ULTIMATES[player.cls.id][index];
    if (!ult) return '궁극기가 없습니다';
    if (!this.host.dungeon()) return '궁극기는 던전에서만 쓸 수 있습니다';
    if (player.buff('silence')) return '침묵 상태라 궁극기를 쓸 수 없습니다';
    if (this.ultStock < 1 || (index !== this.ultIdx && this.ultCooldown > 0)) return '';
    if (!player.canAct && player.state !== 'dash') return '';
    if (player.mp < ult.mp) return 'MP가 부족합니다';
    return null;
  }

  /** 궁극기 (0/1). charge: 집중형 각성에서 모은 정도 (0~1). 실패 이유를 돌려준다 */
  useUlt(index: number, level = 1, charge = 0): string | null {
    const block = this.ultBlock(index);
    if (block !== null) return block || null;
    const player = this.host.player;
    const d = this.host.dungeon();
    const ult = ULTIMATES[player.cls.id][index];
    if (!ult || !d) return null;
    player.mp -= ult.mp;
    // 궁극기를 바꾸면 충전은 1개부터
    if (index !== this.ultIdx) this.ultStock = 1;
    this.ultIdx = index;
    this.ultStock--;
    this.ultCooldownMax = ultCooldown(level);
    if (this.ultCooldown <= 0) this.ultCooldown = this.ultCooldownMax;
    // 집중형 각성: 모을수록 위력 최대 2.5배, 범위 최대 1.5배
    const c = this.host.awaken(`u${index}`) === 'B' ? Math.max(0, Math.min(1, charge)) : 0;
    const R = 1 + 0.5 * c;
    if (c >= 0.99) this.fullCharge(d, player.position.x, player.position.z, COLORS[player.cls.id]);
    const pow = ultPower(level) * (1 + this.host.bonus('ult')) * (1 + (AWAKEN_ULT_HOLD_POWER - 1) * c);
    const p = player.position;
    const target = this.findTarget(14);
    const aim = this.angleTo(target) ?? player.facing;
    // 몬스터가 가장 많이 모인 곳 (범위 궁극기 조준)
    const crowd = (range: number, r: number) => {
      let best = { x: p.x + Math.sin(aim) * 5, z: p.z + Math.cos(aim) * 5, n: 0 };
      for (const m of d.monsters) {
        if (!m.targetable || Math.hypot(m.x - p.x, m.z - p.z) > range) continue;
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
        // 천검난무: 2.4초 동안 칼날 폭풍 (무적)
        player.invulnFor(2.5);
        player.startAction({ pose: 'spin', duration: 2.4, hitAt: 2, moveMult: 0.8, onHit: () => {} }, null);
        d.effects.aura(p.x, p.z, 0x4aa8ff);
        this.host.sfx('level');
        let i = 0;
        this.repeat(d, 0.05, 0.2, 12, () => {
          const col = i++ % 2 ? 0x9fd8ff : 0x4aa8ff;
          d.effects.slash(p.x, p.z, player.facing + i, 3.6 * R, col, Math.PI * 2, 0.7 + (i % 3) * 0.3);
          d.effects.sparks(p.x, 1, p.z, 0xdff4ff, 6, { speed: 6 });
          hitAround(p.x, p.z, 3.8 * R, 1.4, 0.4);
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
        // 대지 붕괴: 뛰어올라 내려찍기 + 기절
        const t = crowd(9, 3);
        const dist = Math.min(8, Math.hypot(t.x - p.x, t.z - p.z));
        const dir = Math.atan2(t.x - p.x, t.z - p.z);
        player.facing = dir;
        player.invulnFor(0.9);
        d.effects.glyph(p.x + Math.sin(dir) * dist, p.z + Math.cos(dir) * dist, 5, 0xffa24a, 0.6);
        player.startDash({
          dirX: Math.sin(dir),
          dirZ: Math.cos(dir),
          speed: Math.max(4, dist / 0.45),
          duration: 0.45,
          pose: 'leap',
          invuln: true,
          onEnd: () => {
            d.effects.explosion(p.x, p.z, 5 * R, 0xff8a2a);
            d.effects.ring(p.x, p.z, 6.5 * R, 0xffd08a, 0.5);
            d.particles.burst(p.x, 0.4, p.z, 0x7a5a3a, 30, 2);
            hitAround(p.x, p.z, 5 * R, 12, 2.2, 2.5);
            this.host.shake(0.8);
            this.host.hitStop(0.12);
            this.host.sfx('slam');
          },
        });
        this.host.sfx('dash');
        break;
      }
      case 'mage:0': {
        // 메테오: 운석 세 개
        const t = crowd(13, 3.2);
        player.startAction({ pose: 'cast', duration: 0.6, hitAt: 0.3, onHit: () => {} }, Math.atan2(t.x - p.x, t.z - p.z));
        d.effects.glyph(p.x, p.z, 1.8, 0xff7a30, 0.9);
        this.host.sfx('magic');
        // 종말의 운석: 모을수록 운석 3 → 최대 7개
        const count = 3 + Math.round(4 * c);
        for (let i = 0; i < count; i++) {
          const a = Math.random() * Math.PI * 2;
          const r = i === 0 ? 0 : 1.5 + Math.random() * (1.5 + c * 2);
          const mx = t.x + Math.cos(a) * r;
          const mz = t.z + Math.sin(a) * r;
          this.repeat(d, i * 0.45, 1, 1, () =>
            d.effects.meteor(mx, mz, 0xff6a20, 0.55, () => {
              if (this.host.dungeon() !== d) return;
              d.effects.explosion(mx, mz, 3.4, 0xff5a1a);
              hitAround(mx, mz, 3.4, 6, 1.6, 0.6);
              this.host.shake(0.45);
              this.host.sfx('boom');
            }),
          );
        }
        break;
      }
      case 'mage:1': {
        // 절대영도: 주변을 얼린다
        player.startAction({ pose: 'cast', duration: 0.5, hitAt: 0.4, onHit: () => {} }, null);
        d.effects.glyph(p.x, p.z, 4, 0x9ff4ff, 1.2);
        d.effects.zone(p.x, p.z, 8 * R, 0x6ad8ff, 3);
        this.repeat(d, 0.35, 1, 1, () => {
          d.effects.ring(p.x, p.z, 9 * R, 0xdff8ff, 0.6);
          d.effects.ring(p.x, p.z, 6 * R, 0x6ad8ff, 0.5);
          d.effects.sparks(p.x, 0.5, p.z, 0xdff8ff, 40, { speed: 9 });
          hitAround(p.x, p.z, 8 * R, 8, 0, 3 * (1 + c), true);
          this.host.shake(0.4);
          this.host.sfx('ice');
        });
        break;
      }
      case 'archer:0': {
        // 화살비
        const t = crowd(13, 4);
        player.startAction({ pose: 'shoot', duration: 0.5, hitAt: 0.5, onHit: () => {} }, Math.atan2(t.x - p.x, t.z - p.z));
        d.effects.arrowRain(t.x, t.z, 4.2 * R, 0x7aff9a, 3.2);
        this.host.sfx('bow');
        this.repeat(d, 0.3, 0.25, 12, () => {
          hitAround(t.x, t.z, 4.2 * R, 0.9, 0.1);
          this.host.sfx('bow');
        });
        break;
      }
      case 'archer:1':
      default: {
        // 용의 사격: 모은 힘으로 거대한 관통 화살
        player.invulnFor(0.7);
        player.startAction({ pose: 'shoot', duration: 0.8, hitAt: 0.75, onHit: () => {} }, aim);
        d.effects.glyph(p.x, p.z, 2, 0xffd04a, 0.8);
        d.effects.sparks(p.x, 1.1, p.z, 0xffd04a, 20, { up: true, spread: 0.6 });
        this.repeat(d, 0.6, 1, 1, () => {
          const f = player.facing;
          d.spawnPlayerProjectile({ x: p.x, z: p.z, angle: f, speed: 30, damage: 14 * pow, color: 0xffc04a, kind: 'wave', radius: 1.5 * R, pierce: 99, life: 0.8, knock: 2, y: 1 });
          d.effects.streak(p.x, p.z, p.x + Math.sin(f) * 24, p.z + Math.cos(f) * 24, 0xffd04a, 2);
          d.effects.ring(p.x + Math.sin(f) * 1.2, p.z + Math.cos(f) * 1.2, 2.5, 0xffd04a, 0.3, 1);
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

  /** 스킬 번호별 최대 충전 수 (충전형 각성이면 2) */
  maxStock(index: number): number {
    return this.host.awaken(`s${index}`) === 'A' ? AWAKEN_CHARGES : 1;
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
   * charge: 집중형 각성에서 모은 정도 (0~1, 3초 = 1)
   */
  useSkill(index: number, charge = 0): string | null {
    const player = this.host.player;
    const skill = player.cls.skills[index];
    const block = this.skillBlock(index);
    if (block !== null) return block || null;
    const d = this.host.dungeon()!;
    const lv = this.host.skillLevel(index);
    const tier = effectTier(lv);
    const c = this.host.awaken(`s${index}`) === 'B' ? Math.max(0, Math.min(1, charge)) : 0;
    const full = c >= 0.99;
    // 스킬 레벨마다 위력 +15%. 집중형은 모은 만큼 위력 최대 3배
    const k = (1 + (lv - 1) * 0.15) * (1 + (AWAKEN_HOLD_POWER - 1) * c);
    const dmg = (m: Monster, mult: number, knock: number, fx: number, fz: number) => this.host.damageMonster(m, mult * k, knock, fx, fz);
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
      // ---- 검사 ----
      case 'sword:0': {
        player.facing = aim;
        const hit = new Set<Monster>();
        const sx = p.x;
        const sz = p.z;
        d.effects.ring(sx, sz, 1.6, color, 0.25);
        // 섬광 돌진: 모을수록 멀리 (최대 2배)
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
              // 끝에서 충격파
              d.effects.explosion(p.x, p.z, 2 + c * 1.5, color);
              for (const m of d.monsters) if (m.targetable && Math.hypot(m.x - p.x, m.z - p.z) < 2.2 + c * 1.5 + m.radius) dmg(m, 1.2, 1.6, p.x, p.z);
              this.host.shake(0.3);
            }
            if (hit.size) this.host.shake(0.2);
          },
        });
        this.host.sfx('dash');
        break;
      }
      case 'sword:1': {
        // 폭풍 회전: 모을수록 범위 최대 1.6배, 주변 적을 끌어당긴다
        const r = 3.2 * (1 + 0.6 * c);
        player.startAction(
          {
            pose: 'spin',
            duration: 0.45,
            hitAt: 0.5,
            moveMult: 0.5,
            onHit: () => {
              d.effects.ring(p.x, p.z, r + 0.4, color, 0.35, 0.3);
              d.effects.slash(p.x, p.z, player.facing, r, color, Math.PI * 2);
              d.effects.slash(p.x, p.z, player.facing + Math.PI, r * 0.75, tier >= 2 ? 0xffe08a : 0xbfe4ff, Math.PI * 2, 1.2);
              this.host.sfx('swing');
              if (c > 0) for (const m of d.monsters) if (m.targetable && Math.hypot(m.x - p.x, m.z - p.z) < r + 3) m.pull(p.x, p.z, 2.5 * c);
              this.arcHit(r, Math.PI * 2, 2.4 * k, 1.4);
              this.flair(d, p.x, p.z, color, tier, 1.3);
            },
          },
          null,
        );
        break;
      }
      case 'sword:2':
        player.startAction(
          {
            pose: 'swing',
            combo: 2,
            duration: 0.5,
            hitAt: 0.5,
            onHit: () => {
              this.host.shake(0.25 + c * 0.3);
              this.host.sfx('slam');
              const ex = p.x + Math.sin(player.facing) * 1.4;
              const ez = p.z + Math.cos(player.facing) * 1.4;
              d.effects.ring(ex, ez, 2.2, 0xffa24a, 0.3);
              d.effects.sparks(ex, 0.3, ez, 0xffb86a, 14, { speed: 5 });
              d.particles.burst(ex, 0.3, ez, 0x8a6a4a, 12, 1.2);
              this.flair(d, ex, ez, 0xffa24a, tier);
              // 대지 절단: 모을수록 굵고 멀리
              d.spawnPlayerProjectile({ x: p.x, z: p.z, angle: player.facing, speed: 16, damage: 3 * k, color: tier >= 2 ? 0xffc04a : 0xff9a3a, kind: 'wave', radius: 0.9 * (1 + c), pierce: 99, life: 0.6 * (1 + c * 0.8), knock: 1.5, y: 0.2 });
            },
          },
          aim,
        );
        break;

      // ---- 마법사 ----
      case 'mage:0': {
        const blast = 3 * (1 + 0.8 * c);
        player.startAction(
          {
            pose: 'cast',
            duration: 0.45,
            hitAt: 0.5,
            onHit: () => {
              this.host.sfx('magic');
              d.effects.glyph(p.x, p.z, 1.3, 0xff7a30, 0.5);
              d.spawnPlayerProjectile({
                x: p.x,
                z: p.z,
                angle: player.facing,
                speed: 13,
                damage: 1.2 * k,
                color: 0xff7a30,
                kind: 'orb',
                radius: 0.45 * (1 + c),
                y: 1.2,
                onEnd: (x, z) => {
                  d.effects.explosion(x, z, blast, 0xff6a20);
                  d.particles.burst(x, 0.6, z, 0x5a3a2a, 10, 1.3);
                  this.flair(d, x, z, 0xff7a30, tier, blast / 3);
                  this.host.sfx('boom');
                  this.host.shake(0.2 + c * 0.3);
                  for (const m of d.monsters) if (m.targetable && Math.hypot(m.x - x, m.z - z) < blast - 0.2 + m.radius) dmg(m, 2.4, 1.3, x, z);
                },
              });
            },
          },
          aim,
        );
        break;
      }
      case 'mage:1': {
        const tx = target ? target.x : p.x + fx() * 4;
        const tz = target ? target.z : p.z + fz() * 4;
        const r = 3 * (1 + 0.8 * c);
        player.startAction(
          {
            pose: 'cast',
            duration: 0.45,
            hitAt: 0.5,
            onHit: () => {
              this.host.sfx('ice');
              const duration = 4;
              d.effects.glyph(p.x, p.z, 1.3, 0x7fe0ff, 0.5);
              d.effects.zone(tx, tz, r, 0x6ad8ff, duration);
              d.effects.ring(tx, tz, r + 0.2, 0xbff4ff, 0.4);
              d.effects.sparks(tx, 0.4, tz, 0xdff8ff, 20, { speed: 4, spread: 1.5 });
              this.flair(d, tx, tz, 0x7fe0ff, tier, r / 3);
              // 영구 동토: 끝까지 모으면 적을 얼린다
              if (full) for (const m of d.monsters) if (m.targetable && Math.hypot(m.x - tx, m.z - tz) < r + m.radius) {
                m.stun = Math.max(m.stun, m.isBoss ? 0.4 : 1.5);
                m.frozen = true;
              }
              let ticks = 0;
              const tick = () => {
                if (ticks++ >= 8 || this.host.dungeon() !== d) return;
                for (const m of d.monsters) {
                  if (m.targetable && Math.hypot(m.x - tx, m.z - tz) < r + m.radius) {
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
        // 천둥 사슬: 모을수록 튀는 횟수 5 → 최대 11
        const jumps = 5 + Math.round(6 * c);
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
              const hit = new Set<Monster>();
              for (let i = 0; i < jumps; i++) {
                let best: Monster | null = null;
                let bestD = i === 0 ? 10 : 6;
                for (const m of d.monsters) {
                  if (!m.targetable || hit.has(m)) continue;
                  const dist = Math.hypot(m.x - fromX, m.z - fromZ);
                  if (dist < bestD) {
                    bestD = dist;
                    best = m;
                  }
                }
                if (!best) break;
                hit.add(best);
                d.effects.bolt(fromX, fromZ, best.x, best.z, tier >= 2 ? 0xfff6c0 : 0xffe24a);
                if (tier >= 1) d.effects.sparks(best.x, 1, best.z, 0xfff06a, 8, { speed: 5 });
                dmg(best, Math.max(0.8, 2.1 - i * 0.2), 0.4, fromX, fromZ);
                fromX = best.x;
                fromZ = best.z;
              }
              this.flair(d, fromX, fromZ, 0xffe24a, tier);
            },
          },
          aim,
        );
        break;
      }

      // ---- 궁수 ----
      case 'archer:0':
        player.startAction(
          {
            pose: 'shoot',
            duration: 0.45,
            hitAt: 0.6,
            onHit: () => {
              this.host.sfx('bow');
              d.spawnPlayerProjectile({ x: p.x, z: p.z, angle: player.facing, speed: 32, damage: 2.6 * k, color: 0xffd04a, kind: 'arrow', radius: 0.45 * (1 + c), pierce: 99, life: 1, knock: 1, y: 1.1 });
              // 붕괴의 화살: 끝까지 모으면 충격파가 함께 나간다
              if (full) d.spawnPlayerProjectile({ x: p.x, z: p.z, angle: player.facing, speed: 28, damage: 2 * k, color: 0xffe08a, kind: 'wave', radius: 1.2, pierce: 99, life: 0.8, knock: 2, y: 1 });
              d.effects.ring(p.x + fx() * 0.8, p.z + fz() * 0.8, 1.4, 0xffd04a, 0.25, 1.1);
              d.effects.streak(p.x + fx() * 0.8, p.z + fz() * 0.8, p.x + fx() * 14, p.z + fz() * 14, 0xffd04a, 0.35 + c * 0.6);
              this.flair(d, p.x + fx() * 1.2, p.z + fz() * 1.2, 0xffd04a, tier, 0.8);
            },
          },
          aim,
        );
        break;
      case 'archer:1': {
        // 화살 폭풍: 모을수록 5발 → 최대 11발 (한 발 위력은 절반만 오른다)
        const n = 2 + Math.round(3 * c);
        const per = 1.1 * (1 + (lv - 1) * 0.15) * (1 + c);
        player.startAction(
          {
            pose: 'shoot',
            duration: 0.4,
            hitAt: 0.55,
            onHit: () => {
              this.host.sfx('bow');
              d.effects.slash(p.x, p.z, player.facing, 1.6, color, 1.2, 1.1);
              for (let i = -n; i <= n; i++) {
                d.spawnPlayerProjectile({ x: p.x, z: p.z, angle: player.facing + i * (0.4 / Math.max(2, n)), speed: 24, damage: per, color: tier >= 2 ? 0xbfffcf : color, kind: 'arrow', radius: 0.3, y: 1.1 });
              }
              this.flair(d, p.x + fx() * 1.2, p.z + fz() * 1.2, color, tier, 0.8);
            },
          },
          aim,
        );
        break;
      }
      case 'archer:2': {
        const blast = 3 * (1 + 0.8 * c);
        // 폭발 화살: 첫 적에 맞거나 사거리 끝에서 터진다
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
                  d.effects.explosion(x, z, blast + 0.2, 0xff7a2a);
                  d.effects.ring(x, z, blast + 0.4, 0xffd08a, 0.35);
                  d.particles.burst(x, 0.6, z, 0x5a3a2a, 12, 1.4);
                  this.flair(d, x, z, 0xff8a3a, tier, blast / 3);
                  this.host.sfx('boom');
                  this.host.shake(0.25 + c * 0.3);
                  for (const m of d.monsters) if (m.targetable && Math.hypot(m.x - x, m.z - z) < blast + m.radius) dmg(m, 2.8, 1.4, x, z);
                },
              });
              d.effects.streak(p.x + fx() * 0.8, p.z + fz() * 0.8, p.x + fx() * 10, p.z + fz() * 10, 0xff8a3a, 0.3);
            },
          },
          aim,
        );
        break;
      }

      // ---- 방어·보조 스킬 (집중형: 모을수록 지속 최대 2배) ----
      case 'sword:3':
        player.addBuff('ironwall', '철벽', (8 + lv) * (1 + c));
        if (full) player.hp = Math.min(player.maxHp, player.hp + player.maxHp * 0.2);
        d.effects.aura(p.x, p.z, 0x7ab4ff);
        d.effects.ring(p.x, p.z, 2, 0x9fc4ff, 0.4);
        this.flair(d, p.x, p.z, 0x7ab4ff, tier);
        this.host.sfx('level');
        break;
      case 'sword:4':
        player.addBuff('block', '방패', 12, 3 + Math.floor((lv - 1) / 2) + Math.round(3 * c));
        d.effects.aura(p.x, p.z, 0xffd84a);
        this.flair(d, p.x, p.z, 0xffd84a, tier);
        this.host.sfx('level');
        break;
      case 'sword:5':
        player.addBuff('warcry', '함성', (10 + lv) * (1 + c));
        player.hp = Math.min(player.maxHp, player.hp + player.maxHp * (full ? 0.4 : 0.15));
        d.effects.ring(p.x, p.z, 4.5, 0xff5a2a, 0.5);
        d.effects.aura(p.x, p.z, 0xff6a3a);
        d.effects.sparks(p.x, 1, p.z, 0xffa04a, 24, { speed: 7 });
        this.flair(d, p.x, p.z, 0xff6a3a, tier, 1.3);
        this.host.shake(0.2);
        this.host.sfx('boom');
        break;
      case 'mage:3':
        player.addBuff('manashield', '마나 실드', (15 + lv * 2) * (1 + c));
        d.effects.aura(p.x, p.z, 0x6ab4ff);
        d.effects.ring(p.x, p.z, 1.8, 0xa8d8ff, 0.4, 1);
        this.flair(d, p.x, p.z, 0x6ab4ff, tier);
        this.host.sfx('level');
        break;
      case 'mage:4': {
        // 번개 폭풍: 2초 동안 주변 적에게 번개가 여러 번 떨어진다 (맞은 적은 잠깐 감전). 뇌신의 폭풍: 낙뢰 수 최대 2배·범위 1.5배
        const r = 9 * (1 + 0.5 * c);
        player.startAction({ pose: 'cast', duration: 0.4, hitAt: 0.3, onHit: () => {} }, null);
        d.effects.glyph(p.x, p.z, 2.2, 0x9fe8ff, 1);
        d.effects.zone(p.x, p.z, r, 0x6ab8ff, 2.2);
        this.flair(d, p.x, p.z, 0x9fe8ff, tier, 1.4);
        this.host.sfx('magic');
        const strikes = Math.round((8 + lv) * (1 + c));
        this.repeat(d, 0.25, 0.22 / (1 + c), strikes, () => {
          const near = d.monsters.filter((m) => m.targetable && Math.hypot(m.x - p.x, m.z - p.z) < r + m.radius);
          if (!near.length) return;
          const m = near[Math.floor(Math.random() * near.length)];
          d.effects.bolt(m.x, m.z - 0.01, m.x, m.z, tier >= 2 ? 0xfff6c0 : 0xbfe8ff);
          d.effects.pillar(m.x, m.z, 0x9fe8ff, 3);
          d.effects.sparks(m.x, 0.5, m.z, 0xdff4ff, 8, { speed: 5 });
          dmg(m, 1.5, 0.3, m.x, m.z);
          if (m.targetable) m.stun = Math.max(m.stun, m.isBoss ? 0.1 : 0.35);
          this.host.sfx('hit');
        });
        break;
      }
      case 'mage:5':
        // 마력 폭주: 모을수록 MP 회복 40% → 최대 100%
        player.mp = Math.min(player.maxMp, player.mp + player.maxMp * (0.4 + 0.6 * c));
        player.hp = Math.min(player.maxHp, player.hp + player.maxHp * 0.15);
        player.addBuff('focus', '마력 순환', (10 + lv) * (1 + c));
        d.effects.pillar(p.x, p.z, 0x8a6aff, 3.5);
        d.effects.glyph(p.x, p.z, 1.6, 0x5ee0ff, 0.9);
        this.flair(d, p.x, p.z, 0x8a6aff, tier);
        this.host.sfx('level');
        break;
      case 'archer:3':
        player.addBuff('windwalk', '바람 걸음', (8 + lv) * (1 + c));
        d.effects.aura(p.x, p.z, 0x7affb0);
        this.flair(d, p.x, p.z, 0x7affb0, tier);
        this.host.sfx('dash');
        break;
      case 'archer:4': {
        const r = 4 * (1 + c);
        const t = (6 + lv * 0.5) * (1 + c);
        player.addBuff('smoke', '연막', t);
        d.effects.zone(p.x, p.z, r, 0x8a8a9a, t);
        d.particles.burst(p.x, 0.6, p.z, 0xb0b0c0, 20, 1.5);
        this.flair(d, p.x, p.z, 0xb0b0c0, tier, r / 4);
        for (const m of d.monsters) if (m.targetable && Math.hypot(m.x - p.x, m.z - p.z) < r + 2) m.slow = Math.max(m.slow, 4);
        this.host.sfx('boom');
        break;
      }
      case 'archer:5':
        player.addBuff('hunter', '집중', (10 + lv) * (1 + c));
        d.effects.aura(p.x, p.z, 0xffc84a);
        this.flair(d, p.x, p.z, 0xffc84a, tier);
        this.host.sfx('level');
        break;
    }
    return null;
  }

  /** 투사체가 몬스터에 맞았을 때 */
  projectileHit(m: Monster, proj: Projectile): void {
    this.host.damageMonster(m, proj.damage, proj.knock, proj.x - proj.vx * 0.05, proj.z - proj.vz * 0.05);
  }
}
