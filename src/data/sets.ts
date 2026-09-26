import type { SpecialLine } from './special';
import type { EquipSlot } from './equipment';
import type { ClassId } from './classes';

/**
 * 세트 장비 (v10.1): 직업마다 공격형 · 방어형 · 균형형 세 가지.
 * ???에게서 받은 「세트 설계도」로 차원집 제작대(세트 탭)에서 만든다 — 직업과 부위는 고르지만,
 * 그 직업의 세 세트 중 어느 것이 나올지는 무작위라 한 세트 7부위를 다 모으기는 쉽지 않다.
 * 한 부위만 보면 최종 장비(7단계 차원 +10)보다 약하고(능력치 ×0.9), 세트를 모을수록(2·4·7부위) 강해진다.
 */
export type SetType = 'atk' | 'def' | 'bal';
export type SetId =
  | 'sword_atk' | 'sword_def' | 'sword_bal'
  | 'mage_atk' | 'mage_def' | 'mage_bal'
  | 'archer_atk' | 'archer_def' | 'archer_bal'
  | 'summoner_atk' | 'summoner_def' | 'summoner_bal';

export interface SetDef {
  id: SetId;
  cls: ClassId;
  type: SetType;
  name: string;
  color: number;
  /** 2·4·7부위 효과 */
  tiers: { n: number; lines: SpecialLine[] }[];
}

export const SET_TYPE_NAMES: Record<SetType, string> = { atk: '공격형', def: '방어형', bal: '균형형' };

const S = (id: SetId, cls: ClassId, type: SetType, name: string, color: number, t2: SpecialLine[], t4: SpecialLine[], t7: SpecialLine[]): SetDef => ({
  id,
  cls,
  type,
  name,
  color,
  tiers: [
    { n: 2, lines: t2 },
    { n: 4, lines: t4 },
    { n: 7, lines: t7 },
  ],
});

export const SETS: Record<SetId, SetDef> = {
  // ---- 검사 ----
  sword_atk: S('sword_atk', 'sword', 'atk', '광전사의 분노', 0xff5a4a,
    [{ k: 'atk', v: 8 }],
    [{ k: 'critDmg', v: 30 }, { k: 'lifesteal', v: 1.5 }],
    [{ k: 'skillDmg', v: 35 }, { k: 'double', v: 15 }, { k: 'bossDmg', v: 12 }]),
  sword_def: S('sword_def', 'sword', 'def', '철벽의 맹세', 0x6ab0ff,
    [{ k: 'hp', v: 12 }],
    [{ k: 'dmgReduce', v: 8 }, { k: 'def', v: 20 }],
    [{ k: 'lowGuard', v: 30 }, { k: 'regen', v: 0.8 }, { k: 'hitHeal', v: 10 }, { k: 'atk', v: 10 }]),
  sword_bal: S('sword_bal', 'sword', 'bal', '검성의 길', 0xffd86a,
    [{ k: 'atk', v: 5 }, { k: 'hp', v: 6 }],
    [{ k: 'speed', v: 8 }, { k: 'crit', v: 4 }],
    [{ k: 'skillDmg', v: 20 }, { k: 'dmgReduce', v: 6 }, { k: 'killHeal', v: 3 }, { k: 'cdr', v: 6 }]),
  // ---- 마법사 ----
  mage_atk: S('mage_atk', 'mage', 'atk', '대마법사의 광휘', 0xff6ae0,
    [{ k: 'atk', v: 8 }],
    [{ k: 'critDmg', v: 30 }, { k: 'arcBurst', v: 10 }],
    [{ k: 'skillDmg', v: 40 }, { k: 'ult', v: 20 }, { k: 'bossDmg', v: 12 }]),
  mage_def: S('mage_def', 'mage', 'def', '결계술사의 장막', 0x7fd6ff,
    [{ k: 'hp', v: 10 }, { k: 'mp', v: 10 }],
    [{ k: 'dmgReduce', v: 8 }, { k: 'mpRegen', v: 0.4 }],
    [{ k: 'lowGuard', v: 30 }, { k: 'regen', v: 0.6 }, { k: 'dodge', v: 8 }, { k: 'atk', v: 10 }]),
  mage_bal: S('mage_bal', 'mage', 'bal', '현자의 순환', 0xc8a8ff,
    [{ k: 'cdr', v: 5 }],
    [{ k: 'mpOnHit', v: 0.6 }, { k: 'killMp', v: 4 }, { k: 'atk', v: 5 }],
    [{ k: 'skillDmg', v: 25 }, { k: 'cdOnHit', v: 10 }, { k: 'hp', v: 10 }]),
  // ---- 궁수 ----
  archer_atk: S('archer_atk', 'archer', 'atk', '사냥꾼의 표적', 0xffa04a,
    [{ k: 'crit', v: 5 }],
    [{ k: 'critDmg', v: 35 }, { k: 'execute', v: 12 }],
    [{ k: 'double', v: 20 }, { k: 'bossDmg', v: 15 }, { k: 'skillDmg', v: 25 }]),
  archer_def: S('archer_def', 'archer', 'def', '바람의 가호', 0x7affd0,
    [{ k: 'dodge', v: 6 }],
    [{ k: 'dodgeCharge', v: 1 }, { k: 'move', v: 8 }, { k: 'hp', v: 8 }],
    [{ k: 'dodgeBuff', v: 30 }, { k: 'dmgReduce', v: 10 }, { k: 'regen', v: 0.5 }, { k: 'atk', v: 8 }]),
  archer_bal: S('archer_bal', 'archer', 'bal', '질풍의 궁술', 0xb8ff6a,
    [{ k: 'speed', v: 8 }],
    [{ k: 'hasteOnHit', v: 10 }, { k: 'swiftOnHit', v: 10 }, { k: 'atk', v: 5 }],
    [{ k: 'skillDmg', v: 20 }, { k: 'crit', v: 6 }, { k: 'hp', v: 10 }, { k: 'dodge', v: 6 }]),
  // ---- 차원 소환사 ----
  summoner_atk: S('summoner_atk', 'summoner', 'atk', '군주의 계약', 0xff4af0,
    [{ k: 'summonDmg', v: 20 }],
    [{ k: 'summonCount', v: 1 }, { k: 'atk', v: 5 }],
    [{ k: 'summonDmg', v: 45 }, { k: 'skillDmg', v: 20 }, { k: 'bossDmg', v: 12 }]),
  summoner_def: S('summoner_def', 'summoner', 'def', '수호령의 계약', 0x8ab0ff,
    [{ k: 'hp', v: 12 }],
    [{ k: 'dmgReduce', v: 8 }, { k: 'regen', v: 0.5 }],
    [{ k: 'lowGuard', v: 30 }, { k: 'summonDmg', v: 25 }, { k: 'hitHeal', v: 10 }]),
  summoner_bal: S('summoner_bal', 'summoner', 'bal', '차원의 공명', 0xb67cff,
    [{ k: 'summonDmg', v: 10 }, { k: 'mp', v: 10 }],
    [{ k: 'cdr', v: 6 }, { k: 'mpRegen', v: 0.4 }],
    [{ k: 'summonCount', v: 1 }, { k: 'skillDmg', v: 20 }, { k: 'summonDmg', v: 20 }, { k: 'hp', v: 8 }]),
};
export const SET_IDS = Object.keys(SETS) as SetId[];

/** 그 직업의 세 세트 (공격형 · 방어형 · 균형형) */
export function setsOf(cls: ClassId): SetDef[] {
  return SET_IDS.map((id) => SETS[id]).filter((s) => s.cls === cls);
}

/** 제작할 때 그 직업의 세 세트 중 하나를 무작위로 */
export function rollClassSet(cls: ClassId, r: number): SetId {
  const list = setsOf(cls);
  return list[Math.floor(r * list.length) % list.length].id;
}

/** 세트 장비 한 부위의 능력치 배율: 최종 장비보다 조금 약하다 (세트 효과로 채운다) */
export const SET_STAT_MULT = 0.9;
/** 세트 장비 부위 수 (무기 포함) */
export const SET_PIECES = 7;
/** ???에게서 받는 세트 설계도 */
export const SET_TOKEN = 'set_blueprint';

/** 입은 장비의 세트별 부위 수 */
export function setCounts(equips: ({ set?: SetId } | undefined)[]): Partial<Record<SetId, number>> {
  const out: Partial<Record<SetId, number>> = {};
  for (const e of equips) if (e?.set && SETS[e.set]) out[e.set] = (out[e.set] ?? 0) + 1;
  return out;
}

/** 입은 세트 효과 (특수 옵션 줄로) */
export function setLines(counts: Partial<Record<SetId, number>>): SpecialLine[] {
  const out: SpecialLine[] = [];
  for (const [id, n] of Object.entries(counts) as [SetId, number][]) for (const t of SETS[id]?.tiers ?? []) if (n >= t.n) out.push(...t.lines);
  return out;
}

/** 세트 장비 제작 비용 (제작대): 설계도 1 + 골드 + 7단계 최상위 재료 (새 재료 없음) */
export function setCraftCost(slot: EquipSlot): { gold: number; items: Record<string, number> } {
  const w = slot === 'weapon' ? 2 : 1;
  return { gold: 150000 * w, items: { [SET_TOKEN]: w, dim_plate: 8 * w, mana_dim_plate: 3 * w, essence_dim: 5 * w, dim_shard: 4 * w } };
}

/** 만든 세트 장비의 등급: 전설 85% · 차원 15% */
export function rollSetGrade(r: number): number {
  return r < 0.15 ? 6 : 5;
}

/** 예전(v10.0) 세트 문장 → 설계도로 바꿀 때 쓰는 id */
export const OLD_SET_TOKENS = ['set_breaker', 'set_guard', 'set_swift', 'set_pact'];
