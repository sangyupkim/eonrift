import { describe, expect, it } from 'vitest';
import { STACK_SIZE } from '../src/config';
import { Bag } from '../src/game/Bag';

describe('Bag', () => {
  it('같은 아이템은 한 칸에 쌓는다', () => {
    const bag = new Bag(3);
    bag.add('wood', 3);
    bag.add('wood', 2);
    expect(bag.slots[0]).toEqual({ itemId: 'wood', count: 5 });
    expect(bag.slots[1]).toBeNull();
  });

  it('칸이 가득 차면 넣은 만큼만 돌려준다', () => {
    const bag = new Bag(2);
    expect(bag.add('wood', STACK_SIZE)).toBe(STACK_SIZE);
    expect(bag.add('iron_ore', STACK_SIZE + 5)).toBe(STACK_SIZE);
    expect(bag.add('wood', 1)).toBe(0);
    expect(bag.totals().get('iron_ore')).toBe(STACK_SIZE);
  });
});
