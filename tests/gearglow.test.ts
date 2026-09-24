import { describe, expect, it } from 'vitest';
import { MeshBasicMaterial } from 'three';
import { buildHero } from '../src/models/hero';
import { gearLook } from '../src/models/items';

describe('강화 빛', () => {
  it('강화한 부위만 glow에 들어간다', () => {
    const eq = {
      pants: { uid: 'a', slot: 'pants' as const, tier: 1, grade: 0, plus: 2 },
      armor: { uid: 'b', slot: 'armor' as const, tier: 1, grade: 0, plus: 0 },
    };
    const g = gearLook(eq);
    expect(g.glow).toEqual({ pants: 2 });
  });

  it('장비 부위는 몸통과 분리된 메시로 만들어진다', () => {
    const eq = {
      pants: { uid: 'a', slot: 'pants' as const, tier: 1, grade: 0, plus: 2 },
      boots: { uid: 'c', slot: 'boots' as const, tier: 1, grade: 0, plus: 0 },
      armor: { uid: 'b', slot: 'armor' as const, tier: 1, grade: 0, plus: 0 },
    };
    const rig = buildHero(new MeshBasicMaterial(), { tunic: 0x3355aa, tunicDark: 0x223366, hair: 0x332211, weapon: 'sword', gear: gearLook(eq) });
    expect(rig.gearMeshes.pants.length).toBeGreaterThan(0);
    expect(rig.gearMeshes.armor.length).toBeGreaterThan(0);
    const all = new Set(Object.values(rig.gearMeshes).flat());
    expect(all.size).toBe(Object.values(rig.gearMeshes).flat().length);
  });
});
