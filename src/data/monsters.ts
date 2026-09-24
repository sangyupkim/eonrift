/** 몬스터 유형과 단계별 이름 */
export type Archetype = 'melee' | 'ranged' | 'charger' | 'bomber' | 'tank';

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
};

export const MONSTER_NAMES: Record<number, Record<Archetype, string>> = {
  1: { melee: '이끼 늑대', ranged: '숲 정령술사', charger: '뿔 멧돼지', bomber: '포자 버섯', tank: '이끼 골렘' },
  2: { melee: '협곡 하이에나', ranged: '모래 주술사', charger: '붉은 들소', bomber: '폭발 선인장', tank: '사암 골렘' },
  3: { melee: '서리 늑대', ranged: '빙결 마녀', charger: '얼음 뿔소', bomber: '서리 정령', tank: '빙하 골렘' },
  4: { melee: '수정 도마뱀', ranged: '수정 현자', charger: '수정 멧돼지', bomber: '불안정한 수정', tank: '수정 거인' },
  5: { melee: '폭주 경비병', ranged: '마공 포탑', charger: '돌격 기계', bomber: '자폭 드론', tank: '마공 골렘' },
  6: { melee: '용암 사냥개', ranged: '화염 주술사', charger: '불꽃 황소', bomber: '마그마 방울', tank: '흑요석 골렘' },
  7: { melee: '공허 추적자', ranged: '차원 관찰자', charger: '균열 돌진자', bomber: '공허 파편', tank: '차원 수호자' },
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

/** 단계·방·회차에 따른 몬스터 능력치 배율. 같은 단계 안에서도 방이 깊을수록 강해진다 */
export function tierScale(tier: number, stage: number, ngPlus: number): { hp: number; atk: number; def: number } {
  const ng = 1 + ngPlus * 0.6;
  // 방이 깊을수록 체력 18%·공격 10%씩, 단계가 오를 때마다 체력 ×2.1 · 공격 ×1.8 · 방어 ×1.3
  const deep = 1 + (stage - 1) * 0.18;
  return {
    hp: Math.pow(2.1, tier - 1) * deep * ng,
    atk: Math.pow(1.8, tier - 1) * (1 + (stage - 1) * 0.1) * ng,
    def: Math.pow(1.3, tier - 1) * (1 + (stage - 1) * 0.05),
  };
}

/** 보스 제한 시간 (초) */
export const BOSS_TIME_LIMIT = 300;
