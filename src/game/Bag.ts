import { STACK_SIZE } from '../config';
import type { Equip } from '../data/equipment';

export interface Slot {
  itemId: string;
  count: number;
  /** 장비는 쌓이지 않고 한 칸을 차지한다 */
  equip?: Equip;
}

/** 칸 수가 정해진 가방. 같은 아이템은 한 칸에 STACK_SIZE개까지 쌓인다 */
export class Bag {
  readonly slots: (Slot | null)[];

  constructor(size: number, slots?: (Slot | null)[]) {
    this.slots = slots ?? Array.from({ length: size }, () => null);
  }

  /** 넣은 개수를 돌려준다 (가방이 차면 일부만 들어간다) */
  add(itemId: string, count: number): number {
    let left = count;
    for (const s of this.slots) {
      if (left === 0) break;
      if (s && !s.equip && s.itemId === itemId && s.count < STACK_SIZE) {
        const n = Math.min(left, STACK_SIZE - s.count);
        s.count += n;
        left -= n;
      }
    }
    for (let i = 0; i < this.slots.length && left > 0; i++) {
      if (!this.slots[i]) {
        const n = Math.min(left, STACK_SIZE);
        this.slots[i] = { itemId, count: n };
        left -= n;
      }
    }
    return count - left;
  }

  addEquip(equip: Equip): boolean {
    const i = this.slots.indexOf(null);
    if (i < 0) return false;
    this.slots[i] = { itemId: 'equip', count: 1, equip };
    return true;
  }

  /** 한 칸을 통째로 다른 가방으로 옮긴다. 옮긴 만큼(0이면 실패) 돌려준다 */
  moveTo(index: number, other: Bag): number {
    const s = this.slots[index];
    if (!s) return 0;
    if (s.equip) {
      if (!other.addEquip(s.equip)) return 0;
      this.slots[index] = null;
      return 1;
    }
    const moved = other.add(s.itemId, s.count);
    s.count -= moved;
    if (s.count === 0) this.slots[index] = null;
    return moved;
  }

  /** 아이템을 n개 뺀다. 뺀 개수를 돌려준다 */
  remove(itemId: string, n: number): number {
    let left = n;
    for (let i = this.slots.length - 1; i >= 0 && left > 0; i--) {
      const s = this.slots[i];
      if (!s || s.equip || s.itemId !== itemId) continue;
      const k = Math.min(left, s.count);
      s.count -= k;
      left -= k;
      if (s.count === 0) this.slots[i] = null;
    }
    return n - left;
  }

  get used(): number {
    return this.slots.filter(Boolean).length;
  }

  clear(): void {
    this.slots.fill(null);
  }

  totals(): Map<string, number> {
    const m = new Map<string, number>();
    for (const s of this.slots) if (s && !s.equip) m.set(s.itemId, (m.get(s.itemId) ?? 0) + s.count);
    return m;
  }

  equips(): Equip[] {
    return this.slots.filter((s): s is Slot => !!s?.equip).map((s) => s.equip!);
  }
}
