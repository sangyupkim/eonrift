import {
  BoxGeometry,
  Color,
  DirectionalLight,
  HemisphereLight,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshLambertMaterial,
  Object3D,
  Scene,
  type Material,
} from 'three';
import { TILE, WALL_HEIGHT } from '../../config';
import { Rng } from '../../core/rng';
import type { CircleObstacle } from '../../dungeon/collision';
import { isFloor, type DungeonData } from '../../dungeon/generator';
import { paint, paintTop } from '../../models/util';
import { Effects } from '../Effects';
import { Particles } from '../Particles';

export type Grid = Pick<DungeonData, 'width' | 'height' | 'cells'>;

export interface Interactable {
  id: string;
  x: number;
  z: number;
  range: number;
  label: string;
  /** 머리 위에 표시할 이름 (NPC 등) */
  title?: string;
  action: () => void;
  /** false면 버튼이 뜨지 않는다 */
  enabled?: () => boolean;
}

export interface TileColors {
  floorA: number;
  floorB: number;
  wallSide: number;
  wallTop: number;
}

export type LevelKind = 'village' | 'dungeon' | 'home';

/** 마을, 던전, 차원집이 공유하는 장면 기반 */
export abstract class Level {
  readonly scene = new Scene();
  readonly heroMaterial = new MeshLambertMaterial({ vertexColors: true, flatShading: true });
  readonly particles = new Particles();
  readonly effects: Effects;
  readonly obstacles: CircleObstacle[] = [];
  readonly interactables: Interactable[] = [];
  sun!: DirectionalLight;
  abstract readonly kind: LevelKind;
  abstract readonly grid: DungeonData;
  abstract readonly playerStart: { x: number; z: number; facing: number };
  protected time = 0;

  constructor() {
    this.effects = new Effects(this.scene);
    this.scene.add(this.particles.mesh);
  }

  protected setupLights(background: number, ambient: number, sun: number, hemiIntensity = 1.7, sunIntensity = 2.4): void {
    this.scene.background = new Color(background);
    this.scene.add(new HemisphereLight(ambient, background, hemiIntensity));
    this.sun = new DirectionalLight(sun, sunIntensity);
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
  }

  /** 바닥과 벽을 인스턴싱으로 그린다 */
  protected buildTiles(grid: Grid, colors: TileColors, rng: Rng, wallHeight = WALL_HEIGHT): void {
    const { width, height } = grid;
    const floorCells: [number, number][] = [];
    const wallCells: [number, number][] = [];
    for (let y = -1; y <= height; y++) {
      for (let x = -1; x <= width; x++) {
        if (isFloor(grid, x, y)) {
          floorCells.push([x, y]);
          continue;
        }
        let nearFloor = false;
        for (let dy = -1; dy <= 1 && !nearFloor; dy++) {
          for (let dx = -1; dx <= 1 && !nearFloor; dx++) nearFloor = isFloor(grid, x + dx, y + dy);
        }
        if (nearFloor) wallCells.push([x, y]);
      }
    }
    const m = new Matrix4();
    const c = new Color();
    const a = new Color(colors.floorA);
    const b = new Color(colors.floorB);

    const floorGeo = new BoxGeometry(TILE, 0.3, TILE);
    floorGeo.translate(0, -0.15, 0);
    const floor = new InstancedMesh(floorGeo, new MeshLambertMaterial(), floorCells.length);
    floorCells.forEach(([x, y], i) => {
      m.makeTranslation((x + 0.5) * TILE, 0, (y + 0.5) * TILE);
      floor.setMatrixAt(i, m);
      c.copy((x + y) % 2 ? a : b).multiplyScalar(rng.range(0.93, 1.05));
      floor.setColorAt(i, c);
    });
    floor.receiveShadow = true;
    this.scene.add(floor);

    if (wallCells.length === 0) return;
    const wallGeo = paintTop(paint(new BoxGeometry(TILE, wallHeight, TILE), colors.wallSide), colors.wallTop);
    wallGeo.translate(0, wallHeight / 2 - 0.3, 0);
    const walls = new InstancedMesh(wallGeo, new MeshLambertMaterial({ vertexColors: true }), wallCells.length);
    const dummy = new Object3D();
    wallCells.forEach(([x, y], i) => {
      dummy.position.set((x + 0.5) * TILE, 0, (y + 0.5) * TILE);
      dummy.scale.set(1, rng.range(0.85, 1.3), 1);
      dummy.updateMatrix();
      walls.setMatrixAt(i, dummy.matrix);
      walls.setColorAt(i, c.setScalar(rng.range(0.85, 1.08)));
    });
    walls.receiveShadow = true;
    this.scene.add(walls);
  }

  protected addMesh(geo: Mesh['geometry'], material: Material, x: number, z: number, rotY = 0, shadow = true): Mesh {
    const mesh = new Mesh(geo, material);
    mesh.position.set(x, 0, z);
    mesh.rotation.y = rotY;
    mesh.castShadow = shadow;
    mesh.receiveShadow = true;
    this.scene.add(mesh);
    return mesh;
  }

  /** 매 프레임 공통 처리. 하위 클래스가 덧붙인다 */
  update(dt: number, focus: { x: number; z: number }): void {
    this.time += dt;
    this.sun.position.set(focus.x - 10, 18, focus.z + 6);
    this.sun.target.position.set(focus.x, 0, focus.z);
    this.particles.update(dt);
    this.effects.update(dt);
  }

  dispose(): void {
    this.scene.traverse((o) => {
      const mesh = o as Mesh;
      if (mesh.geometry) mesh.geometry.dispose();
      const mat = mesh.material;
      if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
      else if (mat) mat.dispose();
    });
  }
}
