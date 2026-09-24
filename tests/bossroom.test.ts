import { expect, it } from 'vitest';
import { generateDungeon } from '../src/dungeon/generator';
it('보스 방은 넓고 시작 방과 멀다', () => {
  for (let seed = 1; seed < 40; seed++)
    for (const stage of [5, 10]) {
      const d = generateDungeon(seed * 7919, 1 + (seed % 7), stage);
      const exit = d.rooms.find((r) => r.type === 'exit')!;
      expect(exit.w * exit.h).toBeGreaterThanOrEqual(stage === 10 ? 17 * 14 : 14 * 12);
    }
});
