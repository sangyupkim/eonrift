import { describe, expect, it } from 'vitest';
import { ACHIEVEMENTS } from '../src/data/achievements';
import { BLESS_IDS, blessNeed, dayKey, hordeDaily, hordeMult, HORDE_MILESTONES, raidDayMarks, raidScore, raidSpec, trialDayMarks, vowMult, weekKey } from '../src/data/endgame';
import { rankMarks } from '../src/data/marks';
import { RELIC_GRADES, RELICS, rollRelic, rollRelicGrade } from '../src/data/relics';
import { rollClassSet, SET_IDS, setCounts, setLines, setsOf } from '../src/data/sets';
import { equipStats, equipName } from '../src/data/equipment';
import { ch8Mult, CH8_STAGES } from '../src/data/chapter8';
import { BESTIARY } from '../src/data/bestiary';
import { SPECIES, TIER_POOLS } from '../src/data/species';
import { CLASS_ORDER, CLASSES, ULTIMATES } from '../src/data/classes';
import { SKILL_AWAKEN, ULT_AWAKEN } from '../src/data/awaken';
import { TITLES } from '../src/data/bonus';
import { newSave, parseSave, Progress } from '../src/game/Progress';
import { Rng } from '../src/core/rng';

describe('v10 증표 · 유물 · 세트', () => {
  it('유물: 등급 확률 합이 100, 굴린 값은 범위 안', () => {
    expect(RELIC_GRADES.reduce((a, g) => a + g.weight, 0)).toBeCloseTo(100);
    const rng = new Rng(7);
    const seen = new Set<string>();
    const grades = new Set<number>();
    for (let i = 0; i < 3000; i++) {
      const r = rollRelic(() => rng.next(), `r${i}`);
      seen.add(r.id);
      grades.add(r.g);
      for (const l of r.lines) expect(l.v).toBeGreaterThan(0);
    }
    expect(seen.size).toBe(RELICS.length);
    expect(grades.size).toBe(RELIC_GRADES.length);
    expect(rollRelicGrade(0)).toBe(4);
    expect(rollRelicGrade(0.999)).toBe(0);
  });

  it('세트: 직업마다 공격·방어·균형 셋, 한 부위는 약하고 2·4·7부위 효과, 그 직업만 입는다', () => {
    expect(SET_IDS.length).toBe(12);
    for (const c of ['sword', 'mage', 'archer', 'summoner'] as const) expect(setsOf(c).map((x) => x.type).sort()).toEqual(['atk', 'bal', 'def']);
    const base = { uid: 'a', slot: 'armor' as const, tier: 7, grade: 5, plus: 0 };
    expect(equipStats({ ...base, set: 'sword_def' }).hp).toBeLessThan(equipStats(base).hp);
    expect(equipName({ ...base, set: 'sword_def' })).toContain('철벽의 맹세');
    expect(setLines(setCounts([{ set: 'sword_atk' }, { set: 'sword_atk' }]))).toEqual([{ k: 'atk', v: 8 }]);
    expect(setLines(setCounts(Array.from({ length: 6 }, () => ({ set: 'sword_def' as const })))).length).toBe(3);
    expect(setLines(setCounts(Array.from({ length: 7 }, () => ({ set: 'sword_def' as const })))).length).toBe(7);
    const p = new Progress(newSave());
    for (const slot of ['helmet', 'armor', 'pants', 'boots'] as const) p.cls.equipment[slot] = { uid: slot, slot, tier: 7, grade: 5, plus: 0, set: 'sword_bal' };
    expect(p.specials().speed).toBeGreaterThanOrEqual(8);
    expect(p.canEquip({ ...base, set: 'sword_bal' })).toBe(true);
    expect(p.canEquip({ ...base, set: 'mage_bal' })).toBe(false);
    const seen = new Set<string>();
    for (let i = 0; i < 60; i++) seen.add(rollClassSet('archer', i / 60));
    expect([...seen].sort()).toEqual(['archer_atk', 'archer_bal', 'archer_def']);
  });

  it('예전 공용 세트 문장·장비는 설계도로 바뀐다', () => {
    const d = newSave();
    d.storage.set_breaker = 2;
    d.equips.push({ uid: 'o', slot: 'helmet', tier: 7, grade: 5, plus: 0, set: 'guard' as never });
    const p = new Progress(parseSave(JSON.stringify(d))!);
    expect(p.stored('set_breaker')).toBe(0);
    expect(p.stored('set_blueprint')).toBe(2 + 3);
    expect(p.data.equips.length).toBe(0);
  });

  it('장착한 유물의 옵션이 특수 옵션 합계에 더해진다', () => {
    const p = new Progress(newSave());
    p.data.relics = [{ uid: 'x', id: 'spear', g: 4, lines: [{ k: 'bossDmg', v: 20 }] }];
    p.cls.relics = ['x'];
    expect(p.specials().bossDmg).toBe(20);
  });
});

describe('v10 시련 · 레이드 · 러쉬 · 서약', () => {
  it('일일 시련 증표와 순위 보상', () => {
    expect(trialDayMarks(0)).toBe(0);
    expect(trialDayMarks(500)).toBe(2);
    expect(trialDayMarks(10000)).toBe(18);
    expect(rankMarks(1, 30)).toBe(20);
    expect(rankMarks(1, 30, true)).toBe(60);
    expect(rankMarks(12, 30)).toBe(5);
    expect(rankMarks(29, 30)).toBe(3);
    expect(rankMarks(0, 30)).toBe(0);
    expect(dayKey(new Date(2026, 8, 6))).toBe('2026-09-06');
  });

  it('레이드: 주마다 보스가 정해지고, 처치하면 점수가 10000 이상', () => {
    expect(raidSpec(weekKey()).boss).toBeDefined();
    expect(raidScore(0.5, false, 300)).toBe(5000);
    expect(raidScore(1, true, 200)).toBe(11000);
    expect(raidDayMarks(5000)).toBe(7);
    expect(raidDayMarks(raidScore(1, true, 150))).toBe(23);
  });

  it('러쉬: 시간이 갈수록 강해지고 축복 목표가 늘어난다', () => {
    expect(hordeMult(120)).toBeGreaterThan(hordeMult(60));
    expect(blessNeed(5)).toBeGreaterThan(blessNeed(1));
    expect(BLESS_IDS.length).toBe(12);
    for (let i = 1; i < HORDE_MILESTONES.length; i++) expect(HORDE_MILESTONES[i].kills).toBeGreaterThan(HORDE_MILESTONES[i - 1].kills);
    expect(hordeDaily(3000).marks).toBe(15);
  });

  it('균열 서약: 보상 배율은 서약 보너스의 합', () => {
    expect(vowMult([])).toBe(1);
    expect(vowMult(['nopotion', 'brutal'])).toBeCloseTo(1.6);
  });
});

describe('v10 8장 · 차원 소환사', () => {
  it('8장: 방마다 규칙이 있고 뒤로 갈수록 강하다, 8장 몬스터는 도감에 8단계로', () => {
    expect(CH8_STAGES.length).toBe(10);
    for (const st of CH8_STAGES) expect(st.rules.length).toBeGreaterThan(0);
    expect(ch8Mult(10)).toBeGreaterThan(ch8Mult(1));
    for (const [id] of TIER_POOLS[8]) expect(SPECIES[id]).toBeDefined();
    expect(BESTIARY.filter((e) => e.tier === 8).length).toBe(TIER_POOLS[8].length + 2);
  });

  it('차원 소환사: 스킬·궁극기·각성이 모두 있다', () => {
    expect(CLASS_ORDER).toContain('summoner');
    expect(CLASSES.summoner.skills.length).toBe(6);
    expect(ULTIMATES.summoner.length).toBe(2);
    expect(SKILL_AWAKEN.summoner.length).toBe(6);
    expect(ULT_AWAKEN.summoner.length).toBe(2);
  });

  it('예전 저장에 소환사 칸이 생기고, 계약·성장 가속·원정대 보너스가 작동한다', () => {
    const old = newSave() as unknown as { classes: Record<string, unknown> };
    delete old.classes.summoner;
    const p = new Progress(parseSave(JSON.stringify(old))!);
    expect(p.data.classes.summoner.level).toBe(1);
    p.data.bestiary = { t7_melee: 1200, goblin: 150, slime: 20 };
    expect(p.pactEligible().sort()).toEqual(['goblin', 't7_melee']);
    expect(p.activePacts()[0]).toBe('t7_melee');
    p.data.classes.summoner.pacts = ['goblin'];
    expect(p.activePacts()).toEqual(['goblin']);
    // 성장 가속: 검사 90레벨이면 63레벨까지 ×3
    p.data.classes.sword.level = 90;
    p.unlockClass('summoner');
    p.data.currentClass = 'summoner';
    expect(p.catchUp).toBe(3);
    p.data.classes.summoner.level = 70;
    expect(p.catchUp).toBe(1);
    // 원정대: 90 + 70 = 160 → +6
    expect(p.rosterBonus).toBe(6);
    const before = p.stats('summoner').base.int;
    p.data.classes.sword.level = 99;
    expect(p.stats('summoner').base.int).toBeGreaterThan(before - 1);
  });
});

describe('v10 업적', () => {
  it('업적 id가 겹치지 않고, 칭호가 있는 업적은 칭호 목록에 있다', () => {
    const ids = new Set(ACHIEVEMENTS.map((a) => a.id));
    expect(ids.size).toBe(ACHIEVEMENTS.length);
    for (const a of ACHIEVEMENTS.filter((x) => x.title)) expect(TITLES.some((t) => t.id === `ach_${a.id}`)).toBe(true);
  });
});
