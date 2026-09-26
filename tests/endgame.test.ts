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
    // 4·5단은 마력 티타늄판·마력 오리하르콘판
    expect(engraveCost(4).items.mana_titanium_plate).toBe(4);
    expect(c5.mana_orichalcum_plate).toBe(5);
    expect(engraveCost(2).items.mana_copper_plate).toBe(2);
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
    // 파편이 없으면 찍을 수 없다
    expect(p.spendTranscend('atk', 1)).toBe(false);
    p.add('dim_shard', 2);
    expect(p.spendTranscend('atk', 2)).toBe(true);
    expect(p.count('dim_shard')).toBe(0);
    expect(p.stats().atk).toBeGreaterThan(before);
    expect(p.transcendPoints()).toBe(0);
  });
  it('초월 포인트는 많이 찍을수록 파편이 더 든다', async () => {
    const { transcendCost, transcendPointCost } = await import('../src/data/bonus');
    expect(transcendPointCost(0)).toBe(1);
    expect(transcendPointCost(5)).toBe(2);
    expect(transcendPointCost(50)).toBe(11);
    expect(transcendCost(3, 5)).toBe(1 + 1 + 2 + 2 + 2);
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
    f.place('box', 0, 0, 0)!.buffer = { dim_dust: 24, essence_high: 4, essence_supreme: 2, titanium_plate: 2, orichalcum_ingot: 2 };
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

describe('티타늄·오리하르콘 사용처', () => {
  it('상급 차원 합금은 균열 11단계 이상과 보스 러시 지옥 입장에 쓴다', async () => {
    const { riftEntry, rushEntry } = await import('../src/data/endgame');
    expect(riftEntry(10).id).toBe('dim_alloy');
    expect(riftEntry(11).id).toBe('dim_alloy2');
    expect(rushEntry(2, 0)).toEqual({ dim_alloy2: 1 });
    expect(rushEntry(0, 0)).toEqual({});
    expect(rushEntry(1, 3)).toEqual({ dim_alloy: 2 });
    const r = RECIPES.find((x) => x.output === 'dim_alloy2')!;
    expect(r.inputs.titanium_plate).toBeGreaterThan(0);
    expect(r.inputs.orichalcum_plate).toBeGreaterThan(0);
    expect(RECIPES.find((x) => x.output === 'dim_shard')!.inputs.titanium_plate).toBe(1);
    expect(RECIPES.find((x) => x.output === 'essence_dim')!.inputs.orichalcum_ingot).toBe(1);
  });
});

describe('주간 차원 시련', () => {
  it('주 번호와 이번 주 맵은 정해져 있다', async () => {
    const { weekKey, trialSpec } = await import('../src/data/endgame');
    expect(weekKey(new Date(2026, 8, 21))).toBe(weekKey(new Date(2026, 8, 27)));
    expect(weekKey(new Date(2026, 8, 27))).not.toBe(weekKey(new Date(2026, 8, 28)));
    const a = trialSpec('2026-W39');
    expect(trialSpec('2026-W39')).toEqual(a);
    expect(a.tier).toBeGreaterThanOrEqual(1);
  });
  it('점수와 등급: 깎은 체력 비율, 처치하면 걸린 시간', async () => {
    const { trialScore, trialGrade, trialScoreText, TRIAL_TIME } = await import('../src/data/endgame');
    expect(trialScore(0.3752, false, TRIAL_TIME)).toBe(3752);
    expect(trialScoreText(3752)).toBe('37.52%');
    expect(trialScore(1, false, 100)).toBe(9999);
    const fast = trialScore(1, true, 60);
    const slow = trialScore(1, true, 150);
    expect(fast).toBeGreaterThan(slow);
    expect(slow).toBeGreaterThan(9999);
    expect(trialScoreText(fast)).toBe('처치 1:00');
    expect(trialGrade(999)).toBe(-1);
    expect(trialGrade(3752)).toBe(1);
    expect(trialGrade(slow)).toBe(4);
  });
  it('예전 점수제 기록은 지우고 얻은 오라는 남긴다', async () => {
    const { rollTrialWeek, newTrial } = await import('../src/data/endgame');
    const old = { ...newTrial('2026-W39'), v: undefined, best: 17000, topGrade: 3 };
    const t = rollTrialWeek(old, '2026-W39');
    expect(t.best).toBe(0);
    expect(t.topGrade).toBe(3);
  });
  it('주가 바뀌면 기록이 지난 기록으로 넘어가고, 기록 코드는 되읽힌다', async () => {
    const { newTrial, rollTrialWeek, trialCode, readTrialCode } = await import('../src/data/endgame');
    let t = newTrial('2026-W39');
    t.best = 15000;
    t.claimed = [0, 1];
    t = rollTrialWeek(t, '2026-W40');
    expect(t.best).toBe(0);
    expect(t.claimed).toEqual([]);
    expect(t.history[0]).toMatchObject({ week: '2026-W39', best: 15000 });
    const code = trialCode('2026-W40', 'mage', 16000, 312, 7);
    expect(readTrialCode(code)).toEqual({ week: '2026-W40', cls: 'mage', score: 16000, seconds: 312, hits: 7 });
    expect(readTrialCode(code.slice(0, -2) + 'AA')).toBeNull();
  });
});
