import type { ClassId } from '../data/classes';
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
  /** true: 가까운 적에게 자동 조준 · false: 바라보는 방향으로 */
  autoAim: () => boolean;
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

  constructor(private host: CombatHost) {}

  update(dt: number): void {
    this.comboTimer = Math.max(0, this.comboTimer - dt);
    if (this.comboTimer === 0) this.combo = 0;
    for (let i = 0; i < this.cooldowns.length; i++) this.cooldowns[i] = Math.max(0, this.cooldowns[i] - dt);
  }

  /** 자동 조준: 사거리 안의 가장 가까운 몬스터 */
  findTarget(range: number): Target | null {
    const p = this.host.player.position;
    const d = this.host.dungeon();
    if (!d) return null;
    let best: Target | null = null;
    let bestD = range;
    for (const m of d.monsters) {
      if (!m.alive) continue;
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
      if (m.alive && inArc(m.x, m.z, m.radius)) {
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
    // 검사이거나 던전 밖이면 근접 휘두르기
    if (cls === 'sword' || !this.host.dungeon()) {
      const combo = cls === 'sword' ? this.combo : 0;
      const big = combo === 2;
      player.startAction(
        {
          pose: cls === 'sword' ? 'swing' : 'thrust',
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
      if (cls === 'sword') {
        this.combo = (this.combo + 1) % 3;
        this.comboTimer = 0.9;
      }
      return;
    }

    const d = this.host.dungeon()!;
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

  /** 스킬 사용. 실패 이유를 문자열로 돌려준다 */
  useSkill(index: number): string | null {
    const player = this.host.player;
    const skill = player.cls.skills[index];
    const d = this.host.dungeon();
    const lv = this.host.skillLevel(index);
    if (lv <= 0) return `${skill.name}: 아직 배우지 않았습니다 (마을의 교관 카엘)`;
    if (!d) return '스킬은 던전에서만 쓸 수 있습니다';
    if (player.buff('silence')) return '침묵 상태라 스킬을 쓸 수 없습니다';
    // 스킬 레벨마다 위력 +15%, 재사용 대기 -6%
    const k = 1 + (lv - 1) * 0.15;
    const dmg = (m: Monster, mult: number, knock: number, fx: number, fz: number) => this.host.damageMonster(m, mult * k, knock, fx, fz);
    if (this.cooldowns[index] > 0) return null;
    if (!player.canAct && player.state !== 'dash') return null;
    if (player.mp < skill.mp) return 'MP가 부족합니다';
    player.mp -= skill.mp;
    this.cooldowns[index] = skill.cooldown * (1 - (lv - 1) * 0.06);
    const p = player.position;
    // 설정에서 '바라보는 방향'을 고르면 스킬은 자동 조준 없이 캐릭터가 보는 쪽으로 나간다
    const target = this.host.autoAim() ? this.findTarget(12) : null;
    const aim = this.angleTo(target) ?? player.facing;
    const color = COLORS[player.cls.id];
    const fx = () => Math.sin(player.facing);
    const fz = () => Math.cos(player.facing);

    switch (`${player.cls.id}:${index}`) {
      // ---- 검사 ----
      case 'sword:0': {
        player.facing = aim;
        const hit = new Set<Monster>();
        const sx = p.x;
        const sz = p.z;
        d.effects.ring(sx, sz, 1.6, color, 0.25);
        player.startDash({
          dirX: Math.sin(aim),
          dirZ: Math.cos(aim),
          speed: 20,
          duration: 0.28,
          pose: 'lunge',
          invuln: true,
          onStep: () => {
            for (const m of d.monsters) {
              if (m.alive && !hit.has(m) && Math.hypot(m.x - p.x, m.z - p.z) < m.radius + 1.3) {
                hit.add(m);
                dmg(m, 2.2, 1.2, p.x, p.z);
                d.effects.slash(m.x, m.z, player.facing + Math.PI / 2, 1.6, color, 1.6);
                d.effects.sparks(m.x, 1, m.z, 0xffffff, 8, { speed: 5 });
              }
            }
          },
          onEnd: () => {
            d.effects.streak(sx, sz, p.x, p.z, color, 1.1);
            if (hit.size) this.host.shake(0.2);
          },
        });
        this.host.sfx('dash');
        break;
      }
      case 'sword:1':
        player.startAction(
          {
            pose: 'spin',
            duration: 0.45,
            hitAt: 0.5,
            moveMult: 0.5,
            onHit: () => {
              d.effects.ring(p.x, p.z, 3.6, color, 0.35, 0.3);
              d.effects.slash(p.x, p.z, player.facing, 3.2, color, Math.PI * 2);
              d.effects.slash(p.x, p.z, player.facing + Math.PI, 2.4, 0xbfe4ff, Math.PI * 2, 1.2);
              this.host.sfx('swing');
              this.arcHit(3.2, Math.PI * 2, 2.4 * k, 1.4);
            },
          },
          null,
        );
        break;
      case 'sword:2':
        player.startAction(
          {
            pose: 'swing',
            combo: 2,
            duration: 0.5,
            hitAt: 0.5,
            onHit: () => {
              this.host.shake(0.25);
              this.host.sfx('slam');
              const ex = p.x + Math.sin(player.facing) * 1.4;
              const ez = p.z + Math.cos(player.facing) * 1.4;
              d.effects.ring(ex, ez, 2.2, 0xffa24a, 0.3);
              d.effects.sparks(ex, 0.3, ez, 0xffb86a, 14, { speed: 5 });
              d.particles.burst(ex, 0.3, ez, 0x8a6a4a, 12, 1.2);
              d.spawnPlayerProjectile({ x: p.x, z: p.z, angle: player.facing, speed: 16, damage: 3 * k, color: 0xff9a3a, kind: 'wave', radius: 0.9, pierce: 99, life: 0.6, knock: 1.5, y: 0.2 });
            },
          },
          aim,
        );
        break;

      // ---- 마법사 ----
      case 'mage:0':
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
                radius: 0.45,
                y: 1.2,
                onEnd: (x, z) => {
                  d.effects.explosion(x, z, 3, 0xff6a20);
                  d.particles.burst(x, 0.6, z, 0x5a3a2a, 10, 1.3);
                  this.host.sfx('boom');
                  this.host.shake(0.2);
                  for (const m of d.monsters) if (m.alive && Math.hypot(m.x - x, m.z - z) < 2.8 + m.radius) dmg(m, 2.4, 1.3, x, z);
                },
              });
            },
          },
          aim,
        );
        break;
      case 'mage:1': {
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
              let ticks = 0;
              const tick = () => {
                if (ticks++ >= 8 || this.host.dungeon() !== d) return;
                for (const m of d.monsters) {
                  if (m.alive && Math.hypot(m.x - tx, m.z - tz) < 3 + m.radius) {
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
      case 'mage:2':
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
              for (let i = 0; i < 5; i++) {
                let best: Monster | null = null;
                let bestD = i === 0 ? 10 : 6;
                for (const m of d.monsters) {
                  if (!m.alive || hit.has(m)) continue;
                  const dist = Math.hypot(m.x - fromX, m.z - fromZ);
                  if (dist < bestD) {
                    bestD = dist;
                    best = m;
                  }
                }
                if (!best) break;
                hit.add(best);
                d.effects.bolt(fromX, fromZ, best.x, best.z, 0xffe24a);
                dmg(best, 2.1 - i * 0.2, 0.4, fromX, fromZ);
                fromX = best.x;
                fromZ = best.z;
              }
            },
          },
          aim,
        );
        break;

      // ---- 궁수 ----
      case 'archer:0':
        player.startAction(
          {
            pose: 'shoot',
            duration: 0.45,
            hitAt: 0.6,
            onHit: () => {
              this.host.sfx('bow');
              d.spawnPlayerProjectile({ x: p.x, z: p.z, angle: player.facing, speed: 32, damage: 2.6 * k, color: 0xffd04a, kind: 'arrow', radius: 0.45, pierce: 99, life: 1, knock: 1, y: 1.1 });
              d.effects.ring(p.x + fx() * 0.8, p.z + fz() * 0.8, 1.4, 0xffd04a, 0.25, 1.1);
              d.effects.streak(p.x + fx() * 0.8, p.z + fz() * 0.8, p.x + fx() * 14, p.z + fz() * 14, 0xffd04a, 0.35);
            },
          },
          aim,
        );
        break;
      case 'archer:1':
        player.startAction(
          {
            pose: 'shoot',
            duration: 0.4,
            hitAt: 0.55,
            onHit: () => {
              this.host.sfx('bow');
              d.effects.slash(p.x, p.z, player.facing, 1.6, color, 1.2, 1.1);
              for (let i = -2; i <= 2; i++) {
                d.spawnPlayerProjectile({ x: p.x, z: p.z, angle: player.facing + i * 0.2, speed: 24, damage: 1.1 * k, color, kind: 'arrow', radius: 0.3, y: 1.1 });
              }
            },
          },
          aim,
        );
        break;
      case 'archer:2': {
        // 적 반대쪽으로 뛰며 덫을 남긴다
        player.facing = aim;
        const tx = p.x;
        const tz = p.z;
        d.effects.zone(tx, tz, 1.2, 0xffb040, 1.2);
        d.effects.glyph(tx, tz, 1.2, 0xffb040, 1.2);
        player.startDash({ dirX: -Math.sin(aim), dirZ: -Math.cos(aim), speed: 14, duration: 0.35, pose: 'leap', invuln: true });
        this.host.sfx('dash');
        window.setTimeout(() => {
          if (this.host.dungeon() !== d) return;
          d.effects.explosion(tx, tz, 3, 0xff8a2a);
          d.particles.burst(tx, 0.4, tz, 0x6a4a2a, 12, 1.3);
          this.host.sfx('boom');
          this.host.shake(0.2);
          for (const m of d.monsters) if (m.alive && Math.hypot(m.x - tx, m.z - tz) < 3 + m.radius) dmg(m, 3, 1.5, tx, tz);
        }, 1200);
        break;
      }

      // ---- 방어·보조 스킬 ----
      case 'sword:3':
        player.addBuff('ironwall', '철벽', 8 + lv);
        d.effects.aura(p.x, p.z, 0x7ab4ff);
        d.effects.ring(p.x, p.z, 2, 0x9fc4ff, 0.4);
        this.host.sfx('level');
        break;
      case 'sword:4':
        player.addBuff('block', '방패', 12, 3 + Math.floor((lv - 1) / 2));
        d.effects.aura(p.x, p.z, 0xffd84a);
        this.host.sfx('level');
        break;
      case 'sword:5':
        player.addBuff('warcry', '함성', 10 + lv);
        player.hp = Math.min(player.maxHp, player.hp + player.maxHp * 0.15);
        d.effects.ring(p.x, p.z, 4.5, 0xff5a2a, 0.5);
        d.effects.aura(p.x, p.z, 0xff6a3a);
        d.effects.sparks(p.x, 1, p.z, 0xffa04a, 24, { speed: 7 });
        this.host.shake(0.2);
        this.host.sfx('boom');
        break;
      case 'mage:3':
        player.addBuff('manashield', '마나 실드', 15 + lv * 2);
        d.effects.aura(p.x, p.z, 0x6ab4ff);
        d.effects.ring(p.x, p.z, 1.8, 0xa8d8ff, 0.4, 1);
        this.host.sfx('level');
        break;
      case 'mage:4': {
        // 점멸: 보는 방향으로 빠르게 미끄러지며 무적
        const dir = target ? aim : player.facing;
        const bx = p.x;
        const bz = p.z;
        d.effects.sparks(bx, 1, bz, 0xc8a8ff, 18, { speed: 4, up: true, spread: 0.5 });
        d.effects.ring(bx, bz, 1.4, 0xa070ff, 0.25, 0.8);
        player.startDash({
          dirX: Math.sin(dir),
          dirZ: Math.cos(dir),
          speed: 40,
          duration: 0.14 + lv * 0.01,
          pose: 'leap',
          invuln: true,
          onEnd: () => {
            d.effects.streak(bx, bz, p.x, p.z, 0xa070ff, 0.7);
            d.effects.ring(p.x, p.z, 1.6, 0xc8a8ff, 0.3, 0.8);
            d.effects.sparks(p.x, 1, p.z, 0xc8a8ff, 14, { speed: 4 });
          },
        });
        this.host.sfx('dash');
        break;
      }
      case 'mage:5':
        player.mp = Math.min(player.maxMp, player.mp + player.maxMp * 0.4);
        player.hp = Math.min(player.maxHp, player.hp + player.maxHp * 0.15);
        player.addBuff('focus', '마력 순환', 10 + lv);
        d.effects.pillar(p.x, p.z, 0x8a6aff, 3.5);
        d.effects.glyph(p.x, p.z, 1.6, 0x5ee0ff, 0.9);
        this.host.sfx('level');
        break;
      case 'archer:3':
        player.addBuff('windwalk', '바람 걸음', 8 + lv);
        d.effects.aura(p.x, p.z, 0x7affb0);
        this.host.sfx('dash');
        break;
      case 'archer:4':
        player.addBuff('smoke', '연막', 6 + lv * 0.5);
        d.effects.zone(p.x, p.z, 4, 0x8a8a9a, 6 + lv * 0.5);
        d.particles.burst(p.x, 0.6, p.z, 0xb0b0c0, 20, 1.5);
        for (const m of d.monsters) if (m.alive && Math.hypot(m.x - p.x, m.z - p.z) < 6) m.slow = Math.max(m.slow, 4);
        this.host.sfx('boom');
        break;
      case 'archer:5':
        player.addBuff('hunter', '집중', 10 + lv);
        d.effects.aura(p.x, p.z, 0xffc84a);
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
