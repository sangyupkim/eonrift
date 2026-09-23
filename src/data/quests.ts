import { SCRIPTS, type Step } from './story';

export type NpcRef = 'chief' | 'guide' | 'smith' | 'engineer' | 'merchant' | 'stranger' | 'trainer';

export type Objective =
  | { type: 'kill'; count: number; minTier?: number; label?: string }
  | { type: 'elite'; count: number }
  | { type: 'gather'; item: string; count: number }
  | { type: 'deliver'; item: string; count: number }
  | { type: 'build'; building: string; count: number }
  | { type: 'craft'; item: string; count: number }
  | { type: 'clear'; stage: number; label: string }
  | { type: 'stages'; count: number };

export interface Reward {
  gold?: number;
  exp?: number;
  items?: Record<string, number>;
  flags?: string[];
  /** 완료 후 재생할 대사 */
  script?: string;
}

export interface QuestDef {
  id: string;
  npc: NpcRef;
  kind: 'main' | 'sub' | 'daily';
  title: string;
  /** 퀘스트를 줄 때 대사 */
  offer: Step[];
  /** 진행 중 말을 걸었을 때 */
  pending?: Step[];
  /** 완료 보고 대사 */
  complete: Step[];
  objectives: Objective[];
  rewards: Reward;
  /** 수락할 때 받는 것 (도구 등) */
  onAccept?: { items?: Record<string, number>; flags?: string[] };
  /** 이 퀘스트를 받을 수 있는 조건 (완료한 퀘스트 id, 플래그 등) */
  after?: string[];
  requireFlags?: string[];
  requireStones?: number;
}

const say = (s: string, t: string): Step => ({ s, t });

/** 메인 퀘스트: 시스템을 하나씩 알려 주는 튜토리얼 흐름 */
export const MAIN_QUESTS: QuestDef[] = [
  {
    id: 'm1_hunt',
    npc: 'guide',
    kind: 'main',
    title: '첫 번째 차원문',
    offer: [say('리아', '북쪽 차원문 광장에서 1-1 차원문에 들어가 봐. 몬스터 스무 마리만 쓰러뜨리고 오면 돼.'), say('리아', '공격 버튼으로 싸우고, 구르기로 빨간 공격 범위를 피해. 방을 전부 정리하면 워프 게이트가 열려.')],
    pending: [say('리아', '차원문은 북쪽 광장에 있어. 몬스터 스무 마리, 잊지 마!')],
    complete: [say('리아', '살아 돌아왔네! …뭐, 여기선 원래 죽지 않지만.'), say('리아', '던전엔 광석이랑 나무도 많았지? 캐려면 도구가 필요해. 대장장이 고른 아저씨한테 가 봐.')],
    objectives: [{ type: 'kill', count: 20 }],
    rewards: { gold: 100, exp: 60, items: { potion: 2 } },
  },
  {
    id: 'm2_tools',
    npc: 'smith',
    kind: 'main',
    title: '곡괭이와 도끼',
    after: ['m1_hunt'],
    offer: [
      say('고른', '리아가 보냈나. 채집을 하려면 연장이 있어야지.'),
      say('고른', '이 곡괭이랑 도끼를 가져가. 광맥이나 결정 앞에서는 곡괭이, 나무 앞에서는 도끼를 저절로 꺼내 쓰게 될 거다.'),
      say('고른', '채집물 앞에서 상호작용(E)을 누르면 캐기 시작한다. 구리광석 10개랑 목재 5개를 캐 와 봐.'),
    ],
    onAccept: { flags: ['tool_pickaxe', 'tool_axe'] },
    pending: [say('고른', '구리광석 10개, 목재 5개. 채집물 앞에서 E를 누르면 된다.')],
    complete: [say('고른', '좋은 손놀림이군. 강화할 게 생기면 언제든 오게.')],
    objectives: [
      { type: 'deliver', item: 'copper_ore', count: 10 },
      { type: 'deliver', item: 'wood', count: 5 },
    ],
    rewards: { gold: 150, exp: 80 },
  },
  {
    id: 'm3_essence',
    npc: 'engineer',
    kind: 'main',
    title: '마력 정수',
    after: ['m2_tools'],
    offer: [
      say('세라', '안녕! 난 마공학자 세라. 몬스터를 쓰러뜨리면 나오는 마력 정수, 본 적 있어?'),
      say('세라', '그게 이 틈새의 에너지원이야. 몬스터 40마리를 쓰러뜨리고 하급 마력 정수 5개를 가져다줄래? 보여 줄 게 있어.'),
    ],
    pending: [say('세라', '몬스터 40마리, 하급 마력 정수 5개! 정수는 쓰러질 때 잃지 않게 차원가방에 넣어 둬.')],
    complete: [say('세라', '완벽해. 이 정수로… 그 문을 열 수 있을 거야.')],
    objectives: [
      { type: 'kill', count: 40 },
      { type: 'deliver', item: 'essence_low', count: 5 },
    ],
    rewards: { gold: 150, exp: 120, flags: ['home'], script: 'home_unlock' },
  },
  {
    id: 'm4_factory',
    npc: 'engineer',
    kind: 'main',
    title: '나만의 공장',
    after: ['m3_essence'],
    offer: [
      say('세라', '이제 차원집에 공장을 지어 보자. 오른쪽 위 망치 버튼으로 건설 모드를 열어.'),
      say('세라', '보관상자(투입)에 구리광석을 넣고 → 레일 → 제련로 → 레일 → 보관상자(출하) 순서로 놓아 봐.'),
      say('세라', '발전기에는 마력 정수를 직접 넣어야 하고, 제련로는 마력선으로 발전기와 이어져 있어야 움직여. 구리 주괴 1개를 만들면 성공!'),
    ],
    pending: [say('세라', '발전기에 정수를 넣었어? 제련로가 마력선에 닿아 있는지도 확인해 봐.')],
    complete: [say('세라', '첫 주괴다! 앞으로 더 좋은 기계 도면은 나한테서 살 수 있어. 기억해 둬.')],
    objectives: [
      { type: 'build', building: 'generator', count: 1 },
      { type: 'build', building: 'smelter', count: 1 },
      { type: 'craft', item: 'copper_ingot', count: 1 },
    ],
    rewards: { gold: 300, exp: 150, items: { essence_low: 5 } },
  },
  {
    id: 'm5_mid',
    npc: 'trainer',
    kind: 'main',
    title: '첫 번째 파수꾼',
    after: ['m4_factory'],
    offer: [
      say('카엘', '공장까지 돌리다니 제법이군. 그럼 이제 진짜 싸움을 배울 차례다.'),
      say('카엘', '1-5에는 파수꾼이 버티고 있다. 체력이 다섯 줄이나 되고, 세 줄을 깎으면 보호막을 치고 수호병을 부르지.'),
      say('카엘', '수호병을 먼저 정리해야 보호막이 깨진다. 물약 넉넉히 챙겨 가라.'),
    ],
    pending: [say('카엘', '1-5의 파수꾼이다. 보호막이 뜨면 수호병부터!')],
    complete: [say('카엘', '해냈군! 파수꾼 정도는 이제 문제없겠어.'), say('카엘', '촌장 에단이 너를 찾더군. 이 틈새의 오래된 이야기를 해 줄 모양이다.')],
    objectives: [{ type: 'clear', stage: 5, label: '1-5 파수꾼 처치' }],
    rewards: { gold: 400, exp: 250, items: { potion: 5, copper_plate: 2 } },
  },
  {
    id: 'm5_legend',
    npc: 'chief',
    kind: 'main',
    title: '틈새의 전설',
    after: ['m5_mid'],
    offer: SCRIPTS.legend,
    pending: [say('에단', '1-10의 끝에 수호자가 있다. 체력이 일곱 줄이고, 보호막을 두 번이나 친다더구나.')],
    complete: [
      say('에단', '정말로… 차원석을 가져왔구나. 이 빛, 몇백 년 만에 보는지.'),
      say('에단', '남은 차원석은 여섯. 각 차원문의 10번째 방에 수호자가 있다.'),
    ],
    objectives: [{ type: 'clear', stage: 10, label: '1-10 수호자 처치 (차원석)' }],
    rewards: { gold: 500, exp: 300, flags: ['legend', 'stone1Talk'] },
  },
];

/** 서브 퀘스트 */
export const SUB_QUESTS: QuestDef[] = [
  {
    id: 's_guide_wood',
    npc: 'guide',
    kind: 'sub',
    title: '마을의 겨울 준비',
    after: ['m2_tools'],
    offer: [say('리아', '여긴 계절이 없지만… 모닥불은 모두를 모이게 해. 목재 20개만 부탁해도 될까?')],
    complete: [say('리아', '고마워! 오늘 밤엔 다 같이 불 앞에 모이자.')],
    objectives: [{ type: 'deliver', item: 'wood', count: 20 }],
    rewards: { gold: 200, exp: 100, items: { potion: 3 } },
  },
  {
    id: 's_merchant_copper',
    npc: 'merchant',
    kind: 'sub',
    title: '철 사재기',
    after: ['m2_tools'],
    requireStones: 1,
    offer: [say('무트', '철 값이 오를 거야, 내 감이 그래. 2단계에서 철광석 15개 가져오면 두둑이 쳐 줄게!')],
    complete: [say('무트', '좋았어! 영원히 사는 곳에서도 돈은 돌고 도는 법이지.')],
    objectives: [{ type: 'deliver', item: 'iron_ore', count: 15 }],
    rewards: { gold: 600, exp: 200 },
  },
  {
    id: 's_smith_elite',
    npc: 'smith',
    kind: 'sub',
    title: '정예의 증표',
    after: ['m2_tools'],
    offer: [say('고른', '금빛으로 빛나는 정예 몬스터를 본 적 있나? 다섯 마리를 쓰러뜨리고 오게. 좋은 걸 주지.')],
    complete: [say('고른', '실력이 늘었군. 이 구리판을 가져가게. 장비를 강화할 때 쓰는 거다.')],
    objectives: [{ type: 'elite', count: 5 }],
    rewards: { gold: 300, exp: 250, items: { copper_plate: 3 } },
  },
  {
    id: 's_engineer_ingot',
    npc: 'engineer',
    kind: 'sub',
    title: '연구용 주괴',
    after: ['m4_factory'],
    offer: [say('세라', '새 기계를 연구 중인데 철 주괴가 모자라. 공장에서 10개만 만들어 줄래?')],
    complete: [say('세라', '이걸로 연구가 한 발짝 나아갔어! 보답으로 받아.')],
    objectives: [{ type: 'deliver', item: 'iron_ingot', count: 10 }],
    rewards: { gold: 800, exp: 300, items: { essence_low: 10 } },
  },
  {
    id: 's_chief_midboss',
    npc: 'chief',
    kind: 'sub',
    title: '파수꾼 토벌',
    after: ['m5_legend'],
    offer: [say('에단', '2-5의 파수꾼이 날뛴다는구나. 마을 사람들이 불안해한다. 정리해 주겠느냐?')],
    complete: [say('에단', '고맙구나. 이 물약들을 가져가거라.')],
    objectives: [{ type: 'clear', stage: 15, label: '2-5 파수꾼 처치' }],
    rewards: { gold: 1000, exp: 500, items: { potion: 5, return_stone: 2 } },
  },
  {
    id: 's_guide_escape',
    npc: 'guide',
    kind: 'sub',
    title: '탈출파의 부탁',
    requireStones: 3,
    offer: [say('리아', '탈출파 사람들이 차원문 장치를 연구하고 싶대. 금광석 20개를 모아 줄 수 있어?')],
    complete: [say('리아', '다들 기뻐할 거야. 정말… 나갈 수 있을지도 몰라.')],
    objectives: [{ type: 'deliver', item: 'gold_ore', count: 20 }],
    rewards: { gold: 1500, exp: 800, items: { gold_plate: 2 } },
  },
];

export const ALL_QUESTS: QuestDef[] = [...MAIN_QUESTS, ...SUB_QUESTS];
export const QUEST_BY_ID: Record<string, QuestDef> = Object.fromEntries(ALL_QUESTS.map((q) => [q.id, q]));
