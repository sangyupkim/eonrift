import { essenceForTier } from './items';
/** 차원집 공장의 건물과 레시피 */
export type BuildingType = 'generator' | 'wire' | 'belt' | 'splitter' | 'box' | 'smelter' | 'crusher' | 'infuser' | 'alchemy' | 'condenser' | 'workbench' | 'healer' | 'warehouse';

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
  infuser: { type: 'infuser', name: '마력 주입기', power: 12, color: 0x8a6aff, cost: { iron_ore: 4, copper_ore: 4 }, description: '주괴·판자에 마력을 불어넣어 마력 금속·마력 판자를 만든다.', blueprint: { gold: 800, items: { copper_ingot: 3, plank: 3 } } },
  alchemy: { type: 'alchemy', name: '연금 솥', power: 4, color: 0x5a9a4a, cost: { copper_ore: 3, wood: 3 }, description: '치유 물약에 더 높은 마력 정수를 넣어 상위 물약을 만들고, 여러 판자로 음식(30분 버프)을 끓인다.', blueprint: { gold: 500, items: { wood: 10 } } },
  condenser: { type: 'condenser', name: '차원 응축기', power: 20, color: 0x5ef0ff, cost: { iron_ore: 10, gold_ore: 6 }, description: '보스와 차원의 끝에서 모은 차원 가루를 압축한다. 가루 8 + 상급 정수 + 티타늄판 → 차원 파편(궁극기 강화·각인·초월), 가루 4 + 최상급 정수 + 오리하르콘 주괴 → 차원 마력 정수(최고 연료). 전력을 많이 쓰고 느리다.', blueprint: { gold: 3000, items: { gold_ingot: 6, mana_iron: 4 } } },
  workbench: { type: 'workbench', name: '제작대', power: 8, color: 0xb07a3a, cost: { copper_ore: 10, wood: 10 }, description: '판·장비·채집 도구·귀환석 등을 만든다. 제작을 시작하면 전력을 쓰며 시간이 지나면 완성된다. 완성품은 앞쪽 레일로 내보낸다 (막히면 제작대에 쌓임).', blueprint: null },
  healer: { type: 'healer', name: '마력 치유석 (회복)', power: 10, color: 0x6aff9a, cost: { copper_ore: 6, wood: 4 }, description: '마력선으로 발전기와 이으면, 곁에 서 있는 동안 HP·MP를 초당 12%씩 회복한다. 회복할 때만 전력을 쓴다 (물약보다 훨씬 싸다).', blueprint: null },
  warehouse: { type: 'warehouse', name: '일반 창고', power: 0, color: 0x8a6a4a, cost: { wood: 8, copper_ore: 4 }, description: '차원집 전용 창고 (레벨당 20칸, 한 칸 99개). 차원집 안의 일반 창고는 모두 하나로 이어져 어느 것을 열어도 같고, 안의 재료는 차원집에서 제작·건설에 바로 쓰인다. 레일로 들어온 아이템도 받아 보관한다.', blueprint: { gold: 500, items: { copper_ingot: 4, plank: 6 } } },
  splitter: { type: 'splitter', name: '분배기', power: 0, color: 0x6a7080, cost: { copper_ore: 1 }, description: '들어온 아이템을 앞·왼쪽·오른쪽으로 번갈아 보낸다.', blueprint: { gold: 400, items: {} } },
};

export const BUILD_ORDER: BuildingType[] = ['generator', 'wire', 'belt', 'box', 'workbench', 'healer', 'smelter', 'crusher', 'infuser', 'alchemy', 'condenser', 'warehouse', 'splitter'];

export interface Recipe {
  id: string;
  machine: BuildingType;
  inputs: Record<string, number>;
  output: string;
  count: number;
  /** 이 레시피를 돌리려면 필요한 건물 레벨 (재료 단계) */
  tier: number;
  /** 초. 방치형 느낌으로 길게 잡았다 */
  time: number;
}

const WOODS = ['wood', 'redpine_wood', 'frost_wood', 'crystal_wood', 'iron_wood', 'flame_wood', 'dim_wood'];
const PLANKS = ['plank', 'redpine_plank', 'frost_plank', 'crystal_plank', 'ironwood_plank', 'flame_plank', 'dim_plank'];
const INGOTS = ['copper_ingot', 'iron_ingot', 'gold_ingot', 'diamond', 'titanium_ingot', 'orichalcum_ingot', 'dim_ingot'];
const MANA_METALS = ['mana_copper', 'mana_iron', 'mana_gold', 'mana_diamond', 'mana_titanium', 'mana_orichalcum', 'mana_dim'];
/** 단계에 맞는 마력 정수 */
export const TIER_ESSENCE = essenceForTier;

export const RECIPES: Recipe[] = [
  // 벌목소: 나무 단계 → 같은 단계 판자 2개
  ...WOODS.map((w, i): Recipe => ({ id: i === 0 ? 'plank' : `plank_${i + 1}`, machine: 'crusher', inputs: { [w]: 1 }, output: PLANKS[i], count: 2, tier: i + 1, time: 15 + i * 3 })),
  // 마력 주입기: 주괴 → 마력 금속, 판자 → 마력 판자 (단계에 맞는 마력 정수)
  ...INGOTS.map((g, i): Recipe => ({ id: MANA_METALS[i], machine: 'infuser', inputs: { [g]: 1, [TIER_ESSENCE(i + 1)]: 1 }, output: MANA_METALS[i], count: 1, tier: i + 1, time: 25 + i * 5 })),
  ...PLANKS.map((pl, i): Recipe => ({ id: `mana_plank_${i + 1}`, machine: 'infuser', inputs: { [pl]: 1, [TIER_ESSENCE(i + 1)]: 1 }, output: `mana_plank_${i + 1}`, count: 1, tier: i + 1, time: 20 + i * 5 })),
  { id: 'copper_ingot', machine: 'smelter', inputs: { copper_ore: 1 }, output: 'copper_ingot', count: 1, tier: 1, time: 15 },
  { id: 'iron_ingot', machine: 'smelter', inputs: { iron_ore: 1 }, output: 'iron_ingot', count: 1, tier: 2, time: 20 },
  { id: 'gold_ingot', machine: 'smelter', inputs: { gold_ore: 1 }, output: 'gold_ingot', count: 1, tier: 3, time: 30 },
  { id: 'diamond', machine: 'smelter', inputs: { diamond_ore: 1 }, output: 'diamond', count: 1, tier: 4, time: 35 },
  { id: 'titanium_ingot', machine: 'smelter', inputs: { titanium_ore: 1 }, output: 'titanium_ingot', count: 1, tier: 5, time: 40 },
  { id: 'orichalcum_ingot', machine: 'smelter', inputs: { orichalcum_ore: 1 }, output: 'orichalcum_ingot', count: 1, tier: 6, time: 50 },
  { id: 'dim_ingot', machine: 'smelter', inputs: { dim_ore: 1 }, output: 'dim_ingot', count: 1, tier: 7, time: 60 },
  { id: 'return_stone', machine: 'workbench', inputs: { mana_copper: 1, plank: 2 }, output: 'return_stone', count: 1, tier: 1, time: 45 },
  { id: 'bag_kit', machine: 'workbench', inputs: { magi_alloy: 1, gear_part: 2, mana_iron: 1 }, output: 'bag_kit', count: 1, tier: 5, time: 120 },
  { id: 'resonator', machine: 'workbench', inputs: { dim_ingot: 3, orichalcum_ingot: 2, mana_titanium: 2 }, output: 'resonator', count: 1, tier: 7, time: 300 },
  // 차원 응축기: 파밍한 차원 가루 → 차원 파편 / 차원 마력 정수
  { id: 'dim_shard', machine: 'condenser', inputs: { dim_dust: 8, essence_high: 1, titanium_plate: 1 }, output: 'dim_shard', count: 1, tier: 1, time: 120 },
  { id: 'essence_dim', machine: 'condenser', inputs: { dim_dust: 4, essence_supreme: 1, orichalcum_ingot: 1 }, output: 'essence_dim', count: 1, tier: 1, time: 90 },
  { id: 'dim_alloy2', machine: 'workbench', inputs: { titanium_plate: 3, orichalcum_plate: 3, mana_titanium_plate: 1, essence_supreme: 1 }, output: 'dim_alloy2', count: 1, tier: 6, time: 150 },
  { id: 'dim_alloy', machine: 'workbench', inputs: { copper_plate: 3, iron_plate: 3, gold_plate: 2, diamond_plate: 2, essence_high: 1 }, output: 'dim_alloy', count: 1, tier: 4, time: 90 },
  { id: 'food_guard', machine: 'alchemy', inputs: { frost_plank: 2, plank: 3, essence_low: 2 }, output: 'food_guard', count: 1, tier: 3, time: 40 },
  { id: 'food_luck', machine: 'alchemy', inputs: { crystal_plank: 2, plank: 2, essence_low: 1 }, output: 'food_luck', count: 1, tier: 4, time: 45 },
  { id: 'food_exp', machine: 'alchemy', inputs: { ironwood_plank: 2, redpine_plank: 2, essence_mid: 1 }, output: 'food_exp', count: 1, tier: 5, time: 50 },
  { id: 'food_atk', machine: 'alchemy', inputs: { flame_plank: 2, redpine_plank: 2, essence_mid: 1 }, output: 'food_atk', count: 1, tier: 6, time: 55 },
  { id: 'potion_mid', machine: 'alchemy', inputs: { potion: 1, essence_mid: 1 }, output: 'potion_mid', count: 1, tier: 3, time: 40 },
  { id: 'potion_high', machine: 'alchemy', inputs: { potion_mid: 1, essence_high: 1 }, output: 'potion_high', count: 1, tier: 6, time: 60 },
];

/** 예전 저장의 레시피 id → 새 id */
export const RECIPE_RENAMES: Record<string, string> = { plank_redpine: 'plank_2', plank_frost: 'plank_3', plank_crystal: 'plank_4', plank_iron: 'plank_5', plank_flame: 'plank_6', plank_dim: 'plank_7', silver_ingot: 'gold_ingot', mithril_ingot: 'titanium_ingot', obsidian_plate: 'orichalcum_ingot', dim_dust_void: 'dim_dust', mana_silver: 'mana_gold', mana_mithril: 'mana_titanium' };

/** 마력 정수 하나가 발전기에서 타는 시간(초) */
/** 마력 정수 한 개가 타는 시간(초, 전력을 가득 쓸 때) */
export const ESSENCE_BURN: Record<string, number> = { essence_low: 120, essence_mid: 300, essence_high: 600, essence_supreme: 1200, essence_dim: 2400 };
/** 그 정수가 타는 동안 같은 전력망 기계의 생산 속도 배율 */
export const ESSENCE_BOOST: Record<string, number> = { essence_low: 1, essence_mid: 1.15, essence_high: 1.3, essence_supreme: 1.5, essence_dim: 1.8 };

/** 공장 크기 단계와 확장 비용 */
export const FACTORY_SIZES = [
  { size: 8, cost: null as null | { gold: number; items: Record<string, number> } },
  { size: 12, cost: { gold: 500, items: { copper_ingot: 10, plank: 10 } } },
  { size: 16, cost: { gold: 2000, items: { gold_ingot: 10, mana_iron: 10 } } },
  { size: 24, cost: { gold: 6000, items: { magi_alloy: 10, mana_gold: 10 } } },
];

export const OFFLINE_CAP_HOURS = 8;

// ---- 건물 레벨 (세라의 강화 도면) ----
export const MAX_BUILDING_LEVEL = 7;
/** 레벨을 올릴 수 있는 건물 */
export const UPGRADABLE: BuildingType[] = ['generator', 'smelter', 'crusher', 'infuser', 'alchemy', 'condenser', 'warehouse'];

const LEVEL_INGOT = ['copper_ingot', 'iron_ingot', 'gold_ingot', 'diamond', 'titanium_ingot', 'orichalcum_ingot', 'dim_ingot'];

/**
 * Lv.L 강화 도면 (세라): 한 단계 아래 재료로 산다.
 * 새 단계 재료는 새 단계 건물이 있어야 만들 수 있으므로, 이전 단계 재료로 계단을 오른다.
 */
export function upgradeBlueprintCost(type: BuildingType, level: number): { gold: number; items: Record<string, number> } {
  const heavy = type === 'generator' ? 2 : 1;
  return { gold: 400 * level * heavy, items: { [LEVEL_INGOT[level - 2]]: 4 * heavy, [PLANKS[level - 2]]: 4 * heavy } };
}

/** 설치된 건물을 Lv.L로 올리는 비용: 역시 한 단계 아래 재료 */
export function buildingUpgradeCost(type: BuildingType, level: number): Record<string, number> {
  const heavy = type === 'generator' ? 2 : 1;
  return { [LEVEL_INGOT[level - 2]]: 6 * heavy, [PLANKS[level - 2]]: 6 * heavy };
}

/** 레벨에 따른 가공 속도 배율 */
export function levelSpeed(level: number): number {
  return 1 + (level - 1) * 0.15;
}
/** 발전기 전력 */
export function generatorPower(level: number): number {
  return BUILDINGS.generator.power + (level - 1) * 15;
}
