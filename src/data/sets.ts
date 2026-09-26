import type { SpecialLine } from './special';
import type { EquipSlot } from './equipment';

/**
 * 세트 장비 (v10): 7단계 장비보다 한 단계 위(능력치 ×1.4)의 최상위 장비.
 * 새 재료 없이 얻는다 — ???에게서 바꾼 문장으로 대장간에서 만들거나(원하는 세트·부위),
 * 7단계 유니크 이상 장비 셋을 합성하거나(무작위 세트), 8장·레이드 보스가 떨어뜨린다.
 * 같은 세트를 2·4·6부위 입으면 세트 효과가 붙는다 (무기 포함 7부위).
 */
export type SetId = 'breaker' | 'guard' | 'swift' | 'pact';

export interface SetDef {
  id: SetId;
  name: string;
  /** 문장 아이템 id */
  token: string;
  color: number;
  /** 어울리는 역할 */
  role: string;
  /** 2·4·6부위 효과 */
  tiers: { n: number; lines: SpecialLine[] }[];
}

export const SETS: Record<SetId, SetDef> = {
  breaker: {
    id: 'breaker',
    name: '균열 파괴자',
    token: 'set_breaker',
    color: 0xff6a4a,
    role: '공격',
    tiers: [
      { n: 2, lines: [{ k: 'atk', v: 8 }] },
      { n: 4, lines: [{ k: 'critDmg', v: 30 }, { k: 'crit', v: 5 }] },
      { n: 6, lines: [{ k: 'skillDmg', v: 30 }, { k: 'bossDmg', v: 10 }] },
    ],
  },
  guard: {
    id: 'guard',
    name: '영겁 수호',
    token: 'set_guard',
    color: 0x6ab0ff,
    role: '방어',
    tiers: [
      { n: 2, lines: [{ k: 'hp', v: 12 }] },
      { n: 4, lines: [{ k: 'dmgReduce', v: 8 }, { k: 'def', v: 15 }] },
      { n: 6, lines: [{ k: 'lowGuard', v: 25 }, { k: 'regen', v: 0.6 }, { k: 'atk', v: 8 }] },
    ],
  },
  swift: {
    id: 'swift',
    name: '차원 질주',
    token: 'set_swift',
    color: 0x7affb0,
    role: '속도',
    tiers: [
      { n: 2, lines: [{ k: 'speed', v: 8 }] },
      { n: 4, lines: [{ k: 'move', v: 10 }, { k: 'dodgeCharge', v: 1 }] },
      { n: 6, lines: [{ k: 'dodgeBuff', v: 35 }, { k: 'double', v: 12 }] },
    ],
  },
  pact: {
    id: 'pact',
    name: '계약의 서약',
    token: 'set_pact',
    color: 0xc08aff,
    role: '소환',
    tiers: [
      { n: 2, lines: [{ k: 'summonDmg', v: 20 }] },
      { n: 4, lines: [{ k: 'summonCount', v: 1 }, { k: 'mpRegen', v: 0.4 }] },
      { n: 6, lines: [{ k: 'summonDmg', v: 40 }, { k: 'skillDmg', v: 15 }] },
    ],
  },
};
export const SET_IDS = Object.keys(SETS) as SetId[];

/** 세트 장비의 능력치 배율 (7단계 장비 기준) */
export const SET_STAT_MULT = 1.4;

/** 입은 장비의 세트별 부위 수 */
export function setCounts(equips: ({ set?: SetId } | undefined)[]): Partial<Record<SetId, number>> {
  const out: Partial<Record<SetId, number>> = {};
  for (const e of equips) if (e?.set) out[e.set] = (out[e.set] ?? 0) + 1;
  return out;
}

/** 입은 세트 효과 (특수 옵션 줄로) */
export function setLines(counts: Partial<Record<SetId, number>>): SpecialLine[] {
  const out: SpecialLine[] = [];
  for (const [id, n] of Object.entries(counts) as [SetId, number][]) for (const t of SETS[id].tiers) if (n >= t.n) out.push(...t.lines);
  return out;
}

/** 세트 제작 비용: 문장 3 + 골드 + 7단계 최상위 재료 (새 재료는 없다) */
export function setCraftCost(set: SetId, slot: EquipSlot): { gold: number; items: Record<string, number> } {
  const w = slot === 'weapon' ? 2 : 1;
  return { gold: 200000 * w, items: { [SETS[set].token]: 3 * w, dim_plate: 10 * w, mana_dim_plate: 4 * w, essence_dim: 6 * w, dim_shard: 5 * w } };
}

/** 세트 합성: 같은 부위의 7단계 유니크 이상 장비 3개 → 그 부위의 무작위 세트 장비 */
export const SYNTH_COUNT = 3;
export const SYNTH_MIN_GRADE = 4;
export function synthCost(slot: EquipSlot): { gold: number; items: Record<string, number> } {
  return { gold: slot === 'weapon' ? 200000 : 100000, items: { dim_shard: 3, essence_dim: 3 } };
}

/** 만든 세트 장비의 등급: 전설 85% · 차원 15% */
export function rollSetGrade(r: number): number {
  return r < 0.15 ? 6 : 5;
}
