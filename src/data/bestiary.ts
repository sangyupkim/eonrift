import { essenceForTier, TIER_MANA_PLATE, TIER_PLATE } from './items';
import { BOSS_SPECIES, CH8_BOSS, CH8_MIDBOSS, MIDBOSS_SPECIES, SPECIES, TIER_POOLS, type SpeciesDef } from './species';
import type { StatKey } from './classes';

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
for (let t = 1; t <= 8; t++) {
  for (const [id] of TIER_POOLS[t]) {
    if (seen.has(id)) continue;
    seen.add(id);
    entries.push({ species: SPECIES[id], tier: t, rank: 'normal' });
  }
  // 8장(v10)의 보스는 따로 정한 모습
  entries.push({ species: t === 8 ? CH8_MIDBOSS : MIDBOSS_SPECIES[t - 1], tier: t, rank: 'midboss' });
  entries.push({ species: t === 8 ? CH8_BOSS : BOSS_SPECIES[t - 1], tier: t, rank: 'boss' });
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
  // 8장 몬스터는 7단계 재료로 (새 재료 없음)
  const t = Math.min(7, e.tier);
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

// ---- 도감 영구 능력치 (단계와 관계없이 같은 양) ----
/** 일반 몬스터는 1000마리, 파수꾼·수호자는 30번 잡으면 영구 능력치 */
export const SPECIES_STAT_KILLS = 1000;
export const BOSS_STAT_KILLS = 30;
/** 일반 종족 1000마리: 그 종족에 어울리는 능력치 +2 */
export const SPECIES_STAT_GAIN = 2;
/** 파수꾼 30번: 모든 능력치 +1 · 수호자 30번: 모든 능력치 +2 · 단계 마스터(그 단계 일반 종족 모두 1000마리): 모든 능력치 +3 */
export const MIDBOSS_ALL_GAIN = 1;
export const BOSS_ALL_GAIN = 2;
export const MASTER_ALL_GAIN = 3;

const ARCH_STAT: Record<string, StatKey> = {
  melee: 'str', brute: 'str', charger: 'str',
  tank: 'vit', knight: 'vit',
  ranged: 'dex', archer: 'dex', assassin: 'dex',
  necro: 'int', shaman: 'int', caster: 'int',
  bomber: 'mag', swarm: 'mag', spitter: 'mag',
};

/** 도감 항목의 영구 능력치 목표와 보상 */
export function statMilestone(e: BestiaryEntry): { kills: number; stat: StatKey | 'all'; gain: number } {
  if (e.rank === 'normal') return { kills: SPECIES_STAT_KILLS, stat: ARCH_STAT[e.species.arch] ?? 'vit', gain: SPECIES_STAT_GAIN };
  return { kills: BOSS_STAT_KILLS, stat: 'all', gain: e.rank === 'boss' ? BOSS_ALL_GAIN : MIDBOSS_ALL_GAIN };
}

/** 단계 마스터: 그 단계에서 처음 나오는 일반 종족을 모두 1000마리씩 */
export function isStageMaster(tier: number, kills: (id: string) => number): boolean {
  return BESTIARY.filter((e) => e.tier === tier && e.rank === 'normal').every((e) => kills(e.species.id) >= SPECIES_STAT_KILLS);
}

/** 도감으로 얻은 영구 능력치 합계 */
export function bestiaryStats(kills: (id: string) => number): Record<StatKey, number> {
  const s: Record<StatKey, number> = { str: 0, int: 0, dex: 0, vit: 0, mag: 0 };
  const all = (n: number) => { for (const k of Object.keys(s) as StatKey[]) s[k] += n; };
  for (const e of BESTIARY) {
    const m = statMilestone(e);
    if (kills(e.species.id) < m.kills) continue;
    if (m.stat === 'all') all(m.gain);
    else s[m.stat] += m.gain;
  }
  for (let t = 1; t <= 8; t++) if (isStageMaster(t, kills)) all(MASTER_ALL_GAIN);
  return s;
}
