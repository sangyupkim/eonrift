import type { EquipSlot } from './equipment';
import { TIER_INGOT } from './tools';

/** 차원집 제작대: 레벨업 비용과 제작 레시피 */
export const WORKBENCH_MAX_LEVEL = 7;

export interface CraftCost {
  items: Record<string, number>;
  energy: number;
  gold: number;
}

/** 제작대 레벨 L → L+1 (레벨 = 만들 수 있는 최고 단계) */
export function workbenchUpgradeCost(level: number): CraftCost | null {
  if (level >= WORKBENCH_MAX_LEVEL) return null;
  return {
    items: { [TIER_INGOT[level]]: 10 + level * 5, plank: 10 * level, [level < 3 ? 'essence_low' : level < 5 ? 'essence_mid' : 'essence_high']: 5 + level },
    energy: 200 * level,
    gold: 500 * level,
  };
}

export function toolCraftCost(tier: number): CraftCost {
  return { items: { [TIER_INGOT[tier - 1]]: 4, plank: 3 }, energy: 20 * tier, gold: 50 * tier };
}

const SLOT_INGOTS: Record<EquipSlot, number> = { weapon: 5, helmet: 3, armor: 6, pants: 4, boots: 3, ring: 2, necklace: 2 };

export function equipCraftCost(slot: EquipSlot, tier: number): CraftCost {
  const items: Record<string, number> = { [TIER_INGOT[tier - 1]]: SLOT_INGOTS[slot] };
  if (slot !== 'ring' && slot !== 'necklace') items.plank = 2;
  else items[tier < 4 ? 'essence_low' : tier < 6 ? 'essence_mid' : 'essence_high'] = 2;
  return { items, energy: 15 * tier, gold: 40 * tier };
}
