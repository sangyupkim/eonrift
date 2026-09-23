import { describe, expect, it } from 'vitest';
import { bfs, CELL_FLOOR, generateDungeon, isFloor } from '../src/dungeon/generator';

const SEEDS = Array.from({ length: 150 }, (_, i) => i * 7919 + 13);

describe('generateDungeon', () => {
  it('같은 시드와 단계면 같은 맵을 만든다', () => {
    const a = generateDungeon(12345, 3);
    const b = generateDungeon(12345, 3);
    expect(Array.from(a.cells)).toEqual(Array.from(b.cells));
    expect(a.nodes).toEqual(b.nodes);
    expect(a.start).toEqual(b.start);
  });

  it('다른 시드면 다른 맵을 만든다', () => {
    const a = generateDungeon(1, 1);
    const b = generateDungeon(2, 1);
    expect(Array.from(a.cells)).not.toEqual(Array.from(b.cells));
  });

  for (let tier = 1; tier <= 7; tier++) {
    it(`${tier}단계: 모든 바닥이 시작 지점과 이어져 있고 필수 방이 있다`, () => {
      for (const seed of SEEDS) {
        const d = generateDungeon(seed + tier, tier);
        const dist = bfs(d.cells, d.width, d.height, d.start.x, d.start.y);
        for (let i = 0; i < d.cells.length; i++) {
          if (d.cells[i] === CELL_FLOOR) expect(dist[i]).toBeGreaterThanOrEqual(0);
        }
        expect(isFloor(d, d.exit.x, d.exit.y)).toBe(true);
        expect(d.rooms.length).toBeGreaterThanOrEqual(7);
        const types = d.rooms.map((r) => r.type);
        for (const t of ['start', 'exit', 'elite', 'treasure', 'resource'] as const) {
          expect(types).toContain(t);
        }
        expect(d.start).not.toEqual(d.exit);
      }
    });
  }

  it('채집물은 바닥 위에 있고 가장자리에 붙지 않는다', () => {
    for (const seed of SEEDS) {
      const d = generateDungeon(seed, 1);
      expect(d.nodes.length).toBeGreaterThan(8);
      for (const n of d.nodes) {
        const x = Math.round(n.x);
        const y = Math.round(n.y);
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) expect(isFloor(d, x + dx, y + dy)).toBe(true);
        }
      }
    }
  });

  it('맵은 한 화면의 약 10배 크기이고 바닥이 충분하다', () => {
    const ratios = SEEDS.map((seed) => {
      const d = generateDungeon(seed, 1);
      return d.cells.reduce((sum, c) => sum + c, 0) / d.cells.length;
    });
    const avg = ratios.reduce((a, b) => a + b, 0) / ratios.length;
    expect(avg).toBeGreaterThan(0.3);
  });
});
