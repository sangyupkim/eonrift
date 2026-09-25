/** 시드 기반 2D 값 노이즈. 지형의 얼룩(이끼·흙·돌)을 자연스럽게 섞을 때 쓴다 */
function hash(x: number, y: number, seed: number): number {
  let h = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(seed, 2246822519);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

const smooth = (t: number) => t * t * (3 - 2 * t);

/** 0~1 값 노이즈 */
export function valueNoise(x: number, y: number, seed: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const tx = smooth(x - xi);
  const ty = smooth(y - yi);
  const a = hash(xi, yi, seed);
  const b = hash(xi + 1, yi, seed);
  const c = hash(xi, yi + 1, seed);
  const d = hash(xi + 1, yi + 1, seed);
  return a + (b - a) * tx + (c - a) * ty + (a - b - c + d) * tx * ty;
}

/** 여러 겹 겹친 노이즈 (0~1) */
export function fbm(x: number, y: number, seed: number, octaves = 3): number {
  let sum = 0;
  let amp = 1;
  let norm = 0;
  let f = 1;
  for (let i = 0; i < octaves; i++) {
    sum += valueNoise(x * f, y * f, seed + i * 1013) * amp;
    norm += amp;
    amp *= 0.5;
    f *= 2.03;
  }
  return sum / norm;
}

/** 부드러운 계단: edge0~edge1 사이에서 0→1 */
export function smoothstep(edge0: number, edge1: number, v: number): number {
  const t = Math.max(0, Math.min(1, (v - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}
