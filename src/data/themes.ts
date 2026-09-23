/** 차원던전 1~7단계의 테마 */
export type DecorKind = 'grass' | 'rock' | 'shard' | 'mushroom' | 'gear' | 'bone';

export interface DungeonTheme {
  tier: number;
  name: string;
  /** 차원문 색 */
  portalColor: number;
  background: number;
  floorA: number;
  floorB: number;
  wallSide: number;
  wallTop: number;
  ambient: number;
  sun: number;
  /** 광석·나무 말고 이 단계에서만 나오는 채집물 (NodeDef id) */
  special: string[];
  decor: { kind: DecorKind; color: number }[];
}

export const THEMES: DungeonTheme[] = [
  {
    tier: 1,
    name: '이끼 낀 숲 유적',
    portalColor: 0xf2f2f2,
    background: 0x16201a,
    floorA: 0x5d7a45,
    floorB: 0x6c8a4e,
    wallSide: 0x5a5a52,
    wallTop: 0x6f8f4a,
    ambient: 0xcfe8c8,
    sun: 0xfff1d6,
    special: [],
    decor: [
      { kind: 'grass', color: 0x86b453 },
      { kind: 'mushroom', color: 0xd9543f },
      { kind: 'rock', color: 0x7a7a70 },
    ],
  },
  {
    tier: 2,
    name: '붉은 협곡',
    portalColor: 0x6be26b,
    background: 0x24140f,
    floorA: 0xb0643a,
    floorB: 0xbd7446,
    wallSide: 0x7e3f26,
    wallTop: 0xc78152,
    ambient: 0xffd9c2,
    sun: 0xffe0b0,
    special: [],
    decor: [
      { kind: 'rock', color: 0x8e4a2c },
      { kind: 'bone', color: 0xe8dcc4 },
      { kind: 'grass', color: 0xc9a043 },
    ],
  },
  {
    tier: 3,
    name: '얼어붙은 동굴',
    portalColor: 0x5aa8ff,
    background: 0x0e1824,
    floorA: 0xb9d3e3,
    floorB: 0xcbe0ec,
    wallSide: 0x5f7d98,
    wallTop: 0xe8f4fb,
    ambient: 0xd4ecff,
    sun: 0xe6f4ff,
    special: [],
    decor: [
      { kind: 'shard', color: 0x9fe3ff },
      { kind: 'rock', color: 0x8fa9bf },
    ],
  },
  {
    tier: 4,
    name: '수정 광맥',
    portalColor: 0xb36bff,
    background: 0x140e22,
    floorA: 0x4d4468,
    floorB: 0x574d76,
    wallSide: 0x3a3052,
    wallTop: 0x6d5b99,
    ambient: 0xd8c8ff,
    sun: 0xf0e0ff,
    special: [],
    decor: [
      { kind: 'shard', color: 0xc28cff },
      { kind: 'shard', color: 0x7fe0d0 },
      { kind: 'rock', color: 0x4a4064 },
    ],
  },
  {
    tier: 5,
    name: '폐허가 된 마공학 공장',
    portalColor: 0xffa53a,
    background: 0x15161a,
    floorA: 0x5c5f66,
    floorB: 0x676a72,
    wallSide: 0x4a4038,
    wallTop: 0x8a7a62,
    ambient: 0xe8e0d0,
    sun: 0xffe6c0,
    special: ['gear_pile', 'alloy_pile'],
    decor: [
      { kind: 'gear', color: 0xb08a3a },
      { kind: 'rock', color: 0x55524e },
    ],
  },
  {
    tier: 6,
    name: '용암 심연',
    portalColor: 0xff4a2a,
    background: 0x1e0806,
    floorA: 0x3d2a28,
    floorB: 0x47302c,
    wallSide: 0x2a1a18,
    wallTop: 0x6a2a1a,
    ambient: 0xffc0a0,
    sun: 0xffb080,
    special: [],
    decor: [
      { kind: 'shard', color: 0xff6a2a },
      { kind: 'rock', color: 0x2e2228 },
      { kind: 'bone', color: 0xcfc0a8 },
    ],
  },
  {
    tier: 7,
    name: '부서진 차원',
    portalColor: 0x5ef0ff,
    background: 0x05040e,
    floorA: 0x2c2a4a,
    floorB: 0x34325a,
    wallSide: 0x1c1a34,
    wallTop: 0x4a3f8a,
    ambient: 0xc0c8ff,
    sun: 0xd8e8ff,
    special: [],
    decor: [
      { kind: 'shard', color: 0x5ef0ff },
      { kind: 'shard', color: 0x7a5cff },
      { kind: 'rock', color: 0x2a2848 },
    ],
  },
];

export function themeForTier(tier: number): DungeonTheme {
  return THEMES[Math.min(Math.max(tier, 1), THEMES.length) - 1];
}
