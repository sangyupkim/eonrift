import { SCRIPTS, type Step } from './story';
import { ITEMS, ORE_TIERS, TIER_MANA_METAL, TIER_PLANK, TIER_PLATE, WOOD_TIERS } from './items';
import { TIER_INGOT } from './tools';

export type NpcRef = 'chief' | 'guide' | 'smith' | 'engineer' | 'merchant' | 'stranger' | 'trainer' | 'researcher';

export type Objective =
  | { type: 'kill'; count: number; minTier?: number; label?: string }
  | { type: 'elite'; count: number; minTier?: number }
  | { type: 'gather'; item: string; count: number }
  | { type: 'deliver'; item: string; count: number }
  | { type: 'build'; building: string; count: number }
  | { type: 'craft'; item: string; count: number }
  | { type: 'clear'; stage: number; label: string }
  | { type: 'stages'; count: number; minTier?: number }
  /** 도감에 발견한 종족 수 (지금 상태) */
  | { type: 'discover'; count: number }
  /** 특정 종족 처치 */
  | { type: 'killSpecies'; species: string; count: number; label: string };

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
  /** 이만큼 스테이지를 깨야 받을 수 있다 (단계별 서브 퀘스트) */
  requireCleared?: number;
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
    id: 'm_research',
    npc: 'researcher',
    kind: 'main',
    title: '몬스터 연구',
    after: ['m2_tools'],
    offer: [
      say('노아', '반가워! 나는 틈새의 몬스터를 연구하는 노아야. 여긴 몬스터마다 버릇이 달라서 연구할 게 끝이 없거든.'),
      say('노아', '해골은 한 번 쓰러져도 다시 일어나고, 슬라임은 쪼개지고, 망령은 공격을 흘려 버려. 서로 다른 몬스터를 네 종류만 쓰러뜨리고 와 줄래?'),
    ],
    pending: [say('노아', '서로 다른 몬스터 네 종류! 처음 잡는 몬스터는 자동으로 도감에 기록돼.')],
    complete: [
      say('노아', '대단해! 기록이 벌써 이만큼이나. 이제부터 도감을 함께 채우자.'),
      say('노아', '종족마다 정해진 수를 쓰러뜨리거나 새 종족을 발견하면 나한테 와. 보상을 주고, 연구가 쌓일수록 네 공격력과 체력도 올려 줄게.'),
    ],
    objectives: [{ type: 'discover', count: 4 }],
    rewards: { gold: 300, exp: 150, items: { potion: 3 }, flags: ['bestiary'] },
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

/**
 * 단계별 서브 퀘스트: NPC 7명 × 단계 1~7 × 2개.
 * 단계 t의 퀘스트는 그 단계 차원문이 열리면 받을 수 있고, 두 번째는 첫 번째를 끝내야 열린다.
 */
const PLACE = ['이끼 낀 숲 유적', '붉은 협곡', '얼어붙은 동굴', '수정 광맥', '마공학 공장 폐허', '용암 심연', '부서진 차원'];
const ITEM_NAME = (id: string) => ITEMS[id]?.name ?? id;
const ESS = (t: number) => (t <= 3 ? 'essence_low' : t <= 5 ? 'essence_mid' : 'essence_high');
const ESS_NAME = (t: number) => (t <= 3 ? '하급' : t <= 5 ? '중급' : '상급');

interface SubTemplate {
  npc: NpcRef;
  name: string;
  /** 이 NPC의 퀘스트를 받으려면 먼저 끝내야 하는 메인 퀘스트 */
  after: string;
  make: (t: number) => [Omit<QuestDef, 'id' | 'npc' | 'kind' | 'after' | 'requireCleared'>, Omit<QuestDef, 'id' | 'npc' | 'kind' | 'after' | 'requireCleared'>];
}

/** 노아의 단계별 연구 대상: [종족, 이름, 수, 종족, 이름, 수] */
const RESEARCH_TARGETS: [string, string, number, string, string, number][] = [
  ['slime', '슬라임', 20, 'skel_warrior', '해골 전사', 10],
  ['goblin', '고블린', 25, 'orc_shaman', '오크 주술사', 6],
  ['skel_warrior', '해골 전사', 20, 'necromancer', '강령술사', 5],
  ['crystal_spider', '수정 거미', 15, 'delf_witch', '다크엘프 마녀', 8],
  ['iron_spider', '강철 거미', 15, 'mech_knight', '마공 기사', 8],
  ['lava_imp', '화염 임프', 25, 'fire_orc', '화염 광전사', 10],
  ['void_wraith', '공허 망령', 15, 'void_witch', '공허 마녀', 10],
];
const RESEARCH_HINT: Record<string, string> = {
  slime: '쓰러뜨리면 작게 쪼개지니까 조각까지 정리해야 해.',
  skel_warrior: '한 번 무너져도 다시 일어나니 방심하지 마.',
  orc_shaman: '동료를 치유하니까 먼저 노려.',
  necromancer: '해골을 불러내고 저주를 걸어. 저주에 걸리면 주는 피해가 줄어.',
  delf_witch: '마법에 맞으면 한동안 스킬을 못 써.',
  mech_knight: '방패로 정면을 막으니 옆이나 뒤를 노려.',
  fire_orc: '맞으면 화상을 입어. 격노하면 더 빨라져.',
  void_witch: '침묵 마법을 조심해.',
  goblin: '겁이 많아서 불리하면 도망쳐.',
};

const gold = (t: number, k: number) => Math.round((150 + 200 * t) * k);
const exp = (t: number, k: number) => Math.round((60 + 90 * t * t) * k);

const TEMPLATES: SubTemplate[] = [
  {
    npc: 'chief',
    name: '에단',
    after: 'm1_hunt',
    make: (t) => [
      {
        title: `${PLACE[t - 1]} 경계`,
        offer: [say('에단', `${PLACE[t - 1]}에서 넘어오는 몬스터가 늘었다는구나. ${t}단계 이상 몬스터를 ${60 + 20 * t}마리 정리해 주겠느냐?`)],
        pending: [say('에단', `${t}단계 이상의 몬스터여야 한다. 조심하거라.`)],
        complete: [say('에단', '마을이 한결 조용해졌구나. 고맙다.')],
        objectives: [{ type: 'kill', count: 60 + 20 * t, minTier: t }],
        rewards: { gold: gold(t, 1), exp: exp(t, 1), items: { potion: 2 } },
      },
      {
        title: `${PLACE[t - 1]}의 정예`,
        offer: [say('에단', `${PLACE[t - 1]}의 정예들이 무리를 이끌고 있다. ${2 + t}마리만 쓰러뜨려 다오.`)],
        pending: [say('에단', '금빛으로 번쩍이는 놈들이 정예다.')],
        complete: [say('에단', '역시 믿을 만하구나. 이것을 받아라.')],
        objectives: [{ type: 'elite', count: 2 + t, minTier: t }],
        rewards: { gold: gold(t, 1.4), exp: exp(t, 1.3), items: { [TIER_PLATE[t - 1]]: 1 } },
      },
    ],
  },
  {
    npc: 'guide',
    name: '리아',
    after: 'm2_tools',
    make: (t) => [
      {
        title: `${PLACE[t - 1]} 탐사`,
        offer: [say('리아', `${PLACE[t - 1]} 지도를 그리는 중이야. ${t}단계 방을 4개만 더 돌파해 줄래?`)],
        pending: [say('리아', `${t}단계 이상의 방이면 돼. 워프 게이트까지 가야 한 방이야!`)],
        complete: [say('리아', '덕분에 지도가 훨씬 자세해졌어!')],
        objectives: [{ type: 'stages', count: 4, minTier: t }],
        rewards: { gold: gold(t, 1), exp: exp(t, 1.1), items: { return_stone: 1 } },
      },
      {
        title: `${PLACE[t - 1]}의 목재`,
        offer: [say('리아', `모닥불 광장을 넓히려고 해. ${ITEM_NAME(WOOD_TIERS[t - 1])}을(를) ${20 + 5 * t}개 베어 올 수 있어? 벌목지에 가면 금방일 거야.`)],
        pending: [say('리아', '이번에 새로 베는 나무만 세어 줄게!')],
        complete: [say('리아', '불이 훨씬 따뜻해지겠다. 고마워!')],
        objectives: [{ type: 'gather', item: WOOD_TIERS[t - 1], count: 20 + 5 * t }],
        rewards: { gold: gold(t, 1.2), exp: exp(t, 1.1), items: { potion: 3 } },
      },
    ],
  },
  {
    npc: 'smith',
    name: '고른',
    after: 'm2_tools',
    make: (t) => [
      {
        title: `${ITEM_NAME(TIER_INGOT[t - 1])} 납품`,
        offer: [say('고른', `새 모루를 만들려는데 ${ITEM_NAME(TIER_INGOT[t - 1])}이(가) ${6 + 2 * t}개 필요하네. 구해 오겠나?`)],
        pending: [say('고른', '주괴는 제련로에서 광석을 녹이면 나오지.')],
        complete: [say('고른', '좋은 쇳물이군. 수고했네.')],
        objectives: [{ type: 'deliver', item: TIER_INGOT[t - 1], count: 6 + 2 * t }],
        rewards: { gold: gold(t, 1.2), exp: exp(t, 1), items: { [TIER_PLATE[t - 1]]: 1 } },
      },
      {
        title: `${ITEM_NAME(TIER_PLATE[t - 1])} 견본`,
        offer: [say('고른', `견습생들에게 보여 줄 ${ITEM_NAME(TIER_PLATE[t - 1])} 견본이 ${2 + t}장 필요하네. 제작대에서 만들어 오게.`)],
        pending: [say('고른', '판은 주괴 2개와 같은 단계 판자 2개로 만들지.')],
        complete: [say('고른', '반듯하게 잘 만들었군. 자네도 대장장이 소질이 있어.')],
        objectives: [{ type: 'deliver', item: TIER_PLATE[t - 1], count: 2 + t }],
        rewards: { gold: gold(t, 1.6), exp: exp(t, 1.3) },
      },
    ],
  },
  {
    npc: 'engineer',
    name: '세라',
    after: 'm4_factory',
    make: (t) => [
      {
        title: `${t}단계 공장 시험 가동`,
        offer: [say('세라', `공장 설비 점검 중이야. 공장에서 ${ITEM_NAME(TIER_INGOT[t - 1])}을(를) ${10 + 5 * t}개 새로 생산해 줘.`)],
        pending: [say('세라', '출하 상자에 새로 들어온 것만 셀게!')],
        complete: [say('세라', '가동률 좋아! 데이터 고마워.')],
        objectives: [{ type: 'craft', item: TIER_INGOT[t - 1], count: 10 + 5 * t }],
        rewards: { gold: gold(t, 1.1), exp: exp(t, 1), items: { [ESS(t)]: 3 + t } },
      },
      {
        title: `${ITEM_NAME(TIER_MANA_METAL[t - 1])} 연구`,
        offer: [say('세라', `마력 금속의 성질을 연구하고 있어. ${ITEM_NAME(TIER_MANA_METAL[t - 1])} ${2 + t}개를 가져다줄래? 마력 주입기에서 만들 수 있어.`)],
        pending: [say('세라', '마력 주입기에 주괴와 마력 정수를 함께 넣으면 돼.')],
        complete: [say('세라', '이걸로 새 논문을 쓸 수 있겠어!')],
        objectives: [{ type: 'deliver', item: TIER_MANA_METAL[t - 1], count: 2 + t }],
        rewards: { gold: gold(t, 1.8), exp: exp(t, 1.4), items: { [ESS(t)]: 4 + t } },
      },
    ],
  },
  {
    npc: 'merchant',
    name: '무트',
    after: 'm2_tools',
    make: (t) => [
      {
        title: `${ITEM_NAME(ORE_TIERS[t - 1])} 거래`,
        offer: [say('무트', `${ITEM_NAME(ORE_TIERS[t - 1])} 시세가 좋아! ${15 + 5 * t}개만 넘겨주면 두둑이 쳐 줄게.`)],
        pending: [say('무트', '광맥지에 가면 한 번에 많이 캘 수 있다던데?')],
        complete: [say('무트', '거래 성사! 역시 자네와는 말이 통해.')],
        objectives: [{ type: 'deliver', item: ORE_TIERS[t - 1], count: 15 + 5 * t }],
        rewards: { gold: gold(t, 1.6), exp: exp(t, 0.8) },
      },
      {
        title: `${ITEM_NAME(TIER_PLANK[t - 1])} 주문`,
        offer: [say('무트', `가게 선반을 새로 짜려는데 ${ITEM_NAME(TIER_PLANK[t - 1])} ${10 + 4 * t}개가 필요해. 벌목소에서 켜 올 수 있지?`)],
        pending: [say('무트', '판자는 벌목소에서 나무를 켜면 나온다네.')],
        complete: [say('무트', '튼튼한 판자군! 여기, 약속한 돈이야.')],
        objectives: [{ type: 'deliver', item: TIER_PLANK[t - 1], count: 10 + 4 * t }],
        rewards: { gold: gold(t, 1.8), exp: exp(t, 0.9), items: { potion: 2 } },
      },
    ],
  },
  {
    npc: 'trainer',
    name: '카엘',
    after: 'm1_hunt',
    make: (t) => [
      {
        title: `${t}단계 실전 훈련`,
        offer: [say('카엘', `훈련장에서 배운 걸 실전에서 써 봐라. ${t}단계 이상 몬스터 ${80 + 30 * t}마리.`)],
        pending: [say('카엘', '숫자를 세는 건 내 일이다. 넌 싸우기만 해.')],
        complete: [say('카엘', '움직임이 좋아졌군. 계속 정진해라.')],
        objectives: [{ type: 'kill', count: 80 + 30 * t, minTier: t }],
        rewards: { gold: gold(t, 1), exp: exp(t, 1.5) },
      },
      {
        title: `${t}단계 연속 돌파`,
        offer: [say('카엘', `쉬지 않고 밀고 나가는 법을 익혀라. ${t}단계 이상의 방을 6개 돌파해.`)],
        pending: [say('카엘', '물약은 아껴 쓰되, 아끼다 쓰러지진 마라.')],
        complete: [say('카엘', '끈기가 있군. 이건 상이다.')],
        objectives: [{ type: 'stages', count: 6, minTier: t }],
        rewards: { gold: gold(t, 1.3), exp: exp(t, 1.8), items: { [TIER_PLATE[t - 1]]: 1 } },
      },
    ],
  },
  {
    npc: 'researcher',
    name: '노아',
    after: 'm_research',
    make: (t) => {
      const [a, an, ac, b, bn, bc] = RESEARCH_TARGETS[t - 1];
      return [
        {
          title: `${an} 연구`,
          offer: [say('노아', `${an}의 습성을 더 알고 싶어. ${ac}마리만 쓰러뜨려 줄래? ${RESEARCH_HINT[a] ?? ''}`)],
          pending: [say('노아', `${an} ${ac}마리! 기록은 내가 알아서 할게.`)],
          complete: [say('노아', '좋은 자료가 모였어. 고마워!')],
          objectives: [{ type: 'killSpecies', species: a, count: ac, label: `${an} 처치` }],
          rewards: { gold: gold(t, 1.2), exp: exp(t, 1.1), items: { [ESS(t)]: 2 + t } },
        },
        {
          title: `${bn} 표본`,
          offer: [say('노아', `이번엔 ${bn}이야. 까다로운 녀석이지만 ${bc}마리만 부탁해. ${RESEARCH_HINT[b] ?? ''}`)],
          pending: [say('노아', `${bn}, 조심해!`)],
          complete: [say('노아', '완벽해! 도감 연구가 한 걸음 더 나아갔어.')],
          objectives: [{ type: 'killSpecies', species: b, count: bc, label: `${bn} 처치` }],
          rewards: { gold: gold(t, 1.6), exp: exp(t, 1.4), items: { [TIER_PLATE[t - 1]]: 2 } },
        },
      ];
    },
  },
  {
    npc: 'stranger',
    name: '???',
    after: 'm1_hunt',
    make: (t) => [
      {
        title: `${ESS_NAME(t)} 정수의 속삭임`,
        offer: [say('???', `…${ESS_NAME(t)} 마력 정수 ${5 + 2 * t}개. 그것이면 틈새의 목소리를 조금 더 들을 수 있다.`)],
        pending: [say('???', '…정수를. 서두를 필요는 없다.')],
        complete: [say('???', '…고맙다. 틈새가 너를 기억할 것이다.')],
        objectives: [{ type: 'deliver', item: ESS(t), count: 5 + 2 * t }],
        rewards: { gold: gold(t, 1.2), exp: exp(t, 1.2), items: { [TIER_PLATE[t - 1]]: 1 } },
      },
      {
        title: `${PLACE[t - 1]}의 광맥`,
        offer: [say('???', `${PLACE[t - 1]}의 돌에는 기억이 스며 있다. ${ITEM_NAME(ORE_TIERS[t - 1])}을(를) ${20 + 5 * t}개 캐 와라.`)],
        pending: [say('???', '…새로 캐낸 것이어야 한다.')],
        complete: [say('???', '…그래, 이 돌이다. 대가를 주지.')],
        objectives: [{ type: 'gather', item: ORE_TIERS[t - 1], count: 20 + 5 * t }],
        rewards: { gold: gold(t, 1.4), exp: exp(t, 1.2), items: { return_stone: 1 } },
      },
    ],
  },
];

export const TIER_SUB_QUESTS: QuestDef[] = TEMPLATES.flatMap((tpl) =>
  Array.from({ length: 7 }, (_, i) => i + 1).flatMap((t) => {
    const [a, b] = tpl.make(t);
    const idA = `t_${tpl.npc}_${t}a`;
    const idB = `t_${tpl.npc}_${t}b`;
    // 단계 t의 차원문이 열려야 받을 수 있다 (1단계는 처음부터)
    const requireCleared = (t - 1) * 10;
    return [
      { ...a, id: idA, npc: tpl.npc, kind: 'sub', after: [tpl.after], requireCleared },
      { ...b, id: idB, npc: tpl.npc, kind: 'sub', after: [tpl.after, idA], requireCleared },
    ] as QuestDef[];
  }),
);

export const ALL_QUESTS: QuestDef[] = [...MAIN_QUESTS, ...SUB_QUESTS, ...TIER_SUB_QUESTS];
export const QUEST_BY_ID: Record<string, QuestDef> = Object.fromEntries(ALL_QUESTS.map((q) => [q.id, q]));
