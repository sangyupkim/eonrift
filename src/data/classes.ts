export type ClassId = 'sword' | 'mage' | 'archer';

export type StatKey = 'str' | 'int' | 'dex' | 'vit' | 'mag';

export const STAT_INFO: Record<StatKey, { name: string; desc: string }> = {
  str: { name: '힘', desc: '물리 공격력 +0.5, 무기 위력 +0.67% (검사·궁수)' },
  int: { name: '지능', desc: '마법 공격력 +0.5, 무기 위력 +0.67% (마법사)' },
  dex: { name: '민첩', desc: '치명타 확률 +0.3%, 공격 속도 +0.5%' },
  vit: { name: '체력', desc: '최대 HP +10' },
  mag: { name: '마력', desc: '최대 MP +6' },
};
export const STAT_KEYS: StatKey[] = ['str', 'int', 'dex', 'vit', 'mag'];

export type BaseStats = Record<StatKey, number>;

export interface SkillDef {
  name: string;
  mp: number;
  cooldown: number;
  description: string;
}

export interface ClassDef {
  id: ClassId;
  name: string;
  short: string;
  /** 물리(힘) / 마법(지능) 중 어느 공격력을 쓰는지 */
  damage: 'physical' | 'magic';
  baseStats: BaseStats;
  baseHp: number;
  baseMp: number;
  /** 기본 공격 간격 (초) */
  attackTime: number;
  look: { tunic: number; tunicDark: number; hair: number; weapon: 'sword' | 'staff' | 'bow' };
  basic: string;
  skills: SkillDef[];
  weaponNoun: string;
}

/**
 * 궁극기: 직업마다 두 개. 수호자를 처음 쓰러뜨려 차원석을 얻으면 열린다
 * (첫 번째: 1-10 수호자 + Lv.15, 두 번째: 4-10 수호자 + Lv.35). 재사용 대기 60초
 */
export interface UltDef {
  name: string;
  mp: number;
  description: string;
  /** 이 단계 수호자의 차원석이 있으면 열린다 */
  stone: number;
  /** 그리고 이 직업 레벨이 되어야 열린다 */
  level: number;
}
export const ULT_COOLDOWN = 60;
/** 궁극기 최대 레벨 (차원 파편으로 강화) */
export const MAX_ULT_LEVEL = 5;
/** 궁극기 레벨별 위력 배율: 레벨마다 +25% */
export function ultPower(lv: number): number {
  return 1 + 0.25 * (Math.max(1, lv) - 1);
}
/** 궁극기 레벨별 재사용 대기 (레벨마다 -5초) */
export function ultCooldown(lv: number): number {
  return ULT_COOLDOWN - 5 * (Math.max(1, lv) - 1);
}
export const ULTIMATES: Record<ClassId, [UltDef, UltDef]> = {
  sword: [
    { name: '천검난무', mp: 30, stone: 1, level: 15, description: '2.4초 동안 칼날 폭풍이 되어 주변을 끊임없이 벤다. 그동안 피해를 받지 않는다.' },
    { name: '대지 붕괴', mp: 40, stone: 4, level: 35, description: '적에게 뛰어올라 내려찍어 넓은 범위에 큰 피해를 주고 2.5초 동안 기절시킨다.' },
  ],
  mage: [
    { name: '메테오', mp: 40, stone: 1, level: 15, description: '적이 모인 곳에 운석 세 개를 차례로 떨어뜨린다.' },
    { name: '절대영도', mp: 45, stone: 4, level: 35, description: '주변을 얼려 큰 피해를 주고 3초 동안 얼어붙게 한다.' },
  ],
  archer: [
    { name: '화살비', mp: 35, stone: 1, level: 15, description: '넓은 곳에 3초 동안 화살비를 퍼붓는다.' },
    { name: '용의 사격', mp: 40, stone: 4, level: 35, description: '힘을 모아 모든 것을 꿰뚫는 거대한 화살을 쏜다.' },
  ],
};

export const CLASSES: Record<ClassId, ClassDef> = {
  sword: {
    id: 'sword',
    name: '검사',
    short: '검',
    damage: 'physical',
    baseStats: { str: 10, int: 3, dex: 5, vit: 9, mag: 4 },
    baseHp: 60,
    baseMp: 26,
    attackTime: 0.36,
    look: { tunic: 0x2f6fd6, tunicDark: 0x2456a8, hair: 0x4a3024, weapon: 'sword' },
    basic: '3타 베기 콤보',
    weaponNoun: '검',
    skills: [
      { name: '돌진 베기', mp: 12, cooldown: 4, description: '앞으로 돌진하며 지나가는 적을 벤다.' },
      { name: '회전 베기', mp: 16, cooldown: 6, description: '주변의 모든 적을 벤다.' },
      { name: '대지 가르기', mp: 22, cooldown: 8, description: '앞으로 뻗어 나가는 충격파를 날린다.' },
      { name: '철벽 태세', mp: 18, cooldown: 18, description: '[방어] 8초 동안 받는 피해 -40%, 방어력 +60%.' },
      { name: '수호의 방패', mp: 20, cooldown: 16, description: '[방어] 12초 동안 적의 공격을 3회 완전히 막는다.' },
      { name: '전투 함성', mp: 24, cooldown: 24, description: '[보조] 10초 동안 공격력 +25%, 공격 속도 +15%. HP 15% 회복.' },
    ],
  },
  mage: {
    id: 'mage',
    name: '마법사',
    short: '마',
    damage: 'magic',
    baseStats: { str: 3, int: 11, dex: 5, vit: 5, mag: 10 },
    baseHp: 50,
    baseMp: 50,
    attackTime: 0.45,
    look: { tunic: 0x7a3fc4, tunicDark: 0x5a2c96, hair: 0xd8d0e8, weapon: 'staff' },
    basic: '마력탄',
    weaponNoun: '지팡이',
    skills: [
      { name: '화염구', mp: 16, cooldown: 3.5, description: '부딪히면 폭발하는 화염구를 던진다.' },
      { name: '얼음 장판', mp: 20, cooldown: 7, description: '적을 느리게 하고 계속 피해를 주는 얼음 장판을 깐다.' },
      { name: '번개 연쇄', mp: 24, cooldown: 6, description: '가까운 적들 사이로 번개가 튄다.' },
      { name: '마나 실드', mp: 15, cooldown: 20, description: '[방어] 15초 동안 받는 피해의 60%를 체력 대신 MP로 받는다.' },
      { name: '번개 폭풍', mp: 22, cooldown: 10, description: '2초 동안 주변 적들에게 번개를 여러 번 떨어뜨린다. 맞은 적은 잠깐 감전된다.' },
      { name: '마력 순환', mp: 0, cooldown: 30, description: '[보조] MP 40%와 HP 15%를 회복하고 10초 동안 공격력 +20%.' },
    ],
  },
  archer: {
    id: 'archer',
    name: '궁수',
    short: '궁',
    damage: 'physical',
    baseStats: { str: 8, int: 3, dex: 11, vit: 6, mag: 5 },
    baseHp: 55,
    baseMp: 35,
    attackTime: 0.3,
    look: { tunic: 0x3f9a4a, tunicDark: 0x2c7236, hair: 0xc9782e, weapon: 'bow' },
    basic: '화살 연사',
    weaponNoun: '활',
    skills: [
      { name: '관통 화살', mp: 12, cooldown: 3, description: '적을 꿰뚫는 강한 화살을 쏜다.' },
      { name: '부채꼴 연사', mp: 16, cooldown: 5, description: '다섯 발의 화살을 부채꼴로 쏜다.' },
      { name: '폭발 화살', mp: 16, cooldown: 6, description: '맞은 자리에서 크게 폭발하는 화살을 쏜다. 주변 적 모두에게 피해.' },
      { name: '바람 걸음', mp: 14, cooldown: 16, description: '[방어] 8초 동안 이동 속도 +40%, 적의 공격을 30% 확률로 회피.' },
      { name: '연막탄', mp: 18, cooldown: 18, description: '[방어] 6초 동안 받는 피해 -50%, 주변 적을 느리게 만든다.' },
      { name: '사냥꾼의 집중', mp: 20, cooldown: 24, description: '[보조] 10초 동안 치명타 +30%, 공격력 +15%.' },
    ],
  },
};

export const CLASS_ORDER: ClassId[] = ['sword', 'mage', 'archer'];

export const MAX_LEVEL = 99;
export const MAX_SKILL_LEVEL = 5;

export interface SkillCost {
  gold: number;
  level: number;
  items?: Record<string, number>;
}

/** 스킬 배우기: 필요 레벨·골드, 상위 스킬은 상위 재료도 (첫 스킬은 처음부터 안다) */
export const SKILL_LEARN: SkillCost[] = [
  { level: 1, gold: 0 },
  { level: 5, gold: 400 },
  { level: 10, gold: 1200, items: { copper_plate: 3 } },
  { level: 15, gold: 2500, items: { copper_plate: 5, mana_copper: 5 } },
  { level: 22, gold: 5000, items: { iron_plate: 5, mana_iron: 5 } },
  { level: 30, gold: 9000, items: { gold_plate: 5, mana_gold: 5 } },
];

const PLATES = ['copper_plate', 'iron_plate', 'gold_plate', 'diamond_plate', 'titanium_plate', 'orichalcum_plate', 'dim_plate'];

/** 스킬 강화 비용 (현재 레벨 → 다음 레벨). 높은 스킬·높은 레벨일수록 상위 판이 든다 */
export function skillUpgradeCost(index: number, lv: number): SkillCost {
  const tier = Math.min(7, 1 + Math.floor(index / 2) + Math.floor(lv / 2));
  return { gold: Math.round(250 * lv * lv * (index + 1)), level: SKILL_LEARN[index].level + lv * 4, items: { [PLATES[tier - 1]]: 1 + lv } };
}
export const POINTS_PER_LEVEL = 5;

export function expToNext(level: number): number {
  return Math.round(30 * Math.pow(level, 1.8) + 20);
}
