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

// ---------------- 차원의 끝 건물 ----------------

/** 무한의 탑: 층층이 좁아지는 돌탑과 꼭대기의 차원 수정 */
export function buildInfiniteTower(): BufferGeometry {
  const stone = 0x6a6488;
  const dark = 0x4a4466;
  const g: BufferGeometry[] = [part(new CylinderGeometry(2.1, 2.3, 0.4, 10), 0x4a4658, { pos: [0, 0.2, 0] })];
  const tiers = [
    [1.8, 1.9, 2.2],
    [1.5, 1.65, 2],
    [1.25, 1.4, 1.8],
    [1.0, 1.15, 1.6],
  ];
  let y = 0.4;
  tiers.forEach(([top, bottom, h], i) => {
    g.push(part(new CylinderGeometry(top, bottom, h, 10), i % 2 ? stone : 0x76709a, { pos: [0, y + h / 2, 0] }));
    // 층 테두리와 창
    g.push(part(new CylinderGeometry(top + 0.12, top + 0.12, 0.18, 10), dark, { pos: [0, y + h, 0] }));
    for (let k = 0; k < 4; k++) {
      const a = (k / 4) * Math.PI * 2 + i * 0.4;
      g.push(part(new BoxGeometry(0.28, 0.5, 0.1), 0x9ad8ff, { pos: [Math.sin(a) * (top + 0.02), y + h * 0.55, Math.cos(a) * (top + 0.02)], rot: [0, a, 0] }));
    }
    y += h;
  });
  // 흉벽
  for (let k = 0; k < 8; k++) {
    const a = (k / 8) * Math.PI * 2;
    g.push(part(new BoxGeometry(0.3, 0.35, 0.3), dark, { pos: [Math.sin(a) * 1.05, y + 0.25, Math.cos(a) * 1.05] }));
  }
  g.push(part(new ConeGeometry(0.9, 1.6, 10), 0x3a3470, { pos: [0, y + 0.9, 0] }));
  g.push(part(new OctahedronGeometry(0.35), 0x5ef0ff, { pos: [0, y + 2.1, 0], scale: [1, 1.6, 1] }));
  // 문
  g.push(part(new BoxGeometry(0.9, 1.5, 0.2), 0x2a2440, { pos: [0, 1.15, 2.0] }));
  g.push(part(new CylinderGeometry(0.45, 0.45, 0.2, 10, 1, false, 0, Math.PI), 0x2a2440, { pos: [0, 1.9, 2.0], rot: [Math.PI / 2, 0, Math.PI / 2] }));
  return merge(g);
}

/** 보스 러시: 거대한 해골이 입구인 전투장 */
export function buildSkullHall(): BufferGeometry {
  const bone = 0xe8e0cc;
  const stone = 0x3a3440;
  return merge([
    part(new BoxGeometry(4.2, 0.4, 3.4), 0x2a2630, { pos: [0, 0.2, 0] }),
    part(new BoxGeometry(3.6, 2.4, 2.4), stone, { pos: [0, 1.6, -0.3] }),
    part(new BoxGeometry(3.9, 0.3, 2.7), 0x2a2630, { pos: [0, 2.9, -0.3] }),
    // 해골 (정면)
    part(new SphereGeometry(1.35, 12, 10), bone, { pos: [0, 2.6, 0.9], scale: [1, 0.95, 0.9] }),
    part(new BoxGeometry(1.5, 0.8, 1.1), bone, { pos: [0, 1.35, 1.2] }),
    part(new SphereGeometry(0.34, 8, 6), 0x1a0a14, { pos: [-0.5, 2.7, 2.0] }),
    part(new SphereGeometry(0.34, 8, 6), 0x1a0a14, { pos: [0.5, 2.7, 2.0] }),
    part(new SphereGeometry(0.14, 6, 4), 0xff3a4a, { pos: [-0.5, 2.7, 2.2] }),
    part(new SphereGeometry(0.14, 6, 4), 0xff3a4a, { pos: [0.5, 2.7, 2.2] }),
    part(new ConeGeometry(0.16, 0.3, 3), 0x1a0a14, { pos: [0, 2.2, 2.12], rot: [0, 0, Math.PI] }),
    // 이빨 (입구)
    part(new BoxGeometry(1.0, 0.7, 0.2), 0x120a10, { pos: [0, 1.35, 1.72] }),
    ...[-0.36, -0.12, 0.12, 0.36].map((x) => part(new BoxGeometry(0.16, 0.22, 0.12), bone, { pos: [x, 1.6, 1.78] })),
    // 뿔
    part(new ConeGeometry(0.28, 1.4, 6), 0x5a4a3a, { pos: [-1.25, 3.4, 0.7], rot: [0, 0, 0.6] }),
    part(new ConeGeometry(0.28, 1.4, 6), 0x5a4a3a, { pos: [1.25, 3.4, 0.7], rot: [0, 0, -0.6] }),
    // 횃불
    part(new BoxGeometry(0.16, 1.4, 0.16), 0x5a3a20, { pos: [-1.9, 0.9, 1.5] }),
    part(new BoxGeometry(0.16, 1.4, 0.16), 0x5a3a20, { pos: [1.9, 0.9, 1.5] }),
    part(new OctahedronGeometry(0.2), 0xff7a2a, { pos: [-1.9, 1.75, 1.5] }),
    part(new OctahedronGeometry(0.2), 0xff7a2a, { pos: [1.9, 1.75, 1.5] }),
  ]);
}

/** 주간 차원 시련: 둥근 시련장 위에 떠 있는 모래시계 */
export function buildTrialHall(): BufferGeometry {
  const stone = 0xb8b0c8;
  const g: BufferGeometry[] = [
    part(new CylinderGeometry(2.2, 2.4, 0.4, 16), 0x6a6478, { pos: [0, 0.2, 0] }),
    part(new CylinderGeometry(1.9, 1.9, 0.12, 16), 0x8a82a0, { pos: [0, 0.46, 0] }),
  ];
  // 둘레의 기둥
  for (let k = 0; k < 6; k++) {
    const a = (k / 6) * Math.PI * 2 + Math.PI / 6;
    g.push(part(new CylinderGeometry(0.2, 0.24, 2.4, 8), stone, { pos: [Math.sin(a) * 1.9, 1.6, Math.cos(a) * 1.9] }));
    g.push(part(new BoxGeometry(0.5, 0.2, 0.5), 0x8a82a0, { pos: [Math.sin(a) * 1.9, 2.9, Math.cos(a) * 1.9] }));
  }
  g.push(part(new TorusGeometry(1.9, 0.12, 6, 24), 0xffd23a, { pos: [0, 3.0, 0], rot: [Math.PI / 2, 0, 0] }));
  // 모래시계
  g.push(part(new CylinderGeometry(0.75, 0.75, 0.14, 12), 0x6a4a2a, { pos: [0, 1.0, 0] }));
  g.push(part(new CylinderGeometry(0.75, 0.75, 0.14, 12), 0x6a4a2a, { pos: [0, 3.0, 0] }));
  g.push(part(new ConeGeometry(0.62, 0.9, 12), 0xbfe8ff, { pos: [0, 2.5, 0], rot: [Math.PI, 0, 0] }));
  g.push(part(new ConeGeometry(0.62, 0.9, 12), 0xbfe8ff, { pos: [0, 1.5, 0] }));
  g.push(part(new ConeGeometry(0.4, 0.45, 12), 0xffd88a, { pos: [0, 1.3, 0] }));
  g.push(part(new CylinderGeometry(0.05, 0.05, 0.9, 6), 0xffd88a, { pos: [0, 2.0, 0] }));
  for (const [x, z] of [
    [0.62, 0],
    [-0.62, 0],
    [0, 0.62],
    [0, -0.62],
  ])
    g.push(part(new CylinderGeometry(0.05, 0.05, 2.0, 6), 0x8a6a3a, { pos: [x, 2.0, z] }));
  return merge(g);
}

/** 심연 균열: 부서진 차원문과 떠 있는 돌 조각 */
export function buildRiftGate(): BufferGeometry {
  const rock = 0x3a2e4a;
  const g: BufferGeometry[] = [part(new CylinderGeometry(1.8, 2.0, 0.3, 8), 0x2a2236, { pos: [0, 0.15, 0] })];
  // 금 간 문틀: 조각난 기둥들
  g.push(part(new BoxGeometry(0.45, 2.6, 0.5), rock, { pos: [-1.1, 1.4, 0], rot: [0, 0, 0.08] }));
  g.push(part(new BoxGeometry(0.45, 1.6, 0.5), rock, { pos: [1.1, 0.9, 0], rot: [0, 0, -0.12] }));
  g.push(part(new BoxGeometry(0.4, 0.8, 0.45), rock, { pos: [1.35, 2.2, 0.1], rot: [0.2, 0, -0.5] }));
  g.push(part(new BoxGeometry(1.4, 0.4, 0.5), rock, { pos: [-0.5, 2.85, 0], rot: [0, 0, -0.18] }));
  // 틈새의 빛 (갈라진 선)
  for (const [x, y, r, h] of [
    [-1.1, 1.8, 0.5, 0.9],
    [1.1, 0.8, -0.4, 0.7],
    [-0.4, 2.85, 1.4, 0.5],
  ])
    g.push(part(new BoxGeometry(0.06, h, 0.52), 0xb67cff, { pos: [x, y, 0], rot: [0, 0, r] }));
  // 떠 있는 돌 조각
  for (const [x, y, z, s] of [
    [1.6, 2.9, 0.3, 0.35],
    [-1.7, 3.2, -0.2, 0.28],
    [0.4, 3.6, 0.4, 0.22],
    [1.9, 1.6, -0.5, 0.2],
  ])
    g.push(part(new DodecahedronGeometry(s, 0), rock, { pos: [x, y, z] }));
  g.push(part(new OctahedronGeometry(0.16), 0xd8b0ff, { pos: [0.4, 3.95, 0.4] }));
  return merge(g);
}
