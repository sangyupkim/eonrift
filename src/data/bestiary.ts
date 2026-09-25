import { essenceForTier, TIER_MANA_PLATE, TIER_PLATE } from './items';
import { BOSS_SPECIES, MIDBOSS_SPECIES, SPECIES, TIER_POOLS, type SpeciesDef } from './species';

/**
 * 몬스터 도감: 종족마다 쓰러뜨린 수를 세고, 정해진 수를 넘기면 연구자에게 보상을 받는다.
 * 여러 종족을 발견(1마리 이상 처치)할수록 영구 연구 보너스(공격력·체력 +%)가 쌓인다.
 */
export interface BestiaryEntry {
  species: SpeciesDef;
  /** 처음 나오는 단계 */
  tier: number;
  rank: 'normal' | 'midboss' | 'boss';
}

const entries: BestiaryEntry[] = [];
const seen = new Set<string>();
for (let t = 1; t <= 7; t++) {
  for (const [id] of TIER_POOLS[t]) {
    if (seen.has(id)) continue;
    seen.add(id);
    entries.push({ species: SPECIES[id], tier: t, rank: 'normal' });
  }
  entries.push({ species: MIDBOSS_SPECIES[t - 1], tier: t, rank: 'midboss' });
  entries.push({ species: BOSS_SPECIES[t - 1], tier: t, rank: 'boss' });
}
export const BESTIARY: BestiaryEntry[] = entries;
export const BESTIARY_BY_ID: Record<string, BestiaryEntry> = Object.fromEntries(entries.map((e) => [e.species.id, e]));

/** 도감에 세는 종족 id (작은 슬라임 → 슬라임) */
export function bestiaryId(speciesId: string): string | null {
  if (speciesId === 'slime_small') return 'slime';
  return BESTIARY_BY_ID[speciesId] ? speciesId : null;
}

/** 종족별 처치 목표: 일반 1·30·100마리, 보스 1·5·15번 */
export function killMilestones(e: BestiaryEntry): number[] {
  return e.rank === 'normal' ? [1, 30, 100] : [1, 5, 15];
}

export interface BestiaryReward {
  gold: number;
  items: Record<string, number>;
}

const ESS = essenceForTier;

export function milestoneReward(e: BestiaryEntry, idx: number): BestiaryReward {
  const t = e.tier;
  if (e.rank === 'normal') {
    if (idx === 0) return { gold: 40 * t, items: {} };
    if (idx === 1) return { gold: 150 * t, items: { [ESS(t)]: 3 + t } };
    return { gold: 400 * t, items: { [TIER_PLATE[t - 1]]: 2, [TIER_MANA_PLATE[t - 1]]: 1 } };
  }
  const big = e.rank === 'boss' ? 2 : 1;
  if (idx === 0) return { gold: 250 * t * big, items: { [TIER_PLATE[t - 1]]: big } };
  if (idx === 1) return { gold: 600 * t * big, items: { [TIER_PLATE[t - 1]]: 2 * big, [ESS(t)]: 4 * big } };
  return { gold: 1500 * t * big, items: { [TIER_MANA_PLATE[t - 1]]: 2 * big } };
}

/** 발견한 종족 수 목표와 보상. 하나 받을 때마다 연구 보너스 +1단계 (공격력·최대 체력 +2%) */
export const COLLECTION_MILESTONES: { count: number; reward: BestiaryReward }[] = [
  { count: 5, reward: { gold: 300, items: { potion: 5 } } },
  { count: 10, reward: { gold: 800, items: { return_stone: 2, essence_low: 10 } } },
  { count: 20, reward: { gold: 2000, items: { copper_plate: 3, iron_plate: 3 } } },
  { count: 30, reward: { gold: 5000, items: { essence_mid: 10, gold_plate: 3 } } },
  { count: 40, reward: { gold: 10000, items: { essence_mid: 15, mana_iron: 5 } } },
  { count: 50, reward: { gold: 20000, items: { essence_high: 15 } } },
  { count: BESTIARY.length, reward: { gold: 50000, items: { essence_high: 30 } } },
];

/** 연구 보너스 한 단계당 공격력·최대 체력 비율 */
export const RESEARCH_BONUS = 0.02;
