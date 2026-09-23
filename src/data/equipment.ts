import type { Rng } from '../core/rng';
import { CLASSES, type ClassId } from './classes';

export type EquipSlot = 'weapon' | 'armor' | 'accessory';

export interface Equip {
  uid: string;
  slot: EquipSlot;
  /** 무기만: 어느 직업의 무기인지 */
  cls?: ClassId;
  tier: number;
  grade: number;
  plus: number;
}

export const GRADES = [
  { name: '일반', color: 0xd8dce6, mult: 1 },
  { name: '고급', color: 0x6fe07a, mult: 1.2 },
  { name: '희귀', color: 0x5aa8ff, mult: 1.45 },
  { name: '영웅', color: 0xc07aff, mult: 1.75 },
  { name: '전설', color: 0xffa53a, mult: 2.1 },
];

const MATERIAL = ['철', '구리', '은', '수정', '마공', '흑요석', '차원'];

export function equipName(e: Equip): string {
  const mat = MATERIAL[e.tier - 1];
  const noun = e.slot === 'weapon' ? CLASSES[e.cls ?? 'sword'].weaponNoun : e.slot === 'armor' ? '갑옷' : '반지';
  return `${mat} ${noun}${e.plus > 0 ? ` +${e.plus}` : ''}`;
}

export interface EquipStats {
  atk: number;
  def: number;
  hp: number;
  crit: number;
}

export function equipStats(e: Equip): EquipStats {
  const m = GRADES[e.grade].mult * (1 + e.plus * 0.12);
  const t = e.tier;
  switch (e.slot) {
    case 'weapon':
      return { atk: Math.round(7 * t * m + 3), def: 0, hp: 0, crit: 0 };
    case 'armor':
      return { atk: 0, def: Math.round(3 * t * m + 1), hp: Math.round(22 * t * m), crit: 0 };
    case 'accessory':
      return { atk: Math.round(2 * t * m), def: Math.round(1.5 * t * m), hp: 0, crit: Math.round((2 + e.grade * 1.5) * (1 + e.plus * 0.08)) };
  }
}

let uidCounter = 0;
export function newUid(): string {
  uidCounter++;
  return `${Date.now().toString(36)}${uidCounter.toString(36)}${Math.floor(Math.random() * 1e6).toString(36)}`;
}

/** 던전 드롭 장비 생성. bonus가 클수록 좋은 등급이 나온다 */
export function rollEquip(rng: Rng, tier: number, cls: ClassId, bonus: number): Equip {
  const r = rng.next() - bonus;
  const grade = r < 0.03 ? 4 : r < 0.1 ? 3 : r < 0.25 ? 2 : r < 0.5 ? 1 : 0;
  const slotRoll = rng.next();
  const slot: EquipSlot = slotRoll < 0.45 ? 'weapon' : slotRoll < 0.8 ? 'armor' : 'accessory';
  return { uid: newUid(), slot, cls: slot === 'weapon' ? cls : undefined, tier, grade: Math.max(0, grade), plus: 0 };
}

export function equipValue(e: Equip): number {
  return Math.round(20 * e.tier * GRADES[e.grade].mult * (1 + e.plus * 0.3));
}

/** 강화: 성공 확률, 필요 강화석, 골드 */
export function enhanceCost(e: Equip): { stone: string; count: number; gold: number; rate: number } | null {
  if (e.plus >= 10) return null;
  const p = e.plus;
  const stone = p < 3 ? 'stone_low' : p < 6 ? 'stone_mid' : 'stone_high';
  const rates = [1, 0.95, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2];
  return { stone, count: 1 + Math.floor((p % 3) / 1.5), gold: 50 * (p + 1) * e.tier, rate: rates[p] };
}
