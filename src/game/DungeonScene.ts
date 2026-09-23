import {
  AdditiveBlending,
  BoxGeometry,
  CircleGeometry,
  Color,
  DirectionalLight,
  DoubleSide,
  Group,
  HemisphereLight,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  Object3D,
  RingGeometry,
  Scene,
  Vector3,
} from 'three';
import { TILE, WALL_HEIGHT } from '../config';
import { Rng } from '../core/rng';
import { NODES, type NodeDef } from '../data/nodes';
import { ITEMS } from '../data/items';
import { themeForTier, type DungeonTheme } from '../data/themes';
import type { CircleObstacle } from '../dungeon/collision';
import { isFloor, type DungeonData } from '../dungeon/generator';
import { buildDecorGeometry, buildNodeGeometry, buildPortalFrame } from '../models/props';
import { merge, paint, paintTop } from '../models/util';
import { Particles } from './Particles';

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
  /** 부서지는 중 (0 → 1) */
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

/** 던전 데이터를 3D 장면으로 만들고 채집물·차원문의 상태를 관리한다 */
export class DungeonScene {
  readonly scene = new Scene();
  readonly theme: DungeonTheme;
  readonly nodes: NodeInstance[] = [];
  readonly portals: Portal[] = [];
  readonly obstacles: CircleObstacle[] = [];
  readonly particles = new Particles();
  readonly sun: DirectionalLight;
  readonly heroMaterial: MeshLambertMaterial;
  private time = 0;
  private rng: Rng;

  constructor(readonly data: DungeonData) {
    this.theme = themeForTier(data.tier);
    this.rng = new Rng(data.seed ^ 0x5bd1e995);
    this.scene.background = new Color(this.theme.background);
    this.heroMaterial = new MeshLambertMaterial({ vertexColors: true, flatShading: true });

    const hemi = new HemisphereLight(this.theme.ambient, this.theme.background, 1.7);
    this.scene.add(hemi);
    this.sun = new DirectionalLight(this.theme.sun, 2.4);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(1024, 1024);
    const sc = this.sun.shadow.camera;
    sc.left = sc.bottom = -16;
    sc.right = sc.top = 16;
    sc.near = 1;
    sc.far = 60;
    this.sun.shadow.bias = -0.0015;
    this.sun.shadow.normalBias = 0.03;
    this.scene.add(this.sun, this.sun.target);

    this.buildTiles();
    this.buildDecor();
    this.buildNodes();
    this.buildPortals();
    this.scene.add(this.particles.mesh);
  }

  /** 타일 좌표 → 월드 좌표 (타일 중심) */
  static toWorld(tx: number, ty: number): { x: number; z: number } {
    return { x: (tx + 0.5) * TILE, z: (ty + 0.5) * TILE };
  }

  get playerStart(): { x: number; z: number } {
    const p = DungeonScene.toWorld(this.data.start.x, this.data.start.y);
    // 입구 차원문 앞(카메라 쪽)에 선다
    return { x: p.x + 1.4, z: p.z + 1.4 };
  }

  private buildTiles(): void {
    const { width, height } = this.data;
    const floorCells: [number, number][] = [];
    const wallCells: [number, number][] = [];
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (isFloor(this.data, x, y)) {
          floorCells.push([x, y]);
          continue;
        }
        let nearFloor = false;
        for (let dy = -1; dy <= 1 && !nearFloor; dy++) {
          for (let dx = -1; dx <= 1 && !nearFloor; dx++) nearFloor = isFloor(this.data, x + dx, y + dy);
        }
        if (nearFloor) wallCells.push([x, y]);
      }
    }

    const m = new Matrix4();
    const c = new Color();
    const a = new Color(this.theme.floorA);
    const b = new Color(this.theme.floorB);

    const floorGeo = new BoxGeometry(TILE, 0.3, TILE);
    floorGeo.translate(0, -0.15, 0);
    const floor = new InstancedMesh(floorGeo, new MeshLambertMaterial(), floorCells.length);
    floorCells.forEach(([x, y], i) => {
      const p = DungeonScene.toWorld(x, y);
      m.makeTranslation(p.x, 0, p.z);
      floor.setMatrixAt(i, m);
      c.copy((x + y) % 2 ? a : b).multiplyScalar(this.rng.range(0.93, 1.05));
      floor.setColorAt(i, c);
    });
    floor.receiveShadow = true;
    this.scene.add(floor);

    const wallGeo = paintTop(paint(new BoxGeometry(TILE, WALL_HEIGHT, TILE), this.theme.wallSide), this.theme.wallTop);
    wallGeo.translate(0, WALL_HEIGHT / 2 - 0.3, 0);
    const walls = new InstancedMesh(
      wallGeo,
      new MeshLambertMaterial({ vertexColors: true }),
      wallCells.length,
    );
    const dummy = new Object3D();
    wallCells.forEach(([x, y], i) => {
      const p = DungeonScene.toWorld(x, y);
      dummy.position.set(p.x, 0, p.z);
      dummy.scale.set(1, this.rng.range(0.85, 1.3), 1);
      dummy.updateMatrix();
      walls.setMatrixAt(i, dummy.matrix);
      walls.setColorAt(i, c.setScalar(this.rng.range(0.85, 1.08)));
    });
    walls.receiveShadow = true;
    this.scene.add(walls);
  }

  private buildDecor(): void {
    if (this.data.decor.length === 0) return;
    const m = new Matrix4();
    const s = new Vector3();
    const parts = this.data.decor.map((d) => {
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
    this.data.nodes.forEach((spawn, i) => {
      const def = NODES[spawn.nodeId];
      const material = new MeshLambertMaterial({ vertexColors: true, flatShading: true });
      if (def.style === 'crystal') material.emissive.setHex(def.accentColor).multiplyScalar(0.22);
      const mesh = new Mesh(buildNodeGeometry(def, this.data.seed + i * 131), material);
      const p = DungeonScene.toWorld(spawn.x, spawn.y);
      mesh.position.set(p.x, 0, p.z);
      mesh.rotation.y = def.style === 'chest' ? Math.PI / 4 : this.rng.range(0, Math.PI * 2);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      this.scene.add(mesh);
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
      // 카메라를 바라보도록 돌린다
      group.rotation.y = Math.PI / 4;
      const frame = new Mesh(buildPortalFrame(color), new MeshLambertMaterial({ vertexColors: true, flatShading: true }));
      frame.castShadow = true;
      const swirlMat = new MeshBasicMaterial({
        color,
        transparent: true,
        opacity: kind === 'exit' ? 0.5 : 0.2,
        side: DoubleSide,
        blending: AdditiveBlending,
        depthWrite: false,
      });
      const swirl = new Mesh(new CircleGeometry(0.84, 6), swirlMat);
      swirl.position.y = 1.35;
      const glowMat = swirlMat.clone();
      glowMat.opacity = kind === 'exit' ? 0.3 : 0.1;
      const glow = new Mesh(new RingGeometry(1.4, 2.1, 24), glowMat);
      glow.rotation.x = -Math.PI / 2;
      glow.position.y = 0.03;
      group.add(frame, swirl, glow);
      this.scene.add(group);
      this.obstacles.push({ x: p.x, z: p.z, radius: 1.15 });
      this.portals.push({ group, x: p.x, z: p.z, kind, swirl, glow });
    };
    make(this.data.start.x, this.data.start.y, 'entrance');
    make(this.data.exit.x, this.data.exit.y, 'exit');
  }

  /** 채집물을 한 번 친다. 나온 아이템을 돌려준다 */
  hitNode(node: NodeInstance): Drop[] {
    if (!node.alive || node.dying > 0) return [];
    node.hp -= 1;
    node.shake = 1;
    node.flash = 1;
    const drops: Drop[] = [];
    const color = node.def.accentColor;
    this.particles.burst(node.x, 0.7, node.z, color, 7);
    if (node.def.style === 'chest') {
      // 상자는 그 단계의 자원을 여러 개 준다
      const pool = this.theme.nodes.map((id) => NODES[id].itemId);
      for (let i = 0; i < node.def.bonus; i++) drops.push({ itemId: this.rng.pick(pool), count: 1 });
    } else {
      drops.push({ itemId: node.def.itemId, count: 1 });
    }
    if (node.hp <= 0) {
      node.dying = 0.001;
      if (node.def.style !== 'chest') drops.push({ itemId: node.def.itemId, count: node.def.bonus });
      this.particles.burst(node.x, 0.6, node.z, node.def.baseColor, 12, 1.3);
      this.particles.burst(node.x, 0.8, node.z, color, 8, 1.1);
      const idx = this.obstacles.indexOf(node.obstacle);
      if (idx >= 0) this.obstacles.splice(idx, 1);
    }
    // 같은 아이템끼리 합친다
    const merged = new Map<string, number>();
    for (const d of drops) merged.set(d.itemId, (merged.get(d.itemId) ?? 0) + d.count);
    return [...merged].filter(([id]) => ITEMS[id]).map(([itemId, count]) => ({ itemId, count }));
  }

  update(dt: number, focus: { x: number; z: number }): void {
    this.time += dt;
    // 그림자는 플레이어 주변만 계산한다
    this.sun.position.set(focus.x - 10, 18, focus.z + 6);
    this.sun.target.position.set(focus.x, 0, focus.z);

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

    for (const p of this.portals) {
      p.swirl.rotation.z += dt * (p.kind === 'exit' ? 2.2 : 0.6);
      const pulse = 1 + Math.sin(this.time * 3) * 0.06;
      p.swirl.scale.setScalar(pulse);
      p.glow.scale.setScalar(1 + Math.sin(this.time * 2) * 0.05);
      if (p.kind === 'exit' && Math.random() < dt * 8) {
        const a = Math.random() * Math.PI * 2;
        this.particles.burst(p.x + Math.cos(a) * 0.8, 0.3, p.z + Math.sin(a) * 0.8, this.theme.portalColor, 1, 0.3);
      }
    }
    this.particles.update(dt);
  }

  dispose(): void {
    this.scene.traverse((o) => {
      const mesh = o as Mesh;
      if (mesh.geometry) mesh.geometry.dispose();
      const mat = mesh.material;
      if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
      else if (mat) mat.dispose();
    });
  }
}
