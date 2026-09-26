import { CLASSES, CLASS_ORDER, ULTIMATES, expToNext, MAX_LEVEL, POINTS_PER_LEVEL, STAT_KEYS, type BaseStats, type ClassId, type StatKey } from '../data/classes';
import { durability, equipStats, seriesBonus, withSpecials, type Equip, type EquipSlot } from '../data/equipment';
import type { AwakenBranch } from '../data/awaken';
import type { FarmKind } from '../dungeon/generator';
import { specialBonus, specialStats, sumSpecials, type SpecialTotals } from '../data/special';
import { OLD_SET_TOKENS, SET_TOKEN, SETS, setCounts, setLines } from '../data/sets';
import type { Relic } from '../data/relics';
import { newAch, type AchCounter, type AchState } from '../data/achievements';
import { newTool, type ToolKind, type ToolState } from '../data/tools';
import { FACTORY_SIZES, RECIPES, RECIPE_RENAMES } from '../data/factory';
import { ITEM_RENAMES, TIER_PLANK, TIER_PLATE } from '../data/items';
import type { BuildingState, FactoryState } from '../factory/sim';
import { newEndgame, type EndgameState } from '../data/endgame';
import { addBonus, BONUS_CAP, FOODS, TITLES, TRANSCEND_STATS, transcendCost, transcendExp, type Bonus, type BonusKey } from '../data/bonus';
import { BESTIARY, bestiaryId, bestiaryStats, COLLECTION_MILESTONES, killMilestones, RESEARCH_BONUS } from '../data/bestiary';

/** 차원 소환사: 도감에서 이만큼 잡은 종족과 계약할 수 있다 (1000마리면 각성 계약) */
export const PACT_KILLS = 100;
/** 원정대 보너스 단위 · 성장 가속 */
export const ROSTER_STEP = 25;
export const CATCH_UP_RATIO = 0.7;
export const CATCH_UP_EXP = 3;
export const PACT_AWAKEN_KILLS = 1000;
import { Bag, type Slot } from './Bag';
import { BAG_SLOTS } from '../config';
import { newQuestState, type QuestState } from './Quests';

export interface ClassState {
  level: number;
  exp: number;
  equipment: Partial<Record<EquipSlot, Equip>>;
  /** 직접 찍은 스탯 */
  alloc: BaseStats;
  /** 남은 스탯 포인트 */
  points: number;
  /** 스킬 레벨 (0 = 배우지 않음) */
  skills: number[];
  /** 퀵슬롯 3칸에 놓인 스킬 번호 (-1 = 비어 있음) */
  quick: number[];
  /** 고른 궁극기 (0/1) */
  ult?: number;
  /** 궁극기 레벨 [0번, 1번] (없으면 1) */
  ultLv?: number[];
  /** 초월 레벨 (99레벨 뒤), 모은 경험치, 찍은 초월 포인트 */
  tlv?: number;
  texp?: number;
  tpts?: Partial<Record<BonusKey, number>>;
  /** 스킬 각성: 's0'~'s5'(스킬), 'u0'·'u1'(궁극기) → 고른 방향. 키가 있으면 각성한 것 */
  awaken?: Record<string, AwakenBranch>;
  /** 장착한 유물 uid (최대 3개) */
  relics?: string[];
  /** 차원 소환사: 고른 계약 종족 (최대 3) */
  pacts?: string[];
}

export interface RunCheckpoint {
  tier: number;
  stage: number;
  gold: number;
  exp: number;
  time: number;
  stagesCleared: number;
  roomCleared: boolean;
  start: [string, number][];
  startEquips: string[];
  pouch: string[];
  farm?: FarmKind;
  bossKilled?: boolean;
}

export interface SaveData {
  version: number;
  /** 닉네임 (순위표·의견함·머리 위 이름·대화에 쓴다, 1~12자) */
  nickname?: string;
  gold: number;
  currentClass: ClassId;
  classes: Record<ClassId, ClassState>;
  unlockedClasses: ClassId[];
  /** 공유 창고 (아이템 id → 개수) */
  storage: Record<string, number>;
  /** 가진 유물 (모든 직업이 함께 쓴다) */
  relics?: Relic[];
  /** 업적 기록 (v10) */
  ach?: AchState;
  /** 8장 「갈라진 차원」: 깬 가장 높은 방 (0~10) */
  ch8?: { cleared: number };
  /** 착용하지 않은 장비 */
  equips: Equip[];
  dimBag: (Slot | null)[];
  /** 개인 가방 (던전에 들고 가는 일반 가방). 창고와 따로 보관된다 */
  inventory: (Slot | null)[];
  /** 획득한 차원석 (단계 번호) */
  dimStones: number[];
  /** 클리어한 가장 높은 스테이지 번호 (1-1 = 1, 1-10 = 10, 2-1 = 11 …) */
  cleared: number;
  quests: QuestState;
  flags: Record<string, number>;
  /** (없어진 회차 시스템. 예전 저장을 옮길 때만 읽는다) */
  ngPlus?: number;
  /** 엔딩 이후 콘텐츠 기록 */
  end?: EndgameState;
  /** 얻은 칭호 */
  titles?: string[];
  /** 두른 발밑 오라 (주간 시련 등급 번호, 없으면 -1) */
  aura?: number;
  /** 먹은 음식과 효과가 끝나는 시각 */
  food?: { id: string; until: number };
  factory: FactoryState;
  lastSaved: number;
  /** 지금 HP (마을·차원집에 가도 회복되지 않는다). 없으면 가득 */
  hp?: number;
  /** 던전 진행 중 체크포인트 (게임이 꺼지면 이 방으로 돌아온다) */
  run?: RunCheckpoint;
  /** 보스가 다시 나타나는 시각 (키: "단계-방", 값: ms) */
  bossReadyAt?: Record<string, number>;
  /** 채집 특화 맵에 다시 들어갈 수 있는 시각 */
  farmReadyAt?: { wood?: number; ore?: number; gold?: number };
  /** 몬스터 도감: 종족별 처치 수 */
  bestiary?: Record<string, number>;
  /** 도감: 종족별로 받은 처치 보상 수 */
  bestiaryClaim?: Record<string, number>;
  /** 도감: 받은 수집 보상 수 (= 연구 보너스 단계) */
  research?: number;
  /** (예전) 공유 창고 칸 수. 지금은 storageLevel */
  storageSlots?: number;
  /** 공유 창고 레벨 1~10 */
  storageLevel?: number;
  /** 창고 레벨 칸 수 개편(v6.9)을 반영했는지 */
  storageV2?: boolean;
  /** 차원집 일반 창고 (차원집 안의 모든 일반 창고가 함께 쓰는 보관함) */
  homeStorage?: Record<string, number>;
  settings: { shadows: boolean; sound: boolean; music?: number; sfx?: number; autoAim?: boolean; timersOpen?: boolean; questsOpen?: boolean; hiddenQuests?: string[] };
  /** 곡괭이·도끼 내구도 */
  tools: Record<ToolKind, ToolState>;
}

const MAIN_KEY = 'yeongeop-teumsae-save-v1';
/** 테스트 캐릭터는 진짜 저장과 따로 보관한다 */
const TEST_KEY = `${MAIN_KEY}-test`;
let KEY = MAIN_KEY;
/** 저장 칸 바꾸기 (true = 테스트 캐릭터) */
export function useTestSlot(test: boolean): void {
  KEY = test ? TEST_KEY : MAIN_KEY;
}
export function isTestSlot(): boolean {
  return KEY === TEST_KEY;
}
export const DIM_BAG_START = 4;
export const DIM_BAG_MAX = 12;

export function newSave(): SaveData {
  const cls = (id: ClassId): ClassState => ({ level: 1, exp: 0, equipment: { weapon: starterWeapon(id) }, alloc: zeroStats(), points: 0, skills: [1, 0, 0, 0, 0, 0], quick: [0, -1, -1] });
  return {
    version: 1,
    gold: 100,
    currentClass: 'sword',
    classes: { sword: cls('sword'), mage: cls('mage'), archer: cls('archer'), summoner: cls('summoner') },
    unlockedClasses: ['sword'],
    storage: { potion: 3 },
    equips: [],
    dimBag: Array.from({ length: DIM_BAG_START }, () => null),
    inventory: Array.from({ length: BAG_SLOTS }, () => null),
    dimStones: [],
    cleared: 0,
    quests: newQuestState(),
    flags: {},
    end: newEndgame(),
    factory: { sizeLevel: 0, buildings: [] },
    lastSaved: Date.now(),
    settings: { shadows: true, sound: true, music: 0.7, sfx: 0.8 },
    tools: { pickaxe: newTool(), axe: newTool() },
  };
}

export function zeroStats(): BaseStats {
  return { str: 0, int: 0, dex: 0, vit: 0, mag: 0 };
}

/** 스테이지 번호 ↔ 단계·방 */
export function stageOf(g: number): { tier: number; stage: number } {
  return { tier: Math.floor((g - 1) / 10) + 1, stage: ((g - 1) % 10) + 1 };
}
export function stageIndex(tier: number, stage: number): number {
  return (tier - 1) * 10 + stage;
}

/** 직업마다 처음 쥐는 기본 무기 */
export function starterWeapon(cls: ClassId): Equip {
  return { uid: `starter-${cls}`, slot: 'weapon', cls, tier: 1, grade: 0, plus: 0 };
}

/** 저장 JSON 문자열을 검사하고 지금 구조로 바꾼다 (저장 코드 불러오기용) */
export function parseSave(raw: string): SaveData | null {
  try {
    const data = JSON.parse(raw) as SaveData & { maxTier?: number };
    if (!data || data.version !== 1 || !data.classes || !data.currentClass) return null;
    return migrate({ ...newSave(), ...data });
  } catch {
    return null;
  }
}

export function loadSave(): SaveData | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return parseSave(raw);
  } catch {
    return null;
  }
}

/** 공유 창고·일반 창고 한 칸에 쌓이는 수 */
export const STORE_STACK = 100;
/** 공유 창고 레벨 (1~10): Lv.1 24칸, 레벨마다 22칸씩 → Lv.10 222칸 */
export const STORAGE_MAX_LEVEL = 10;
export const storageSlotsFor = (level: number) => 24 + 22 * (Math.max(1, Math.min(STORAGE_MAX_LEVEL, level)) - 1);
/** v6.8의 칸 수 (Lv.1 40칸, 레벨마다 20칸): 이미 레벨을 올린 저장이 칸을 잃지 않게 옮길 때 쓴다 */
const oldSlotsFor = (level: number) => 40 + 20 * (level - 1);
/** 창고 레벨 L → L+1 비용: 골드 + 그 무렵 단계의 판·판자 */
export function storageUpgradeCost(level: number): { gold: number; items: Record<string, number> } | null {
  if (level >= STORAGE_MAX_LEVEL) return null;
  const t = Math.min(6, Math.floor(level * 0.7));
  return { gold: 1500 * level * level, items: { [TIER_PLATE[t]]: 6 + level * 2, [TIER_PLANK[t]]: 8 + level * 2 } };
}
/** 던전에 들고 가는 가방: 기본 20칸, 확장할 때마다 2칸씩 10번 → 최대 40칸 */
export const BAG_MAX_LEVEL = 10;
export const BAG_STEP = 2;
/** 가방 확장 L → L+1 비용 (L = 0~9): 골드 + 그 무렵 단계의 판자·판 */
export function bagUpgradeCost(level: number): { gold: number; items: Record<string, number> } | null {
  if (level >= BAG_MAX_LEVEL) return null;
  const n = level + 1;
  const t = Math.min(6, Math.floor(level * 0.6));
  return { gold: 600 * n * n, items: { [TIER_PLANK[t]]: 4 + n * 2, [TIER_PLATE[t]]: 2 + n } };
}
/** 일반 창고 레벨별 칸 수 */
export const warehouseSlots = (level: number) => 20 * level;
const slotsOf = (r: Record<string, number>) => Object.values(r).reduce((a, n) => a + (n > 0 ? Math.ceil(n / STORE_STACK) : 0), 0);

/** 예전 저장 파일을 지금 구조로 바꾼다 */
function migrate(d: SaveData & { maxTier?: number }): SaveData {
  // v10: 차원 소환사 칸이 없던 저장
  // v10.1: 예전 공용 세트(문장 4종·세트 4종)를 직업별 세트로 바꿨다 → 문장은 설계도로, 예전 세트 장비는 설계도로 돌려준다
  const reToken = (r: Record<string, number> | undefined) => {
    if (!r) return;
    for (const id of OLD_SET_TOKENS)
      if (r[id]) {
        r[SET_TOKEN] = (r[SET_TOKEN] ?? 0) + r[id];
        delete r[id];
      }
  };
  reToken(d.storage);
  reToken(d.homeStorage);
  for (const s of [...(d.inventory ?? []), ...(d.dimBag ?? [])]) if (s && !s.equip && OLD_SET_TOKENS.includes(s.itemId)) s.itemId = SET_TOKEN;
  const oldSet = (e?: Equip) => !!e?.set && !SETS[e.set];
  let refund = 0;
  d.equips = d.equips.filter((e) => (oldSet(e) ? (refund++, false) : true));
  for (const c of Object.values(d.classes)) for (const [k, e] of Object.entries(c.equipment)) if (oldSet(e)) {
    refund++;
    delete (c.equipment as Record<string, Equip | undefined>)[k];
  }
  for (const bag of [d.inventory ?? [], d.dimBag ?? []]) bag.forEach((s, i) => {
    if (s?.equip && oldSet(s.equip)) {
      refund++;
      bag[i] = null;
    }
  });
  if (refund) d.storage[SET_TOKEN] = (d.storage[SET_TOKEN] ?? 0) + refund * 3;
  d.classes.summoner ??= { level: 1, exp: 0, equipment: { weapon: starterWeapon('summoner') }, alloc: zeroStats(), points: 0, skills: [1, 0, 0, 0, 0, 0], quick: [0, -1, -1] };
  const fixSlot = (e: Equip) => {
    if ((e.slot as string) === 'accessory') e.slot = 'ring';
  };
  for (const c of Object.values(d.classes)) {
    c.alloc ??= zeroStats();
    // 스킬 상점 전의 저장은 이미 세 스킬을 다 쓰고 있었으므로 그대로 둔다
    c.skills ??= [1, 1, 1];
    while (c.skills.length < 6) c.skills.push(0);
    c.quick ??= [0, 1, 2].map((i) => ((c.skills[i] ?? 0) > 0 ? i : -1));
    c.points ??= (c.level - 1) * POINTS_PER_LEVEL;
    const eq = c.equipment as Record<string, Equip | undefined>;
    if (eq.accessory) {
      fixSlot(eq.accessory);
      eq.ring = eq.accessory;
      delete eq.accessory;
    }
  }
  d.equips.forEach(fixSlot);
  if (d.cleared === undefined || d.cleared === null) d.cleared = Math.max(0, ((d.maxTier ?? 1) - 1) * 10);
  delete d.maxTier;
  d.quests ??= newQuestState();
  // 회차 시스템이 없어졌다: 엔딩을 본 저장(2회차 이상 포함)은 모든 스테이지와 차원석을 되찾고 '차원의 끝'이 열린다
  if ((d.ngPlus ?? 0) > 0 || d.flags.endingA || d.flags.endingB) {
    d.flags.endgame = 1;
    d.cleared = Math.max(d.cleared, 70);
    d.dimStones = [1, 2, 3, 4, 5, 6, 7];
    for (const f of ['smith3', 'resonatorHint', 'stoneTalk3', 'stoneTalk4', 'stoneTalk5', 'stoneTalk6', 'stoneTalk7']) d.flags[f] = 1;
  }
  delete d.ngPlus;
  d.end = { ...newEndgame(), ...(d.end ?? {}) };
  // 중간보스 퀘스트가 생기기 전에 이미 전설 퀘스트를 받았거나 끝낸 저장은 건너뛴다
  if ((d.quests.done.includes('m5_legend') || d.quests.active.m5_legend) && !d.quests.done.includes('m5_mid')) d.quests.done.push('m5_mid');
  for (const q of d.quests.daily.list) q.accepted ??= q.progress > 0;
  // 예전 방식으로 차원집을 연 저장은 튜토리얼 퀘스트를 끝낸 것으로 본다
  if (d.flags.home && d.quests.done.length === 0) {
    d.quests.done.push('m1_hunt', 'm2_tools', 'm3_essence', 'm4_factory');
    if (d.dimStones.length) d.quests.done.push('m5_legend');
    d.flags.tool_pickaxe = 1;
    d.flags.tool_axe = 1;
  }
  // 예전 투입·출하 상자는 보관상자로 바꾼다
  for (const b of d.factory.buildings as { type: string; mode?: string; buffer?: Record<string, number>; recipe?: string | null }[]) {
    if (b.type === 'input' || b.type === 'output') {
      b.mode = b.type === 'input' ? 'in' : 'out';
      b.type = 'box';
      b.buffer = {};
      b.recipe = null;
    }
    if (b.type === 'generator') b.buffer ??= {};
  }
  // 창고 레벨: 예전 칸 수(확장한 만큼)를 잃지 않는 레벨로 옮긴다. 칸 수가 없던 저장은 쓰는 칸보다 넉넉하게
  // v6.8 창고 레벨(Lv.1 40칸)을 쓰던 저장: 칸이 줄지 않는 새 레벨로
  if (d.storageLevel !== undefined && !d.storageV2) {
    const want = oldSlotsFor(d.storageLevel);
    let lv = d.storageLevel;
    while (lv < STORAGE_MAX_LEVEL && storageSlotsFor(lv) < want) lv++;
    d.storageLevel = lv;
  }
  d.storageV2 = true;
  if (d.storageLevel === undefined) {
    const used = Object.values(d.storage).reduce((a, n) => a + (n > 0 ? Math.ceil(n / STORE_STACK) : 0), 0) + d.equips.length;
    const want = Math.max(d.storageSlots ?? 0, used + 10);
    let lv = 1;
    while (lv < STORAGE_MAX_LEVEL && storageSlotsFor(lv) < want) lv++;
    d.storageLevel = lv;
  }
  // 조립기는 제작대로 합쳐졌다: 지어 둔 조립기는 제작대로 바꾸고, 산 도면 값은 골드로 돌려준다
  for (const b of d.factory.buildings as (Omit<BuildingState, 'type'> & { type: string; energy?: number })[]) {
    if (b.type === 'assembler') {
      for (const [id, n] of Object.entries(b.buffer ?? {})) if (n > 0) d.storage[id] = (d.storage[id] ?? 0) + n;
      if (b.crafting) for (const [id, n] of Object.entries(RECIPES.find((r) => r.id === b.crafting)?.inputs ?? {})) d.storage[id] = (d.storage[id] ?? 0) + n;
      b.type = 'workbench';
      b.level = 1;
      b.buffer = undefined;
      b.crafting = null;
      b.recipe = null;
    }
    if (b.type === 'workbench') {
      delete b.energy;
      b.job ??= null;
      b.out ??= [];
      b.ready ??= [];
      b.progress ??= 0;
    }
  }
  if (d.flags.bp_assembler) {
    d.gold += 1200;
    delete d.flags.bp_assembler;
  }
  for (let lv = 2; lv <= 7; lv++)
    if (d.flags[`bp_assembler_lv${lv}`]) {
      d.gold += 800 * lv;
      delete d.flags[`bp_assembler_lv${lv}`];
    }
  // 광석·나무 개편 전 아이템 id를 새 id로 옮긴다
  const re = (id: string) => ITEM_RENAMES[id] ?? id;
  const reRecord = (r: Record<string, number>) => {
    for (const [id, n] of Object.entries(r)) {
      const to = re(id);
      if (to === id) continue;
      delete r[id];
      r[to] = (r[to] ?? 0) + n;
    }
  };
  reRecord(d.storage);
  for (const s of d.dimBag) if (s && !s.equip) s.itemId = re(s.itemId);
  for (const b of d.factory.buildings) {
    if (b.buffer) reRecord(b.buffer);
    if (b.item) b.item = re(b.item);
    if (b.out) b.out = b.out.map(re);
    if (b.recipe) b.recipe = RECIPE_RENAMES[b.recipe] ?? b.recipe;
    if (b.crafting) b.crafting = RECIPE_RENAMES[b.crafting] ?? b.crafting;
    // 없어진 레시피(강화석·가루·기본 물약 등)는 비운다. 넣어 둔 재료는 버퍼에 남는다
    const known = new Set(RECIPES.map((r) => r.id));
    if (b.recipe && !known.has(b.recipe)) b.recipe = null;
    if (b.crafting && !known.has(b.crafting)) {
      b.crafting = null;
      b.progress = 0;
    }
  }
  d.tools ??= { pickaxe: newTool(), axe: newTool() };
  // 예전 저장: 도구 내구도가 숫자 하나였다
  for (const k of ['pickaxe', 'axe'] as ToolKind[]) {
    const v = d.tools[k] as unknown;
    if (typeof v === 'number') d.tools[k] = { tier: 1, plus: 0, dur: Math.min(v, 150) };
  }
  d.inventory ??= Array.from({ length: BAG_SLOTS }, () => null);
  for (const s of d.inventory) if (s && !s.equip) s.itemId = re(s.itemId);
  // 특수 옵션이 생기기 전의 유니크 이상 장비에도 붙여 준다
  for (const c of Object.values(d.classes)) for (const e of Object.values(c.equipment)) if (e) withSpecials(e);
  d.equips.forEach((e) => withSpecials(e));
  for (const s of [...d.inventory, ...d.dimBag]) if (s?.equip) withSpecials(s.equip);
  return d;
}

export function hasSave(): boolean {
  try {
    return localStorage.getItem(KEY) !== null;
  } catch {
    return false;
  }
}

export function deleteSave(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* 저장소를 쓸 수 없는 환경 */
  }
}

export interface Stats {
  maxHp: number;
  maxMp: number;
  atk: number;
  def: number;
  crit: number;
  /** 공격 속도 배율 (1 = 기본) */
  speed: number;
  base: BaseStats;
}

/** 저장 데이터와 그에 대한 규칙 (능력치 계산, 창고, 경험치) */
export class Progress {
  constructor(public data: SaveData) {}

  save(): void {
    this.data.lastSaved = Date.now();
    try {
      localStorage.setItem(KEY, JSON.stringify(this.data));
    } catch {
      /* 용량 부족 등은 무시 */
    }
  }

  get cls(): ClassState {
    return this.data.classes[this.data.currentClass];
  }

  /** 직업 기본 스탯 + 찍은 스탯 */
  baseStats(clsId: ClassId = this.data.currentClass): BaseStats {
    const c = this.data.classes[clsId];
    const b = CLASSES[clsId].baseStats;
    const out = zeroStats();
    for (const k of STAT_KEYS) out[k] = b[k] + c.alloc[k];
    return out;
  }

  /** 주간 차원 시련 중: 능력치를 고정 스펙으로 (저장하지 않는다) */
  trial = false;

  /** 시련용 고정 스펙: 99레벨, 스탯은 주 스탯 60% · 체력 30% · 민첩 10%, 전 부위 7단계 유니크 +5, 추가 보너스 없음 */
  trialState(clsId: ClassId): ClassState {
    const def = CLASSES[clsId];
    const pts = (MAX_LEVEL - 1) * POINTS_PER_LEVEL;
    const alloc = zeroStats();
    alloc[def.damage === 'physical' ? 'str' : 'int'] = Math.round(pts * 0.6);
    alloc.vit = Math.round(pts * 0.3);
    alloc.dex = pts - alloc[def.damage === 'physical' ? 'str' : 'int'] - alloc.vit;
    const equipment: ClassState['equipment'] = {};
    for (const slot of ['weapon', 'helmet', 'armor', 'pants', 'boots', 'ring', 'necklace'] as EquipSlot[])
      equipment[slot] = { uid: `trial-${slot}`, slot, cls: slot === 'weapon' ? clsId : undefined, tier: 7, grade: 4, plus: 5 };
    return { ...this.data.classes[clsId], level: MAX_LEVEL, alloc, equipment, tpts: {} };
  }

  stats(clsId: ClassId = this.data.currentClass): Stats {
    const c = this.trial ? this.trialState(clsId) : this.data.classes[clsId];
    const def = CLASSES[clsId];
    const b = zeroStats();
    // 도감 영구 능력치 (시련에서는 없음)
    const bst = this.trial ? null : this.bestiaryStats;
    // 장신구 특수 옵션의 능력치 (시련에서는 없음)
    const sst = this.trial ? null : specialStats(this.specials(clsId));
    // 원정대 보너스: 열린 직업 레벨 합 25마다 모든 능력치 +1 (시련에서는 없음)
    const roster = this.trial ? 0 : this.rosterBonus;
    for (const k of STAT_KEYS) b[k] = def.baseStats[k] + c.alloc[k] + (bst?.[k] ?? 0) + (sst?.[k] ?? 0) + roster;
    const lv = c.level - 1;
    const main = def.damage === 'physical' ? b.str : b.int;
    const s: Stats = {
      maxHp: def.baseHp + b.vit * 10 + lv * 6,
      maxMp: def.baseMp + b.mag * 6 + lv * 2,
      // 공격력은 무기가 중심이고 주 스탯이 무기 위력을 키운다 (아래에서 무기 반영)
      atk: main * 0.5 + lv * 0.3,
      def: Math.floor(b.vit * 0.4),
      crit: 5 + b.dex * 0.3,
      speed: 1 + Math.min(0.6, b.dex * 0.006),
      base: b,
    };
    for (const e of Object.values(c.equipment)) {
      if (!e) continue;
      const st = equipStats(e);
      s.atk += e.slot === 'weapon' ? st.atk * (1 + main / 150) : st.atk;
      s.def += st.def;
      s.maxHp += st.hp;
      s.maxMp += st.mp;
      s.crit += st.crit;
    }
    // 몬스터 도감 연구 보너스 (시련에서는 없음)
    const rb = this.trial ? 1 : 1 + (this.data.research ?? 0) * RESEARCH_BONUS;
    s.atk *= rb;
    s.maxHp = Math.round(s.maxHp * rb);
    // 각인 · 칭호 · 초월 · 음식
    const bo = this.bonuses(clsId);
    s.atk *= 1 + (bo.atk ?? 0);
    s.maxHp = Math.round(s.maxHp * (1 + (bo.hp ?? 0)));
    s.maxMp = Math.round(s.maxMp * (1 + (bo.mp ?? 0)));
    s.def = Math.round(s.def * (1 + (bo.def ?? 0)));
    s.crit += bo.crit ?? 0;
    s.speed *= 1 + (bo.speed ?? 0);
    s.atk = Math.round(s.atk);
    s.crit = Math.round(s.crit * 10) / 10;
    return s;
  }

  /** 착용한 장비의 특수 옵션 합계 (망가진 장비·시련은 없음) */
  specials(clsId: ClassId = this.data.currentClass): SpecialTotals {
    if (this.trial) return {};
    const worn = Object.values(this.data.classes[clsId].equipment).filter((e) => e && durability(e) > 0);
    const lines = worn.flatMap((e) => e?.sp ?? []);
    // 세트 효과 + 장착한 유물
    lines.push(...setLines(setCounts(worn)));
    for (const r of this.equippedRelics(clsId)) lines.push(...r.lines);
    return sumSpecials(lines);
  }

  /** 업적 기록 더하기 */
  achAdd(k: AchCounter, n = 1): void {
    const a = (this.data.ach ??= newAch());
    a.c[k] = (a.c[k] ?? 0) + n;
  }

  /** 계약할 수 있는 종족 (도감 일반 종족 중 100마리 이상) */
  pactEligible(): string[] {
    return BESTIARY.filter((e) => e.rank === 'normal' && this.kills(e.species.id) >= PACT_KILLS).map((e) => e.species.id);
  }
  /** 지금 소환에 쓰는 계약: 고른 것 (없으면 가장 많이 잡은 셋) */
  activePacts(): string[] {
    const ok = new Set(this.pactEligible());
    const chosen = (this.data.classes.summoner.pacts ?? []).filter((id) => ok.has(id));
    if (chosen.length) return chosen.slice(0, 3);
    return [...ok].sort((a, b) => this.kills(b) - this.kills(a)).slice(0, 3);
  }

  /** 이 직업이 장착한 유물 */
  equippedRelics(clsId: ClassId = this.data.currentClass): Relic[] {
    const ids = this.data.classes[clsId].relics ?? [];
    return ids.map((u) => this.data.relics?.find((r) => r.uid === u)).filter((r): r is Relic => !!r);
  }

  /** 각인·칭호·초월·음식 보너스 합계 (한도 적용) */
  bonuses(clsId: ClassId = this.data.currentClass): Bonus {
    const c = this.data.classes[clsId];
    const b: Bonus = {};
    if (this.trial) return b;
    for (const e of Object.values(c.equipment)) if (e && durability(e) > 0) for (const l of e.eng ?? []) addBonus(b, { [l.k]: l.v });
    // 방어구·장신구 계열 옵션 (수호·비전·사냥)
    for (const e of Object.values(c.equipment)) if (e) addBonus(b, seriesBonus(e));
    // 특수 옵션 중 % 능력치 (체력·방어·공격 속도 …)
    addBonus(b, specialBonus(this.specials(clsId)));
    for (const t of TITLES) if (this.data.titles?.includes(t.id)) addBonus(b, t.bonus);
    for (const ts of TRANSCEND_STATS) addBonus(b, { [ts.key]: ts.per }, c.tpts?.[ts.key] ?? 0);
    const food = this.data.food;
    if (food && food.until > Date.now() && FOODS[food.id]) addBonus(b, FOODS[food.id]);
    for (const [k, cap] of Object.entries(BONUS_CAP) as [BonusKey, number][]) if ((b[k] ?? 0) > cap) b[k] = cap;
    return b;
  }
  bonus(k: BonusKey): number {
    return this.bonuses()[k] ?? 0;
  }
  /** 찍은 초월 포인트 합계 (모든 항목) */
  transcendSpent(clsId: ClassId = this.data.currentClass): number {
    return Object.values(this.data.classes[clsId].tpts ?? {}).reduce((a, n) => a + (n ?? 0), 0);
  }
  /** 초월 포인트 n점을 k에 찍는다 (차원 파편이 든다). 성공하면 true */
  spendTranscend(k: BonusKey, n: number): boolean {
    if (n <= 0 || this.transcendPoints() < n) return false;
    const cost = transcendCost(this.transcendSpent(), n);
    if (!this.take('dim_shard', cost)) return false;
    const t = (this.cls.tpts ??= {});
    t[k] = (t[k] ?? 0) + n;
    return true;
  }
  /** 남은 초월 포인트 */
  transcendPoints(clsId: ClassId = this.data.currentClass): number {
    const c = this.data.classes[clsId];
    return (c.tlv ?? 0) - Object.values(c.tpts ?? {}).reduce((a, n) => a + (n ?? 0), 0);
  }

  /** 열린 궁극기 번호들 (수호자의 차원석 + 그 직업의 레벨) */
  unlockedUlts(clsId: ClassId = this.data.currentClass): number[] {
    const lv = this.data.classes[clsId].level;
    return ULTIMATES[clsId].map((u, i) => (this.data.dimStones.includes(u.stone) && lv >= u.level ? i : -1)).filter((i) => i >= 0);
  }
  /** 궁극기 레벨 (기본 1) */
  /** 각성 방향 (각성하지 않았으면 null). key: 's0'~'s5' 스킬, 'u0'·'u1' 궁극기 */
  awakenOf(key: string, clsId: ClassId = this.data.currentClass): AwakenBranch | null {
    if (this.trial) return null;
    return this.data.classes[clsId].awaken?.[key] ?? null;
  }

  ultLevel(index: number, clsId: ClassId = this.data.currentClass): number {
    if (this.trial) return 1;
    return this.data.classes[clsId].ultLv?.[index] ?? 1;
  }
  /** 지금 쓸 궁극기 (없으면 -1) */
  get ultIndex(): number {
    const open = this.unlockedUlts();
    if (!open.length) return -1;
    const want = this.cls.ult ?? open[open.length - 1];
    return open.includes(want) ? want : open[0];
  }

  /** 도감: 처치 기록. 처음 잡은 종족이면 true */
  recordKill(speciesId: string): boolean {
    const id = bestiaryId(speciesId);
    if (!id) return false;
    const b = (this.data.bestiary ??= {});
    b[id] = (b[id] ?? 0) + 1;
    return b[id] === 1;
  }

  /** 도감으로 얻은 영구 능력치 (모든 직업 공통) */
  get bestiaryStats(): Record<StatKey, number> {
    return bestiaryStats((id) => this.kills(id));
  }

  kills(id: string): number {
    return this.data.bestiary?.[id] ?? 0;
  }

  get discovered(): number {
    return Object.values(this.data.bestiary ?? {}).filter((n) => n > 0).length;
  }

  /** 도감에서 받을 수 있는 보상이 있는지 (연구자 머리 위 표시) */
  get bestiaryClaimable(): number {
    let n = 0;
    for (const e of BESTIARY) {
      const got = this.data.bestiaryClaim?.[e.species.id] ?? 0;
      n += killMilestones(e).filter((m, i) => i >= got && this.kills(e.species.id) >= m).length;
    }
    const col = this.data.research ?? 0;
    n += COLLECTION_MILESTONES.filter((m, i) => i >= col && this.discovered >= m.count).length;
    return n;
  }

  allocate(key: StatKey, n = 1): boolean {
    const c = this.cls;
    if (c.points < n) return false;
    c.points -= n;
    c.alloc[key] += n;
    return true;
  }

  get maxTier(): number {
    return Math.min(7, Math.floor(this.data.cleared / 10) + 1);
  }

  /** 원정대 보너스: 열린 직업들의 레벨 합 25마다 모든 능력치 +1 */
  get rosterLevels(): number {
    return this.data.unlockedClasses.reduce((a, id) => a + (this.data.classes[id]?.level ?? 0), 0);
  }
  get rosterBonus(): number {
    return Math.floor(this.rosterLevels / ROSTER_STEP);
  }
  /** 성장 가속: 가장 높은 직업 레벨의 70%에 못 미치는 직업은 경험치 ×3 */
  get catchUpLevel(): number {
    return Math.floor(Math.max(...this.data.unlockedClasses.map((id) => this.data.classes[id]?.level ?? 1)) * CATCH_UP_RATIO);
  }
  get catchUp(): number {
    return this.cls.level < this.catchUpLevel ? CATCH_UP_EXP : 1;
  }

  /** 경험치를 더하고 오른 레벨 수를 돌려준다 */
  /** 마지막 addExp로 오른 초월 레벨 수 */
  transcendUps = 0;

  addExp(n: number): number {
    const c = this.cls;
    n = Math.round(n * (1 + this.bonus('exp')) * this.catchUp);
    this.transcendUps = 0;
    // 99레벨 뒤: 경험치가 초월 레벨로 쌓인다 (레벨마다 초월 포인트 1)
    if (c.level >= MAX_LEVEL) {
      c.texp = (c.texp ?? 0) + n;
      c.tlv ??= 0;
      while (c.texp >= transcendExp(c.tlv)) {
        c.texp -= transcendExp(c.tlv);
        c.tlv++;
        this.transcendUps++;
      }
      return 0;
    }
    c.exp += n;
    let ups = 0;
    while (c.level < MAX_LEVEL && c.exp >= expToNext(c.level)) {
      c.exp -= expToNext(c.level);
      c.level++;
      c.points += POINTS_PER_LEVEL;
      ups++;
    }
    if (c.level >= MAX_LEVEL) c.exp = 0;
    return ups;
  }

  get invBag(): Bag {
    return new Bag(this.data.inventory.length, this.data.inventory);
  }
  get dimBagObj(): Bag {
    return new Bag(this.data.dimBag.length, this.data.dimBag);
  }

  // ---- 공유 창고 ----
  /** 창고에 있는 개수 */
  stored(id: string): number {
    return this.data.storage[id] ?? 0;
  }

  // ---- 공유 창고 칸 (한 칸에 99개, 장비는 한 칸) ----
  get storageCapacity(): number {
    return storageSlotsFor(this.data.storageLevel ?? 1);
  }
  get storageUsed(): number {
    return slotsOf(this.data.storage) + this.data.equips.length;
  }
  /** 창고에 n개를 더 넣을 칸이 있는지 */
  storageFits(id: string, n: number): boolean {
    const cur = this.stored(id);
    return this.storageUsed - Math.ceil(cur / STORE_STACK) + Math.ceil((cur + n) / STORE_STACK) <= this.storageCapacity;
  }
  /** 칸이 허락하는 만큼 넣고 넣은 개수를 돌려준다 (가방에서 직접 넣을 때) */
  depositItem(id: string, n: number): number {
    const cur = this.stored(id);
    const free = Math.max(0, this.storageCapacity - this.storageUsed);
    const room = free * STORE_STACK + (cur % STORE_STACK ? STORE_STACK - (cur % STORE_STACK) : 0);
    const k = Math.max(0, Math.min(n, room));
    if (k > 0) this.add(id, k);
    return k;
  }
  /** 장비를 창고에 넣을 칸이 있는지 */
  get storageHasSlot(): boolean {
    return this.storageUsed < this.storageCapacity;
  }
  /** 가방 확장 단계 (0~10): 칸 수에서 거꾸로 센다 */
  get bagLevel(): number {
    return Math.max(0, Math.round((this.data.inventory.length - BAG_SLOTS) / BAG_STEP));
  }
  get bagUpgrade(): { gold: number; items: Record<string, number> } | null {
    return bagUpgradeCost(this.bagLevel);
  }
  /** 가방을 2칸 늘린다 (돈·재료가 모자라면 false) */
  upgradeBag(): boolean {
    const c = this.bagUpgrade;
    if (!c || this.data.gold < c.gold || !this.hasAll(c.items)) return false;
    this.data.gold -= c.gold;
    this.takeAll(c.items);
    for (let i = 0; i < BAG_STEP; i++) this.data.inventory.push(null);
    return true;
  }

  /** 다음 창고 레벨업 비용 (없으면 최대) */
  get storageUpgrade(): { gold: number; items: Record<string, number> } | null {
    return storageUpgradeCost(this.data.storageLevel ?? 1);
  }

  // ---- 차원집 일반 창고 ----
  /** 차원집에 있으면 일반 창고의 재료도 가진 것으로 친다 (제작·건설·강화) */
  atHome = false;
  get home(): Record<string, number> {
    return (this.data.homeStorage ??= {});
  }
  homeStored(id: string): number {
    return this.data.homeStorage?.[id] ?? 0;
  }
  /** 일반 창고 칸 수: 지어 둔 일반 창고마다 레벨 × 20칸 */
  get homeCapacity(): number {
    return this.data.factory.buildings.filter((b) => b.type === 'warehouse').reduce((a, b) => a + warehouseSlots(b.level ?? 1), 0);
  }
  get homeUsed(): number {
    return slotsOf(this.data.homeStorage ?? {});
  }
  /** 일반 창고에 넣는다 (칸이 모자라면 들어가는 만큼). 넣은 개수 */
  addHome(id: string, n: number): number {
    const cur = this.homeStored(id);
    const free = this.homeCapacity - this.homeUsed;
    const room = free * STORE_STACK + (cur % STORE_STACK ? STORE_STACK - (cur % STORE_STACK) : 0);
    const k = Math.max(0, Math.min(n, room));
    if (k > 0) this.home[id] = cur + k;
    return k;
  }
  takeHome(id: string, n: number): number {
    const k = Math.min(n, this.homeStored(id));
    if (k > 0) {
      this.home[id] -= k;
      if (this.home[id] <= 0) delete this.home[id];
    }
    return k;
  }

  /** 창고 + 개인 가방 + 차원가방에 있는 개수 (재료 소모는 이 합계로 한다). 차원집 안이면 일반 창고도 */
  count(id: string): number {
    let n = this.stored(id) + (this.atHome ? this.homeStored(id) : 0);
    for (const s of this.data.inventory) if (s && !s.equip && s.itemId === id) n += s.count;
    for (const s of this.data.dimBag) if (s && !s.equip && s.itemId === id) n += s.count;
    return n;
  }
  /** 창고에서 먼저, 모자라면 가방에서 뺀다 */
  take(id: string, n: number): boolean {
    if (this.count(id) < n) return false;
    const fromStore = Math.min(n, this.stored(id));
    if (fromStore) {
      this.data.storage[id] -= fromStore;
      if (this.data.storage[id] === 0) delete this.data.storage[id];
    }
    let left = n - fromStore;
    if (left && this.atHome) left -= this.takeHome(id, left);
    if (left) left -= this.invBag.remove(id, left);
    if (left) this.dimBagObj.remove(id, left);
    return true;
  }
  add(id: string, n: number): void {
    this.data.storage[id] = this.stored(id) + n;
  }
  hasAll(items: Record<string, number>): boolean {
    return Object.entries(items).every(([id, n]) => this.count(id) >= n);
  }
  takeAll(items: Record<string, number>): boolean {
    if (!this.hasAll(items)) return false;
    for (const [id, n] of Object.entries(items)) this.take(id, n);
    return true;
  }

  /** 가방 칸들을 창고로 옮긴다 */
  depositSlots(slots: (Slot | null)[]): void {
    for (const s of slots) {
      if (!s) continue;
      if (s.equip) this.data.equips.push(s.equip);
      else this.add(s.itemId, s.count);
    }
  }

  equip(e: Equip): void {
    const c = this.cls;
    const slot = e.slot;
    const prev = c.equipment[slot];
    this.data.equips = this.data.equips.filter((o) => o.uid !== e.uid);
    if (prev) this.data.equips.push(prev);
    c.equipment[slot] = e;
  }

  unequip(slot: EquipSlot): void {
    const c = this.cls;
    const prev = c.equipment[slot];
    if (!prev) return;
    this.data.equips.push(prev);
    delete c.equipment[slot];
  }

  /** 지금 직업이 낄 수 있는 장비인지 */
  canEquip(e: Equip): boolean {
    // 세트 장비는 그 직업만 (방어구·장신구도)
    if (e.set && SETS[e.set]) return SETS[e.set].cls === this.data.currentClass && (e.slot !== 'weapon' || e.cls === this.data.currentClass);
    return e.slot !== 'weapon' || e.cls === this.data.currentClass;
  }

  get factorySize(): number {
    return FACTORY_SIZES[this.data.factory.sizeLevel].size;
  }

  get stoneCount(): number {
    return this.data.dimStones.length;
  }

  /** 보스(5·10번째 방)가 다시 나타날 때까지 남은 시간(ms). 0이면 지금 있다 */
  bossWait(tier: number, stage: number, now = Date.now()): number {
    if (stage !== 5 && stage !== 10) return 0;
    return Math.max(0, (this.data.bossReadyAt?.[`${tier}-${stage}`] ?? 0) - now);
  }

  /** 보스를 쓰러뜨렸다: 재등장 시각을 기록한다 */
  bossDefeated(tier: number, stage: number, respawnMs: number, now = Date.now()): void {
    (this.data.bossReadyAt ??= {})[`${tier}-${stage}`] = now + respawnMs;
  }

  /** 그 단계의 채집 특화 맵이 열렸는지: 그 단계 파수꾼(5번째 방)을 깨야 열린다 */
  farmUnlocked(tier: number): boolean {
    return this.data.cleared >= stageIndex(tier, 5);
  }

  /** 채집 특화 맵에 다시 들어갈 수 있을 때까지 남은 시간(ms) */
  farmWait(kind: FarmKind, now = Date.now()): number {
    return Math.max(0, (this.data.farmReadyAt?.[kind] ?? 0) - now);
  }

  farmEntered(kind: FarmKind, cooldownMs: number, now = Date.now()): void {
    (this.data.farmReadyAt ??= {})[kind] = now + cooldownMs;
  }

  flag(name: string): number {
    return this.data.flags[name] ?? 0;
  }

  setFlag(name: string, v = 1): void {
    this.data.flags[name] = v;
  }

  unlockClass(id: ClassId): void {
    if (!this.data.unlockedClasses.includes(id)) {
      this.data.unlockedClasses.push(id);
      this.data.unlockedClasses.sort((a, b) => CLASS_ORDER.indexOf(a) - CLASS_ORDER.indexOf(b));
    }
  }
}
