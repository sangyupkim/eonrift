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
  /** 기계 입력 보관함 / 발전기 연료 / 보관상자 내용물 */
  buffer?: Record<string, number>;
  /** 기계가 가공 중인 레시피 */
  crafting?: string | null;
  /** 내보내지 못한 완성품 */
  out?: string[];
  /** 조립기: 고른 레시피 */
  recipe?: string | null;
  /** 보관상자: 투입(in) / 출하(out) */
  mode?: 'in' | 'out';
  /** 발전기: 지금 타고 있는 연료의 남은 시간(초) */
  fuel?: number;
  rr?: number;
  /** 제작대: 레벨과 충전된 에너지 */
  level?: number;
  energy?: number;
}

export interface FactoryState {
  sizeLevel: number;
  buildings: BuildingState[];
}

export type MachineStatus = 'working' | 'no-power' | 'idle' | 'blocked' | 'no-recipe';

const BELT_SPEED = 1;
export const BOX_CAPACITY = 999;
export const MACHINE_TYPES = new Set<BuildingType>(['smelter', 'crusher', 'infuser', 'assembler', 'alchemy']);
export const ESSENCES = ['essence_low', 'essence_mid', 'essence_high'];

export function recipesFor(machine: BuildingType): Recipe[] {
  return RECIPES.filter((r) => r.machine === machine);
}

export const RECIPE_BY_ID: Record<string, Recipe> = Object.fromEntries(RECIPES.map((r) => [r.id, r]));

/** 제작대 에너지 최대치 */
export function workbenchCap(b: BuildingState): number {
  return 300 * (b.level ?? 1);
}

export function boxTotal(b: BuildingState): number {
  return Object.values(b.buffer ?? {}).reduce((a, n) => a + n, 0);
}

export class Factory {
  private index = new Map<number, BuildingState>();
  /** 건물마다 속한 전력망 번호 */
  private netOf = new Map<BuildingState, number>();
  private netRatio: number[] = [];
  private netSupply: number[] = [];
  private netDemand: number[] = [];
  private dirty = true;
  /** 출하상자로 들어간 아이템을 알린다 (퀘스트용) */
  onCraft: ((item: string, count: number) => void) | null = null;

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
    if (type === 'generator') {
      b.fuel = 0;
      b.buffer = {};
    }
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
    if (type === 'workbench') {
      b.level = 1;
      b.energy = 0;
    }
    if (type === 'box') {
      b.buffer = {};
      b.mode = 'in';
    }
    this.state.buildings.push(b);
    this.index.set(this.key(x, y), b);
    this.dirty = true;
    return b;
  }

  /** 철거. 안에 있던 아이템은 창고로 돌려준다 */
  remove(x: number, y: number, give: (id: string, n: number) => void): BuildingState | null {
    const b = this.at(x, y);
    if (!b) return null;
    if (b.item) give(b.item, 1);
    for (const [id, n] of Object.entries(b.buffer ?? {})) if (n > 0) give(id, n);
    for (const id of b.out ?? []) give(id, 1);
    if (b.crafting) for (const [id, n] of Object.entries(RECIPE_BY_ID[b.crafting].inputs)) give(id, n);
    this.state.buildings = this.state.buildings.filter((o) => o !== b);
    this.reindex();
    return b;
  }

  rotate(x: number, y: number): void {
    const b = this.at(x, y);
    if (b) b.dir = ((b.dir + 1) % 4) as Dir;
  }

  /**
   * 전력망: 발전기와 마력선끼리 이어진 덩어리.
   * 기계는 자기와 맞닿은 마력선(또는 발전기)이 속한 망에서 전력을 받는다. 기계끼리는 전력이 이어지지 않는다.
   */
  private buildNetworks(): void {
    this.netOf.clear();
    let id = 0;
    const conducts = (b: BuildingState) => b.type === 'wire' || b.type === 'generator';
    for (const start of this.state.buildings) {
      if (!conducts(start) || this.netOf.has(start)) continue;
      const stack = [start];
      this.netOf.set(start, id);
      while (stack.length) {
        const b = stack.pop()!;
        for (const [dx, dy] of DIRS) {
          const n = this.at(b.x + dx, b.y + dy);
          if (n && conducts(n) && !this.netOf.has(n)) {
            this.netOf.set(n, id);
            stack.push(n);
          }
        }
      }
      id++;
    }
    for (const m of this.state.buildings) {
      if (!MACHINE_TYPES.has(m.type) && m.type !== 'workbench') continue;
      for (const [dx, dy] of DIRS) {
        const n = this.at(m.x + dx, m.y + dy);
        if (n && conducts(n)) {
          this.netOf.set(m, this.netOf.get(n)!);
          break;
        }
      }
    }
    this.netRatio = new Array(id).fill(0);
    this.netSupply = new Array(id).fill(0);
    this.netDemand = new Array(id).fill(0);
    this.dirty = false;
  }

  /** 건물이 받은 전력 비율 (0~1) */
  powerOf(b: BuildingState): number {
    if (this.dirty) this.buildNetworks();
    const n = this.netOf.get(b);
    return n === undefined ? 0 : this.netRatio[n];
  }

  connected(b: BuildingState): boolean {
    if (this.dirty) this.buildNetworks();
    return this.netOf.has(b);
  }

  networkInfo(b: BuildingState): { supply: number; demand: number } | null {
    if (this.dirty) this.buildNetworks();
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

  step(dt: number): void {
    if (this.dirty) this.buildNetworks();
    const buildings = this.state.buildings;

    // 1. 발전기: 안에 넣어 둔 정수를 태운다
    this.netSupply.fill(0);
    this.netDemand.fill(0);
    for (const b of buildings) {
      if (MACHINE_TYPES.has(b.type) && b.crafting && this.netOf.has(b)) this.netDemand[this.netOf.get(b)!] += BUILDINGS[b.type].power;
      // 제작대는 에너지가 덜 찼을 때만 전력을 쓴다
      if (b.type === 'workbench' && (b.energy ?? 0) < workbenchCap(b) && this.netOf.has(b)) this.netDemand[this.netOf.get(b)!] += BUILDINGS.workbench.power;
    }
    for (const b of buildings) {
      if (b.type !== 'generator') continue;
      const net = this.netOf.get(b)!;
      // 전력을 쓰는 기계가 있을 때만 새 연료를 꺼낸다
      if ((b.fuel ?? 0) <= 0 && this.netDemand[net] > 0) {
        for (const id of ESSENCES) {
          if ((b.buffer![id] ?? 0) > 0) {
            b.buffer![id]--;
            b.fuel = ESSENCE_BURN[id];
            break;
          }
        }
      }
      if ((b.fuel ?? 0) > 0) this.netSupply[net] += BUILDINGS.generator.power;
    }
    for (let i = 0; i < this.netRatio.length; i++) {
      this.netRatio[i] = this.netDemand[i] > 0 ? Math.min(1, this.netSupply[i] / this.netDemand[i]) : 0;
    }
    for (const b of buildings) {
      if (b.type !== 'generator' || (b.fuel ?? 0) <= 0) continue;
      const net = this.netOf.get(b)!;
      if (this.netDemand[net] > 0) b.fuel = Math.max(0, b.fuel! - dt * Math.min(1, this.netDemand[net] / this.netSupply[net]));
    }

    // 제작대 충전: 전력을 받는 만큼 초당 에너지 1
    for (const b of buildings) {
      if (b.type !== 'workbench') continue;
      const r = this.powerOf(b);
      if (r > 0) b.energy = Math.min(workbenchCap(b), (b.energy ?? 0) + dt * r);
    }

    // 2. 투입 보관상자: 앞 칸이 받을 수 있을 때만 하나씩 보낸다
    for (const b of buildings) {
      if (b.type !== 'box' || b.mode !== 'in') continue;
      // 여러 재료가 있으면 번갈아 보낸다 (조립기에 재료가 골고루 들어가도록)
      const ids = Object.keys(b.buffer!).filter((id) => b.buffer![id] > 0).sort();
      for (let i = 0; i < ids.length; i++) {
        const id = ids[((b.rr ?? 0) + i) % ids.length];
        if (this.pushForward(b, id)) {
          b.buffer![id]--;
          if (b.buffer![id] === 0) delete b.buffer![id];
          b.rr = (b.rr ?? 0) + i + 1;
          break;
        }
      }
    }

    // 3. 기계
    for (const b of buildings) {
      if (!MACHINE_TYPES.has(b.type)) continue;
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
          this.onCraft?.(recipe.output, recipe.count);
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
        const [dx, dy] = DIRS[target.dir];
        if (target.type === 'belt' && from.x === target.x + dx && from.y === target.y + dy) return false;
        target.item = item;
        target.progress = 0;
        return true;
      }
      case 'box': {
        if (target.mode !== 'out' || boxTotal(target) >= BOX_CAPACITY) return false;
        target.buffer![item] = (target.buffer![item] ?? 0) + 1;
        return true;
      }
      case 'smelter':
      case 'crusher':
      case 'infuser':
      case 'assembler':
      case 'alchemy': {
        // 가공할 재료를 한 번 분량만 받는다. 한 재료를 여러 개 쓰는 레시피는 레일이 막히지 않게 두 번 분량까지
        const recipes = target.recipe ? [RECIPE_BY_ID[target.recipe]] : recipesFor(target.type);
        const recipe = recipes.find((r) => r.inputs[item] !== undefined);
        if (!recipe) return false;
        if (!target.recipe) {
          // 자동 레시피 기계는 다른 재료가 들어 있으면 받지 않는다
          const other = Object.entries(target.buffer!).some(([id, n]) => n > 0 && recipe.inputs[id] === undefined);
          if (other) return false;
        }
        const have = target.buffer![item] ?? 0;
        const multi = Object.values(recipe.inputs).some((n) => n > 1);
        if (have >= recipe.inputs[item] * (multi ? 2 : 1)) return false;
        target.buffer![item] = have + 1;
        return true;
      }
      default:
        return false;
    }
  }

  /** 오프라인 진행: 긴 시간을 굵은 단위로 계산한다 */
  simulate(seconds: number): void {
    const step = seconds > 600 ? 1 : 0.25;
    let t = 0;
    while (t < seconds) {
      const dt = Math.min(step, seconds - t);
      this.step(dt);
      t += dt;
    }
  }
}
