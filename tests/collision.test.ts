import { describe, expect, it } from 'vitest';
import { TILE } from '../src/config';
import { moveWithCollision } from '../src/dungeon/collision';
import { CELL_FLOOR } from '../src/dungeon/generator';

// 5x5 격자에서 가운데 3x3만 바닥
const width = 5;
const height = 5;
const cells = new Uint8Array(width * height);
for (let y = 1; y <= 3; y++) for (let x = 1; x <= 3; x++) cells[y * width + x] = CELL_FLOOR;
const grid = { width, height, cells };

describe('moveWithCollision', () => {
  it('벽을 뚫고 나가지 못한다', () => {
    const p = { x: 2.5 * TILE, z: 2.5 * TILE };
    moveWithCollision(grid, p, 50, 0, 0.45, []);
    expect(p.x).toBeCloseTo(4 * TILE - 0.45, 5);
    expect(p.z).toBeCloseTo(2.5 * TILE, 5);
  });

  it('원형 장애물을 밀어내며 지나간다', () => {
    const p = { x: 1.5 * TILE, z: 2.5 * TILE };
    const obstacle = { x: 2.5 * TILE, z: 2.5 * TILE + 0.1, radius: 0.7 };
    moveWithCollision(grid, p, TILE * 2, 0, 0.45, [obstacle]);
    const d = Math.hypot(p.x - obstacle.x, p.z - obstacle.z);
    expect(d).toBeGreaterThanOrEqual(0.45 + 0.7 - 1e-6);
  });
});
