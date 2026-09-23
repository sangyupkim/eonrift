import { CLASSES, CLASS_ORDER, expToNext, type ClassId } from '../data/classes';
import { equipStats, type Equip, type EquipSlot } from '../data/equipment';
import { FACTORY_SIZES } from '../data/factory';
import type { FactoryState, Storage } from '../factory/sim';
import type { Slot } from './Bag';

export interface ClassState {
  level: number;
  exp: number;
  equipment: Partial<Record<EquipSlot, Equip>>;
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
  maxTier: number;
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
  const cls = (id: ClassId): ClassState => ({ level: 1, exp: 0, equipment: { weapon: starterWeapon(id) } });
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
    maxTier: 1,
    flags: {},
    ngPlus: 0,
    factory: { sizeLevel: 0, buildings: [] },
    lastSaved: Date.now(),
    settings: { shadows: true, sound: true },
  };
}

/** 직업마다 처음 쥐는 기본 무기 */
export function starterWeapon(cls: ClassId): Equip {
  return { uid: `starter-${cls}`, slot: 'weapon', cls, tier: 1, grade: 0, plus: 0 };
}

export function loadSave(): SaveData | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as SaveData;
    if (data.version !== 1) return null;
    // 이후 버전에서 늘어난 항목을 기본값으로 채운다
    return { ...newSave(), ...data };
  } catch {
    return null;
  }
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
}

/** 저장 데이터와 그에 대한 규칙 (능력치 계산, 창고, 경험치) */
export class Progress implements Storage {
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

  stats(clsId: ClassId = this.data.currentClass): Stats {
    const c = this.data.classes[clsId];
    const def = CLASSES[clsId];
    const s: Stats = {
      maxHp: def.baseHp + (c.level - 1) * 14,
      maxMp: def.baseMp + (c.level - 1) * 4,
      atk: def.baseAtk + (c.level - 1) * 3,
      def: Math.floor((c.level - 1) * 0.6),
      crit: 5,
    };
    for (const e of Object.values(c.equipment)) {
      if (!e) continue;
      const st = equipStats(e);
      s.atk += st.atk;
      s.def += st.def;
      s.maxHp += st.hp;
      s.crit += st.crit;
    }
    return s;
  }

  /** 경험치를 더하고 오른 레벨 수를 돌려준다 */
  addExp(n: number): number {
    const c = this.cls;
    c.exp += n;
    let ups = 0;
    while (c.exp >= expToNext(c.level) && c.level < 60) {
      c.exp -= expToNext(c.level);
      c.level++;
      ups++;
    }
    return ups;
  }

  // ---- 창고 (Storage) ----
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
