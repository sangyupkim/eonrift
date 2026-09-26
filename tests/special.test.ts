import { describe, expect, it } from 'vitest';
import { Rng } from '../src/core/rng';
import { ITEMS } from '../src/data/items';
import { EQUIP_SLOTS, rollEquip, withSpecials, type Equip } from '../src/data/equipment';
import { rollSpecials, specialPool, specialRerollCost, SPECIALS } from '../src/data/special';

describe('special options', () => {
  it('each slot / weapon class has 6 distinct options', () => {
    for (const slot of EQUIP_SLOTS)
      for (const cls of slot === 'weapon' ? (['sword', 'mage', 'archer'] as const) : [undefined]) {
        const pool = specialPool(slot, cls);
        expect(pool.length).toBe(6);
        expect(new Set(pool).size).toBe(6);
        for (const k of pool) expect(SPECIALS[k]).toBeTruthy();
      }
  });
  it('unique 1 / legend 2 / dimension 3 lines, no duplicates, none below unique', () => {
    const rng = new Rng(7);
    for (let g = 0; g <= 6; g++)
      for (let i = 0; i < 50; i++) {
        const e: Equip = withSpecials({ uid: 'x', slot: rng.pick(EQUIP_SLOTS), cls: 'mage', tier: 1 + (i % 7), grade: g, plus: 0 });
        const n = Math.max(0, g - 3);
        expect(e.sp?.length ?? 0).toBe(n);
        if (n) expect(new Set(e.sp!.map((l) => l.k)).size).toBe(n);
      }
  });
  it('drops of unique grade come with options', () => {
    const rng = new Rng(3);
    for (let i = 0; i < 2000; i++) {
      const e = rollEquip(rng, 5, 'sword', 3, 0.05);
      expect(e.sp?.length ?? 0).toBe(Math.max(0, e.grade - 3));
    }
  });
  it('locked lines stay, others reroll', () => {
    const e: Equip = withSpecials({ uid: 'x', slot: 'weapon', cls: 'sword', tier: 7, grade: 6, plus: 0 });
    const before = e.sp!.map((l) => ({ ...l }));
    for (let i = 0; i < 20; i++) {
      e.sp = rollSpecials(e, new Rng(100 + i), [0, 2]);
      expect(e.sp[0]).toEqual(before[0]);
      expect(e.sp[2]).toEqual(before[2]);
      expect(new Set(e.sp.map((l) => l.k)).size).toBe(3);
    }
  });
  it('reroll costs use real items and locking costs more', () => {
    for (let g = 4; g <= 6; g++)
      for (let t = 1; t <= 7; t++)
        for (let l = 0; l <= g - 4; l++) {
          const c = specialRerollCost(g, t, l);
          for (const id of Object.keys(c.items)) expect(ITEMS[id], id).toBeTruthy();
          if (l > 0) expect(c.gold).toBeGreaterThan(specialRerollCost(g, t, l - 1).gold);
        }
  });
});
