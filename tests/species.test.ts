import { describe, expect, it } from 'vitest';
import { Quaternion, Scene } from 'three';
import { BOSS_SPECIES, MIDBOSS_SPECIES, SPECIES, TIER_POOLS, pickSpecies, resolveSpecies } from '../src/data/species';
import { generateDungeon } from '../src/dungeon/generator';
import { Effects } from '../src/game/Effects';
import { Monster, type MonsterWorld } from '../src/game/Monster';
import { TILE } from '../src/config';

describe('몬스터 종족', () => {
  it('단계마다 종족이 7가지 이상, 모두 정의되어 있다', () => {
    for (let t = 1; t <= 7; t++) {
      expect(TIER_POOLS[t].length).toBeGreaterThanOrEqual(7);
      for (const [id] of TIER_POOLS[t]) expect(SPECIES[id], id).toBeTruthy();
    }
    expect(BOSS_SPECIES).toHaveLength(7);
    expect(MIDBOSS_SPECIES).toHaveLength(7);
  });

  it('언데드·오크·다크엘프 세력이 있다', () => {
    const f = new Set(Object.values(SPECIES).map((s) => s.faction));
    for (const x of ['undead', 'orc', 'elf']) expect(f.has(x as never)).toBe(true);
  });

  it('소환은 종족 id와 행동 유형 둘 다 받는다', () => {
    let i = 0;
    const r = () => ((i = (i * 9301 + 49297) % 233280) / 233280);
    expect(resolveSpecies(3, 'skel_warrior', r).id).toBe('skel_warrior');
    expect(resolveSpecies(2, 'tank', r).arch).toBe('tank');
    expect(pickSpecies(4, r, (s) => s.arch !== 'swarm').arch).not.toBe('swarm');
  });

  it('모든 종족이 몇 초 동안 싸워도 오류 없이 움직인다', () => {
    const grid = generateDungeon(5, 3, 3);
    const scene = new Scene();
    const effects = new Effects(scene);
    const start = { x: (grid.start.x + 0.5) * TILE, z: (grid.start.y + 0.5) * TILE };
    const player = { x: start.x, z: start.z };
    const monsters: Monster[] = [];
    let hurt = 0;
    const world: MonsterWorld = {
      grid,
      obstacles: [],
      scene,
      effects,
      player,
      monsters,
      hurtPlayer: () => hurt++,
      fireEnemyProjectile: () => {},
      summon: (what, x, z) => {
        const m = new Monster(resolveSpecies(3, what, Math.random), 'normal', 3, 3, 0, x, z, -1);
        monsters.push(m);
        return m;
      },
      hazard: () => {},
      announce: () => {},
      killPlayer: () => {},
      burst: () => {},
      shake: () => {},
    };
    const all = [...Object.values(SPECIES)];
    for (const sp of all) {
      const m = new Monster(sp, 'normal', 3, 3, 0, start.x + 3, start.z, 0);
      m.addTo(scene);
      monsters.push(m);
      m.aggro = true;
      for (let i = 0; i < 300; i++) {
        m.update(0.02, world, new Quaternion());
        effects.update(0.02);
      }
      if (i10(m)) m.damage(m.hp * 0.6, player.x, player.z, 0);
      for (let i = 0; i < 200; i++) m.update(0.02, world, new Quaternion());
      expect(Number.isFinite(m.x) && Number.isFinite(m.z), sp.id).toBe(true);
    }
    expect(hurt).toBeGreaterThan(0);
  });
});

const i10 = (m: Monster) => m.alive;
