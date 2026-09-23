import { BufferAttribute, BufferGeometry, Color, Euler, Matrix4, Quaternion, Vector3 } from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export interface PartTransform {
  pos?: [number, number, number];
  rot?: [number, number, number];
  scale?: [number, number, number];
}

const tmpColor = new Color();

/**
 * 기본 도형 하나에 색과 위치를 입힌다.
 * 면마다 색이 또렷하게 나오도록 인덱스를 풀고 정점 색을 넣는다.
 */
export function part(geometry: BufferGeometry, color: number, t: PartTransform = {}): BufferGeometry {
  const g = geometry.index ? geometry.toNonIndexed() : geometry;
  const m = new Matrix4().compose(
    new Vector3(...(t.pos ?? [0, 0, 0])),
    new Quaternion().setFromEuler(new Euler(...(t.rot ?? [0, 0, 0]))),
    new Vector3(...(t.scale ?? [1, 1, 1])),
  );
  g.applyMatrix4(m);
  paint(g, color);
  // 합칠 때 속성이 같아야 하므로 uv는 버린다
  g.deleteAttribute('uv');
  return g;
}

export function paint(g: BufferGeometry, color: number): BufferGeometry {
  tmpColor.setHex(color);
  const count = g.getAttribute('position').count;
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    colors[i * 3] = tmpColor.r;
    colors[i * 3 + 1] = tmpColor.g;
    colors[i * 3 + 2] = tmpColor.b;
  }
  g.setAttribute('color', new BufferAttribute(colors, 3));
  return g;
}

/** 박스의 윗면만 다른 색으로 칠한다 (벽, 바닥용) */
export function paintTop(g: BufferGeometry, top: number): BufferGeometry {
  const pos = g.getAttribute('position');
  const normal = g.getAttribute('normal');
  const colors = g.getAttribute('color') as BufferAttribute;
  tmpColor.setHex(top);
  for (let i = 0; i < pos.count; i++) {
    if (normal.getY(i) > 0.9) colors.setXYZ(i, tmpColor.r, tmpColor.g, tmpColor.b);
  }
  return g;
}

export function merge(parts: BufferGeometry[]): BufferGeometry {
  const merged = mergeGeometries(parts, false);
  if (!merged) throw new Error('모델 합치기 실패');
  for (const p of parts) p.dispose();
  return merged;
}
