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
  // 던전 원자재
  { id: 'iron_ore', name: '철광석', color: 0x8a8f99, kind: 'material', value: 4, description: '제련로에 넣으면 철 주괴가 된다.' },
  { id: 'wood', name: '목재', color: 0x9a6a3c, kind: 'material', value: 3, description: '분쇄기에서 판자가 된다. 물약 재료로도 쓴다.' },
  { id: 'copper_ore', name: '구리광석', color: 0xd07a45, kind: 'material', value: 7, description: '제련로에 넣으면 구리 주괴가 된다.' },
  { id: 'silver_ore', name: '은광석', color: 0xcfd8e3, kind: 'material', value: 10, description: '제련로에 넣으면 은 주괴가 된다.' },
  { id: 'frost_crystal', name: '서리 결정', color: 0x9fe3ff, kind: 'material', value: 11, description: '분쇄기에서 서리 가루가 된다.' },
  { id: 'mana_crystal', name: '마력 수정', color: 0xb67cff, kind: 'material', value: 15, description: '분쇄기에서 마력 가루가 된다.' },
  { id: 'mithril', name: '미스릴', color: 0x7fe0d0, kind: 'material', value: 16, description: '제련로에 넣으면 미스릴 주괴가 된다.' },
  { id: 'gear_part', name: '톱니 부품', color: 0xc9a44a, kind: 'material', value: 20, description: '폐공장에서 건진 마공학 부품.' },
  { id: 'magi_alloy', name: '마공 합금', color: 0x6fa0c8, kind: 'material', value: 22, description: '마력을 전도하는 합금.' },
  { id: 'obsidian', name: '흑요석', color: 0x3a3048, kind: 'material', value: 26, description: '제련로에서 흑요석 판이 된다.' },
  { id: 'fire_core', name: '화염 핵', color: 0xff6a2a, kind: 'material', value: 28, description: '분쇄기에서 화염 가루가 된다.' },
  { id: 'dimension_crystal', name: '차원 결정', color: 0x5ef0ff, kind: 'material', value: 34, description: '분쇄기에서 차원 가루가 된다.' },
  { id: 'void_stone', name: '공허석', color: 0x6b4dff, kind: 'material', value: 34, description: '분쇄기에서 차원 가루가 된다.' },
  // 마력 정수 (공장 에너지원)
  { id: 'essence_low', name: '하급 마력 정수', color: 0x7fd6ff, kind: 'essence', value: 5, description: '1~3단계 몬스터에게서 나온다. 발전기에 넣으면 2분 동안 탄다.' },
  { id: 'essence_mid', name: '중급 마력 정수', color: 0x6f8cff, kind: 'essence', value: 14, description: '4~5단계 몬스터에게서 나온다. 발전기에서 5분 동안 탄다.' },
  { id: 'essence_high', name: '상급 마력 정수', color: 0xd76fff, kind: 'essence', value: 30, description: '6~7단계 몬스터에게서 나온다. 발전기에서 10분 동안 탄다.' },
  // 가공품
  { id: 'iron_ingot', name: '철 주괴', color: 0xb5bcc8, kind: 'processed', value: 10, description: '마력 주입기에서 마력 철이 된다.' },
  { id: 'copper_ingot', name: '구리 주괴', color: 0xe89a60, kind: 'processed', value: 16, description: '귀환석의 재료.' },
  { id: 'silver_ingot', name: '은 주괴', color: 0xe6eef7, kind: 'processed', value: 24, description: '마력 주입기에서 마력 은이 된다.' },
  { id: 'mithril_ingot', name: '미스릴 주괴', color: 0x9ff5e6, kind: 'processed', value: 38, description: '마력 주입기에서 마력 미스릴이 된다.' },
  { id: 'obsidian_plate', name: '흑요석 판', color: 0x55466e, kind: 'processed', value: 60, description: '공명 장치의 재료.' },
  { id: 'plank', name: '판자', color: 0xc99a62, kind: 'processed', value: 7, description: '하급 강화석과 귀환석의 재료.' },
  { id: 'frost_dust', name: '서리 가루', color: 0xc9f2ff, kind: 'processed', value: 26, description: '중급 강화석의 재료.' },
  { id: 'mana_dust', name: '마력 가루', color: 0xd4a8ff, kind: 'processed', value: 34, description: '차원가방 확장 키트의 재료.' },
  { id: 'fire_dust', name: '화염 가루', color: 0xff9a5a, kind: 'processed', value: 62, description: '상급 강화석의 재료.' },
  { id: 'dim_dust', name: '차원 가루', color: 0x8ff6ff, kind: 'processed', value: 75, description: '공명 장치의 재료.' },
  { id: 'mana_iron', name: '마력 철', color: 0x8fb4ff, kind: 'processed', value: 22, description: '하급 강화석의 재료.' },
  { id: 'mana_silver', name: '마력 은', color: 0xb8d4ff, kind: 'processed', value: 50, description: '중급 강화석의 재료.' },
  { id: 'mana_mithril', name: '마력 미스릴', color: 0x7ff0ff, kind: 'processed', value: 80, description: '상급 강화석과 공명 장치의 재료.' },
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
