import {
  AdditiveBlending,
  CircleGeometry,
  Color,
  DoubleSide,
  Group,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  Quaternion,
  RingGeometry,
  Vector3,
} from 'three';
import { TILE } from '../../config';
import { Rng } from '../../core/rng';
import { ITEMS } from '../../data/items';
import type { Archetype } from '../../data/monsters';
import { NODES, type NodeDef } from '../../data/nodes';
import { themeForTier, type DungeonTheme } from '../../data/themes';
import type { CircleObstacle } from '../../dungeon/collision';
import type { DungeonData } from '../../dungeon/generator';
import { buildDecorGeometry, buildNodeGeometry, buildPortalFrame } from '../../models/props';
import { merge } from '../../models/util';
import { Monster, type MonsterWorld, type ProjectileSpec } from '../Monster';
import { Projectiles, type Projectile, type ProjectileOptions } from '../Projectiles';
import { Level } from './Level';

const WHITE = new Color(0xffffff);

export interface NodeInstance {
  def: NodeDef;
  mesh: Mesh;
  material: MeshLambertMaterial;
  x: number;
  z: number;
  hp: number;
  shake: number;
  flash: number;
  dying: number;
  alive: boolean;
  obstacle: CircleObstacle;
}

export interface Portal {
  group: Group;
  x: number;
  z: number;
  kind: 'entrance' | 'exit';
  swirl: Mesh;
  glow: Mesh;
}

export interface Drop {
  itemId: string;
  count: number;
}

export interface DungeonHooks {
  player: () => { x: number; z: number };
  cameraQuat: () => Quaternion;
  hurtPlayer: (dmg: number, fromX: number, fromZ: number) => void;
  monsterKilled: (m: Monster) => void;
  monsterHitByProjectile: (m: Monster, p: Projectile) => void;
  exit: () => void;
  shake: (amount: number) => void;
}

const ARCH_WEIGHTS: Archetype[] = ['melee', 'melee', 'melee', 'ranged', 'ranged', 'charger', 'bomber', 'tank'];

/** 던전 한 판: 지형, 채집물, 몬스터, 투사체, 차원문 */
export class DungeonScene extends Level {
  readonly kind = 'dungeon';
  readonly theme: DungeonTheme;
  readonly nodes: NodeInstance[] = [];
  readonly portals: Portal[] = [];
  readonly monsters: Monster[] = [];
  readonly projectiles: Projectiles;
  readonly playerStart: { x: number; z: number; facing: number };
  boss: Monster | null = null;
  private rng: Rng;
  private world: MonsterWorld;

  constructor(
    readonly grid: DungeonData,
    ngPlus: number,
    private hooks: DungeonHooks,
  ) {
    super();
    this.theme = themeForTier(grid.tier);
    this.rng = new Rng(grid.seed ^ 0x5bd1e995);
    this.setupLights(this.theme.background, this.theme.ambient, this.theme.sun);
    this.buildTiles(grid, this.theme, this.rng);
    this.buildDecor();
    this.buildNodes();
    this.buildPortals();
    this.projectiles = new Projectiles(this.scene);

    const s = DungeonScene.toWorld(grid.start.x, grid.start.y);
    this.playerStart = { x: s.x + 1.4, z: s.z + 1.4, facing: Math.PI / 4 };

    const self = this;
    this.world = {
      grid,
      obstacles: this.obstacles,
      scene: this.scene,
      effects: this.effects,
      get player() {
        return hooks.player();
      },
      monsters: this.monsters,
      hurtPlayer: (d, x, z) => hooks.hurtPlayer(d, x, z),
      fireEnemyProjectile: (spec: ProjectileSpec) =>
        self.projectiles.spawn({ ...spec, fromPlayer: false, kind: spec.kind ?? 'orb', life: 2.2 }),
      summon: (arch, x, z) => self.spawnMonster(arch, 'normal', x, z, -1, true),
      burst: (x, y, z, c, n, p) => self.particles.burst(x, y, z, c, n, p),
      shake: (a) => hooks.shake(a),
    };

    this.ngPlus = ngPlus;
    // 몬스터 배치 (방마다 정해진 위치)
    grid.monsters.forEach((m) => {
      const p = DungeonScene.toWorld(m.x, m.y);
      const arch = this.rng.pick(ARCH_WEIGHTS);
      const room = grid.roomIndex[m.y * grid.width + m.x];
      const mon = this.spawnMonster(arch, m.kind, p.x, p.z, room, false);
      if (m.kind === 'boss') this.boss = mon;
    });

    const exit = this.portals.find((p) => p.kind === 'exit')!;
    this.interactables.push({
      id: 'exit',
      x: exit.x,
      z: exit.z,
      range: 3.4,
      label: '귀환',
      action: () => hooks.exit(),
      enabled: () => !this.boss || !this.boss.alive,
    });
  }

  private ngPlus = 0;

  static toWorld(tx: number, ty: number): { x: number; z: number } {
    return { x: (tx + 0.5) * TILE, z: (ty + 0.5) * TILE };
  }

  spawnMonster(arch: Archetype, kind: Monster['kind'], x: number, z: number, room: number, aggro: boolean): Monster {
    const m = new Monster(arch, kind, this.grid.tier, this.ngPlus, x, z, room);
    m.aggro = aggro;
    m.addTo(this.scene);
    this.monsters.push(m);
    if (aggro) this.effects.ring(x, z, 1.5, 0xb080ff, 0.4);
    return m;
  }

  private buildDecor(): void {
    if (this.grid.decor.length === 0) return;
    const m = new Matrix4();
    const s = new Vector3();
    const parts = this.grid.decor.map((d) => {
      const g = buildDecorGeometry(d.kind, d.color, this.rng);
      m.makeRotationY(d.rotation).scale(s.setScalar(d.scale));
      g.applyMatrix4(m);
      g.translate(d.x * TILE, 0, d.y * TILE);
      return g;
    });
    const mesh = new Mesh(merge(parts), new MeshLambertMaterial({ vertexColors: true, flatShading: true }));
    mesh.receiveShadow = true;
    this.scene.add(mesh);
  }

  private buildNodes(): void {
    this.grid.nodes.forEach((spawn, i) => {
      const def = NODES[spawn.nodeId];
      const material = new MeshLambertMaterial({ vertexColors: true, flatShading: true });
      if (def.style === 'crystal') material.emissive.setHex(def.accentColor).multiplyScalar(0.22);
      const p = DungeonScene.toWorld(spawn.x, spawn.y);
      const mesh = this.addMesh(
        buildNodeGeometry(def, this.grid.seed + i * 131),
        material,
        p.x,
        p.z,
        def.style === 'chest' ? Math.PI / 4 : this.rng.range(0, Math.PI * 2),
      );
      const obstacle = { x: p.x, z: p.z, radius: def.radius };
      this.obstacles.push(obstacle);
      this.nodes.push({ def, mesh, material, x: p.x, z: p.z, hp: def.hp, shake: 0, flash: 0, dying: 0, alive: true, obstacle });
    });
  }

  private buildPortals(): void {
    const make = (tx: number, ty: number, kind: Portal['kind']) => {
      const color = kind === 'exit' ? this.theme.portalColor : 0x9a98b0;
      const group = new Group();
      const p = DungeonScene.toWorld(tx, ty);
      group.position.set(p.x, 0, p.z);
      group.rotation.y = Math.PI / 4;
      const frame = new Mesh(buildPortalFrame(color), new MeshLambertMaterial({ vertexColors: true, flatShading: true }));
      frame.castShadow = true;
      const swirlMat = new MeshBasicMaterial({ color, transparent: true, opacity: 0.2, side: DoubleSide, blending: AdditiveBlending, depthWrite: false });
      const swirl = new Mesh(new CircleGeometry(0.84, 6), swirlMat);
      swirl.position.y = 1.35;
      const glowMat = swirlMat.clone();
      glowMat.opacity = 0.1;
      const glow = new Mesh(new RingGeometry(1.4, 2.1, 24), glowMat);
      glow.rotation.x = -Math.PI / 2;
      glow.position.y = 0.03;
      group.add(frame, swirl, glow);
      this.scene.add(group);
      this.obstacles.push({ x: p.x, z: p.z, radius: 1.15 });
      this.portals.push({ group, x: p.x, z: p.z, kind, swirl, glow });
    };
    make(this.grid.start.x, this.grid.start.y, 'entrance');
    make(this.grid.exit.x, this.grid.exit.y, 'exit');
  }

  get exitOpen(): boolean {
    return !this.boss || !this.boss.alive;
  }

  /** 채집물을 한 번 친다. 나온 아이템을 돌려준다 */
  hitNode(node: NodeInstance): Drop[] {
    if (!node.alive || node.dying > 0) return [];
    node.hp -= 1;
    node.shake = 1;
    node.flash = 1;
    const drops: Drop[] = [];
    this.particles.burst(node.x, 0.7, node.z, node.def.accentColor, 7);
    if (node.def.style === 'chest') {
      const pool = this.theme.nodes.map((id) => NODES[id].itemId);
      for (let i = 0; i < node.def.bonus; i++) drops.push({ itemId: this.rng.pick(pool), count: 1 });
    } else {
      drops.push({ itemId: node.def.itemId, count: 1 });
    }
    if (node.hp <= 0) {
      node.dying = 0.001;
      if (node.def.style !== 'chest') drops.push({ itemId: node.def.itemId, count: node.def.bonus });
      this.particles.burst(node.x, 0.6, node.z, node.def.baseColor, 12, 1.3);
      const idx = this.obstacles.indexOf(node.obstacle);
      if (idx >= 0) this.obstacles.splice(idx, 1);
    }
    const merged = new Map<string, number>();
    for (const d of drops) merged.set(d.itemId, (merged.get(d.itemId) ?? 0) + d.count);
    return [...merged].filter(([id]) => ITEMS[id]).map(([itemId, count]) => ({ itemId, count }));
  }

  spawnPlayerProjectile(o: Omit<ProjectileOptions, 'fromPlayer'>): Projectile {
    return this.projectiles.spawn({ ...o, fromPlayer: true });
  }

  /** 플레이어와 부딪히는 장애물 (채집물, 차원문, 살아 있는 몬스터) */
  playerObstacles(): CircleObstacle[] {
    const list = [...this.obstacles];
    for (const m of this.monsters) if (m.alive) list.push({ x: m.x, z: m.z, radius: m.radius * 0.8 });
    return list;
  }

  update(dt: number, focus: { x: number; z: number }): void {
    super.update(dt, focus);
    const camQuat = this.hooks.cameraQuat();

    // 몬스터: 화면 근처만 움직인다 (먼 곳은 잠든다)
    for (let i = this.monsters.length - 1; i >= 0; i--) {
      const m = this.monsters[i];
      const far = Math.hypot(m.x - focus.x, m.z - focus.z) > 30;
      if (!far || m.aggro) m.update(dt, this.world, camQuat);
      if (!m.alive && m.deathTime >= 0.45) {
        m.removeFrom(this.scene);
        m.dispose();
        this.monsters.splice(i, 1);
      }
    }

    this.projectiles.update(dt, {
      grid: this.grid,
      monsters: this.monsters,
      player: focus,
      playerHit: (p) => this.hooks.hurtPlayer(p.damage, p.x - p.vx, p.z - p.vz),
      monsterHit: (m, p) => this.hooks.monsterHitByProjectile(m, p),
      burst: (x, y, z, c, n, pw) => this.particles.burst(x, y, z, c, n, pw),
    });

    for (const n of this.nodes) {
      if (!n.alive) continue;
      if (n.shake > 0) {
        n.shake = Math.max(0, n.shake - dt * 6);
        const s = n.shake * 0.08;
        n.mesh.position.x = n.x + Math.sin(this.time * 70) * s;
        n.mesh.position.z = n.z + Math.cos(this.time * 63) * s;
      }
      if (n.flash > 0) {
        n.flash = Math.max(0, n.flash - dt * 9);
        const base = n.def.style === 'crystal' ? 0.22 : 0;
        n.material.emissive.setHex(n.def.accentColor).multiplyScalar(base).lerp(WHITE, n.flash * 0.7);
      }
      if (n.dying > 0) {
        n.dying += dt * 4.5;
        const s = Math.max(0, 1 - n.dying);
        n.mesh.scale.set(1 + (1 - s) * 0.3, s, 1 + (1 - s) * 0.3);
        if (n.dying >= 1) {
          n.alive = false;
          n.mesh.visible = false;
        }
      }
    }

    const open = this.exitOpen;
    for (const p of this.portals) {
      const active = p.kind === 'exit' && open;
      p.swirl.rotation.z += dt * (active ? 2.2 : 0.5);
      (p.swirl.material as MeshBasicMaterial).opacity = active ? 0.55 : 0.18;
      (p.glow.material as MeshBasicMaterial).opacity = active ? 0.32 : 0.08;
      p.swirl.scale.setScalar(1 + Math.sin(this.time * 3) * 0.06);
      if (active && Math.random() < dt * 8) {
        const a = Math.random() * Math.PI * 2;
        this.particles.burst(p.x + Math.cos(a) * 0.8, 0.3, p.z + Math.sin(a) * 0.8, this.theme.portalColor, 1, 0.3);
      }
    }
  }

  dispose(): void {
    this.projectiles.clear();
    for (const m of this.monsters) {
      m.removeFrom(this.scene);
      m.dispose();
    }
    super.dispose();
  }
}
