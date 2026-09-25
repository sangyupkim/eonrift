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
/** 높은 단계 입장 재료 (티타늄·오리하르콘판) */
export const ALLOY2 = 'dim_alloy2';

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
/** 보스 러시 입장 비용: 지옥은 매번 상급 차원 합금 1 (무료 횟수와 별개), 일반·하드는 하루 3번 뒤 차원 합금 2 */
export function rushEntry(diff: RushDiff, usedToday: number): Record<string, number> {
  if (diff === 2) return { [ALLOY2]: 1 };
  return usedToday >= RUSH_DAILY ? { [ALLOY]: RUSH_EXTRA_ALLOY } : {};
}

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
/** 균열 입장: 1~10단계 차원 합금 1개, 11단계부터 상급 차원 합금 1개 */
export const RIFT_ALLOY = 1;
export const RIFT_ALLOY2_FROM = 11;
export function riftEntry(level: number): { id: string; n: number } {
  return { id: level >= RIFT_ALLOY2_FROM ? ALLOY2 : ALLOY, n: RIFT_ALLOY };
}

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
  /** 주간 차원 시련 */
  trial?: TrialRecord;
}

export function newEndgame(): EndgameState {
  return { towerBest: 0, rushUsed: 0, rushBest: [0, 0, 0], rushGradeBest: ['', '', ''], riftBest: 0 };
}

/** 엔드 콘텐츠 한 판의 종류 */
export type EndRun =
  | { kind: 'tower'; floor: number }
  | { kind: 'rush'; diff: RushDiff; index: number }
  | { kind: 'rift'; tier: number; level: number; affixes: AffixId[]; timeLeft: number }
  | { kind: 'trial'; week: string; hits: number; potions: number; kills: number; combo: number; chain: number; lastKill: number };

/** 초 → "m:ss" */
export function formatClock(seconds: number): string {
  const t = Math.max(0, Math.round(seconds));
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
}

// ---------------- 주간 차원 시련 (기록형) ----------------

/**
 * 일주일마다 모두에게 같은 맵·몬스터·변이가 주어지고, 능력치는 고정 스펙으로 바뀐다 (장비·각인·초월 무시).
 * 실력으로 점수를 겨루고, 그 주의 최고 점수 등급에 따라 보상을 받는다.
 */
export const TRIAL_TIME = 900;

/** 월요일 기준 주 번호 ("2026-W39") */
export function weekKey(d = new Date()): string {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const y = t.getUTCFullYear();
  const w = Math.ceil(((t.getTime() - Date.UTC(y, 0, 1)) / 86400000 + 1) / 7);
  return `${y}-W${String(w).padStart(2, '0')}`;
}

function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

/** 이번 주 시련: 맵 시드, 테마(단계), 변이 2개 */
export function trialSpec(week: string): { seed: number; tier: number; affixes: AffixId[] } {
  const seed = hashStr(`trial:${week}`);
  const ids = AFFIX_IDS.filter((a) => a !== 'swarm');
  const a = ids[seed % ids.length];
  const rest = ids.filter((x) => x !== a);
  const b = rest[Math.floor(seed / 7) % rest.length];
  return { seed, tier: (seed % 7) + 1, affixes: [a, b] };
}

export interface TrialScore {
  total: number;
  base: number;
  timeBonus: number;
  hitPenalty: number;
  potionPenalty: number;
  comboBonus: number;
}

/** 점수: 클리어 10000 + 남은 시간×10 + 최고 연속 처치×25 − 피격×40 − 물약×400. 실패하면 처치 수×20 */
export function trialScore(cleared: boolean, seconds: number, hits: number, potions: number, combo: number, kills: number): TrialScore {
  if (!cleared) return { total: kills * 20, base: kills * 20, timeBonus: 0, hitPenalty: 0, potionPenalty: 0, comboBonus: 0 };
  const s = { base: 10000, timeBonus: Math.max(0, Math.round(TRIAL_TIME - seconds)) * 10, hitPenalty: hits * 40, potionPenalty: potions * 400, comboBonus: combo * 25 };
  return { ...s, total: Math.max(0, s.base + s.timeBonus + s.comboBonus - s.hitPenalty - s.potionPenalty) };
}

/**
 * 등급. 보상은 물건이 아니라 발밑 오라: 한 번 달성한 등급의 오라는 영원히 쓸 수 있다
 * (등급이 높을수록 고리·문양·빛기둥·떠오르는 빛이 더해진다)
 */
export const TRIAL_GRADES: { name: string; min: number; color: number; aura: string }[] = [
  { name: '브론즈', min: 6000, color: 0xc98a50, aura: '구릿빛 고리' },
  { name: '실버', min: 10000, color: 0xdfe8f4, aura: '은빛 이중 고리' },
  { name: '골드', min: 13000, color: 0xffd23a, aura: '황금 문양' },
  { name: '플래티넘', min: 15500, color: 0x7ff4ff, aura: '백금 빛기둥' },
  { name: '차원', min: 17500, color: 0xb67cff, aura: '차원의 소용돌이' },
];

/** 점수의 등급 번호 (-1 = 등급 없음) */
export function trialGrade(score: number): number {
  let g = -1;
  TRIAL_GRADES.forEach((t, i) => {
    if (score >= t.min) g = i;
  });
  return g;
}

export interface TrialRecord {
  week: string;
  best: number;
  time: number;
  hits: number;
  cls: string;
  /** 이번 주에 받은 등급 보상 */
  claimed: number[];
  /** 기록을 남긴 주 수 */
  weeks: number;
  /** 가장 높았던 등급 (칭호용) */
  topGrade: number;
  history: { week: string; best: number; grade: number; cls: string }[];
}

export function newTrial(week: string): TrialRecord {
  return { week, best: 0, time: 0, hits: 0, cls: '', claimed: [], weeks: 0, topGrade: -1, history: [] };
}

/** 주가 바뀌었으면 지난 주 기록을 역사로 옮기고 새로 시작 */
export function rollTrialWeek(t: TrialRecord, week: string): TrialRecord {
  if (t.week === week) return t;
  if (t.best > 0) t.history = [{ week: t.week, best: t.best, grade: trialGrade(t.best), cls: t.cls }, ...t.history].slice(0, 10);
  return { ...t, week, best: 0, time: 0, hits: 0, cls: '', claimed: [] };
}

/** 기록 코드: 친구와 점수를 비교할 때 주고받는다 */
export function trialCode(week: string, cls: string, score: number, seconds: number, hits: number): string {
  const body = `${week}|${cls}|${score}|${Math.round(seconds)}|${hits}`;
  return `DT-${btoa(`${body}|${hashStr(body) % 100000}`).replace(/=+$/, '')}`;
}

export function readTrialCode(code: string): { week: string; cls: string; score: number; seconds: number; hits: number } | null {
  try {
    const raw = atob(code.trim().replace(/^DT-/, ''));
    const [week, cls, score, secs, hits, check] = raw.split('|');
    const body = `${week}|${cls}|${score}|${secs}|${hits}`;
    if (Number(check) !== hashStr(body) % 100000) return null;
    return { week, cls, score: Number(score), seconds: Number(secs), hits: Number(hits) };
  } catch {
    return null;
  }
}
