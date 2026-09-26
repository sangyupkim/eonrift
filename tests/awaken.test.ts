import { describe, expect, it } from 'vitest';
import { awakenCost, effectTier, SKILL_AWAKEN, ULT_AWAKEN } from '../src/data/awaken';
import { CLASS_ORDER, CLASSES, ULTIMATES } from '../src/data/classes';
import { ITEMS } from '../src/data/items';

describe('skill awakening', () => {
  it('every skill and ultimate has two named directions', () => {
    for (const c of CLASS_ORDER) {
      expect(SKILL_AWAKEN[c].length).toBe(CLASSES[c].skills.length);
      expect(ULT_AWAKEN[c].length).toBe(ULTIMATES[c].length);
      for (const d of [...SKILL_AWAKEN[c], ...ULT_AWAKEN[c]]) {
        expect(d.a.name && d.a.desc && d.b.name && d.b.desc).toBeTruthy();
        expect(d.a.name).not.toBe(d.b.name);
      }
    }
  });
  it('costs use real top-tier items; ultimates cost more', () => {
    for (const ult of [false, true]) for (const id of Object.keys(awakenCost(ult).items)) expect(ITEMS[id], id).toBeTruthy();
    expect(awakenCost(true).gold).toBeGreaterThan(awakenCost(false).gold);
  });
  it('effect tiers: 1-3 / 4-6 / 7-10', () => {
    expect([1, 3, 4, 6, 7, 10].map(effectTier)).toEqual([0, 0, 1, 1, 2, 2]);
  });
});
