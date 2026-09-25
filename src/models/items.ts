import { BoxGeometry, BufferGeometry, ConeGeometry, CylinderGeometry, DodecahedronGeometry, IcosahedronGeometry, OctahedronGeometry, SphereGeometry, TorusGeometry } from 'three';
import type { Equip } from '../data/equipment';
import { GRADES } from '../data/equipment';
import { ITEMS } from '../data/items';
import type { HeroGear } from './hero';
import { merge, part } from './util';

/** 아이콘용 아이템 모델. 크기는 대략 지름 1 안쪽에 맞춘다 */

const shade = (c: number, k: number) => {
  const r = Math.min(255, Math.round(((c >> 16) & 255) * k));
  const g = Math.min(255, Math.round(((c >> 8) & 255) * k));
  const b = Math.min(255, Math.round((c & 255) * k));
  return (r << 16) | (g << 8) | b;
};

const WOOD = 0x7a5234;
const GOLD = 0xe8c14a;

function ore(color: number): BufferGeometry[] {
  const rock = 0x6d6a66;
  return [
    part(new DodecahedronGeometry(0.42, 0), rock, { pos: [0, 0, 0], scale: [1.1, 0.8, 1] }),
    part(new DodecahedronGeometry(0.2, 0), shade(rock, 0.8), { pos: [0.32, -0.12, 0.1] }),
    part(new OctahedronGeometry(0.16, 0), color, { pos: [0.1, 0.3, 0.22], rot: [0.3, 0.4, 0.2] }),
    part(new OctahedronGeometry(0.12, 0), shade(color, 1.2), { pos: [-0.25, 0.18, 0.25], rot: [0.5, 0, 0.6] }),
    part(new OctahedronGeometry(0.1, 0), color, { pos: [0.3, 0.05, 0.3] }),
  ];
}

function log(color: number): BufferGeometry[] {
  const ring = shade(color, 1.35);
  return [
    part(new CylinderGeometry(0.22, 0.22, 0.9, 8), shade(color, 0.7), { rot: [0, 0, Math.PI / 2], pos: [0, -0.05, 0.12] }),
    part(new CylinderGeometry(0.2, 0.2, 0.92, 8), ring, { rot: [0, 0, Math.PI / 2], pos: [0, -0.05, 0.12], scale: [0.6, 1, 0.6] }),
    part(new CylinderGeometry(0.2, 0.2, 0.8, 8), shade(color, 0.6), { rot: [0, 0, Math.PI / 2], pos: [0.05, 0.3, -0.12] }),
    part(new CylinderGeometry(0.18, 0.18, 0.82, 8), ring, { rot: [0, 0, Math.PI / 2], pos: [0.05, 0.3, -0.12], scale: [0.6, 1, 0.6] }),
  ];
}

function crystal(color: number): BufferGeometry[] {
  return [
    part(new CylinderGeometry(0.3, 0.36, 0.14, 6), 0x5a5a66, { pos: [0, -0.38, 0] }),
    part(new OctahedronGeometry(0.22, 0), color, { pos: [0, 0.05, 0], scale: [0.8, 2, 0.8] }),
    part(new OctahedronGeometry(0.15, 0), shade(color, 1.2), { pos: [0.22, -0.12, 0.05], scale: [0.8, 1.7, 0.8], rot: [0, 0, -0.45] }),
    part(new OctahedronGeometry(0.13, 0), shade(color, 0.85), { pos: [-0.2, -0.15, 0.06], scale: [0.8, 1.6, 0.8], rot: [0, 0, 0.5] }),
  ];
}

function ingot(color: number, glow = 0): BufferGeometry[] {
  const g = [
    part(new CylinderGeometry(0.34, 0.46, 0.26, 4), color, { rot: [0, Math.PI / 4, 0], scale: [1.4, 1, 0.8], pos: [0, -0.1, 0] }),
    part(new CylinderGeometry(0.28, 0.4, 0.22, 4), shade(color, 0.85), { rot: [0, Math.PI / 4, 0], scale: [1.4, 1, 0.8], pos: [0.08, 0.16, -0.05] }),
  ];
  if (glow) g.push(part(new BoxGeometry(0.62, 0.04, 0.04), glow, { pos: [0.08, 0.28, 0.12] }));
  return g;
}

function pouch(color: number): BufferGeometry[] {
  return [
    part(new SphereGeometry(0.34, 7, 5), 0xc8b08a, { pos: [0, -0.1, 0], scale: [1, 0.95, 1] }),
    part(new CylinderGeometry(0.1, 0.16, 0.16, 7), 0xb09a74, { pos: [0, 0.28, 0] }),
    part(new TorusGeometry(0.12, 0.03, 4, 8), 0x8a5a3a, { pos: [0, 0.22, 0], rot: [Math.PI / 2, 0, 0] }),
    part(new SphereGeometry(0.2, 6, 4), color, { pos: [0, -0.02, 0.18], scale: [1, 0.7, 0.5] }),
  ];
}

function orb(color: number): BufferGeometry[] {
  return [
    part(new IcosahedronGeometry(0.3, 1), color),
    part(new IcosahedronGeometry(0.16, 0), shade(color, 1.4), { pos: [0.08, 0.08, 0.2] }),
    part(new TorusGeometry(0.42, 0.03, 4, 16), shade(color, 0.8), { rot: [1.2, 0.3, 0] }),
  ];
}

function enhanceStone(color: number): BufferGeometry[] {
  return [
    part(new CylinderGeometry(0.34, 0.4, 0.2, 6), 0x5a5470, { pos: [0, -0.3, 0] }),
    part(new OctahedronGeometry(0.34, 0), color, { pos: [0, 0.08, 0], scale: [1, 1.3, 1] }),
    part(new BoxGeometry(0.06, 0.3, 0.05), 0xffffff, { pos: [0, 0.08, 0.26] }),
  ];
}

function potion(color: number): BufferGeometry[] {
  return [
    part(new SphereGeometry(0.3, 8, 6), color, { pos: [0, -0.12, 0] }),
    part(new CylinderGeometry(0.1, 0.12, 0.26, 8), 0xdfe8f0, { pos: [0, 0.24, 0] }),
    part(new CylinderGeometry(0.12, 0.1, 0.1, 8), 0x8a5a3a, { pos: [0, 0.4, 0] }),
    part(new SphereGeometry(0.1, 5, 4), 0xffffff, { pos: [-0.12, -0.02, 0.2] }),
  ];
}

function returnStone(color: number): BufferGeometry[] {
  return [
    part(new CylinderGeometry(0.4, 0.42, 0.18, 10), 0x8a8a96, { rot: [Math.PI / 2 - 0.3, 0, 0] }),
    part(new TorusGeometry(0.22, 0.04, 4, 12), color, { pos: [0, 0.03, 0.09], rot: [-0.3, 0, 0] }),
    part(new OctahedronGeometry(0.1, 0), color, { pos: [0, 0.03, 0.1] }),
  ];
}

function gear(color: number): BufferGeometry[] {
  const g = [part(new CylinderGeometry(0.3, 0.3, 0.14, 12), color, { rot: [Math.PI / 2, 0, 0] })];
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    g.push(part(new BoxGeometry(0.14, 0.12, 0.14), color, { pos: [Math.cos(a) * 0.36, Math.sin(a) * 0.36, 0], rot: [0, 0, a] }));
  }
  g.push(part(new CylinderGeometry(0.1, 0.1, 0.18, 8), 0x3a3a40, { rot: [Math.PI / 2, 0, 0] }));
  return g;
}

function planks(color: number): BufferGeometry[] {
  return [0, 1, 2].map((i) => part(new BoxGeometry(0.9, 0.1, 0.24), shade(color, 1 - i * 0.08), { pos: [0, -0.2 + i * 0.12, (i - 1) * 0.08], rot: [0, (i - 1) * 0.25, 0] }));
}

function bag(color: number): BufferGeometry[] {
  return [
    part(new BoxGeometry(0.6, 0.5, 0.36), color, { pos: [0, -0.05, 0] }),
    part(new BoxGeometry(0.62, 0.18, 0.38), shade(color, 0.75), { pos: [0, 0.2, 0.02] }),
    part(new TorusGeometry(0.16, 0.04, 4, 8, Math.PI), 0x6b4424, { pos: [0, 0.3, 0] }),
    part(new BoxGeometry(0.1, 0.1, 0.04), GOLD, { pos: [0, 0.12, 0.21] }),
  ];
}

function resonator(color: number): BufferGeometry[] {
  return [
    part(new CylinderGeometry(0.36, 0.42, 0.14, 8), 0x4a4a60, { pos: [0, -0.35, 0] }),
    part(new TorusGeometry(0.34, 0.05, 5, 16), GOLD, { pos: [0, 0.05, 0] }),
    part(new TorusGeometry(0.28, 0.04, 5, 16), 0x9a8aff, { pos: [0, 0.05, 0], rot: [Math.PI / 2, 0, 0] }),
    part(new OctahedronGeometry(0.16, 0), color, { pos: [0, 0.05, 0], scale: [1, 1.4, 1] }),
  ];
}

function plate(color: number): BufferGeometry[] {
  const g = [
    part(new BoxGeometry(0.8, 0.1, 0.6), color, { rot: [0.15, 0.3, 0] }),
    part(new BoxGeometry(0.76, 0.1, 0.56), shade(color, 0.8), { pos: [0.04, -0.12, 0.03], rot: [0.15, 0.3, 0] }),
  ];
  for (const [x, z] of [[0.3, 0.2], [-0.3, 0.2], [0.3, -0.2], [-0.3, -0.2]]) g.push(part(new CylinderGeometry(0.035, 0.035, 0.04, 6), shade(color, 0.6), { pos: [x, 0.07, z], rot: [0.15, 0.3, 0] }));
  return g;
}

function coins(): BufferGeometry[] {
  const g: BufferGeometry[] = [];
  for (let i = 0; i < 4; i++) g.push(part(new CylinderGeometry(0.3, 0.3, 0.08, 12), i % 2 ? 0xf0c040 : 0xe0b030, { pos: [0.1, -0.3 + i * 0.09, 0] }));
  g.push(part(new CylinderGeometry(0.3, 0.3, 0.08, 12), 0xffd860, { pos: [-0.25, 0.05, 0.1], rot: [1.1, 0, 0.3] }));
  return g;
}

/** 음식: 그릇에 담긴 요리 */
function bowl(color: number): BufferGeometry[] {
  return [
    part(new CylinderGeometry(0.45, 0.3, 0.28, 12), 0x8a5a34, { pos: [0, -0.15, 0] }),
    part(new CylinderGeometry(0.4, 0.4, 0.06, 12), shade(color, 0.85), { pos: [0, 0.0, 0] }),
    part(new SphereGeometry(0.14, 8, 6), color, { pos: [0.1, 0.08, 0.05] }),
    part(new SphereGeometry(0.11, 8, 6), shade(color, 1.2), { pos: [-0.12, 0.07, -0.05] }),
    part(new BoxGeometry(0.04, 0.5, 0.04), 0xe8d8b0, { pos: [0.2, 0.2, -0.1], rot: [0.3, 0, -0.5] }),
  ];
}

/** 차원 파편: 뾰족한 조각 여러 개 */
function shards(color: number): BufferGeometry[] {
  const g: BufferGeometry[] = [];
  const bits: [number, number, number, number, number][] = [
    [0, 0.05, 0, 0.7, 0.3],
    [-0.28, -0.12, 0.1, 0.45, -0.5],
    [0.3, -0.15, -0.05, 0.4, 0.7],
    [0.05, -0.2, 0.28, 0.32, -0.2],
  ];
  bits.forEach(([x, y, z, h, r], i) => {
    const o = new OctahedronGeometry(0.2, 0);
    o.scale(0.7, h / 0.35, 0.7);
    g.push(part(o, i ? shade(color, 0.75 + i * 0.08) : 0xdffcff, { pos: [x, y, z], rot: [0.2, i, r] }));
  });
  g.push(part(new OctahedronGeometry(0.08, 0), 0xb67cff, { pos: [0, 0.35, 0.1] }));
  return g;
}

export function buildItemGeometry(id: string): BufferGeometry {
  const def = ITEMS[id];
  const c = def?.color ?? 0xffffff;
  let g: BufferGeometry[];
  if (id.endsWith('_ore')) g = ore(c);
  else if (id === 'wood' || id.endsWith('_wood')) g = log(c);
  else if (id.startsWith('mana_plank_')) g = [...planks(c), part(new OctahedronGeometry(0.12, 0), 0x9a7aff, { pos: [0.1, 0.2, 0.05] })];
  else if (id === 'plank' || id.endsWith('_plank')) g = planks(c);
  else if (id.startsWith('mana_') && id.endsWith('_plate')) g = [...plate(c), part(new OctahedronGeometry(0.1, 0), 0x9a7aff, { pos: [0, 0.14, 0] })];
  else if (id.endsWith('_plate')) g = plate(c);
  else if (id.endsWith('_ingot')) g = ingot(c);
  else if (id.startsWith('mana_') && id !== 'mana_crystal' && id !== 'mana_dust') g = ingot(c, 0x7ff0ff);
  else if (id.endsWith('_dust')) g = pouch(c);
  else if (id.startsWith('essence')) g = orb(c);
  else if (id.startsWith('stone_')) g = enhanceStone(c);
  else if (id.startsWith('potion')) g = potion(c);
  else if (id.endsWith('_plate')) g = plate(c);
  else if (id === 'return_stone') g = returnStone(c);
  else if (id === 'bag_kit') g = bag(c);
  else if (id === 'resonator') g = resonator(c);
  else if (id === 'dim_shard') g = shards(c);
  else if (id === 'dim_alloy' || id === 'dim_alloy2') g = [...ingot(c, 0x5ef0ff), part(new OctahedronGeometry(0.1, 0), 0x5ef0ff, { pos: [0.15, 0.25, 0] })];
  else if (id.startsWith('food_')) g = bowl(c);
  else if (id === 'gear_part') g = gear(c);
  else if (id === 'gold') g = coins();
  else if (id === 'magi_alloy') g = ingot(c, 0x5ac8ff);
  else g = crystal(c); // 결정·수정·화염 핵·다이아
  return merge(g);
}

/** 장비 단계별 재료 색 (구리, 철, 금, 다이아, 티타늄, 오리하르콘, 차원) */
export const TIER_METAL = [0xd98a50, 0xaab2bc, 0xf0c848, 0xbff4ff, 0x9aa8b8, 0xff8a4a, 0x7a6cff];

export function buildEquipGeometry(e: Equip): BufferGeometry {
  const metal = TIER_METAL[Math.min(6, e.tier - 1)];
  const dark = shade(metal, 0.65);
  const gem = GRADES[e.grade].color;
  let g: BufferGeometry[];
  switch (e.slot) {
    case 'weapon':
      if (e.cls === 'mage')
        g = [
          part(new CylinderGeometry(0.04, 0.05, 1.1, 6), WOOD, { rot: [0, 0, 0.7] }),
          part(new TorusGeometry(0.12, 0.03, 4, 10), metal, { pos: [0.4, 0.36, 0], rot: [0, 0, 0.7] }),
          part(new OctahedronGeometry(0.12, 0), gem, { pos: [0.4, 0.36, 0], scale: [1, 1.4, 1] }),
        ];
      else if (e.cls === 'archer')
        g = [
          part(new TorusGeometry(0.46, 0.04, 4, 14, Math.PI), WOOD, { rot: [0, 0, -Math.PI / 2 + 0.7], pos: [-0.1, 0, 0] }),
          part(new BoxGeometry(0.02, 0.92, 0.02), 0xeeeeee, { rot: [0, 0, 0.7], pos: [-0.1, 0, 0] }),
          part(new BoxGeometry(0.1, 0.14, 0.08), metal, { rot: [0, 0, 0.7], pos: [-0.38, 0.3, 0] }),
          part(new OctahedronGeometry(0.06, 0), gem, { pos: [-0.36, 0.32, 0.06] }),
        ];
      else
        g = [
          part(new BoxGeometry(0.12, 0.8, 0.04), metal, { pos: [0.1, 0.18, 0], rot: [0, 0, -0.7] }),
          part(new ConeGeometry(0.085, 0.16, 4), metal, { pos: [0.4, 0.52, 0], rot: [0, 0, -0.7], scale: [1, 1, 0.35] }),
          part(new BoxGeometry(0.36, 0.07, 0.1), GOLD, { pos: [-0.16, -0.12, 0], rot: [0, 0, -0.7] }),
          part(new BoxGeometry(0.06, 0.24, 0.06), WOOD, { pos: [-0.26, -0.24, 0], rot: [0, 0, -0.7] }),
          part(new OctahedronGeometry(0.05, 0), gem, { pos: [-0.16, -0.12, 0.06] }),
        ];
      break;
    case 'helmet':
      g = [
        part(new SphereGeometry(0.36, 8, 5, 0, Math.PI * 2, 0, Math.PI / 2), metal, { pos: [0, -0.1, 0] }),
        part(new CylinderGeometry(0.38, 0.38, 0.08, 10), dark, { pos: [0, -0.1, 0] }),
        part(new BoxGeometry(0.06, 0.3, 0.06), dark, { pos: [0, -0.2, 0.36] }),
        part(new ConeGeometry(0.06, 0.2, 5), gem, { pos: [0, 0.34, 0] }),
      ];
      break;
    case 'armor':
      g = [
        part(new BoxGeometry(0.6, 0.62, 0.3), metal, { pos: [0, -0.05, 0] }),
        part(new BoxGeometry(0.26, 0.16, 0.34), dark, { pos: [0.34, 0.22, 0] }),
        part(new BoxGeometry(0.26, 0.16, 0.34), dark, { pos: [-0.34, 0.22, 0] }),
        part(new BoxGeometry(0.62, 0.08, 0.32), 0x6b4424, { pos: [0, -0.24, 0] }),
        part(new OctahedronGeometry(0.08, 0), gem, { pos: [0, 0.08, 0.17] }),
      ];
      break;
    case 'pants':
      g = [
        part(new BoxGeometry(0.56, 0.16, 0.28), dark, { pos: [0, 0.3, 0] }),
        part(new BoxGeometry(0.22, 0.6, 0.26), metal, { pos: [0.15, -0.08, 0] }),
        part(new BoxGeometry(0.22, 0.6, 0.26), metal, { pos: [-0.15, -0.08, 0] }),
        part(new BoxGeometry(0.1, 0.08, 0.04), gem, { pos: [0, 0.3, 0.15] }),
      ];
      break;
    case 'boots':
      g = [
        part(new BoxGeometry(0.2, 0.4, 0.22), metal, { pos: [0.15, 0.05, -0.05] }),
        part(new BoxGeometry(0.22, 0.14, 0.4), dark, { pos: [0.15, -0.2, 0.05] }),
        part(new BoxGeometry(0.2, 0.4, 0.22), metal, { pos: [-0.17, 0.08, -0.12] }),
        part(new BoxGeometry(0.22, 0.14, 0.4), dark, { pos: [-0.17, -0.17, -0.02] }),
        part(new BoxGeometry(0.06, 0.06, 0.04), gem, { pos: [0.15, 0.18, 0.07] }),
      ];
      break;
    case 'ring':
      g = [
        part(new TorusGeometry(0.3, 0.07, 6, 16), metal, { rot: [1.1, 0, 0] }),
        part(new BoxGeometry(0.16, 0.08, 0.16), dark, { pos: [0, 0.28, 0.12] }),
        part(new OctahedronGeometry(0.14, 0), gem, { pos: [0, 0.38, 0.14] }),
      ];
      break;
    case 'necklace':
    default:
      g = [
        part(new TorusGeometry(0.34, 0.03, 4, 16, Math.PI * 1.4), metal, { rot: [0.3, 0, -Math.PI * 0.2 - Math.PI / 2 + Math.PI * 0.3] }),
        part(new OctahedronGeometry(0.16, 0), gem, { pos: [0, -0.34, 0.1], scale: [1, 1.4, 0.6] }),
        part(new TorusGeometry(0.18, 0.03, 4, 10), metal, { pos: [0, -0.34, 0.06] }),
      ];
      break;
  }
  return merge(g);
}

/** 착용 장비 → 캐릭터 모델에 입힐 모습 */
export function gearLook(eq: Partial<Record<Equip['slot'], Equip>>, tools?: { pickaxe: { tier: number }; axe: { tier: number } }): HeroGear {
  const metal = (e: Equip) => TIER_METAL[Math.min(6, e.tier - 1)];
  const gem = (e: Equip) => GRADES[e.grade].color;
  const g: HeroGear = {};
  if (eq.weapon) g.weapon = { metal: metal(eq.weapon), gem: gem(eq.weapon) };
  if (eq.helmet) g.helmet = { metal: metal(eq.helmet), gem: gem(eq.helmet) };
  if (eq.armor) g.armor = { metal: metal(eq.armor), gem: gem(eq.armor) };
  if (eq.pants) g.pants = metal(eq.pants);
  if (eq.boots) g.boots = metal(eq.boots);
  if (eq.necklace) g.necklace = gem(eq.necklace);
  // 강화한 부위만 빛난다
  const glow: HeroGear['glow'] = {};
  for (const k of ['weapon', 'helmet', 'armor', 'pants', 'boots'] as const) if ((eq[k]?.plus ?? 0) > 0) glow[k] = eq[k]!.plus;
  if (Object.keys(glow).length) g.glow = glow;
  if (tools) {
    g.pickaxe = TIER_METAL[Math.min(6, tools.pickaxe.tier - 1)];
    g.axe = TIER_METAL[Math.min(6, tools.axe.tier - 1)];
  }
  return g;
}

/** 곡괭이·도끼 아이콘 (날 색이 단계 재질) */
export function buildToolGeometry(kind: 'pickaxe' | 'axe', tier: number): BufferGeometry {
  const metal = TIER_METAL[Math.min(6, tier - 1)];
  const g = [part(new CylinderGeometry(0.04, 0.05, 1, 6), WOOD, { rot: [0, 0, 0.7] })];
  if (kind === 'pickaxe') {
    g.push(part(new BoxGeometry(0.1, 0.12, 0.8), metal, { pos: [0.3, 0.36, 0], rot: [0, Math.PI / 2, 0.7] }));
    g.push(part(new ConeGeometry(0.07, 0.2, 4), shade(metal, 1.15), { pos: [0.6, 0.12, 0], rot: [0, 0, -Math.PI / 2 + 0.7 - 0.9] }));
    g.push(part(new ConeGeometry(0.07, 0.2, 4), shade(metal, 1.15), { pos: [0.0, 0.62, 0], rot: [0, 0, 0.7 + 0.2] }));
  } else {
    g.push(part(new BoxGeometry(0.34, 0.38, 0.07), metal, { pos: [0.38, 0.22, 0], rot: [0, 0, 0.7] }));
    g.push(part(new BoxGeometry(0.06, 0.4, 0.08), shade(metal, 1.25), { pos: [0.52, 0.08, 0], rot: [0, 0, 0.7] }));
  }
  return merge(g);
}
