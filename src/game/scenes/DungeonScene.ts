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
import { ITEMS, ORE_TIERS, WOOD_TIERS } from '../../data/items';
import { BOSS_SPECIES, pickSpecies, resolveSpecies, stagePool, tierFactions, type DebuffSpec, type Faction, type SpeciesDef } from '../../data/species';
import { isFloor } from '../../dungeon/generator';
import { NODES, resourceTier, type NodeDef } from '../../data/nodes';
import { themeForTier, type DungeonTheme } from '../../data/themes';
import type { CircleObstacle } from '../../dungeon/collision';
import type { DungeonData } from '../../dungeon/generator';
import { buildDecorGeometry, buildNodeGeometry, buildPortalFrame } from '../../models/props';
import { merge } from '../../models/util';
import { AFFIXES, type AffixId } from '../../data/endgame';
import type { MonsterMods } from '../../data/monsters';
import { Monster, type MonsterWorld, type ProjectileSpec } from '../Monster';
import { Projectiles, type Projectile, type ProjectileOptions } from '../Projectiles';
import { groundStyleFor, type GroundOptions } from '../../models/terrain';
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

/** 던전 한 판의 조정: 몬스터 능력치 배율과 균열 변이 */
export interface DungeonMods extends MonsterMods {
  affixes?: AffixId[];
  /** 맵 모습 (8장처럼 단계 테마가 아닌 곳) */
  theme?: DungeonTheme;
  /** 나오는 종족 (없으면 단계 목록) */
  pool?: [string, number][];
  /** 5·10번째 방 보스의 모습 (8장) */
  bosses?: { midboss: SpeciesDef; boss: SpeciesDef };
  /** 끝나지 않는 판 (무한 러쉬): 워프 게이트가 열리지 않는다 */
  endless?: boolean;
}

/** 무한의 탑 웨이브: 일반·정예 수와 보스 */
export interface WaveSpec {
  normals: number;
  elites: number;
  bosses?: { kind: 'boss' | 'midboss'; tier: number; species?: SpeciesDef }[];
}

export interface DungeonHooks {
  player: () => { x: number; z: number };
  cameraQuat: () => Quaternion;
  hurtPlayer: (dmg: number, fromX: number, fromZ: number, debuff?: DebuffSpec, dot?: boolean) => number;
  monsterKilled: (m: Monster) => void;
  monsterHitByProjectile: (m: Monster, p: Projectile) => void;
  exit: () => void;
  gather: (node: NodeInstance) => void;
  shake: (amount: number) => void;
  announce: (text: string) => void;
  killPlayer: () => void;
}


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
    mods: DungeonMods,
    private hooks: DungeonHooks,
  ) {
    super();
    this.theme = mods.theme ?? themeForTier(grid.tier);
    this.rng = new Rng(grid.seed ^ 0x5bd1e995);
    this.setupLights(this.theme.background, this.theme.ambient, this.theme.sun);
    this.buildTiles(grid, this.theme, this.rng, undefined, false);
    this.buildGround(grid, groundStyleFor(grid.tier), DungeonScene.groundOptions(grid));
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
      hurtPlayer: (d, x, z, debuff) => hooks.hurtPlayer(d, x, z, debuff),
      fireEnemyProjectile: (spec: ProjectileSpec) =>
        self.projectiles.spawn({ ...spec, fromPlayer: false, kind: spec.kind ?? 'orb', life: 2.2 }),
      summon: (what, x, z) => self.spawnMonster(resolveSpecies(self.grid.tier, what, () => self.rng.next()), 'normal', x, z, -1, true),
      hazard: (x, z, r, duration, dps, color, debuff) => self.addHazard(x, z, r, duration, dps, color, debuff),
      burst: (x, y, z, c, n, p) => self.particles.burst(x, y, z, c, n, p),
      shake: (a) => hooks.shake(a),
      announce: (t) => hooks.announce(t),
      killPlayer: () => hooks.killPlayer(),
    };

    this.mods = mods;
    // 몬스터 배치 (방마다 정해진 위치).
    // 방마다 절반쯤은 한 세력(언데드·오크·다크엘프…)이 차지하고, 떼로 다니는 종족은 무리로 나온다
    this.pool = mods.pool ? stagePool(grid.tier, grid.stage, () => this.rng.next(), mods.pool) : stagePool(grid.tier, grid.stage, () => this.rng.next());
    const factions = tierFactions(grid.tier, this.pool);
    const roomFavor = new Map<number, Faction | undefined>();
    const rand = () => this.rng.next();
    grid.monsters.forEach((m) => {
      const p = DungeonScene.toWorld(m.x, m.y);
      const room = grid.roomIndex[m.y * grid.width + m.x];
      if (!roomFavor.has(room)) roomFavor.set(room, this.rng.chance(0.5) ? this.rng.pick(factions) : undefined);
      const boss = m.kind === 'boss' || m.kind === 'midboss';
      // 정예는 떼 종족이 아닌 것 중에서
      let sp = pickSpecies(grid.tier, rand, m.kind === 'elite' ? (d) => d.arch !== 'swarm' : undefined, roomFavor.get(room), this.pool);
      if (boss && mods.bosses) sp = m.kind === 'boss' ? mods.bosses.boss : mods.bosses.midboss;
      const mon = this.spawnMonster(sp, m.kind, p.x, p.z, room, false);
      if (boss) this.boss = mon;
      if (m.kind === 'normal' && sp.pack) {
        for (let i = 1; i < sp.pack; i++) {
          const a = rand() * Math.PI * 2;
          const px = p.x + Math.cos(a) * 1.1;
          const pz = p.z + Math.sin(a) * 1.1;
          if (isFloor(grid, Math.floor(px / TILE), Math.floor(pz / TILE))) this.spawnMonster(sp, 'normal', px, pz, room, false);
        }
      }
    });

    const exit = this.portals.find((p) => p.kind === 'exit')!;
    this.interactables.push({
      id: 'exit',
      x: exit.x,
      z: exit.z,
      range: 3.4,
      label: grid.tower ? '오르기' : '워프',
      title: grid.tower ? '위층으로' : '워프 게이트',
      action: () => hooks.exit(),
      enabled: () => this.exitOpen,
    });
    // 채집물: 앞에서 상호작용하면 캐기 시작한다
    for (const n of this.nodes) {
      this.interactables.push({
        id: 'node',
        x: n.x,
        z: n.z,
        range: n.def.radius + 1.7,
        label: n.def.style === 'chest' ? '열기' : '채집',
        action: () => hooks.gather(n),
        // 근처에 몬스터가 있으면 채집할 수 없다 (전투 중에는 공격 버튼이 그대로 보인다)
        enabled: () => n.alive && n.dying === 0 && !this.monsterNear(n.x, n.z),
      });
    }
  }

  /** 엔드 콘텐츠의 능력치 조정과 균열 변이 */
  readonly mods: DungeonMods = {};
  private exploded = new WeakSet<Monster>();
  private frostT = 8;
  /** 이번 방에 나오는 종족 몇 가지 */
  private pool: [string, number][] = [];

  /** 복도는 닳은 길, 방 안에는 판이 깔린다. 탑은 가운데 둥근 단에 판을 빙 둘러 깐다 */
  static groundOptions(grid: DungeonData): GroundOptions {
    const { width, height } = grid;
    const corridor = (cx: number, cy: number) =>
      cx >= 0 && cy >= 0 && cx < width && cy < height && isFloor(grid, cx, cy) && grid.roomIndex[cy * width + cx] < 0 ? 1 : 0;
    // 칸 중심 값을 이웃과 이어 부드럽게
    const path = (x: number, z: number) => {
      const gx = x / TILE - 0.5;
      const gz = z / TILE - 0.5;
      const x0 = Math.floor(gx);
      const z0 = Math.floor(gz);
      const tx = gx - x0;
      const tz = gz - z0;
      const v =
        corridor(x0, z0) * (1 - tx) * (1 - tz) + corridor(x0 + 1, z0) * tx * (1 - tz) + corridor(x0, z0 + 1) * (1 - tx) * tz + corridor(x0 + 1, z0 + 1) * tx * tz;
      return Math.min(1, v * 1.2);
    };
    if (grid.tower) {
      const c = (width / 2) * TILE;
      return {
        seed: grid.seed,
        paved: (x, z) => {
          const d = Math.hypot(x - c, z - c) / TILE;
          return d < 3.2 ? 1 : d > 5.4 && d < 6.6 ? 0.85 : 0;
        },
      };
    }
    return { seed: grid.seed, path, pavedBias: (x, z) => 0.85 - path(x, z) * 0.6 };
  }

  static toWorld(tx: number, ty: number): { x: number; z: number } {
    return { x: (tx + 0.5) * TILE, z: (ty + 0.5) * TILE };
  }

  /** 고급 상자 습격: (x, z) 둘레의 빈 바닥에 몬스터 무리를 불러낸다 */
  spawnAmbush(x: number, z: number, count: number): Monster[] {
    const out: Monster[] = [];
    for (let i = 0, tries = 0; out.length < count && tries < count * 20; tries++) {
      const a = Math.random() * Math.PI * 2;
      const r = 4 + Math.random() * 7;
      const px = x + Math.cos(a) * r;
      const pz = z + Math.sin(a) * r;
      if (!isFloor(this.grid, Math.floor(px / TILE), Math.floor(pz / TILE))) continue;
      const kind = i % 6 === 5 ? 'elite' : 'normal';
      out.push(this.spawnMonster(pickSpecies(this.grid.tier, () => this.rng.next(), kind === 'elite' ? (d) => d.arch !== 'swarm' : undefined, undefined, this.pool), kind, px, pz, -1, true));
      this.particles.burst(px, 0.6, pz, 0xffd23a, 8, 1);
      i++;
    }
    return out;
  }

  /** 보스를 하나 더 부른다 (보스 러시 하드·지옥). 종족은 단계의 보스로 정해진다 */
  spawnBoss(kind: 'boss' | 'midboss', tier: number, x: number, z: number, species?: SpeciesDef): Monster {
    const m = new Monster(species ?? BOSS_SPECIES[tier - 1], kind, tier, kind === 'boss' ? 10 : 5, this.mods, x, z, this.boss?.homeRoom ?? -1);
    m.addTo(this.scene);
    this.monsters.push(m);
    return m;
  }

  spawnMonster(species: SpeciesDef, kind: Monster['kind'], x: number, z: number, room: number, aggro: boolean): Monster {
    const m = new Monster(species, kind, this.grid.tier, this.grid.stage, this.mods, x, z, room);
    m.aggro = aggro;
    m.addTo(this.scene);
    this.monsters.push(m);
    if (aggro) this.effects.ring(x, z, 1.5, 0xb080ff, 0.4);
    return m;
  }

  /** 독 웅덩이 같은 바닥 장판: 안에 서 있으면 0.5초마다 피해 */
  private hazards: { x: number; z: number; r: number; left: number; tick: number; dps: number; debuff?: DebuffSpec }[] = [];

  private addHazard(x: number, z: number, r: number, duration: number, dps: number, color: number, debuff?: DebuffSpec): void {
    this.hazards.push({ x, z, r, left: duration, tick: 0.3, dps, debuff });
    if (debuff?.id === 'poison') this.effects.poisonPool(x, z, r, duration);
    else this.effects.zone(x, z, r, color, duration);
  }

  /** 균열 변이: 불안정(쓰러진 자리 폭발), 서리 바닥(발밑에 둔화 서리) */
  private updateAffixes(dt: number, focus: { x: number; z: number }): void {
    const aff = this.mods.affixes;
    if (!aff?.length) return;
    if (aff.includes('volatile')) {
      for (const m of this.monsters) {
        if (m.alive || this.exploded.has(m)) continue;
        this.exploded.add(m);
        const r = m.kind === 'normal' ? 2 : 2.8;
        // 잠깐 뒤에 터진다: 장판이 보이는 동안 벗어나면 된다
        this.addHazard(m.x, m.z, r, 1.2, m.atk * 0.9, AFFIXES.volatile.color);
      }
    }
    if (aff.includes('frost') && this.monsters.some((m) => m.alive && m.aggro)) {
      this.frostT -= dt;
      if (this.frostT <= 0) {
        this.frostT = 8;
        const atk = Math.max(1, ...this.monsters.filter((m) => m.alive).map((m) => m.atk));
        this.addHazard(focus.x, focus.z, 2.4, 4, atk * 0.15, AFFIXES.frost.color, { id: 'slow', chance: 1, duration: 2 });
      }
    }
  }

  private updateHazards(dt: number): void {
    const p = this.hooks.player();
    for (let i = this.hazards.length - 1; i >= 0; i--) {
      const h = this.hazards[i];
      h.left -= dt;
      h.tick -= dt;
      if (h.tick <= 0) {
        h.tick = 0.5;
        if (Math.hypot(p.x - h.x, p.z - h.z) < h.r + 0.3) this.hooks.hurtPlayer(h.dps * 0.5, h.x, h.z, h.debuff, true);
      }
      if (h.left <= 0) this.hazards.splice(i, 1);
    }
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
      // 광맥·나무는 2~5번 캐면 다한다 (하나하나 다르다)
      const hp = def.style === 'ore' || def.style === 'tree' ? this.rng.int(2, 5) : def.hp;
      this.nodes.push({ def, mesh, material, x: p.x, z: p.z, hp, shake: 0, flash: 0, dying: 0, alive: true, obstacle });
      // 나무·결정처럼 키 큰 채집물은 캐릭터를 가리면 반투명해진다
      this.addOccluder(mesh, p.x, p.z, def.radius + 0.3, def.style === 'tree' ? 3 : def.style === 'crystal' ? 1.8 : 1.2, true);
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

  /** 모든 몬스터를 쓰러뜨리면 워프 게이트가 열린다 (웨이브가 남았으면 아직) */
  get exitOpen(): boolean {
    if (this.mods.endless) return false;
    return this.waveIndex >= this.waves.length && this.monsters.every((m) => !m.alive);
  }

  // ---------------- 웨이브 (무한의 탑) ----------------
  waves: WaveSpec[] = [];
  /** 지금까지 나온 웨이브 수 */
  waveIndex = 0;
  private waveDelay = 0;

  startWaves(waves: WaveSpec[]): void {
    this.waves = waves;
    this.waveIndex = 0;
    this.waveDelay = 1.6;
  }

  private updateWaves(dt: number, focus: { x: number; z: number }): void {
    if (this.waveIndex >= this.waves.length || this.monsters.some((m) => m.alive)) return;
    this.waveDelay -= dt;
    if (this.waveDelay > 0) return;
    const w = this.waves[this.waveIndex++];
    this.waveDelay = 1.8;
    // 둥근 단 위, 플레이어에게서 조금 떨어진 곳에 나타난다
    const cells: { x: number; z: number }[] = [];
    for (let y = 0; y < this.grid.height; y++)
      for (let x = 0; x < this.grid.width; x++) {
        if (!isFloor(this.grid, x, y)) continue;
        const p = DungeonScene.toWorld(x, y);
        const ex = DungeonScene.toWorld(this.grid.exit.x, this.grid.exit.y);
        if (Math.hypot(p.x - focus.x, p.z - focus.z) > 5 && Math.hypot(p.x - ex.x, p.z - ex.z) > 2.5) cells.push(p);
      }
    const rand = () => this.rng.next();
    const at = () => {
      const p = cells[Math.floor(rand() * cells.length)];
      return { x: p.x + (rand() - 0.5) * 1.2, z: p.z + (rand() - 0.5) * 1.2 };
    };
    for (let i = 0; i < w.normals; i++) {
      const p = at();
      const m = this.spawnMonster(pickSpecies(this.grid.tier, rand, (d) => d.arch !== 'swarm', undefined, this.pool), 'normal', p.x, p.z, 0, true);
      this.particles.burst(m.x, 0.5, m.z, this.theme.portalColor, 6, 1);
    }
    for (let i = 0; i < w.elites; i++) {
      const p = at();
      this.spawnMonster(pickSpecies(this.grid.tier, rand, (d) => d.arch !== 'swarm', undefined, this.pool), 'elite', p.x, p.z, 0, true);
    }
    for (const b of w.bosses ?? []) {
      const ex = DungeonScene.toWorld(this.grid.exit.x, this.grid.exit.y - 3);
      const m = this.spawnBoss(b.kind, b.tier, ex.x + (rand() - 0.5) * 2, ex.z, b.species);
      m.aggro = true;
      if (!this.boss || !this.boss.alive) this.boss = m;
      this.effects.pillar(m.x, m.z, 0xff4a6a, 6);
    }
    this.hooks.announce(this.waveIndex === this.waves.length ? `마지막 웨이브! (${this.waveIndex}/${this.waves.length})` : `웨이브 ${this.waveIndex}/${this.waves.length}`);
  }

  /** 위치 주변에 살아 있는 몬스터가 있는지 */
  monsterNear(x: number, z: number, range = 9): boolean {
    return this.monsters.some((m) => m.alive && Math.hypot(m.x - x, m.z - z) < range);
  }

  get aliveCount(): number {
    return this.monsters.filter((m) => m.alive).length;
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
      for (let i = 0; i < node.def.bonus; i++) {
        const t = resourceTier(this.grid.tier, this.grid.stage, this.rng.next()) - 1;
        const pool = [ORE_TIERS[t], WOOD_TIERS[t], ...this.theme.special.map((id) => NODES[id].itemId)];
        drops.push({ itemId: this.rng.pick(pool), count: 1 });
      }
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
    for (const m of this.monsters) if (m.targetable) list.push({ x: m.x, z: m.z, radius: m.radius * 0.8 });
    return list;
  }

  /** 보스 제한 시간 초과 → 즉사기 */
  startBossDoom(): void {
    this.boss?.startDoom(this.world);
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

    this.updateAffixes(dt, focus);
    if (this.waves.length) this.updateWaves(dt, focus);
    this.updateHazards(dt);
    this.projectiles.update(dt, {
      grid: this.grid,
      monsters: this.monsters,
      player: focus,
      playerHit: (p) => void this.hooks.hurtPlayer(p.damage, p.x - p.vx, p.z - p.vz, p.debuff),
      monsterHit: (m, p) => this.hooks.monsterHitByProjectile(m, p),
      burst: (x, y, z, c, n, pw) => this.particles.burst(x, y, z, c, n, pw),
      trail: (x, y, z, c, big) => {
        if (big || Math.random() < 0.5) this.effects.sparks(x, y, z, c, 1, { speed: big ? 1.2 : 0.4, life: big ? 0.35 : 0.2, size: big ? 0.12 : 0.06 });
      },
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
