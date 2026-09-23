import { describe, expect, it } from 'vitest';
import { expToNext } from '../src/data/classes';
import { enhanceCost, equipStats } from '../src/data/equipment';
import { Bag } from '../src/game/Bag';
import { newSave, Progress } from '../src/game/Progress';
import { objective, resetForNewCycle, scriptFor } from '../src/game/Story';

describe('Progress', () => {
  it('새 게임은 기본 무기를 쥐고 시작한다', () => {
    const p = new Progress(newSave());
    expect(p.cls.equipment.weapon?.cls).toBe('sword');
    expect(p.stats().atk).toBeGreaterThan(12);
  });

  it('경험치가 차면 레벨이 오르고 능력치가 오른다', () => {
    const p = new Progress(newSave());
    const before = p.stats();
    expect(p.addExp(expToNext(1) + expToNext(2))).toBe(2);
    expect(p.cls.level).toBe(3);
    expect(p.stats().maxHp).toBeGreaterThan(before.maxHp);
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
    bag.addEquip({ uid: 'x', slot: 'armor', tier: 1, grade: 0, plus: 0 });
    p.depositSlots(bag.slots);
    expect(p.count('iron_ore')).toBe(3);
    expect(p.data.equips).toHaveLength(1);
  });

  it('강화하면 능력치가 오르고 필요 강화석 등급이 바뀐다', () => {
    const e = { uid: 'w', slot: 'weapon' as const, cls: 'sword' as const, tier: 2, grade: 1, plus: 0 };
    expect(enhanceCost(e)?.stone).toBe('stone_low');
    const base = equipStats(e).atk;
    e.plus = 5;
    expect(enhanceCost(e)?.stone).toBe('stone_mid');
    expect(equipStats(e).atk).toBeGreaterThan(base);
    e.plus = 10;
    expect(enhanceCost(e)).toBeNull();
  });
});

describe('Story', () => {
  it('진행에 따라 목표와 대사가 바뀐다', () => {
    const p = new Progress(newSave());
    p.setFlag('intro');
    expect(objective(p)).toContain('1단계');
    p.setFlag('returned');
    expect(scriptFor('chief', p)).toBe('legend');
    p.setFlag('legend');
    p.data.dimStones.push(1);
    expect(scriptFor('chief', p)).toBe('stone1');
    p.setFlag('stone1Talk');
    expect(scriptFor('engineer', p)).toBe('home_unlock');
    p.setFlag('home');
    p.data.dimStones.push(2);
    expect(scriptFor('chief', p)).toBe('ch2');
  });

  it('차원석 7개와 공명 장치가 있으면 마지막 선택이 열리고, 회차를 넘기면 차원석 관련 이야기가 초기화된다', () => {
    const p = new Progress(newSave());
    for (const f of ['intro', 'returned', 'legend', 'stone1Talk', 'home', 'factoryBuilt', 'smith3', 'resonatorHint']) p.setFlag(f);
    p.data.dimStones = [1, 2, 3, 4, 5, 6, 7];
    p.unlockClass('mage');
    p.unlockClass('archer');
    p.add('resonator', 1);
    expect(scriptFor('chief', p)).toBe('final');
    resetForNewCycle(p);
    expect(p.flag('smith3')).toBe(0);
    expect(p.flag('home')).toBe(1);
  });
});
