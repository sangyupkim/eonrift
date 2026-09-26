import type { ClassId } from './classes';

/**
 * 스킬 각성: 스킬 Lv.10(궁극기는 Lv.5)을 찍으면 교관 카엘에게 최고급 재료를 내고 각성한다.
 * 스킬마다 성격에 맞는 두 갈래(A·B)가 있고, 교관에게 가면 언제든 공짜로 바꿀 수 있다.
 * (돌진 베기만 A 충전형 · B 집중형 — 다른 스킬은 저마다 다른 변화). v10: 차원 소환사 16갈래
 */
export type AwakenBranch = 'A' | 'B';

export interface AwakenOpt {
  name: string;
  desc: string;
  /** 스킬을 이만큼 모아 두었다가 연달아 쓴다 */
  charges?: number;
  /** 꾹 눌러 최대 3초 힘을 모았다가 뗄 때 나간다 */
  hold?: boolean;
}

export interface AwakenDef {
  a: AwakenOpt;
  b: AwakenOpt;
}

/** 충전형 최대 충전 수 */
export const AWAKEN_CHARGES = 2;
/** 집중형: 최대로 모으는 시간(초)과 최대 위력 배율 */
export const AWAKEN_HOLD = 3;
export const AWAKEN_HOLD_POWER = 3;
/** 천검난무 B: 멈춘 뒤 다시 이어 쓸 수 있는 시간(초) */
export const STORM_RESUME = 10;

export const SKILL_AWAKEN: Record<ClassId, AwakenDef[]> = {
  sword: [
    {
      a: { name: '연속 돌진', desc: '돌진 베기를 2번까지 모아 두고 연달아 돌진한다.', charges: 2 },
      b: { name: '섬광 돌진', desc: '꾹 눌러 최대 3초 힘을 모은다. 모을수록 돌진 거리 최대 2배·피해 최대 3배, 끝에서 충격파가 터진다.', hold: true },
    },
    {
      a: { name: '회오리 베기', desc: '한 번 돌고 끝나지 않고 1.5초 동안 회오리가 되어 계속 벤다 (움직이며 돌 수 있다).' },
      b: { name: '진공 회전', desc: '주변 적을 한가운데로 끌어당겨 벤 뒤, 더 큰 충격파가 한 번 더 터져 적을 기절시킨다.' },
    },
    {
      a: { name: '삼중 파동', desc: '충격파를 부채꼴로 세 갈래 날린다 (갈래마다 위력 75%).' },
      b: { name: '균열 폭발', desc: '충격파가 지나간 땅이 갈라졌다가 0.7초 뒤 길을 따라 연달아 폭발한다.' },
    },
    {
      a: { name: '가시 갑옷', desc: '철벽 태세 동안 맞을 때마다 주변 적에게 가시 충격파로 되돌려 준다.' },
      b: { name: '불굴', desc: '철벽 태세 동안 쓰러질 피해를 한 번 버티고 HP 30%를 회복한다.' },
    },
    {
      a: { name: '반격 방패', desc: '공격을 막을 때마다 주변을 베는 반격이 나간다.' },
      b: { name: '방패 돌격', desc: '방패를 들고 앞으로 돌진해 부딪힌 적을 1초 기절시킨 뒤 방패를 두른다.' },
    },
    {
      a: { name: '공포의 함성', desc: '함성으로 주변 적을 1.5초 기절시키고 느리게 만든다 (보스는 짧게).' },
      b: { name: '피의 함성', desc: '함성이 이어지는 동안 준 피해의 4%만큼 HP를 흡수한다.' },
    },
  ],
  mage: [
    {
      a: { name: '세 갈래 화염구', desc: '화염구가 세 갈래로 나뉘어 날아간다 (갈래마다 위력 70%).' },
      b: { name: '불의 장판', desc: '화염구가 터진 자리에 4초 동안 타오르는 불의 장판이 남는다.' },
    },
    {
      a: { name: '빙결 장판', desc: '장판이 깔리는 순간 안의 적을 1.5초 얼린 뒤 느리게 만든다.' },
      b: { name: '얼음 가시', desc: '장판이 2초 뒤 얼음 가시로 솟구쳐 안의 적에게 큰 피해를 준다.' },
    },
    {
      a: { name: '무한 연쇄', desc: '번개가 튀는 횟수 5 → 10번, 튈수록 약해지지 않는다.' },
      b: { name: '과부하', desc: '번개에 맞은 적이 1초 뒤 과부하로 폭발해 주변 적까지 감전시킨다.' },
    },
    {
      a: { name: '반사 실드', desc: '마나 실드 동안 맞을 때마다 가까운 적에게 마력 번개를 되쏜다.' },
      b: { name: '재생 실드', desc: '마나 실드 동안 초마다 최대 HP 2%를 회복한다.' },
    },
    {
      a: { name: '연쇄 낙뢰', desc: '떨어지는 번개마다 주변 적 두 마리에게 옮겨 붙는다.' },
      b: { name: '뇌운', desc: '적이 모인 곳에 더 넓은 뇌운을 띄워, 번개가 두 번씩 내리꽂히고 오래 감전시킨다.' },
    },
    {
      a: { name: '마력 폭발', desc: '마력을 되돌리는 순간 주변으로 마력 파동이 터져 적을 날려 보낸다.' },
      b: { name: '시간 가속', desc: '다른 스킬들의 남은 재사용 대기를 절반으로 줄인다.' },
    },
  ],
  archer: [
    {
      a: { name: '갈래 화살', desc: '첫 적을 꿰뚫는 순간 화살이 두 갈래로 갈라져 날아간다.' },
      b: { name: '저격', desc: '꿰뚫지 않는 대신 한 발의 위력이 2.5배, 크게 밀쳐 낸다.' },
    },
    {
      a: { name: '이중 연사', desc: '부채꼴 연사가 0.25초 뒤 한 번 더 나간다.' },
      b: { name: '집중 연사', desc: '다섯 발을 거의 한 줄로 모아 쏘고, 화살마다 한 번씩 꿰뚫는다.' },
    },
    {
      a: { name: '집속탄', desc: '폭발하면서 작은 폭탄 다섯 개가 흩어져 한 번 더 터진다.' },
      b: { name: '화염 지대', desc: '폭발한 자리에 4초 동안 불길이 남는다.' },
    },
    {
      a: { name: '질풍', desc: '바람 걸음 동안 공격 속도 +20%, 쓰는 순간 회피 충전이 모두 찬다.' },
      b: { name: '바람의 칼날', desc: '바람 걸음 동안 몸 주위를 도는 칼바람이 가까운 적을 계속 벤다.' },
    },
    {
      a: { name: '독 연막', desc: '연막 안의 적이 독에 중독되어 계속 피해를 입는다.' },
      b: { name: '섬광탄', desc: '터지는 순간 강한 빛으로 주변 적을 2초 기절시킨다 (보스는 짧게).' },
    },
    {
      a: { name: '약점 포착', desc: '집중하는 동안 치명타 피해가 +50% 더 커진다.' },
      b: { name: '사냥 표적', desc: '가장 강한 적(보스 우선)에게 표식을 남겨 10초 동안 내 공격의 피해를 +40% 받게 한다.' },
    },
  ],
  summoner: [
    {
      a: { name: '무리 소환', desc: '한 번에 둘을 불러낸다 (하나마다 위력 70%). 함께 부를 수 있는 수 +2.' },
      b: { name: '거대 소환', desc: '하나만, 몸집 1.8배·위력 2.4배로 30초 동안 불러낸다 (거대 소환수는 하나까지).' },
    },
    {
      a: { name: '차원 포대', desc: '정령이 움직이지 않는 대신 두 배 빠르게 쏜다.' },
      b: { name: '연쇄 사격', desc: '정령의 마력탄이 맞힌 적에게서 두 적에게 더 튄다.' },
    },
    {
      a: { name: '블랙홀', desc: '더 넓은 곳을 3.5초 동안 세게 빨아들이고 더 크게 폭발한다.' },
      b: { name: '포탈 행진', desc: '모든 소환수가 차원문으로 뛰어들어 5초 동안 피해 +60%.' },
    },
    {
      a: { name: '피의 계약', desc: '결속 동안 소환수가 준 피해의 3%만큼 내 HP가 찬다.' },
      b: { name: '광란', desc: '결속 동안 소환수의 공격 속도가 1.7배.' },
    },
    {
      a: { name: '연쇄 폭발', desc: '폭발 범위 1.5배, 맞은 적을 1초 기절시킨다.' },
      b: { name: '영혼 회수', desc: '터진 소환수가 2초 뒤 남은 시간의 절반으로 다시 나타난다.' },
    },
    {
      a: { name: '반사 장막', desc: '보호막 동안 맞을 때마다 가까운 적에게 차원 번개를 되쏜다.' },
      b: { name: '재생 장막', desc: '보호막 동안 초마다 최대 HP 3%를 회복한다.' },
    },
  ],
};

export const ULT_AWAKEN: Record<ClassId, AwakenDef[]> = {
  sword: [
    {
      a: { name: '뇌신 검무', desc: '더 강하게 회전해 범위가 넓어지고, 도는 동안 주변 적에게 천둥 번개를 내리꽂는다.' },
      b: { name: '검무 보류', desc: '지속 시간이 1.5배. 쓰는 중에 궁극기를 다시 누르면 멈추고, 10초 안에 다시 누르면 남은 시간만큼 이어서 돈다.' },
    },
    {
      a: { name: '연쇄 붕괴', desc: '내려찍은 뒤 여진이 세 번 더 넓게 퍼져 나간다.' },
      b: { name: '천공 낙하', desc: '더 높이 뛰어올라 더 넓은 곳을 두 배의 힘으로 내려찍는다.' },
    },
  ],
  mage: [
    {
      a: { name: '유성우', desc: '작은 운석 일곱 개가 더 넓은 곳에 쏟아진다.' },
      b: { name: '거대 운석', desc: '거대한 운석 하나가 떨어져 넓게 폭발하고, 불타는 구덩이를 남긴다.' },
    },
    {
      a: { name: '산산조각', desc: '얼어붙은 적이 풀리는 순간 산산조각 나며 한 번 더 큰 피해를 입는다.' },
      b: { name: '얼음 요새', desc: '얼음 요새에 3초 동안 몸을 숨겨 무적이 되고, 더 넓은 곳을 더 오래 얼린다.' },
    },
  ],
  archer: [
    {
      a: { name: '추적 화살비', desc: '화살비가 적이 가장 많이 모인 곳을 따라 움직인다.' },
      b: { name: '불화살비', desc: '불화살이 쏟아지고, 비가 그친 자리에 불길이 3초 남는다.' },
    },
    {
      a: { name: '쌍룡 사격', desc: '거대한 화살 두 발을 나란히 쏜다.' },
      b: { name: '용의 숨결', desc: '화살이 지나간 길을 따라 용의 불길이 연달아 폭발한다.' },
    },
  ],
  summoner: [
    {
      a: { name: '끝없는 군단', desc: '12초 동안 2초마다 소환수가 하나씩 더 나타난다.' },
      b: { name: '정예 군단', desc: '여섯 대신 셋을, 몸집 1.5배·위력 2.2배의 정예로 불러낸다.' },
    },
    {
      a: { name: '분노한 수문장', desc: '14초 동안 머물고 더 자주 내려찍는다.' },
      b: { name: '포탈 붕괴', desc: '수문장이 돌아갈 때 포탈이 무너지며 넓은 곳에 거대한 폭발.' },
    },
  ],
};

/** 이 갈래가 충전형이면 충전 수 (아니면 1) */
export function awakenCharges(def: AwakenDef | undefined, br: AwakenBranch | null): number {
  if (!def || !br) return 1;
  return (br === 'A' ? def.a : def.b).charges ?? 1;
}

/** 이 갈래가 꾹 눌러 모으는 스킬인지 */
export function awakenHolds(def: AwakenDef | undefined, br: AwakenBranch | null): boolean {
  if (!def || !br) return false;
  return !!(br === 'A' ? def.a : def.b).hold;
}

/** 각성 비용 (최고급 재료). 궁극기는 더 비싸다 */
export function awakenCost(ult: boolean): { gold: number; items: Record<string, number> } {
  return ult
    ? { gold: 800000, items: { dim_plate: 20, mana_dim_plate: 10, essence_dim: 25, dim_shard: 50, dim_alloy2: 6, orichalcum_plate: 20 } }
    : { gold: 300000, items: { dim_plate: 10, mana_dim_plate: 5, essence_dim: 10, dim_shard: 20, dim_alloy2: 3, orichalcum_plate: 10 } };
}

/** 스킬 레벨 → 효과 단계 (0: Lv.1~3 · 1: Lv.4~6 · 2: Lv.7~10) */
export function effectTier(lv: number): 0 | 1 | 2 {
  return lv >= 7 ? 2 : lv >= 4 ? 1 : 0;
}
