import { describe, expect, it } from 'vitest';
import { expToNext, POINTS_PER_LEVEL } from '../src/data/classes';
import { enhanceCost, equipStats } from '../src/data/equipment';
import { QUEST_BY_ID } from '../src/data/quests';
import { Bag } from '../src/game/Bag';
import { newSave, Progress, stageIndex, stageOf } from '../src/game/Progress';
import { Quests } from '../src/game/Quests';
import { objective, resetForNewCycle, scriptFor } from '../src/game/Story';

const questsOf = (p: Progress) =>
  new Quests(p.data.quests, {
    count: (id) => p.count(id),
    get stones() {
      return p.stoneCount;
    },
    get cleared() {
      return p.data.cleared;
    },
    flag: (f) => p.flag(f),
  });

describe('Progress', () => {
  it('새 게임은 기본 무기를 쥐고 시작한다', () => {
    const p = new Progress(newSave());
    expect(p.cls.equipment.weapon?.cls).toBe('sword');
    expect(p.stats().atk).toBeGreaterThan(20);
  });

  it('레벨이 오르면 스탯 포인트를 받고, 찍은 스탯이 능력치에 반영된다', () => {
    const p = new Progress(newSave());
    expect(p.addExp(expToNext(1) + expToNext(2))).toBe(2);
    expect(p.cls.points).toBe(POINTS_PER_LEVEL * 2);
    const before = p.stats();
    expect(p.allocate('vit', 3)).toBe(true);
    expect(p.allocate('str', 2)).toBe(true);
    const after = p.stats();
    expect(after.maxHp - before.maxHp).toBe(30);
    expect(after.atk).toBeGreaterThan(before.atk);
    expect(p.allocate('dex', 100)).toBe(false);
  });

  it('직업마다 레벨과 장비가 따로다', () => {
    const p = new Progress(newSave());
    p.addExp(1000);
    p.data.currentClass = 'mage';
    expect(p.cls.level).toBe(1);
    expect(p.cls.equipment.weapon?.cls).toBe('mage');
  });

  it('가방을 창고에 넣으면 아이템과 장비가 합쳐진다', () => {
    const p = new Progress(newSave());
    const bag = new Bag(4);
    bag.add('iron_ore', 3);
    bag.addEquip({ uid: 'x', slot: 'helmet', tier: 1, grade: 0, plus: 0 });
    p.depositSlots(bag.slots);
    expect(p.count('iron_ore')).toBe(3);
    expect(p.data.equips).toHaveLength(1);
  });

  it('장비 7부위 모두 능력치가 있고, 강화하면 오른다', () => {
    for (const slot of ['weapon', 'helmet', 'armor', 'pants', 'boots', 'ring', 'necklace'] as const) {
      const s = equipStats({ uid: 's', slot, tier: 2, grade: 1, plus: 0 });
      expect(Object.values(s).some((v) => v > 0)).toBe(true);
    }
    const e = { uid: 'w', slot: 'weapon' as const, cls: 'sword' as const, tier: 2, grade: 1, plus: 0 };
    expect(enhanceCost(e)?.item).toBe('iron_plate');
    const base = equipStats(e).atk;
    e.plus = 5;
    expect(enhanceCost(e)?.item).toBe('mana_iron_plate');
    expect(equipStats(e).atk).toBeGreaterThan(base);
  });

  it('스테이지 번호와 단계·방이 서로 바뀐다', () => {
    expect(stageIndex(1, 10)).toBe(10);
    expect(stageIndex(2, 5)).toBe(15);
    expect(stageOf(15)).toEqual({ tier: 2, stage: 5 });
    const p = new Progress(newSave());
    p.data.cleared = 10;
    expect(p.maxTier).toBe(2);
  });
});

describe('Quests', () => {
  it('튜토리얼 퀘스트가 차례대로 열리고 목표를 추적한다', () => {
    const p = new Progress(newSave());
    const q = questsOf(p);
    expect(q.available('guide').map((x) => x.id)).toContain('m1_hunt');
    expect(q.available('smith')).toHaveLength(0);
    q.accept(QUEST_BY_ID.m1_hunt);
    for (let i = 0; i < 20; i++) q.event({ type: 'kill', tier: 1, elite: false });
    expect(q.canComplete(QUEST_BY_ID.m1_hunt)).toBe(true);
    q.finish(QUEST_BY_ID.m1_hunt);
    expect(q.available('smith').map((x) => x.id)).toContain('m2_tools');
    q.accept(QUEST_BY_ID.m2_tools);
    p.add('copper_ore', 10);
    expect(q.canComplete(QUEST_BY_ID.m2_tools)).toBe(false);
    p.add('wood', 5);
    expect(q.canComplete(QUEST_BY_ID.m2_tools)).toBe(true);
  });

  it('일일 퀘스트는 하루에 3개 생긴다', () => {
    const p = new Progress(newSave());
    const q = questsOf(p);
    expect(q.refreshDaily(1, false)).toBe(true);
    expect(q.state.daily.list).toHaveLength(3);
    expect(q.refreshDaily(1, false)).toBe(false);
  });
});

describe('Story', () => {
  it('메인 퀘스트를 따라 목표가 바뀌고, 차원석을 모으면 이야기가 이어진다', () => {
    const p = new Progress(newSave());
    const q = questsOf(p);
    p.setFlag('intro');
    expect(objective(p, q)).toContain('리아');
    for (const id of ['m1_hunt', 'm2_tools', 'm3_essence', 'm4_factory', 'm5_legend']) q.finish(QUEST_BY_ID[id]);
    p.data.dimStones = [1, 2];
    expect(scriptFor('chief', p)).toBe('ch2');
  });

  it('차원석 7개와 공명 장치가 있으면 마지막 선택이 열리고, 회차를 넘기면 이야기 플래그가 초기화된다', () => {
    const p = new Progress(newSave());
    for (const f of ['intro', 'home', 'smith3', 'resonatorHint', 'bp_crusher']) p.setFlag(f);
    p.data.dimStones = [1, 2, 3, 4, 5, 6, 7];
    p.unlockClass('mage');
    p.unlockClass('archer');
    p.add('resonator', 1);
    expect(scriptFor('chief', p)).toBe('final');
    resetForNewCycle(p);
    expect(p.flag('smith3')).toBe(0);
    expect(p.flag('home')).toBe(1);
    expect(p.flag('bp_crusher')).toBe(1);
  });
});

describe('자원 단계', () => {
  it('2단계는 앞쪽 방에서 구리가, 뒤쪽 방에서 철이 많이 나온다', async () => {
    const { resourceTier } = await import('../src/data/nodes');
    const count = (stage: number) => {
      let high = 0;
      for (let i = 0; i < 1000; i++) if (resourceTier(2, stage, i / 1000) === 2) high++;
      return high;
    };
    expect(count(1)).toBeLessThan(200);
    expect(count(10)).toBeGreaterThan(800);
    expect(resourceTier(1, 10, 0)).toBe(1);
  });
});

describe('촌장 일일 의뢰', () => {
  it('수락한 의뢰만 진행되고, 목표를 채우면 보상을 받을 수 있다', () => {
    const p = new Progress(newSave());
    const q = questsOf(p);
    q.refreshDaily(1, false);
    const list = q.state.daily.list;
    expect(list).toHaveLength(3);
    for (let i = 0; i < 300; i++) {
      q.event({ type: 'kill', tier: 1, elite: true });
      q.event({ type: 'stage' });
    }
    expect(list.every((d) => d.progress === 0)).toBe(true);
    for (const d of list) d.accepted = true;
    for (let i = 0; i < 300; i++) {
      q.event({ type: 'kill', tier: 1, elite: true });
      q.event({ type: 'stage' });
    }
    const killOrStage = list.filter((d) => d.objective.type === 'kill' || d.objective.type === 'elite' || d.objective.type === 'stages');
    expect(killOrStage.every((d) => d.progress > 0)).toBe(true);
  });
});
