import { describe, expect, it } from 'vitest';
import { expScale, goldScale, monsterAtkMult, tierScale } from '../src/data/monsters';

describe('stage progression', () => {
  it('every room is stronger and more rewarding than the previous one (1-1 → 7-10)', () => {
    let prev = { hp: 0, atk: 0, def: 0, exp: 0, gold: 0 };
    for (let t = 1; t <= 7; t++) {
      for (let s = 1; s <= 10; s++) {
        const sc = tierScale(t, s);
        const cur = { hp: sc.hp, atk: sc.atk * monsterAtkMult(t, s), def: sc.def, exp: expScale(t, s), gold: goldScale(t, s) };
        for (const k of Object.keys(cur) as (keyof typeof cur)[]) expect(cur[k]).toBeGreaterThan(prev[k]);
        prev = cur;
      }
    }
  });
  it('3-1 gives clearly more exp than 1-9', () => {
    expect(expScale(3, 1)).toBeGreaterThan(expScale(1, 9) * 3);
  });
});

describe('low-stage exp penalty', () => {
  it('drops in 10-level steps above the stage band, never at tier 7', async () => {
    const { lowStageExpMult } = await import('../src/data/monsters');
    expect(lowStageExpMult(12, 1)).toBe(1);
    expect(lowStageExpMult(19, 1)).toBe(1);
    expect(lowStageExpMult(20, 1)).toBe(0.5);
    expect(lowStageExpMult(30, 1)).toBe(0.25);
    expect(lowStageExpMult(60, 1)).toBe(0.1);
    expect(lowStageExpMult(23, 3)).toBe(1);
    expect(lowStageExpMult(99, 7)).toBe(1);
  });
});
