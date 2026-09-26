/** 몬스터 행동 유형 (공격 패턴) */
export type Archetype =
  | 'melee'
  | 'ranged'
  | 'charger'
  | 'bomber'
  | 'tank'
  /** 광전사: 두 번 베고 회전 베기, 피가 적으면 격노 */
  | 'brute'
  /** 궁수: 세 발씩 흩어 쏘기, 거리를 벌린다 */
  | 'archer'
  /** 암살자: 뒤로 순간이동해 빠르게 벤다 */
  | 'assassin'
  /** 강령술사: 해골을 불러내고 저주 구슬을 쏜다 */
  | 'necro'
  /** 주술사: 주변 몬스터를 치유하고 발밑에 마법을 떨어뜨린다 */
  | 'shaman'
  /** 마녀: 플레이어 주변 여러 곳에 마법을 떨어뜨린다 */
  | 'caster'
  /** 떼: 약하고 빠르며 무리로 몰려온다 */
  | 'swarm'
  /** 독 뱉기: 바닥에 한동안 남는 독 웅덩이 */
  | 'spitter'
  /** 방패병: 정면 공격을 막고 찌르기·방패 밀치기 */
  | 'knight';

export interface ArchetypeDef {
  hp: number;
  atk: number;
  def: number;
  speed: number;
  radius: number;
  /** 공격을 시작하는 거리 */
  range: number;
  /** 공격 예고 시간 */
  windup: number;
  recover: number;
  exp: number;
}

export const ARCHETYPES: Record<Archetype, ArchetypeDef> = {
  melee: { hp: 80, atk: 9, def: 2, speed: 3.6, radius: 0.5, range: 1.9, windup: 0.6, recover: 0.7, exp: 6 },
  ranged: { hp: 56, atk: 8, def: 1, speed: 2.8, radius: 0.45, range: 9, windup: 0.8, recover: 1.2, exp: 7 },
  charger: { hp: 92, atk: 12, def: 2, speed: 3.2, radius: 0.55, range: 7, windup: 0.9, recover: 1.1, exp: 8 },
  bomber: { hp: 36, atk: 22, def: 0, speed: 4.4, radius: 0.45, range: 1.8, windup: 0.9, recover: 0, exp: 5 },
  tank: { hp: 220, atk: 16, def: 6, speed: 2.1, radius: 0.8, range: 2.6, windup: 1.1, recover: 1.2, exp: 12 },
  brute: { hp: 130, atk: 13, def: 3, speed: 3.3, radius: 0.6, range: 2.3, windup: 0.55, recover: 0.8, exp: 10 },
  archer: { hp: 50, atk: 7, def: 1, speed: 3.0, radius: 0.45, range: 10, windup: 0.75, recover: 1.1, exp: 7 },
  assassin: { hp: 60, atk: 11, def: 1, speed: 4.4, radius: 0.45, range: 1.9, windup: 0.4, recover: 0.9, exp: 9 },
  necro: { hp: 70, atk: 8, def: 1, speed: 2.6, radius: 0.5, range: 9, windup: 0.9, recover: 1.4, exp: 11 },
  shaman: { hp: 72, atk: 9, def: 2, speed: 2.7, radius: 0.5, range: 8, windup: 1.0, recover: 1.4, exp: 10 },
  caster: { hp: 58, atk: 9, def: 1, speed: 2.8, radius: 0.45, range: 9, windup: 1.1, recover: 1.6, exp: 9 },
  swarm: { hp: 24, atk: 5, def: 0, speed: 5.0, radius: 0.35, range: 1.4, windup: 0.35, recover: 0.6, exp: 2 },
  spitter: { hp: 66, atk: 8, def: 1, speed: 3.2, radius: 0.6, range: 7, windup: 0.9, recover: 1.3, exp: 8 },
  knight: { hp: 150, atk: 12, def: 5, speed: 2.6, radius: 0.55, range: 3.2, windup: 0.75, recover: 1.0, exp: 12 },
};

export const BOSS_NAMES = [
  '고대 숲의 수호수',
  '협곡의 폭군',
  '빙결 여제',
  '수정 심장',
  '폭주한 마공 거신',
  '용암 군주',
  '틈새의 파수꾼',
];

export const MIDBOSS_NAMES = [
  '이끼 파수꾼',
  '협곡 우두머리',
  '서리 파수꾼',
  '수정 파수꾼',
  '경비 거신',
  '용암 파수꾼',
  '틈새의 문지기',
];

/** 1-1부터 이어지는 진행도 (1-1 = 1, 1-10 = 10, 2-1 = 11, … 7-10 = 70) */
export function progressIndex(tier: number, stage: number): number {
  return (tier - 1) * 10 + stage;
}

/**
 * 단계·방에 따른 몬스터 능력치 배율. 진행도를 따라 끊김 없이 오른다 —
 * 다음 단계의 첫 방이 이전 단계의 마지막 방보다 항상 강하다 (예전에는 1-9가 3-1보다 셌다).
 * X-10(수호자 방)의 값은 예전과 같아서 보스 난이도 기준은 그대로다.
 */
export function tierScale(tier: number, stage: number): { hp: number; atk: number; def: number } {
  const g = progressIndex(tier, stage);
  if (g < 10) return { hp: 1 + (g - 1) * 0.18, atk: 1 + (g - 1) * 0.1, def: 1 + (g - 1) * 0.05 };
  const k = (g - 10) / 10;
  return { hp: 2.62 * Math.pow(2.1, k), atk: 1.9 * Math.pow(1.8, k), def: 1.45 * Math.pow(1.3, k) };
}

/** 경험치 배율 (진행도 기준). 한 단계 넘어갈 때마다 확실히 늘어난다 */
export function expScale(tier: number, stage: number): number {
  const g = progressIndex(tier, stage);
  return g < 10 ? 1 + (g - 1) * 0.15 : 2.35 * Math.pow(g / 10, 1.6);
}

/**
 * 레벨에 비해 낮은 단계에서 사냥할 때 경험치 배율 (10레벨 단위).
 * 단계 T의 적정 레벨은 ~10T+9. 그보다 10레벨 위부터 50% → 25% → 10%. 7단계(마지막 단계)는 줄지 않는다
 */
export const LOW_STAGE_EXP = [1, 0.5, 0.25, 0.1];
export function lowStageExpMult(level: number, tier: number): number {
  if (tier >= 7) return 1;
  const gap = Math.floor((level - 10 * tier) / 10);
  return LOW_STAGE_EXP[Math.min(LOW_STAGE_EXP.length - 1, Math.max(0, gap))];
}

/** 골드 배율 (진행도 기준) */
export function goldScale(tier: number, stage: number): number {
  const g = progressIndex(tier, stage);
  return g < 10 ? 1 + (g - 1) * 0.15 : 2.35 * (g / 10);
}

/**
 * 몬스터 공격력 배율 (진행도 기준). 예전에는 높은 단계일수록 방어력에 막혀 한 대가 체력의 1%도 안 되었다.
 * 그 단계 장비 기준으로 일반 몬스터 한 대 ≈ 체력 3~5%(앞쪽 방) ~ 7~9%(깊은 방), 보스 기본 공격 ≈ 12~25%.
 */
export function monsterAtkMult(tier: number, stage = 10): number {
  const g = progressIndex(Math.min(7, Math.max(1, tier)), stage);
  return 1.6 + 0.025 * Math.max(0, g - 10);
}

/** 플레이어 방어 계산의 기준값 (단계별): 받는 피해 = 피해 × K / (K + 방어력). 단계가 오를수록 커져 방어력이 그 단계에 맞게 작동한다 */
const DEF_K = [150, 150, 160, 180, 210, 250, 300];
export function playerDefK(tier: number): number {
  return DEF_K[Math.min(7, Math.max(1, Math.round(tier))) - 1];
}

/**
 * 엔드 콘텐츠(무한의 탑·보스 러시·심연 균열)용 몬스터 능력치 조정.
 * statTier/statStage: 능력치를 이 단계·방 기준으로 (모습·패턴은 원래 단계 그대로), hp/atk/speed: 추가 배율
 */
export interface MonsterMods {
  statTier?: number;
  statStage?: number;
  hp?: number;
  atk?: number;
  speed?: number;
  /** 주간 시련 보스: 보호막 기믹 없이 체력 10줄, 한 줄(10%) 깎일 때마다 격노 단계가 올라 패턴이 강해진다 */
  trial?: boolean;
}

/** 주간 시련 격노 한 단계당: 공격 +12% · 이동 +3% · 패턴 사이 쉬는 시간 -6% */
export const TRIAL_RAGE = { atk: 0.12, speed: 0.03, rest: 0.06 };

/** 보스 제한 시간 (초) */
export const BOSS_TIME_LIMIT = 300;
/** 보스를 쓰러뜨린 뒤 다시 나타나기까지 (밀리초): 파수꾼 1시간, 챕터 수호자 4시간 */
export const BOSS_RESPAWN_MS = { midboss: 60 * 60 * 1000, boss: 4 * 60 * 60 * 1000 };
/** 채집 특화 맵(벌목지·광맥지): 어느 단계든 한 번 들어가면 30분 뒤에 다시 들어갈 수 있다 (종류마다 따로) */
export const FARM_COOLDOWN_MS = 30 * 60 * 1000;
export const FARM_NAMES = { wood: '벌목지', ore: '광맥지', gold: '황금 보고' } as const;

/** 황금 보고: 금화 더미 하나를 다 부쉈을 때 골드 (단계가 높을수록 많다. 7단계 한 판 ≈ 18만 G) */
export function vaultPileGold(tier: number, r: number): number {
  return Math.round(35 * tier * goldScale(tier, 10) * (0.75 + r * 0.5));
}
