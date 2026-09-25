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

/** 단계·방에 따른 몬스터 능력치 배율. 같은 단계 안에서도 방이 깊을수록 강해진다 */
export function tierScale(tier: number, stage: number): { hp: number; atk: number; def: number } {
  // 방이 깊을수록 체력 18%·공격 10%씩, 단계가 오를 때마다 체력 ×2.1 · 공격 ×1.8 · 방어 ×1.3
  const deep = 1 + (stage - 1) * 0.18;
  return {
    hp: Math.pow(2.1, tier - 1) * deep,
    atk: Math.pow(1.8, tier - 1) * (1 + (stage - 1) * 0.1),
    def: Math.pow(1.3, tier - 1) * (1 + (stage - 1) * 0.05),
  };
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
}

/** 보스 제한 시간 (초) */
export const BOSS_TIME_LIMIT = 300;
/** 보스를 쓰러뜨린 뒤 다시 나타나기까지 (밀리초): 파수꾼 1시간, 챕터 수호자 4시간 */
export const BOSS_RESPAWN_MS = { midboss: 60 * 60 * 1000, boss: 4 * 60 * 60 * 1000 };
/** 채집 특화 맵(벌목지·광맥지): 어느 단계든 한 번 들어가면 30분 뒤에 다시 들어갈 수 있다 (종류마다 따로) */
export const FARM_COOLDOWN_MS = 30 * 60 * 1000;
export const FARM_NAMES = { wood: '벌목지', ore: '광맥지' } as const;
