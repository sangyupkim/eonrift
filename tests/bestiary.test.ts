import { describe, expect, it } from 'vitest';
import { Quaternion, Scene } from 'three';
import { BESTIARY, COLLECTION_MILESTONES, killMilestones, milestoneReward } from '../src/data/bestiary';
import { ITEMS } from '../src/data/items';
import { SPECIES, stagePool } from '../src/data/species';
import { TIER_SUB_QUESTS } from '../src/data/quests';
import { generateDungeon } from '../src/dungeon/generator';
import { Effects } from '../src/game/Effects';
import { Monster, type MonsterWorld } from '../src/game/Monster';
import { newSave, Progress } from '../src/game/Progress';
import { TILE } from '../src/config';

describe('몬스터 도감', () => {
  it('종족이 겹치지 않고 보상 아이템이 모두 있다', () => {
    const ids = BESTIARY.map((e) => e.species.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).not.toContain('slime_small');
    for (const e of BESTIARY) killMilestones(e).forEach((_, i) => Object.keys(milestoneReward(e, i).items).forEach((id) => expect(ITEMS[id], id).toBeTruthy()));
    for (const m of COLLECTION_MILESTONES) Object.keys(m.reward.items).forEach((id) => expect(ITEMS[id], id).toBeTruthy());
    const counts = COLLECTION_MILESTONES.map((m) => m.count);
    expect([...counts].sort((a, b) => a - b)).toEqual(counts);
    expect(counts[counts.length - 1]).toBe(BESTIARY.length);
  });

  it('처치를 기록하고 보상과 연구 보너스를 계산한다', () => {
    const p = new Progress(newSave());
    const atk0 = p.stats().atk;
    expect(p.recordKill('slime_small')).toBe(true);
    expect(p.kills('slime')).toBe(1);
    expect(p.recordKill('slime')).toBe(false);
    expect(p.bestiaryClaimable).toBe(1);
    p.data.research = 5;
    expect(p.stats().atk).toBeGreaterThan(atk0);
  });

  it('노아는 단계마다 서브 퀘스트 두 개', () => {
    for (let t = 1; t <= 7; t++) expect(TIER_SUB_QUESTS.filter((q) => q.npc === 'researcher' && q.requireCleared === (t - 1) * 10)).toHaveLength(2);
  });
});

describe('방마다 몇 종류만', () => {
  it('얕은 방은 3종류, 깊을수록 늘어난다', () => {
    const r = () => 0.5;
    for (let t = 1; t <= 7; t++) {
      expect(stagePool(t, 1, r)).toHaveLength(3);
      expect(stagePool(t, 10, r).length).toBeGreaterThanOrEqual(5);
    }
  });
});

describe('몬스터 특성', () => {
  const setup = () => {
    const grid = generateDungeon(5, 1, 3);
    const scene = new Scene();
    const effects = new Effects(scene);
    const px = (grid.start.x + 0.5) * TILE;
    const pz = (grid.start.y + 0.5) * TILE;
    const monsters: Monster[] = [];
    const summoned: string[] = [];
    let dealt = 20;
    const world: MonsterWorld = {
      grid, obstacles: [], scene, effects, player: { x: px, z: pz }, monsters,
      hurtPlayer: () => dealt,
      fireEnemyProjectile: () => {},
      summon: (what, x, z) => {
        summoned.push(what);
        const m = new Monster(SPECIES[what], 'normal', 1, 1, {}, x, z, -1);
        monsters.push(m);
        return m;
      },
      hazard: () => {}, announce: () => {}, killPlayer: () => {}, burst: () => {}, shake: () => {},
    };
    const tick = (m: Monster, sec: number) => {
      for (let t = 0; t < sec; t += 0.05) m.update(0.05, world, new Quaternion());
    };
    return { world, monsters, summoned, tick, px, pz, setDealt: (n: number) => (dealt = n) };
  };

  it('해골은 한 번 무너졌다가 절반 체력으로 다시 일어난다', () => {
    const { tick, px, pz } = setup();
    const m = new Monster(SPECIES.skel_warrior, 'normal', 1, 1, {}, px + 20, pz, 0);
    expect(m.damage(m.maxHp * 2, px, pz, 0)).toBe(false);
    expect(m.isDown).toBe(true);
    expect(m.damage(9999, px, pz, 0)).toBe(false);
    tick(m, 3);
    expect(m.isDown).toBe(false);
    expect(m.hp).toBeCloseTo(m.maxHp * 0.5);
    expect(m.damage(m.maxHp * 2, px, pz, 0)).toBe(true);
  });

  it('슬라임은 쓰러지면 둘로 나뉜다', () => {
    const { tick, summoned, px, pz } = setup();
    const m = new Monster(SPECIES.slime, 'normal', 1, 1, {}, px + 20, pz, 0);
    expect(m.damage(m.maxHp * 2, px, pz, 0)).toBe(true);
    tick(m, 0.2);
    expect(summoned).toEqual(['slime_small', 'slime_small']);
  });

  it('트롤은 맞지 않으면 체력이 찬다', () => {
    const { tick, px, pz } = setup();
    const m = new Monster(SPECIES.troll, 'normal', 1, 1, {}, px + 30, pz, 0);
    m.damage(m.maxHp * 0.5, px + 60, pz, 0);
    const hp = m.hp;
    tick(m, 5);
    expect(m.hp).toBeGreaterThan(hp);
  });
});
