import { Progress, newSave } from '../src/game/Progress';
import { BOSS_RESPAWN_MS, FARM_COOLDOWN_MS } from '../src/data/monsters';
import { describe, expect, it } from 'vitest';
import { generateDungeon } from '../src/dungeon/generator';
it('보스 방은 넓고 시작 방과 멀다', () => {
  for (let seed = 1; seed < 40; seed++)
    for (const stage of [5, 10]) {
      const d = generateDungeon(seed * 7919, 1 + (seed % 7), stage);
      const exit = d.rooms.find((r) => r.type === 'exit')!;
      expect(exit.w * exit.h).toBeGreaterThanOrEqual(stage === 10 ? 17 * 14 : 14 * 12);
    }
});

describe('보스 재등장', () => {
  it('재등장 대기 중이면 보스 대신 정예가 지킨다', () => {
    for (const stage of [5, 10]) {
      const on = generateDungeon(7, 1, stage, { boss: 'present' });
      const off = generateDungeon(7, 1, stage, { boss: 'guard' });
      expect(on.monsters.some((m) => m.kind === 'boss' || m.kind === 'midboss')).toBe(true);
      expect(off.monsters.some((m) => m.kind === 'boss' || m.kind === 'midboss')).toBe(false);
      expect(off.monsters.filter((m) => m.kind === 'elite').length).toBeGreaterThanOrEqual(2);
    }
  });

  it('파수꾼은 1시간, 수호자는 4시간 뒤 다시 나타난다', () => {
    const p = new Progress(newSave());
    const t0 = 1_000_000;
    expect(p.bossWait(1, 5, t0)).toBe(0);
    p.bossDefeated(1, 5, BOSS_RESPAWN_MS.midboss, t0);
    p.bossDefeated(1, 10, BOSS_RESPAWN_MS.boss, t0);
    expect(p.bossWait(1, 5, t0 + 59 * 60_000)).toBeGreaterThan(0);
    expect(p.bossWait(1, 5, t0 + 60 * 60_000)).toBe(0);
    expect(p.bossWait(1, 10, t0 + 3.9 * 3600_000)).toBeGreaterThan(0);
    expect(p.bossWait(1, 10, t0 + 4 * 3600_000)).toBe(0);
    // 다른 단계·일반 방은 영향 없음
    expect(p.bossWait(2, 5, t0)).toBe(0);
    expect(p.bossWait(1, 6, t0)).toBe(0);
  });
});

describe('채집 특화 맵', () => {
  it('벌목지는 나무만, 광맥지는 광맥만 가득하고 몬스터는 적다', () => {
    for (const tier of [1, 4, 7]) {
      const normal = generateDungeon(11, tier, 3);
      const wood = generateDungeon(11, tier, 3, { farm: 'wood' });
      const ore = generateDungeon(11, tier, 3, { farm: 'ore' });
      expect(wood.nodes.every((n) => n.nodeId.startsWith('tree_'))).toBe(true);
      expect(ore.nodes.every((n) => n.nodeId.startsWith('ore_'))).toBe(true);
      const trees = normal.nodes.filter((n) => n.nodeId.startsWith('tree_')).length;
      expect(wood.nodes.length).toBeGreaterThan(Math.max(40, trees * 3));
      expect(wood.monsters.length).toBeLessThan(normal.monsters.length / 2);
      expect(wood.monsters.some((m) => m.kind !== 'normal')).toBe(false);
      // 단계에 맞는 자원 (이번 단계 또는 앞 단계)
      expect(ore.nodes.every((n) => { const t = Number(n.nodeId.split('_')[1]); return t === tier || t === tier - 1; })).toBe(true);
    }
  });

  it('종류마다 30분 대기가 따로 걸린다', () => {
    const p = new Progress(newSave());
    const t0 = 5_000_000;
    p.farmEntered('wood', FARM_COOLDOWN_MS, t0);
    expect(p.farmWait('wood', t0 + 29 * 60_000)).toBeGreaterThan(0);
    expect(p.farmWait('wood', t0 + 30 * 60_000)).toBe(0);
    expect(p.farmWait('ore', t0)).toBe(0);
  });

  it('보스를 쓰러뜨린 방에서 이어 하면 보스도 대신 지키는 정예도 없다', () => {
    for (const stage of [5, 10]) {
      const d = generateDungeon(3, 2, stage, { boss: 'none' });
      const exit = d.rooms.find((r) => r.type === 'exit')!;
      const inExit = d.monsters.filter((m) => m.x >= exit.x && m.x < exit.x + exit.w && m.y >= exit.y && m.y < exit.y + exit.h);
      expect(inExit).toHaveLength(0);
    }
  });
});
