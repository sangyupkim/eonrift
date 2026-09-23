import { PLAYER } from '../config';
import type { ClassId } from '../data/classes';
import type { Monster } from './Monster';
import type { Player } from './Player';
import type { Stats } from './Progress';
import type { Projectile } from './Projectiles';
import type { DungeonScene, NodeInstance } from './scenes/DungeonScene';
import type { Level } from './scenes/Level';

export interface CombatHost {
  player: Player;
  stats: () => Stats;
  level: () => Level;
  dungeon: () => DungeonScene | null;
  /** 몬스터에게 피해 (치명타·방어 계산 포함) */
  damageMonster: (m: Monster, mult: number, knock: number, fromX: number, fromZ: number) => void;
  gather: (node: NodeInstance) => void;
  shake: (a: number) => void;
  hitStop: (t: number) => void;
  sfx: (name: string) => void;
}

type Target = { kind: 'monster'; m: Monster; x: number; z: number } | { kind: 'node'; n: NodeInstance; x: number; z: number };

const COLORS: Record<ClassId, number> = { sword: 0xdfefff, mage: 0x9fe8ff, archer: 0xc8ffb0 };

/** 공격과 스킬의 실제 판정 */
export class Combat {
  private combo = 0;
  private comboTimer = 0;
  cooldowns = [0, 0, 0];

  constructor(private host: CombatHost) {}

  update(dt: number): void {
    this.comboTimer = Math.max(0, this.comboTimer - dt);
    if (this.comboTimer === 0) this.combo = 0;
    for (let i = 0; i < 3; i++) this.cooldowns[i] = Math.max(0, this.cooldowns[i] - dt);
  }

  /** 자동 조준: 사거리 안의 가장 가까운 몬스터, 없으면 가까운 채집물 */
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
    if (best) return best;
    bestD = PLAYER.autoAimRange;
    for (const n of d.nodes) {
      if (!n.alive || n.dying > 0) continue;
      const dist = Math.hypot(n.x - p.x, n.z - p.z) - n.def.radius;
      if (dist < bestD) {
        bestD = dist;
        best = { kind: 'node', n, x: n.x, z: n.z };
      }
    }
    return best;
  }

  private angleTo(t: Target | null): number | null {
    if (!t) return null;
    const p = this.host.player.position;
    return Math.atan2(t.x - p.x, t.z - p.z);
  }

  /** 부채꼴 안의 몬스터와 채집물을 친다 */
  private arcHit(range: number, angle: number, mult: number, knock: number, hitNodes = true): number {
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
    if (hitNodes) {
      for (const n of d.nodes) {
        if (n.alive && n.dying === 0 && inArc(n.x, n.z, n.def.radius)) {
          this.host.gather(n);
          hits++;
        }
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

    // 채집물이 목표면 어느 직업이든 가까이서 두드린다
    if (target?.kind === 'node' || cls === 'sword' || !this.host.dungeon()) {
      const combo = cls === 'sword' ? this.combo : 0;
      const big = combo === 2;
      player.startAction(
        {
          pose: cls === 'sword' ? 'swing' : 'thrust',
          combo,
          duration: player.cls.attackTime * (big ? 1.35 : 1),
          hitAt: 0.45,
          onHit: () => {
            const range = big ? 2.9 : 2.3;
            level.effects.slash(player.position.x, player.position.z, player.facing, range, color, big ? 3 : 2.2);
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
          duration: player.cls.attackTime,
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
          duration: player.cls.attackTime,
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
    if (!d) return '스킬은 던전에서만 쓸 수 있습니다';
    if (this.cooldowns[index] > 0) return null;
    if (!player.canAct && player.state !== 'dash') return null;
    if (player.mp < skill.mp) return 'MP가 부족합니다';
    player.mp -= skill.mp;
    this.cooldowns[index] = skill.cooldown;
    const p = player.position;
    const target = this.findTarget(12);
    const aim = this.angleTo(target) ?? player.facing;
    const color = COLORS[player.cls.id];
    const fx = () => Math.sin(player.facing);
    const fz = () => Math.cos(player.facing);

    switch (`${player.cls.id}:${index}`) {
      // ---- 검사 ----
      case 'sword:0': {
        player.facing = aim;
        const hit = new Set<Monster>();
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
                this.host.damageMonster(m, 2.2, 1.2, p.x, p.z);
                d.effects.slash(m.x, m.z, player.facing + Math.PI / 2, 1.6, color, 1.6);
              }
            }
          },
          onEnd: () => {
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
              d.effects.ring(p.x, p.z, 3.4, color, 0.3, 0.8);
              d.effects.slash(p.x, p.z, player.facing, 3.2, color, Math.PI * 2);
              this.host.sfx('swing');
              this.arcHit(3.2, Math.PI * 2, 2.4, 1.4);
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
              d.spawnPlayerProjectile({ x: p.x, z: p.z, angle: player.facing, speed: 16, damage: 3, color, kind: 'wave', radius: 0.9, pierce: 99, life: 0.6, knock: 1.5, y: 0.2 });
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
              d.spawnPlayerProjectile({
                x: p.x,
                z: p.z,
                angle: player.facing,
                speed: 13,
                damage: 1.2,
                color: 0xff7a30,
                kind: 'orb',
                radius: 0.45,
                y: 1.2,
                onEnd: (x, z) => {
                  d.effects.ring(x, z, 3, 0xff8a40, 0.35);
                  d.particles.burst(x, 0.6, z, 0xff8a40, 14, 1.3);
                  this.host.sfx('boom');
                  this.host.shake(0.2);
                  for (const m of d.monsters) if (m.alive && Math.hypot(m.x - x, m.z - z) < 2.8 + m.radius) this.host.damageMonster(m, 2.4, 1.3, x, z);
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
              d.effects.zone(tx, tz, 3, 0x9fe8ff, duration);
              let ticks = 0;
              const tick = () => {
                if (ticks++ >= 8 || this.host.dungeon() !== d) return;
                for (const m of d.monsters) {
                  if (m.alive && Math.hypot(m.x - tx, m.z - tz) < 3 + m.radius) {
                    m.slow = 0.8;
                    this.host.damageMonster(m, 0.55, 0, tx, tz);
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
                d.effects.bolt(fromX, fromZ, best.x, best.z, 0xd8f0ff);
                this.host.damageMonster(best, 2.1 - i * 0.2, 0.4, fromX, fromZ);
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
              d.spawnPlayerProjectile({ x: p.x, z: p.z, angle: player.facing, speed: 32, damage: 2.6, color: 0xffe08a, kind: 'arrow', radius: 0.45, pierce: 99, life: 1, knock: 1, y: 1.1 });
              d.effects.ring(p.x + fx() * 0.8, p.z + fz() * 0.8, 1.2, 0xffe08a, 0.2, 1.1);
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
              for (let i = -2; i <= 2; i++) {
                d.spawnPlayerProjectile({ x: p.x, z: p.z, angle: player.facing + i * 0.2, speed: 24, damage: 1.1, color, kind: 'arrow', radius: 0.3, y: 1.1 });
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
        d.effects.zone(tx, tz, 1.2, 0xffd060, 1.2);
        player.startDash({ dirX: -Math.sin(aim), dirZ: -Math.cos(aim), speed: 14, duration: 0.35, pose: 'leap', invuln: true });
        this.host.sfx('dash');
        window.setTimeout(() => {
          if (this.host.dungeon() !== d) return;
          d.effects.ring(tx, tz, 3.2, 0xffb040, 0.35);
          d.particles.burst(tx, 0.4, tz, 0xffb040, 16, 1.3);
          this.host.sfx('boom');
          this.host.shake(0.2);
          for (const m of d.monsters) if (m.alive && Math.hypot(m.x - tx, m.z - tz) < 3 + m.radius) this.host.damageMonster(m, 3, 1.5, tx, tz);
        }, 1200);
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
