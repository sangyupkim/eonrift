import { describe, expect, it } from 'vitest';
import { endLock, newEndgame, rushFights } from '../src/data/endgame';
import { monsterAtkMult, playerDefK } from '../src/data/monsters';
import { generateTowerFloor, isFloor } from '../src/dungeon/generator';
import { CLASSES } from '../src/data/classes';

describe('차원의 끝 해금 순서', () => {
  it('탑 → (10층) 보스 러시 → (일반 완주) 심연 균열 → (3단계) 주간 시련', () => {
    const e = newEndgame();
    expect(endLock(e, 'tower')).toBeNull();
    expect(endLock(e, 'rush')).not.toBeNull();
    e.towerBest = 10;
    expect(endLock(e, 'rush')).toBeNull();
    expect(endLock(e, 'rift')).not.toBeNull();
    e.rushGradeBest[0] = 'C';
    expect(endLock(e, 'rift')).toBeNull();
    expect(endLock(e, 'trial')).not.toBeNull();
    e.riftBest = 3;
    expect(endLock(e, 'trial')).toBeNull();
  });
});

describe('보스 러시: 난이도가 오를수록 한 번에 더 많은 보스', () => {
  it('일반 14전 1마리, 하드 7전 2마리, 지옥 5전 최대 3마리', () => {
    expect(rushFights(0)).toHaveLength(14);
    expect(rushFights(1)).toHaveLength(7);
    expect(rushFights(1).every((f) => f.length === 2)).toBe(true);
    expect(rushFights(2)).toHaveLength(5);
    expect(Math.max(...rushFights(2).map((f) => f.length))).toBe(3);
    for (const d of [0, 1, 2] as const) expect(rushFights(d).flat()).toHaveLength(14);
  });
});

describe('무한의 탑 층', () => {
  it('둥근 단 하나, 가운데에 위층 문, 몬스터는 웨이브로', () => {
    const d = generateTowerFloor(5, 3);
    expect(d.tower).toBe(true);
    expect(d.monsters).toHaveLength(0);
    expect(isFloor(d, d.exit.x, d.exit.y)).toBe(true);
    expect(isFloor(d, d.start.x, d.start.y)).toBe(true);
    expect(isFloor(d, 0, 0)).toBe(false);
  });
});

describe('난이도: 방어력은 단계 기준, 몬스터 공격력 배율', () => {
  it('단계가 오를수록 방어 기준값과 공격력 배율이 커진다', () => {
    for (let t = 2; t <= 7; t++) {
      expect(playerDefK(t)).toBeGreaterThanOrEqual(playerDefK(t - 1));
      expect(monsterAtkMult(t)).toBeGreaterThan(monsterAtkMult(t - 1));
    }
  });
});

describe('직업 패치', () => {
  it('궁수 세 번째 스킬은 폭발 화살 (후방 도약은 회피 버튼으로)', () => {
    expect(CLASSES.archer.skills[2].name).toBe('폭발 화살');
    expect(CLASSES.archer.skills.some((s) => s.name === '후방 도약')).toBe(false);
  });
});
