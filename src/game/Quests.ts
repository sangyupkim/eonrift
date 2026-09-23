import { Rng } from '../core/rng';
import { BUILDINGS } from '../data/factory';
import { ITEMS } from '../data/items';
import { NODES } from '../data/nodes';
import { ALL_QUESTS, QUEST_BY_ID, type NpcRef, type Objective, type QuestDef, type Reward } from '../data/quests';
import { themeForTier } from '../data/themes';

export interface DailyQuest {
  id: string;
  title: string;
  objective: Objective;
  reward: Reward;
  progress: number;
  claimed: boolean;
}

export interface QuestState {
  /** 진행 중인 퀘스트: 목표별 진행 수 */
  active: Record<string, number[]>;
  done: string[];
  daily: { date: string; list: DailyQuest[] };
}

export function newQuestState(): QuestState {
  return { active: {}, done: [], daily: { date: '', list: [] } };
}

/** 퀘스트가 창고와 진행 상황을 보려고 쓰는 최소한의 정보 */
export interface QuestContext {
  count(id: string): number;
  stones: number;
  cleared: number;
  flag(name: string): number;
}

export function todayKey(d = new Date()): string {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

/** 목표 하나의 현재 진행 수 */
export function objectiveProgress(o: Objective, stored: number, ctx: QuestContext): number {
  switch (o.type) {
    case 'deliver':
      return Math.min(o.count, ctx.count(o.item));
    case 'clear':
      return ctx.cleared >= o.stage ? 1 : 0;
    default:
      return Math.min(o.count, stored);
  }
}

export function objectiveNeed(o: Objective): number {
  return o.type === 'clear' ? 1 : o.count;
}

export function objectiveText(o: Objective): string {
  switch (o.type) {
    case 'kill':
      return o.label ?? `몬스터 처치${o.minTier ? ` (${o.minTier}단계 이상)` : ''}`;
    case 'elite':
      return '정예 몬스터 처치';
    case 'gather':
      return `${ITEMS[o.item].name} 채집`;
    case 'deliver':
      return `${ITEMS[o.item].name} 가져오기`;
    case 'build':
      return `${BUILDINGS[o.building as keyof typeof BUILDINGS].name} 설치`;
    case 'craft':
      return `${ITEMS[o.item].name} 생산`;
    case 'clear':
      return o.label;
    case 'stages':
      return '스테이지 클리어';
  }
}

export class Quests {
  constructor(
    public state: QuestState,
    private ctx: QuestContext,
  ) {}

  isDone(id: string): boolean {
    return this.state.done.includes(id);
  }

  isActive(id: string): boolean {
    return id in this.state.active;
  }

  /** NPC가 새로 줄 수 있는 퀘스트 */
  available(npc: NpcRef): QuestDef[] {
    return ALL_QUESTS.filter(
      (q) =>
        q.npc === npc &&
        !this.isDone(q.id) &&
        !this.isActive(q.id) &&
        (q.after ?? []).every((a) => this.isDone(a)) &&
        (q.requireFlags ?? []).every((f) => this.ctx.flag(f) > 0) &&
        this.ctx.stones >= (q.requireStones ?? 0),
    );
  }

  activeFor(npc: NpcRef): QuestDef[] {
    return Object.keys(this.state.active)
      .map((id) => QUEST_BY_ID[id])
      .filter((q) => q && q.npc === npc);
  }

  activeList(): QuestDef[] {
    return Object.keys(this.state.active)
      .map((id) => QUEST_BY_ID[id])
      .filter(Boolean);
  }

  progress(q: QuestDef): { text: string; cur: number; need: number }[] {
    const stored = this.state.active[q.id] ?? [];
    return q.objectives.map((o, i) => ({ text: objectiveText(o), cur: objectiveProgress(o, stored[i] ?? 0, this.ctx), need: objectiveNeed(o) }));
  }

  canComplete(q: QuestDef): boolean {
    return this.isActive(q.id) && this.progress(q).every((p) => p.cur >= p.need);
  }

  accept(q: QuestDef): void {
    this.state.active[q.id] = q.objectives.map(() => 0);
  }

  /** 완료 처리 (가져오기 아이템은 호출하는 쪽에서 창고에서 뺀다) */
  finish(q: QuestDef): void {
    delete this.state.active[q.id];
    this.state.done.push(q.id);
  }

  /** 게임 이벤트를 진행 중인 퀘스트와 일일 퀘스트에 반영한다 */
  event(e: { type: 'kill'; tier: number; elite: boolean } | { type: 'gather'; item: string; count: number } | { type: 'build'; building: string } | { type: 'craft'; item: string; count: number } | { type: 'stage' }): void {
    const apply = (o: Objective, cur: number): number => {
      switch (o.type) {
        case 'kill':
          return e.type === 'kill' && e.tier >= (o.minTier ?? 0) ? cur + 1 : cur;
        case 'elite':
          return e.type === 'kill' && e.elite ? cur + 1 : cur;
        case 'gather':
          return e.type === 'gather' && e.item === o.item ? cur + e.count : cur;
        case 'build':
          return e.type === 'build' && e.building === o.building ? cur + 1 : cur;
        case 'craft':
          return e.type === 'craft' && e.item === o.item ? cur + e.count : cur;
        case 'stages':
          return e.type === 'stage' ? cur + 1 : cur;
        default:
          return cur;
      }
    };
    for (const [id, arr] of Object.entries(this.state.active)) {
      const q = QUEST_BY_ID[id];
      if (!q) continue;
      q.objectives.forEach((o, i) => (arr[i] = apply(o, arr[i] ?? 0)));
    }
    for (const d of this.state.daily.list) if (!d.claimed) d.progress = apply(d.objective, d.progress);
  }

  /** 날짜가 바뀌면 촌장의 일일 퀘스트 3개를 새로 뽑는다 */
  refreshDaily(maxTier: number, hasHome: boolean): boolean {
    const key = todayKey();
    if (this.state.daily.date === key) return false;
    const rng = new Rng(hashString(key) ^ 0x9e3779b9);
    const t = Math.max(1, maxTier);
    const pool: (() => DailyQuest)[] = [
      () => ({ id: 'kill', title: '틈새 정화', objective: { type: 'kill', count: 20 + t * 5 }, reward: { gold: 150 * t, exp: 80 * t * t }, progress: 0, claimed: false }),
      () => ({ id: 'elite', title: '정예 사냥', objective: { type: 'elite', count: 2 }, reward: { gold: 250 * t, exp: 120 * t * t, items: { stone_low: 1 } }, progress: 0, claimed: false }),
      () => ({ id: 'stages', title: '차원문 순찰', objective: { type: 'stages', count: 3 }, reward: { gold: 200 * t, exp: 100 * t * t, items: { potion: 2 } }, progress: 0, claimed: false }),
      () => {
        const theme = themeForTier(rng.int(1, t));
        const item = NODES[rng.pick(theme.nodes)].itemId;
        return { id: 'gather', title: '자원 조달', objective: { type: 'gather', item, count: 12 }, reward: { gold: 180 * t, exp: 90 * t * t }, progress: 0, claimed: false };
      },
    ];
    if (hasHome) pool.push(() => ({ id: 'craft', title: '공장 가동', objective: { type: 'craft', item: 'iron_ingot', count: 5 }, reward: { gold: 200 * t, exp: 100 * t * t, items: { essence_low: 5 } }, progress: 0, claimed: false }));
    rng.shuffle(pool);
    this.state.daily = { date: key, list: pool.slice(0, 3).map((f, i) => ({ ...f(), id: `${key}-${i}` })) };
    return true;
  }
}

function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}
