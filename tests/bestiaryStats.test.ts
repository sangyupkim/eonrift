import { describe, expect, it } from 'vitest';
import { BESTIARY, bestiaryStats, isStageMaster } from '../src/data/bestiary';

describe('bestiary permanent stats', () => {
  it('nothing below the thresholds', () => {
    const s = bestiaryStats(() => 999);
    expect(Object.values(s).every((v) => v === 0)).toBe(true);
  });
  it('same gain regardless of tier', () => {
    const t1 = BESTIARY.find((e) => e.tier === 1 && e.rank === 'boss')!;
    const t7 = BESTIARY.find((e) => e.tier === 7 && e.rank === 'boss')!;
    const a = bestiaryStats((id) => (id === t1.species.id ? 30 : 0));
    const b = bestiaryStats((id) => (id === t7.species.id ? 30 : 0));
    expect(a).toEqual(b);
    expect(a.str).toBe(2);
  });
  it('stage master needs every normal species of that tier at 1000', () => {
    const list = BESTIARY.filter((e) => e.tier === 2 && e.rank === 'normal').map((e) => e.species.id);
    expect(isStageMaster(2, (id) => (list.includes(id) ? 1000 : 0))).toBe(true);
    expect(isStageMaster(2, (id) => (id === list[0] ? 999 : list.includes(id) ? 1000 : 0))).toBe(false);
  });
});
