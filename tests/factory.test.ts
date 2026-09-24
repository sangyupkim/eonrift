import { describe, expect, it } from 'vitest';
import { Factory } from '../src/factory/sim';

/** 투입 상자 → 레일 → 제련로 → 레일 → 출하 상자, 발전기는 마력선으로 제련로와 연결 */
function smeltLine(opts: { wire: boolean; fuel: number }) {
  const f = new Factory({ sizeLevel: 0, buildings: [] }, 8);
  const inBox = f.place('box', 0, 0, 0)!;
  inBox.buffer = { copper_ore: 5 };
  f.place('belt', 1, 0, 0);
  f.place('smelter', 2, 0, 0);
  f.place('belt', 3, 0, 0);
  const outBox = f.place('box', 4, 0, 0)!;
  outBox.mode = 'out';
  const gen = f.place('generator', 2, 3, 0)!;
  gen.buffer = { essence_low: opts.fuel };
  if (opts.wire) {
    f.place('wire', 2, 1, 0);
    f.place('wire', 2, 2, 0);
  }
  return { f, inBox, outBox, gen };
}

describe('Factory', () => {
  it('마력선으로 이어지면 광석을 주괴로 만들어 출하 상자에 모은다', () => {
    const { f, outBox, gen } = smeltLine({ wire: true, fuel: 3 });
    f.simulate(200);
    expect(outBox.buffer!.copper_ingot).toBe(5);
    expect(gen.buffer!.essence_low).toBeLessThan(3);
  });

  it('마력선이 없으면 발전기와 떨어진 기계는 멈춘다', () => {
    const { f, outBox } = smeltLine({ wire: false, fuel: 3 });
    f.simulate(200);
    expect(outBox.buffer!.copper_ingot ?? 0).toBe(0);
  });

  it('발전기에 정수가 없으면 멈춘다', () => {
    const { f, outBox } = smeltLine({ wire: true, fuel: 0 });
    f.simulate(200);
    expect(outBox.buffer!.copper_ingot ?? 0).toBe(0);
  });

  it('투입 상자는 기계가 비었을 때만 보낸다', () => {
    const { f, inBox } = smeltLine({ wire: true, fuel: 3 });
    f.simulate(5);
    // 레일 하나, 제련로 하나 분량만 나가고 나머지는 상자에 남는다
    expect(inBox.buffer!.copper_ore).toBeGreaterThanOrEqual(2);
  });

  it('조립기는 고른 레시피의 재료만 받는다', () => {
    const f = new Factory({ sizeLevel: 0, buildings: [] }, 8);
    f.place('box', 0, 0, 0)!.buffer = { mana_copper: 2, plank: 4 };
    f.place('belt', 1, 0, 0);
    const asm = f.place('assembler', 2, 0, 0)!;
    asm.recipe = 'return_stone';
    const out = f.place('box', 3, 0, 0)!;
    out.mode = 'out';
    f.place('wire', 2, 1, 0);
    f.place('generator', 2, 2, 0)!.buffer = { essence_low: 5 };
    f.simulate(400);
    expect(out.buffer!.return_stone).toBe(2);
  });

  it('철거하면 안에 든 아이템을 돌려준다', () => {
    const f = new Factory({ sizeLevel: 0, buildings: [] }, 8);
    const got: Record<string, number> = {};
    const belt = f.place('belt', 0, 0, 0)!;
    belt.item = 'wood';
    f.remove(0, 0, (id, n) => (got[id] = (got[id] ?? 0) + n));
    expect(got.wood).toBe(1);
    expect(f.at(0, 0)).toBeUndefined();
  });
});

describe('건물 레벨', () => {
  it('Lv.1 제련로는 철광석을 받지 않고, Lv.2로 올리면 철 주괴를 만든다', () => {
    const make = (level: number) => {
      const f = new Factory({ sizeLevel: 0, buildings: [] }, 8);
      f.place('box', 0, 0, 0)!.buffer = { iron_ore: 3 };
      f.place('belt', 1, 0, 0);
      const sm = f.place('smelter', 2, 0, 0)!;
      sm.level = level;
      const out = f.place('box', 3, 0, 0)!;
      out.mode = 'out';
      f.place('wire', 2, 1, 0);
      f.place('generator', 2, 2, 0)!.buffer = { essence_low: 5 };
      f.simulate(200);
      return out.buffer!.iron_ingot ?? 0;
    };
    expect(make(1)).toBe(0);
    expect(make(2)).toBeGreaterThan(0);
  });
});

describe('판자·마력 가공', () => {
  const line = (machine: 'crusher' | 'infuser', level: number, input: Record<string, number>) => {
    const f = new Factory({ sizeLevel: 0, buildings: [] }, 8);
    f.place('box', 0, 0, 0)!.buffer = input;
    f.place('belt', 1, 0, 0);
    const m = f.place(machine, 2, 0, 0)!;
    m.level = level;
    const out = f.place('box', 3, 0, 0)!;
    out.mode = 'out';
    f.place('wire', 2, 1, 0);
    f.place('generator', 2, 2, 0)!.buffer = { essence_low: 10 };
    f.simulate(300);
    return out.buffer!;
  };
  it('벌목소 Lv.2는 적송을 적송 판자로 켠다', () => {
    expect(line('crusher', 2, { redpine_wood: 2 }).redpine_plank).toBe(4);
  });
  it('마력 주입기는 판자와 정수로 마력 판자를 만든다', () => {
    expect(line('infuser', 1, { plank: 2, essence_low: 2 }).mana_plank_1).toBe(2);
  });
});

describe('부족한 재료 안내', () => {
  it('마력 주입기에 주괴만 들어오면 하급 마력 정수가 필요하다고 알려 준다', () => {
    const f = new Factory({ sizeLevel: 0, buildings: [] }, 8);
    f.place('box', 0, 0, 0)!.buffer = { copper_ingot: 5 };
    f.place('belt', 1, 0, 0);
    const m = f.place('infuser', 2, 0, 0)!;
    f.place('wire', 2, 1, 0);
    f.place('generator', 2, 2, 0)!.buffer = { essence_low: 10 };
    f.simulate(60);
    expect(f.missingInputs(m)?.missing).toEqual({ essence_low: 1 });
  });
});
