import type { Bonus, BonusKey } from './bonus';
import type { ClassId, StatKey } from './classes';
import { TIER_MANA_METAL, TIER_MANA_PLATE, TIER_PLANK, TIER_PLATE } from './items';
import { TIER_INGOT } from './tools';

/**
 * 특수 옵션: 유니크 1줄 · 전설 2줄 · 차원 3줄. 드롭·제작 때 자동으로 붙고, 엔딩 뒤 대장간에서 다시 굴린다.
 * 무기는 직업마다 6종, 방어구는 공통 4종 + 부위별 2종, 장신구는 공통 4종(능력치) + 부위별 2종.
 * 값은 표시 단위(%, 능력치는 점수)로 저장한다.
 */
export type SpecialKey =
  // 무기 (공통)
  | 'critDmg' | 'bossDmg' | 'execute'
  // 검
  | 'lifesteal' | 'double' | 'killHeal'
  // 지팡이
  | 'mpOnHit' | 'cdOnHit' | 'arcBurst' | 'killMp'
  // 활
  | 'hasteOnHit' | 'swiftOnHit'
  // 방어구
  | 'hp' | 'def' | 'dmgReduce' | 'dodge' | 'mp' | 'cdr' | 'lowGuard' | 'hitHeal' | 'regen' | 'mpRegen' | 'move' | 'speed'
  // 장신구
  | 'str' | 'int' | 'dex' | 'vit' | 'mag' | 'atk' | 'crit' | 'ult';

export interface SpecialLine {
  k: SpecialKey;
  v: number;
}

interface SpecialDef {
  /** 유니크 기준 범위 (전설 ×1.2, 차원 ×1.4) */
  min: number;
  max: number;
  /** 값을 넣어 설명을 만든다 */
  text: (v: number) => string;
  /** 능력치 점수처럼 단계에 따라 커지는 옵션 */
  tierScaled?: boolean;
  /** 값을 정수로 */
  int?: boolean;
}

const pct = (v: number) => `${Math.round(v * 10) / 10}%`;

export const SPECIALS: Record<SpecialKey, SpecialDef> = {
  critDmg: { min: 8, max: 20, text: (v) => `치명타 피해 +${pct(v)}` },
  bossDmg: { min: 4, max: 10, text: (v) => `파수꾼·수호자에게 피해 +${pct(v)}` },
  execute: { min: 8, max: 18, text: (v) => `체력 30% 이하 적에게 피해 +${pct(v)}` },
  lifesteal: { min: 0.8, max: 2, text: (v) => `적중 시 준 피해의 ${pct(v)} 체력 회복` },
  double: { min: 4, max: 10, text: (v) => `적중 시 ${pct(v)} 확률로 한 번 더 타격` },
  killHeal: { min: 1.5, max: 4, text: (v) => `처치 시 최대 체력 ${pct(v)} 회복` },
  mpOnHit: { min: 0.3, max: 0.8, text: (v) => `적중 시 최대 MP ${pct(v)} 회복` },
  cdOnHit: { min: 4, max: 10, text: (v) => `적중 시 ${pct(v)} 확률로 모든 스킬 재사용 대기 0.6초 감소` },
  arcBurst: { min: 5, max: 12, text: (v) => `적중 시 ${pct(v)} 확률로 마력 폭발 (피해의 60% 추가)` },
  killMp: { min: 2, max: 5, text: (v) => `처치 시 최대 MP ${pct(v)} 회복` },
  hasteOnHit: { min: 5, max: 12, text: (v) => `적중 시 ${pct(v)} 확률로 4초 동안 공격 속도 +20%` },
  swiftOnHit: { min: 5, max: 12, text: (v) => `적중 시 ${pct(v)} 확률로 3초 동안 이동 속도 +20%` },
  hp: { min: 2, max: 5, text: (v) => `최대 체력 +${pct(v)}` },
  def: { min: 3, max: 7, text: (v) => `방어력 +${pct(v)}` },
  dmgReduce: { min: 1, max: 3, text: (v) => `받는 피해 -${pct(v)}` },
  dodge: { min: 1.5, max: 4, text: (v) => `${pct(v)} 확률로 공격을 흘려 피함` },
  mp: { min: 3, max: 8, text: (v) => `최대 MP +${pct(v)}` },
  cdr: { min: 1, max: 3, text: (v) => `스킬 재사용 대기 -${pct(v)}` },
  lowGuard: { min: 6, max: 14, text: (v) => `체력 35% 이하일 때 받는 피해 -${pct(v)}` },
  hitHeal: { min: 4, max: 9, text: (v) => `맞을 때 ${pct(v)} 확률로 최대 체력 4% 회복` },
  regen: { min: 0.1, max: 0.3, text: (v) => `초당 최대 체력 ${pct(v)} 재생` },
  mpRegen: { min: 0.1, max: 0.3, text: (v) => `전투 중에도 초당 최대 MP ${pct(v)} 재생` },
  move: { min: 2, max: 5, text: (v) => `이동 속도 +${pct(v)}` },
  speed: { min: 2, max: 5, text: (v) => `공격 속도 +${pct(v)}` },
  str: { min: 3, max: 6, tierScaled: true, int: true, text: (v) => `힘 +${v}` },
  int: { min: 3, max: 6, tierScaled: true, int: true, text: (v) => `지능 +${v}` },
  dex: { min: 3, max: 6, tierScaled: true, int: true, text: (v) => `민첩 +${v}` },
  vit: { min: 3, max: 6, tierScaled: true, int: true, text: (v) => `체력 +${v}` },
  mag: { min: 3, max: 6, tierScaled: true, int: true, text: (v) => `마력 +${v}` },
  atk: { min: 1.5, max: 4, text: (v) => `공격력 +${pct(v)}` },
  crit: { min: 1, max: 3, text: (v) => `치명타 확률 +${pct(v)}` },
  ult: { min: 3, max: 8, text: (v) => `궁극기 위력 +${pct(v)}` },
};

const ARMOR_SHARED: SpecialKey[] = ['hp', 'def', 'dmgReduce', 'dodge'];
const ACC_SHARED: SpecialKey[] = ['str', 'int', 'dex', 'vit'];

/** 부위(무기는 직업)별로 붙을 수 있는 6종 */
export function specialPool(slot: string, cls?: ClassId): SpecialKey[] {
  switch (slot) {
    case 'weapon':
      if (cls === 'mage') return ['mpOnHit', 'cdOnHit', 'arcBurst', 'killMp', 'bossDmg', 'critDmg'];
      if (cls === 'archer') return ['hasteOnHit', 'double', 'swiftOnHit', 'critDmg', 'execute', 'bossDmg'];
      return ['lifesteal', 'double', 'killHeal', 'execute', 'bossDmg', 'critDmg'];
    case 'helmet':
      return [...ARMOR_SHARED, 'mp', 'cdr'];
    case 'armor':
      return [...ARMOR_SHARED, 'lowGuard', 'hitHeal'];
    case 'pants':
      return [...ARMOR_SHARED, 'regen', 'mpRegen'];
    case 'boots':
      return [...ARMOR_SHARED, 'move', 'speed'];
    case 'ring':
      return [...ACC_SHARED, 'atk', 'crit'];
    case 'necklace':
      return [...ACC_SHARED, 'mag', 'ult'];
  }
  return [];
}

/** 등급별 특수 옵션 줄 수: 유니크 1 · 전설 2 · 차원 3 */
export function specialCount(grade: number): number {
  return Math.max(0, Math.min(3, grade - 3));
}

const GRADE_MULT = [1, 1.2, 1.4];

/** 이 장비(등급·단계)에서 나올 수 있는 값 범위 */
export function specialRange(k: SpecialKey, grade: number, tier: number): [number, number] {
  const d = SPECIALS[k];
  const g = GRADE_MULT[Math.max(0, Math.min(2, grade - 4))];
  const t = d.tierScaled ? 1 + (tier - 1) * 0.5 : 1;
  return [d.min * g * t, d.max * g * t];
}

export function rollSpecialValue(k: SpecialKey, grade: number, tier: number, r: number): number {
  const [lo, hi] = specialRange(k, grade, tier);
  const v = lo + (hi - lo) * r;
  return SPECIALS[k].int ? Math.round(v) : Math.round(v * 100) / 100;
}

interface SpecialTarget {
  slot: string;
  cls?: ClassId;
  grade: number;
  tier: number;
  sp?: SpecialLine[];
}

/**
 * 특수 옵션을 굴린다. locked에 든 줄 번호는 그대로 두고 나머지만 새로 뽑는다 (한 장비에 같은 옵션은 한 번만).
 */
export function rollSpecials(e: SpecialTarget, rng: { next(): number }, locked: number[] = []): SpecialLine[] {
  const n = specialCount(e.grade);
  const old = e.sp ?? [];
  const out: SpecialLine[] = [];
  const used = new Set<SpecialKey>(locked.map((i) => old[i]?.k).filter(Boolean) as SpecialKey[]);
  for (let i = 0; i < n; i++) {
    if (locked.includes(i) && old[i]) {
      out.push(old[i]);
      continue;
    }
    const pool = specialPool(e.slot, e.cls).filter((k) => !used.has(k));
    const k = pool[Math.floor(rng.next() * pool.length) % pool.length];
    used.add(k);
    out.push({ k, v: rollSpecialValue(k, e.grade, e.tier, rng.next()) });
  }
  return out;
}

export function specialText(l: SpecialLine): string {
  return SPECIALS[l.k].text(l.v);
}

/** 여러 장비의 특수 옵션 합계 */
export type SpecialTotals = Partial<Record<SpecialKey, number>>;
export function sumSpecials(lines: SpecialLine[]): SpecialTotals {
  const t: SpecialTotals = {};
  for (const l of lines) t[l.k] = (t[l.k] ?? 0) + l.v;
  // 확률·감소 옵션 한도
  const cap = (k: SpecialKey, m: number) => {
    if ((t[k] ?? 0) > m) t[k] = m;
  };
  cap('dodge', 20);
  cap('dmgReduce', 20);
  cap('double', 40);
  cap('lowGuard', 40);
  return t;
}

/** 공통 보너스(%)로 들어가는 옵션 → 보너스 이름표 */
const TO_BONUS: Partial<Record<SpecialKey, BonusKey>> = { hp: 'hp', def: 'def', mp: 'mp', cdr: 'cdr', move: 'move', speed: 'speed', atk: 'atk', crit: 'crit', ult: 'ult', mpRegen: 'mpRegen' };
export function specialBonus(t: SpecialTotals): Bonus {
  const b: Bonus = {};
  for (const [k, key] of Object.entries(TO_BONUS) as [SpecialKey, BonusKey][]) {
    const v = t[k];
    if (!v) continue;
    b[key] = key === 'crit' ? v : v / 100;
  }
  return b;
}

/** 능력치 점수로 들어가는 옵션 */
export function specialStats(t: SpecialTotals): Partial<Record<StatKey, number>> {
  return { str: t.str ?? 0, int: t.int ?? 0, dex: t.dex ?? 0, vit: t.vit ?? 0, mag: t.mag ?? 0 };
}

/**
 * 대장간 특수 옵션 다시 굴리기 비용 (엔딩 뒤).
 * 등급·단계가 높을수록 비싸고, 여러 단계의 판·판자·주괴를 함께 먹는다.
 * 고정한 줄마다 골드 ×2.5 · 재료 ×2, 차원 가루와 그 단계 마력 금속이 더 든다.
 */
export function specialRerollCost(grade: number, tier: number, locks: number): { gold: number; items: Record<string, number> } {
  const g = Math.max(1, grade - 3);
  const t = Math.min(7, Math.max(1, tier));
  const m = 1 + locks;
  const items: Record<string, number> = {};
  const add = (id: string, n: number) => (items[id] = (items[id] ?? 0) + Math.round(n));
  add('dim_shard', 2 * g * m);
  add('essence_high', 4 * g * m);
  add(TIER_MANA_PLATE[t - 1], 2 * g * m);
  add(TIER_PLATE[t - 1], 5 * g * m);
  add(TIER_PLANK[t - 1], 5 * g * m);
  add(TIER_INGOT[Math.max(0, t - 3)], 8 * g * m);
  add(TIER_PLANK[Math.max(0, t - 2)], 8 * g * m);
  if (locks > 0) {
    add('dim_dust', 10 * g * locks);
    add(TIER_MANA_METAL[t - 1], 3 * g * locks);
  }
  return { gold: Math.round(30000 * g * (1 + (t - 1) * 0.2) * (1 + locks * 1.5)), items };
}
