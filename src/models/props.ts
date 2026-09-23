import {
  BoxGeometry,
  BufferGeometry,
  ConeGeometry,
  CylinderGeometry,
  DodecahedronGeometry,
  IcosahedronGeometry,
  OctahedronGeometry,
  TorusGeometry,
} from 'three';
import { Rng } from '../core/rng';
import type { NodeDef } from '../data/nodes';
import type { DecorKind } from '../data/themes';
import { merge, part } from './util';

const shade = (color: number, f: number) => {
  const r = Math.min(255, Math.round(((color >> 16) & 255) * f));
  const g = Math.min(255, Math.round(((color >> 8) & 255) * f));
  const b = Math.min(255, Math.round((color & 255) * f));
  return (r << 16) | (g << 8) | b;
};

/** 채집물 모델. 같은 종류도 시드에 따라 모양이 조금씩 다르다 */
export function buildNodeGeometry(def: NodeDef, seed: number): BufferGeometry {
  const rng = new Rng(seed);
  const parts: BufferGeometry[] = [];
  const base = def.baseColor;
  const accent = def.accentColor;

  switch (def.style) {
    case 'ore': {
      parts.push(part(new DodecahedronGeometry(0.72, 0), base, { pos: [0, 0.42, 0], scale: [1, 0.78, 0.95], rot: [0, rng.range(0, 6), 0] }));
      parts.push(part(new DodecahedronGeometry(0.4, 0), shade(base, 0.85), { pos: [0.5, 0.22, 0.2], rot: [rng.range(0, 3), 0, 0] }));
      const chunks = rng.int(4, 6);
      for (let i = 0; i < chunks; i++) {
        const a = rng.range(0, Math.PI * 2);
        const y = rng.range(0.35, 0.8);
        const r = 0.62 - (y - 0.35) * 0.5;
        parts.push(
          part(new OctahedronGeometry(rng.range(0.13, 0.2)), i % 2 ? accent : shade(accent, 1.2), {
            pos: [Math.cos(a) * r, y, Math.sin(a) * r],
            rot: [rng.range(0, 3), rng.range(0, 3), 0],
            scale: [1, 1.4, 1],
          }),
        );
      }
      break;
    }
    case 'tree': {
      const h = rng.range(0.9, 1.2);
      parts.push(part(new CylinderGeometry(0.16, 0.24, h, 6), base, { pos: [0, h / 2, 0] }));
      parts.push(part(new BoxGeometry(0.5, 0.12, 0.14), shade(base, 0.8), { pos: [0.1, 0.06, 0.1], rot: [0, rng.range(0, 3), 0] }));
      const layers = rng.int(2, 3);
      for (let i = 0; i < layers; i++) {
        const s = 1 - i * 0.24;
        parts.push(
          part(new ConeGeometry(0.85 * s, 0.9 * s, 7), shade(accent, 1 - i * 0.08 + (i === layers - 1 ? 0.15 : 0)), {
            pos: [0, h + 0.2 + i * 0.52, 0],
            rot: [0, rng.range(0, 3), 0],
          }),
        );
      }
      break;
    }
    case 'crystal': {
      parts.push(part(new DodecahedronGeometry(0.42, 0), base, { pos: [0, 0.14, 0], scale: [1.3, 0.5, 1.2] }));
      const count = rng.int(4, 6);
      for (let i = 0; i < count; i++) {
        const main = i === 0;
        const a = rng.range(0, Math.PI * 2);
        const d = main ? 0 : rng.range(0.22, 0.42);
        const h = main ? 1.3 : rng.range(0.5, 0.9);
        parts.push(
          part(new OctahedronGeometry(0.2, 0), i % 2 ? accent : shade(accent, 1.25), {
            pos: [Math.cos(a) * d, 0.3 + h * 0.35, Math.sin(a) * d],
            rot: [Math.sin(a) * (main ? 0 : 0.45), rng.range(0, 3), Math.cos(a) * (main ? 0 : 0.45)],
            scale: [1, h * 2.2, 1],
          }),
        );
      }
      break;
    }
    case 'scrap': {
      for (let i = 0; i < 3; i++) {
        parts.push(
          part(new BoxGeometry(rng.range(0.4, 0.7), rng.range(0.25, 0.45), rng.range(0.4, 0.7)), shade(base, 1 - i * 0.1), {
            pos: [rng.range(-0.3, 0.3), 0.18 + i * 0.22, rng.range(-0.3, 0.3)],
            rot: [rng.range(-0.3, 0.3), rng.range(0, 3), rng.range(-0.3, 0.3)],
          }),
        );
      }
      // 톱니바퀴 두 개
      for (let g = 0; g < 2; g++) {
        const r = g ? 0.26 : 0.36;
        const cx = g ? -0.28 : 0.2;
        const cy = g ? 0.5 : 0.75;
        const tilt = g ? 0.9 : -0.4;
        parts.push(part(new CylinderGeometry(r, r, 0.1, 10), accent, { pos: [cx, cy, 0.1], rot: [Math.PI / 2 + tilt, 0, 0] }));
        for (let t = 0; t < 8; t++) {
          const a = (t / 8) * Math.PI * 2;
          const tooth = part(new BoxGeometry(0.1, 0.1, 0.1), shade(accent, 0.85), {
            pos: [Math.cos(a) * (r + 0.04), 0, Math.sin(a) * (r + 0.04)],
          });
          tooth.rotateX(Math.PI / 2 + tilt);
          tooth.translate(cx, cy, 0.1);
          parts.push(tooth);
        }
      }
      break;
    }
    case 'chest': {
      parts.push(part(new BoxGeometry(0.9, 0.5, 0.6), base, { pos: [0, 0.25, 0] }));
      parts.push(part(new BoxGeometry(0.94, 0.24, 0.64), shade(base, 1.15), { pos: [0, 0.62, 0] }));
      parts.push(part(new BoxGeometry(0.96, 0.08, 0.66), accent, { pos: [0, 0.5, 0] }));
      parts.push(part(new BoxGeometry(0.1, 0.76, 0.66), accent, { pos: [0.3, 0.38, 0] }));
      parts.push(part(new BoxGeometry(0.1, 0.76, 0.66), accent, { pos: [-0.3, 0.38, 0] }));
      parts.push(part(new BoxGeometry(0.14, 0.16, 0.06), accent, { pos: [0, 0.46, 0.32] }));
      break;
    }
  }
  return merge(parts);
}

/** 바닥 장식 하나. 여러 개를 합쳐 한 번에 그린다 */
export function buildDecorGeometry(kind: DecorKind, color: number, rng: Rng): BufferGeometry {
  const parts: BufferGeometry[] = [];
  switch (kind) {
    case 'grass':
      for (let i = 0; i < 3; i++) {
        parts.push(
          part(new ConeGeometry(0.06, rng.range(0.25, 0.4), 3), shade(color, rng.range(0.85, 1.15)), {
            pos: [rng.range(-0.15, 0.15), 0.15, rng.range(-0.15, 0.15)],
            rot: [rng.range(-0.3, 0.3), 0, rng.range(-0.3, 0.3)],
          }),
        );
      }
      break;
    case 'rock':
      parts.push(part(new DodecahedronGeometry(rng.range(0.12, 0.22), 0), color, { pos: [0, 0.06, 0], scale: [1, 0.6, 1] }));
      break;
    case 'shard':
      parts.push(part(new OctahedronGeometry(0.1, 0), color, { pos: [0, 0.18, 0], rot: [0.3, 0, 0.2], scale: [1, 2.4, 1] }));
      parts.push(part(new OctahedronGeometry(0.07, 0), shade(color, 1.2), { pos: [0.12, 0.1, 0.05], rot: [-0.4, 0, 0.3], scale: [1, 2, 1] }));
      break;
    case 'mushroom':
      parts.push(part(new CylinderGeometry(0.04, 0.05, 0.14, 5), 0xf0e6d0, { pos: [0, 0.07, 0] }));
      parts.push(part(new ConeGeometry(0.13, 0.1, 6), color, { pos: [0, 0.17, 0] }));
      break;
    case 'gear':
      parts.push(part(new CylinderGeometry(0.16, 0.16, 0.05, 8), color, { pos: [0, 0.03, 0] }));
      parts.push(part(new CylinderGeometry(0.05, 0.05, 0.07, 6), shade(color, 0.7), { pos: [0, 0.04, 0] }));
      break;
    case 'bone':
      parts.push(part(new CylinderGeometry(0.03, 0.03, 0.34, 5), color, { pos: [0, 0.04, 0], rot: [0, 0, Math.PI / 2] }));
      parts.push(part(new IcosahedronGeometry(0.05, 0), color, { pos: [0.17, 0.04, 0] }));
      parts.push(part(new IcosahedronGeometry(0.05, 0), color, { pos: [-0.17, 0.04, 0] }));
      break;
  }
  return merge(parts);
}

/** 차원문: 돌 받침 위에 세워진 고리 */
export function buildPortalFrame(color: number): BufferGeometry {
  const stone = 0x6a6878;
  return merge([
    part(new CylinderGeometry(1.25, 1.4, 0.24, 8), stone, { pos: [0, 0.12, 0] }),
    part(new CylinderGeometry(1.05, 1.1, 0.08, 8), shade(stone, 1.2), { pos: [0, 0.27, 0] }),
    part(new TorusGeometry(0.95, 0.13, 6, 14), shade(stone, 0.9), { pos: [0, 1.35, 0] }),
    part(new TorusGeometry(0.95, 0.06, 4, 14), color, { pos: [0, 1.35, 0.08] }),
    part(new OctahedronGeometry(0.16), color, { pos: [0, 2.4, 0.05] }),
    part(new BoxGeometry(0.26, 0.5, 0.26), shade(stone, 0.9), { pos: [0.9, 0.5, 0] }),
    part(new BoxGeometry(0.26, 0.5, 0.26), shade(stone, 0.9), { pos: [-0.9, 0.5, 0] }),
  ]);
}
