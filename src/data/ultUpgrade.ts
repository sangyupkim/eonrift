import { MAX_ULT_LEVEL } from './classes';
import { essenceForTier, TIER_MANA_PLATE, TIER_PLATE } from './items';

export interface UltUpgradeCost {
  gold: number;
  /** 필요한 캐릭터 레벨 */
  level: number;
  items: Record<string, number>;
}

/** 파편 수: Lv.1→2 3개, 2→3 5개, 3→4 8개, 4→5 12개 */
const SHARDS = [3, 5, 8, 12];

/** 궁극기를 lv에서 lv+1로 올리는 비용. 최대 레벨이면 null */
export function ultUpgradeCost(lv: number): UltUpgradeCost | null {
  if (lv >= MAX_ULT_LEVEL) return null;
  const i = Math.max(0, lv - 1);
  const plateTier = Math.min(6, 2 + i); // 금판 → 다이아판 → 티타늄판 → 오리하르콘판
  return {
    gold: 5000 * lv * lv,
    level: 20 + i * 15,
    items: {
      dim_shard: SHARDS[i],
      [TIER_PLATE[plateTier]]: 10 + i * 5,
      [TIER_MANA_PLATE[plateTier - 1]]: 5 + i * 3,
      [essenceForTier(Math.min(7, 4 + i))]: 20 + i * 10,
    },
  };
}
