import { CLASSES, CLASS_ORDER, expToNext, MAX_LEVEL, POINTS_PER_LEVEL, STAT_KEYS, type BaseStats, type ClassId, type StatKey } from '../data/classes';
import { equipStats, type Equip, type EquipSlot } from '../data/equipment';
import { FACTORY_SIZES } from '../data/factory';
import type { FactoryState } from '../factory/sim';
import type { Slot } from './Bag';
import { newQuestState, type QuestState } from './Quests';

export interface ClassState {
  level: number;
  exp: number;
  equipment: Partial<Record<EquipSlot, Equip>>;
  /** 직접 찍은 스탯 */
  alloc: BaseStats;
  /** 남은 스탯 포인트 */
  points: number;
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
  /** 획득한 차원석 (단계 번호) */
  dimStones: number[];
  /** 클리어한 가장 높은 스테이지 번호 (1-1 = 1, 1-10 = 10, 2-1 = 11 …) */
  cleared: number;
  quests: QuestState;
  flags: Record<string, number>;
  ngPlus: number;
  factory: FactoryState;
  lastSaved: number;
  settings: { shadows: boolean; sound: boolean };
}

const KEY = 'yeongeop-teumsae-save-v1';
export const DIM_BAG_START = 4;
export const DIM_BAG_MAX = 12;

export function newSave(): SaveData {
  const cls = (id: ClassId): ClassState => ({ level: 1, exp: 0, equipment: { weapon: starterWeapon(id) }, alloc: zeroStats(), points: 0 });
  return {
    version: 1,
    gold: 100,
    currentClass: 'sword',
    classes: { sword: cls('sword'), mage: cls('mage'), archer: cls('archer') },
    unlockedClasses: ['sword'],
    storage: { potion: 3 },
    equips: [],
    dimBag: Array.from({ length: DIM_BAG_START }, () => null),
    dimStones: [],
    cleared: 0,
    quests: newQuestState(),
    flags: {},
    ngPlus: 0,
    factory: { sizeLevel: 0, buildings: [] },
    lastSaved: Date.now(),
    settings: { shadows: true, sound: true },
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
      atk: main * 2 + lv,
      def: Math.floor(b.vit * 0.4),
      crit: 5 + b.dex * 0.3,
      speed: 1 + Math.min(0.6, b.dex * 0.006),
      base: b,
    };
    for (const e of Object.values(c.equipment)) {
      if (!e) continue;
      const st = equipStats(e);
      s.atk += st.atk;
      s.def += st.def;
      s.maxHp += st.hp;
      s.maxMp += st.mp;
      s.crit += st.crit;
    }
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

  // ---- 공유 창고 ----
  count(id: string): number {
    return this.data.storage[id] ?? 0;
  }
  take(id: string, n: number): boolean {
    if (this.count(id) < n) return false;
    this.data.storage[id] -= n;
    if (this.data.storage[id] === 0) delete this.data.storage[id];
    return true;
  }
  add(id: string, n: number): void {
    this.data.storage[id] = this.count(id) + n;
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
