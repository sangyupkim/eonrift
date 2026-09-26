import { BESTIARY } from './bestiary';

/**
 * 업적 (v10): 여러 가지 기록을 세고, 목표를 넘기면 영겁의 증표를 받는다. 몇몇 업적은 칭호도 준다.
 * 촌장 에단(업적 보기)과 메뉴에서 볼 수 있다. 받기는 어디서든 된다.
 */
export type AchCounter =
  | 'kills'
  | 'elites'
  | 'bosses'
  | 'dodges'
  | 'potions'
  | 'gold'
  | 'rooms'
  | 'gathers'
  | 'relics'
  | 'mythic'
  | 'sets'
  | 'raids'
  | 'trialDays'
  | 'deaths';

export const COUNTER_NAMES: Record<AchCounter, string> = {
  kills: '몬스터 처치',
  elites: '정예 처치',
  bosses: '파수꾼·수호자 처치',
  dodges: '회피',
  potions: '물약 마시기',
  gold: '번 골드',
  rooms: '돌파한 방',
  gathers: '채집',
  relics: '복원한 유물',
  mythic: '신화 유물',
  sets: '얻은 세트 장비',
  raids: '레이드 처치',
  trialDays: '시련 참여 일수',
  deaths: '쓰러짐',
};

/** 업적을 확인할 때 쓰는 값들 (세는 기록 + 다른 진행도) */
export interface AchCtx {
  c: Partial<Record<AchCounter, number>>;
  towerBest: number;
  riftBest: number;
  rushBest: number;
  transcend: number;
  ch8: number;
  discovered: number;
  classes: number;
  awakened: number;
}

export interface AchDef {
  id: string;
  name: string;
  desc: string;
  value: (c: AchCtx) => number;
  goal: number;
  /** 영겁의 증표 */
  marks: number;
  /** 함께 주는 칭호 이름 (칭호 효과는 bonus.ts의 TITLES) */
  title?: string;
}

const tiered = (id: string, name: string, desc: (n: number) => string, value: (c: AchCtx) => number, goals: [number, number][], titles: Record<number, string> = {}): AchDef[] =>
  goals.map(([goal, marks], i) => ({ id: `${id}${i + 1}`, name: `${name} ${['I', 'II', 'III', 'IV', 'V'][i]}`, desc: desc(goal), value, goal, marks, title: titles[i] }));

const cnt = (k: AchCounter) => (c: AchCtx) => c.c[k] ?? 0;

export const ACHIEVEMENTS: AchDef[] = [
  ...tiered('kill', '몬스터 사냥꾼', (n) => `몬스터 ${n.toLocaleString()}마리 처치`, cnt('kills'), [[1000, 5], [10000, 10], [50000, 20], [200000, 40]], { 3: '학살자' }),
  ...tiered('elite', '정예 사냥', (n) => `정예 ${n.toLocaleString()}마리 처치`, cnt('elites'), [[100, 5], [1000, 12], [5000, 25]]),
  ...tiered('boss', '보스 사냥', (n) => `파수꾼·수호자 ${n.toLocaleString()}번 처치`, cnt('bosses'), [[50, 6], [300, 14], [1000, 30]], { 2: '보스의 천적' }),
  ...tiered('dodge', '구르기 달인', (n) => `회피 ${n.toLocaleString()}번`, cnt('dodges'), [[1000, 4], [10000, 10], [50000, 20]], { 2: '잡히지 않는 자' }),
  ...tiered('potion', '물약 애호가', (n) => `물약 ${n.toLocaleString()}병 마시기`, cnt('potions'), [[200, 4], [1000, 10]]),
  ...tiered('gold', '황금손', (n) => `골드 ${n.toLocaleString()} 벌기 (업데이트 뒤부터)`, cnt('gold'), [[1000000, 6], [10000000, 15], [50000000, 30]], { 2: '황금 군주' }),
  ...tiered('room', '탐험가', (n) => `방 ${n.toLocaleString()}개 돌파`, cnt('rooms'), [[300, 5], [2000, 12], [8000, 25]]),
  ...tiered('gather', '채집가', (n) => `채집 ${n.toLocaleString()}번`, cnt('gathers'), [[1000, 5], [10000, 12]]),
  ...tiered('relic', '유물 수집가', (n) => `유물 ${n}개 복원`, cnt('relics'), [[10, 6], [50, 15], [150, 30]], { 2: '유물 사냥꾼' }),
  { id: 'mythic1', name: '신화의 조각', desc: '신화 등급 유물 복원', value: cnt('mythic'), goal: 1, marks: 15, title: '신화를 깨운 자' },
  ...tiered('set', '세트 장인', (n) => `세트 장비 ${n}개 얻기`, cnt('sets'), [[1, 5], [7, 15], [20, 30]]),
  ...tiered('raid', '레이드 정복자', (n) => `주간 차원 레이드 보스 ${n}번 처치`, cnt('raids'), [[1, 8], [10, 20], [30, 40]], { 1: '차원 포식자 사냥꾼' }),
  ...tiered('trial', '시련의 단골', (n) => `일일 차원 시련 ${n}일 참여`, cnt('trialDays'), [[7, 6], [30, 15], [100, 30]]),
  ...tiered('rush', '끝없는 전장', (n) => `무한 러쉬에서 한 판에 ${n.toLocaleString()}마리 처치`, (c) => c.rushBest, [[300, 6], [1000, 12], [2500, 25], [5000, 40]], { 3: '끝나지 않는 자' }),
  ...tiered('tower', '탑의 등반가', (n) => `무한의 탑 ${n}층 돌파`, (c) => c.towerBest, [[50, 8], [100, 20], [150, 35]]),
  ...tiered('riftx', '심연의 끝', (n) => `심연 균열 ${n}단계 돌파`, (c) => c.riftBest, [[20, 10], [30, 25]]),
  ...tiered('trans', '초월의 길', (n) => `초월 레벨 ${n}`, (c) => c.transcend, [[20, 6], [100, 15], [300, 30]]),
  { id: 'ch8', name: '갈라진 차원 너머', desc: '8장 「갈라진 차원」의 수문장 쓰러뜨리기', value: (c) => c.ch8, goal: 10, marks: 20, title: '포탈 너머의 방랑자' },
  { id: 'dex_all', name: '살아 있는 도감', desc: '도감의 모든 종족 발견 (8장 포함)', value: (c) => c.discovered, goal: BESTIARY.length, marks: 20 },
  { id: 'classes', name: '만능 모험가', desc: '네 직업 모두 99레벨', value: (c) => c.classes, goal: 4, marks: 30, title: '모든 길을 걸은 자' },
  ...tiered('awaken', '각성자', (n) => `스킬·궁극기 ${n}개 각성 (모든 직업 합)`, (c) => c.awakened, [[1, 4], [8, 12], [20, 25]]),
  { id: 'death', name: '죽음도 스승', desc: '100번 쓰러지기', value: cnt('deaths'), goal: 100, marks: 5 },
];
export const ACH_BY_ID: Record<string, AchDef> = Object.fromEntries(ACHIEVEMENTS.map((a) => [a.id, a]));

export interface AchState {
  c: Partial<Record<AchCounter, number>>;
  /** 보상을 받은 업적 */
  done: string[];
}

export function newAch(): AchState {
  return { c: {}, done: [] };
}
