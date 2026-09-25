import type { DebuffId } from './species';

/**
 * 엔딩 이후 콘텐츠 (차원의 끝): 무한의 탑 · 보스 러시 · 심연 균열.
 * 파밍으로 얻는 최상위 재료는 '차원 가루' 하나로 통일한다.
 * 가루는 차원집의 차원 응축기에서 차원 파편(궁극기 강화·각인)이나 차원 마력 정수(최고 연료)로 가공한다.
 */

export const DUST = 'dim_dust';
export const SHARD = 'dim_shard';
/** 차원 파편 하나에 드는 가루 */
export const DUST_PER_SHARD = 8;
/** 공장에서 여러 단계 판을 섞어 만드는 엔드 콘텐츠 입장 재료 */
export const ALLOY = 'dim_alloy';

// ---------------- 무한의 탑 ----------------

/**
 * 층별 몬스터 배율 (7-1 기준).
 * 1~10층은 층마다 +5%로 서서히 오르고, 11층부터는 층마다 +3%에 10층마다(11·21·31…층) 한 번에 +15% 계단이 생긴다.
 */
export function towerMult(floor: number): number {
  const f = Math.max(1, Math.floor(floor));
  let m = Math.pow(1.05, Math.min(f, 10) - 1);
  if (f > 10) m *= Math.pow(1.03, f - 10) * Math.pow(1.15, Math.floor((f - 1) / 10));
  return m;
}

/** 탑 층의 보스: 10층마다 수호자, 5층마다 파수꾼. 몇 단계 보스의 모습인지 (1~7을 돌아가며) */
export function towerBoss(floor: number): { kind: 'boss' | 'midboss'; tier: number } | null {
  if (floor % 10 === 0) return { kind: 'boss', tier: ((floor / 10 - 1) % 7) + 1 };
  if (floor % 5 === 0) return { kind: 'midboss', tier: ((Math.floor(floor / 5) - 1) % 7) + 1 };
  return null;
}

/** 층의 테마(맵 모습): 10층마다 다음 단계 테마 */
export function towerTheme(floor: number): number {
  return (Math.floor((floor - 1) / 10) % 7) + 1;
}

/** 층을 처음 깼을 때 받는 보상 */
export function towerFirstClear(floor: number): { gold: number; dust: number } {
  const dust = floor % 10 === 0 ? (2 + Math.floor(floor / 20)) * 8 : floor % 5 === 0 ? 8 : 2;
  return { gold: 400 + floor * 150, dust };
}

/** 하루 한 번 받는 탑 소탕 보상 (최고 층 기준) */
export function towerDaily(best: number): { gold: number; dust: number } {
  return { gold: best * 300, dust: Math.floor(best / 10) * 8 + Math.floor(best / 2) };
}

/** 이어서 도전할 수 있는 층: 최고 기록의 10층 단위 체크포인트 다음 층 */
export function towerStartFloor(best: number): number {
  return Math.floor(best / 10) * 10 + 1;
}

// ---------------- 보스 러시 ----------------

export type RushDiff = 0 | 1 | 2;
export const RUSH_DIFFS = [
  { name: '일반', desc: '각 보스가 원래 단계의 힘으로 나온다', hp: 1, atk: 1, statTier: 0 },
  { name: '하드', desc: '모든 보스가 7단계의 힘으로 나온다', hp: 1, atk: 1, statTier: 7 },
  { name: '지옥', desc: '7단계의 힘에 체력 ×2, 공격력 ×1.6', hp: 2, atk: 1.6, statTier: 7 },
] as const;

/** 보스 러시 순서: 1단계 파수꾼 → 1단계 수호자 → … → 7단계 수호자 (14번) */
export const RUSH_ORDER: { tier: number; kind: 'midboss' | 'boss' }[] = Array.from({ length: 14 }, (_, i) => ({ tier: Math.floor(i / 2) + 1, kind: i % 2 ? 'boss' : 'midboss' }));

/** 하루 무료 도전 횟수. 더 하려면 차원 합금 */
export const RUSH_DAILY = 3;
export const RUSH_EXTRA_ALLOY = 2;

/** 걸린 시간(초)에 따른 등급 */
export function rushGrade(seconds: number): 'S' | 'A' | 'B' | 'C' {
  return seconds <= 600 ? 'S' : seconds <= 900 ? 'A' : seconds <= 1200 ? 'B' : 'C';
}

export function rushReward(diff: RushDiff, grade: 'S' | 'A' | 'B' | 'C'): { gold: number; dust: number } {
  const g = { S: 0, A: 1, B: 2, C: 3 }[grade];
  const dust = [
    [32, 24, 16, 8],
    [64, 48, 32, 16],
    [112, 80, 56, 32],
  ][diff][g];
  return { gold: [20000, 60000, 150000][diff] * (1 - g * 0.2), dust };
}

// ---------------- 심연 균열 ----------------

export type AffixId = 'fortified' | 'enraged' | 'haste' | 'volatile' | 'frost' | 'swarm' | 'elite';

export const AFFIXES: Record<AffixId, { name: string; text: string; color: number; debuff?: DebuffId }> = {
  fortified: { name: '강철 피부', text: '몬스터 체력 +30%', color: 0xb5bcc8 },
  enraged: { name: '광폭', text: '몬스터 공격력 +25%', color: 0xff5a4a },
  haste: { name: '신속', text: '몬스터 이동 속도 +20%', color: 0x7affc0 },
  volatile: { name: '불안정', text: '몬스터가 쓰러진 자리가 잠시 폭발한다', color: 0xff9a2a },
  frost: { name: '서리 바닥', text: '8초마다 발밑에 둔화 서리가 깔린다', color: 0x9fe3ff, debuff: 'slow' },
  swarm: { name: '대군', text: '몬스터 수 +40%', color: 0xc8a0ff },
  elite: { name: '정예 군단', text: '일반 몬스터 일부가 정예로 나온다', color: 0xffd23a },
};
export const AFFIX_IDS = Object.keys(AFFIXES) as AffixId[];

/** 균열 단계의 몬스터 배율 (7-1 기준, 단계마다 +12%) */
export function riftMult(level: number): number {
  return Math.pow(1.12, Math.max(1, level) - 1);
}

/** 균열 단계에 붙는 변이 수: 1단계 0 · 2~3단계 1 · 4~6단계 2 · 7~9단계 3 · 10단계부터 4 */
export function riftAffixCount(level: number): number {
  return level <= 1 ? 0 : level <= 3 ? 1 : level <= 6 ? 2 : level <= 9 ? 3 : 4;
}

/** 균열 변이: 날짜와 단계로 정해진다 (그날은 같은 단계면 같은 변이) */
export function riftAffixes(level: number, dayKey: string): AffixId[] {
  let h = 2166136261 ^ level;
  for (let i = 0; i < dayKey.length; i++) h = Math.imul(h ^ dayKey.charCodeAt(i), 16777619);
  const ids = [...AFFIX_IDS];
  const out: AffixId[] = [];
  for (let i = 0; i < riftAffixCount(level); i++) {
    h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0;
    out.push(ids.splice(h % ids.length, 1)[0]);
  }
  return out;
}

/** 균열 제한 시간(초) */
export const RIFT_TIME = 300;
/** 균열 입장: 차원 합금 1개 */
export const RIFT_ALLOY = 1;

/** 균열 채집 배율: 단계마다 +10% (광맥·나무에서 더 많이) */
export function riftYield(level: number): number {
  return 1 + 0.1 * level;
}

/** 균열 클리어 보상. 시간 안에 깨면 다음 단계가 열린다 */
export function riftReward(level: number, inTime: boolean): { gold: number; dust: number } {
  const full = { gold: 3000 + level * 1500, dust: 8 + level * 3 };
  return inTime ? full : { gold: Math.round(full.gold / 2), dust: Math.floor(full.dust / 2) };
}

/** 균열의 장비 행운 보너스 (좋은 등급 확률) */
export function riftLuck(level: number): number {
  return 0.02 * level;
}

// ---------------- 공통 ----------------

/** 엔드 콘텐츠 진행 기록 (저장) */
export interface EndgameState {
  towerBest: number;
  /** 탑 소탕 보상을 받은 날 */
  towerDailyDate?: string;
  rushDate?: string;
  rushUsed: number;
  /** 난이도별 최고 기록(초). 0 = 기록 없음 */
  rushBest: number[];
  /** 난이도별 최고 등급 */
  rushGradeBest: string[];
  /** 심연 균열: 시간 안에 깬 가장 높은 단계 */
  riftBest: number;
}

export function newEndgame(): EndgameState {
  return { towerBest: 0, rushUsed: 0, rushBest: [0, 0, 0], rushGradeBest: ['', '', ''], riftBest: 0 };
}

/** 엔드 콘텐츠 한 판의 종류 */
export type EndRun =
  | { kind: 'tower'; floor: number }
  | { kind: 'rush'; diff: RushDiff; index: number }
  | { kind: 'rift'; tier: number; level: number; affixes: AffixId[]; timeLeft: number };

/** 초 → "m:ss" */
export function formatClock(seconds: number): string {
  const t = Math.max(0, Math.round(seconds));
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
}
