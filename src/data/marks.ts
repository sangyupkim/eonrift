/**
 * 영겁의 증표 (v10): 새 콘텐츠(일일 차원 시련·주간 차원 레이드·무한 러쉬·업적)가 주는 공통 보상.
 * 마을 남서쪽의 ???에게 가져가면 유물 파편·세트 문장 같은 성장 재료로 바꿔 준다.
 * 앞으로 새 성장 요소가 생겨도 이 교환 목록에 한 줄만 더하면 된다.
 */
export const MARK = 'eon_mark';

export interface ExchangeOffer {
  /** 받는 아이템 */
  item: string;
  n: number;
  /** 증표 */
  cost: number;
  note: string;
}

export const EXCHANGE: ExchangeOffer[] = [
  { item: 'relic_shard', n: 1, cost: 5, note: '노아에게 5개 → 무작위 유물' },
  { item: 'relic_shard', n: 10, cost: 45, note: '10개 묶음 (10% 할인)' },
  { item: 'set_blueprint', n: 1, cost: 12, note: '제작대 세트 탭 → 직업·부위를 골라 세트 장비 (세트는 무작위)' },
  { item: 'set_blueprint', n: 5, cost: 55, note: '5장 묶음' },
  { item: 'dim_shard', n: 3, cost: 4, note: '궁극기·각인·초월 재료' },
];

// ---- 일일 차원 시련 (v10: 주간 → 일일) ----
/** 등급(브론즈~차원)별로 하루 한 번 받는 증표 */
export const TRIAL_DAILY_MARKS = [4, 6, 9, 12, 16];
/** 참여만 해도 */
export const TRIAL_JOIN_MARKS = 2;

/** 순위 보상: 어제(시련)·지난주(레이드) 최종 순위 */
export function rankMarks(rank: number, total: number, big = false): number {
  const k = big ? 3 : 1;
  if (rank <= 0) return 0;
  if (rank === 1) return 20 * k;
  if (rank <= 3) return 14 * k;
  if (rank <= 10) return 9 * k;
  if (total > 0 && rank <= Math.ceil(total * 0.5)) return 5 * k;
  return 3 * k;
}
