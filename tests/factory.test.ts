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
  // 버그(v5.8까지): 정수는 여러 레시피(마력 구리·철·금·판자)에 쓰이는데, 주입기가 '정수가 들어가는 첫 레시피(마력 구리)'만 보고
  // 판자·철 주괴가 들어 있으면 정수를 거부 → 판자만 든 채 영원히 멈췄다 (상자를 주입기에 바로 붙였을 때 특히)
  it('마력 주입기는 판자·철 주괴를 오래 넣어도 멈추지 않는다', () => {
    const run = (level: number, input: Record<string, number>, belts: number) => {
      const g = new Factory({ sizeLevel: 0, buildings: [] }, 10);
      g.place('box', 0, 0, 0)!.buffer = input;
      for (let i = 1; i <= belts; i++) g.place('belt', i, 0, 0);
      g.place('infuser', belts + 1, 0, 0)!.level = level;
      const out = g.place('box', belts + 2, 0, 0)!;
      out.mode = 'out';
      g.place('wire', belts + 1, 1, 0);
      g.place('generator', belts + 1, 2, 0)!.buffer = { essence_low: 50 };
      g.simulate(1200);
      return Object.values(out.buffer!).reduce((a, b) => a + b, 0);
    };
    for (const belts of [0, 2]) {
      expect(run(1, { plank: 12, essence_low: 12 }, belts)).toBe(12);
      expect(run(2, { iron_ingot: 12, essence_low: 12 }, belts)).toBe(12);
      expect(run(1, { copper_ingot: 6, plank: 6, essence_low: 12 }, belts)).toBe(12);
    }
  }, 20000);
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

describe('레일 막힘 방지', () => {
  it('주입기가 한 재료만 받고 멈춰 있어도, 나중에 넣은 정수로 계속 생산된다', () => {
    const f = new Factory({ sizeLevel: 0, buildings: [] }, 8);
    const inBox = f.place('box', 0, 0, 0)!;
    inBox.buffer = { copper_ingot: 5 };
    f.place('belt', 1, 0, 0);
    f.place('belt', 2, 0, 0);
    f.place('infuser', 3, 0, 0);
    const out = f.place('box', 4, 0, 0)!;
    out.mode = 'out';
    f.place('wire', 3, 1, 0);
    f.place('generator', 3, 2, 0)!.buffer = { essence_low: 20 };
    f.simulate(60);
    inBox.buffer!.copper_ingot += 50;
    inBox.buffer!.essence_low = 40;
    f.simulate(600);
    expect(out.buffer!.mana_copper).toBeGreaterThan(15);
  });

});

describe('마력 치유석', () => {
  it('회복 중일 때만 전력을 받고, 발전기 연료를 쓴다', () => {
    const f = new Factory({ sizeLevel: 0, buildings: [] }, 8);
    const h = f.place('healer', 0, 0, 0)!;
    f.place('wire', 1, 0, 0);
    const g = f.place('generator', 2, 0, 0)!;
    g.buffer = { essence_low: 3 };
    f.simulate(10);
    expect(g.buffer!.essence_low).toBe(3);
    h.active = true;
    f.simulate(1);
    expect(f.powerOf(h)).toBeGreaterThan(0);
    expect(g.buffer!.essence_low).toBe(2);
  });
});
