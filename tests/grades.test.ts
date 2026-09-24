import { describe, expect, it } from 'vitest';
import { enhanceCost, GRADE, GRADES, rollGrade } from '../src/data/equipment';
import { rollManaGrade } from '../src/data/crafting';

const dist = (f: (r: number) => number, n = 200000) => {
  const c = new Array(GRADES.length).fill(0);
  for (let i = 0; i < n; i++) c[f((i + 0.5) / n)]++;
  return c.map((x) => x / n);
};

describe('장비 등급', () => {
  it('일반·고급·희귀·영웅·유니크·전설·차원 순서로 강해진다', () => {
    expect(GRADES.map((g) => g.name)).toEqual(['일반', '고급', '희귀', '영웅', '유니크', '전설', '차원']);
    for (let i = 1; i < GRADES.length; i++) expect(GRADES[i].mult).toBeGreaterThan(GRADES[i - 1].mult);
  });

  it('파수꾼 드롭도 전설은 1% 미만, 유니크는 5% 미만', () => {
    const d = dist((r) => rollGrade(r, 0.4));
    expect(d[GRADE.legend]).toBeLessThan(0.01);
    expect(d[GRADE.legend]).toBeGreaterThan(0);
    expect(d[GRADE.unique]).toBeLessThan(0.05);
    expect(d[GRADE.dimension]).toBe(0);
  });

  it('차원 등급은 보스가 준 확률로만', () => {
    expect(dist((r) => rollGrade(r, 0.4, 0.01))[GRADE.dimension]).toBeCloseTo(0.01, 3);
  });

  it('마력 제작은 고급 이상, 전설까지 (차원은 없음)', () => {
    const d = dist(rollManaGrade);
    expect(d[GRADE.normal]).toBe(0);
    expect(d[GRADE.legend]).toBeGreaterThan(0);
    expect(d[GRADE.dimension]).toBe(0);
  });

  it('차원 등급은 강화 재료와 골드가 세 배', () => {
    const base = { uid: 'x', slot: 'helmet' as const, tier: 2, plus: 3 };
    const a = enhanceCost({ ...base, grade: GRADE.legend })!;
    const b = enhanceCost({ ...base, grade: GRADE.dimension })!;
    expect(b.count).toBe(a.count * 3);
    expect(b.gold).toBe(a.gold * 3);
  });
});
