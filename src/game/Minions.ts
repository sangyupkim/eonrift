import { AdditiveBlending, Color, DoubleSide, Mesh, MeshBasicMaterial, MeshLambertMaterial, RingGeometry, type Scene } from 'three';
import { TILE } from '../config';
import { isFloor } from '../dungeon/generator';
import type { SpeciesDef } from '../data/species';
import { buildMonster, type MonsterRig } from '../models/monsters';
import type { Monster } from './Monster';
import type { DungeonScene } from './scenes/DungeonScene';

/**
 * 차원 소환사의 소환수 (v10). 몬스터 모습을 빌려 오지만 플레이어 편에서 싸운다.
 * 소환수는 피해를 받지 않고, 정해진 시간이 지나면 사라진다. 플레이어가 마지막으로 맞힌 적을 먼저 노린다.
 */
export interface MinionSpec {
  species: SpeciesDef;
  /** 원거리: 마력탄을 쏜다 */
  ranged: boolean;
  /** 위력 (플레이어 공격력 배율에 곱한다) */
  power: number;
  /** 머무는 시간 (초) */
  duration: number;
  /** 몸집 */
  size?: number;
  /** 제자리에서만 쏜다 (차원 포대) */
  stationary?: boolean;
  /** 공격 간격 배율 (작을수록 빠르다) */
  rate?: number;
  /** 마력탄이 튀는 수 (연쇄 사격) */
  bounce?: number;
  /** 내려찍기 (수문장): 주변을 크게 친다 */
  slam?: boolean;
  /** 한도에 세지 않는다 (궁극기로 부른 것) */
  extra?: boolean;
  /** 거대 소환 (하나까지) */
  giant?: boolean;
  /** 사라질 때 폭발 (포탈 붕괴) */
  finale?: number;
  color: number;
}

export interface MinionHost {
  level: DungeonScene;
  player: { x: number; z: number };
  /** 플레이어가 마지막으로 맞힌 적 */
  focus: Monster | null;
  /** 몬스터에게 피해 (소환수 위력 포함 배율) */
  damage: (m: Monster, mult: number, knock: number, fx: number, fz: number) => void;
  /** 공격 속도 배율 (광란) */
  haste: number;
  /** 피해 배율 (결속·포탈 행진) */
  boost: number;
}

export class Minion {
  x: number;
  z: number;
  facing = 0;
  left: number;
  cd = 0.5;
  private rig: MonsterRig;
  private mat: MeshLambertMaterial;
  private ring: Mesh;
  private t = Math.random() * 10;
  private lunge = 0;
  private dead = false;
  private target: Monster | null = null;

  constructor(
    readonly spec: MinionSpec,
    x: number,
    z: number,
    private scene: Scene,
  ) {
    this.x = x;
    this.z = z;
    this.left = spec.duration;
    this.mat = new MeshLambertMaterial({ vertexColors: true, flatShading: true });
    this.mat.emissive = new Color(spec.color).multiplyScalar(0.25);
    const sp = spec.species;
    this.rig = buildMonster(this.mat, sp.model, sp.colors ?? { main: 0x6a4aaa, dark: 0x2a1a4a, accent: spec.color }, !!spec.slam, sp.glow ?? spec.color);
    const size = (spec.size ?? 1) * (spec.slam ? 2 : 1);
    this.rig.root.scale.setScalar(size);
    this.rig.root.position.set(x, 0, z);
    this.ring = new Mesh(new RingGeometry(0.55 * size, 0.72 * size, 20), new MeshBasicMaterial({ color: spec.color, transparent: true, opacity: 0.7, side: DoubleSide, blending: AdditiveBlending, depthWrite: false }));
    this.ring.rotation.x = -Math.PI / 2;
    this.ring.position.set(x, 0.05, z);
    scene.add(this.rig.root, this.ring);
  }

  get alive(): boolean {
    return !this.dead;
  }

  get size(): number {
    return (this.spec.size ?? 1) * (this.spec.slam ? 2 : 1);
  }

  remove(): void {
    if (this.dead) return;
    this.dead = true;
    this.scene.remove(this.rig.root, this.ring);
    this.ring.geometry.dispose();
    (this.ring.material as MeshBasicMaterial).dispose();
    this.mat.dispose();
  }

  /** 가장 가까운 적 (플레이어가 맞힌 적이 가까우면 그쪽) */
  private pick(h: MinionHost): Monster | null {
    const f = h.focus;
    if (f && f.targetable && Math.hypot(f.x - this.x, f.z - this.z) < 16) return f;
    let best: Monster | null = null;
    let bd = 13;
    for (const m of h.level.monsters) {
      if (!m.targetable) continue;
      // 플레이어에게서 너무 먼 적은 쫓지 않는다
      if (Math.hypot(m.x - h.player.x, m.z - h.player.z) > 15) continue;
      const d = Math.hypot(m.x - this.x, m.z - this.z);
      if (d < bd) {
        bd = d;
        best = m;
      }
    }
    return best;
  }

  update(dt: number, h: MinionHost): void {
    if (this.dead) return;
    this.left -= dt;
    this.t += dt;
    this.cd -= dt * h.haste;
    this.lunge = Math.max(0, this.lunge - dt * 4);
    const lv = h.level;
    const sp = this.spec;
    // 플레이어에게서 너무 멀어지면 곁으로 순간이동
    if (Math.hypot(this.x - h.player.x, this.z - h.player.z) > 18 && !sp.stationary) {
      const a = Math.random() * Math.PI * 2;
      this.x = h.player.x + Math.cos(a) * 1.8;
      this.z = h.player.z + Math.sin(a) * 1.8;
      lv.effects.ring(this.x, this.z, 1, sp.color, 0.3);
    }
    if (!this.target || !this.target.targetable || this.t % 1 < dt) this.target = this.pick(h);
    const t = this.target;
    let moving = false;
    const reach = sp.slam ? 4.5 : sp.ranged ? 9 : 1.4 + this.size * 0.5 + (t?.radius ?? 0);
    if (t) {
      const dx = t.x - this.x;
      const dz = t.z - this.z;
      const d = Math.hypot(dx, dz);
      this.facing = Math.atan2(dx, dz);
      if (d > reach && !sp.stationary) {
        this.step(lv, dx / d, dz / d, dt * (sp.ranged ? 5 : 6.5));
        moving = true;
      } else if (this.cd <= 0) this.attack(h, t);
    } else if (!sp.stationary) {
      // 할 일이 없으면 플레이어 곁을 맴돈다
      const a = this.t * 0.8 + this.x;
      const hx = h.player.x + Math.cos(a) * 2.2 - this.x;
      const hz = h.player.z + Math.sin(a) * 2.2 - this.z;
      const d = Math.hypot(hx, hz);
      if (d > 0.6) {
        this.facing = Math.atan2(hx, hz);
        this.step(lv, hx / d, hz / d, dt * 6);
        moving = true;
      }
    }
    this.animate(moving);
  }

  private step(lv: DungeonScene, ux: number, uz: number, dist: number): void {
    const nx = this.x + ux * dist;
    const nz = this.z + uz * dist;
    if (isFloor(lv.grid, Math.floor(nx / TILE), Math.floor(nz / TILE))) {
      this.x = nx;
      this.z = nz;
    } else if (isFloor(lv.grid, Math.floor(nx / TILE), Math.floor(this.z / TILE))) this.x = nx;
    else if (isFloor(lv.grid, Math.floor(this.x / TILE), Math.floor(nz / TILE))) this.z = nz;
  }

  private attack(h: MinionHost, t: Monster): void {
    const sp = this.spec;
    const lv = h.level;
    const k = sp.power * h.boost;
    this.lunge = 1;
    if (sp.slam) {
      // 수문장: 주변을 크게 내려찍는다
      this.cd = 1.2 * (sp.rate ?? 1);
      lv.effects.explosion(this.x + Math.sin(this.facing) * 2, this.z + Math.cos(this.facing) * 2, 4, sp.color);
      lv.effects.ring(this.x, this.z, 5, 0xffffff, 0.35);
      for (const m of lv.monsters) if (m.targetable && Math.hypot(m.x - this.x, m.z - this.z) < 5 + m.radius) h.damage(m, 2.4 * k, 1.2, this.x, this.z);
      return;
    }
    if (sp.ranged) {
      this.cd = 1.1 * (sp.rate ?? 1);
      const angle = Math.atan2(t.x - this.x, t.z - this.z);
      const bounce = (x: number, z: number, n: number, hit: Set<Monster>) => {
        if (n <= 0) return;
        const struck = lv.monsters.find((m) => m.targetable && !hit.has(m) && Math.hypot(m.x - x, m.z - z) < m.radius + 1);
        if (!struck) return;
        hit.add(struck);
        const next = lv.monsters.filter((m) => m.targetable && !hit.has(m) && Math.hypot(m.x - x, m.z - z) < 7).sort((a, b) => Math.hypot(a.x - x, a.z - z) - Math.hypot(b.x - x, b.z - z))[0];
        if (!next) return;
        lv.effects.bolt(x, z, next.x, next.z, sp.color);
        h.damage(next, 0.4 * k, 0.2, x, z);
        hit.add(next);
        bounce(next.x, next.z, n - 1, hit);
      };
      lv.spawnPlayerProjectile({
        x: this.x,
        z: this.z,
        angle,
        speed: 17,
        damage: 0.45 * k,
        color: sp.color,
        kind: 'orb',
        radius: 0.28,
        y: 1,
        life: 1,
        onEnd: sp.bounce ? (x, z) => bounce(x, z, sp.bounce!, new Set()) : undefined,
      });
      return;
    }
    this.cd = 0.85 * (sp.rate ?? 1);
    lv.effects.slash(this.x, this.z, this.facing, 1.2 + this.size * 0.4, sp.color, 1.8, 0.6);
    h.damage(t, 0.62 * k, 0.4, this.x, this.z);
  }

  private animate(moving: boolean): void {
    const r = this.rig;
    r.root.position.set(this.x + Math.sin(this.facing) * this.lunge * 0.3, 0, this.z + Math.cos(this.facing) * this.lunge * 0.3);
    r.root.rotation.y = this.facing;
    this.ring.position.set(this.x, 0.05, this.z);
    // 사라지기 직전에는 깜빡인다
    const fading = this.left < 2 && Math.floor(this.t * 8) % 2 === 0;
    r.root.visible = !fading;
    const swing = moving ? Math.sin(this.t * 12) * 0.6 : 0;
    r.legs.forEach((leg, i) => (leg.rotation.x = i % 2 ? swing : -swing));
    r.body.rotation.x = -this.lunge * 0.4;
    if (r.style === 'float' || r.style === 'bat') r.body.position.y = 0.2 + Math.sin(this.t * 3) * 0.1;
    else if (r.style === 'bounce') r.body.position.y = Math.abs(Math.sin(this.t * 8)) * (moving ? 0.25 : 0.05);
    for (const a of r.arms) a.rotation.x = -this.lunge * 1.6;
  }
}

/** 소환수 무리 */
export class Minions {
  list: Minion[] = [];
  private level: DungeonScene | null = null;

  spawn(level: DungeonScene, spec: MinionSpec, x: number, z: number): Minion {
    if (this.level !== level) this.clear();
    this.level = level;
    // 벽 속이면 플레이어 자리로
    if (!isFloor(level.grid, Math.floor(x / TILE), Math.floor(z / TILE))) {
      x = level.grid.start.x * TILE;
      z = level.grid.start.y * TILE;
    }
    const m = new Minion(spec, x, z, level.scene);
    this.list.push(m);
    level.effects.ring(x, z, 1.4 * m.size, spec.color, 0.45);
    level.effects.pillar(x, z, spec.color, 2.2 * m.size);
    // 너무 많으면 오래된 것부터 (성능)
    while (this.list.length > 18) this.list.shift()!.remove();
    return m;
  }

  /** 한도에 세는 소환수 수 (궁극기로 부른 것 빼고) */
  count(filter?: (m: Minion) => boolean): number {
    return this.list.filter((m) => m.alive && !m.spec.extra && (!filter || filter(m))).length;
  }

  update(dt: number, h: MinionHost | null, onExpire?: (m: Minion) => void): void {
    if (!h || h.level !== this.level) {
      if (this.list.length) this.clear();
      return;
    }
    for (const m of this.list) {
      m.update(dt, h);
      if (m.left <= 0) {
        onExpire?.(m);
        m.remove();
      }
    }
    this.list = this.list.filter((m) => m.alive);
  }

  clear(): void {
    for (const m of this.list) m.remove();
    this.list = [];
  }
}
