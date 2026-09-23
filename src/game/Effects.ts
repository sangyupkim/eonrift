import {
  AdditiveBlending,
  BoxGeometry,
  BufferGeometry,
  CircleGeometry,
  DoubleSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  NormalBlending,
  Object3D,
  PlaneGeometry,
  RingGeometry,
  Scene,
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

/** 짧게 나타났다 사라지는 시각 효과들 */
export class Effects {
  private list: Effect[] = [];

  constructor(private scene: Scene) {}

  add(obj: Object3D, duration: number, update: (k: number, dt: number) => void): void {
    this.scene.add(obj);
    this.list.push({ obj, t: 0, duration, update });
    update(0, 0);
  }

  /** 칼 휘두른 궤적 (부채꼴) */
  slash(x: number, z: number, facing: number, radius: number, color: number, angle = 2.2, y = 0.9): void {
    const g = new RingGeometry(radius * 0.6, radius, 20, 1, -angle / 2, angle);
    g.rotateZ(Math.PI / 2);
    g.rotateX(Math.PI / 2);
    const m = new Mesh(g, glow(color, 0.5));
    m.position.set(x, y, z);
    m.rotation.y = facing;
    this.add(m, 0.2, (k) => {
      (m.material as MeshBasicMaterial).opacity = 0.5 * (1 - k);
      m.scale.setScalar(0.85 + k * 0.3);
    });
  }

  /** 퍼져 나가는 고리 */
  ring(x: number, z: number, radius: number, color: number, duration = 0.35, y = 0.1): void {
    const g = new RingGeometry(0.8, 1, 32);
    g.rotateX(-Math.PI / 2);
    const m = new Mesh(g, glow(color, 0.9));
    m.position.set(x, y, z);
    this.add(m, duration, (k) => {
      m.scale.setScalar(0.2 + radius * k);
      (m.material as MeshBasicMaterial).opacity = 0.9 * (1 - k);
    });
  }

  /** 두 점 사이를 지그재그로 잇는 번개 */
  bolt(x1: number, z1: number, x2: number, z2: number, color: number): void {
    const group = new Group();
    const mat = glow(color, 1);
    const segs = 6;
    let px = x1;
    let pz = z1;
    for (let i = 1; i <= segs; i++) {
      const k = i / segs;
      const nx = x1 + (x2 - x1) * k + (i < segs ? (Math.random() - 0.5) * 0.8 : 0);
      const nz = z1 + (z2 - z1) * k + (i < segs ? (Math.random() - 0.5) * 0.8 : 0);
      const len = Math.hypot(nx - px, nz - pz);
      const seg = new Mesh(new BoxGeometry(0.09, 0.09, len), mat);
      seg.position.set((px + nx) / 2, 1.1, (pz + nz) / 2);
      seg.rotation.y = Math.atan2(nx - px, nz - pz);
      group.add(seg);
      px = nx;
      pz = nz;
    }
    this.add(group, 0.22, (k) => (mat.opacity = 1 - k));
  }

  /** 바닥 장판 (얼음 장판 등). 지속 시간 동안 흐릿하게 빛난다 */
  zone(x: number, z: number, radius: number, color: number, duration: number): void {
    const g = new CircleGeometry(radius, 28);
    g.rotateX(-Math.PI / 2);
    const mat = new MeshBasicMaterial({ color, transparent: true, opacity: 0.35, depthWrite: false, blending: NormalBlending });
    const m = new Mesh(g, mat);
    m.position.set(x, 0.06, z);
    this.add(m, duration, (k) => {
      mat.opacity = 0.35 * Math.min(1, (1 - k) * 4) * (0.85 + Math.sin(k * 40) * 0.15);
      m.scale.setScalar(Math.min(1, k * 12));
    });
  }

  /** 수직 빛기둥 (레벨업, 소환) */
  pillar(x: number, z: number, color: number, height = 4): void {
    const m = new Mesh(new BoxGeometry(0.9, height, 0.9), glow(color, 0.6));
    m.position.set(x, height / 2, z);
    this.add(m, 0.6, (k) => {
      (m.material as MeshBasicMaterial).opacity = 0.6 * (1 - k);
      m.scale.set(1 - k * 0.7, 1, 1 - k * 0.7);
    });
  }

  update(dt: number): void {
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
