import { describe, expect, it } from 'vitest';
import { workbenchUpgradeCost } from '../src/data/crafting';
import { buildingUpgradeCost, RECIPES, UPGRADABLE, upgradeBlueprintCost } from '../src/data/factory';
import { TIER_PLANK } from '../src/data/items';
import { TIER_INGOT } from '../src/data/tools';

/** 재료의 단계 (주괴·판자). 단계가 없는 재료(정수 등)는 0 */
const tierOf = (id: string) => Math.max(TIER_INGOT.indexOf(id), TIER_PLANK.indexOf(id)) + 1;

describe('단계별 계단식 성장', () => {
  it('Lv.L 강화 도면과 업그레이드는 L-1단계 이하 재료만 쓴다', () => {
    for (const t of UPGRADABLE)
      for (let L = 2; L <= 7; L++) {
        for (const id of Object.keys(upgradeBlueprintCost(t, L).items)) expect(tierOf(id), `${t} Lv${L} 도면 ${id}`).toBeLessThanOrEqual(L - 1);
        for (const id of Object.keys(buildingUpgradeCost(t, L))) expect(tierOf(id), `${t} Lv${L} 업그레이드 ${id}`).toBeLessThanOrEqual(L - 1);
      }
  });
  it('제작대 Lv.L → L+1은 L단계 이하 재료만 쓴다', () => {
    for (let L = 1; L < 7; L++) for (const id of Object.keys(workbenchUpgradeCost(L)!.items)) expect(tierOf(id)).toBeLessThanOrEqual(L);
  });
  it('단계 L 주괴·판자는 Lv.L 제련로·벌목소에서 나온다', () => {
    for (let L = 1; L <= 7; L++) {
      expect(RECIPES.find((r) => r.output === TIER_INGOT[L - 1])!.tier).toBe(L);
      expect(RECIPES.find((r) => r.output === TIER_PLANK[L - 1])!.tier).toBe(L);
    }
  });
});
