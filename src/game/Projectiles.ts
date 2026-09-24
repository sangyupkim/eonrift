import { AdditiveBlending, Mesh, MeshBasicMaterial, Scene } from 'three';
import { TILE } from '../config';
import { isFloor, type DungeonData } from '../dungeon/generator';
import { buildProjectileMesh } from '../models/monsters';
import type { Monster } from './Monster';

export interface Projectile {
  mesh: Mesh;
  x: number;
  z: number;
  y: number;
  vx: number;
  vz: number;
  radius: number;
  damage: number;
  fromPlayer: boolean;
  /** 관통 가능한 횟수 (0이면 첫 적에서 사라진다) */
  pierce: number;
  hit: Set<Monster>;
  life: number;
  color: number;
  knock: number;
  /** 적에게 맞거나 벽에 부딪혔을 때 (폭발 등) */
  onEnd?: (x: number, z: number) => void;
  kind: 'orb' | 'arrow' | 'shard' | 'wave';
}

export interface ProjectileOptions {
  x: number;
  z: number;
  angle: number;
  speed: number;
  damage: number;
  fromPlayer: boolean;
  color: number;
  kind?: 'orb' | 'arrow' | 'shard' | 'wave';
  radius?: number;
  pierce?: number;
  life?: number;
  knock?: number;
  y?: number;
  onEnd?: (x: number, z: number) => void;
}

export interface ProjectileHost {
  grid: DungeonData;
  monsters: Monster[];
  player: { x: number; z: number };
  playerHit(p: Projectile): void;
  monsterHit(m: Monster, p: Projectile): void;
  burst(x: number, y: number, z: number, color: number, count: number, power?: number): void;
  /** 날아가는 동안 뒤에 남기는 빛 (플레이어 투사체) */
  trail?(x: number, y: number, z: number, color: number, big: boolean): void;
}

export class Projectiles {
  private list: Projectile[] = [];

  constructor(private scene: Scene) {}

  spawn(o: ProjectileOptions): Projectile {
    const mat = new MeshBasicMaterial({ color: o.color, transparent: true, opacity: 0.95, blending: o.kind === 'arrow' ? undefined : AdditiveBlending, depthWrite: false });
    const mesh = buildProjectileMesh(mat, o.kind ?? 'orb');
    if (o.kind === 'arrow') mesh.material = new MeshBasicMaterial({ vertexColors: true });
    const p: Projectile = {
      mesh,
      x: o.x + Math.sin(o.angle) * 0.6,
      z: o.z + Math.cos(o.angle) * 0.6,
      y: o.y ?? 1,
      vx: Math.sin(o.angle) * o.speed,
      vz: Math.cos(o.angle) * o.speed,
      radius: o.radius ?? 0.3,
      damage: o.damage,
      fromPlayer: o.fromPlayer,
      pierce: o.pierce ?? 0,
      hit: new Set(),
      life: o.life ?? 1.6,
      color: o.color,
      knock: o.knock ?? 0.6,
      onEnd: o.onEnd,
      kind: o.kind ?? 'orb',
    };
    if (o.kind === 'wave') mesh.scale.set(1, 1, 1);
    mesh.rotation.y = o.angle;
    mesh.position.set(p.x, p.y, p.z);
    this.scene.add(mesh);
    this.list.push(p);
    return p;
  }

  update(dt: number, host: ProjectileHost): void {
    for (let i = this.list.length - 1; i >= 0; i--) {
      const p = this.list[i];
      p.life -= dt;
      p.x += p.vx * dt;
      p.z += p.vz * dt;
      p.mesh.position.set(p.x, p.y, p.z);
      if (!p.fromPlayer) p.mesh.rotation.x += dt * 8;
      else host.trail?.(p.x, p.y, p.z, p.color, p.kind !== 'arrow');
      let end = p.life <= 0;

      if (!isFloor(host.grid, Math.floor(p.x / TILE), Math.floor(p.z / TILE))) {
        end = true;
        host.burst(p.x - p.vx * 0.02, p.y, p.z - p.vz * 0.02, p.color, 4, 0.5);
      } else if (p.fromPlayer) {
        for (const m of host.monsters) {
          if (!m.alive || p.hit.has(m)) continue;
          if (Math.hypot(m.x - p.x, m.z - p.z) < m.radius + p.radius) {
            p.hit.add(m);
            host.monsterHit(m, p);
            if (p.pierce <= 0) {
              end = true;
              break;
            }
            p.pierce--;
          }
        }
      } else if (Math.hypot(host.player.x - p.x, host.player.z - p.z) < p.radius + 0.4) {
        host.playerHit(p);
        end = true;
      }

      if (end) {
        p.onEnd?.(p.x, p.z);
        this.remove(i);
      }
    }
  }

  private remove(i: number): void {
    const p = this.list[i];
    this.scene.remove(p.mesh);
    p.mesh.geometry.dispose();
    (p.mesh.material as MeshBasicMaterial).dispose();
    this.list.splice(i, 1);
  }

  clear(): void {
    for (let i = this.list.length - 1; i >= 0; i--) this.remove(i);
  }
}
