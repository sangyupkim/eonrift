import { describe, expect, it } from 'vitest';
import { BOSS_TIME_LIMIT, tierScale } from '../src/data/monsters';
import { newSave, Progress } from '../src/game/Progress';

/** 검사 Lv.lv (힘에 레벨당 3포인트), 무기 단계·강화로 X-10 수호자를 잡는 데 걸리는 대략의 시간(초) */
function bossTime(lv: number, wTier: number, plus: number, tier: number, stage = 10): number {
  const p = new Progress(newSave());
  const c = p.cls;
  c.level = lv;
  c.alloc.str = (lv - 1) * 3;
  c.equipment.weapon = { uid: 'w', slot: 'weapon', cls: 'sword', tier: wTier, grade: 0, plus };
  const atk = p.stats().atk;
  const sc = tierScale(tier, stage);
  const hp = 220 * sc.hp * (stage === 10 ? 39 : 21);
  const hit = atk * (40 / (40 + 6 * sc.def));
  // 콤보 0.36초, 회피 등으로 공격 가동률 55%, 치명·스킬 보정 1.25
  return hp / ((hit / 0.36) * 0.55 * 1.25);
}

describe('보스 밸런스 (제한 시간 5분)', () => {
  it('1챕터: 구리 +0도 빠듯하게, 구리 +5면 여유 있게 잡힌다', () => {
    expect(bossTime(12, 1, 0, 1)).toBeLessThan(BOSS_TIME_LIMIT * 1.05);
    expect(bossTime(12, 1, 5, 1)).toBeLessThan(BOSS_TIME_LIMIT * 0.85);
  });
  it('2챕터: 구리 +10은 중간보스까지, 수호자는 철 장비가 필요하다', () => {
    expect(bossTime(17, 1, 10, 2, 5)).toBeLessThan(BOSS_TIME_LIMIT);
    expect(bossTime(22, 1, 10, 2)).toBeGreaterThan(BOSS_TIME_LIMIT);
    expect(bossTime(22, 2, 5, 2)).toBeLessThan(BOSS_TIME_LIMIT);
  });
  it('구리 +10으로 3챕터 수호자는 불가능하다', () => {
    expect(bossTime(32, 1, 10, 3)).toBeGreaterThan(BOSS_TIME_LIMIT * 1.5);
  });
  it('모든 챕터: 그 단계 무기 +5면 5분 안, 한 단계 아래 +10이면 5분 초과', () => {
    for (let t = 2; t <= 7; t++) {
      const lv = 12 + (t - 1) * 10;
      expect(bossTime(lv, t, 5, t)).toBeLessThan(BOSS_TIME_LIMIT);
      expect(bossTime(lv, t - 1, 10, t)).toBeGreaterThan(BOSS_TIME_LIMIT);
    }
  });
});
