import { describe, expect, it } from 'vitest';
import { newTool, toolWear } from '../src/data/tools';
import { enqueueJob, Factory, WORKBENCH_OUT_MAX, WORKBENCH_QUEUE_MAX, type WorkJob } from '../src/factory/sim';

describe('채집 도구', () => {
  it('자기 단계는 1, 한 단계 위는 3씩 닳고, 그 위는 못 캔다', () => {
    const t = newTool(1);
    expect(toolWear(t, 1)).toBe(1);
    expect(toolWear(t, 2)).toBe(3);
    expect(toolWear(t, 3)).toBeNull();
  });
});

describe('제작대', () => {
  const job = (over: Partial<WorkJob> = {}): WorkJob => ({ kind: 'item', id: 'copper_plate', tier: 1, count: 1, left: 3, time: 10, cost: { items: {}, gold: 0 }, ...over });
  const line = () => {
    const f = new Factory({ sizeLevel: 0, buildings: [] }, 8);
    const wb = f.place('workbench', 0, 0, 0)!;
    f.place('wire', 0, 1, 0);
    f.place('generator', 0, 2, 0)!.buffer = { essence_low: 5 };
    return { f, wb };
  };

  it('전력을 받는 동안 시간이 지나야 완성되고, 완성품은 레일을 타고 출하 상자로 간다', () => {
    const { f, wb } = line();
    f.place('belt', 1, 0, 0);
    const out = f.place('box', 2, 0, 0)!;
    out.mode = 'out';
    wb.job = job();
    f.simulate(5);
    expect(out.buffer!.copper_plate ?? 0).toBe(0);
    f.simulate(40);
    expect(out.buffer!.copper_plate).toBe(3);
    expect(wb.job).toBeNull();
  });

  it('전력이 없으면 진행되지 않는다', () => {
    const f = new Factory({ sizeLevel: 0, buildings: [] }, 8);
    const wb = f.place('workbench', 0, 0, 0)!;
    wb.job = job();
    f.simulate(60);
    expect(wb.progress).toBe(0);
    expect(wb.job!.left).toBe(3);
  });

  it('작업이 없으면 발전기 연료를 쓰지 않는다', () => {
    const { f } = line();
    const gen = f.state.buildings.find((b) => b.type === 'generator')!;
    f.simulate(60);
    expect(gen.buffer!.essence_low).toBe(5);
  });

  it('출구가 막히면 쌓아 두고, 가득 차면 멈춘다', () => {
    const { f, wb } = line();
    wb.job = job({ left: 30, time: 1 });
    f.simulate(120);
    expect(wb.out!.length).toBe(WORKBENCH_OUT_MAX);
    expect(wb.job!.left).toBe(10);
  });

  it('장비: 앞에 레일·출하 상자가 이어져 있으면 레일을 타고 상자 속 장비가 된다', () => {
    const { f, wb } = line();
    f.place('belt', 1, 0, 0);
    const out = f.place('box', 2, 0, 0)!;
    out.mode = 'out';
    wb.job = job({ kind: 'equip', id: 'helmet', tier: 3, mana: true, left: 2 });
    f.simulate(60);
    expect(wb.ready?.length ?? 0).toBe(0);
    expect(out.equips!.length).toBe(2);
    expect(out.equips![0].slot).toBe('helmet');
    expect(out.equips![0].tier).toBe(3);
    expect(out.equips![0].grade).toBeGreaterThan(0);
    expect(Object.keys(out.buffer!)).toEqual([]);
    // 철거하면 상자 속 장비는 장비로 돌려준다
    const back: unknown[] = [];
    f.remove(2, 0, () => back.push('item'), (e) => back.push(e));
    expect(back.length).toBe(2);
    expect(back.every((x) => typeof x === 'object')).toBe(true);
  });

  it('장비·도구는 (앞에 아무것도 없으면) ready로 넘겨 창고에 넣게 한다', () => {
    const { f, wb } = line();
    wb.job = job({ kind: 'equip', id: 'helmet', left: 1 });
    f.simulate(20);
    expect(wb.ready!.length).toBe(1);
    expect(wb.out!.length).toBe(0);
  });

  it('건물을 빈 칸으로 옮길 수 있고, 들어 있던 작업은 그대로다', () => {
    const { f, wb } = line();
    wb.job = job();
    expect(f.move(0, 0, 1, 0)).toBe(true);
    expect(f.at(1, 0)).toBe(wb);
    expect(f.at(0, 0)).toBeUndefined();
    expect(wb.job!.left).toBe(3);
    expect(f.move(1, 0, 0, 1)).toBe(false); // 마력선이 있는 칸
  });

  it('제작 중에 넣은 작업은 예약되고, 같은 것은 개수만 늘어난다', () => {
    const { f, wb } = line();
    f.place('belt', 1, 0, 0);
    const out = f.place('box', 2, 0, 0)!;
    out.mode = 'out';
    enqueueJob(wb, job({ left: 1 }));
    enqueueJob(wb, job({ left: 2 }));
    expect(wb.job!.left).toBe(3);
    expect(wb.queue ?? []).toHaveLength(0);
    enqueueJob(wb, job({ id: 'iron_plate', left: 2 }));
    expect(wb.queue).toHaveLength(1);
    f.simulate(80);
    expect(out.buffer!.copper_plate).toBe(3);
    expect(out.buffer!.iron_plate).toBe(2);
    expect(wb.job).toBeNull();
  });

  it('예약 줄이 가득 차면 다른 작업은 넣을 수 없다', () => {
    const { wb } = line();
    enqueueJob(wb, job());
    for (let i = 0; i < WORKBENCH_QUEUE_MAX; i++) expect(enqueueJob(wb, job({ id: `x${i}` }))).toBe(true);
    expect(enqueueJob(wb, job({ id: 'more' }))).toBe(false);
    // 마지막 것과 같은 것은 개수만 늘어나므로 된다
    expect(enqueueJob(wb, job({ id: `x${WORKBENCH_QUEUE_MAX - 1}` }))).toBe(true);
  });
});
