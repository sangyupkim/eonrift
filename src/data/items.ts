export type ItemKind = 'material' | 'essence' | 'processed' | 'consumable' | 'key';

export interface ItemDef {
  id: string;
  name: string;
  /** 아이콘 색 */
  color: number;
  kind: ItemKind;
  /** 상점 판매가 */
  value: number;
  description: string;
}

const defs: ItemDef[] = [
  // 던전 원자재: 광석 7단계 (무른 것 → 단단한 것)
  { id: 'copper_ore', name: '구리광석', color: 0xd07a45, kind: 'material', value: 3, description: '1~2단계 광석. 제련로에서 구리 주괴가 된다. 강화 +0~1 장비와 도구 수리에 쓴다.' },
  { id: 'iron_ore', name: '철광석', color: 0x8a8f99, kind: 'material', value: 5, description: '2~3단계 광석. 제련로에서 철 주괴가 된다. 강화 +2~3 장비 수리에 쓴다.' },
  { id: 'gold_ore', name: '금광석', color: 0xf0c040, kind: 'material', value: 9, description: '3~4단계 광석. 제련로에서 금 주괴가 된다. 강화 +4~5 장비 수리에 쓴다.' },
  { id: 'diamond_ore', name: '다이아 원석', color: 0xbff4ff, kind: 'material', value: 15, description: '4~5단계 광석. 분쇄기에서 연마 다이아가 된다. 강화 +6~7 장비 수리에 쓴다.' },
  { id: 'titanium_ore', name: '티타늄광석', color: 0x9aa8b8, kind: 'material', value: 22, description: '5~6단계 광석. 제련로에서 티타늄 주괴가 된다. 강화 +8 장비 수리에 쓴다.' },
  { id: 'orichalcum_ore', name: '오리하르콘광석', color: 0xff8a4a, kind: 'material', value: 32, description: '6~7단계 광석. 제련로에서 오리하르콘 주괴가 된다. 강화 +9 장비 수리에 쓴다.' },
  { id: 'dim_ore', name: '차원광물', color: 0x6b5cff, kind: 'material', value: 45, description: '7단계 광석. 제련로에서 차원 주괴가 된다. 강화 +10 장비 수리에 쓴다.' },
  // 나무 7단계
  { id: 'wood', name: '참나무 목재', color: 0x9a6a3c, kind: 'material', value: 2, description: '1~2단계 나무. 분쇄기에서 판자 2개가 된다.' },
  { id: 'redpine_wood', name: '적송 목재', color: 0xb0502e, kind: 'material', value: 4, description: '2~3단계 나무. 분쇄기에서 판자 3개가 된다.' },
  { id: 'frost_wood', name: '서리나무 목재', color: 0xa8d8f0, kind: 'material', value: 7, description: '3~4단계 나무. 분쇄기에서 판자 3개가 된다.' },
  { id: 'crystal_wood', name: '수정나무 목재', color: 0xc28cff, kind: 'material', value: 11, description: '4~5단계 나무. 분쇄기에서 판자 4개가 된다.' },
  { id: 'iron_wood', name: '철목 목재', color: 0x5a5a60, kind: 'material', value: 16, description: '5~6단계 나무. 분쇄기에서 판자 4개가 된다.' },
  { id: 'flame_wood', name: '불꽃나무 목재', color: 0xff6a2a, kind: 'material', value: 23, description: '6~7단계 나무. 분쇄기에서 판자 5개가 된다.' },
  { id: 'dim_wood', name: '차원나무 목재', color: 0x5ef0ff, kind: 'material', value: 32, description: '7단계 나무. 분쇄기에서 판자 6개가 된다.' },
  // 테마 특산물
  { id: 'frost_crystal', name: '서리 결정', color: 0x9fe3ff, kind: 'material', value: 11, description: '분쇄기에서 서리 가루가 된다.' },
  { id: 'mana_crystal', name: '마력 수정', color: 0xb67cff, kind: 'material', value: 15, description: '분쇄기에서 마력 가루가 된다.' },
  { id: 'gear_part', name: '톱니 부품', color: 0xc9a44a, kind: 'material', value: 20, description: '폐공장에서 건진 마공학 부품.' },
  { id: 'magi_alloy', name: '마공 합금', color: 0x6fa0c8, kind: 'material', value: 22, description: '마력을 전도하는 합금.' },
  { id: 'fire_core', name: '화염 핵', color: 0xff6a2a, kind: 'material', value: 28, description: '분쇄기에서 화염 가루가 된다.' },
  { id: 'dimension_crystal', name: '차원 결정', color: 0x5ef0ff, kind: 'material', value: 34, description: '분쇄기에서 차원 가루가 된다.' },
  // 마력 정수 (공장 에너지원)
  { id: 'essence_low', name: '하급 마력 정수', color: 0x7fd6ff, kind: 'essence', value: 5, description: '1~3단계 몬스터에게서 나온다. 발전기에 넣으면 2분 동안 탄다.' },
  { id: 'essence_mid', name: '중급 마력 정수', color: 0x6f8cff, kind: 'essence', value: 14, description: '4~5단계 몬스터에게서 나온다. 발전기에서 5분 동안 탄다.' },
  { id: 'essence_high', name: '상급 마력 정수', color: 0xd76fff, kind: 'essence', value: 30, description: '6~7단계 몬스터에게서 나온다. 발전기에서 10분 동안 탄다.' },
  // 가공품
  { id: 'copper_ingot', name: '구리 주괴', color: 0xe89a60, kind: 'processed', value: 8, description: '귀환석의 재료.' },
  { id: 'iron_ingot', name: '철 주괴', color: 0xb5bcc8, kind: 'processed', value: 12, description: '마력 주입기에서 마력 철이 된다.' },
  { id: 'gold_ingot', name: '금 주괴', color: 0xffd35a, kind: 'processed', value: 22, description: '마력 주입기에서 마력 금이 된다.' },
  { id: 'diamond', name: '연마 다이아', color: 0xdffaff, kind: 'processed', value: 36, description: '중급 강화석의 재료.' },
  { id: 'titanium_ingot', name: '티타늄 주괴', color: 0xc4ceda, kind: 'processed', value: 50, description: '마력 주입기에서 마력 티타늄이 된다.' },
  { id: 'orichalcum_ingot', name: '오리하르콘 주괴', color: 0xffa060, kind: 'processed', value: 70, description: '상급 강화석과 공명 장치의 재료.' },
  { id: 'dim_ingot', name: '차원 주괴', color: 0x8a7cff, kind: 'processed', value: 95, description: '공명 장치의 재료.' },
  { id: 'plank', name: '판자', color: 0xc99a62, kind: 'processed', value: 2, description: '하급 강화석과 귀환석의 재료.' },
  { id: 'frost_dust', name: '서리 가루', color: 0xc9f2ff, kind: 'processed', value: 26, description: '중급 강화석의 재료.' },
  { id: 'mana_dust', name: '마력 가루', color: 0xd4a8ff, kind: 'processed', value: 34, description: '차원가방 확장 키트의 재료.' },
  { id: 'fire_dust', name: '화염 가루', color: 0xff9a5a, kind: 'processed', value: 62, description: '상급 강화석의 재료.' },
  { id: 'dim_dust', name: '차원 가루', color: 0x8ff6ff, kind: 'processed', value: 75, description: '공명 장치의 재료.' },
  { id: 'mana_iron', name: '마력 철', color: 0x8fb4ff, kind: 'processed', value: 22, description: '하급 강화석의 재료.' },
  { id: 'mana_gold', name: '마력 금', color: 0xffe08a, kind: 'processed', value: 45, description: '중급 강화석의 재료.' },
  { id: 'mana_titanium', name: '마력 티타늄', color: 0x7ff0ff, kind: 'processed', value: 85, description: '상급 강화석과 공명 장치의 재료.' },
  // 완성품
  { id: 'stone_low', name: '하급 강화석', color: 0x9fc4ff, kind: 'consumable', value: 40, description: '장비를 +1~+3으로 강화할 때 쓴다.' },
  { id: 'stone_mid', name: '중급 강화석', color: 0x6fe0ff, kind: 'consumable', value: 90, description: '장비를 +4~+6으로 강화할 때 쓴다.' },
  { id: 'stone_high', name: '상급 강화석', color: 0xffc46f, kind: 'consumable', value: 180, description: '장비를 +7~+10으로 강화할 때 쓴다.' },
  { id: 'potion', name: '치유 물약', color: 0xff5a7a, kind: 'consumable', value: 15, description: '던전에서 HP 50%와 MP 50%를 회복한다.' },
  { id: 'return_stone', name: '귀환석', color: 0x7affc0, kind: 'consumable', value: 30, description: '던전에서 언제든 전리품을 가지고 마을로 돌아간다.' },
  { id: 'bag_kit', name: '차원가방 확장 키트', color: 0xb07aff, kind: 'consumable', value: 120, description: '차원가방을 한 칸 늘린다 (최대 12칸).' },
  { id: 'resonator', name: '차원석 공명 장치', color: 0x5ef0ff, kind: 'key', value: 0, description: '일곱 차원석의 힘을 하나로 모으는 장치.' },
];

export const ITEMS: Record<string, ItemDef> = Object.fromEntries(defs.map((d) => [d.id, d]));
export const ITEM_LIST = defs;

/** 광석·나무 단계 (1~7) */
export const ORE_TIERS = ['copper_ore', 'iron_ore', 'gold_ore', 'diamond_ore', 'titanium_ore', 'orichalcum_ore', 'dim_ore'];
export const WOOD_TIERS = ['wood', 'redpine_wood', 'frost_wood', 'crystal_wood', 'iron_wood', 'flame_wood', 'dim_wood'];

/** 예전 저장의 아이템 id → 새 id */
export const ITEM_RENAMES: Record<string, string> = {
  silver_ore: 'gold_ore',
  mithril: 'titanium_ore',
  obsidian: 'orichalcum_ore',
  void_stone: 'dim_ore',
  silver_ingot: 'gold_ingot',
  mithril_ingot: 'titanium_ingot',
  obsidian_plate: 'orichalcum_ingot',
  mana_silver: 'mana_gold',
  mana_mithril: 'mana_titanium',
};
