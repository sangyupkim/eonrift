import { describe, expect, it } from 'vitest';
import { mathRng } from '../src/core/rng';
import { ENGRAVE_OPTS, ENGRAVE_STAGES, rollEngrave } from '../src/data/bonus';

describe('engrave rolls', () => {
  it('every stage (1~5) can roll every option, none dominates', () => {
    for (let st = 1; st <= ENGRAVE_STAGES; st++) {
      const c: Record<string, number> = {};
      const N = 5500;
      for (let i = 0; i < N; i++) {
        const k = rollEngrave(st, mathRng).k;
        c[k] = (c[k] ?? 0) + 1;
      }
      expect(Object.keys(c).length).toBe(ENGRAVE_OPTS.length);
      for (const n of Object.values(c)) expect(n).toBeLessThan((N / ENGRAVE_OPTS.length) * 1.5);
    }
  });
});
