import type { EquipSlot } from './equipment';
import { essenceForTier, TIER_MANA_METAL, TIER_MANA_PLANK, TIER_MANA_PLATE, TIER_PLANK } from './items';
import { TIER_INGOT } from './tools';

/** 차원집 제작대: 레벨업 비용과 제작 레시피 */
export const WORKBENCH_MAX_LEVEL = 7;

export interface CraftCost {
  items: Record<string, number>;
  /** 제작 시간(초, 제작대 Lv.1·전력 100% 기준) */
  time: number;
  gold: number;
}

/** 제작대 레벨 L → L+1 (레벨 = 만들 수 있는 최고 단계). 지금 레벨 단계의 재료로 올린다 */
export function workbenchUpgradeCost(level: number): CraftCost | null {
  if (level >= WORKBENCH_MAX_LEVEL) return null;
  return {
    items: { [TIER_INGOT[level - 1]]: 10 + level * 5, [TIER_PLANK[level - 1]]: 10 + level * 2, [essenceForTier(level)]: 10 + level * 4 },
    time: 0,
    gold: 500 * level,
  };
}

export function toolCraftCost(tier: number): CraftCost {
  return { items: { [TIER_INGOT[tier - 1]]: 4, [TIER_PLANK[tier - 1]]: 3 }, time: 20 * tier, gold: 50 * tier };
}

const SLOT_INGOTS: Record<EquipSlot, number> = { weapon: 5, helmet: 3, armor: 6, pants: 4, boots: 3, ring: 2, necklace: 2 };

export function equipCraftCost(slot: EquipSlot, tier: number): CraftCost {
  const items: Record<string, number> = { [TIER_INGOT[tier - 1]]: SLOT_INGOTS[slot] };
  if (slot !== 'ring' && slot !== 'necklace') items[TIER_PLANK[tier - 1]] = 2;
  // 모든 장비 제작에 마력 정수가 든다 (장신구는 더 많이)
  items[essenceForTier(tier)] = slot === 'ring' || slot === 'necklace' ? 5 : 2;
  return { items, time: 15 * tier, gold: 40 * tier };
}

/** 판 합성: 주괴 + 판자 → 재질판 (강화 재료) */
export function plateCraftCost(tier: number): CraftCost {
  return { items: { [TIER_INGOT[tier - 1]]: 2, [TIER_PLANK[tier - 1]]: 2 }, time: 8 * tier, gold: 0 };
}

/** 마력판 합성: 마력 금속 + 같은 단계 판자 (+6~+10 강화 재료) */
export function manaPlateCraftCost(tier: number): CraftCost {
  return { items: { [TIER_MANA_METAL[tier - 1]]: 2, [TIER_PLANK[tier - 1]]: 2 }, time: 15 * tier, gold: 0 };
}
export const MANA_PLATE_OF = (tier: number) => TIER_MANA_PLATE[tier - 1];

/** 마력 제작: 판자 대신 마력 판자를 쓰면 좋은 등급이 나올 수 있다 */
export function equipManaCraftCost(slot: EquipSlot, tier: number): CraftCost {
  return { items: { [TIER_INGOT[tier - 1]]: SLOT_INGOTS[slot], [TIER_MANA_PLANK[tier - 1]]: slot === 'ring' || slot === 'necklace' ? 2 : 3 }, time: 25 * tier, gold: 80 * tier };
}

/** 마력 제작 등급: 고급 이상 보장, 희귀 30% · 영웅 9% · 유니크 2.5% · 전설 0.5% (차원 등급은 제작 불가) */
export function rollManaGrade(r: number): number {
  return r < 0.005 ? 5 : r < 0.03 ? 4 : r < 0.12 ? 3 : r < 0.42 ? 2 : 1;
}
