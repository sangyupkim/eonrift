import type { Rng } from '../core/rng';
import { TIER_MANA_PLATE, TIER_PLATE } from './items';
import { CLASSES, type ClassId } from './classes';
import type { EngraveLine } from './bonus';

export type EquipSlot = 'weapon' | 'helmet' | 'armor' | 'pants' | 'boots' | 'ring' | 'necklace';

export const EQUIP_SLOTS: EquipSlot[] = ['weapon', 'helmet', 'armor', 'pants', 'boots', 'ring', 'necklace'];

export const SLOT_NAMES: Record<Exclude<EquipSlot, 'weapon'>, string> = {
  helmet: '투구',
  armor: '갑옷',
  pants: '각반',
  boots: '장화',
  ring: '반지',
  necklace: '목걸이',
};

export interface Equip {
  uid: string;
  slot: EquipSlot;
  /** 무기만: 어느 직업의 무기인지 */
  cls?: ClassId;
  tier: number;
  grade: number;
  plus: number;
  /** 내구도 (없으면 가득). 0이 되면 망가져서 능력치가 사라진다 */
  dur?: number;
  /** 각인 (1단~5단, 차례로 새긴다) */
  eng?: EngraveLine[];
}

export const GRADES = [
  { name: '일반', color: 0xd8dce6, mult: 1 },
  { name: '고급', color: 0x6fe07a, mult: 1.2 },
  { name: '희귀', color: 0x5aa8ff, mult: 1.45 },
  { name: '영웅', color: 0xc07aff, mult: 1.75 },
  { name: '유니크', color: 0xffd84a, mult: 2.1 },
  { name: '전설', color: 0xff7a2a, mult: 2.5 },
  { name: '차원', color: 0x4affe0, mult: 3.0 },
];
/** 등급 번호 */
export const GRADE = { normal: 0, magic: 1, rare: 2, hero: 3, unique: 4, legend: 5, dimension: 6 } as const;

const MATERIAL = ['구리', '철', '황금', '다이아', '티타늄', '오리하르콘', '차원'];

export function slotName(slot: EquipSlot, cls?: ClassId): string {
  return slot === 'weapon' ? CLASSES[cls ?? 'sword'].weaponNoun : SLOT_NAMES[slot];
}

export function equipName(e: Equip): string {
  return `${MATERIAL[e.tier - 1]} ${slotName(e.slot, e.cls)}${e.plus > 0 ? ` +${e.plus}` : ''}`;
}

export interface EquipStats {
  atk: number;
  def: number;
  hp: number;
  mp: number;
  crit: number;
}

export function equipStats(e: Equip): EquipStats {
  if (durability(e) <= 0) return { atk: 0, def: 0, hp: 0, mp: 0, crit: 0 };
  const m = GRADES[e.grade].mult * (1 + e.plus * 0.12);
  // 단계마다 방어구 ×1.9 (1, 1.9, 3.6, 6.9, 13, 25, 47)
  const t = Math.pow(1.9, e.tier - 1);
  const s: EquipStats = { atk: 0, def: 0, hp: 0, mp: 0, crit: 0 };
  switch (e.slot) {
    case 'weapon':
      // 무기는 단계마다 ×2.3: 다음 단계 무기가 이전 단계 +10보다 확실히 세다
      s.atk = Math.round(14 * Math.pow(2.3, e.tier - 1) * m + 4);
      break;
    case 'helmet':
      s.def = Math.round(1.5 * t * m + 1);
      s.hp = Math.round(10 * t * m);
      break;
    case 'armor':
      s.def = Math.round(3 * t * m + 1);
      s.hp = Math.round(22 * t * m);
      break;
    case 'pants':
      s.def = Math.round(2 * t * m + 1);
      s.hp = Math.round(14 * t * m);
      break;
    case 'boots':
      s.def = Math.round(1.2 * t * m + 1);
      s.crit = Math.round(1 + e.grade * 0.5);
      break;
    case 'ring':
      s.atk = Math.round(2.5 * t * m);
      s.crit = Math.round((2 + e.grade * 1.5) * (1 + e.plus * 0.08));
      break;
    case 'necklace':
      s.hp = Math.round(8 * t * m);
      s.mp = Math.round(10 * t * m);
      break;
  }
  return s;
}

let uidCounter = 0;
export function newUid(): string {
  uidCounter++;
  return `${Date.now().toString(36)}${uidCounter.toString(36)}${Math.floor(Math.random() * 1e6).toString(36)}`;
}

/** 던전 드롭 장비. bonus가 클수록 좋은 등급이 나온다 */
/**
 * 장비 등급 굴리기. bonus(정예·보스·깊은 방)는 높은 등급 확률을 몇 배로 늘린다.
 * dimChance: 차원 등급 확률 (보스만 준다, 아주 낮다)
 */
export function rollGrade(r: number, bonus: number, dimChance = 0): number {
  const luck = 1 + bonus * 6;
  const table: [number, number][] = [
    [GRADE.dimension, dimChance],
    [GRADE.legend, 0.002 * luck],
    [GRADE.unique, 0.012 * luck],
    [GRADE.hero, 0.045 * luck],
    [GRADE.rare, 0.12 * luck],
    [GRADE.magic, 0.25 * (1 + bonus * 2)],
  ];
  let acc = 0;
  for (const [g, p] of table) {
    acc += p;
    if (r < acc) return g;
  }
  return GRADE.normal;
}

export function rollEquip(rng: Rng, tier: number, cls: ClassId, bonus: number, dimChance = 0): Equip {
  const grade = rollGrade(rng.next(), bonus, dimChance);
  const slot = rng.next() < 0.3 ? 'weapon' : rng.pick(EQUIP_SLOTS.slice(1));
  return { uid: newUid(), slot, cls: slot === 'weapon' ? cls : undefined, tier, grade, plus: 0 };
}

export function equipValue(e: Equip): number {
  return Math.round(20 * e.tier * GRADES[e.grade].mult * (1 + e.plus * 0.3));
}

/** 강화: 장비 재질과 같은 판 (구리 장비 → 구리판 …). +6~+10은 마력판 */
export function enhanceCost(e: Equip): { item: string; count: number; gold: number; rate: number } | null {
  if (e.plus >= 10) return null;
  const p = e.plus;
  const rates = [1, 0.95, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2];
  // 차원 등급은 강화 재료와 골드가 세 배
  const k = e.grade >= GRADE.dimension ? 3 : 1;
  return { item: p >= 5 ? TIER_MANA_PLATE[e.tier - 1] : TIER_PLATE[e.tier - 1], count: (p >= 5 ? 1 + Math.floor((p - 5) / 2) : 1 + Math.floor(p / 3)) * k, gold: 50 * (p + 1) * e.tier * k, rate: rates[p] };
}

// ---- 내구도와 수리 ----
export const EQUIP_MAX_DUR = 100;
export const TOOL_MAX_DUR = 150;

export function durability(e: Equip): number {
  return e.dur ?? EQUIP_MAX_DUR;
}

const REPAIR_ORE = ['copper_ore', 'iron_ore', 'gold_ore', 'diamond_ore', 'titanium_ore', 'orichalcum_ore', 'dim_ore'];
const REPAIR_INGOT = ['copper_ingot', 'iron_ingot', 'gold_ingot', 'diamond', 'titanium_ingot', 'orichalcum_ingot', 'dim_ingot'];

/**
 * 수리 재료: 장비와 같은 재질. 강화 단계가 높을수록 더 가공된 재료가 든다.
 * +0~2 광석 · +3~5 주괴 · +6~8 판 · +9~10 마력판 (구리 장비 → 구리광석 / 구리 주괴 / 구리판 / 마력 구리판)
 */
export function repairMaterial(tier: number, plus: number): { id: string; per: number } {
  const t = Math.min(7, Math.max(1, tier)) - 1;
  if (plus <= 2) return { id: REPAIR_ORE[t], per: 10 };
  if (plus <= 5) return { id: REPAIR_INGOT[t], per: 20 };
  if (plus <= 8) return { id: TIER_PLATE[t], per: 35 };
  return { id: TIER_MANA_PLATE[t], per: 50 };
}

export function repairCost(e: Equip): { ore: string; count: number; gold: number } | null {
  const missing = EQUIP_MAX_DUR - durability(e);
  if (missing <= 0) return null;
  const m = repairMaterial(e.tier, e.plus);
  return { ore: m.id, count: Math.ceil(missing / m.per), gold: Math.round(missing * e.tier * 1.5) };
}

export function toolRepairCost(dur: number): { ore: string; count: number; gold: number } | null {
  const missing = TOOL_MAX_DUR - dur;
  if (missing <= 0) return null;
  return { ore: 'copper_ore', count: Math.ceil(missing / 15), gold: missing };
}
