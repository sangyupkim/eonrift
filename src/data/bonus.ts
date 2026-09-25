import type { Rng } from '../core/rng';
import type { EndgameState } from './endgame';
import { TIER_MANA_PLATE, TIER_PLATE } from './items';

/**
 * 엔딩 이후 성장: 각인 · 칭호 · 초월 · 음식. 모두 같은 '보너스' 이름표로 능력치에 더해진다.
 * % 보너스는 비율(0.03 = 3%), 치명타만 %p.
 */
export type BonusKey = 'atk' | 'hp' | 'def' | 'crit' | 'speed' | 'cdr' | 'gold' | 'move' | 'ult' | 'mp' | 'exp';
export type Bonus = Partial<Record<BonusKey, number>>;

export const BONUS_NAMES: Record<BonusKey, string> = {
  atk: '공격력',
  hp: '최대 체력',
  def: '방어력',
  crit: '치명타',
  speed: '공격 속도',
  cdr: '스킬 재사용 대기',
  gold: '골드 획득',
  move: '이동 속도',
  ult: '궁극기 위력',
  mp: '최대 MP',
  exp: '경험치',
};

/** 보너스 한도 (각인·칭호·음식을 모두 더한 값) */
export const BONUS_CAP: Bonus = { cdr: 0.4, move: 0.3, speed: 0.5 };

export function bonusText(k: BonusKey, v: number): string {
  if (k === 'crit') return `${BONUS_NAMES[k]} +${(Math.round(v * 10) / 10).toFixed(1)}%`;
  const pct = Math.round(v * 1000) / 10;
  return k === 'cdr' ? `${BONUS_NAMES[k]} -${pct}%` : `${BONUS_NAMES[k]} +${pct}%`;
}

export function addBonus(into: Bonus, b: Bonus, times = 1): Bonus {
  for (const [k, v] of Object.entries(b) as [BonusKey, number][]) into[k] = (into[k] ?? 0) + v * times;
  return into;
}

// ---------------- 각인 ----------------

/** 각인 옵션: 1단 각인에서 나올 수 있는 최대값 (단계가 오를수록 배율) */
export const ENGRAVE_OPTS: { key: BonusKey; max: number }[] = [
  { key: 'atk', max: 0.03 },
  { key: 'hp', max: 0.04 },
  { key: 'def', max: 0.04 },
  { key: 'crit', max: 1.5 },
  { key: 'speed', max: 0.02 },
  { key: 'cdr', max: 0.025 },
  { key: 'gold', max: 0.06 },
  { key: 'move', max: 0.02 },
  { key: 'ult', max: 0.05 },
  { key: 'mp', max: 0.05 },
  { key: 'exp', max: 0.05 },
];

/** 각인 단계 (1~5) */
export const ENGRAVE_STAGES = 5;
export const ENGRAVE_MULT = [1, 1.6, 2.3, 3.1, 4];
export const ENGRAVE_STAGE_NAMES = ['1단', '2단', '3단', '4단', '5단'];

export interface EngraveLine {
  /** 옵션 */
  k: BonusKey;
  v: number;
}

/** stage(1~5) 각인 한 줄을 무작위로 굴린다. 값은 최대값의 50~100% */
export function rollEngrave(stage: number, rng: Rng): EngraveLine {
  const o = rng.pick(ENGRAVE_OPTS);
  const raw = o.max * ENGRAVE_MULT[stage - 1] * rng.range(0.5, 1);
  return { k: o.key, v: o.key === 'crit' ? Math.round(raw * 10) / 10 : Math.round(raw * 1000) / 1000 };
}

/** 이 단계에서 나올 수 있는 값의 범위 */
export function engraveRange(k: BonusKey, stage: number): [number, number] {
  const o = ENGRAVE_OPTS.find((x) => x.key === k)!;
  const max = o.max * ENGRAVE_MULT[stage - 1];
  return [max * 0.5, max];
}

/**
 * stage 각인(새로 새기기와 다시 굴리기 모두 같은 비용).
 * 낮은 단계는 구리·철판, 높은 단계일수록 윗 단계 판과 마력판 → 하위 자원도 끝까지 소모된다.
 */
export function engraveCost(stage: number): { gold: number; items: Record<string, number> } {
  const k = stage;
  const items: Record<string, number> = {
    dim_shard: k,
    [TIER_PLATE[k - 1]]: 6 + k * 2,
    [TIER_PLATE[k]]: 3 + k,
  };
  // 마력판: 2단 마력 구리판, 3단 마력 철판, 4단 마력 티타늄판, 5단 마력 오리하르콘판
  if (k >= 2) items[TIER_MANA_PLATE[k <= 3 ? k - 2 : k]] = k;
  if (k >= 5) items[TIER_PLATE[6]] = 3;
  return { gold: 1500 * k * k, items };
}

// ---------------- 칭호 ----------------

export interface TitleCtx {
  end: EndgameState;
  /** 가장 높은 초월 레벨 (직업 중) */
  transcend: number;
  /** 새긴 5단 각인 줄 수 */
  engrave5: number;
  /** 주간 시련: 가장 높았던 등급 번호, 기록을 남긴 주 수 */
  trialTop?: number;
  trialWeeks?: number;
}

export interface TitleDef {
  id: string;
  name: string;
  cond: string;
  bonus: Bonus;
  check: (c: TitleCtx) => boolean;
}

export const TITLES: TitleDef[] = [
  { id: 'tower10', name: '탑의 도전자', cond: '무한의 탑 10층', bonus: { atk: 0.01 }, check: (c) => c.end.towerBest >= 10 },
  { id: 'tower30', name: '탑의 정복자', cond: '무한의 탑 30층', bonus: { hp: 0.03 }, check: (c) => c.end.towerBest >= 30 },
  { id: 'tower50', name: '구름 위의 발걸음', cond: '무한의 탑 50층', bonus: { atk: 0.03 }, check: (c) => c.end.towerBest >= 50 },
  { id: 'tower100', name: '무한을 걷는 자', cond: '무한의 탑 100층', bonus: { atk: 0.05, hp: 0.05 }, check: (c) => c.end.towerBest >= 100 },
  { id: 'rush0', name: '보스 사냥꾼', cond: '보스 러시 일반 완주', bonus: { gold: 0.05 }, check: (c) => !!c.end.rushGradeBest[0] },
  { id: 'rush1', name: '수호자 파괴자', cond: '보스 러시 하드 완주', bonus: { atk: 0.02 }, check: (c) => !!c.end.rushGradeBest[1] },
  { id: 'rush2', name: '지옥 순례자', cond: '보스 러시 지옥 완주', bonus: { atk: 0.04 }, check: (c) => !!c.end.rushGradeBest[2] },
  { id: 'rushS', name: '번개 같은 자', cond: '보스 러시 S등급 (아무 난이도)', bonus: { speed: 0.02 }, check: (c) => c.end.rushGradeBest.includes('S') },
  { id: 'rift5', name: '심연 탐험가', cond: '심연 균열 5단계 돌파', bonus: { exp: 0.05 }, check: (c) => c.end.riftBest >= 5 },
  { id: 'rift10', name: '심연 잠수부', cond: '심연 균열 10단계 돌파', bonus: { hp: 0.03 }, check: (c) => c.end.riftBest >= 10 },
  { id: 'rift20', name: '심연의 주인', cond: '심연 균열 20단계 돌파', bonus: { atk: 0.04 }, check: (c) => c.end.riftBest >= 20 },
  { id: 'trans10', name: '초월자', cond: '초월 레벨 10', bonus: { crit: 1 }, check: (c) => c.transcend >= 10 },
  { id: 'trans50', name: '경지를 넘은 자', cond: '초월 레벨 50', bonus: { atk: 0.03 }, check: (c) => c.transcend >= 50 },
  { id: 'trial_gold', name: '시련의 강자', cond: '주간 차원 시련 골드 등급', bonus: { hp: 0.02 }, check: (c) => (c.trialTop ?? -1) >= 2 },
  { id: 'trial_dim', name: '차원 시련의 정점', cond: '주간 차원 시련 차원 등급', bonus: { atk: 0.03 }, check: (c) => (c.trialTop ?? -1) >= 4 },
  { id: 'trial_5', name: '꾸준한 도전자', cond: '주간 차원 시련 5주 참여', bonus: { gold: 0.1 }, check: (c) => (c.trialWeeks ?? 0) >= 5 },
  { id: 'engrave5', name: '각인 장인', cond: '5단 각인 새기기', bonus: { def: 0.03 }, check: (c) => c.engrave5 >= 1 },
];

// ---------------- 초월 ----------------

/** 99레벨 뒤 초월 레벨 t → t+1 에 필요한 경험치 */
export function transcendExp(t: number): number {
  return Math.round(120000 * (1 + t * 0.08));
}

/**
 * 초월 포인트를 찍을 때 드는 차원 파편: 이미 찍은 포인트가 많을수록 비싸다.
 * 1~5번째 점 1개씩, 6~10번째 2개씩, 11~15번째 3개씩 … (5점마다 +1)
 */
export function transcendPointCost(spent: number): number {
  return 1 + Math.floor(spent / 5);
}
/** 지금까지 spent점을 찍었을 때 n점을 더 찍는 비용 */
export function transcendCost(spent: number, n: number): number {
  let sum = 0;
  for (let i = 0; i < n; i++) sum += transcendPointCost(spent + i);
  return sum;
}

/** 초월 포인트 1점당 보너스 */
export const TRANSCEND_STATS: { key: BonusKey; per: number }[] = [
  { key: 'atk', per: 0.01 },
  { key: 'hp', per: 0.015 },
  { key: 'def', per: 0.015 },
  { key: 'crit', per: 0.2 },
];

// ---------------- 음식 ----------------

/** 음식: 먹으면 30분 동안 효과 (한 번에 하나) */
export const FOOD_MINUTES = 30;
export const FOODS: Record<string, Bonus> = {
  food_atk: { atk: 0.1 },
  food_guard: { def: 0.12, hp: 0.08 },
  food_luck: { gold: 0.25 },
  food_exp: { exp: 0.2 },
};
