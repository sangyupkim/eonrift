import {
  AdditiveBlending,
  BoxGeometry,
  BufferGeometry,
  CircleGeometry,
  Color,
  CylinderGeometry,
  DoubleSide,
  DynamicDrawUsage,
  Group,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  NormalBlending,
  Object3D,
  OctahedronGeometry,
  PlaneGeometry,
  RingGeometry,
  Scene,
  SphereGeometry,
  TorusGeometry,
} from 'three';

export type TelegraphShape =
  | { kind: 'circle'; r: number }
  | { kind: 'cone'; r: number; angle: number }
  | { kind: 'line'; length: number; width: number };

/** 적의 공격 범위를 바닥에 미리 보여 준다. 안쪽 색이 차오르면 공격이 나간다 */
export class Telegraph {
  readonly group = new Group();
  private fill: Mesh;
  t = 0;

  constructor(
    readonly shape: TelegraphShape,
    public x: number,
    public z: number,
    public facing: number,
    readonly duration: number,
  ) {
    const outlineMat = new MeshBasicMaterial({ color: 0xff3030, transparent: true, opacity: 0.28, depthWrite: false, side: DoubleSide });
    const fillMat = new MeshBasicMaterial({ color: 0xff2a2a, transparent: true, opacity: 0.4, depthWrite: false, side: DoubleSide });
    const geo = () => {
      let g: BufferGeometry;
      if (shape.kind === 'circle') g = new CircleGeometry(shape.r, 32);
      else if (shape.kind === 'cone') {
        g = new CircleGeometry(shape.r, 24, -shape.angle / 2, shape.angle);
        g.rotateZ(Math.PI / 2);
      } else {
        g = new PlaneGeometry(shape.width, shape.length);
        g.translate(0, shape.length / 2, 0);
      }
      // 바닥에 눕히면 +y가 +z(앞)를 향하도록 뒤집는다
      g.rotateX(Math.PI / 2);
      return g;
    };
    const outline = new Mesh(geo(), outlineMat);
    this.fill = new Mesh(geo(), fillMat);
    outline.position.y = 0.04;
    this.fill.position.y = 0.05;
    this.fill.scale.setScalar(0.001);
    this.group.add(outline, this.fill);
    this.sync();
  }

  sync(): void {
    this.group.position.set(this.x, 0, this.z);
    this.group.rotation.y = this.facing;
  }

  /** 끝나면 true */
  update(dt: number): boolean {
    this.t += dt;
    const k = Math.min(1, this.t / this.duration);
    if (this.shape.kind === 'line') this.fill.scale.set(1, 1, Math.max(0.001, k));
    else this.fill.scale.setScalar(Math.max(0.001, k));
    return this.t >= this.duration;
  }

  contains(px: number, pz: number, pr = 0): boolean {
    const dx = px - this.x;
    const dz = pz - this.z;
    const s = Math.sin(this.facing);
    const c = Math.cos(this.facing);
    const along = dx * s + dz * c;
    const side = dx * c - dz * s;
    const dist = Math.hypot(dx, dz);
    switch (this.shape.kind) {
      case 'circle':
        return dist <= this.shape.r + pr;
      case 'cone':
        if (dist > this.shape.r + pr) return false;
        if (dist < pr + 0.3) return true;
        return Math.abs(Math.atan2(side, along)) <= this.shape.angle / 2 + pr / Math.max(dist, 0.5);
      case 'line':
        return along >= -pr && along <= this.shape.length + pr && Math.abs(side) <= this.shape.width / 2 + pr;
    }
  }

  dispose(): void {
    this.group.traverse((o) => {
      const m = o as Mesh;
      if (m.geometry) m.geometry.dispose();
      if (m.material) (m.material as MeshBasicMaterial).dispose();
    });
  }
}

interface Effect {
  obj: Object3D;
  t: number;
  duration: number;
  update: (k: number, dt: number) => void;
}

const glow = (color: number, opacity = 0.8) =>
  new MeshBasicMaterial({ color, transparent: true, opacity, depthWrite: false, side: DoubleSide, blending: AdditiveBlending });

/** 색을 밝게(흰색 쪽으로) 섞는다: 효과의 가운데 심지 색 */
export function lighten(color: number, k = 0.6): number {
  const c = new Color(color).lerp(new Color(0xffffff), k);
  return c.getHex();
}

interface Spark {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  life: number;
  maxLife: number;
  size: number;
  gravity: number;
  drag: number;
}

const SPARK_MAX = 360;

/** 빛나는 불꽃 입자 (더하기 합성, 한 번에 그린다) */
class Sparks {
  readonly mesh: InstancedMesh;
  private items: Spark[] = [];
  private colors: Color[] = [];
  private dummy = new Object3D();
  private hidden = new Matrix4().makeScale(0, 0, 0);

  constructor() {
    const mat = new MeshBasicMaterial({ transparent: true, opacity: 1, depthWrite: false, blending: AdditiveBlending });
    this.mesh = new InstancedMesh(new OctahedronGeometry(1, 0), mat, SPARK_MAX);
    this.mesh.instanceMatrix.setUsage(DynamicDrawUsage);
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 5;
    const white = new Color(0xffffff);
    for (let i = 0; i < SPARK_MAX; i++) {
      this.mesh.setMatrixAt(i, this.hidden);
      this.mesh.setColorAt(i, white);
    }
  }

  add(x: number, y: number, z: number, vx: number, vy: number, vz: number, color: number, o: { life?: number; size?: number; gravity?: number; drag?: number } = {}): void {
    if (this.items.length >= SPARK_MAX) {
      this.items.shift();
      this.colors.shift();
    }
    const life = (o.life ?? 0.5) * (0.7 + Math.random() * 0.6);
    this.items.push({ x, y, z, vx, vy, vz, life: 0, maxLife: life, size: (o.size ?? 0.09) * (0.7 + Math.random() * 0.6), gravity: o.gravity ?? 0, drag: o.drag ?? 2 });
    this.colors.push(new Color(color));
  }

  update(dt: number): void {
    let w = 0;
    for (let i = 0; i < this.items.length; i++) {
      const p = this.items[i];
      p.life += dt;
      if (p.life >= p.maxLife) continue;
      const d = Math.exp(-p.drag * dt);
      p.vx *= d;
      p.vz *= d;
      p.vy = p.vy * d - p.gravity * dt;
      p.x += p.vx * dt;
      p.y = Math.max(0.05, p.y + p.vy * dt);
      p.z += p.vz * dt;
      this.items[w] = p;
      this.colors[w] = this.colors[i];
      const k = p.life / p.maxLife;
      // 빨리 커졌다가 천천히 사그라든다
      const s = p.size * Math.min(1, k * 6) * (1 - k);
      this.dummy.position.set(p.x, p.y, p.z);
      this.dummy.rotation.set(p.life * 6, p.life * 4, 0);
      this.dummy.scale.set(s, s * 1.6, s);
      this.dummy.updateMatrix();
      this.mesh.setMatrixAt(w, this.dummy.matrix);
      this.mesh.setColorAt(w, this.colors[w]);
      w++;
    }
    this.items.length = w;
    this.colors.length = w;
    for (let i = w; i < SPARK_MAX; i++) this.mesh.setMatrixAt(i, this.hidden);
    this.mesh.count = SPARK_MAX;
    this.mesh.instanceMatrix.needsUpdate = true;
    if (this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true;
  }
}

/** 짧게 나타났다 사라지는 시각 효과들 */
export class Effects {
  private list: Effect[] = [];
  private sparkSys = new Sparks();

  constructor(private scene: Scene) {
    scene.add(this.sparkSys.mesh);
  }

  add(obj: Object3D, duration: number, update: (k: number, dt: number) => void): void {
    this.scene.add(obj);
    this.list.push({ obj, t: 0, duration, update });
    update(0, 0);
  }

  /** 빛나는 불꽃 튀기기. up: 위로 떠오르기(마법), 아니면 사방으로 튀기 */
  sparks(x: number, y: number, z: number, color: number, count: number, o: { speed?: number; up?: boolean; spread?: number; life?: number; size?: number } = {}): void {
    const sp = o.speed ?? 4;
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = (o.spread ?? 0) * Math.random();
      const v = sp * (0.4 + Math.random() * 0.6);
      const c = Math.random() < 0.3 ? lighten(color, 0.7) : color;
      if (o.up) this.sparkSys.add(x + Math.cos(a) * r, y + Math.random() * 0.3, z + Math.sin(a) * r, Math.cos(a) * v * 0.15, v * 0.5 + 0.8, Math.sin(a) * v * 0.15, c, { life: o.life ?? 0.9, size: o.size ?? 0.08, gravity: -0.5, drag: 1.5 });
      else this.sparkSys.add(x + Math.cos(a) * r, y, z + Math.sin(a) * r, Math.cos(a) * v, (Math.random() * 0.8 + 0.2) * v * 0.7, Math.sin(a) * v, c, { life: o.life ?? 0.45, size: o.size ?? 0.09, gravity: 9, drag: 2.5 });
    }
  }

  /** 칼 휘두른 궤적: 색이 들어간 넓은 궤적 + 하얀 칼날 심지가 빠르게 휩쓸고 불꽃이 튄다 */
  slash(x: number, z: number, facing: number, radius: number, color: number, angle = 2.2, y = 0.9): void {
    const group = new Group();
    const mk = (inner: number, outer: number, mat: MeshBasicMaterial) => {
      const g = new RingGeometry(inner, outer, 28, 1, -angle / 2, angle);
      g.rotateZ(Math.PI / 2);
      g.rotateX(Math.PI / 2);
      const m = new Mesh(g, mat);
      group.add(m);
      return mat;
    };
    const wide = mk(radius * 0.35, radius, glow(color, 0.65));
    const mid = mk(radius * 0.7, radius * 0.97, glow(lighten(color, 0.3), 0.7));
    const core = mk(radius * 0.9, radius * 1.02, glow(0xffffff, 0.95));
    group.position.set(x, y, z);
    const full = angle >= Math.PI * 1.9;
    // 한쪽 끝에서 반대쪽으로 휩쓴다
    const from = facing - (full ? 0 : angle * 0.35);
    const to = facing + (full ? Math.PI * 0.6 : angle * 0.1);
    this.add(group, full ? 0.36 : 0.26, (k) => {
      const e = 1 - Math.pow(1 - Math.min(1, k * 2.2), 3);
      group.rotation.y = from + (to - from) * e;
      group.scale.setScalar(0.8 + e * 0.3);
      wide.opacity = 0.65 * (1 - k * k);
      mid.opacity = 0.7 * (1 - k);
      core.opacity = 0.95 * (1 - k) * (1 - k);
    });
    // 칼끝을 따라 불꽃
    const n = Math.round(6 + angle * 3);
    for (let i = 0; i < n; i++) {
      const a = facing + (Math.random() - 0.5) * angle;
      const px = x + Math.sin(a) * radius * 0.9;
      const pz = z + Math.cos(a) * radius * 0.9;
      this.sparkSys.add(px, y, pz, Math.sin(a) * 3 + Math.cos(a) * 2, 1 + Math.random() * 2, Math.cos(a) * 3 - Math.sin(a) * 2, Math.random() < 0.4 ? 0xffffff : color, { life: 0.35, size: 0.08, gravity: 6, drag: 3 });
    }
  }

  /** 퍼져 나가는 고리: 안쪽이 번쩍이고, 굵은 고리와 얇은 고리가 차례로 퍼진다 */
  ring(x: number, z: number, radius: number, color: number, duration = 0.35, y = 0.1): void {
    const group = new Group();
    group.position.set(x, y, z);
    const disc = new CircleGeometry(1, 32);
    disc.rotateX(-Math.PI / 2);
    const flashMat = glow(lighten(color, 0.4), 0.6);
    const flash = new Mesh(disc, flashMat);
    const g1 = new RingGeometry(0.78, 1, 40);
    g1.rotateX(-Math.PI / 2);
    const m1 = glow(color, 0.95);
    const r1 = new Mesh(g1, m1);
    const g2 = new RingGeometry(0.93, 1, 40);
    g2.rotateX(-Math.PI / 2);
    const m2 = glow(0xffffff, 0.9);
    const r2 = new Mesh(g2, m2);
    r2.position.y = 0.02;
    group.add(flash, r1, r2);
    this.add(group, duration * 1.3, (k) => {
      const e = 1 - Math.pow(1 - k, 2.5);
      r1.scale.setScalar(0.2 + radius * e);
      m1.opacity = 0.95 * (1 - k);
      const k2 = Math.max(0, (k - 0.15) / 0.85);
      r2.scale.setScalar(0.1 + radius * 0.85 * (1 - Math.pow(1 - k2, 2)));
      m2.opacity = 0.9 * (1 - k2) * (k2 > 0 ? 1 : 0);
      flash.scale.setScalar(radius * 0.6 * Math.min(1, k * 5));
      flashMat.opacity = 0.6 * Math.max(0, 1 - k * 3);
    });
    const n = Math.round(8 + radius * 5);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + Math.random() * 0.3;
      const v = radius * 2.2;
      this.sparkSys.add(x + Math.cos(a) * 0.3, y + 0.2, z + Math.sin(a) * 0.3, Math.cos(a) * v, 0.6 + Math.random(), Math.sin(a) * v, Math.random() < 0.35 ? 0xffffff : color, { life: 0.45, size: 0.09, gravity: 2, drag: 3.2 });
    }
  }

  /** 두 점 사이를 지그재그로 잇는 번개: 색 있는 굵은 줄기 + 하얀 심지 + 맞은 곳 번쩍 */
  bolt(x1: number, z1: number, x2: number, z2: number, color: number): void {
    const group = new Group();
    const outer = glow(color, 0.8);
    const core = glow(0xffffff, 1);
    const segs = 7;
    let px = x1;
    let pz = z1;
    let py = 1.2;
    for (let i = 1; i <= segs; i++) {
      const k = i / segs;
      const last = i === segs;
      const nx = x1 + (x2 - x1) * k + (last ? 0 : (Math.random() - 0.5) * 0.9);
      const nz = z1 + (z2 - z1) * k + (last ? 0 : (Math.random() - 0.5) * 0.9);
      const ny = last ? 1 : 1.1 + (Math.random() - 0.5) * 0.5;
      const len = Math.hypot(nx - px, nz - pz, ny - py);
      for (const [mat, w] of [[outer, 0.2], [core, 0.07]] as const) {
        const seg = new Mesh(new BoxGeometry(w, w, len), mat);
        seg.position.set((px + nx) / 2, (py + ny) / 2, (pz + nz) / 2);
        seg.lookAt(nx, ny, nz);
        group.add(seg);
      }
      px = nx;
      pz = nz;
      py = ny;
    }
    const hit = new Mesh(new SphereGeometry(0.5, 10, 8), glow(lighten(color, 0.3), 0.9));
    hit.position.set(x2, 1, z2);
    group.add(hit);
    this.add(group, 0.28, (k) => {
      // 번개는 두어 번 깜빡이며 사라진다
      const flick = k < 0.5 ? (Math.floor(k * 16) % 2 ? 0.55 : 1) : 1 - k;
      outer.opacity = 0.8 * flick;
      core.opacity = flick;
      hit.scale.setScalar(0.5 + k * 1.2);
      (hit.material as MeshBasicMaterial).opacity = 0.9 * (1 - k);
    });
    this.sparks(x2, 1, z2, color, 10, { speed: 5 });
  }

  /** 바닥 장판: 빛나는 테두리 + 안쪽 무늬가 돌고, 입자가 피어오른다 */
  zone(x: number, z: number, radius: number, color: number, duration: number): void {
    const group = new Group();
    group.position.set(x, 0.06, z);
    const disc = new CircleGeometry(radius, 36);
    disc.rotateX(-Math.PI / 2);
    const fillMat = new MeshBasicMaterial({ color, transparent: true, opacity: 0.3, depthWrite: false, blending: NormalBlending });
    const fill = new Mesh(disc, fillMat);
    const edgeG = new RingGeometry(radius * 0.92, radius, 48);
    edgeG.rotateX(-Math.PI / 2);
    const edgeMat = glow(lighten(color, 0.3), 0.8);
    const edge = new Mesh(edgeG, edgeMat);
    edge.position.y = 0.01;
    // 안쪽 룬 고리 (조각난 고리가 천천히 돈다)
    const runeG = new RingGeometry(radius * 0.55, radius * 0.62, 6, 1);
    runeG.rotateX(-Math.PI / 2);
    const runeMat = glow(color, 0.6);
    const rune = new Mesh(runeG, runeMat);
    rune.position.y = 0.02;
    group.add(fill, edge, rune);
    let acc = 0;
    this.add(group, duration, (k, dt) => {
      const appear = Math.min(1, k * duration * 6);
      const fade = Math.min(1, (1 - k) * duration * 3);
      group.scale.setScalar(0.3 + 0.7 * (1 - Math.pow(1 - appear, 3)));
      const pulse = 0.85 + Math.sin(k * duration * 8) * 0.15;
      fillMat.opacity = 0.3 * fade * pulse;
      edgeMat.opacity = 0.8 * fade * pulse;
      runeMat.opacity = 0.6 * fade;
      rune.rotation.y += dt * 0.8;
      acc += dt;
      while (acc > 0.05) {
        acc -= 0.05;
        const a = Math.random() * Math.PI * 2;
        const r = Math.sqrt(Math.random()) * radius;
        this.sparkSys.add(x + Math.cos(a) * r, 0.1, z + Math.sin(a) * r, 0, 1 + Math.random() * 1.2, 0, Math.random() < 0.3 ? 0xffffff : color, { life: 0.8, size: 0.07, gravity: 0, drag: 0.5 });
      }
    });
  }

  /** 수직 빛기둥 (레벨업, 소환, 회복): 겉은 색, 속은 하얀 기둥, 고리가 올라간다 */
  pillar(x: number, z: number, color: number, height = 4): void {
    const group = new Group();
    group.position.set(x, 0, z);
    const outerMat = glow(color, 0.45);
    const outer = new Mesh(new CylinderGeometry(0.55, 0.7, height, 16, 1, true), outerMat);
    outer.position.y = height / 2;
    const coreMat = glow(0xffffff, 0.7);
    const core = new Mesh(new CylinderGeometry(0.18, 0.25, height, 10, 1, true), coreMat);
    core.position.y = height / 2;
    group.add(outer, core);
    const rings: Mesh[] = [];
    for (let i = 0; i < 3; i++) {
      const g = new RingGeometry(0.7, 0.85, 24);
      g.rotateX(-Math.PI / 2);
      const r = new Mesh(g, glow(lighten(color, 0.3), 0.8));
      rings.push(r);
      group.add(r);
    }
    this.add(group, 0.8, (k) => {
      const w = 1 - Math.pow(k, 2) * 0.8;
      outer.scale.set(w, 1, w);
      core.scale.set(w, 1, w);
      outerMat.opacity = 0.45 * (1 - k);
      coreMat.opacity = 0.7 * (1 - k);
      rings.forEach((r, i) => {
        const t = (k * 1.4 + i / 3) % 1;
        r.position.y = t * height;
        r.scale.setScalar(1 + t * 0.6);
        (r.material as MeshBasicMaterial).opacity = 0.8 * (1 - t) * (1 - k);
      });
    });
    this.sparks(x, 0.2, z, color, 16, { up: true, spread: 0.7, speed: 5, life: 1 });
  }

  /** 폭발: 번쩍이는 구 + 충격파 + 그을음 + 불꽃 */
  explosion(x: number, z: number, radius: number, color: number): void {
    const group = new Group();
    group.position.set(x, 0, z);
    const ballMat = glow(lighten(color, 0.5), 0.9);
    const ball = new Mesh(new SphereGeometry(1, 16, 12), ballMat);
    ball.position.y = 0.8;
    const shellMat = glow(color, 0.6);
    const shell = new Mesh(new SphereGeometry(1, 16, 12), shellMat);
    shell.position.y = 0.8;
    const scorchG = new CircleGeometry(radius * 0.8, 24);
    scorchG.rotateX(-Math.PI / 2);
    const scorchMat = new MeshBasicMaterial({ color: 0x1a1210, transparent: true, opacity: 0.45, depthWrite: false });
    const scorch = new Mesh(scorchG, scorchMat);
    scorch.position.y = 0.04;
    group.add(scorch, shell, ball);
    this.add(group, 0.6, (k) => {
      const e = 1 - Math.pow(1 - Math.min(1, k * 2.5), 3);
      ball.scale.setScalar(radius * 0.55 * e);
      ballMat.opacity = 0.9 * Math.max(0, 1 - k * 2.2);
      shell.scale.setScalar(radius * 0.8 * e);
      shellMat.opacity = 0.6 * Math.max(0, 1 - k * 1.6);
      scorchMat.opacity = 0.45 * (1 - k);
    });
    this.ring(x, z, radius * 1.2, color, 0.35, 0.12);
    this.sparks(x, 0.8, z, color, 26, { speed: radius * 3 });
    this.sparks(x, 0.3, z, lighten(color, 0.5), 10, { up: true, spread: radius * 0.6 });
  }

  /** 바닥 마법진: 두 겹 고리와 여섯 개의 룬이 돌며 나타났다 사라진다 */
  glyph(x: number, z: number, radius: number, color: number, duration = 0.7): void {
    const group = new Group();
    group.position.set(x, 0.07, z);
    const mat = glow(color, 0.85);
    const soft = glow(lighten(color, 0.4), 0.5);
    for (const [a, b, m] of [[0.9, 1, mat], [0.62, 0.68, soft]] as const) {
      const g = new RingGeometry(radius * a, radius * b, 48);
      g.rotateX(-Math.PI / 2);
      group.add(new Mesh(g, m));
    }
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const rune = new Mesh(new BoxGeometry(radius * 0.12, 0.02, radius * 0.22), mat);
      rune.position.set(Math.sin(a) * radius * 0.8, 0.01, Math.cos(a) * radius * 0.8);
      rune.rotation.y = a;
      group.add(rune);
    }
    // 가운데 육각별 (삼각형 두 개)
    for (const off of [0, Math.PI / 3]) {
      const g = new RingGeometry(radius * 0.5, radius * 0.55, 3, 1, off);
      g.rotateX(-Math.PI / 2);
      group.add(new Mesh(g, soft));
    }
    this.add(group, duration, (k, dt) => {
      group.rotation.y += dt * 2;
      const appear = 1 - Math.pow(1 - Math.min(1, k * 4), 3);
      group.scale.setScalar(0.5 + 0.5 * appear);
      mat.opacity = 0.85 * (1 - Math.pow(k, 3));
      soft.opacity = 0.5 * (1 - Math.pow(k, 3));
    });
  }

  /** 버프 오라: 발밑 마법진 + 몸을 감싸며 올라가는 고리 + 떠오르는 빛 */
  aura(x: number, z: number, color: number): void {
    this.glyph(x, z, 1.4, color, 0.8);
    const group = new Group();
    group.position.set(x, 0, z);
    const rings: [Mesh, MeshBasicMaterial][] = [];
    for (let i = 0; i < 3; i++) {
      const g = new TorusGeometry(0.75, 0.05, 6, 28);
      g.rotateX(Math.PI / 2);
      const m = glow(i === 1 ? 0xffffff : color, 0.8);
      const r = new Mesh(g, m);
      rings.push([r, m]);
      group.add(r);
    }
    this.add(group, 0.9, (k) => {
      rings.forEach(([r, m], i) => {
        const t = Math.max(0, Math.min(1, k * 1.5 - i * 0.18));
        r.position.y = 0.1 + t * 2.2;
        r.scale.setScalar(1.1 - t * 0.4);
        m.opacity = 0.8 * Math.sin(t * Math.PI);
      });
    });
    this.sparks(x, 0.2, z, color, 18, { up: true, spread: 0.8, speed: 4, life: 1.1 });
  }

  /** 돌진 궤적: 지나간 자리에 남는 빛줄기 */
  streak(x1: number, z1: number, x2: number, z2: number, color: number, width = 0.9): void {
    const len = Math.hypot(x2 - x1, z2 - z1);
    if (len < 0.1) return;
    const group = new Group();
    const g = new PlaneGeometry(width, len);
    g.rotateX(-Math.PI / 2);
    const mat = glow(color, 0.6);
    const core = glow(0xffffff, 0.7);
    const a = new Mesh(g, mat);
    const cg = new PlaneGeometry(width * 0.3, len);
    cg.rotateX(-Math.PI / 2);
    const c = new Mesh(cg, core);
    c.position.y = 0.01;
    group.add(a, c);
    group.position.set((x1 + x2) / 2, 0.9, (z1 + z2) / 2);
    group.rotation.y = Math.atan2(x2 - x1, z2 - z1);
    this.add(group, 0.35, (k) => {
      mat.opacity = 0.6 * (1 - k);
      core.opacity = 0.7 * (1 - k) * (1 - k);
      group.scale.set(1 - k * 0.6, 1, 1);
    });
  }

  /** 하늘에서 떨어지는 운석: 불꼬리를 달고 내려와 onLand에 폭발 */
  meteor(x: number, z: number, color: number, fall = 0.55, onLand?: () => void): void {
    this.glyph(x, z, 2.6, color, fall + 0.2);
    const group = new Group();
    const coreMat = glow(lighten(color, 0.5), 1);
    const shellMat = glow(color, 0.7);
    const core = new Mesh(new SphereGeometry(0.55, 10, 8), coreMat);
    const shell = new Mesh(new SphereGeometry(0.9, 10, 8), shellMat);
    group.add(shell, core);
    const sx = x - 5;
    const sz = z - 5;
    let landed = false;
    this.add(group, fall, (k) => {
      const e = k * k;
      group.position.set(sx + (x - sx) * e, 14 * (1 - e) + 0.6, sz + (z - sz) * e);
      if (Math.random() < 0.9) this.sparkSys.add(group.position.x, group.position.y, group.position.z, 0, 0.5, 0, Math.random() < 0.4 ? 0xffffff : color, { life: 0.4, size: 0.18, gravity: -1, drag: 1 });
      if (k >= 1 && !landed) {
        landed = true;
        onLand?.();
      }
    });
  }

  /** 화살비: 범위 안에 빛나는 화살이 쏟아진다 */
  arrowRain(x: number, z: number, radius: number, color: number, duration: number): void {
    this.zone(x, z, radius, color, duration);
    const group = new Group();
    let acc = 0;
    this.add(group, duration, (_k, dt) => {
      acc += dt;
      while (acc > 0.025) {
        acc -= 0.025;
        const a = Math.random() * Math.PI * 2;
        const r = Math.sqrt(Math.random()) * radius;
        const px = x + Math.cos(a) * r;
        const pz = z + Math.sin(a) * r;
        this.sparkSys.add(px, 7, pz, 0, -26, 0, Math.random() < 0.3 ? 0xffffff : color, { life: 0.3, size: 0.12, gravity: 0, drag: 0 });
      }
    });
  }

  update(dt: number): void {
    this.sparkSys.update(dt);
    for (let i = this.list.length - 1; i >= 0; i--) {
      const e = this.list[i];
      e.t += dt;
      const k = Math.min(1, e.t / e.duration);
      e.update(k, dt);
      if (k >= 1) {
        this.scene.remove(e.obj);
        e.obj.traverse((o) => {
          const m = o as Mesh;
          if (m.geometry) m.geometry.dispose();
          if (m.material) (m.material as MeshBasicMaterial).dispose();
        });
        this.list.splice(i, 1);
      }
    }
  }
}
