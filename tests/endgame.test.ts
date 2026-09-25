import { describe, expect, it } from 'vitest';
import { riftAffixCount, riftAffixes, rushGrade, rushReward, towerBoss, towerMult, towerStartFloor } from '../src/data/endgame';
import { BONUS_CAP, engraveCost, engraveRange, ENGRAVE_STAGES, rollEngrave, TITLES, transcendExp } from '../src/data/bonus';
import { TIER_PLATE } from '../src/data/items';
import { MAX_LEVEL } from '../src/data/classes';
import { Rng } from '../src/core/rng';
import { generateDungeon } from '../src/dungeon/generator';
import { Monster } from '../src/game/Monster';
import { SPECIES } from '../src/data/species';
import { newSave, Progress } from '../src/game/Progress';
import { Quests } from '../src/game/Quests';
import { RECIPES } from '../src/data/factory';

describe('무한의 탑', () => {
  it('1~10층은 층마다 +5%, 11층부터 10층마다 +15% 계단이 생긴다', () => {
    for (let f = 2; f <= 10; f++) expect(towerMult(f) / towerMult(f - 1)).toBeCloseTo(1.05, 5);
    expect(towerMult(11) / towerMult(10)).toBeCloseTo(1.03 * 1.15, 5);
    expect(towerMult(12) / towerMult(11)).toBeCloseTo(1.03, 5);
    expect(towerMult(21) / towerMult(20)).toBeCloseTo(1.03 * 1.15, 5);
    expect(towerMult(21) / towerMult(20)).toBeGreaterThan(towerMult(20) / towerMult(19) + 0.1);
  });
  it('5층마다 파수꾼, 10층마다 수호자. 체크포인트는 10층 단위', () => {
    expect(towerBoss(3)).toBeNull();
    expect(towerBoss(5)?.kind).toBe('midboss');
    expect(towerBoss(10)).toEqual({ kind: 'boss', tier: 1 });
    expect(towerBoss(80)).toEqual({ kind: 'boss', tier: 1 });
    expect(towerStartFloor(0)).toBe(1);
    expect(towerStartFloor(27)).toBe(21);
  });
});

describe('보스 러시 · 심연 균열', () => {
  it('등급과 보상', () => {
    expect(rushGrade(500)).toBe('S');
    expect(rushGrade(1300)).toBe('C');
    expect(rushReward(2, 'S').dust).toBeGreaterThan(rushReward(0, 'S').dust);
  });
  it('균열 변이는 단계가 오를수록 늘고, 같은 날 같은 단계는 같다', () => {
    expect(riftAffixCount(1)).toBe(0);
    expect(riftAffixCount(12)).toBe(4);
    const a = riftAffixes(8, '2026-9-25');
    expect(a).toHaveLength(3);
    expect(new Set(a).size).toBe(3);
    expect(riftAffixes(8, '2026-9-25')).toEqual(a);
  });
  it('보스 러시 맵: 시작 방 + 보스 방', () => {
    const d = generateDungeon(123, 3, 10, { boss: 'present', rooms: [2, 2] });
    expect(d.rooms.length).toBe(2);
    expect(d.monsters.filter((m) => m.kind === 'boss')).toHaveLength(1);
  });
  it('대군 변이는 몬스터를 늘리고, 정예 군단은 정예를 섞는다', () => {
    const base = generateDungeon(7, 5, 4, { rooms: [5, 6] });
    const more = generateDungeon(7, 5, 4, { rooms: [5, 6], monsterMult: 1.4, eliteChance: 0.5 });
    expect(more.monsters.length).toBeGreaterThan(base.monsters.length);
    expect(more.monsters.filter((m) => m.kind === 'elite').length).toBeGreaterThan(base.monsters.filter((m) => m.kind === 'elite').length);
  });
  it('몬스터 능력치 조정: 7단계 기준 + 배율', () => {
    const plain = new Monster(SPECIES.t1_melee, 'normal', 1, 1, {}, 0, 0, 0);
    const hard = new Monster(SPECIES.t1_melee, 'normal', 1, 1, { statTier: 7, hp: 2, atk: 1.5 }, 0, 0, 0);
    expect(hard.maxHp).toBeGreaterThan(plain.maxHp * 50);
    expect(hard.atk).toBeGreaterThan(plain.atk * 20);
  });
});

describe('각인', () => {
  it('값은 단계 범위 안, 단계가 오를수록 크다', () => {
    const rng = new Rng(42);
    for (let st = 1; st <= ENGRAVE_STAGES; st++)
      for (let i = 0; i < 50; i++) {
        const l = rollEngrave(st, rng);
        const [lo, hi] = engraveRange(l.k, st);
        expect(l.v).toBeGreaterThanOrEqual(lo - 0.06);
        expect(l.v).toBeLessThanOrEqual(hi + 0.06);
      }
    expect(engraveRange('atk', 5)[1]).toBeGreaterThan(engraveRange('atk', 1)[1] * 3);
  });
  it('낮은 단계는 구리·철판, 높은 단계는 윗 단계 판과 마력판 + 차원 파편', () => {
    expect(engraveCost(1).items[TIER_PLATE[0]]).toBeGreaterThan(0);
    expect(engraveCost(1).items[TIER_PLATE[1]]).toBeGreaterThan(0);
    const c5 = engraveCost(5).items;
    expect(c5[TIER_PLATE[5]]).toBeGreaterThan(0);
    expect(c5[TIER_PLATE[6]]).toBeGreaterThan(0);
    expect(c5.dim_shard).toBeGreaterThan(engraveCost(1).items.dim_shard);
  });
  it('착용 장비의 각인이 능력치에 더해지고, 한도가 있다', () => {
    const p = new Progress(newSave());
    const before = p.stats().atk;
    p.cls.equipment.weapon!.eng = [{ k: 'atk', v: 0.5 }, { k: 'cdr', v: 0.9 }];
    expect(p.stats().atk).toBeGreaterThan(before * 1.4);
    expect(p.bonus('cdr')).toBe(BONUS_CAP.cdr);
  });
});

describe('초월 · 칭호 · 음식 · 납품', () => {
  it('99레벨 뒤 경험치는 초월 레벨로 쌓이고 포인트를 준다', () => {
    const p = new Progress(newSave());
    p.cls.level = MAX_LEVEL;
    p.addExp(transcendExp(0) + transcendExp(1));
    expect(p.cls.tlv).toBe(2);
    expect(p.transcendUps).toBe(2);
    expect(p.transcendPoints()).toBe(2);
    const before = p.stats().atk;
    p.cls.tpts = { atk: 2 };
    expect(p.stats().atk).toBeGreaterThan(before);
  });
  it('칭호 조건', () => {
    const t = TITLES.find((x) => x.id === 'tower10')!;
    const end = { towerBest: 10, rushUsed: 0, rushBest: [0, 0, 0], rushGradeBest: ['', '', ''], riftBest: 0 };
    expect(t.check({ end, transcend: 0, engrave5: 0 })).toBe(true);
    expect(t.check({ end: { ...end, towerBest: 9 }, transcend: 0, engrave5: 0 })).toBe(false);
  });
  it('음식은 30분 동안 효과', () => {
    const p = new Progress(newSave());
    const before = p.stats().atk;
    p.data.food = { id: 'food_atk', until: Date.now() + 60000 };
    expect(p.stats().atk).toBeGreaterThan(before);
    p.data.food.until = Date.now() - 1;
    expect(p.stats().atk).toBe(before);
    expect(RECIPES.filter((r) => r.output.startsWith('food_')).length).toBe(4);
    expect(RECIPES.find((r) => r.output === 'dim_alloy')!.inputs.copper_plate).toBeGreaterThan(0);
  });
  it('엔딩 뒤 촌장 의뢰에 판 납품이 2개 붙는다', () => {
    const p = new Progress(newSave());
    const q = new Quests(p.data.quests, { count: (id) => p.count(id), stones: 0, cleared: 0, flag: () => 0 });
    q.refreshDaily(7, true, true);
    const del = q.state.daily.list.filter((d) => d.objective.type === 'deliver');
    expect(del).toHaveLength(2);
    expect(del.every((d) => (d.reward.items?.dim_dust ?? 0) > 0)).toBe(true);
  });
});

describe('차원 가루 → 차원 응축기', () => {
  it('가루와 정수로 차원 파편·차원 마력 정수를 만들고, 레일로 내보낸다', async () => {
    const { Factory } = await import('../src/factory/sim');
    const f = new Factory({ sizeLevel: 0, buildings: [] }, 8);
    f.place('box', 0, 0, 0)!.buffer = { dim_dust: 24, essence_high: 2, essence_supreme: 2 };
    f.place('belt', 1, 0, 0);
    f.place('condenser', 2, 0, 0);
    const out = f.place('box', 3, 0, 0)!;
    out.mode = 'out';
    f.place('wire', 2, 1, 0);
    f.place('generator', 2, 2, 0)!.buffer = { essence_low: 30 };
    f.simulate(1500);
    expect(out.buffer!.dim_shard).toBe(2);
    expect(out.buffer!.essence_dim).toBe(2);
  });
});
