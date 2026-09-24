import { describe, expect, it } from 'vitest';
import { ALL_QUESTS, TIER_SUB_QUESTS, type NpcRef } from '../src/data/quests';
import { ITEMS } from '../src/data/items';
import { newSave, Progress } from '../src/game/Progress';
import { newQuestState, Quests } from '../src/game/Quests';

const NPCS: NpcRef[] = ['chief', 'guide', 'smith', 'engineer', 'merchant', 'trainer', 'stranger'];

describe('단계별 서브 퀘스트', () => {
  it('NPC마다 단계(1~7)마다 두 개 이상', () => {
    for (const npc of NPCS)
      for (let t = 1; t <= 7; t++) {
        const n = TIER_SUB_QUESTS.filter((q) => q.npc === npc && q.requireCleared === (t - 1) * 10).length;
        expect(n, `${npc} ${t}단계`).toBeGreaterThanOrEqual(2);
      }
  });

  it('아이디가 겹치지 않고, 나오는 아이템은 모두 있는 아이템', () => {
    const ids = ALL_QUESTS.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const q of TIER_SUB_QUESTS) {
      for (const o of q.objectives) if ('item' in o) expect(ITEMS[o.item], `${q.id} ${o.item}`).toBeTruthy();
      for (const id of Object.keys(q.rewards.items ?? {})) expect(ITEMS[id], `${q.id} ${id}`).toBeTruthy();
    }
  });

  it('단계 차원문이 열려야 받을 수 있고, 두 번째는 첫 번째 뒤에', () => {
    const state = newQuestState();
    state.done.push('m1_hunt', 'm2_tools', 'm4_factory');
    let cleared = 0;
    const qs = new Quests(state, { count: () => 0, stones: 0, flag: () => 0, get cleared() { return cleared; } });
    const ids = () => qs.available('smith').map((q) => q.id);
    expect(ids()).toContain('t_smith_1a');
    expect(ids()).not.toContain('t_smith_1b');
    expect(ids()).not.toContain('t_smith_2a');
    state.done.push('t_smith_1a');
    expect(ids()).toContain('t_smith_1b');
    cleared = 10;
    expect(ids()).toContain('t_smith_2a');
  });

  it('단계 조건이 붙은 목표는 그 단계 이상에서만 센다', () => {
    const state = newQuestState();
    const qs = new Quests(state, { count: () => 0, stones: 0, cleared: 70, flag: () => 0 });
    const q = TIER_SUB_QUESTS.find((x) => x.id === 't_chief_3b')!;
    qs.accept(q);
    qs.event({ type: 'kill', tier: 2, elite: true });
    qs.event({ type: 'kill', tier: 3, elite: true });
    qs.event({ type: 'kill', tier: 3, elite: false });
    expect(qs.progress(q)[0].cur).toBe(1);
  });
});

describe('채집 특화 맵 조건', () => {
  it('그 단계의 파수꾼(5번째 방)을 깨야 열린다', () => {
    const p = new Progress(newSave());
    expect(p.farmUnlocked(1)).toBe(false);
    p.data.cleared = 4;
    expect(p.farmUnlocked(1)).toBe(false);
    p.data.cleared = 5;
    expect(p.farmUnlocked(1)).toBe(true);
    expect(p.farmUnlocked(2)).toBe(false);
    p.data.cleared = 15;
    expect(p.farmUnlocked(2)).toBe(true);
  });
});
