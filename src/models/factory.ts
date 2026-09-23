import { BoxGeometry, BufferGeometry, ConeGeometry, CylinderGeometry, OctahedronGeometry, TorusGeometry } from 'three';
import type { BuildingType } from '../data/factory';
import { merge, part } from './util';

/** 공장 건물 모델. 앞(+z)이 출력 방향이다 */
export function buildBuildingGeometry(type: BuildingType, connections: boolean[] = [false, false, false, false]): BufferGeometry {
  const metal = 0x6a707c;
  const dark = 0x3a3e48;
  const arrow = (color: number, y = 0.2) =>
    part(new ConeGeometry(0.28, 0.5, 3), color, { pos: [0, y, 0.45], rot: [Math.PI / 2, 0, 0], scale: [1, 1, 0.3] });

  switch (type) {
    case 'belt':
      return merge([
        part(new BoxGeometry(1.8, 0.16, 2), dark, { pos: [0, 0.08, 0] }),
        part(new BoxGeometry(1.4, 0.04, 2), 0x2a2c32, { pos: [0, 0.17, 0] }),
        part(new BoxGeometry(0.12, 0.24, 2), 0xe0b040, { pos: [0.85, 0.12, 0] }),
        part(new BoxGeometry(0.12, 0.24, 2), 0xe0b040, { pos: [-0.85, 0.12, 0] }),
        part(new ConeGeometry(0.3, 0.5, 3), 0x8a8f99, { pos: [0, 0.2, 0.2], rot: [Math.PI / 2, 0, 0], scale: [1, 1, 0.15] }),
      ]);
    case 'splitter':
      return merge([
        part(new BoxGeometry(1.8, 0.3, 1.8), metal, { pos: [0, 0.15, 0] }),
        part(new CylinderGeometry(0.4, 0.5, 0.4, 6), 0xe0b040, { pos: [0, 0.5, 0] }),
        arrow(0xffffff, 0.35),
        part(new ConeGeometry(0.2, 0.4, 3), 0xffffff, { pos: [0.5, 0.35, 0], rot: [0, 0, -Math.PI / 2], scale: [1, 1, 0.3] }),
        part(new ConeGeometry(0.2, 0.4, 3), 0xffffff, { pos: [-0.5, 0.35, 0], rot: [0, 0, Math.PI / 2], scale: [1, 1, 0.3] }),
      ]);
    case 'wire': {
      const parts = [
        part(new CylinderGeometry(0.1, 0.14, 0.9, 6), 0x6a4a2a, { pos: [0, 0.45, 0] }),
        part(new BoxGeometry(0.3, 0.14, 0.3), 0xe08a50, { pos: [0, 0.9, 0] }),
      ];
      // 이웃한 전력 건물 쪽으로 선을 뻗는다 (동, 남, 서, 북)
      const dirs = [
        [1, 0],
        [0, 1],
        [-1, 0],
        [0, -1],
      ];
      connections.forEach((c, i) => {
        if (!c) return;
        const [dx, dz] = dirs[i];
        parts.push(part(new BoxGeometry(dx ? 1 : 0.08, 0.08, dz ? 1 : 0.08), 0xe08a50, { pos: [dx * 0.5, 0.85, dz * 0.5] }));
      });
      return merge(parts);
    }
    case 'generator':
      return merge([
        part(new BoxGeometry(1.7, 0.4, 1.7), dark, { pos: [0, 0.2, 0] }),
        part(new CylinderGeometry(0.6, 0.7, 1.1, 8), metal, { pos: [0, 0.95, 0] }),
        part(new TorusGeometry(0.62, 0.08, 4, 10), 0x5ac8ff, { pos: [0, 0.8, 0], rot: [Math.PI / 2, 0, 0] }),
        part(new TorusGeometry(0.62, 0.08, 4, 10), 0x5ac8ff, { pos: [0, 1.2, 0], rot: [Math.PI / 2, 0, 0] }),
        part(new OctahedronGeometry(0.35), 0x7fe8ff, { pos: [0, 1.85, 0] }),
      ]);
    case 'box':
      return merge([
        part(new BoxGeometry(1.6, 1, 1.6), 0x9a6a3c, { pos: [0, 0.5, 0] }),
        part(new BoxGeometry(1.66, 0.12, 1.66), 0x6a4428, { pos: [0, 1.02, 0] }),
        part(new BoxGeometry(1.66, 0.1, 0.12), 0x8c96a3, { pos: [0, 0.3, 0.78] }),
        part(new BoxGeometry(1.66, 0.1, 0.12), 0x8c96a3, { pos: [0, 0.75, 0.78] }),
        part(new BoxGeometry(0.2, 0.2, 0.06), 0xe8c14a, { pos: [0, 0.55, 0.82] }),
        arrow(0xe8c14a, 1.15),
      ]);
    case 'smelter':
      return merge([
        part(new BoxGeometry(1.7, 1.2, 1.7), 0x8a4a3a, { pos: [0, 0.6, 0] }),
        part(new BoxGeometry(0.9, 0.5, 0.1), 0xff7a2a, { pos: [0, 0.5, 0.86] }),
        part(new CylinderGeometry(0.25, 0.3, 1.2, 6), 0x5a4a44, { pos: [0.5, 1.7, -0.4] }),
        arrow(0xffffff, 1.25),
      ]);
    case 'crusher':
      return merge([
        part(new BoxGeometry(1.7, 0.9, 1.7), metal, { pos: [0, 0.45, 0] }),
        part(new CylinderGeometry(0.35, 0.35, 1.4, 8), 0x9aa0aa, { pos: [0, 1.15, 0.1], rot: [0, 0, Math.PI / 2] }),
        part(new BoxGeometry(1.2, 0.5, 0.6), dark, { pos: [0, 1.2, -0.5] }),
        arrow(0xffffff, 0.95),
      ]);
    case 'infuser':
      return merge([
        part(new BoxGeometry(1.7, 0.6, 1.7), dark, { pos: [0, 0.3, 0] }),
        part(new CylinderGeometry(0.5, 0.6, 0.9, 8), 0x8a6aff, { pos: [0, 1.05, 0] }),
        part(new OctahedronGeometry(0.28), 0xd8b0ff, { pos: [0, 1.8, 0] }),
        part(new BoxGeometry(0.12, 1.4, 0.12), metal, { pos: [0.7, 1, 0.7] }),
        part(new BoxGeometry(0.12, 1.4, 0.12), metal, { pos: [-0.7, 1, -0.7] }),
        arrow(0xffffff, 0.65),
      ]);
    case 'assembler':
      return merge([
        part(new BoxGeometry(1.8, 1.1, 1.8), 0x4a8a7a, { pos: [0, 0.55, 0] }),
        part(new BoxGeometry(1.2, 0.3, 1.2), dark, { pos: [0, 1.25, 0] }),
        part(new BoxGeometry(0.15, 0.8, 0.15), metal, { pos: [0.4, 1.6, 0], rot: [0, 0, 0.4] }),
        part(new BoxGeometry(0.6, 0.12, 0.12), metal, { pos: [0.1, 1.95, 0] }),
        arrow(0xffffff, 1.15),
      ]);
    case 'alchemy':
      return merge([
        part(new CylinderGeometry(0.75, 0.6, 0.9, 8), 0x3a3a40, { pos: [0, 0.45, 0] }),
        part(new CylinderGeometry(0.66, 0.66, 0.08, 8), 0x7aff8a, { pos: [0, 0.9, 0] }),
        part(new BoxGeometry(0.1, 0.4, 0.1), metal, { pos: [0.6, 0.2, 0.6] }),
        part(new BoxGeometry(0.1, 0.4, 0.1), metal, { pos: [-0.6, 0.2, -0.6] }),
        arrow(0xffffff, 0.3),
      ]);
  }
}

/** 기계 위 상태 표시등 */
export function buildStatusLight(): BufferGeometry {
  return merge([part(new OctahedronGeometry(0.16), 0xffffff)]);
}
