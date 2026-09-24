import { describe, expect, it } from 'vitest';
import { newSave, Progress, STORAGE_START_SLOTS, STORE_STACK } from '../src/game/Progress';
import { Factory } from '../src/factory/sim';

describe('공유 창고 칸', () => {
  it('한 칸에 99개, 칸이 모자라면 들어가는 만큼만', () => {
    const p = new Progress(newSave());
    p.data.storage = {};
    p.data.storageSlots = 2;
    expect(p.depositItem('wood', 150)).toBe(150);
    expect(p.storageUsed).toBe(2);
    expect(p.depositItem('wood', 100)).toBe(48);
    expect(p.stored('wood')).toBe(198);
    expect(p.depositItem('copper_ore', 5)).toBe(0);
  });

  it('확장 비용이 점점 오르고 최대가 있다', () => {
    const p = new Progress(newSave());
    const c1 = p.storageExpandCost!;
    p.data.storageSlots = STORAGE_START_SLOTS + 10;
    expect(p.storageExpandCost!).toBeGreaterThan(c1);
    p.data.storageSlots = 200;
    expect(p.storageExpandCost).toBeNull();
  });
});

describe('차원집 일반 창고', () => {
  const withWarehouse = (level = 1) => {
    const p = new Progress(newSave());
    const f = new Factory(p.data.factory, 8);
    const w = f.place('warehouse', 3, 3, 0)!;
    w.level = level;
    return { p, f, w };
  };

  it('창고 레벨만큼 칸이 늘고, 여러 채가 하나로 이어진다', () => {
    const { p, f } = withWarehouse(2);
    expect(p.homeCapacity).toBe(40);
    f.place('warehouse', 5, 5, 0);
    expect(p.homeCapacity).toBe(60);
    expect(p.addHome('wood', 60 * STORE_STACK + 10)).toBe(60 * STORE_STACK);
  });

  it('차원집 안에서만 제작 재료로 친다', () => {
    const { p } = withWarehouse();
    p.data.storage = {};
    p.addHome('iron_ingot', 5);
    expect(p.count('iron_ingot')).toBe(0);
    p.atHome = true;
    expect(p.count('iron_ingot')).toBe(5);
    expect(p.take('iron_ingot', 3)).toBe(true);
    expect(p.homeStored('iron_ingot')).toBe(2);
  });

  it('레일로 들어온 아이템을 모은다', () => {
    const { p, f } = withWarehouse();
    f.onStore = (item) => p.addHome(item, 1) === 1;
    const box = f.place('box', 1, 3, 0)!;
    box.buffer = { copper_ore: 5 };
    f.place('belt', 2, 3, 0);
    f.simulate(20);
    expect(p.homeStored('copper_ore')).toBe(5);
  });
});
