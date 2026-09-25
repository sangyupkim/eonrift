import { describe, expect, it } from 'vitest';
import { newSave, parseSave, Progress, STORAGE_MAX_LEVEL, storageSlotsFor, storageUpgradeCost, STORE_STACK } from '../src/game/Progress';
import { Factory } from '../src/factory/sim';

describe('공유 창고 칸', () => {
  it('한 칸에 100개, 칸이 모자라면 들어가는 만큼만', () => {
    const p = new Progress(newSave());
    p.data.storage = {};
    p.data.equips = [];
    p.data.storageLevel = 1;
    const cap = p.storageCapacity;
    expect(cap).toBe(24);
    p.data.storage.iron_ore = (cap - 2) * STORE_STACK;
    expect(p.depositItem('wood', 150)).toBe(150);
    expect(p.depositItem('wood', 100)).toBe(50);
    expect(p.stored('wood')).toBe(200);
    expect(p.depositItem('copper_ore', 5)).toBe(0);
  });

  it('레벨 1~10: 레벨마다 20칸, 비용은 골드와 판·판자, 10레벨이 끝', () => {
    const p = new Progress(newSave());
    expect(storageSlotsFor(10)).toBe(222);
    const c1 = storageUpgradeCost(1)!;
    const c9 = storageUpgradeCost(9)!;
    expect(c9.gold).toBeGreaterThan(c1.gold);
    expect(Object.keys(c9.items).length).toBe(2);
    expect(storageUpgradeCost(STORAGE_MAX_LEVEL)).toBeNull();
    p.data.storageLevel = 10;
    expect(p.storageUpgrade).toBeNull();
  });

  it('예전 저장의 칸 수는 잃지 않는 레벨로 옮긴다', () => {
    const d = parseSave(JSON.stringify({ ...newSave(), storageSlots: 130, storageLevel: undefined, storageV2: undefined }))!;
    expect(storageSlotsFor(d.storageLevel!)).toBeGreaterThanOrEqual(130);
    // v6.8 레벨(Lv.3 = 80칸)은 칸이 줄지 않는 레벨로
    const d2 = parseSave(JSON.stringify({ ...newSave(), storageLevel: 3, storageV2: undefined }))!;
    expect(storageSlotsFor(d2.storageLevel!)).toBeGreaterThanOrEqual(80);
    // 새 게임은 Lv.1 그대로
    expect(parseSave(JSON.stringify(newSave()))!.storageLevel).toBe(1);
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
