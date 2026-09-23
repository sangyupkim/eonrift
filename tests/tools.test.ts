import { describe, expect, it } from 'vitest';
import { newTool, toolWear } from '../src/data/tools';
import { Factory, workbenchCap } from '../src/factory/sim';

describe('채집 도구', () => {
  it('자기 단계는 1, 한 단계 위는 3씩 닳고, 그 위는 못 캔다', () => {
    const t = newTool(1);
    expect(toolWear(t, 1)).toBe(1);
    expect(toolWear(t, 2)).toBe(3);
    expect(toolWear(t, 3)).toBeNull();
  });
});

describe('제작대', () => {
  it('마력선으로 발전기와 이으면 에너지가 충전된다', () => {
    const f = new Factory({ sizeLevel: 0, buildings: [] }, 8);
    const wb = f.place('workbench', 0, 0, 0)!;
    f.place('wire', 1, 0, 0);
    f.place('generator', 2, 0, 0)!.buffer = { essence_low: 2 };
    f.simulate(60);
    expect(wb.energy!).toBeGreaterThan(50);
    expect(wb.energy!).toBeLessThanOrEqual(workbenchCap(wb));
  });

  it('전력이 없으면 충전되지 않는다', () => {
    const f = new Factory({ sizeLevel: 0, buildings: [] }, 8);
    const wb = f.place('workbench', 0, 0, 0)!;
    f.simulate(60);
    expect(wb.energy).toBe(0);
  });
});
