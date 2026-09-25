import { BUILDINGS, ESSENCE_BOOST, ESSENCE_BURN, generatorPower, levelSpeed, RECIPES, type BuildingType, type Recipe } from '../data/factory';

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
  /** 연금 솥: 고른 레시피 */
  recipe?: string | null;
  /** 보관상자: 투입(in) / 출하(out) */
  mode?: 'in' | 'out';
  /** 발전기: 지금 타고 있는 연료의 남은 시간(초) */
  fuel?: number;
  /** 발전기: 지금 타고 있는 정수 */
  fuelId?: string;
  rr?: number;
  /** 마력 치유석: 누군가 회복 중이면 true (그때만 전력을 쓴다) */
  active?: boolean;
  /** 건물 레벨 (제작대 포함) */
  level?: number;
  /** 제작대: 지금 만드는 작업 */
  job?: WorkJob | null;
  /** 제작대: 다음에 만들 작업들 (예약) */
  queue?: WorkJob[];
  /** 제작대: 완성된 장비·도구 (게임이 창고로 옮긴다) */
  ready?: WorkJob[];
}

/**
 * 제작대 작업. 재료와 골드는 시작할 때 전부 낸다.
 * item: 아이템(판·귀환석 등) — 완성되면 앞쪽 레일로 내보낸다
 * equip / tool: 장비·채집 도구 — 완성되면 창고로 간다
 */
export interface WorkJob {
  kind: 'item' | 'equip' | 'tool';
  /** item: 아이템 id · equip: 부위 · tool: pickaxe/axe */
  id: string;
  tier: number;
  /** 마력 제작 장비 (고급 이상) */
  mana?: boolean;
  /** 무기 제작 시 직업 */
  cls?: string;
  /** 한 번에 나오는 개수 (item) */
  count: number;
  /** 남은 횟수 */
  left: number;
  /** 한 번 만드는 데 걸리는 시간(초) */
  time: number;
  /** 한 번 분량 비용 (취소하면 남은 횟수만큼 돌려준다) */
  cost: { items: Record<string, number>; gold: number };
}

/** 제작대가 내보내지 못하고 쌓아 둘 수 있는 완성품 수 */
export const WORKBENCH_OUT_MAX = 20;
/** 제작대 예약 줄 길이 (지금 작업 제외) */
export const WORKBENCH_QUEUE_MAX = 8;

const sameJob = (a: WorkJob, b: WorkJob) => a.kind === b.kind && a.id === b.id && a.tier === b.tier && !!a.mana === !!b.mana && a.cls === b.cls;

/** 예약 줄에 넣을 수 있는지: 비어 있거나, 마지막 작업과 같은 것이거나, 자리가 남았을 때 */
export function canEnqueue(b: BuildingState, job: WorkJob): boolean {
  if (!b.job) return true;
  const last = b.queue?.length ? b.queue[b.queue.length - 1] : b.job;
  return sameJob(last, job) || (b.queue?.length ?? 0) < WORKBENCH_QUEUE_MAX;
}

/**
 * 제작대에 작업을 넣는다. 쉬고 있으면 바로 시작하고, 일하는 중이면 예약 줄 끝에 붙인다.
 * 마지막 작업과 같은 것이면 개수만 늘린다
 */
export function enqueueJob(b: BuildingState, job: WorkJob): boolean {
  if (!canEnqueue(b, job)) return false;
  if (!b.job) {
    b.job = job;
    b.progress = 0;
    return true;
  }
  b.queue ??= [];
  const last = b.queue.length ? b.queue[b.queue.length - 1] : b.job;
  if (sameJob(last, job)) last.left += job.left;
  else b.queue.push(job);
  return true;
}

export interface FactoryState {
  sizeLevel: number;
  buildings: BuildingState[];
}

export type MachineStatus = 'working' | 'no-power' | 'idle' | 'blocked' | 'no-recipe';

const BELT_SPEED = 1;
export const BOX_CAPACITY = 999;
export const MACHINE_TYPES = new Set<BuildingType>(['smelter', 'crusher', 'infuser', 'alchemy', 'condenser']);
/** 발전기 연료 (낮은 것부터) */
export const ESSENCES = ['essence_low', 'essence_mid', 'essence_high', 'essence_supreme', 'essence_dim'];

export function recipesFor(machine: BuildingType): Recipe[] {
  return RECIPES.filter((r) => r.machine === machine);
}

export const RECIPE_BY_ID: Record<string, Recipe> = Object.fromEntries(RECIPES.map((r) => [r.id, r]));

/** 제작대가 지금 일하는 중인지 (출구가 가득 차면 멈춘다) */
export function workbenchBusy(b: BuildingState): boolean {
  return !!b.job && (b.out?.length ?? 0) < WORKBENCH_OUT_MAX;
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
  /** 전력망마다 지금 타는 가장 좋은 정수의 생산 속도 배율 */
  private netBoost: number[] = [];
  private dirty = true;
  /** 일반 창고로 들어온 아이템을 차원집 보관함에 넣는다. 자리가 없으면 false */
  onStore: ((item: string) => boolean) | null = null;
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
      if (type === 'alchemy') b.recipe = null;
    }
    if (type === 'belt' || type === 'splitter') {
      b.item = null;
      b.progress = 0;
    }
    if (type === 'workbench') {
      b.level = 1;
      b.job = null;
      b.out = [];
      b.ready = [];
      b.progress = 0;
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
    if (b) {
      b.dir = ((b.dir + 1) % 4) as Dir;
      this.dirty = true;
    }
  }

  /** 지은 건물을 빈 칸으로 옮긴다 (안에 든 것은 그대로) */
  move(fx: number, fy: number, tx: number, ty: number): boolean {
    const b = this.at(fx, fy);
    if (!b || !this.inBounds(tx, ty) || this.at(tx, ty)) return false;
    b.x = tx;
    b.y = ty;
    this.reindex();
    return true;
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
      if (!MACHINE_TYPES.has(m.type) && m.type !== 'workbench' && m.type !== 'healer') continue;
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
    this.netBoost = new Array(id).fill(1);
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

  networkInfo(b: BuildingState): { supply: number; demand: number; boost: number } | null {
    if (this.dirty) this.buildNetworks();
    const n = this.netOf.get(b);
    return n === undefined ? null : { supply: this.netSupply[n], demand: this.netDemand[n], boost: this.netBoost[n] };
  }

  /** 건물이 받는 생산 속도 배율 (연료 등급) */
  boostOf(b: BuildingState): number {
    if (this.dirty) this.buildNetworks();
    const n = this.netOf.get(b);
    return n === undefined ? 1 : this.netBoost[n];
  }

  status(b: BuildingState): MachineStatus {
    if (b.type === 'workbench') {
      if ((b.out?.length ?? 0) >= WORKBENCH_OUT_MAX) return 'blocked';
      if (!b.job) return 'idle';
      return this.powerOf(b) > 0 ? 'working' : 'no-power';
    }
    if (!MACHINE_TYPES.has(b.type)) return 'idle';
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
    this.netBoost.fill(1);
    for (const b of buildings) {
      if (MACHINE_TYPES.has(b.type) && b.crafting && this.netOf.has(b)) this.netDemand[this.netOf.get(b)!] += BUILDINGS[b.type].power;
      // 제작대는 만드는 동안에만 전력을 쓴다
      if (b.type === 'workbench' && workbenchBusy(b) && this.netOf.has(b)) this.netDemand[this.netOf.get(b)!] += BUILDINGS.workbench.power;
      if (b.type === 'healer' && b.active && this.netOf.has(b)) this.netDemand[this.netOf.get(b)!] += BUILDINGS.healer.power;
    }
    for (const b of buildings) {
      if (b.type !== 'generator') continue;
      const net = this.netOf.get(b)!;
      // 전력을 쓰는 기계가 있을 때만 새 연료를 꺼낸다 (좋은 정수부터)
      if ((b.fuel ?? 0) <= 0 && this.netDemand[net] > 0) {
        b.fuelId = undefined;
        for (let i = ESSENCES.length - 1; i >= 0; i--) {
          const id = ESSENCES[i];
          if ((b.buffer![id] ?? 0) > 0) {
            b.buffer![id]--;
            b.fuel = ESSENCE_BURN[id];
            b.fuelId = id;
            break;
          }
        }
      }
      if ((b.fuel ?? 0) > 0) {
        this.netSupply[net] += generatorPower(b.level ?? 1);
        this.netBoost[net] = Math.max(this.netBoost[net], ESSENCE_BOOST[b.fuelId ?? 'essence_low'] ?? 1);
      }
    }
    for (let i = 0; i < this.netRatio.length; i++) {
      this.netRatio[i] = this.netDemand[i] > 0 ? Math.min(1, this.netSupply[i] / this.netDemand[i]) : 0;
    }
    for (const b of buildings) {
      if (b.type !== 'generator' || (b.fuel ?? 0) <= 0) continue;
      const net = this.netOf.get(b)!;
      if (this.netDemand[net] > 0) b.fuel = Math.max(0, b.fuel! - dt * Math.min(1, this.netDemand[net] / this.netSupply[net]));
    }

    // 제작대: 전력을 받는 만큼 작업이 진행된다
    for (const b of buildings) {
      if (b.type !== 'workbench') continue;
      b.out ??= [];
      while (b.out.length > 0 && this.pushForward(b, b.out[0])) b.out.shift();
      const job = b.job;
      if (!job || !workbenchBusy(b)) continue;
      b.progress = (b.progress ?? 0) + (dt * this.powerOf(b) * this.boostOf(b) * levelSpeed(b.level ?? 1)) / Math.max(1, job.time);
      if (b.progress < 1) continue;
      b.progress = 0;
      if (job.kind === 'item') {
        for (let i = 0; i < job.count; i++) b.out.push(job.id);
        this.onCraft?.(job.id, job.count);
        while (b.out.length > 0 && this.pushForward(b, b.out[0])) b.out.shift();
      } else (b.ready ??= []).push({ ...job, left: 1 });
      job.left--;
      if (job.left <= 0) b.job = b.queue?.shift() ?? null;
    }

    // 2. 투입 보관상자: 앞 칸이 받을 수 있을 때만 하나씩 보낸다
    for (const b of buildings) {
      if (b.type !== 'box' || b.mode !== 'in') continue;
      // 여러 재료가 있으면 번갈아 보낸다 (두 재료 레시피에 재료가 골고루 들어가도록).
      // 레일 끝에 기계가 있으면 그 기계가 지금 받을 수 있는 재료만 보낸다 (레일 위에 가는 중인 것까지 계산)
      // → 한 재료만 줄지어 레일을 막아 멈추는 일이 없다
      const dest = this.lineEnd(b);
      const ids = Object.keys(b.buffer!)
        .filter((id) => b.buffer![id] > 0)
        .filter((id) => !dest || this.machineWants(dest.machine, dest.transit, id))
        .sort();
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
        b.progress! += (dt * this.powerOf(b) * this.boostOf(b) * levelSpeed(b.level ?? 1)) / recipe.time;
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

  /** 재료가 일부만 들어와 멈춘 기계: 맞춰 가던 레시피와 모자란 재료 */
  missingInputs(b: BuildingState): { recipe: Recipe; missing: Record<string, number> } | null {
    if (!MACHINE_TYPES.has(b.type) || b.crafting) return null;
    const have = Object.entries(b.buffer ?? {}).filter(([, n]) => n > 0);
    if (!have.length) return null;
    const candidates = (b.recipe ? [RECIPE_BY_ID[b.recipe]] : recipesFor(b.type)).filter((r) => r.tier <= (b.level ?? 1));
    const recipe = candidates.find((r) => have.every(([id]) => r.inputs[id] !== undefined));
    if (!recipe) return null;
    const missing: Record<string, number> = {};
    for (const [id, n] of Object.entries(recipe.inputs)) if ((b.buffer![id] ?? 0) < n) missing[id] = n - (b.buffer![id] ?? 0);
    return Object.keys(missing).length ? { recipe, missing } : null;
  }

  private readyRecipe(b: BuildingState): Recipe | null {
    const candidates = (b.recipe ? [RECIPE_BY_ID[b.recipe]] : recipesFor(b.type)).filter((r) => r.tier <= (b.level ?? 1));
    for (const r of candidates) {
      if (Object.entries(r.inputs).every(([id, n]) => (b.buffer![id] ?? 0) >= n)) return r;
    }
    return null;
  }

  /** b 앞으로 이어진 레일을 따라가서 끝에 있는 기계와, 레일 위에서 가는 중인 재료 수를 돌려준다 */
  private lineEnd(b: BuildingState): { machine: BuildingState; transit: Record<string, number> } | null {
    const transit: Record<string, number> = {};
    const seen = new Set<BuildingState>();
    let [dx, dy] = DIRS[b.dir];
    let cur = this.at(b.x + dx, b.y + dy);
    while (cur && cur.type === 'belt' && !seen.has(cur)) {
      seen.add(cur);
      if (cur.item) transit[cur.item] = (transit[cur.item] ?? 0) + 1;
      [dx, dy] = DIRS[cur.dir];
      cur = this.at(cur.x + dx, cur.y + dy);
    }
    if (!cur || !MACHINE_TYPES.has(cur.type)) return null;
    for (const [id, n] of Object.entries(cur.buffer ?? {})) transit[id] = (transit[id] ?? 0) + n;
    return { machine: cur, transit };
  }

  /** 기계에 이미 있는 것(counts)을 생각할 때 item을 하나 더 보내도 되는지 */
  private machineWants(m: BuildingState, counts: Record<string, number>, item: string): boolean {
    const recipes = (m.recipe ? [RECIPE_BY_ID[m.recipe]] : recipesFor(m.type)).filter((r) => r.tier <= (m.level ?? 1));
    return recipes.some((r) => {
      if (r.inputs[item] === undefined) return false;
      if (!m.recipe && Object.entries(counts).some(([id, n]) => n > 0 && r.inputs[id] === undefined)) return false;
      return (counts[item] ?? 0) < r.inputs[item] * 2;
    });
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
      case 'warehouse':
        // 일반 창고: 레일로 들어온 것을 차원집 보관함에 모은다
        return this.onStore?.(item) ?? false;
      case 'box': {
        if (target.mode !== 'out' || boxTotal(target) >= BOX_CAPACITY) return false;
        target.buffer![item] = (target.buffer![item] ?? 0) + 1;
        return true;
      }
      case 'smelter':
      case 'crusher':
      case 'infuser':
      case 'alchemy':
      case 'condenser': {
        // 가공할 재료를 한 번 분량만 받는다. 한 재료를 여러 개 쓰는 레시피는 레일이 막히지 않게 두 번 분량까지
        // 건물 레벨보다 높은 단계 재료는 받지 않는다
        // 한 재료가 여러 레시피에 쓰일 수 있다 (하급 정수: 마력 구리·철·금·판자). 첫 레시피만 보면
        // 판자가 들어 있는 주입기가 정수를 '다른 재료'로 보고 거부해 영원히 멈췄다 → 지금 든 재료와 맞는 레시피를 모두 본다
        const recipes = (target.recipe ? [RECIPE_BY_ID[target.recipe]] : recipesFor(target.type)).filter((r) => r.tier <= (target.level ?? 1));
        const have = target.buffer![item] ?? 0;
        const ok = recipes.some((r) => {
          if (r.inputs[item] === undefined) return false;
          // 자동 레시피 기계는 이 레시피에 없는 재료가 들어 있으면 받지 않는다
          if (!target.recipe && Object.entries(target.buffer!).some(([id, n]) => n > 0 && r.inputs[id] === undefined)) return false;
          // 두 번 분량까지 받아 둔다 (레일 위에서 기다리던 재료가 들어올 수 있게)
          return have < r.inputs[item] * 2;
        });
        if (!ok) return false;
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
