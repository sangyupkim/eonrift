import type { DungeonTheme } from './themes';

/**
 * 8장 「갈라진 차원」 (v10): 엔딩 뒤 ???가 보여 주는 차원 포탈 너머의 세계.
 * 8-1~8-10 열 개의 방마다 서로 다른 차원 규칙이 붙는다. 새 재료는 없다 — 전리품은 7단계 것 (더 좋은 등급이 잘 나온다),
 * 파수꾼(8-5)·수문장(8-10)은 세트 장비를 떨어뜨리기도 한다. 8-10 수문장을 처음 쓰러뜨리면 차원 소환사가 합류한다.
 */
export const CH8_TIER = 8;

export const CH8_THEME: DungeonTheme = {
  tier: 7,
  name: '갈라진 차원',
  portalColor: 0xff4af0,
  background: 0x07030f,
  floorA: 0x2a1f3e,
  floorB: 0x33264a,
  wallSide: 0x1a1030,
  wallTop: 0x5a2a7a,
  ambient: 0xe0c8ff,
  sun: 0xffd8f4,
  special: [],
  decor: [
    { kind: 'shard', color: 0xff4af0 },
    { kind: 'shard', color: 0x5ef0ff },
    { kind: 'rock', color: 0x2a1f40 },
    { kind: 'bone', color: 0xd8c8f0 },
  ],
};

/**
 * 차원 규칙
 * - mirror: 쓰러진 몬스터 셋 중 하나가 거울 분신(체력 절반)으로 다시 일어난다
 * - time: 12초마다 4초 동안 몬스터가 가속한다 (이동 +60%)
 * - dark: 빛이 거의 없다 (시야가 좁다)
 * - drift: 무중력 — 내 회피 거리와 적을 밀쳐 내는 힘이 두 배
 * - meteor: 7초마다 내 주변에 운석이 떨어진다 (붉은 원을 피하자)
 * - void: 전투 중 MP가 차오르지 않는 대신 처치할 때마다 MP 6% 회복
 */
export type Ch8Rule = 'mirror' | 'time' | 'dark' | 'drift' | 'meteor' | 'void';
export const CH8_RULES: Record<Ch8Rule, { name: string; text: string; color: number }> = {
  mirror: { name: '거울 세계', text: '쓰러진 몬스터 셋 중 하나가 거울 분신으로 다시 일어난다', color: 0x9ff4ff },
  time: { name: '뒤틀린 시간', text: '12초마다 4초 동안 몬스터가 빨라진다', color: 0xffe08a },
  dark: { name: '칠흑', text: '빛이 거의 없어 시야가 좁다', color: 0x6a5a9a },
  drift: { name: '무중력', text: '회피 거리와 밀쳐 내는 힘이 두 배', color: 0x7affd0 },
  meteor: { name: '별똥비', text: '7초마다 주변에 운석이 떨어진다', color: 0xff6a4a },
  void: { name: '공허', text: 'MP가 차오르지 않지만 처치할 때마다 MP 6% 회복', color: 0xb67cff },
};

export interface Ch8Stage {
  stage: number;
  name: string;
  rules: Ch8Rule[];
}

export const CH8_STAGES: Ch8Stage[] = [
  { stage: 1, name: '거울 호수', rules: ['mirror'] },
  { stage: 2, name: '멈춘 시계탑', rules: ['time'] },
  { stage: 3, name: '칠흑의 숲', rules: ['dark'] },
  { stage: 4, name: '떠도는 섬', rules: ['drift'] },
  { stage: 5, name: '시간의 문', rules: ['time'] },
  { stage: 6, name: '별의 무덤', rules: ['meteor'] },
  { stage: 7, name: '공허 회랑', rules: ['void'] },
  { stage: 8, name: '뒤집힌 성', rules: ['mirror', 'time'] },
  { stage: 9, name: '균열의 심장', rules: ['meteor', 'dark'] },
  { stage: 10, name: '포탈의 옥좌', rules: ['meteor', 'drift'] },
];

/** 몬스터 배율 (7-10 기준): 8-1 ×2.2 → 8-10 ×7.7 */
export function ch8Mult(stage: number): number {
  return 2.2 * Math.pow(1.15, Math.max(1, stage) - 1);
}

/** 8장 장비 행운 (좋은 등급 확률) */
export const CH8_LUCK = 0.35;
/** 세트 장비를 떨어뜨릴 확률: 정예 · 파수꾼 · 수문장 */
export const CH8_SET_DROP = { elite: 0.006, midboss: 0.08, boss: 0.2 };
