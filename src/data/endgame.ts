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
  { name: '일반', desc: '7단계의 힘을 가진 보스 14마리와 한 마리씩', hp: 1, atk: 1, per: 1 },
  { name: '하드', desc: '파수꾼과 수호자 두 마리를 한꺼번에 (7전) · 체력 ×1.5 · 공격력 ×1.3', hp: 1.5, atk: 1.3, per: 2 },
  { name: '지옥', desc: '보스 세 마리를 한꺼번에 (5전) · 체력 ×2.2 · 공격력 ×1.6', hp: 2.2, atk: 1.6, per: 3 },
] as const;

/** 보스 러시 순서: 1단계 파수꾼 → 1단계 수호자 → … → 7단계 수호자 (14번) */
export const RUSH_ORDER: { tier: number; kind: 'midboss' | 'boss' }[] = Array.from({ length: 14 }, (_, i) => ({ tier: Math.floor(i / 2) + 1, kind: i % 2 ? 'boss' : 'midboss' }));

/** 난이도별 전투 목록: 한 전투에 나오는 보스들 (일반 1마리, 하드 2마리, 지옥 3마리씩) */
export function rushFights(diff: RushDiff): { tier: number; kind: 'midboss' | 'boss' }[][] {
  const per = RUSH_DIFFS[diff].per;
  const out: { tier: number; kind: 'midboss' | 'boss' }[][] = [];
  for (let i = 0; i < RUSH_ORDER.length; i += per) out.push(RUSH_ORDER.slice(i, i + per));
  return out;
}
export function rushFightName(f: { tier: number; kind: 'midboss' | 'boss' }[]): string {
  return f.map((b) => `${b.tier}단계 ${b.kind === 'boss' ? '수호자' : '파수꾼'}`).join(' + ');
}

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

/**
 * 균열은 차원 가루·장비를 파밍하는 곳이고, 자원은 기본 스테이지·채집 특화 맵에서 캔다.
 * 그래서 균열 맵에는 광맥·나무가 30%만 나오고 채집 보너스도 없다 (입장 재료인 합금은 기본 스테이지 자원으로 만든다)
 */
export const RIFT_NODE_MULT = 0.3;

/** 균열 클리어 보상. 시간 안에 깨면 다음 단계가 열린다 */
export function riftReward(level: number, inTime: boolean): { gold: number; dust: number } {
  // 골드: 10단계 한 판 ≈ 12만 G, 20단계 ≈ 28만 G (입장권 노동에 맞게 크게)
  const full = { gold: Math.round((15000 + level * 8000) * (1 + level * 0.03)), dust: 8 + level * 3 };
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
  /** 일일 차원 시련 (v10: 주간 → 일일. 필드 week에 날짜 키가 들어간다) */
  trial?: TrialRecord;
  /** 주간 차원 레이드 (v10) */
  raid?: RaidRecord;
  /** 무한 러쉬 (v10) */
  horde?: HordeRecord;
  /** 심연 균열: 마지막으로 고른 서약 */
  vows?: VowId[];
}

export function newEndgame(): EndgameState {
  return { towerBest: 0, rushUsed: 0, rushBest: [0, 0, 0], rushGradeBest: ['', '', ''], riftBest: 0 };
}

/** 엔드 콘텐츠 한 판의 종류 */
export type EndRun =
  | { kind: 'tower'; floor: number }
  | { kind: 'rush'; diff: RushDiff; index: number }
  | { kind: 'rift'; tier: number; level: number; affixes: AffixId[]; timeLeft: number; vows?: VowId[] }
  | { kind: 'trial'; week: string; hits: number; potions: number }
  | { kind: 'raid'; week: string; hits: number }
  | { kind: 'horde'; kills: number; time: number; bossesDown: number; picks: number }
  | { kind: 'ch8'; stage: number };

/** 초 → "m:ss" */
export function formatClock(seconds: number): string {
  const t = Math.max(0, Math.round(seconds));
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
}

// ---------------- 주간 차원 시련 (기록형) ----------------

/**
 * 주마다 무작위로 정해지는 수호자 한 마리와 정해진 시간 동안 싸운다. 내 장비·능력치 그대로.
 * 체력이 엄청나게 많아서 깎은 비율로 순위를 매기고, 쓰러뜨렸다면 걸린 시간으로 겨룬다.
 * 체력이 10% 깎일 때마다 격노 단계가 올라 패턴이 강해진다.
 */
export const TRIAL_TIME = 180;
/** 시련 수호자 체력: 7-10 수호자의 몇 배 */
export const TRIAL_HP = 12;

/** 날짜 키 ("2026-09-26", 기기 시간 기준). 일일 차원 시련·순위표에 쓴다 */
export function dayKey(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
/** 어제 날짜 키 */
export function prevDayKey(d = new Date()): string {
  return dayKey(new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1));
}
/** 지난주 키 */
export function prevWeekKey(d = new Date()): string {
  return weekKey(new Date(d.getFullYear(), d.getMonth(), d.getDate() - 7));
}

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

/** 오늘(또는 그 주)의 시련: 수호자(단계 1~7 중 하나)와 맵 시드. 키가 날짜면 하루마다 바뀐다 */
export function trialSpec(week: string): { seed: number; tier: number } {
  const seed = hashStr(`trial:${week}`);
  return { seed, tier: (seed % 7) + 1 };
}

/**
 * 점수 (클수록 좋다): 깎은 체력 비율을 만분율로 (0~10000).
 * 쓰러뜨렸다면 10000 + 남은 시간(초)×10 → 빨리 잡을수록 높다.
 */
export function trialScore(ratio: number, killed: boolean, seconds: number): number {
  if (killed) return 10000 + Math.max(0, Math.round((TRIAL_TIME - seconds) * 10));
  return Math.max(0, Math.min(9999, Math.floor(ratio * 10000)));
}

/** 점수를 사람이 읽는 글로: "37.52%" 또는 "처치 1:23" */
export function trialScoreText(score: number): string {
  if (score >= 10000) return `처치 ${formatClock(TRIAL_TIME - (score - 10000) / 10)}`;
  return `${(score / 100).toFixed(2)}%`;
}

/**
 * 등급 (깎은 체력 기준). 보상은 물건이 아니라 발밑 오라: 한 번 달성한 등급의 오라는 영원히 쓸 수 있다
 * (등급이 높을수록 고리·문양·빛기둥·떠오르는 빛이 더해진다)
 */
export const TRIAL_GRADES: { name: string; min: number; color: number; aura: string }[] = [
  { name: '브론즈', min: 1000, color: 0xc98a50, aura: '구릿빛 고리' },
  { name: '실버', min: 2500, color: 0xdfe8f4, aura: '은빛 이중 고리' },
  { name: '골드', min: 5000, color: 0xffd23a, aura: '황금 문양' },
  { name: '플래티넘', min: 8000, color: 0x7ff4ff, aura: '백금 빛기둥' },
  { name: '차원', min: 10000, color: 0xb67cff, aura: '차원의 소용돌이' },
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
  /** 2 = 보스 체력 깎기 방식 (예전 점수 방식 기록은 버린다) */
  v?: number;
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
  /** (v10) 이 날 받은 증표 */
  marks?: number;
  /** (v10) 순위 보상을 확인한 날 */
  rankDone?: string[];
}

export function newTrial(week: string): TrialRecord {
  return { v: 2, week, best: 0, time: 0, hits: 0, cls: '', claimed: [], weeks: 0, topGrade: -1, history: [] };
}

/** 주가 바뀌었으면 지난 주 기록을 역사로 옮기고 새로 시작 */
export function rollTrialWeek(t: TrialRecord, week: string): TrialRecord {
  // 예전 방식(점수제) 기록: 얻은 오라·참여 주 수는 남기고 점수는 지운다
  if (t.v !== 2) t = { ...t, v: 2, best: 0, time: 0, hits: 0, cls: '', history: [] };
  if (t.week === week) return t;
  if (t.best > 0) t.history = [{ week: t.week, best: t.best, grade: trialGrade(t.best), cls: t.cls }, ...t.history].slice(0, 10);
  return { ...t, week, best: 0, time: 0, hits: 0, cls: '', claimed: [], marks: 0 };
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

// ---------------- 차원의 끝 해금 순서 ----------------
export type EndContent = 'tower' | 'rush' | 'rift' | 'trial' | 'raid' | 'horde';
export const END_NAMES: Record<EndContent, string> = { tower: '무한의 탑', rush: '보스 러시', rift: '심연 균열', trial: '일일 차원 시련', raid: '주간 차원 레이드', horde: '무한 러쉬' };

/** 무한의 탑 → (10층) 보스 러시 → (일반 완주) 심연 균열 → (3단계 돌파) 주간 차원 시련. 열렸으면 null, 아니면 조건 */
export function endLock(e: EndgameState, c: EndContent): string | null {
  switch (c) {
    case 'tower':
      return null;
    case 'rush':
      return e.towerBest >= 10 ? null : `무한의 탑 10층을 돌파하면 열립니다 (지금 ${e.towerBest}층)`;
    case 'rift':
      return e.rushGradeBest[0] ? null : '보스 러시 일반을 한 번 완주하면 열립니다';
    case 'trial':
      return e.riftBest >= 3 ? null : `심연 균열 3단계를 돌파하면 열립니다 (지금 ${e.riftBest}단계)`;
    case 'raid':
      return e.riftBest >= 5 ? null : `심연 균열 5단계를 돌파하면 열립니다 (지금 ${e.riftBest}단계)`;
    case 'horde':
      return e.rushGradeBest[0] ? null : '보스 러시 일반을 한 번 완주하면 열립니다';
  }
}


// ---------------- 심연 균열 서약 (v10) ----------------
/**
 * 스스로 제약을 걸고 들어가 더 많은 보상을 받는다. 고른 서약의 보너스를 모두 더한 만큼 골드·차원 가루가 는다.
 */
export type VowId = 'nopotion' | 'brutal' | 'tough' | 'glass' | 'hurry' | 'elite' | 'slowdodge';
export const VOWS: Record<VowId, { name: string; text: string; bonus: number; color: number }> = {
  nopotion: { name: '물약 금지', text: '물약을 마실 수 없다', bonus: 0.25, color: 0xff7a9a },
  brutal: { name: '잔혹', text: '몬스터 공격력 +60%', bonus: 0.35, color: 0xff4a4a },
  tough: { name: '강인', text: '몬스터 체력 +60%', bonus: 0.3, color: 0xb5bcc8 },
  glass: { name: '유리 몸', text: '내 최대 체력 -40%', bonus: 0.4, color: 0x9fe3ff },
  hurry: { name: '촉박', text: `제한 시간 ${RIFT_TIME / 60}분 → 3분`, bonus: 0.4, color: 0xffd23a },
  elite: { name: '정예 소집', text: '일반 몬스터 25%가 정예로', bonus: 0.3, color: 0xffb04a },
  slowdodge: { name: '무거운 발', text: '회피 재사용 대기 2배', bonus: 0.2, color: 0x8a8aff },
};
export const VOW_IDS = Object.keys(VOWS) as VowId[];
export function vowMult(v: VowId[] | undefined): number {
  return 1 + (v ?? []).reduce((a, id) => a + (VOWS[id]?.bonus ?? 0), 0);
}
export const HURRY_TIME = 180;

// ---------------- 순위 공통 ----------------
/** 순위표 종류: 일일 시련 · 주간 레이드 · 무한 러쉬(일일) */
export type BoardId = 'trial' | 'raid' | 'horde';

/**
 * 하루 동안 받는 증표 (v10): 오늘 최고 기록의 등급만큼. 기록이 오르면 차액을 바로 받는다.
 * 시련: 참여 2 + 등급(브론즈 4 · 실버 6 · 골드 9 · 플래티넘 12 · 차원 16)
 */
export function trialDayMarks(score: number): number {
  if (score <= 0) return 0;
  const g = trialGrade(score);
  return 2 + (g < 0 ? 0 : [4, 6, 9, 12, 16][g]);
}

// ---------------- 주간 차원 레이드 (v10) ----------------
/**
 * 매주 바뀌는 레이드 보스 하나를 5분 안에 쓰러뜨린다. 체력 12줄, 8·4줄에서 보호막(수호병), 10%마다 격노.
 * 순위는 처치 시간(못 잡으면 깎은 체력). 하루 한 번 오늘 기록만큼 증표, 한 주가 끝나면 순위 보상.
 */
export const RAID_TIME = 300;
/** 레이드 보스 체력: 7-10 수호자의 몇 배 */
export const RAID_HP = 28;
export interface RaidBossDef {
  id: string;
  name: string;
  /** 모습의 원래 단계 (색·장판) */
  tier: number;
  desc: string;
}
export const RAID_BOSSES: RaidBossDef[] = [
  { id: 'r1', name: '차원 포식자', tier: 7, desc: '틈새를 삼키는 거대한 망령. 순간이동과 차원 붕괴, 나선 탄막' },
  { id: 'r2', name: '영겁의 거신', tier: 5, desc: '멈추지 않는 마공 거신. 미사일 폭격과 과열 폭발, 땅울림' },
  { id: 'r3', name: '균열의 여왕', tier: 3, desc: '얼음과 차원을 다루는 여왕. 고드름 비와 침묵 저주, 수정 광선' },
];
export function raidSpec(week: string): { seed: number; boss: RaidBossDef } {
  const seed = hashStr(`raid:${week}`);
  return { seed, boss: RAID_BOSSES[seed % RAID_BOSSES.length] };
}
export function raidScore(ratio: number, killed: boolean, seconds: number): number {
  if (killed) return 10000 + Math.max(0, Math.round((RAID_TIME - seconds) * 10));
  return Math.max(0, Math.min(9999, Math.floor(ratio * 10000)));
}
export function raidScoreText(score: number): string {
  if (score >= 10000) return `처치 ${formatClock(RAID_TIME - (score - 10000) / 10)}`;
  return `${(score / 100).toFixed(2)}%`;
}
/** 레이드 하루 증표: 깎은 체력 10%마다 1 (최대 9) + 처치 15 (3분 안이면 +5) */
export function raidDayMarks(score: number): number {
  if (score <= 0) return 0;
  if (score < 10000) return 2 + Math.floor(score / 1000);
  const secs = RAID_TIME - (score - 10000) / 10;
  return 18 + (secs <= 180 ? 5 : 0);
}
export interface RaidRecord {
  week: string;
  best: number;
  time: number;
  cls: string;
  /** 오늘 받은 증표와 그 날 */
  day?: string;
  dayBest?: number;
  dayMarks?: number;
  /** 순위 보상을 확인한 주 */
  rankDone?: string[];
  /** 기록을 남긴 주 (순위 보상 확인용, 최근 10개) */
  played?: string[];
  kills: number;
}
export function newRaid(week: string): RaidRecord {
  return { week, best: 0, time: 0, cls: '', kills: 0 };
}

// ---------------- 무한 러쉬 (v10) ----------------
/**
 * 넓은 벌판 한가운데서 끝없이 쏟아지는 몬스터를 막는다 (차원의 틈에서 몬스터가 사방으로 나온다).
 * 시간이 갈수록 몬스터가 강해지고 많아지며, 1분 30초마다 보스가 섞인다. 처치 수가 기록.
 * 처치 수가 목표를 넘을 때마다 축복 셋 중 하나를 고른다 (뱀서라이크).
 */
export const HORDE_MAX_ALIVE = 70;
/** 시간(초) → 몬스터 배율 (7-10 기준. 1분마다 +18%, 곱으로) */
export function hordeMult(t: number): number {
  return 0.55 * Math.pow(1.18, t / 60);
}
/** 초마다 나오는 몬스터 수 */
export function hordeRate(t: number): number {
  return Math.min(7, 1.6 + t / 45);
}
export const HORDE_BOSS_EVERY = 90;
/** 다음 축복까지 필요한 처치 수 (n번째 축복) */
export function blessNeed(n: number): number {
  return Math.round(25 + n * 18 + n * n * 2.5);
}
export type BlessId = 'might' | 'fury' | 'swift' | 'vital' | 'keen' | 'vamp' | 'orbit' | 'thunder' | 'nova' | 'focus' | 'guard' | 'reach';
export const BLESSINGS: Record<BlessId, { name: string; text: string; max: number; color: number }> = {
  might: { name: '힘의 축복', text: '공격력 +15%', max: 8, color: 0xff6a4a },
  fury: { name: '분노의 축복', text: '공격 속도 +10%', max: 6, color: 0xffa04a },
  swift: { name: '바람의 축복', text: '이동 속도 +8%', max: 5, color: 0x7affd0 },
  vital: { name: '생명의 축복', text: '최대 체력 +15%, 체력 모두 회복', max: 6, color: 0xff4a6a },
  keen: { name: '예리함의 축복', text: '치명타 +6%, 치명타 피해 +15%', max: 6, color: 0xffd23a },
  vamp: { name: '흡혈의 축복', text: '처치할 때마다 최대 체력 1% 회복', max: 5, color: 0xd02a4a },
  orbit: { name: '칼날 궤도', text: '몸 주위를 도는 칼날이 적을 벤다 (단계마다 칼날 +1)', max: 5, color: 0x9affc8 },
  thunder: { name: '천둥의 축복', text: '2초마다 가까운 적에게 번개 (단계마다 +1줄기)', max: 5, color: 0xfff08a },
  nova: { name: '폭발의 축복', text: '처치한 자리가 폭발해 주변에 피해', max: 5, color: 0xff8a2a },
  focus: { name: '집중의 축복', text: '스킬 재사용 대기 -8%, 스킬 피해 +10%', max: 5, color: 0x8a8aff },
  guard: { name: '수호의 축복', text: '받는 피해 -6%', max: 5, color: 0x6ab0ff },
  reach: { name: '자석의 축복', text: '회피 충전 +1, 회피 뒤 3초 공격력 +20%', max: 2, color: 0xc08aff },
};
export const BLESS_IDS = Object.keys(BLESSINGS) as BlessId[];

/** 처치 수 첫 달성 보상 (증표) */
export const HORDE_MILESTONES: { kills: number; marks: number }[] = [
  { kills: 100, marks: 3 },
  { kills: 250, marks: 5 },
  { kills: 500, marks: 8 },
  { kills: 800, marks: 10 },
  { kills: 1200, marks: 12 },
  { kills: 1700, marks: 15 },
  { kills: 2300, marks: 18 },
  { kills: 3000, marks: 22 },
  { kills: 4000, marks: 26 },
  { kills: 5000, marks: 30 },
];
/** 하루 한 번 받는 러쉬 보상: 최고 기록 기준 (탑 소탕처럼) */
export function hordeDaily(best: number): { marks: number; gold: number } {
  return { marks: Math.min(15, Math.floor(best / 200)), gold: best * 60 };
}
export interface HordeRecord {
  best: number;
  bestTime: number;
  /** 받은 첫 달성 보상 수 */
  claimed: number;
  dailyDate?: string;
  /** 오늘 최고 (순위표) */
  day?: string;
  dayBest?: number;
  rankDone?: string[];
}
export function newHorde(): HordeRecord {
  return { best: 0, bestTime: 0, claimed: 0 };
}
