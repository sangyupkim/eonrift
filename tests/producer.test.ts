import { describe, expect, it } from 'vitest';
import { PRODUCER_CAP, producerOutputs, producerTime } from '../src/data/factory';
import { Factory, producerStock } from '../src/factory/sim';

describe('생산 건물', () => {
  it('희귀한 광석일수록 오래 걸리고, 레벨만큼 고를 수 있다', () => {
    expect(producerTime('dim_ore')).toBeGreaterThan(producerTime('copper_ore') * 10);
    expect(producerOutputs('oregen', 3)).toEqual(['copper_ore', 'iron_ore', 'gold_ore']);
    expect(producerOutputs('manawell', 2)).toEqual(['essence_low', 'essence_mid']);
  });

  it('전력이 있으면 쌓이고, 오래 두어도 한도에서 멈춘다', () => {
    const f = new Factory({ buildings: [] } as never, 8);
    const g = f.place('generator', 0, 0, 0)!;
    g.buffer = { essence_supreme: 100 };
    const o = f.place('oregen', 1, 0, 0)!;
    f.simulate(25 * 10 + 1);
    expect(producerStock(o)).toBeGreaterThanOrEqual(9);
    f.simulate(8 * 3600);
    expect(producerStock(o)).toBe(PRODUCER_CAP.oregen);
  });

  it('전력이 없으면 만들지 않는다', () => {
    const f = new Factory({ buildings: [] } as never, 8);
    const o = f.place('manawell', 3, 3, 0)!;
    f.simulate(3600);
    expect(producerStock(o)).toBe(0);
  });
});
