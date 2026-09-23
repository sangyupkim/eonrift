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

const defs: NodeDef[] = [
  { id: 'iron_vein', name: '철광석 광맥', style: 'ore', itemId: 'iron_ore', hp: 4, bonus: 2, radius: 0.75, baseColor: 0x6d6a66, accentColor: 0xa9b0bc },
  { id: 'old_tree', name: '고목', style: 'tree', itemId: 'wood', hp: 3, bonus: 2, radius: 0.55, baseColor: 0x6b4a2e, accentColor: 0x4f8a3c },
  { id: 'copper_vein', name: '구리광석 광맥', style: 'ore', itemId: 'copper_ore', hp: 4, bonus: 2, radius: 0.75, baseColor: 0x7a4a36, accentColor: 0xe08a50 },
  { id: 'dry_tree', name: '마른 고목', style: 'tree', itemId: 'wood', hp: 3, bonus: 2, radius: 0.55, baseColor: 0x5a3b26, accentColor: 0xc98a3a },
  { id: 'silver_vein', name: '은광석 광맥', style: 'ore', itemId: 'silver_ore', hp: 5, bonus: 2, radius: 0.75, baseColor: 0x5d6b7a, accentColor: 0xe4ecf5 },
  { id: 'frost_cluster', name: '서리 결정', style: 'crystal', itemId: 'frost_crystal', hp: 4, bonus: 2, radius: 0.65, baseColor: 0x5f7892, accentColor: 0xa8ecff },
  { id: 'mana_cluster', name: '마력 수정', style: 'crystal', itemId: 'mana_crystal', hp: 5, bonus: 2, radius: 0.65, baseColor: 0x4a3a6a, accentColor: 0xc28cff },
  { id: 'mithril_vein', name: '미스릴 광맥', style: 'ore', itemId: 'mithril', hp: 6, bonus: 2, radius: 0.75, baseColor: 0x4d5a66, accentColor: 0x8ff0dc },
  { id: 'gear_pile', name: '톱니 잔해', style: 'scrap', itemId: 'gear_part', hp: 4, bonus: 2, radius: 0.7, baseColor: 0x5d5448, accentColor: 0xd4ac4c },
  { id: 'alloy_pile', name: '합금 잔해', style: 'scrap', itemId: 'magi_alloy', hp: 5, bonus: 2, radius: 0.7, baseColor: 0x4a5058, accentColor: 0x78aee0 },
  { id: 'obsidian_rock', name: '흑요석 바위', style: 'ore', itemId: 'obsidian', hp: 6, bonus: 2, radius: 0.75, baseColor: 0x2c2530, accentColor: 0x5a4a78 },
  { id: 'fire_cluster', name: '화염 핵', style: 'crystal', itemId: 'fire_core', hp: 5, bonus: 2, radius: 0.65, baseColor: 0x3a2622, accentColor: 0xff7a30 },
  { id: 'dimension_cluster', name: '차원 결정', style: 'crystal', itemId: 'dimension_crystal', hp: 6, bonus: 2, radius: 0.65, baseColor: 0x2a2a48, accentColor: 0x6ff4ff },
  { id: 'void_vein', name: '공허석 광맥', style: 'ore', itemId: 'void_stone', hp: 7, bonus: 2, radius: 0.75, baseColor: 0x1e1a2e, accentColor: 0x7a5cff },
  // 보물 상자: 부수면 그 단계의 자원이 여러 개 나온다 (itemId는 비워 두고 테마 자원에서 고른다)
  { id: 'chest', name: '보물 상자', style: 'chest', itemId: '', hp: 1, bonus: 5, radius: 0.6, baseColor: 0x7a4a24, accentColor: 0xe8c14a },
];

export const NODES: Record<string, NodeDef> = Object.fromEntries(defs.map((d) => [d.id, d]));
