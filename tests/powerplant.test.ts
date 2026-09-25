import { describe, expect, it } from 'vitest';
import { Factory } from '../src/factory/sim';
import { ESSENCE_BOOST, ESSENCE_BURN } from '../src/data/factory';
import { ITEMS } from '../src/data/items';

/** 제련로 n개를 한 발전기에 잇고, 광석을 계속 넣어 둔다 */
const line = (n: number, fuel: Record<string, number>) => {
  const f = new Factory({ sizeLevel: 0, buildings: [] }, 12);
  const gen = f.place('generator', 0, 0, 0)!;
  gen.buffer = { ...fuel };
  const smelters = [];
  for (let i = 0; i < n; i++) {
    f.place('wire', 1 + i, 0, 0);
    const s = f.place('smelter', 1 + i, 1, 1)!;
    s.buffer = { copper_ore: 1 };
    smelters.push(s);
  }
  return { f, gen, smelters };
};
const feed = (ss: { buffer?: Record<string, number>; out?: string[] }[]) =>
  ss.forEach((s) => {
    s.buffer!.copper_ore = 2;
    s.out = [];
  });

describe('마력 발전기', () => {
  it('정수 5단계가 모두 있고 좋은 것일수록 오래 타고 빠르다', () => {
    const ids = ['essence_low', 'essence_mid', 'essence_high', 'essence_supreme', 'essence_dim'];
    for (const id of ids) expect(ITEMS[id], id).toBeTruthy();
    for (let i = 1; i < ids.length; i++) {
      expect(ESSENCE_BURN[ids[i]]).toBeGreaterThan(ESSENCE_BURN[ids[i - 1]]);
      expect(ESSENCE_BOOST[ids[i]]).toBeGreaterThan(ESSENCE_BOOST[ids[i - 1]]);
    }
  });

  it('좋은 정수부터 태우고, 타는 동안 생산이 빨라진다', () => {
    const slow = line(1, { essence_low: 5 });
    const fast = line(1, { essence_low: 5, essence_dim: 1 });
    let madeSlow = 0;
    let madeFast = 0;
    for (let t = 0; t < 120; t++) {
      madeSlow += slow.smelters[0].out?.length ?? 0;
      madeFast += fast.smelters[0].out?.length ?? 0;
      feed(slow.smelters);
      feed(fast.smelters);
      slow.f.step(0.5);
      fast.f.step(0.5);
    }
    expect(fast.gen.fuelId).toBe('essence_dim');
    expect(fast.gen.buffer!.essence_low).toBe(5);
    expect(fast.f.boostOf(fast.smelters[0])).toBeCloseTo(1.8);
    expect(madeFast).toBeGreaterThan(madeSlow);
  });

  it('돌아가는 기계가 많을수록 연료가 빨리 닳는다', () => {
    const one = line(1, { essence_low: 10 });
    const three = line(3, { essence_low: 10 });
    for (let t = 0; t < 600; t++) {
      feed(one.smelters);
      feed(three.smelters);
      one.f.step(1);
      three.f.step(1);
    }
    const used = (x: ReturnType<typeof line>) => 10 - x.gen.buffer!.essence_low;
    expect(used(three)).toBeGreaterThanOrEqual(used(one) * 2.5);
  });
});
