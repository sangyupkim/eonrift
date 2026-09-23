/** 차원집 공장의 건물과 레시피 */
export type BuildingType = 'generator' | 'wire' | 'belt' | 'splitter' | 'box' | 'smelter' | 'crusher' | 'infuser' | 'assembler' | 'alchemy' | 'workbench';

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
  generator: { type: 'generator', name: '마력 발전기', power: 30, color: 0x5ac8ff, cost: { copper_ore: 4, wood: 2 }, description: '안에 넣은 마력 정수를 태워 전력 30을 만든다. 마력선으로 기계와 이어야 한다.', blueprint: null },
  wire: { type: 'wire', name: '마력선', power: 0, color: 0xe08a50, cost: {}, description: '발전기의 전력을 기계로 보낸다. 기계는 마력선에 닿아 있어야 움직인다.', blueprint: null },
  belt: { type: 'belt', name: '레일', power: 0, color: 0x50555f, cost: {}, description: '아이템을 화살표 방향으로 옮긴다.', blueprint: null },
  box: { type: 'box', name: '보관상자', power: 0, color: 0x9a6a3c, cost: { wood: 3 }, description: '투입: 넣어 둔 재료를 앞의 기계가 비면 보낸다. 출하: 들어온 완성품을 모아 둔다.', blueprint: null },
  smelter: { type: 'smelter', name: '제련로', power: 6, color: 0xc0583a, cost: { copper_ore: 5 }, description: '광석을 주괴로 만든다 (다이아 원석 → 다이아 주괴 포함).', blueprint: null },
  crusher: { type: 'crusher', name: '벌목소', power: 5, color: 0x9a6a3c, cost: { copper_ore: 4, wood: 2 }, description: '나무를 켜서 판자로 만든다. 좋은 나무일수록 판자가 많이 나온다.', blueprint: { gold: 300, items: { copper_ingot: 3 } } },
  infuser: { type: 'infuser', name: '마력 주입기', power: 12, color: 0x8a6aff, cost: { iron_ore: 4, copper_ore: 4 }, description: '주괴에 마력을 불어넣는다.', blueprint: { gold: 800, items: { iron_ingot: 3 } } },
  assembler: { type: 'assembler', name: '조립기', power: 10, color: 0x4a9a8a, cost: { iron_ore: 6, wood: 4 }, description: '고른 설계대로 여러 재료를 조립한다.', blueprint: { gold: 1200, items: { copper_ingot: 5, plank: 5 } } },
  alchemy: { type: 'alchemy', name: '연금 솥', power: 4, color: 0x5a9a4a, cost: { copper_ore: 3, wood: 3 }, description: '치유 물약에 더 높은 마력 정수를 넣어 상위 물약을 만든다.', blueprint: { gold: 500, items: { wood: 10 } } },
  workbench: { type: 'workbench', name: '제작대', power: 8, color: 0xb07a3a, cost: { copper_ore: 10, wood: 10 }, description: '장비와 채집 도구를 만든다. 마력선으로 발전기와 이으면 에너지가 충전되고, 제작과 레벨업에 에너지를 쓴다.', blueprint: null },
  splitter: { type: 'splitter', name: '분배기', power: 0, color: 0x6a7080, cost: { copper_ore: 1 }, description: '들어온 아이템을 앞·왼쪽·오른쪽으로 번갈아 보낸다.', blueprint: { gold: 400, items: {} } },
};

export const BUILD_ORDER: BuildingType[] = ['generator', 'wire', 'belt', 'box', 'workbench', 'smelter', 'crusher', 'infuser', 'assembler', 'alchemy', 'splitter'];

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
  { id: 'copper_ingot', machine: 'smelter', inputs: { copper_ore: 1 }, output: 'copper_ingot', count: 1, time: 15 },
  { id: 'iron_ingot', machine: 'smelter', inputs: { iron_ore: 1 }, output: 'iron_ingot', count: 1, time: 20 },
  { id: 'gold_ingot', machine: 'smelter', inputs: { gold_ore: 1 }, output: 'gold_ingot', count: 1, time: 30 },
  { id: 'diamond', machine: 'smelter', inputs: { diamond_ore: 1 }, output: 'diamond', count: 1, time: 35 },
  { id: 'titanium_ingot', machine: 'smelter', inputs: { titanium_ore: 1 }, output: 'titanium_ingot', count: 1, time: 40 },
  { id: 'orichalcum_ingot', machine: 'smelter', inputs: { orichalcum_ore: 1 }, output: 'orichalcum_ingot', count: 1, time: 50 },
  { id: 'dim_ingot', machine: 'smelter', inputs: { dim_ore: 1 }, output: 'dim_ingot', count: 1, time: 60 },
  { id: 'plank', machine: 'crusher', inputs: { wood: 1 }, output: 'plank', count: 2, time: 15 },
  { id: 'plank_redpine', machine: 'crusher', inputs: { redpine_wood: 1 }, output: 'plank', count: 3, time: 15 },
  { id: 'plank_frost', machine: 'crusher', inputs: { frost_wood: 1 }, output: 'plank', count: 3, time: 15 },
  { id: 'plank_crystal', machine: 'crusher', inputs: { crystal_wood: 1 }, output: 'plank', count: 4, time: 15 },
  { id: 'plank_iron', machine: 'crusher', inputs: { iron_wood: 1 }, output: 'plank', count: 4, time: 15 },
  { id: 'plank_flame', machine: 'crusher', inputs: { flame_wood: 1 }, output: 'plank', count: 5, time: 15 },
  { id: 'plank_dim', machine: 'crusher', inputs: { dim_wood: 1 }, output: 'plank', count: 6, time: 15 },
  { id: 'mana_iron', machine: 'infuser', inputs: { iron_ingot: 1 }, output: 'mana_iron', count: 1, time: 30 },
  { id: 'mana_gold', machine: 'infuser', inputs: { gold_ingot: 1 }, output: 'mana_gold', count: 1, time: 40 },
  { id: 'mana_titanium', machine: 'infuser', inputs: { titanium_ingot: 1 }, output: 'mana_titanium', count: 1, time: 50 },
  { id: 'return_stone', machine: 'assembler', inputs: { copper_ingot: 1, plank: 2 }, output: 'return_stone', count: 1, time: 45 },
  { id: 'bag_kit', machine: 'assembler', inputs: { magi_alloy: 1, gear_part: 2, mana_iron: 1 }, output: 'bag_kit', count: 1, time: 120 },
  { id: 'resonator', machine: 'assembler', inputs: { dim_ingot: 3, orichalcum_ingot: 2, mana_titanium: 2 }, output: 'resonator', count: 1, time: 300 },
  { id: 'potion_mid', machine: 'alchemy', inputs: { potion: 1, essence_mid: 1 }, output: 'potion_mid', count: 1, time: 40 },
  { id: 'potion_high', machine: 'alchemy', inputs: { potion_mid: 1, essence_high: 1 }, output: 'potion_high', count: 1, time: 60 },
];

/** 예전 저장의 레시피 id → 새 id */
export const RECIPE_RENAMES: Record<string, string> = { silver_ingot: 'gold_ingot', mithril_ingot: 'titanium_ingot', obsidian_plate: 'orichalcum_ingot', dim_dust_void: 'dim_dust', mana_silver: 'mana_gold', mana_mithril: 'mana_titanium' };

/** 마력 정수 하나가 발전기에서 타는 시간(초) */
export const ESSENCE_BURN: Record<string, number> = { essence_low: 120, essence_mid: 300, essence_high: 600 };

/** 공장 크기 단계와 확장 비용 */
export const FACTORY_SIZES = [
  { size: 8, cost: null as null | { gold: number; items: Record<string, number> } },
  { size: 12, cost: { gold: 500, items: { copper_ingot: 10, plank: 10 } } },
  { size: 16, cost: { gold: 2000, items: { gold_ingot: 10, mana_iron: 10 } } },
  { size: 24, cost: { gold: 6000, items: { magi_alloy: 10, mana_gold: 10 } } },
];

export const OFFLINE_CAP_HOURS = 8;
