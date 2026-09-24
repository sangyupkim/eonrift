import { CLASSES, CLASS_ORDER, expToNext, MAX_LEVEL, POINTS_PER_LEVEL, STAT_KEYS, type BaseStats, type ClassId, type StatKey } from '../data/classes';
import { equipStats, type Equip, type EquipSlot } from '../data/equipment';
import { newTool, type ToolKind, type ToolState } from '../data/tools';
import { FACTORY_SIZES, RECIPES, RECIPE_RENAMES } from '../data/factory';
import { ITEM_RENAMES } from '../data/items';
import type { BuildingState, FactoryState } from '../factory/sim';
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
}

export interface SaveData {
  version: number;
  gold: number;
  currentClass: ClassId;
  classes: Record<ClassId, ClassState>;
  unlockedClasses: ClassId[];
  /** 공유 창고 (아이템 id → 개수) */
  storage: Record<string, number>;
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
  ngPlus: number;
  factory: FactoryState;
  lastSaved: number;
  /** 지금 HP (마을·차원집에 가도 회복되지 않는다). 없으면 가득 */
  hp?: number;
  /** 던전 진행 중 체크포인트 (게임이 꺼지면 이 방으로 돌아온다) */
  run?: RunCheckpoint;
  settings: { shadows: boolean; sound: boolean; music?: number; sfx?: number; autoAim?: boolean };
  /** 곡괭이·도끼 내구도 */
  tools: Record<ToolKind, ToolState>;
}

const KEY = 'yeongeop-teumsae-save-v1';
export const DIM_BAG_START = 4;
export const DIM_BAG_MAX = 12;

export function newSave(): SaveData {
  const cls = (id: ClassId): ClassState => ({ level: 1, exp: 0, equipment: { weapon: starterWeapon(id) }, alloc: zeroStats(), points: 0, skills: [1, 0, 0, 0, 0, 0], quick: [0, -1, -1] });
  return {
    version: 1,
    gold: 100,
    currentClass: 'sword',
    classes: { sword: cls('sword'), mage: cls('mage'), archer: cls('archer') },
    unlockedClasses: ['sword'],
    storage: { potion: 3 },
    equips: [],
    dimBag: Array.from({ length: DIM_BAG_START }, () => null),
    inventory: Array.from({ length: BAG_SLOTS }, () => null),
    dimStones: [],
    cleared: 0,
    quests: newQuestState(),
    flags: {},
    ngPlus: 0,
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
    const data = JSON.parse(raw) as SaveData & { maxTier?: number };
    if (data.version !== 1) return null;
    return migrate({ ...newSave(), ...data });
  } catch {
    return null;
  }
}

/** 예전 저장 파일을 지금 구조로 바꾼다 */
function migrate(d: SaveData & { maxTier?: number }): SaveData {
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

  stats(clsId: ClassId = this.data.currentClass): Stats {
    const c = this.data.classes[clsId];
    const def = CLASSES[clsId];
    const b = this.baseStats(clsId);
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
    s.atk = Math.round(s.atk);
    s.crit = Math.round(s.crit * 10) / 10;
    return s;
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

  /** 경험치를 더하고 오른 레벨 수를 돌려준다 */
  addExp(n: number): number {
    const c = this.cls;
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
  /** 창고 + 개인 가방 + 차원가방에 있는 개수 (재료 소모는 이 합계로 한다) */
  count(id: string): number {
    let n = this.stored(id);
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
    return e.slot !== 'weapon' || e.cls === this.data.currentClass;
  }

  get factorySize(): number {
    return FACTORY_SIZES[this.data.factory.sizeLevel].size;
  }

  get stoneCount(): number {
    return this.data.dimStones.length;
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
