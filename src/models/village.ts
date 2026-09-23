import {
  BoxGeometry,
  BufferGeometry,
  ConeGeometry,
  CylinderGeometry,
  DodecahedronGeometry,
  OctahedronGeometry,
  SphereGeometry,
  TorusGeometry,
} from 'three';
import { merge, part } from './util';

/** 마을 건물과 소품 모델 */
export function buildHouse(wall: number, roof: number, w = 3.2, d = 2.8): BufferGeometry {
  return merge([
    part(new BoxGeometry(w, 2, d), wall, { pos: [0, 1, 0] }),
    part(new BoxGeometry(w + 0.2, 0.25, d + 0.2), 0x5a4030, { pos: [0, 0.12, 0] }),
    part(new ConeGeometry(Math.max(w, d) * 0.78, 1.6, 4), roof, { pos: [0, 2.8, 0], rot: [0, Math.PI / 4, 0], scale: [w / Math.max(w, d), 1, d / Math.max(w, d)] }),
    part(new BoxGeometry(0.7, 1.2, 0.08), 0x6a4428, { pos: [0, 0.6, d / 2 + 0.02] }),
    part(new BoxGeometry(0.55, 0.5, 0.06), 0xffd88a, { pos: [-w / 3.2, 1.25, d / 2 + 0.02] }),
    part(new BoxGeometry(0.55, 0.5, 0.06), 0xffd88a, { pos: [w / 3.2, 1.25, d / 2 + 0.02] }),
    part(new BoxGeometry(0.35, 0.9, 0.35), 0x7a7070, { pos: [w / 3, 3.1, -d / 5] }),
  ]);
}

export function buildForge(): BufferGeometry {
  return merge([
    part(new BoxGeometry(3.4, 0.3, 2.8), 0x5a5048, { pos: [0, 0.15, 0] }),
    part(new BoxGeometry(0.3, 2.4, 0.3), 0x6a4428, { pos: [1.5, 1.2, 1.2] }),
    part(new BoxGeometry(0.3, 2.4, 0.3), 0x6a4428, { pos: [-1.5, 1.2, 1.2] }),
    part(new BoxGeometry(0.3, 2.4, 0.3), 0x6a4428, { pos: [1.5, 1.2, -1.2] }),
    part(new BoxGeometry(0.3, 2.4, 0.3), 0x6a4428, { pos: [-1.5, 1.2, -1.2] }),
    part(new BoxGeometry(3.8, 0.2, 3.2), 0x8a3a2a, { pos: [0, 2.5, 0], rot: [0.12, 0, 0] }),
    // 화덕
    part(new BoxGeometry(1.2, 1.1, 1), 0x6a6060, { pos: [-0.8, 0.85, -0.7] }),
    part(new BoxGeometry(0.7, 0.4, 0.1), 0xff7a2a, { pos: [-0.8, 0.8, -0.18] }),
    part(new BoxGeometry(0.4, 1.6, 0.4), 0x6a6060, { pos: [-0.8, 2.2, -0.9] }),
    // 모루
    part(new BoxGeometry(0.4, 0.5, 0.4), 0x3a3a40, { pos: [0.7, 0.55, 0.4] }),
    part(new BoxGeometry(0.9, 0.22, 0.4), 0x4a4a52, { pos: [0.7, 0.9, 0.4] }),
    part(new ConeGeometry(0.2, 0.4, 4), 0x4a4a52, { pos: [1.3, 0.9, 0.4], rot: [0, 0, -Math.PI / 2] }),
  ]);
}

export function buildStall(canvas: number): BufferGeometry {
  const parts = [
    part(new BoxGeometry(2.6, 0.9, 1.1), 0x8a5a34, { pos: [0, 0.45, 0.4] }),
    part(new BoxGeometry(2.8, 0.1, 1.3), 0x6a4428, { pos: [0, 0.95, 0.4] }),
    part(new BoxGeometry(0.15, 2.3, 0.15), 0x6a4428, { pos: [1.3, 1.15, 1] }),
    part(new BoxGeometry(0.15, 2.3, 0.15), 0x6a4428, { pos: [-1.3, 1.15, 1] }),
    part(new BoxGeometry(0.15, 2.6, 0.15), 0x6a4428, { pos: [1.3, 1.3, -0.4] }),
    part(new BoxGeometry(0.15, 2.6, 0.15), 0x6a4428, { pos: [-1.3, 1.3, -0.4] }),
    part(new BoxGeometry(3, 0.12, 1.8), canvas, { pos: [0, 2.45, 0.3], rot: [-0.25, 0, 0] }),
  ];
  // 좌판 위 물건들
  const goods = [0xff5a7a, 0x7affc0, 0x9fc4ff, 0xe8c14a];
  goods.forEach((c, i) => parts.push(part(new OctahedronGeometry(0.15), c, { pos: [-0.9 + i * 0.6, 1.15, 0.4] })));
  return merge(parts);
}

export function buildFountain(): BufferGeometry {
  return merge([
    part(new CylinderGeometry(1.8, 1.9, 0.5, 10), 0x9a948a, { pos: [0, 0.25, 0] }),
    part(new CylinderGeometry(1.5, 1.5, 0.1, 10), 0x5ab8e8, { pos: [0, 0.48, 0] }),
    part(new CylinderGeometry(0.3, 0.4, 1.4, 8), 0x9a948a, { pos: [0, 1, 0] }),
    part(new CylinderGeometry(0.8, 0.6, 0.25, 10), 0x9a948a, { pos: [0, 1.7, 0] }),
    part(new OctahedronGeometry(0.35), 0x5ef0ff, { pos: [0, 2.3, 0] }),
  ]);
}

export function buildStatue(): BufferGeometry {
  return merge([
    part(new BoxGeometry(1.8, 0.6, 1.8), 0x8a8a90, { pos: [0, 0.3, 0] }),
    part(new BoxGeometry(1.2, 0.4, 1.2), 0x9a9aa0, { pos: [0, 0.8, 0] }),
    part(new BoxGeometry(0.6, 1.1, 0.4), 0xb8b8c0, { pos: [0, 1.55, 0] }),
    part(new BoxGeometry(0.5, 0.5, 0.45), 0xb8b8c0, { pos: [0, 2.35, 0] }),
    part(new BoxGeometry(0.08, 1.4, 0.08), 0xd8d8e0, { pos: [0.45, 1.8, 0.1], rot: [0, 0, -0.2] }),
    part(new OctahedronGeometry(0.2), 0xe8c14a, { pos: [0, 2.9, 0] }),
  ]);
}

export function buildChest(): BufferGeometry {
  return merge([
    part(new BoxGeometry(1.3, 0.7, 0.8), 0x7a4a24, { pos: [0, 0.35, 0] }),
    part(new BoxGeometry(1.34, 0.3, 0.84), 0x8a5a2c, { pos: [0, 0.85, 0] }),
    part(new BoxGeometry(1.36, 0.08, 0.86), 0xe8c14a, { pos: [0, 0.7, 0] }),
    part(new BoxGeometry(0.16, 0.2, 0.06), 0xe8c14a, { pos: [0, 0.62, 0.42] }),
  ]);
}

export function buildLamp(): BufferGeometry {
  return merge([
    part(new CylinderGeometry(0.07, 0.1, 2.2, 6), 0x3a3a40, { pos: [0, 1.1, 0] }),
    part(new BoxGeometry(0.34, 0.4, 0.34), 0xffd88a, { pos: [0, 2.35, 0] }),
    part(new ConeGeometry(0.3, 0.25, 4), 0x3a3a40, { pos: [0, 2.68, 0], rot: [0, Math.PI / 4, 0] }),
  ]);
}

export function buildTree(foliage: number): BufferGeometry {
  return merge([
    part(new CylinderGeometry(0.18, 0.26, 1.2, 6), 0x6b4a2e, { pos: [0, 0.6, 0] }),
    part(new DodecahedronGeometry(0.95, 0), foliage, { pos: [0, 1.9, 0] }),
    part(new DodecahedronGeometry(0.6, 0), foliage, { pos: [0.5, 1.5, 0.3] }),
  ]);
}

export function buildBarrel(): BufferGeometry {
  return merge([
    part(new CylinderGeometry(0.35, 0.35, 0.8, 8), 0x8a5a34, { pos: [0, 0.4, 0] }),
    part(new TorusGeometry(0.36, 0.03, 3, 8), 0x3a3a40, { pos: [0, 0.2, 0], rot: [Math.PI / 2, 0, 0] }),
    part(new TorusGeometry(0.36, 0.03, 3, 8), 0x3a3a40, { pos: [0, 0.6, 0], rot: [Math.PI / 2, 0, 0] }),
  ]);
}

/** 차원집으로 들어가는 작은 문 */
export function buildHomeDoor(): BufferGeometry {
  return merge([
    part(new BoxGeometry(2.2, 0.3, 1.2), 0x5a5070, { pos: [0, 0.15, 0] }),
    part(new BoxGeometry(0.35, 2.6, 0.5), 0x4a4060, { pos: [0.9, 1.3, 0] }),
    part(new BoxGeometry(0.35, 2.6, 0.5), 0x4a4060, { pos: [-0.9, 1.3, 0] }),
    part(new BoxGeometry(2.2, 0.4, 0.55), 0x4a4060, { pos: [0, 2.7, 0] }),
    part(new SphereGeometry(0.2, 6, 4), 0xc28cff, { pos: [0, 3.05, 0] }),
  ]);
}
