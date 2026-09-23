import { TILE } from '../config';
import { isFloor, type DungeonData } from './generator';

export interface CircleObstacle {
  x: number;
  z: number;
  radius: number;
}

type Grid = Pick<DungeonData, 'width' | 'height' | 'cells'>;

/** 원(캐릭터)이 벽 칸과 겹치면 밀어낸다 */
function resolveGrid(grid: Grid, p: { x: number; z: number }, r: number): void {
  const minX = Math.floor((p.x - r) / TILE);
  const maxX = Math.floor((p.x + r) / TILE);
  const minY = Math.floor((p.z - r) / TILE);
  const maxY = Math.floor((p.z + r) / TILE);
  for (let cy = minY; cy <= maxY; cy++) {
    for (let cx = minX; cx <= maxX; cx++) {
      if (isFloor(grid, cx, cy)) continue;
      const nearestX = Math.max(cx * TILE, Math.min(p.x, (cx + 1) * TILE));
      const nearestZ = Math.max(cy * TILE, Math.min(p.z, (cy + 1) * TILE));
      const dx = p.x - nearestX;
      const dz = p.z - nearestZ;
      const d2 = dx * dx + dz * dz;
      if (d2 >= r * r) continue;
      if (d2 > 1e-8) {
        const d = Math.sqrt(d2);
        p.x += (dx / d) * (r - d);
        p.z += (dz / d) * (r - d);
      } else {
        // 중심이 벽 안에 들어간 경우: 가장 가까운 면으로 뺀다
        const left = p.x - cx * TILE;
        const right = (cx + 1) * TILE - p.x;
        const top = p.z - cy * TILE;
        const bottom = (cy + 1) * TILE - p.z;
        const m = Math.min(left, right, top, bottom);
        if (m === left) p.x = cx * TILE - r;
        else if (m === right) p.x = (cx + 1) * TILE + r;
        else if (m === top) p.z = cy * TILE - r;
        else p.z = (cy + 1) * TILE + r;
      }
    }
  }
}

function resolveCircles(p: { x: number; z: number }, r: number, obstacles: readonly CircleObstacle[]): void {
  for (const o of obstacles) {
    const dx = p.x - o.x;
    const dz = p.z - o.z;
    const min = r + o.radius;
    const d2 = dx * dx + dz * dz;
    if (d2 >= min * min) continue;
    const d = Math.sqrt(d2) || 1e-4;
    p.x = o.x + (dx / d) * min;
    p.z = o.z + (dz / d) * min;
  }
}

/**
 * 이동을 작은 단계로 나눠 적용한다. 빠르게 움직여도 벽을 뚫지 않는다.
 * 원형 장애물에 부딪히면 옆으로 미끄러진다.
 */
export function moveWithCollision(
  grid: Grid,
  p: { x: number; z: number },
  dx: number,
  dz: number,
  r: number,
  obstacles: readonly CircleObstacle[],
): void {
  const dist = Math.hypot(dx, dz);
  const steps = Math.max(1, Math.ceil(dist / (r * 0.5)));
  for (let i = 0; i < steps; i++) {
    p.x += dx / steps;
    p.z += dz / steps;
    resolveCircles(p, r, obstacles);
    resolveGrid(grid, p, r);
  }
}
