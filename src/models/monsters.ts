import {
  BoxGeometry,
  ConeGeometry,
  CylinderGeometry,
  DodecahedronGeometry,
  Group,
  IcosahedronGeometry,
  Material,
  Mesh,
  OctahedronGeometry,
  SphereGeometry,
} from 'three';
import type { Archetype } from '../data/monsters';
import { merge, part } from './util';

export interface MonsterRig {
  root: Group;
  /** 몸 전체 (흔들림, 기울임) */
  body: Group;
  legs: Group[];
  arms: Group[];
  meshes: Mesh[];
  /** 머리 위 체력바 높이 */
  height: number;
}

export interface MonsterColors {
  main: number;
  dark: number;
  accent: number;
}

const shade = (color: number, f: number) => {
  const r = Math.min(255, Math.round(((color >> 16) & 255) * f));
  const g = Math.min(255, Math.round(((color >> 8) & 255) * f));
  const b = Math.min(255, Math.round((color & 255) * f));
  return (r << 16) | (g << 8) | b;
};

/** 단계별 몬스터 색 */
export const MONSTER_COLORS: MonsterColors[] = [
  { main: 0x6f8f4a, dark: 0x4a5e32, accent: 0xffe45a },
  { main: 0xa8583a, dark: 0x6e3622, accent: 0xffd08a },
  { main: 0x9cc8e8, dark: 0x5f86a8, accent: 0x5ae0ff },
  { main: 0x8a6ac8, dark: 0x5a4290, accent: 0x7fffe0 },
  { main: 0x8a8070, dark: 0x5a5448, accent: 0xff9a2a },
  { main: 0x4a3434, dark: 0x2a1c1c, accent: 0xff5a1a },
  { main: 0x3a3a70, dark: 0x22224a, accent: 0x5ef0ff },
];

export function buildMonster(material: Material, arch: Archetype, colors: MonsterColors, boss = false): MonsterRig {
  const meshes: Mesh[] = [];
  const mesh = (parts: Parameters<typeof merge>[0]) => {
    const m = new Mesh(merge(parts), material);
    m.castShadow = true;
    meshes.push(m);
    return m;
  };
  const root = new Group();
  const body = new Group();
  root.add(body);
  const legs: Group[] = [];
  const arms: Group[] = [];
  const { main, dark, accent } = colors;
  let height = 1.2;

  const quadLegs = (w: number, l: number, h: number, thick: number, color: number) => {
    for (const [x, z] of [
      [w, l],
      [-w, l],
      [w, -l],
      [-w, -l],
    ]) {
      const g = new Group();
      g.position.set(x, h, z);
      g.add(mesh([part(new BoxGeometry(thick, h, thick), color, { pos: [0, -h / 2, 0] })]));
      body.add(g);
      legs.push(g);
    }
  };

  switch (arch) {
    case 'melee': {
      // 늑대 같은 네발 짐승
      body.add(
        mesh([
          part(new BoxGeometry(0.46, 0.42, 0.9), main, { pos: [0, 0.62, 0] }),
          part(new BoxGeometry(0.4, 0.38, 0.4), main, { pos: [0, 0.78, 0.55] }),
          part(new BoxGeometry(0.24, 0.18, 0.28), dark, { pos: [0, 0.7, 0.85] }),
          part(new ConeGeometry(0.08, 0.2, 4), dark, { pos: [0.12, 1.04, 0.5] }),
          part(new ConeGeometry(0.08, 0.2, 4), dark, { pos: [-0.12, 1.04, 0.5] }),
          part(new BoxGeometry(0.07, 0.06, 0.02), accent, { pos: [0.11, 0.84, 0.755] }),
          part(new BoxGeometry(0.07, 0.06, 0.02), accent, { pos: [-0.11, 0.84, 0.755] }),
          part(new BoxGeometry(0.12, 0.12, 0.45), dark, { pos: [0, 0.75, -0.6], rot: [0.5, 0, 0] }),
          part(new BoxGeometry(0.5, 0.12, 0.6), dark, { pos: [0, 0.86, -0.05] }),
        ]),
      );
      quadLegs(0.15, 0.3, 0.44, 0.13, dark);
      height = 1.2;
      break;
    }
    case 'ranged': {
      // 떠 있는 두건 주술사와 마력 구슬
      body.add(
        mesh([
          part(new ConeGeometry(0.42, 1.0, 7), main, { pos: [0, 0.75, 0] }),
          part(new SphereGeometry(0.26, 7, 5), dark, { pos: [0, 1.32, 0] }),
          part(new ConeGeometry(0.3, 0.45, 7), main, { pos: [0, 1.55, -0.04], rot: [-0.3, 0, 0] }),
          part(new BoxGeometry(0.08, 0.05, 0.02), accent, { pos: [0.09, 1.34, 0.25] }),
          part(new BoxGeometry(0.08, 0.05, 0.02), accent, { pos: [-0.09, 1.34, 0.25] }),
        ]),
      );
      const orb = new Group();
      orb.position.set(0, 1.0, 0.45);
      orb.add(mesh([part(new OctahedronGeometry(0.16), accent)]));
      body.add(orb);
      arms.push(orb);
      height = 1.9;
      break;
    }
    case 'charger': {
      // 엄니가 난 멧돼지
      body.add(
        mesh([
          part(new BoxGeometry(0.66, 0.6, 1.05), main, { pos: [0, 0.68, 0] }),
          part(new BoxGeometry(0.56, 0.5, 0.42), dark, { pos: [0, 0.66, 0.66] }),
          part(new BoxGeometry(0.3, 0.22, 0.12), shade(dark, 1.3), { pos: [0, 0.56, 0.92] }),
          part(new ConeGeometry(0.06, 0.34, 5), 0xf4ecd8, { pos: [0.2, 0.55, 0.95], rot: [1.2, 0, 0.3] }),
          part(new ConeGeometry(0.06, 0.34, 5), 0xf4ecd8, { pos: [-0.2, 0.55, 0.95], rot: [1.2, 0, -0.3] }),
          part(new BoxGeometry(0.07, 0.06, 0.02), accent, { pos: [0.15, 0.78, 0.875] }),
          part(new BoxGeometry(0.07, 0.06, 0.02), accent, { pos: [-0.15, 0.78, 0.875] }),
          part(new BoxGeometry(0.2, 0.22, 0.8), dark, { pos: [0, 1.04, -0.05] }),
        ]),
      );
      quadLegs(0.22, 0.34, 0.4, 0.17, dark);
      height = 1.3;
      break;
    }
    case 'bomber': {
      // 가시 돋친 공
      body.add(
        mesh([
          part(new IcosahedronGeometry(0.42, 0), main, { pos: [0, 0.5, 0] }),
          part(new ConeGeometry(0.1, 0.24, 4), dark, { pos: [0, 0.98, 0] }),
          part(new ConeGeometry(0.1, 0.24, 4), dark, { pos: [0.42, 0.55, 0], rot: [0, 0, -1.4] }),
          part(new ConeGeometry(0.1, 0.24, 4), dark, { pos: [-0.42, 0.55, 0], rot: [0, 0, 1.4] }),
          part(new ConeGeometry(0.1, 0.24, 4), dark, { pos: [0, 0.55, -0.42], rot: [-1.4, 0, 0] }),
          part(new BoxGeometry(0.1, 0.1, 0.03), accent, { pos: [0.13, 0.6, 0.39] }),
          part(new BoxGeometry(0.1, 0.1, 0.03), accent, { pos: [-0.13, 0.6, 0.39] }),
        ]),
      );
      height = 1.2;
      break;
    }
    case 'tank': {
      // 거대한 골렘
      body.add(
        mesh([
          part(new BoxGeometry(1.0, 0.8, 0.7), main, { pos: [0, 1.15, 0] }),
          part(new BoxGeometry(0.7, 0.4, 0.6), dark, { pos: [0, 0.65, 0] }),
          part(new BoxGeometry(0.42, 0.36, 0.4), dark, { pos: [0, 1.72, 0.08] }),
          part(new BoxGeometry(0.28, 0.06, 0.02), accent, { pos: [0, 1.75, 0.285] }),
          part(new OctahedronGeometry(0.16), accent, { pos: [0, 1.2, 0.36] }),
          part(new DodecahedronGeometry(0.2, 0), shade(main, 1.15), { pos: [0.52, 1.5, 0] }),
          part(new DodecahedronGeometry(0.2, 0), shade(main, 1.15), { pos: [-0.52, 1.5, 0] }),
        ]),
      );
      for (const x of [0.62, -0.62]) {
        const arm = new Group();
        arm.position.set(x, 1.45, 0);
        arm.add(
          mesh([
            part(new BoxGeometry(0.3, 0.6, 0.32), main, { pos: [0, -0.3, 0] }),
            part(new BoxGeometry(0.38, 0.36, 0.4), dark, { pos: [0, -0.75, 0.04] }),
          ]),
        );
        body.add(arm);
        arms.push(arm);
      }
      for (const x of [0.25, -0.25]) {
        const leg = new Group();
        leg.position.set(x, 0.5, 0);
        leg.add(mesh([part(new BoxGeometry(0.32, 0.5, 0.36), dark, { pos: [0, -0.25, 0] })]));
        body.add(leg);
        legs.push(leg);
      }
      height = 2.2;
      break;
    }
  }

  if (boss) {
    // 왕관처럼 솟은 뿔
    const crownY = height - 0.05;
    const crown = [part(new CylinderGeometry(0.34, 0.38, 0.12, 8), 0xe8c14a, { pos: [0, crownY, 0] })];
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      crown.push(part(new ConeGeometry(0.08, 0.3, 4), i % 2 ? 0xe8c14a : accent, { pos: [Math.cos(a) * 0.3, crownY + 0.2, Math.sin(a) * 0.3] }));
    }
    body.add(mesh(crown));
    height += 0.3;
  }

  return { root, body, legs, arms, meshes, height };
}

/** 이펙트용 투사체 모양 */
export function buildProjectileMesh(material: Material, kind: 'orb' | 'arrow' | 'shard' | 'wave'): Mesh {
  switch (kind) {
    case 'arrow':
      return new Mesh(
        merge([
          part(new BoxGeometry(0.04, 0.04, 0.7), 0xc9a070),
          part(new ConeGeometry(0.06, 0.14, 4), 0xdfe6ee, { pos: [0, 0, 0.4], rot: [Math.PI / 2, 0, 0] }),
          part(new BoxGeometry(0.02, 0.1, 0.14), 0xffffff, { pos: [0, 0, -0.3] }),
        ]),
        material,
      );
    case 'shard':
      return new Mesh(merge([part(new OctahedronGeometry(0.18), 0xffffff, { scale: [0.6, 0.6, 1.6] })]), material);
    case 'wave':
      return new Mesh(merge([part(new BoxGeometry(1.4, 0.35, 0.3), 0xffffff, { pos: [0, 0.2, 0] })]), material);
    default:
      return new Mesh(merge([part(new IcosahedronGeometry(0.2, 0), 0xffffff)]), material);
  }
}
