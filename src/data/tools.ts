/** 채집 도구 (곡괭이·도끼): 단계, 강화, 내구도 */
export type ToolKind = 'pickaxe' | 'axe';

export interface ToolState {
  tier: number;
  plus: number;
  dur: number;
}

export const TOOL_TIER_NAMES = ['구리', '철', '황금', '다이아', '티타늄', '오리하르콘', '차원'];
export const TOOL_KIND_NAMES: Record<ToolKind, string> = { pickaxe: '곡괭이', axe: '도끼' };
export const TOOL_MAX_PLUS = 10;

/** 단계마다 제작에 쓰는 주괴 (1단계 구리 주괴 … 7단계 차원 주괴) */
export const TIER_INGOT = ['copper_ingot', 'iron_ingot', 'gold_ingot', 'diamond', 'titanium_ingot', 'orichalcum_ingot', 'dim_ingot'];
export const TIER_ORE = ['copper_ore', 'iron_ore', 'gold_ore', 'diamond_ore', 'titanium_ore', 'orichalcum_ore', 'dim_ore'];

export function toolName(kind: ToolKind, t: ToolState): string {
  return `${TOOL_TIER_NAMES[t.tier - 1]} ${TOOL_KIND_NAMES[kind]}${t.plus ? ` +${t.plus}` : ''}`;
}

export function toolMaxDur(t: ToolState): number {
  return 150 + (t.tier - 1) * 60 + t.plus * 10;
}

/**
 * 이 도구로 그 단계 자원을 캘 수 있는지, 한 번 칠 때 닳는 내구도.
 * 자기 단계까지는 1, 한 단계 위는 3씩 닳고, 그보다 위는 못 캔다
 */
export function toolWear(t: ToolState, resourceTier: number): number | null {
  if (resourceTier <= t.tier) return 1;
  if (resourceTier === t.tier + 1) return 3;
  return null;
}

/** 강화 효과: 캐는 속도, 추가 채집 확률 */
export function toolSpeed(t: ToolState): number {
  return 1 + t.plus * 0.06;
}
export function toolBonusChance(t: ToolState): number {
  return t.plus * 0.05;
}

const RATES = [1, 0.95, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2];

/** 도구 강화 (대장간): 도구 단계의 광석 + 골드 */
export function toolEnhanceCost(t: ToolState): { ore: string; count: number; gold: number; rate: number } | null {
  if (t.plus >= TOOL_MAX_PLUS) return null;
  return { ore: TIER_ORE[t.tier - 1], count: 5 + t.plus * 3, gold: 80 * (t.plus + 1) * t.tier, rate: RATES[t.plus] };
}

/** 수리: 도구 단계의 광석 */
export function toolRepair(t: ToolState): { ore: string; count: number; gold: number } | null {
  const missing = toolMaxDur(t) - t.dur;
  if (missing <= 0) return null;
  return { ore: TIER_ORE[t.tier - 1], count: Math.ceil(missing / 20), gold: Math.round(missing * t.tier * 0.8) };
}

export function newTool(tier = 1): ToolState {
  const t = { tier, plus: 0, dur: 0 };
  t.dur = toolMaxDur(t);
  return t;
}
