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
import { buildGround, type GroundOptions, type GroundStyle } from '../../models/terrain';
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
  /** 캐릭터를 가릴 수 있는 큰 물체 (나무·집·광맥). 가리면 반투명해진다 */
  private occluders: { mesh: Mesh; mat: Material & { opacity: number; transparent: boolean }; x: number; z: number; radius: number; height: number; fade: number }[] = [];

  constructor() {
    this.effects = new Effects(this.scene);
    this.scene.add(this.particles.mesh);
  }

  /** 하늘빛 (마을 날씨가 바꾼다) */
  hemi: HemisphereLight | null = null;

  protected setupLights(background: number, ambient: number, sun: number, hemiIntensity = 1.7, sunIntensity = 2.4): void {
    this.scene.background = new Color(background);
    this.hemi = new HemisphereLight(ambient, background, hemiIntensity);
    this.scene.add(this.hemi);
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
  protected buildTiles(grid: Grid, colors: TileColors, rng: Rng, wallHeight = WALL_HEIGHT, drawFloor = true): void {
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

    if (drawFloor) {
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
    }

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

  /** 격자 대신 자연스러운 바닥 (땅 얼룩 + 판 + 소품) */
  protected buildGround(grid: Grid, style: GroundStyle, opts: GroundOptions): void {
    const g = buildGround(grid, style, opts);
    this.scene.add(g.ground);
    if (g.details) this.scene.add(g.details);
    if (g.glow) this.scene.add(g.glow);
    if (g.veins) this.scene.add(g.veins);
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

  /**
   * 캐릭터 앞(카메라 쪽)에 서서 가릴 수 있는 물체로 등록한다.
   * ownMaterial이 아니면 재질을 복제해 이 물체만 투명하게 만들 수 있게 한다
   */
  protected addOccluder(mesh: Mesh, x: number, z: number, radius: number, height: number, ownMaterial = false): void {
    if (!ownMaterial) mesh.material = (mesh.material as Material).clone();
    this.occluders.push({ mesh, mat: mesh.material as Material & { opacity: number; transparent: boolean }, x, z, radius, height, fade: 1 });
  }

  /** 카메라와 캐릭터 사이에 선 물체를 흐리게 한다 */
  private fadeOccluders(dt: number, focus: { x: number; z: number }): void {
    // 카메라는 +x,+z 쪽 위에서 내려다본다. 높이 1당 가로로 약 1.2만큼 가린다
    const dx = Math.SQRT1_2;
    const dz = Math.SQRT1_2;
    for (const o of this.occluders) {
      const rx = o.x - focus.x;
      const rz = o.z - focus.z;
      const along = rx * dx + rz * dz;
      const side = Math.abs(rx * dz - rz * dx);
      const hides = o.mesh.visible && along > -o.radius * 0.5 && along < o.height * 1.2 + o.radius && side < o.radius + 0.7;
      const target = hides ? 0.3 : 1;
      o.fade += (target - o.fade) * (1 - Math.exp(-dt * 10));
      if (Math.abs(o.fade - target) < 0.01) o.fade = target;
      const transparent = o.fade < 0.999;
      if (o.mat.transparent !== transparent) {
        o.mat.transparent = transparent;
        o.mat.needsUpdate = true;
      }
      o.mat.opacity = o.fade;
      // 흐려진 물체는 그림자를 계속 드리우되 깊이를 덜 써서 뒤의 캐릭터가 보이게
      o.mat.depthWrite = !transparent;
    }
  }

  /** 매 프레임 공통 처리. 하위 클래스가 덧붙인다 */
  update(dt: number, focus: { x: number; z: number }): void {
    this.time += dt;
    this.fadeOccluders(dt, focus);
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
