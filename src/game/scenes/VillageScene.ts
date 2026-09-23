import {
  AdditiveBlending,
  CircleGeometry,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  PointLight,
} from 'three';
import { TILE } from '../../config';
import { Rng } from '../../core/rng';
import { CELL_FLOOR, type DungeonData } from '../../dungeon/generator';
import { buildHero, type HeroLook, type HeroRig } from '../../models/hero';
import { buildDecorGeometry, buildPortalFrame } from '../../models/props';
import { merge } from '../../models/util';
import {
  buildBarrel,
  buildChest,
  buildForge,
  buildFountain,
  buildHomeDoor,
  buildHouse,
  buildLamp,
  buildStall,
  buildStatue,
  buildTree,
} from '../../models/village';
import { Level } from './Level';

export type NpcId = 'chief' | 'guide' | 'smith' | 'engineer' | 'merchant' | 'stranger';

export interface NpcDef {
  id: NpcId;
  name: string;
  faction: string;
  tile: [number, number];
  look: HeroLook;
}

export const NPCS: NpcDef[] = [
  { id: 'chief', name: '촌장 에단', faction: '중립', tile: [13, 11], look: { tunic: 0x6a5a8a, tunicDark: 0x4a3e66, hair: 0xe8e8e8, beard: 0xf0f0f0, weapon: 'staff' } },
  { id: 'guide', name: '안내인 리아', faction: '탈출파', tile: [17, 16], look: { tunic: 0x3a9a8a, tunicDark: 0x2a7066, hair: 0xe0a040, weapon: 'none' } },
  { id: 'smith', name: '대장장이 고른', faction: '안주파', tile: [8, 6], look: { tunic: 0x8a4a2a, tunicDark: 0x5a301a, hair: 0x2a2020, beard: 0x3a2a20, apron: 0x4a3a30, weapon: 'hammer', skin: 0xd8a070 } },
  { id: 'engineer', name: '마공학자 세라', faction: '탈출파', tile: [21, 13], look: { tunic: 0x4a6a9a, tunicDark: 0x344c70, hair: 0xb04a4a, apron: 0x6a5a40, weapon: 'none' } },
  { id: 'merchant', name: '상인 무트', faction: '안주파', tile: [7, 13], look: { tunic: 0xc9a040, tunicDark: 0x9a7a2a, hair: 0x6a4a2a, weapon: 'none' } },
  { id: 'stranger', name: '???', faction: '???', tile: [4, 18], look: { tunic: 0x2a2a3a, tunicDark: 0x1a1a26, hair: 0x1a1a26, hat: 'wizard', weapon: 'none', skin: 0xc8c0d8 } },
];

export interface Npc {
  def: NpcDef;
  rig: HeroRig;
  x: number;
  z: number;
  baseFacing: number;
  facing: number;
}

export type VillageSpot = NpcId | 'portal' | 'home' | 'forge' | 'shop' | 'hall' | 'storage';

const W = 28;
const H = 22;

const toWorld = (tx: number, ty: number) => ({ x: (tx + 0.5) * TILE, z: (ty + 0.5) * TILE });

function makeGrid(): DungeonData {
  const cells = new Uint8Array(W * H).fill(CELL_FLOOR);
  return {
    seed: 7,
    tier: 0,
    stage: 0,
    width: W,
    height: H,
    cells,
    rooms: [],
    roomIndex: new Int16Array(W * H).fill(-1),
    start: { x: 14, y: 17 },
    exit: { x: 14, y: 4 },
    nodes: [],
    monsters: [],
    decor: [],
  };
}

/** 차원마을: 걸어 다니는 거점. NPC와 시설을 둘러본다 */
export class VillageScene extends Level {
  readonly kind = 'village';
  readonly grid = makeGrid();
  readonly playerStart: { x: number; z: number; facing: number };
  readonly npcs: Npc[] = [];
  private portalSwirl: Mesh;
  private homeSwirl: Mesh;
  private npcMaterial = new MeshLambertMaterial({ vertexColors: true, flatShading: true });

  constructor(
    onInteract: (spot: VillageSpot) => void,
    visibleNpcs: (id: NpcId) => boolean,
    homeUnlocked: boolean,
    arrival: 'portal' | 'home' | 'start' | { x: number; z: number; facing: number },
  ) {
    super();
    const rng = new Rng(12345);
    this.setupLights(0x1c1a30, 0xffe8d0, 0xffe2b8, 1.8, 2.3);
    this.buildTiles(this.grid, { floorA: 0x8f8a7c, floorB: 0x9a9486, wallSide: 0x3f5a34, wallTop: 0x5d8a44 }, rng, 1.6);

    const mat = new MeshLambertMaterial({ vertexColors: true, flatShading: true });
    const place = (geo: Mesh['geometry'], tx: number, ty: number, rot: number, radius: number) => {
      const p = toWorld(tx, ty);
      this.addMesh(geo, mat, p.x, p.z, rot);
      if (radius > 0) this.obstacles.push({ x: p.x, z: p.z, radius });
      return p;
    };

    // 집들 (마을 가장자리)
    const houses: [number, number, number, number, number][] = [
      [3, 3, 0xd8c8a8, 0x8a3a2a, 0],
      [24, 3, 0xc8b898, 0x3a5a8a, 0],
      [3, 17, 0xd8c8a8, 0x4a6a3a, Math.PI / 2],
      [24, 18, 0xc8c0b0, 0x8a3a2a, -Math.PI / 2],
      [19, 19, 0xd0c0a0, 0x6a4a8a, Math.PI],
      [9, 19, 0xc8b898, 0x8a5a2a, Math.PI],
    ];
    for (const [x, y, wall, roof, rot] of houses) place(buildHouse(wall, roof), x, y, rot, 2.1);

    // 시설
    place(buildForge(), 8, 4, 0, 1.9);
    place(buildStall(0xc84a4a), 7, 12, Math.PI / 2, 1.5);
    place(buildFountain(), 13, 13, 0, 1.9);
    place(buildStatue(), 20, 5, 0, 1.3);
    place(buildChest(), 11, 16, 0, 0.8);
    for (const [x, y] of [
      [10, 9],
      [17, 9],
      [10, 15],
      [17, 13],
      [5, 9],
      [22, 9],
    ])
      place(buildLamp(), x, y, 0, 0.25);
    for (const [x, y] of [
      [1, 9],
      [1, 13],
      [26, 12],
      [26, 7],
      [14, 20],
      [6, 1],
      [21, 1],
    ])
      place(buildTree(rng.pick([0x4f8a3c, 0x5a9a44, 0x3f7a34])), x, y, rng.range(0, 6), 0.9);
    for (const [x, y] of [
      [6, 11],
      [9, 3],
      [25, 15],
    ])
      place(buildBarrel(), x, y, 0, 0.45);

    // 풀 장식
    const decor = [];
    for (let i = 0; i < 70; i++) {
      const x = rng.range(0.5, W - 0.5);
      const y = rng.range(0.5, H - 0.5);
      const g = buildDecorGeometry(rng.chance(0.7) ? 'grass' : 'mushroom', rng.chance(0.7) ? 0x6aa048 : 0xd9543f, rng);
      g.translate(x * TILE, 0, y * TILE);
      decor.push(g);
    }
    this.addMesh(merge(decor), mat, 0, 0, 0, false);

    // 차원문 광장 (큰 차원문)
    const portal = toWorld(14, 4);
    const frame = this.addMesh(buildPortalFrame(0x5ef0ff), mat, portal.x, portal.z, Math.PI / 4);
    frame.scale.setScalar(1.5);
    this.obstacles.push({ x: portal.x, z: portal.z, radius: 1.8 });
    this.portalSwirl = new Mesh(
      new CircleGeometry(0.84, 6),
      new MeshBasicMaterial({ color: 0x5ef0ff, transparent: true, opacity: 0.55, side: DoubleSide, blending: AdditiveBlending, depthWrite: false }),
    );
    this.portalSwirl.position.set(portal.x, 2.02, portal.z);
    this.portalSwirl.rotation.y = Math.PI / 4;
    this.portalSwirl.scale.setScalar(1.5);
    this.scene.add(this.portalSwirl);
    const light = new PointLight(0x5ef0ff, 18, 12);
    light.position.set(portal.x, 2.5, portal.z + 1);
    this.scene.add(light);

    // 차원집 문
    const home = toWorld(23, 11);
    this.addMesh(buildHomeDoor(), mat, home.x, home.z, -Math.PI / 2);
    this.obstacles.push({ x: home.x, z: home.z, radius: 1 });
    this.homeSwirl = new Mesh(
      new CircleGeometry(0.75, 6),
      new MeshBasicMaterial({ color: 0xc28cff, transparent: true, opacity: homeUnlocked ? 0.6 : 0.12, side: DoubleSide, blending: AdditiveBlending, depthWrite: false }),
    );
    this.homeSwirl.position.set(home.x, 1.3, home.z);
    this.homeSwirl.rotation.y = -Math.PI / 2;
    this.homeSwirl.scale.set(1.1, 1.5, 1);
    this.scene.add(this.homeSwirl);

    // NPC
    for (const def of NPCS) {
      if (!visibleNpcs(def.id)) continue;
      const rig = buildHero(this.npcMaterial, def.look);
      const p = toWorld(...def.tile);
      rig.root.position.set(p.x, 0, p.z);
      const facing = Math.PI / 4;
      rig.root.rotation.y = facing;
      rig.weapon.rotation.x = def.look.weapon === 'staff' ? 0.35 : -0.3;
      rig.armR.rotation.x = -0.35;
      this.scene.add(rig.root);
      this.obstacles.push({ x: p.x, z: p.z, radius: 0.5 });
      this.npcs.push({ def, rig, x: p.x, z: p.z, baseFacing: facing, facing });
      this.interactables.push({ id: def.id, x: p.x, z: p.z, range: 2.2, label: '대화', title: def.name, action: () => onInteract(def.id) });
    }

    const spot = (id: VillageSpot, tx: number, ty: number, range: number, label: string, title: string) => {
      const p = toWorld(tx, ty);
      this.interactables.push({ id, x: p.x, z: p.z, range, label, title, action: () => onInteract(id) });
    };
    spot('portal', 14, 4, 4.2, '입장', '차원문 광장');
    spot('home', 23, 11, 2.6, '들어가기', '차원집');
    spot('forge', 8, 4, 3.2, '강화', '대장간');
    spot('shop', 7, 12, 3, '거래', '상점');
    spot('hall', 20, 5, 2.6, '직업', '직업의 전당');
    spot('storage', 11, 16, 2.2, '창고', '창고');

    const start =
      typeof arrival === 'object'
        ? arrival
        : arrival === 'portal' ? { ...toWorld(14, 7), facing: Math.PI / 4 } : arrival === 'home' ? { ...toWorld(21, 11), facing: -Math.PI / 2 } : { ...toWorld(14, 17), facing: Math.PI + Math.PI / 4 };
    this.playerStart = start;
  }

  update(dt: number, focus: { x: number; z: number }): void {
    super.update(dt, focus);
    this.portalSwirl.rotation.z += dt * 1.5;
    this.homeSwirl.rotation.z -= dt * 1.2;
    if (Math.random() < dt * 6) {
      const a = Math.random() * Math.PI * 2;
      this.particles.burst(this.portalSwirl.position.x + Math.cos(a) * 1.2, 0.3, this.portalSwirl.position.z + Math.sin(a) * 1.2, 0x5ef0ff, 1, 0.3);
    }
    // NPC: 플레이어가 가까이 오면 쳐다본다
    for (const n of this.npcs) {
      const d = Math.hypot(focus.x - n.x, focus.z - n.z);
      const target = d < 4.5 ? Math.atan2(focus.x - n.x, focus.z - n.z) : n.baseFacing;
      let diff = ((target - n.facing + Math.PI) % (Math.PI * 2)) - Math.PI;
      if (diff < -Math.PI) diff += Math.PI * 2;
      n.facing += diff * Math.min(1, dt * 5);
      n.rig.root.rotation.y = n.facing;
      n.rig.body.position.y = 0.6 + Math.sin(this.time * 2 + n.x) * 0.015;
    }
  }
}
