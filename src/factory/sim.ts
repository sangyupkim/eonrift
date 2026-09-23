import { BUILDINGS, ESSENCE_BURN, RECIPES, type BuildingType, type Recipe } from '../data/factory';

/** 0: +x(동), 1: +z(남), 2: -x(서), 3: -z(북) */
export type Dir = 0 | 1 | 2 | 3;
export const DIRS: [number, number][] = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];

export interface BuildingState {
  type: BuildingType;
  x: number;
  y: number;
  dir: Dir;
  /** 레일·분배기가 나르는 아이템 */
  item?: string | null;
  /** 레일 이동 진행도 또는 기계 가공 진행도 (0~1) */
  progress?: number;
  /** 기계 입력 보관함 */
  buffer?: Record<string, number>;
  /** 기계가 가공 중인 레시피 */
  crafting?: string | null;
  /** 내보내지 못한 완성품 */
  out?: string[];
  /** 조립기: 고른 레시피 / 투입 상자: 꺼낼 아이템 */
  recipe?: string | null;
  /** 발전기 남은 연료(초) */
  fuel?: number;
  timer?: number;
  rr?: number;
}

export interface FactoryState {
  sizeLevel: number;
  buildings: BuildingState[];
}

export interface Storage {
  count(id: string): number;
  take(id: string, n: number): boolean;
  add(id: string, n: number): void;
}

export type MachineStatus = 'working' | 'no-power' | 'idle' | 'blocked' | 'no-recipe';

const BELT_SPEED = 2;
const POWER_TYPES = new Set<BuildingType>(['generator', 'wire', 'smelter', 'crusher', 'infuser', 'assembler', 'alchemy']);
export const MACHINE_TYPES = new Set<BuildingType>(['smelter', 'crusher', 'infuser', 'assembler', 'alchemy']);

export function recipesFor(machine: BuildingType): Recipe[] {
  return RECIPES.filter((r) => r.machine === machine);
}

const RECIPE_BY_ID = Object.fromEntries(RECIPES.map((r) => [r.id, r]));

export class Factory {
  private index = new Map<number, BuildingState>();
  /** 건물마다 속한 전력망 번호 */
  private netOf = new Map<BuildingState, number>();
  private netRatio: number[] = [];
  private netSupply: number[] = [];
  private netDemand: number[] = [];
  private dirty = true;

  constructor(
    public state: FactoryState,
    public size: number,
  ) {
    this.reindex();
  }

  private key(x: number, y: number): number {
    return y * 1000 + x;
  }

  private reindex(): void {
    this.index.clear();
    for (const b of this.state.buildings) this.index.set(this.key(b.x, b.y), b);
    this.dirty = true;
  }

  at(x: number, y: number): BuildingState | undefined {
    return this.index.get(this.key(x, y));
  }

  inBounds(x: number, y: number): boolean {
    return x >= 0 && y >= 0 && x < this.size && y < this.size;
  }

  place(type: BuildingType, x: number, y: number, dir: Dir): BuildingState | null {
    if (!this.inBounds(x, y) || this.at(x, y)) return null;
    const b: BuildingState = { type, x, y, dir };
    if (type === 'generator') b.fuel = 0;
    if (MACHINE_TYPES.has(type)) {
      b.buffer = {};
      b.out = [];
      b.progress = 0;
      b.crafting = null;
      if (type === 'alchemy') b.recipe = 'potion';
    }
    if (type === 'belt' || type === 'splitter') {
      b.item = null;
      b.progress = 0;
    }
    if (type === 'input') b.timer = 0;
    this.state.buildings.push(b);
    this.index.set(this.key(x, y), b);
    this.dirty = true;
    return b;
  }

  /** 철거. 안에 있던 아이템은 창고로 돌려준다 */
  remove(x: number, y: number, storage: Storage): BuildingState | null {
    const b = this.at(x, y);
    if (!b) return null;
    if (b.item) storage.add(b.item, 1);
    for (const [id, n] of Object.entries(b.buffer ?? {})) if (n > 0) storage.add(id, n);
    for (const id of b.out ?? []) storage.add(id, 1);
    this.state.buildings = this.state.buildings.filter((o) => o !== b);
    this.reindex();
    return b;
  }

  rotate(x: number, y: number): void {
    const b = this.at(x, y);
    if (b) b.dir = ((b.dir + 1) % 4) as Dir;
  }

  /** 전력망 계산: 인접한 전력 건물끼리 한 망이 된다 */
  private buildNetworks(): void {
    this.netOf.clear();
    let id = 0;
    for (const start of this.state.buildings) {
      if (!POWER_TYPES.has(start.type) || this.netOf.has(start)) continue;
      const stack = [start];
      this.netOf.set(start, id);
      while (stack.length) {
        const b = stack.pop()!;
        for (const [dx, dy] of DIRS) {
          const n = this.at(b.x + dx, b.y + dy);
          if (n && POWER_TYPES.has(n.type) && !this.netOf.has(n)) {
            this.netOf.set(n, id);
            stack.push(n);
          }
        }
      }
      id++;
    }
    this.netRatio = new Array(id).fill(0);
    this.netSupply = new Array(id).fill(0);
    this.netDemand = new Array(id).fill(0);
    this.dirty = false;
  }

  /** 건물이 받은 전력 비율 (0~1) */
  powerOf(b: BuildingState): number {
    const n = this.netOf.get(b);
    return n === undefined ? 0 : this.netRatio[n];
  }

  networkInfo(b: BuildingState): { supply: number; demand: number } | null {
    const n = this.netOf.get(b);
    return n === undefined ? null : { supply: this.netSupply[n], demand: this.netDemand[n] };
  }

  status(b: BuildingState): MachineStatus {
    if (!MACHINE_TYPES.has(b.type)) return 'idle';
    if (b.type === 'assembler' && !b.recipe) return 'no-recipe';
    if ((b.out?.length ?? 0) > 0) return 'blocked';
    if (!b.crafting) return 'idle';
    return this.powerOf(b) > 0 ? 'working' : 'no-power';
  }

  step(dt: number, storage: Storage): void {
    if (this.dirty) this.buildNetworks();
    const buildings = this.state.buildings;

    // 1. 발전기 연료
    this.netSupply.fill(0);
    this.netDemand.fill(0);
    for (const b of buildings) {
      if (b.type !== 'generator') continue;
      if ((b.fuel ?? 0) <= 0) {
        for (const id of ['essence_low', 'essence_mid', 'essence_high']) {
          if (storage.take(id, 1)) {
            b.fuel = ESSENCE_BURN[id];
            break;
          }
        }
      }
      if ((b.fuel ?? 0) > 0) {
        this.netSupply[this.netOf.get(b)!] += BUILDINGS.generator.power;
      }
    }
    for (const b of buildings) {
      if (MACHINE_TYPES.has(b.type) && b.crafting) this.netDemand[this.netOf.get(b)!] += BUILDINGS[b.type].power;
    }
    for (let i = 0; i < this.netRatio.length; i++) {
      this.netRatio[i] = this.netDemand[i] > 0 ? Math.min(1, this.netSupply[i] / this.netDemand[i]) : this.netSupply[i] > 0 ? 1 : 0;
    }
    // 연료는 실제로 쓰일 때만 닳는다 (기계가 놀면 아낀다)
    for (const b of buildings) {
      if (b.type !== 'generator' || (b.fuel ?? 0) <= 0) continue;
      const net = this.netOf.get(b)!;
      if (this.netDemand[net] > 0) b.fuel = Math.max(0, b.fuel! - dt * Math.min(1, this.netDemand[net] / this.netSupply[net]));
    }

    // 2. 투입 상자
    for (const b of buildings) {
      if (b.type !== 'input' || !b.recipe) continue;
      b.timer = (b.timer ?? 0) + dt;
      if (b.timer < 1) continue;
      if (storage.count(b.recipe) <= 0) {
        b.timer = 1;
        continue;
      }
      if (this.pushForward(b, b.recipe)) {
        storage.take(b.recipe, 1);
        b.timer = 0;
      } else b.timer = 1;
    }

    // 3. 기계
    for (const b of buildings) {
      if (!MACHINE_TYPES.has(b.type)) continue;
      // 완성품 내보내기
      while (b.out!.length > 0 && this.pushForward(b, b.out![0])) b.out!.shift();
      if (b.out!.length > 0) continue;
      if (!b.crafting) {
        const recipe = this.readyRecipe(b);
        if (recipe) {
          for (const [id, n] of Object.entries(recipe.inputs)) b.buffer![id] -= n;
          b.crafting = recipe.id;
          b.progress = 0;
        }
      }
      if (b.crafting) {
        const recipe = RECIPE_BY_ID[b.crafting];
        b.progress! += (dt * this.powerOf(b)) / recipe.time;
        if (b.progress! >= 1) {
          for (let i = 0; i < recipe.count; i++) b.out!.push(recipe.output);
          b.crafting = null;
          b.progress = 0;
          while (b.out!.length > 0 && this.pushForward(b, b.out![0])) b.out!.shift();
        }
      }
    }

    // 4. 레일과 분배기
    for (const b of buildings) {
      if ((b.type !== 'belt' && b.type !== 'splitter') || !b.item) continue;
      b.progress = Math.min(1, (b.progress ?? 0) + dt * BELT_SPEED);
      if (b.progress < 1) continue;
      if (b.type === 'belt') {
        if (this.pushForward(b, b.item)) b.item = null;
      } else {
        // 앞, 오른쪽, 왼쪽 순서로 번갈아 보낸다
        const order = [b.dir, (b.dir + 1) % 4, (b.dir + 3) % 4] as Dir[];
        for (let i = 0; i < 3; i++) {
          const d = order[((b.rr ?? 0) + i) % 3];
          if (this.pushTo(b, d, b.item)) {
            b.item = null;
            b.rr = ((b.rr ?? 0) + i + 1) % 3;
            break;
          }
        }
      }
    }
  }

  private readyRecipe(b: BuildingState): Recipe | null {
    const candidates = b.recipe ? [RECIPE_BY_ID[b.recipe]] : recipesFor(b.type);
    for (const r of candidates) {
      if (Object.entries(r.inputs).every(([id, n]) => (b.buffer![id] ?? 0) >= n)) return r;
    }
    return null;
  }

  private pushForward(b: BuildingState, item: string): boolean {
    return this.pushTo(b, b.dir, item);
  }

  private pushTo(b: BuildingState, dir: Dir, item: string): boolean {
    const [dx, dy] = DIRS[dir];
    const target = this.at(b.x + dx, b.y + dy);
    if (!target) return false;
    return this.accept(target, item, b);
  }

  /** target이 from에서 오는 item을 받을 수 있으면 받는다 */
  accept(target: BuildingState, item: string, from: BuildingState): boolean {
    switch (target.type) {
      case 'belt':
      case 'splitter': {
        if (target.item) return false;
        // 자기 앞 칸에서 거꾸로 들어오는 것은 막는다
        const [dx, dy] = DIRS[target.dir];
        if (target.type === 'belt' && from.x === target.x + dx && from.y === target.y + dy) return false;
        target.item = item;
        target.progress = 0;
        return true;
      }
      case 'output':
        this.onOutput?.(item);
        return true;
      case 'smelter':
      case 'crusher':
      case 'infuser':
      case 'assembler':
      case 'alchemy': {
        const recipes = target.recipe ? [RECIPE_BY_ID[target.recipe]] : recipesFor(target.type);
        const recipe = recipes.find((r) => r.inputs[item] !== undefined);
        if (!recipe) return false;
        const have = target.buffer![item] ?? 0;
        if (have >= recipe.inputs[item] * 3) return false;
        target.buffer![item] = have + 1;
        return true;
      }
      default:
        return false;
    }
  }

  /** 출하 상자로 들어간 아이템 (창고에 넣는 쪽에서 연결한다) */
  onOutput: ((item: string) => void) | null = null;

  /** 오프라인 진행: 긴 시간을 굵은 단위로 계산한다 */
  simulate(seconds: number, storage: Storage): void {
    const step = seconds > 600 ? 1 : 0.25;
    let t = 0;
    while (t < seconds) {
      const dt = Math.min(step, seconds - t);
      this.step(dt, storage);
      t += dt;
    }
  }
}
