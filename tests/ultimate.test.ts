import { describe, expect, it } from 'vitest';
import { Quaternion, Scene } from 'three';
import { CLASS_ORDER, ULT_COOLDOWN, ULTIMATES } from '../src/data/classes';
import { newSave, Progress } from '../src/game/Progress';
import { SPECIES } from '../src/data/species';
import { generateDungeon } from '../src/dungeon/generator';
import { Effects } from '../src/game/Effects';
import { Monster, type MonsterWorld } from '../src/game/Monster';

describe('궁극기', () => {
  it('직업마다 두 개, 재사용 대기 60초', () => {
    for (const c of CLASS_ORDER) expect(ULTIMATES[c]).toHaveLength(2);
    expect(ULT_COOLDOWN).toBe(60);
  });

  it('1-10 수호자 차원석 + Lv.15로 첫 번째, 4-10 + Lv.35로 두 번째가 열린다', () => {
    const p = new Progress(newSave());
    expect(p.ultIndex).toBe(-1);
    p.data.dimStones = [1];
    // 차원석이 있어도 레벨이 모자라면 잠겨 있다
    expect(p.unlockedUlts()).toEqual([]);
    p.cls.level = 15;
    expect(p.unlockedUlts()).toEqual([0]);
    expect(p.ultIndex).toBe(0);
    p.data.dimStones = [1, 2, 3, 4];
    expect(p.unlockedUlts()).toEqual([0]);
    p.cls.level = 35;
    expect(p.unlockedUlts()).toEqual([0, 1]);
    p.cls.ult = 0;
    expect(p.ultIndex).toBe(0);
    p.cls.ult = 1;
    expect(p.ultIndex).toBe(1);
  });

  it('기절한 몬스터는 공격하지 않는다', () => {
    const grid = generateDungeon(5, 1, 3);
    const scene = new Scene();
    let hurt = 0;
    const px = (grid.start.x + 0.5) * 2;
    const pz = (grid.start.y + 0.5) * 2;
    const world = { grid, obstacles: [], scene, effects: new Effects(scene), player: { x: px, z: pz }, monsters: [], hurtPlayer: () => (hurt++, 1), fireEnemyProjectile: () => {}, summon: () => null as never, hazard: () => {}, announce: () => {}, killPlayer: () => {}, burst: () => {}, shake: () => {} } as MonsterWorld;
    const m = new Monster(SPECIES.t1_melee, 'normal', 1, 1, {}, px + 1, pz, 0);
    m.aggro = true;
    m.stun = 3;
    for (let t = 0; t < 2.5; t += 0.05) m.update(0.05, world, new Quaternion());
    expect(hurt).toBe(0);
    for (let t = 0; t < 4; t += 0.05) m.update(0.05, world, new Quaternion());
    expect(hurt).toBeGreaterThan(0);
  });
});
