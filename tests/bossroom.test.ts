import { Progress, newSave } from '../src/game/Progress';
import { BOSS_RESPAWN_MS } from '../src/data/monsters';
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
      const on = generateDungeon(7, 1, stage, true);
      const off = generateDungeon(7, 1, stage, false);
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
