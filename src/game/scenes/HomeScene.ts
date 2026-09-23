import {
  AdditiveBlending,
  BoxGeometry,
  BufferGeometry,
  CircleGeometry,
  Color,
  DoubleSide,
  DynamicDrawUsage,
  GridHelper,
  InstancedMesh,
  LineBasicMaterial,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  Object3D,
} from 'three';
import { TILE } from '../../config';
import { Rng } from '../../core/rng';
import type { BuildingType } from '../../data/factory';
import { ITEMS } from '../../data/items';
import { CELL_FLOOR, type DungeonData } from '../../dungeon/generator';
import { DIRS, MACHINE_TYPES, type Factory } from '../../factory/sim';
import { buildBuildingGeometry } from '../../models/factory';
import { buildPortalFrame } from '../../models/props';
import { merge } from '../../models/util';
import { Level } from './Level';

const POWERED = new Set<BuildingType>(['generator', 'wire', 'smelter', 'crusher', 'infuser', 'assembler', 'alchemy']);
const MAX_ITEMS = 700;

/** 차원집: 공장 격자 + 아래쪽 입구 */
export class HomeScene extends Level {
  readonly kind = 'home';
  readonly grid: DungeonData;
  readonly playerStart: { x: number; z: number; facing: number };
  private buildingMesh: Mesh | null = null;
  private buildingMat = new MeshLambertMaterial({ vertexColors: true, flatShading: true });
  private items: InstancedMesh;
  private lights: InstancedMesh;
  private cursor: Mesh;
  private gridLines: GridHelper;
  private swirl: Mesh;
  private geoCache = new Map<string, BufferGeometry>();
  private dummy = new Object3D();
  private color = new Color();
  private layoutKey = '';

  constructor(
    readonly factory: Factory,
    onExit: () => void,
  ) {
    super();
    const n = factory.size;
    const h = n + 3;
    const cells = new Uint8Array(n * h).fill(CELL_FLOOR);
    this.grid = {
      seed: 99,
      tier: 0,
      width: n,
      height: h,
      cells,
      rooms: [],
      roomIndex: new Int16Array(n * h).fill(-1),
      start: { x: Math.floor(n / 2), y: n + 1 },
      exit: { x: Math.floor(n / 2), y: n + 1 },
      nodes: [],
      monsters: [],
      decor: [],
    };
    this.setupLights(0x120e22, 0xe0d8ff, 0xfff0e0, 1.9, 2.2);
    this.buildTiles(this.grid, { floorA: 0x4a4660, floorB: 0x524e6a, wallSide: 0x2e2a44, wallTop: 0x6a5a9a }, new Rng(3), 1.4);

    // 입구 구역은 색이 다른 바닥
    const entrance = new Mesh(new BoxGeometry(n * TILE, 0.05, 3 * TILE), new MeshLambertMaterial({ color: 0x2a2640 }));
    entrance.position.set((n * TILE) / 2, 0.02, (n + 1.5) * TILE);
    entrance.receiveShadow = true;
    this.scene.add(entrance);

    const ex = (Math.floor(n / 2) + 0.5) * TILE;
    const ez = (n + 2) * TILE;
    const frame = this.addMesh(buildPortalFrame(0xc28cff), new MeshLambertMaterial({ vertexColors: true, flatShading: true }), ex, ez + 0.6, Math.PI);
    frame.scale.setScalar(0.9);
    this.swirl = new Mesh(
      new CircleGeometry(0.84, 6),
      new MeshBasicMaterial({ color: 0xc28cff, transparent: true, opacity: 0.5, side: DoubleSide, blending: AdditiveBlending, depthWrite: false }),
    );
    this.swirl.position.set(ex, 1.22, ez + 0.6);
    this.swirl.scale.setScalar(0.9);
    this.scene.add(this.swirl);
    this.obstacles.push({ x: ex, z: ez + 0.6, radius: 1 });
    this.interactables.push({ id: 'exit', x: ex, z: ez + 0.6, range: 2.8, label: '마을로', title: '차원마을로', action: onExit });
    this.playerStart = { x: ex, z: ez - 1.6, facing: Math.PI + Math.PI / 4 };

    this.items = new InstancedMesh(new BoxGeometry(0.42, 0.42, 0.42), new MeshLambertMaterial(), MAX_ITEMS);
    this.items.instanceMatrix.setUsage(DynamicDrawUsage);
    this.items.frustumCulled = false;
    this.items.castShadow = true;
    this.scene.add(this.items);
    this.lights = new InstancedMesh(new BoxGeometry(0.28, 0.28, 0.28), new MeshBasicMaterial(), n * n);
    this.lights.frustumCulled = false;
    this.scene.add(this.lights);

    this.cursor = new Mesh(new BoxGeometry(TILE * 0.96, 0.12, TILE * 0.96), new MeshBasicMaterial({ color: 0x7affc0, transparent: true, opacity: 0.45, depthWrite: false }));
    this.cursor.visible = false;
    this.scene.add(this.cursor);
    this.gridLines = new GridHelper(n * TILE, n, 0x9a8aff, 0x6a5aaa);
    this.gridLines.position.set((n * TILE) / 2, 0.03, (n * TILE) / 2);
    const gridMat = this.gridLines.material as LineBasicMaterial;
    gridMat.transparent = true;
    gridMat.opacity = 0.35;
    this.gridLines.visible = false;
    this.scene.add(this.gridLines);

    this.rebuild();
  }

  get center(): { x: number; z: number } {
    return { x: (this.factory.size * TILE) / 2, z: ((this.factory.size + 3) * TILE) / 2 };
  }

  setBuildMode(on: boolean): void {
    this.gridLines.visible = on;
    if (!on) this.cursor.visible = false;
  }

  showCursor(x: number, y: number, ok: boolean): void {
    this.cursor.visible = true;
    this.cursor.position.set((x + 0.5) * TILE, 0.08, (y + 0.5) * TILE);
    (this.cursor.material as MeshBasicMaterial).color.setHex(ok ? 0x7affc0 : 0xff5a5a);
  }

  hideCursor(): void {
    this.cursor.visible = false;
  }

  /** 건물 배치가 바뀌면 전체를 한 덩어리로 다시 합친다 (그리기 호출 1번) */
  rebuild(): void {
    const f = this.factory;
    const parts: BufferGeometry[] = [];
    for (const b of f.state.buildings) {
      let conn: boolean[] | undefined;
      let key: string = b.type;
      if (b.type === 'wire') {
        conn = DIRS.map(([dx, dy]) => {
          const o = f.at(b.x + dx, b.y + dy);
          return !!o && POWERED.has(o.type);
        });
        key += conn.map((c) => (c ? 1 : 0)).join('');
      }
      let base = this.geoCache.get(key);
      if (!base) {
        base = buildBuildingGeometry(b.type, conn);
        this.geoCache.set(key, base);
      }
      const g = base.clone();
      const [dx, dy] = DIRS[b.dir];
      if (b.type !== 'wire') g.rotateY(Math.atan2(dx, dy));
      g.translate((b.x + 0.5) * TILE, 0, (b.y + 0.5) * TILE);
      parts.push(g);
    }
    if (this.buildingMesh) {
      this.scene.remove(this.buildingMesh);
      this.buildingMesh.geometry.dispose();
      this.buildingMesh = null;
    }
    if (parts.length) {
      this.buildingMesh = new Mesh(merge(parts), this.buildingMat);
      this.buildingMesh.castShadow = true;
      this.buildingMesh.receiveShadow = true;
      this.scene.add(this.buildingMesh);
    }
    this.layoutKey = this.currentKey();
  }

  private currentKey(): string {
    return this.factory.state.buildings.map((b) => `${b.type}${b.x},${b.y},${b.dir}`).join('|');
  }

  update(dt: number, focus: { x: number; z: number }): void {
    super.update(dt, focus);
    this.swirl.rotation.z += dt * 1.4;
    if (this.currentKey() !== this.layoutKey) this.rebuild();

    // 레일 위 아이템
    const f = this.factory;
    let i = 0;
    const m = new Matrix4();
    for (const b of f.state.buildings) {
      if (!b.item || (b.type !== 'belt' && b.type !== 'splitter') || i >= MAX_ITEMS) continue;
      const [dx, dy] = DIRS[b.dir];
      const k = (b.progress ?? 0) - 0.5;
      this.dummy.position.set((b.x + 0.5 + dx * k) * TILE, 0.45, (b.y + 0.5 + dy * k) * TILE);
      this.dummy.rotation.set(0, (b.x + b.y) * 0.7, 0);
      this.dummy.updateMatrix();
      this.items.setMatrixAt(i, this.dummy.matrix);
      this.items.setColorAt(i, this.color.setHex(ITEMS[b.item]?.color ?? 0xffffff));
      i++;
    }
    this.items.count = i;
    this.items.instanceMatrix.needsUpdate = true;
    if (this.items.instanceColor) this.items.instanceColor.needsUpdate = true;

    // 기계 상태등: 초록=가동, 빨강=전력 없음, 노랑=막힘, 회색=대기
    let j = 0;
    for (const b of f.state.buildings) {
      if (!MACHINE_TYPES.has(b.type) && b.type !== 'generator') continue;
      let c = 0x8a8a9a;
      if (b.type === 'generator') c = (b.fuel ?? 0) > 0 ? 0x5affd0 : 0xff5a5a;
      else {
        const s = f.status(b);
        c = s === 'working' ? 0x6aff6a : s === 'no-power' ? 0xff4a4a : s === 'blocked' ? 0xffd04a : s === 'no-recipe' ? 0xff9a3a : 0x8a8a9a;
      }
      const bob = Math.sin(this.time * 4 + b.x) * 0.06;
      m.makeTranslation((b.x + 0.5) * TILE + 0.6, 2.1 + bob, (b.y + 0.5) * TILE + 0.6);
      this.lights.setMatrixAt(j, m);
      this.lights.setColorAt(j, this.color.setHex(c));
      j++;
    }
    this.lights.count = j;
    this.lights.instanceMatrix.needsUpdate = true;
    if (this.lights.instanceColor) this.lights.instanceColor.needsUpdate = true;
  }

  dispose(): void {
    for (const g of this.geoCache.values()) g.dispose();
    super.dispose();
  }
}
