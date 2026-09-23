/** 채집물(광맥, 나무, 결정 등)의 정의 */
export type NodeStyle = 'ore' | 'tree' | 'crystal' | 'scrap' | 'chest';

export interface NodeDef {
  id: string;
  name: string;
  style: NodeStyle;
  /** 한 번 칠 때마다 1개, 부서질 때 추가로 bonus 개가 나온다 */
  itemId: string;
  hp: number;
  bonus: number;
  /** 충돌 반경 (월드 단위) */
  radius: number;
  baseColor: number;
  accentColor: number;
}

const ORE_NODES: [string, string, number, number][] = [
  ['구리 광맥', 'copper_ore', 0x7a4a36, 0xe08a50],
  ['철 광맥', 'iron_ore', 0x6d6a66, 0xa9b0bc],
  ['금 광맥', 'gold_ore', 0x6a5a3a, 0xffd040],
  ['다이아 광맥', 'diamond_ore', 0x4a5a6a, 0xcffaff],
  ['티타늄 광맥', 'titanium_ore', 0x3e4650, 0xb8c4d4],
  ['오리하르콘 광맥', 'orichalcum_ore', 0x3a2622, 0xff8a4a],
  ['차원광물 광맥', 'dim_ore', 0x1e1a2e, 0x7a5cff],
];
const TREE_NODES: [string, string, number, number][] = [
  ['참나무', 'wood', 0x6b4a2e, 0x4f8a3c],
  ['적송', 'redpine_wood', 0x7a3522, 0x6a8a3a],
  ['서리나무', 'frost_wood', 0x6a7a8a, 0xbfe8ff],
  ['수정나무', 'crystal_wood', 0x5a4a78, 0xc28cff],
  ['철목', 'iron_wood', 0x3a3a40, 0x7a8a90],
  ['불꽃나무', 'flame_wood', 0x3a2020, 0xff6a2a],
  ['차원나무', 'dim_wood', 0x2a2a48, 0x5ef0ff],
];

const defs: NodeDef[] = [
  ...ORE_NODES.map(([name, itemId, baseColor, accentColor], i): NodeDef => ({ id: `ore_${i + 1}`, name, style: 'ore', itemId, hp: 4 + Math.floor(i / 2), bonus: 2, radius: 0.75, baseColor, accentColor })),
  ...TREE_NODES.map(([name, itemId, baseColor, accentColor], i): NodeDef => ({ id: `tree_${i + 1}`, name, style: 'tree', itemId, hp: 3 + Math.floor(i / 2), bonus: 2, radius: 0.55, baseColor, accentColor })),
  { id: 'frost_cluster', name: '서리 결정', style: 'crystal', itemId: 'frost_crystal', hp: 4, bonus: 2, radius: 0.65, baseColor: 0x5f7892, accentColor: 0xa8ecff },
  { id: 'mana_cluster', name: '마력 수정', style: 'crystal', itemId: 'mana_crystal', hp: 5, bonus: 2, radius: 0.65, baseColor: 0x4a3a6a, accentColor: 0xc28cff },
  { id: 'gear_pile', name: '톱니 잔해', style: 'scrap', itemId: 'gear_part', hp: 4, bonus: 2, radius: 0.7, baseColor: 0x5d5448, accentColor: 0xd4ac4c },
  { id: 'alloy_pile', name: '합금 잔해', style: 'scrap', itemId: 'magi_alloy', hp: 5, bonus: 2, radius: 0.7, baseColor: 0x4a5058, accentColor: 0x78aee0 },
  { id: 'fire_cluster', name: '화염 핵', style: 'crystal', itemId: 'fire_core', hp: 5, bonus: 2, radius: 0.65, baseColor: 0x3a2622, accentColor: 0xff7a30 },
  { id: 'dimension_cluster', name: '차원 결정', style: 'crystal', itemId: 'dimension_crystal', hp: 6, bonus: 2, radius: 0.65, baseColor: 0x2a2a48, accentColor: 0x6ff4ff },
  // 보물 상자: 부수면 그 단계의 자원이 여러 개 나온다 (itemId는 비워 두고 테마 자원에서 고른다)
  { id: 'chest', name: '보물 상자', style: 'chest', itemId: '', hp: 1, bonus: 5, radius: 0.6, baseColor: 0x7a4a24, accentColor: 0xe8c14a },
];

/**
 * 스테이지의 광석·나무 단계를 고른다.
 * 1단계는 1단계 자원만, 그 뒤로는 앞 단계와 이번 단계가 섞이고 방이 깊을수록 이번 단계가 많아진다 (2-1은 구리 위주, 2-10은 철 위주)
 */
export function resourceTier(tier: number, stage: number, roll: number): number {
  if (tier <= 1) return 1;
  const high = 0.1 + 0.8 * ((stage - 1) / 9);
  return roll < high ? tier : tier - 1;
}

/** 방에 놓을 채집물 하나 고르기 */
export function pickResourceNode(tier: number, stage: number, special: string[], rand: () => number): string {
  const r = rand();
  if (special.length && r < 0.2) return special[Math.floor(rand() * special.length)];
  const t = resourceTier(tier, stage, rand());
  return r < 0.6 ? `ore_${t}` : `tree_${t}`;
}

export const NODES: Record<string, NodeDef> = Object.fromEntries(defs.map((d) => [d.id, d]));
