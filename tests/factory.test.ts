import { describe, expect, it } from 'vitest';
import { Factory, type Storage } from '../src/factory/sim';

function makeStorage(init: Record<string, number>): Storage & { items: Record<string, number> } {
  const items = { ...init };
  return {
    items,
    count: (id) => items[id] ?? 0,
    take: (id, n) => {
      if ((items[id] ?? 0) < n) return false;
      items[id] -= n;
      return true;
    },
    add: (id, n) => {
      items[id] = (items[id] ?? 0) + n;
    },
  };
}

/** 투입 상자 → 레일 → 제련로 → 레일 → 출하 상자, 발전기는 마력선으로 연결 */
function smeltLine(withPower: boolean) {
  const f = new Factory({ sizeLevel: 0, buildings: [] }, 8);
  const storage = makeStorage({ iron_ore: 10, essence_low: 5 });
  f.onOutput = (item) => storage.add(item, 1);
  f.place('input', 0, 0, 0)!.recipe = 'iron_ore';
  f.place('belt', 1, 0, 0);
  f.place('smelter', 2, 0, 0);
  f.place('belt', 3, 0, 0);
  f.place('output', 4, 0, 0);
  if (withPower) {
    f.place('wire', 2, 1, 0);
    f.place('wire', 2, 2, 0);
    f.place('generator', 3, 2, 0);
  }
  return { f, storage };
}

describe('Factory', () => {
  it('전력이 연결되면 광석을 주괴로 만들어 창고로 보낸다', () => {
    const { f, storage } = smeltLine(true);
    for (let i = 0; i < 400; i++) f.step(0.1, storage);
    expect(storage.items.iron_ingot).toBeGreaterThanOrEqual(8);
    expect(storage.items.essence_low).toBeLessThan(5);
  });

  it('전력이 없으면 가공하지 않는다', () => {
    const { f, storage } = smeltLine(false);
    for (let i = 0; i < 400; i++) f.step(0.1, storage);
    expect(storage.items.iron_ingot ?? 0).toBe(0);
  });

  it('오프라인 진행도 같은 결과를 낸다', () => {
    const { f, storage } = smeltLine(true);
    f.simulate(3600, storage);
    expect(storage.items.iron_ingot).toBe(10);
    expect(storage.items.iron_ore).toBe(0);
  });

  it('조립기는 고른 레시피의 재료만 받는다', () => {
    const f = new Factory({ sizeLevel: 0, buildings: [] }, 8);
    const storage = makeStorage({ mana_iron: 2, plank: 2, essence_low: 3 });
    f.onOutput = (item) => storage.add(item, 1);
    f.place('input', 0, 0, 0)!.recipe = 'mana_iron';
    f.place('input', 1, 1, 3)!.recipe = 'plank';
    f.place('belt', 1, 0, 0);
    const asm = f.place('assembler', 2, 0, 0)!;
    asm.recipe = 'stone_low';
    f.place('output', 3, 0, 0);
    f.place('generator', 2, 1, 0);
    f.simulate(60, storage);
    expect(storage.items.stone_low).toBe(2);
  });

  it('철거하면 안에 든 아이템을 돌려준다', () => {
    const f = new Factory({ sizeLevel: 0, buildings: [] }, 8);
    const storage = makeStorage({});
    const belt = f.place('belt', 0, 0, 0)!;
    belt.item = 'wood';
    f.remove(0, 0, storage);
    expect(storage.items.wood).toBe(1);
    expect(f.at(0, 0)).toBeUndefined();
  });
});
