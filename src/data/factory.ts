/** 차원집 공장의 건물과 레시피 */
export type BuildingType = 'generator' | 'wire' | 'belt' | 'splitter' | 'box' | 'smelter' | 'crusher' | 'infuser' | 'assembler' | 'alchemy';

export interface BuildingDef {
  type: BuildingType;
  name: string;
  /** 소비 전력 (발전기는 생산 전력) */
  power: number;
  color: number;
  /** 건설 비용 (공유 창고에서 빠진다) */
  cost: Record<string, number>;
  description: string;
  /** 도면: 없으면 처음부터 지을 수 있다. 있으면 세라에게 사야 한다 */
  blueprint: { gold: number; items: Record<string, number> } | null;
}

export const BUILDINGS: Record<BuildingType, BuildingDef> = {
  generator: { type: 'generator', name: '마력 발전기', power: 30, color: 0x5ac8ff, cost: { iron_ore: 4, wood: 2 }, description: '안에 넣은 마력 정수를 태워 전력 30을 만든다. 마력선으로 기계와 이어야 한다.', blueprint: null },
  wire: { type: 'wire', name: '마력선', power: 0, color: 0xe08a50, cost: {}, description: '발전기의 전력을 기계로 보낸다. 기계는 마력선에 닿아 있어야 움직인다.', blueprint: null },
  belt: { type: 'belt', name: '레일', power: 0, color: 0x50555f, cost: {}, description: '아이템을 화살표 방향으로 옮긴다.', blueprint: null },
  box: { type: 'box', name: '보관상자', power: 0, color: 0x9a6a3c, cost: { wood: 3 }, description: '투입: 넣어 둔 재료를 앞의 기계가 비면 보낸다. 출하: 들어온 완성품을 모아 둔다.', blueprint: null },
  smelter: { type: 'smelter', name: '제련로', power: 6, color: 0xc0583a, cost: { iron_ore: 5 }, description: '광석을 주괴로 만든다.', blueprint: null },
  crusher: { type: 'crusher', name: '분쇄기', power: 5, color: 0x8a8f99, cost: { iron_ore: 4, wood: 2 }, description: '결정과 목재를 가루·판자로 만든다.', blueprint: { gold: 300, items: { iron_ingot: 3 } } },
  infuser: { type: 'infuser', name: '마력 주입기', power: 12, color: 0x8a6aff, cost: { iron_ore: 4, copper_ore: 2 }, description: '주괴에 마력을 불어넣는다.', blueprint: { gold: 800, items: { copper_ingot: 3 } } },
  assembler: { type: 'assembler', name: '조립기', power: 10, color: 0x4a9a8a, cost: { iron_ore: 6, wood: 4 }, description: '고른 설계대로 여러 재료를 조립한다.', blueprint: { gold: 1200, items: { iron_ingot: 5, plank: 5 } } },
  alchemy: { type: 'alchemy', name: '연금 솥', power: 4, color: 0x5a9a4a, cost: { iron_ore: 3, wood: 3 }, description: '하급 마력 정수와 목재로 치유 물약을 만든다.', blueprint: { gold: 500, items: { wood: 10 } } },
  splitter: { type: 'splitter', name: '분배기', power: 0, color: 0x6a7080, cost: { iron_ore: 1 }, description: '들어온 아이템을 앞·왼쪽·오른쪽으로 번갈아 보낸다.', blueprint: { gold: 400, items: {} } },
};

export const BUILD_ORDER: BuildingType[] = ['generator', 'wire', 'belt', 'box', 'smelter', 'crusher', 'infuser', 'assembler', 'alchemy', 'splitter'];

export interface Recipe {
  id: string;
  machine: BuildingType;
  inputs: Record<string, number>;
  output: string;
  count: number;
  /** 초. 방치형 느낌으로 길게 잡았다 */
  time: number;
}

export const RECIPES: Recipe[] = [
  { id: 'iron_ingot', machine: 'smelter', inputs: { iron_ore: 1 }, output: 'iron_ingot', count: 1, time: 20 },
  { id: 'copper_ingot', machine: 'smelter', inputs: { copper_ore: 1 }, output: 'copper_ingot', count: 1, time: 25 },
  { id: 'silver_ingot', machine: 'smelter', inputs: { silver_ore: 1 }, output: 'silver_ingot', count: 1, time: 30 },
  { id: 'mithril_ingot', machine: 'smelter', inputs: { mithril: 1 }, output: 'mithril_ingot', count: 1, time: 40 },
  { id: 'obsidian_plate', machine: 'smelter', inputs: { obsidian: 2 }, output: 'obsidian_plate', count: 1, time: 60 },
  { id: 'plank', machine: 'crusher', inputs: { wood: 1 }, output: 'plank', count: 2, time: 15 },
  { id: 'frost_dust', machine: 'crusher', inputs: { frost_crystal: 1 }, output: 'frost_dust', count: 1, time: 25 },
  { id: 'mana_dust', machine: 'crusher', inputs: { mana_crystal: 1 }, output: 'mana_dust', count: 1, time: 25 },
  { id: 'fire_dust', machine: 'crusher', inputs: { fire_core: 1 }, output: 'fire_dust', count: 1, time: 30 },
  { id: 'dim_dust', machine: 'crusher', inputs: { dimension_crystal: 1 }, output: 'dim_dust', count: 1, time: 40 },
  { id: 'dim_dust_void', machine: 'crusher', inputs: { void_stone: 1 }, output: 'dim_dust', count: 1, time: 40 },
  { id: 'mana_iron', machine: 'infuser', inputs: { iron_ingot: 1 }, output: 'mana_iron', count: 1, time: 30 },
  { id: 'mana_silver', machine: 'infuser', inputs: { silver_ingot: 1 }, output: 'mana_silver', count: 1, time: 40 },
  { id: 'mana_mithril', machine: 'infuser', inputs: { mithril_ingot: 1 }, output: 'mana_mithril', count: 1, time: 50 },
  { id: 'stone_low', machine: 'assembler', inputs: { mana_iron: 1, plank: 1 }, output: 'stone_low', count: 1, time: 45 },
  { id: 'stone_mid', machine: 'assembler', inputs: { mana_silver: 1, frost_dust: 1 }, output: 'stone_mid', count: 1, time: 60 },
  { id: 'stone_high', machine: 'assembler', inputs: { mana_mithril: 1, magi_alloy: 1, fire_dust: 1 }, output: 'stone_high', count: 1, time: 90 },
  { id: 'return_stone', machine: 'assembler', inputs: { copper_ingot: 1, plank: 1 }, output: 'return_stone', count: 1, time: 45 },
  { id: 'bag_kit', machine: 'assembler', inputs: { magi_alloy: 1, mana_dust: 1, gear_part: 2 }, output: 'bag_kit', count: 1, time: 120 },
  { id: 'resonator', machine: 'assembler', inputs: { dim_dust: 3, obsidian_plate: 1, mana_mithril: 2 }, output: 'resonator', count: 1, time: 300 },
  { id: 'potion', machine: 'alchemy', inputs: { essence_low: 1, wood: 1 }, output: 'potion', count: 1, time: 30 },
];

/** 마력 정수 하나가 발전기에서 타는 시간(초) */
export const ESSENCE_BURN: Record<string, number> = { essence_low: 120, essence_mid: 300, essence_high: 600 };

/** 공장 크기 단계와 확장 비용 */
export const FACTORY_SIZES = [
  { size: 8, cost: null as null | { gold: number; items: Record<string, number> } },
  { size: 12, cost: { gold: 500, items: { iron_ingot: 10, plank: 10 } } },
  { size: 16, cost: { gold: 2000, items: { silver_ingot: 10, mana_iron: 10 } } },
  { size: 24, cost: { gold: 6000, items: { magi_alloy: 10, mana_silver: 10 } } },
];

export const OFFLINE_CAP_HOURS = 8;
