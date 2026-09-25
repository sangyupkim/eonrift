import { describe, expect, it } from 'vitest';
import { MAX_ULT_LEVEL, ultCooldown, ultPower, ULT_COOLDOWN } from '../src/data/classes';
import { ultUpgradeCost } from '../src/data/ultUpgrade';
import { ITEMS } from '../src/data/items';
import { newSave, Progress } from '../src/game/Progress';

describe('궁극기 강화', () => {
  it('차원 파편 아이템이 있다', () => {
    expect(ITEMS.dim_shard.name).toBe('차원 파편');
  });

  it('레벨이 오를수록 위력이 오르고 재사용 대기가 줄어든다', () => {
    expect(ultPower(1)).toBe(1);
    expect(ultCooldown(1)).toBe(ULT_COOLDOWN);
    for (let lv = 2; lv <= MAX_ULT_LEVEL; lv++) {
      expect(ultPower(lv)).toBeGreaterThan(ultPower(lv - 1));
      expect(ultCooldown(lv)).toBeLessThan(ultCooldown(lv - 1));
    }
    expect(ultCooldown(MAX_ULT_LEVEL)).toBeGreaterThanOrEqual(30);
  });

  it('비용은 파편과 많은 재료가 들고, 레벨마다 늘어난다', () => {
    let prevGold = 0;
    let prevShard = 0;
    for (let lv = 1; lv < MAX_ULT_LEVEL; lv++) {
      const c = ultUpgradeCost(lv)!;
      expect(c.items.dim_shard).toBeGreaterThan(prevShard);
      expect(c.gold).toBeGreaterThan(prevGold);
      expect(Object.keys(c.items).length).toBeGreaterThanOrEqual(4);
      for (const id of Object.keys(c.items)) expect(ITEMS[id]).toBeDefined();
      const total = Object.values(c.items).reduce((a, b) => a + b, 0);
      expect(total).toBeGreaterThanOrEqual(35);
      prevGold = c.gold;
      prevShard = c.items.dim_shard;
    }
    expect(ultUpgradeCost(MAX_ULT_LEVEL)).toBeNull();
  });

  it('레벨은 직업·궁극기마다 따로, 기본 1', () => {
    const p = new Progress(newSave());
    expect(p.ultLevel(0)).toBe(1);
    p.cls.ultLv = [3, 1];
    expect(p.ultLevel(0)).toBe(3);
    expect(p.ultLevel(1)).toBe(1);
    expect(p.ultLevel(0, 'mage')).toBe(1);
  });
});
