import { Rng } from '../core/rng';
import { pickResourceNode } from '../data/nodes';
import { themeForTier, type DecorKind } from '../data/themes';

/**
 * 차원던전 맵 생성기 (방 + 통로 방식).
 * three.js에 의존하지 않는 순수 데이터 생성이라 테스트하기 쉽다.
 * 좌표는 모두 타일 단위이며 x는 가로, y는 세로(월드의 z축)다.
 */

export const MAP_WIDTH = 40;
export const MAP_HEIGHT = 36;

export const CELL_VOID = 0;
export const CELL_FLOOR = 1;

export type RoomType = 'start' | 'combat' | 'resource' | 'elite' | 'treasure' | 'exit';

export interface Room {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
  type: RoomType;
}

export interface NodeSpawn {
  nodeId: string;
  /** 타일 좌표 (소수점 포함, 타일 중심 기준 약간 흔들림) */
  x: number;
  y: number;
}

export interface MonsterSpawn {
  x: number;
  y: number;
  kind: 'normal' | 'elite' | 'midboss' | 'boss';
}

export interface DecorSpawn {
  kind: DecorKind;
  color: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
}

export interface DungeonData {
  seed: number;
  tier: number;
  /** 단계 안의 방 번호 (1~10). 5는 중간보스, 10은 수호자 */
  stage: number;
  width: number;
  height: number;
  cells: Uint8Array;
  rooms: Room[];
  /** 방 번호 (방이 아닌 칸은 -1). 미니맵에서 방 단위로 밝힐 때 쓴다 */
  roomIndex: Int16Array;
  start: { x: number; y: number };
  exit: { x: number; y: number };
  nodes: NodeSpawn[];
  monsters: MonsterSpawn[];
  decor: DecorSpawn[];
}

export function cellAt(d: Pick<DungeonData, 'width' | 'height' | 'cells'>, x: number, y: number): number {
  if (x < 0 || y < 0 || x >= d.width || y >= d.height) return CELL_VOID;
  return d.cells[y * d.width + x];
}

export function isFloor(d: Pick<DungeonData, 'width' | 'height' | 'cells'>, x: number, y: number): boolean {
  return cellAt(d, x, y) === CELL_FLOOR;
}

const roomCenter = (r: Room) => ({ x: Math.floor(r.x + r.w / 2), y: Math.floor(r.y + r.h / 2) });

/** bossReady: 5·10번째 방의 보스가 지금 있는지 (쓰러뜨린 뒤 재등장 대기 중이면 false) */
export function generateDungeon(seed: number, tier: number, stage = 1, bossReady = true): DungeonData {
  const rng = new Rng(seed);
  // 방 배치가 너무 적게 나오면 같은 난수 흐름으로 다시 시도한다 (시드가 같으면 결과도 같다)
  for (let attempt = 0; attempt < 20; attempt++) {
    const result = tryGenerate(rng, seed, tier, stage, bossReady);
    if (result) return result;
  }
  throw new Error(`던전 생성 실패 (seed=${seed})`);
}

function tryGenerate(rng: Rng, seed: number, tier: number, stage: number, bossReady: boolean): DungeonData | null {
  const width = MAP_WIDTH;
  const height = MAP_HEIGHT;
  const cells = new Uint8Array(width * height);
  const theme = themeForTier(tier);

  // 1. 방 배치
  const rooms: Room[] = [];
  // 보스 방(5·10번째 방)은 넓은 방을 먼저 놓는다
  const bossStage = stage === 5 || stage === 10;
  if (bossStage) {
    const w = stage === 10 ? 17 : 14;
    const h = stage === 10 ? 14 : 12;
    rooms.push({ id: 0, x: rng.int(1, width - w - 1), y: rng.int(1, height - h - 1), w, h, type: 'combat' });
  }
  const targetRooms = rng.int(8, 10);
  for (let i = 0; i < 600 && rooms.length < targetRooms; i++) {
    const w = rng.int(6, 10);
    const h = rng.int(6, 9);
    const x = rng.int(1, width - w - 1);
    const y = rng.int(1, height - h - 1);
    const overlaps = rooms.some(
      (r) => x < r.x + r.w + 2 && x + w + 2 > r.x && y < r.y + r.h + 2 && y + h + 2 > r.y,
    );
    if (!overlaps) rooms.push({ id: rooms.length, x, y, w, h, type: 'combat' });
  }
  if (rooms.length < 7) return null;

  const roomIndex = new Int16Array(width * height).fill(-1);
  for (const r of rooms) {
    for (let y = r.y; y < r.y + r.h; y++) {
      for (let x = r.x; x < r.x + r.w; x++) {
        cells[y * width + x] = CELL_FLOOR;
        roomIndex[y * width + x] = r.id;
      }
    }
  }

  // 2. 최소 신장 트리로 모든 방을 잇고, 순환 통로를 조금 더한다
  const centers = rooms.map(roomCenter);
  const dist = (a: number, b: number) => Math.abs(centers[a].x - centers[b].x) + Math.abs(centers[a].y - centers[b].y);
  const edges: [number, number][] = [];
  const inTree = new Set<number>([0]);
  while (inTree.size < rooms.length) {
    let best: [number, number] | null = null;
    let bestDist = Infinity;
    for (const a of inTree) {
      for (let b = 0; b < rooms.length; b++) {
        if (inTree.has(b)) continue;
        const d = dist(a, b);
        if (d < bestDist) {
          bestDist = d;
          best = [a, b];
        }
      }
    }
    edges.push(best!);
    inTree.add(best![1]);
  }
  const extra: [number, number][] = [];
  for (let a = 0; a < rooms.length; a++) {
    for (let b = a + 1; b < rooms.length; b++) {
      if (!edges.some(([p, q]) => (p === a && q === b) || (p === b && q === a))) extra.push([a, b]);
    }
  }
  extra.sort((e1, e2) => dist(e1[0], e1[1]) - dist(e2[0], e2[1]));
  const loops = rng.int(1, 2);
  for (let i = 0, added = 0; i < extra.length && added < loops; i++) {
    if (rng.chance(0.5)) {
      edges.push(extra[i]);
      added++;
    }
  }

  // 3. 통로 파기 (폭 2칸의 L자 통로)
  const carve = (x: number, y: number) => {
    for (let dy = 0; dy < 2; dy++) {
      for (let dx = 0; dx < 2; dx++) {
        const cx = Math.min(Math.max(x + dx, 1), width - 2);
        const cy = Math.min(Math.max(y + dy, 1), height - 2);
        cells[cy * width + cx] = CELL_FLOOR;
      }
    }
  };
  for (const [a, b] of edges) {
    const p = centers[a];
    const q = centers[b];
    const horizontalFirst = rng.chance(0.5);
    const corner = horizontalFirst ? { x: q.x, y: p.y } : { x: p.x, y: q.y };
    for (const [from, to] of [
      [p, corner],
      [corner, q],
    ] as const) {
      const sx = Math.sign(to.x - from.x);
      const sy = Math.sign(to.y - from.y);
      let x = from.x;
      let y = from.y;
      carve(x, y);
      while (x !== to.x || y !== to.y) {
        x += sx;
        y += sy;
        carve(x, y);
      }
    }
  }

  // 4. 시작 방과 출구 방 (시작에서 가장 먼 방이 출구)
  let startRoom = rng.pick(rooms);
  if (bossStage) {
    // 보스 방에서 가장 먼 방에서 시작한다
    const b = roomCenter(rooms[0]);
    const fromBoss = bfs(cells, width, height, b.x, b.y);
    let best = -1;
    for (const r of rooms.slice(1)) {
      const c = roomCenter(r);
      const d = fromBoss[c.y * width + c.x];
      if (d > best) {
        best = d;
        startRoom = r;
      }
    }
  }
  startRoom.type = 'start';
  const start = roomCenter(startRoom);
  const distances = bfs(cells, width, height, start.x, start.y);
  let exitRoom = startRoom;
  let far = -1;
  for (const r of rooms) {
    const c = roomCenter(r);
    const d = distances[c.y * width + c.x];
    if (r !== startRoom && d > far) {
      far = d;
      exitRoom = r;
    }
  }
  if (bossStage) exitRoom = rooms[0];
  exitRoom.type = 'exit';
  const exit = roomCenter(exitRoom);

  // 5. 나머지 방 역할: 정예 1, 보물 1, 자원 2~3, 나머지는 전투
  const others = rng.shuffle(rooms.filter((r) => r.type === 'combat'));
  const roles: RoomType[] = ['elite', 'treasure', 'resource', 'resource'];
  if (rng.chance(0.5)) roles.push('resource');
  others.forEach((r, i) => {
    if (i < roles.length) r.type = roles[i];
  });

  // 6. 채집물, 몬스터, 장식 배치
  const occupied = new Uint8Array(width * height);
  const nodes: NodeSpawn[] = [];
  const monsters: MonsterSpawn[] = [];
  const decor: DecorSpawn[] = [];

  /** 방 안쪽(가장자리 1칸 제외)의 빈 칸을 하나 고른다. 채집물끼리는 한 칸 이상 떨어뜨린다 */
  const pickInteriorCell = (r: Room, spacing: number): { x: number; y: number } | null => {
    const c = roomCenter(r);
    for (let i = 0; i < 40; i++) {
      const x = rng.int(r.x + 1, r.x + r.w - 2);
      const y = rng.int(r.y + 1, r.y + r.h - 2);
      if ((r.type === 'start' || r.type === 'exit') && Math.abs(x - c.x) <= 1 && Math.abs(y - c.y) <= 1) continue;
      let free = true;
      for (let dy = -spacing; dy <= spacing && free; dy++) {
        for (let dx = -spacing; dx <= spacing && free; dx++) {
          if (occupied[(y + dy) * width + (x + dx)]) free = false;
        }
      }
      if (free) {
        occupied[y * width + x] = 1;
        return { x, y };
      }
    }
    return null;
  };

  // 출구와 시작 지점 주변은 비워 둔다
  occupied[start.y * width + start.x] = 1;
  occupied[exit.y * width + exit.x] = 1;

  const nodeCount: Record<RoomType, [number, number]> = {
    start: [0, 1],
    combat: [1, 2],
    resource: [4, 6],
    elite: [1, 2],
    treasure: [0, 1],
    exit: [0, 0],
  };
  for (const r of rooms) {
    const [min, max] = nodeCount[r.type];
    const count = rng.int(min, max);
    for (let i = 0; i < count; i++) {
      const cell = pickInteriorCell(r, 1);
      if (!cell) break;
      nodes.push({ nodeId: pickResourceNode(tier, stage, theme.special, () => rng.next()), x: cell.x + rng.range(-0.15, 0.15), y: cell.y + rng.range(-0.15, 0.15) });
    }
    if (r.type === 'treasure') {
      const cell = pickInteriorCell(r, 1);
      if (cell) nodes.push({ nodeId: 'chest', x: cell.x, y: cell.y });
    }

    // 몬스터는 M3(전투)에서 쓰일 배치 정보만 미리 만든다
    if (r.type === 'combat' || r.type === 'resource') {
      // 깊은 방일수록 몬스터가 많다
      // 핵앤슬래시: 방마다 한 무리씩 몰려 있다
      const extra = Math.floor(stage / 3);
      const count = r.type === 'combat' ? rng.int(9, 12) + extra : rng.int(2, 4) + (stage > 5 ? 1 : 0);
      for (let i = 0; i < count; i++) {
        const cell = pickInteriorCell(r, 0);
        if (cell) monsters.push({ ...cell, kind: 'normal' });
      }
    } else if (r.type === 'elite') {
      const cell = pickInteriorCell(r, 0);
      if (cell) monsters.push({ ...cell, kind: 'elite' });
      // 정예는 부하를 거느린다
      for (let i = 0; i < 3 + Math.floor(stage / 4); i++) {
        const c = pickInteriorCell(r, 0);
        if (c) monsters.push({ ...c, kind: 'normal' });
      }
    } else if (r.type === 'exit') {
      if (stage === 10 && bossReady) monsters.push({ x: exit.x, y: exit.y - 2, kind: 'boss' });
      else if (stage === 5 && bossReady) monsters.push({ x: exit.x, y: exit.y - 2, kind: 'midboss' });
      else if (stage === 5 || stage === 10) {
        // 보스가 재등장을 기다리는 동안: 빈 보스 방 대신 정예 무리가 지킨다 (보스 보상 없음)
        monsters.push({ x: exit.x, y: exit.y - 2, kind: 'elite' });
        for (let i = 0; i < (stage === 10 ? 2 : 1); i++) {
          const c = pickInteriorCell(r, 0);
          if (c) monsters.push({ ...c, kind: 'elite' });
        }
        for (let i = 0; i < 5; i++) {
          const c = pickInteriorCell(r, 0);
          if (c) monsters.push({ ...c, kind: 'normal' });
        }
      } else {
        for (let i = 0; i < rng.int(4, 6); i++) {
          const cell = pickInteriorCell(r, 0);
          if (cell) monsters.push({ ...cell, kind: 'normal' });
        }
      }
    }
  }

  // 장식은 막지 않는 소품이라 바닥 아무 곳에나 흩뿌린다
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      if (cells[i] !== CELL_FLOOR || occupied[i] || !rng.chance(0.16)) continue;
      const d = rng.pick(theme.decor);
      decor.push({
        kind: d.kind,
        color: d.color,
        x: x + rng.range(0.1, 0.9),
        y: y + rng.range(0.1, 0.9),
        rotation: rng.range(0, Math.PI * 2),
        scale: rng.range(0.7, 1.3),
      });
    }
  }

  return { seed, tier, stage, width, height, cells, rooms, roomIndex, start, exit, nodes, monsters, decor };
}

/** 격자 위의 최단 거리 (4방향). 도달할 수 없는 칸은 -1 */
export function bfs(cells: Uint8Array, width: number, height: number, sx: number, sy: number): Int32Array {
  const dist = new Int32Array(width * height).fill(-1);
  const queue = new Int32Array(width * height);
  let head = 0;
  let tail = 0;
  dist[sy * width + sx] = 0;
  queue[tail++] = sy * width + sx;
  while (head < tail) {
    const i = queue[head++];
    const x = i % width;
    const y = (i - x) / width;
    const neighbors = [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1],
    ];
    for (const [nx, ny] of neighbors) {
      if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
      const j = ny * width + nx;
      if (cells[j] !== CELL_FLOOR || dist[j] !== -1) continue;
      dist[j] = dist[i] + 1;
      queue[tail++] = j;
    }
  }
  return dist;
}
