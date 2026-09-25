import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  DoubleSide,
  Float32BufferAttribute,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
} from 'three';
import { TILE } from '../config';
import { fbm, smoothstep } from '../core/noise';
import { Rng } from '../core/rng';
import { isFloor, type DungeonData } from '../dungeon/generator';

/**
 * 자연스러운 바닥: 격자 바닥 대신 노이즈로 섞은 땅(이끼·흙·모래·눈…) 위에
 * 깨진 돌판·금속판 같은 '타일'을 군데군데 깔고, 풀·돌·꽃·금·수정 조각 같은 작은 소품을 뿌린다.
 * 소품은 어울리는 곳에만 난다 (풀은 이끼 위에, 잔돌은 벽 밑에, 금은 돌판 위에…).
 */

type Grid = Pick<DungeonData, 'width' | 'height' | 'cells'>;

/** 땅색 얼룩 한 겹: 노이즈가 lo~hi를 넘는 곳에 color가 스며든다 */
export interface GroundLayer {
  color: number;
  scale: number;
  lo: number;
  hi: number;
}

/** 바닥에 까는 판: 돌판·얼음판·금속판·자갈 */
export interface PavedStyle {
  colors: number[];
  /** 한 칸(2m)을 몇 줄로 나누나 (2 = 1m 판, 3 = 자갈) */
  per: number;
  /** 판 사이 틈 비율 */
  gap: number;
  /** 흔들림 (회전) */
  wobble: number;
  /** 노이즈로 판이 깔리는 곳 (lo~hi) */
  scale: number;
  lo: number;
  hi: number;
  /** 판이 깔린 곳에서도 빠진 자리 */
  missing: number;
  /** 금속판처럼 네 귀에 볼트 */
  bolts?: number;
}

export type DetailKind = 'pebble' | 'rock' | 'tuft' | 'flower' | 'crack' | 'puddle' | 'leaf' | 'chip' | 'bolt' | 'bonebit' | 'lump';

export interface ScatterSpec {
  kind: DetailKind;
  colors: number[];
  /** 한 칸에 평균 몇 개 */
  per: number;
  /** 어디에 나는가: 얼룩 번호(그 얼룩 위), 벽 밑, 판 위, 길, 판·길이 아닌 맨땅 */
  on?: number | 'edge' | 'paved' | 'path' | 'open';
  size?: number;
}

export interface GroundStyle {
  base: number;
  /** 잔 얼룩 세기 */
  jitter: number;
  layers: GroundLayer[];
  /** 복도·길의 닳은 흙색 */
  path?: number;
  /** 벽 밑 그늘 세기 (0~1) */
  edgeShade: number;
  paved?: PavedStyle;
  /** 빛나는 틈 (용암·차원 균열) */
  glow?: { color: number; scale: number; width: number; strength: number };
  scatter: ScatterSpec[];
}

export interface GroundOptions {
  seed: number;
  /** 길 세기 (월드 좌표 → 0~1) */
  path?: (x: number, z: number) => number;
  /** 판이 깔리는 정도를 덮어쓴다 (월드 좌표 → 0~1). 없으면 노이즈 */
  paved?: (x: number, z: number) => number;
  /** 판 노이즈에 곱하는 값 (방 안은 1, 복도는 낮게 등) */
  pavedBias?: (x: number, z: number) => number;
  /**
   * 칸마다 한 장씩 깐 바닥 타일 (정점 색으로): 칸 경계는 줄눈 색, 칸 안은 장마다 조금씩 다른 색.
   * area가 참인 칸에만 (차원집 공장 바닥처럼 격자에 맞춰야 할 때)
   */
  cellTiles?: { grout: number; tint: number; area: (cx: number, cy: number) => boolean };
  /** 소품을 두지 않을 곳 (건물 밑 등) */
  avoid?: (x: number, z: number) => boolean;
}

const SUB = 4;
const SLAB_H = 0.05;

// ---------------- 층별 바닥 ----------------

export const GROUND_STYLES: Record<number, GroundStyle> = {
  // 이끼 낀 숲 유적: 흙 위의 이끼, 무너진 돌판, 풀·꽃·낙엽
  1: {
    base: 0x5f6f40,
    jitter: 0.1,
    layers: [
      { color: 0x6f9a46, scale: 0.09, lo: 0.42, hi: 0.62 },
      { color: 0x7a6446, scale: 0.13, lo: 0.6, hi: 0.74 },
      { color: 0x4d6a34, scale: 0.3, lo: 0.6, hi: 0.8 },
    ],
    path: 0x7d6a4c,
    edgeShade: 0.35,
    paved: { colors: [0x8e8c80, 0x86857a, 0x9a978a, 0x7a7c6e], per: 2, gap: 0.08, wobble: 0.08, scale: 0.08, lo: 0.5, hi: 0.66, missing: 0.14 },
    scatter: [
      { kind: 'tuft', colors: [0x6aa040, 0x86b453, 0x5a8e3a], per: 2.4, on: 0 },
      { kind: 'tuft', colors: [0x6aa040, 0x7aa84a], per: 0.5, on: 'open' },
      { kind: 'flower', colors: [0xf0e070, 0xe86a5a, 0xf4f4f0, 0xb88ae8], per: 0.35, on: 0 },
      { kind: 'leaf', colors: [0xc8823a, 0xa86a2a, 0xd8a040], per: 0.5, on: 1 },
      { kind: 'pebble', colors: [0x7a7a70, 0x8a887c], per: 0.5, on: 'open' },
      { kind: 'rock', colors: [0x6e6e64, 0x7c7a6c], per: 0.45, on: 'edge' },
      { kind: 'crack', colors: [0x5a5a50], per: 0.35, on: 'paved' },
      { kind: 'tuft', colors: [0x7aa84a], per: 0.3, on: 'paved' },
    ],
  },
  // 붉은 협곡: 붉은 흙과 모래 얼룩, 사암판, 마른 풀·뼛조각·갈라진 땅
  2: {
    base: 0xae643a,
    jitter: 0.12,
    layers: [
      { color: 0xc8905a, scale: 0.08, lo: 0.45, hi: 0.66 },
      { color: 0x8a4a2c, scale: 0.14, lo: 0.6, hi: 0.76 },
    ],
    path: 0xc08a58,
    edgeShade: 0.35,
    paved: { colors: [0xc99a6a, 0xbf8e5e, 0xd2a676], per: 2, gap: 0.09, wobble: 0.1, scale: 0.08, lo: 0.55, hi: 0.7, missing: 0.2 },
    scatter: [
      { kind: 'crack', colors: [0x7a3a22], per: 0.6, on: 'open' },
      { kind: 'tuft', colors: [0xc9a043, 0xb08a3a], per: 0.5, on: 0 },
      { kind: 'pebble', colors: [0x8e4a2c, 0xa05a36], per: 0.8, on: 'open' },
      { kind: 'rock', colors: [0x8e4a2c, 0x7a3e24], per: 0.5, on: 'edge' },
      { kind: 'bonebit', colors: [0xe8dcc4], per: 0.12, on: 'open' },
      { kind: 'crack', colors: [0x9a6a40], per: 0.3, on: 'paved' },
    ],
  },
  // 얼어붙은 동굴: 눈 덮인 얼음, 파란 빙판, 얼음판, 눈덩이·얼음 조각
  3: {
    base: 0xb4cfe0,
    jitter: 0.06,
    layers: [
      { color: 0xeef6fb, scale: 0.09, lo: 0.45, hi: 0.62 },
      { color: 0x86b8d8, scale: 0.12, lo: 0.62, hi: 0.74 },
    ],
    path: 0xa6c2d4,
    edgeShade: 0.28,
    paved: { colors: [0xa8d4ec, 0x9ccbe6, 0xb6dcf0], per: 2, gap: 0.07, wobble: 0.05, scale: 0.08, lo: 0.55, hi: 0.68, missing: 0.12 },
    scatter: [
      { kind: 'lump', colors: [0xf4f9fc, 0xe6f0f6], per: 0.9, on: 0 },
      { kind: 'chip', colors: [0x9fe3ff, 0xc4f0ff], per: 0.35, on: 'edge' },
      { kind: 'crack', colors: [0x6a9ec0], per: 0.35, on: 1 },
      { kind: 'crack', colors: [0x7aaecc], per: 0.4, on: 'paved' },
      { kind: 'pebble', colors: [0x8fa9bf], per: 0.4, on: 'open' },
      { kind: 'rock', colors: [0x7f99af, 0x8fa9bf], per: 0.4, on: 'edge' },
    ],
  },
  // 수정 광맥: 어두운 보랏빛 암반, 희미하게 빛나는 결, 수정 조각
  4: {
    base: 0x4a4266,
    jitter: 0.1,
    layers: [
      { color: 0x5d5482, scale: 0.1, lo: 0.45, hi: 0.64 },
      { color: 0x362f4e, scale: 0.14, lo: 0.6, hi: 0.76 },
    ],
    path: 0x564c74,
    edgeShade: 0.4,
    paved: { colors: [0x635a86, 0x5a527c, 0x6c6390], per: 2, gap: 0.08, wobble: 0.06, scale: 0.08, lo: 0.55, hi: 0.68, missing: 0.15 },
    glow: { color: 0x6ad8d0, scale: 0.09, width: 0.035, strength: 0.35 },
    scatter: [
      { kind: 'chip', colors: [0xc28cff, 0x7fe0d0, 0xa870f0], per: 0.9, on: 'edge' },
      { kind: 'chip', colors: [0xc28cff, 0x7fe0d0], per: 0.25, on: 0 },
      { kind: 'pebble', colors: [0x4a4064, 0x564c74], per: 0.8, on: 'open' },
      { kind: 'rock', colors: [0x3e3656, 0x4a4064], per: 0.4, on: 'edge' },
      { kind: 'crack', colors: [0x3a3252], per: 0.35, on: 'paved' },
    ],
  },
  // 폐허가 된 마공학 공장: 콘크리트 바닥, 기름·녹 얼룩, 볼트 박힌 금속판
  5: {
    base: 0x5a5d64,
    jitter: 0.08,
    layers: [
      { color: 0x42444a, scale: 0.12, lo: 0.58, hi: 0.72 },
      { color: 0x7a5a40, scale: 0.1, lo: 0.62, hi: 0.76 },
    ],
    path: 0x66686e,
    edgeShade: 0.4,
    paved: { colors: [0x737780, 0x6a6e76, 0x7c808a, 0x6e6458], per: 1, gap: 0.05, wobble: 0.02, scale: 0.07, lo: 0.4, hi: 0.55, missing: 0.1, bolts: 0x9a9ca4 },
    scatter: [
      { kind: 'bolt', colors: [0x8a8c94, 0xb08a3a], per: 0.7, on: 'open' },
      { kind: 'puddle', colors: [0x2c2e34, 0x34302c], per: 0.18, on: 0 },
      { kind: 'crack', colors: [0x44464c], per: 0.6, on: 'paved' },
      { kind: 'rock', colors: [0x55524e, 0x5f5a52], per: 0.4, on: 'edge' },
      { kind: 'pebble', colors: [0x6a6660], per: 0.4, on: 'open' },
    ],
  },
  // 용암 심연: 현무암과 재, 빛나는 용암 틈, 검은 판석
  6: {
    base: 0x3a2826,
    jitter: 0.1,
    layers: [
      { color: 0x281c1c, scale: 0.1, lo: 0.5, hi: 0.68 },
      { color: 0x5a4640, scale: 0.13, lo: 0.62, hi: 0.76 },
    ],
    path: 0x4a3632,
    edgeShade: 0.4,
    paved: { colors: [0x46322f, 0x3e2c2a, 0x503a36], per: 2, gap: 0.1, wobble: 0.08, scale: 0.08, lo: 0.55, hi: 0.7, missing: 0.2 },
    glow: { color: 0xff5a1a, scale: 0.07, width: 0.03, strength: 0.9 },
    scatter: [
      { kind: 'pebble', colors: [0x2a1e1e, 0x3a2a28], per: 1, on: 'open' },
      { kind: 'rock', colors: [0x2e2228, 0x3a2a28], per: 0.5, on: 'edge' },
      { kind: 'chip', colors: [0xff6a2a, 0xffa040], per: 0.25, on: 'edge' },
      { kind: 'bonebit', colors: [0xcfc0a8], per: 0.08, on: 'open' },
      { kind: 'crack', colors: [0x1e1414], per: 0.4, on: 'paved' },
    ],
  },
  // 부서진 차원: 보랏빛 공허 위에 떠 있는 판, 청록빛 균열, 차원 조각
  7: {
    base: 0x2a284a,
    jitter: 0.1,
    layers: [
      { color: 0x3a3872, scale: 0.1, lo: 0.48, hi: 0.66 },
      { color: 0x18162e, scale: 0.13, lo: 0.6, hi: 0.76 },
    ],
    path: 0x34325c,
    edgeShade: 0.45,
    paved: { colors: [0x3c3a66, 0x44427a, 0x34325a], per: 2, gap: 0.12, wobble: 0.1, scale: 0.08, lo: 0.5, hi: 0.66, missing: 0.22 },
    glow: { color: 0x5ef0ff, scale: 0.08, width: 0.022, strength: 0.6 },
    scatter: [
      { kind: 'chip', colors: [0x5ef0ff, 0x7a5cff], per: 0.7, on: 'edge' },
      { kind: 'chip', colors: [0x5ef0ff, 0x7a5cff], per: 0.2, on: 'open' },
      { kind: 'pebble', colors: [0x2a2848, 0x3a3866], per: 0.6, on: 'open' },
      { kind: 'rock', colors: [0x24223e, 0x2e2c50], per: 0.4, on: 'edge' },
      { kind: 'crack', colors: [0x1c1a34], per: 0.4, on: 'paved' },
    ],
  },
};

/** 차원마을: 풀밭, 자갈길, 꽃과 풀 */
export const VILLAGE_GROUND: GroundStyle = {
  base: 0x5a8c40,
  jitter: 0.08,
  layers: [
    { color: 0x72a64e, scale: 0.08, lo: 0.42, hi: 0.64 },
    { color: 0x48763a, scale: 0.12, lo: 0.58, hi: 0.74 },
    { color: 0x8a7a50, scale: 0.16, lo: 0.74, hi: 0.84 },
  ],
  path: 0x9a8662,
  edgeShade: 0.2,
  paved: { colors: [0xa8a292, 0x9a9484, 0xb4ae9c, 0x8e887a, 0xa09888], per: 3, gap: 0.12, wobble: 0.22, scale: 0, lo: 0, hi: 1, missing: 0.04 },
  scatter: [
    { kind: 'tuft', colors: [0x6aa048, 0x7ab456, 0x5a9040], per: 2.2, on: 'open' },
    { kind: 'tuft', colors: [0x86be5a], per: 1.4, on: 0 },
    { kind: 'flower', colors: [0xf0e070, 0xf4f4f0, 0xe87a8a, 0xb88ae8, 0xf0a040], per: 0.5, on: 0 },
    { kind: 'pebble', colors: [0x9a9484, 0x8a8474], per: 0.35, on: 'path' },
    { kind: 'pebble', colors: [0x8a8a7e], per: 0.12, on: 'open' },
  ],
};

/** 차원집: 보랏빛 돌 타일 공장 바닥 (칸에 맞춘 줄눈), 희미한 룬 결, 입구는 따뜻한 돌판 광장 */
export const HOME_GROUND: GroundStyle = {
  base: 0x4c4766,
  jitter: 0.08,
  layers: [
    { color: 0x5a5478, scale: 0.12, lo: 0.45, hi: 0.66 },
    { color: 0x3c3854, scale: 0.16, lo: 0.6, hi: 0.76 },
  ],
  path: 0x5e5048,
  edgeShade: 0.4,
  paved: { colors: [0x8a7a68, 0x7e6e5e, 0x948470, 0x6e6152], per: 2, gap: 0.07, wobble: 0.04, scale: 0, lo: 0, hi: 1, missing: 0.03 },
  scatter: [
    { kind: 'crack', colors: [0x363250], per: 0.25, on: 0 },
    { kind: 'crack', colors: [0x5a4e42], per: 0.35, on: 'paved' },
    { kind: 'chip', colors: [0xc28cff, 0x8ad8ff], per: 0.8, on: 'path' },
    { kind: 'pebble', colors: [0x5a5470, 0x6a6480], per: 0.3, on: 'path' },
  ],
};

export function groundStyleFor(tier: number): GroundStyle {
  return GROUND_STYLES[Math.min(Math.max(tier, 1), 7)];
}

// ---------------- 만들기 ----------------

/** 정점 색이 들어간 삼각형을 모은다 */
class Tris {
  pos: number[] = [];
  col: number[] = [];
  tri(a: number[], b: number[], c: number[], ca: Color, cb = ca, cc = ca): void {
    this.pos.push(...a, ...b, ...c);
    this.col.push(ca.r, ca.g, ca.b, cb.r, cb.g, cb.b, cc.r, cc.g, cc.b);
  }
  quad(a: number[], b: number[], c: number[], d: number[], col: Color): void {
    this.tri(a, b, c, col);
    this.tri(a, c, d, col);
  }
  geometry(): BufferGeometry | null {
    if (this.pos.length === 0) return null;
    const g = new BufferGeometry();
    g.setAttribute('position', new Float32BufferAttribute(this.pos, 3));
    g.setAttribute('color', new Float32BufferAttribute(this.col, 3));
    g.computeVertexNormals();
    return g;
  }
}

const tmp = new Color();
const shadeC = (hex: number, k: number) => new Color(hex).multiplyScalar(k);

/** y축으로 돌린 상자 (윗면과 옆면만) */
function box(t: Tris, x: number, z: number, y0: number, y1: number, sx: number, sz: number, rot: number, top: Color, side: Color, tilt = 0): void {
  const c = Math.cos(rot);
  const s = Math.sin(rot);
  const corner = (dx: number, dz: number, y: number) => [x + dx * c - dz * s, y + (y > y0 ? dx * tilt : 0), z + dx * s + dz * c];
  const hx = sx / 2;
  const hz = sz / 2;
  const t0 = corner(-hx, -hz, y1);
  const t1 = corner(hx, -hz, y1);
  const t2 = corner(hx, hz, y1);
  const t3 = corner(-hx, hz, y1);
  const b0 = corner(-hx, -hz, y0);
  const b1 = corner(hx, -hz, y0);
  const b2 = corner(hx, hz, y0);
  const b3 = corner(-hx, hz, y0);
  t.quad(t0, t3, t2, t1, top);
  t.quad(b0, t0, t1, b1, side);
  t.quad(b1, t1, t2, b2, side);
  t.quad(b2, t2, t3, b3, side);
  t.quad(b3, t3, t0, b0, side);
}

/** 울퉁불퉁한 돌 (고리 두 개 + 꼭대기) */
function rock(t: Tris, rng: Rng, x: number, z: number, r: number, h: number, color: number): void {
  const n = rng.int(5, 7);
  const a0 = rng.range(0, Math.PI * 2);
  const low: number[][] = [];
  const mid: number[][] = [];
  for (let i = 0; i < n; i++) {
    const a = a0 + (i / n) * Math.PI * 2;
    const rr = r * rng.range(0.8, 1.1);
    low.push([x + Math.cos(a) * rr, -0.02, z + Math.sin(a) * rr]);
    const am = a + Math.PI / n;
    const rm = r * rng.range(0.6, 0.8);
    mid.push([x + Math.cos(am) * rm, h * rng.range(0.5, 0.65), z + Math.sin(am) * rm]);
  }
  const top = [x + rng.range(-0.2, 0.2) * r, h, z + rng.range(-0.2, 0.2) * r];
  const dark = shadeC(color, 0.8);
  const base = new Color(color);
  const light = shadeC(color, 1.12);
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    t.tri(low[i], mid[i], low[j], dark, base, dark);
    t.tri(low[j], mid[i], mid[j], dark, base, base);
    t.tri(mid[i], top, mid[j], base, light, base);
  }
}

/** 풀 한 포기: 끝이 밝아지는 잎 몇 장 */
function tuft(t: Tris, rng: Rng, x: number, z: number, h: number, color: number): void {
  const n = rng.int(3, 5);
  const root = shadeC(color, 0.7);
  for (let i = 0; i < n; i++) {
    const a = rng.range(0, Math.PI * 2);
    const ox = x + Math.cos(a) * rng.range(0, 0.08);
    const oz = z + Math.sin(a) * rng.range(0, 0.08);
    const w = 0.035;
    const px = Math.cos(a + Math.PI / 2) * w;
    const pz = Math.sin(a + Math.PI / 2) * w;
    const lean = rng.range(0.05, 0.16);
    const hh = h * rng.range(0.7, 1.15);
    const tip = shadeC(color, rng.range(1.05, 1.25));
    t.tri([ox - px, 0, oz - pz], [ox + px, 0, oz + pz], [ox + Math.cos(a) * lean, hh, oz + Math.sin(a) * lean], root, root, tip);
  }
}

/** 작은 꽃: 줄기 + 꽃송이 */
function flower(t: Tris, rng: Rng, x: number, z: number, color: number): void {
  const h = rng.range(0.16, 0.26);
  const stem = new Color(0x4a7a34);
  t.tri([x - 0.015, 0, z], [x + 0.015, 0, z], [x, h, z], stem);
  const petal = new Color(color);
  const r = 0.055;
  const center = [x, h + 0.02, z];
  const heart = new Color(0xf0c040);
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    const b = ((i + 1) / 5) * Math.PI * 2;
    t.tri(center, [x + Math.cos(a) * r, h, z + Math.sin(a) * r], [x + Math.cos(b) * r, h, z + Math.sin(b) * r], heart, petal, petal);
  }
}

/** 땅에 그은 금: 구불구불한 가는 띠 */
function crack(t: Tris, rng: Rng, x: number, z: number, y: number, color: number, len: number): void {
  const c = new Color(color);
  let a = rng.range(0, Math.PI * 2);
  let px = x;
  let pz = z;
  let w = 0.035;
  const segs = Math.max(2, Math.round(len / 0.16));
  for (let i = 0; i < segs; i++) {
    a += rng.range(-0.7, 0.7);
    const nx = px + Math.cos(a) * 0.16;
    const nz = pz + Math.sin(a) * 0.16;
    const w2 = w * 0.82;
    const ox = -Math.sin(a);
    const oz = Math.cos(a);
    t.quad([px + ox * w, y, pz + oz * w], [nx + ox * w2, y, nz + oz * w2], [nx - ox * w2, y, nz - oz * w2], [px - ox * w, y, pz - oz * w], c);
    // 곁가지
    if (i === 1 && rng.chance(0.5)) crack(t, rng, nx, nz, y, color, len * 0.4);
    px = nx;
    pz = nz;
    w = w2;
  }
}

/** 납작한 조각 (웅덩이·낙엽) */
function flat(t: Tris, rng: Rng, x: number, z: number, y: number, r: number, n: number, color: number, stretch = 1): void {
  const c = new Color(color);
  const rot = rng.range(0, Math.PI * 2);
  const pts: number[][] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const rr = r * rng.range(0.75, 1.1);
    const lx = Math.cos(a) * rr * stretch;
    const lz = Math.sin(a) * rr;
    pts.push([x + lx * Math.cos(rot) - lz * Math.sin(rot), y, z + lx * Math.sin(rot) + lz * Math.cos(rot)]);
  }
  const center = [x, y, z];
  for (let i = 0; i < n; i++) t.tri(center, pts[(i + 1) % n], pts[i], c);
}

/** 수정 조각: 기울어진 뾰족한 기둥 */
function chip(t: Tris, rng: Rng, x: number, z: number, h: number, color: number): void {
  const n = 4;
  const r = h * 0.28;
  const lx = rng.range(-0.3, 0.3) * h;
  const lz = rng.range(-0.3, 0.3) * h;
  const a0 = rng.range(0, Math.PI);
  const base: number[][] = [];
  const mid: number[][] = [];
  for (let i = 0; i < n; i++) {
    const a = a0 + (i / n) * Math.PI * 2;
    base.push([x + Math.cos(a) * r, -0.02, z + Math.sin(a) * r]);
    mid.push([x + Math.cos(a) * r * 0.9 + lx * 0.6, h * 0.6, z + Math.sin(a) * r * 0.9 + lz * 0.6]);
  }
  const top = [x + lx, h, z + lz];
  const c1 = new Color(color);
  const c2 = shadeC(color, 1.3);
  const c0 = shadeC(color, 0.7);
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    t.tri(base[i], mid[i], base[j], c0, c1, c0);
    t.tri(base[j], mid[i], mid[j], c0, c1, c1);
    t.tri(mid[i], top, mid[j], c1, c2, c1);
  }
}

/** 한 칸 안의 벽까지 거리 (칸 단위) */
function edgeDistance(grid: Grid, gx: number, gz: number): number {
  const cx = Math.floor(gx);
  const cz = Math.floor(gz);
  let best = 3;
  for (let dz = -2; dz <= 2; dz++) {
    for (let dx = -2; dx <= 2; dx++) {
      if (isFloor(grid, cx + dx, cz + dz)) continue;
      const qx = Math.max(cx + dx, Math.min(gx, cx + dx + 1));
      const qz = Math.max(cz + dz, Math.min(gz, cz + dz + 1));
      best = Math.min(best, Math.hypot(gx - qx, gz - qz));
    }
  }
  return best;
}

export interface GroundMeshes {
  ground: Mesh;
  details: Mesh | null;
  glow: Mesh | null;
  veins: Mesh | null;
}

/** 바닥 전체: 땅 + 판 + 소품 + 빛나는 틈 */
export function buildGround(grid: Grid, style: GroundStyle, opts: GroundOptions): GroundMeshes {
  const { width, height } = grid;
  const seed = opts.seed;
  const rng = new Rng(seed ^ 0x2545f491);
  const layerSeed = (i: number) => seed + 7919 * (i + 1);
  const pathAt = (x: number, z: number) => (opts.path ? opts.path(x, z) : 0);
  const layerK = (i: number, x: number, z: number) => {
    const L = style.layers[i];
    return smoothstep(L.lo, L.hi, fbm(x * L.scale, z * L.scale, layerSeed(i)));
  };

  // ---- 땅: 칸마다 4×4로 나눈 그물, 정점마다 색을 섞어 부드럽게 ----
  const VW = width * SUB + 1;
  const VH = height * SUB + 1;
  const vIndex = new Int32Array(VW * VH).fill(-1);
  const positions: number[] = [];
  const colors: number[] = [];
  const glowCol: number[] = [];
  const base = new Color();
  const glowColor = style.glow ? new Color(style.glow.color) : null;
  const pathColor = style.path !== undefined ? new Color(style.path) : null;
  // 빛나는 틈: 능선 노이즈의 등마루를 따라 흐른다. 벽 가까이와 길에는 덜 난다
  const glowN = (x: number, z: number) => (style.glow ? fbm(x * style.glow.scale, z * style.glow.scale, seed + 404, 3) : 0);
  const glowK = (x: number, z: number, d: number, p: number) => {
    if (!style.glow) return 0;
    const ridge = 1 - Math.abs(glowN(x, z) - 0.5) * 2;
    return smoothstep(1 - style.glow.width * 2.6, 1 - style.glow.width * 0.3, ridge) * smoothstep(0.3, 1, d) * (1 - p) * style.glow.strength;
  };
  const vertex = (vx: number, vz: number): number => {
    const key = vz * VW + vx;
    if (vIndex[key] >= 0) return vIndex[key];
    const gx = vx / SUB;
    const gz = vz / SUB;
    const x = gx * TILE;
    const z = gz * TILE;
    base.setHex(style.base).multiplyScalar(1 + style.jitter * (fbm(x * 0.9, z * 0.9, seed + 11, 2) - 0.5) * 2);
    for (let i = 0; i < style.layers.length; i++) {
      const k = layerK(i, x, z);
      if (k > 0) base.lerp(tmp.setHex(style.layers[i].color), k);
    }
    const p = pathAt(x, z);
    if (pathColor && p > 0) base.lerp(pathColor, p * (0.65 + 0.35 * fbm(x * 0.5, z * 0.5, seed + 5)));
    const ct = opts.cellTiles;
    if (ct) {
      const onEdge = vx % SUB === 0 || vz % SUB === 0;
      const cx = Math.min(width - 1, Math.floor(gx));
      const cy = Math.min(height - 1, Math.floor(gz));
      // 줄눈: 경계 정점이 타일 칸에 닿아 있으면 (양옆 어느 칸이든)
      const xs = vx % SUB === 0 ? [vx / SUB - 1, vx / SUB] : [Math.floor(gx)];
      const zs = vz % SUB === 0 ? [vz / SUB - 1, vz / SUB] : [Math.floor(gz)];
      const touches = onEdge && xs.some((x) => zs.some((z) => ct.area(x, z)));
      if (touches) base.lerp(tmp.setHex(ct.grout), 0.75);
      else if (!onEdge && ct.area(cx, cy)) {
        // 칸마다 정해진 흔들림 (같은 칸 안 정점은 같은 값)
        const h = Math.sin(cx * 127.1 + cy * 311.7 + seed) * 43758.5453;
        base.multiplyScalar(1 + (h - Math.floor(h) - 0.5) * 2 * ct.tint);
      }
    }
    const d = edgeDistance(grid, gx, gz);
    base.multiplyScalar(1 - style.edgeShade * (1 - smoothstep(0, 0.9, d)));
    const idx = positions.length / 3;
    positions.push(x, 0, z);
    colors.push(base.r, base.g, base.b);
    if (glowColor) {
      const k = glowK(x, z, d, p) * 0.55;
      glowCol.push(glowColor.r * k, glowColor.g * k, glowColor.b * k);
    }
    vIndex[key] = idx;
    return idx;
  };
  const indices: number[] = [];
  const glowIdx: number[] = [];
  for (let cy = 0; cy < height; cy++) {
    for (let cx = 0; cx < width; cx++) {
      if (!isFloor(grid, cx, cy)) continue;
      for (let sy = 0; sy < SUB; sy++) {
        for (let sx = 0; sx < SUB; sx++) {
          const vx = cx * SUB + sx;
          const vz = cy * SUB + sy;
          const a = vertex(vx, vz);
          const b = vertex(vx + 1, vz);
          const c = vertex(vx + 1, vz + 1);
          const d = vertex(vx, vz + 1);
          indices.push(a, d, c, a, c, b);
          if (glowColor) {
            const lit = [a, b, c, d].some((i) => glowCol[i * 3] + glowCol[i * 3 + 1] + glowCol[i * 3 + 2] > 0.01);
            if (lit) glowIdx.push(a, d, c, a, c, b);
          }
        }
      }
    }
  }
  const groundGeo = new BufferGeometry();
  groundGeo.setAttribute('position', new Float32BufferAttribute(positions, 3));
  groundGeo.setAttribute('color', new Float32BufferAttribute(colors, 3));
  const normals = new Float32Array(positions.length);
  for (let i = 1; i < normals.length; i += 3) normals[i] = 1;
  groundGeo.setAttribute('normal', new BufferAttribute(normals, 3));
  groundGeo.setIndex(indices);
  const ground = new Mesh(groundGeo, new MeshLambertMaterial({ vertexColors: true }));
  ground.receiveShadow = true;

  let glow: Mesh | null = null;
  if (glowColor && glowIdx.length > 0) {
    const g = new BufferGeometry();
    g.setAttribute('position', new Float32BufferAttribute(positions, 3));
    g.setAttribute('color', new Float32BufferAttribute(glowCol, 3));
    g.setIndex(glowIdx);
    glow = new Mesh(
      g,
      new MeshBasicMaterial({ vertexColors: true, blending: AdditiveBlending, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }),
    );
    glow.position.y = 0.005;
    glow.renderOrder = 1;
  }

  // 가는 빛줄기: 틈이 짙은 곳에서 시작해 등마루 방향으로 양쪽으로 뻗는다
  let veins: Mesh | null = null;
  if (glowColor && style.glow) {
    const vt = new Tris();
    const bright = glowColor.clone().lerp(new Color(0xffe0a0), 0.3);
    const e = 0.05;
    const tangent = (x: number, z: number): [number, number] => {
      const gx = glowN(x + e, z) - glowN(x - e, z);
      const gz = glowN(x, z + e) - glowN(x, z - e);
      const l = Math.hypot(gx, gz) || 1;
      return [-gz / l, gx / l];
    };
    const trace = (x: number, z: number, sign: number, w: number) => {
      let [tx, tz] = tangent(x, z);
      tx *= sign;
      tz *= sign;
      for (let i = 0; i < 7; i++) {
        const [nx0, nz0] = tangent(x, z);
        const flip = nx0 * tx + nz0 * tz < 0 ? -1 : 1;
        tx = nx0 * flip + rngV.range(-0.25, 0.25);
        tz = nz0 * flip + rngV.range(-0.25, 0.25);
        const l = Math.hypot(tx, tz) || 1;
        tx /= l;
        tz /= l;
        const nx = x + tx * 0.28;
        const nz = z + tz * 0.28;
        if (!isFloor(grid, Math.floor(nx / TILE), Math.floor(nz / TILE)) || edgeDistance(grid, nx / TILE, nz / TILE) < 0.2) return;
        const w2 = w * 0.85;
        vt.quad([x - tz * w, 0.012, z + tx * w], [nx - tz * w2, 0.012, nz + tx * w2], [nx + tz * w2, 0.012, nz - tx * w2], [x + tz * w, 0.012, z - tx * w], bright);
        x = nx;
        z = nz;
        w = w2;
      }
    };
    const rngV = new Rng(seed ^ 0x51ed27);
    for (let cy = 0; cy < height; cy++) {
      for (let cx = 0; cx < width; cx++) {
        if (!isFloor(grid, cx, cy)) continue;
        for (let i = 0; i < 1; i++) {
          const x = (cx + rngV.next()) * TILE;
          const z = (cy + rngV.next()) * TILE;
          const k = glowK(x, z, edgeDistance(grid, x / TILE, z / TILE), pathAt(x, z)) / style.glow.strength;
          if (rngV.next() > k * 0.5) continue;
          const w = 0.035 + 0.045 * style.glow.strength;
          trace(x, z, 1, w);
          trace(x, z, -1, w);
        }
      }
    }
    const vg = vt.geometry();
    if (vg) {
      veins = new Mesh(vg, new MeshBasicMaterial({ vertexColors: true, side: DoubleSide, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3 }));
      veins.renderOrder = 2;
    }
  }

  // ---- 판: 노이즈(또는 길)가 짙은 곳에 깔고, 가장자리로 갈수록 드문드문 ----
  const t = new Tris();
  const pv = style.paved;
  const per = pv?.per ?? 1;
  const slabW = width * per;
  const slabs = new Uint8Array(slabW * height * per);
  if (pv) {
    const size = TILE / per;
    for (let sy = 0; sy < height * per; sy++) {
      for (let sx = 0; sx < slabW; sx++) {
        const cx = Math.floor(sx / per);
        const cy = Math.floor(sy / per);
        if (!isFloor(grid, cx, cy)) continue;
        const x = (sx + 0.5) * size;
        const z = (sy + 0.5) * size;
        let k = opts.paved ? opts.paved(x, z) : smoothstep(pv.lo, pv.hi, fbm(x * pv.scale, z * pv.scale, seed + 3131));
        if (opts.pavedBias) k *= opts.pavedBias(x, z);
        if (k <= 0.02 || rng.next() > k * 1.15 || rng.chance(pv.missing)) continue;
        // 벽에 너무 붙은 판은 벽 속으로 파묻히지 않게 뺀다
        if (edgeDistance(grid, x / TILE, z / TILE) < 0.08) continue;
        slabs[sy * slabW + sx] = 1;
        const col = shadeC(rng.pick(pv.colors), rng.range(0.9, 1.08));
        const side = shadeC(col.getHex(), 0.7);
        const s = size * (1 - pv.gap) * rng.range(0.94, 1.02);
        const sz = per >= 3 ? s * rng.range(0.8, 1.05) : s;
        const sunk = rng.chance(0.15) ? -0.025 : 0;
        const tilt = per < 3 && rng.chance(0.1) ? rng.range(-0.05, 0.05) : 0;
        box(t, x + rng.range(-0.03, 0.03), z + rng.range(-0.03, 0.03), -0.05, SLAB_H + sunk + rng.range(-0.008, 0.008), s, sz, rng.range(-pv.wobble, pv.wobble), col, side, tilt);
        if (pv.bolts) {
          const bc = new Color(pv.bolts);
          const o = s / 2 - 0.12;
          for (const [bx, bz] of [
            [-o, -o],
            [o, -o],
            [o, o],
            [-o, o],
          ])
            box(t, x + bx, z + bz, SLAB_H - 0.01, SLAB_H + 0.025, 0.07, 0.07, 0.4, bc, shadeC(pv.bolts, 0.7));
          // 판 가운데 이음매
          if (rng.chance(0.5)) box(t, x, z, SLAB_H - 0.005, SLAB_H + 0.004, s * 0.9, 0.04, 0, shadeC(col.getHex(), 0.75), side);
        }
      }
    }
  }
  const slabAt = (x: number, z: number) => {
    if (!pv) return false;
    const sx = Math.floor((x / TILE) * per);
    const sy = Math.floor((z / TILE) * per);
    return sx >= 0 && sy >= 0 && sx < slabW && sy < height * per && slabs[sy * slabW + sx] === 1;
  };

  // ---- 소품: 칸마다 개수를 정하고, 어울리는 자리에만 남긴다 ----
  for (const sc of style.scatter) {
    for (let cy = 0; cy < height; cy++) {
      for (let cx = 0; cx < width; cx++) {
        if (!isFloor(grid, cx, cy)) continue;
        let n = Math.floor(sc.per) + (rng.chance(sc.per % 1) ? 1 : 0);
        // 조건에 맞는 자리는 드물어서 몇 번 더 시도한다
        const tries = sc.on === undefined ? n : n * 2;
        for (let i = 0; i < tries && n > 0; i++) {
          const x = (cx + rng.next()) * TILE;
          const z = (cy + rng.next()) * TILE;
          if (opts.avoid?.(x, z)) continue;
          const onSlab = slabAt(x, z);
          const path = pathAt(x, z);
          let w: number;
          if (typeof sc.on === 'number') w = onSlab ? 0 : layerK(sc.on, x, z) * (1 - path);
          else if (sc.on === 'edge') w = onSlab ? 0.3 : 1 - smoothstep(0.1, 0.7, edgeDistance(grid, x / TILE, z / TILE));
          else if (sc.on === 'paved') w = onSlab ? 1 : 0;
          else if (sc.on === 'path') w = onSlab ? 0 : path;
          else w = onSlab ? 0 : 1 - path;
          if (rng.next() >= w) continue;
          n--;
          const color = rng.pick(sc.colors);
          const k = (sc.size ?? 1) * rng.range(0.75, 1.25);
          const y0 = onSlab ? SLAB_H : 0;
          switch (sc.kind) {
            case 'pebble':
              rock(t, rng, x, z, 0.08 * k, 0.07 * k, color);
              break;
            case 'rock':
              rock(t, rng, x, z, 0.22 * k, 0.2 * k, color);
              break;
            case 'lump':
              rock(t, rng, x, z, 0.2 * k, 0.1 * k, color);
              break;
            case 'tuft':
              tuft(t, rng, x, z, 0.28 * k, color);
              break;
            case 'flower':
              flower(t, rng, x, z, color);
              break;
            case 'crack':
              crack(t, rng, x, z, y0 + 0.006, color, 0.5 * k);
              break;
            case 'puddle':
              flat(t, rng, x, z, y0 + 0.004, 0.4 * k, 9, color, 1.4);
              break;
            case 'leaf':
              flat(t, rng, x, z, y0 + 0.008, 0.07 * k, 4, color, 1.8);
              break;
            case 'chip':
              chip(t, rng, x, z, 0.3 * k, color);
              break;
            case 'bolt':
              box(t, x, z, y0 - 0.01, y0 + 0.05 * k, 0.09 * k, 0.09 * k, rng.range(0, 3), new Color(color), shadeC(color, 0.7));
              break;
            case 'bonebit':
              box(t, x, z, y0, y0 + 0.04, 0.22 * k, 0.045, rng.range(0, 3), new Color(color), shadeC(color, 0.8));
              break;
          }
        }
      }
    }
  }
  const dg = t.geometry();
  let details: Mesh | null = null;
  if (dg) {
    details = new Mesh(dg, new MeshLambertMaterial({ vertexColors: true, flatShading: true, side: DoubleSide, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 }));
    details.receiveShadow = true;
  }
  return { ground, details, glow, veins };
}
