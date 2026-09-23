import { STACK_SIZE } from '../config';

export interface Slot {
  itemId: string;
  count: number;
}

/** 칸 수가 정해진 가방. 같은 아이템은 한 칸에 STACK_SIZE개까지 쌓인다 */
export class Bag {
  readonly slots: (Slot | null)[];

  constructor(size: number) {
    this.slots = Array.from({ length: size }, () => null);
  }

  /** 넣은 개수를 돌려준다 (가방이 차면 일부만 들어간다) */
  add(itemId: string, count: number): number {
    let left = count;
    for (const s of this.slots) {
      if (left === 0) break;
      if (s && s.itemId === itemId && s.count < STACK_SIZE) {
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

  clear(): void {
    this.slots.fill(null);
  }

  totals(): Map<string, number> {
    const m = new Map<string, number>();
    for (const s of this.slots) if (s) m.set(s.itemId, (m.get(s.itemId) ?? 0) + s.count);
    return m;
  }
}
