import { BoxGeometry, Color, DynamicDrawUsage, InstancedMesh, Matrix4, MeshLambertMaterial, Object3D } from 'three';

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  life: number;
  maxLife: number;
  size: number;
  spin: number;
}

const MAX = 160;

/** 파편 효과. 인스턴싱으로 한 번에 그린다 */
export class Particles {
  readonly mesh: InstancedMesh;
  private items: Particle[] = [];
  private dummy = new Object3D();
  private color = new Color();
  private hidden = new Matrix4().makeScale(0, 0, 0);

  constructor() {
    const mat = new MeshLambertMaterial({ flatShading: true });
    this.mesh = new InstancedMesh(new BoxGeometry(1, 1, 1), mat, MAX);
    this.mesh.instanceMatrix.setUsage(DynamicDrawUsage);
    this.mesh.frustumCulled = false;
    for (let i = 0; i < MAX; i++) {
      this.mesh.setMatrixAt(i, this.hidden);
      this.mesh.setColorAt(i, this.color.setHex(0xffffff));
    }
  }

  burst(x: number, y: number, z: number, color: number, count: number, power = 1): void {
    for (let i = 0; i < count; i++) {
      if (this.items.length >= MAX) break;
      const a = Math.random() * Math.PI * 2;
      const s = (1.5 + Math.random() * 2.5) * power;
      this.items.push({
        x,
        y,
        z,
        vx: Math.cos(a) * s,
        vy: 3 + Math.random() * 3 * power,
        vz: Math.sin(a) * s,
        life: 0,
        maxLife: 0.45 + Math.random() * 0.35,
        size: 0.08 + Math.random() * 0.1,
        spin: Math.random() * 10,
      });
      const idx = this.items.length - 1;
      this.mesh.setColorAt(idx, this.color.setHex(color).multiplyScalar(0.85 + Math.random() * 0.3));
    }
    if (this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true;
  }

  update(dt: number): void {
    let write = 0;
    for (let i = 0; i < this.items.length; i++) {
      const p = this.items[i];
      p.life += dt;
      if (p.life >= p.maxLife) continue;
      p.vy -= 18 * dt;
      p.x += p.vx * dt;
      p.y = Math.max(0.05, p.y + p.vy * dt);
      p.z += p.vz * dt;
      if (p.y <= 0.05) {
        p.vx *= 0.8;
        p.vz *= 0.8;
      }
      if (write !== i) {
        this.items[write] = p;
        this.mesh.getColorAt(i, this.color);
        this.mesh.setColorAt(write, this.color);
      }
      const s = p.size * (1 - p.life / p.maxLife);
      this.dummy.position.set(p.x, p.y, p.z);
      this.dummy.rotation.set(p.spin * p.life, p.spin * p.life * 0.7, 0);
      this.dummy.scale.setScalar(s);
      this.dummy.updateMatrix();
      this.mesh.setMatrixAt(write, this.dummy.matrix);
      write++;
    }
    for (let i = write; i < this.items.length; i++) this.mesh.setMatrixAt(i, this.hidden);
    this.items.length = write;
    this.mesh.instanceMatrix.needsUpdate = true;
    if (this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true;
  }
}
