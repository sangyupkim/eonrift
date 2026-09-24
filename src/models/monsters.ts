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
import type { HumanoidSpec, ModelSpec } from '../data/species';
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
  /** 움직임 방식 */
  style: 'beast' | 'float' | 'bounce' | 'golem' | 'humanoid' | 'bat' | 'spider';
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

export function buildMonster(material: Material, spec: ModelSpec, colors: MonsterColors, boss = false, glow?: number): MonsterRig {
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
  let style: MonsterRig['style'] = 'beast';

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

  switch (spec.kind) {
    case 'wolf': {
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
    case 'spirit': {
      // 떠 있는 두건 주술사와 마력 구슬
      style = 'float';
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
    case 'boar': {
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
    case 'spore': {
      // 가시 돋친 공
      style = 'bounce';
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
    case 'golem': {
      // 거대한 골렘
      style = 'golem';
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
    case 'humanoid':
      height = buildHumanoid(spec, mesh, body, legs, arms, glow ?? accent);
      style = 'humanoid';
      break;
    case 'spider': {
      // 배가 큰 거미: 다리 여덟 개
      style = 'spider';
      body.add(
        mesh([
          part(new SphereGeometry(0.46, 8, 6), main, { pos: [0, 0.62, -0.35], scale: [1, 0.8, 1.15] }),
          part(new SphereGeometry(0.28, 8, 6), dark, { pos: [0, 0.55, 0.2] }),
          part(new BoxGeometry(0.34, 0.06, 0.4), shade(main, 1.3), { pos: [0, 0.98, -0.35] }),
          ...[-0.09, 0.09].flatMap((x) => [part(new BoxGeometry(0.06, 0.06, 0.03), accent, { pos: [x, 0.64, 0.46] }), part(new BoxGeometry(0.04, 0.04, 0.03), accent, { pos: [x * 1.8, 0.7, 0.42] })]),
          part(new ConeGeometry(0.04, 0.16, 4), 0xe8e0d0, { pos: [0.06, 0.42, 0.44], rot: [Math.PI, 0, 0] }),
          part(new ConeGeometry(0.04, 0.16, 4), 0xe8e0d0, { pos: [-0.06, 0.42, 0.44], rot: [Math.PI, 0, 0] }),
        ]),
      );
      for (let i = 0; i < 4; i++)
        for (const side of [1, -1]) {
          const g = new Group();
          g.position.set(side * 0.22, 0.6, 0.3 - i * 0.2);
          g.rotation.y = side * (0.5 - i * 0.35);
          g.add(
            mesh([
              part(new BoxGeometry(0.06, 0.06, 0.5), dark, { pos: [side * 0.2, 0.12, 0], rot: [0, Math.PI / 2, side * 0.5] }),
              part(new BoxGeometry(0.05, 0.55, 0.05), dark, { pos: [side * 0.45, -0.18, 0], rot: [0, 0, side * 0.25] }),
            ]),
          );
          body.add(g);
          legs.push(g);
        }
      height = 1.2;
      break;
    }
    case 'bat': {
      // 날개를 퍼덕이는 박쥐
      style = 'bat';
      body.add(
        mesh([
          part(new SphereGeometry(0.2, 7, 5), main, { pos: [0, 1, 0], scale: [1, 1.2, 1] }),
          part(new ConeGeometry(0.06, 0.16, 4), dark, { pos: [0.1, 1.28, 0] }),
          part(new ConeGeometry(0.06, 0.16, 4), dark, { pos: [-0.1, 1.28, 0] }),
          part(new BoxGeometry(0.05, 0.04, 0.02), accent, { pos: [0.07, 1.06, 0.19] }),
          part(new BoxGeometry(0.05, 0.04, 0.02), accent, { pos: [-0.07, 1.06, 0.19] }),
        ]),
      );
      for (const side of [1, -1]) {
        const w = new Group();
        w.position.set(side * 0.15, 1.02, 0);
        w.add(
          mesh([
            part(new BoxGeometry(0.55, 0.03, 0.34), dark, { pos: [side * 0.3, 0, -0.04] }),
            part(new BoxGeometry(0.3, 0.03, 0.22), main, { pos: [side * 0.62, 0, -0.1], rot: [0, side * 0.3, 0] }),
          ]),
        );
        body.add(w);
        arms.push(w);
      }
      height = 1.5;
      break;
    }
    case 'wraith': {
      // 떠다니는 누더기 망토와 빛나는 눈
      style = 'float';
      body.add(
        mesh([
          part(new ConeGeometry(0.46, 1.2, 7, 1, true), dark, { pos: [0, 0.85, 0] }),
          part(new ConeGeometry(0.4, 1.0, 7), main, { pos: [0, 0.95, 0] }),
          part(new SphereGeometry(0.24, 7, 5), 0x0a0a14, { pos: [0, 1.52, 0.02] }),
          part(new ConeGeometry(0.32, 0.55, 7), main, { pos: [0, 1.62, -0.05], rot: [-0.25, 0, 0] }),
          part(new BoxGeometry(0.08, 0.05, 0.02), accent, { pos: [0.08, 1.54, 0.24] }),
          part(new BoxGeometry(0.08, 0.05, 0.02), accent, { pos: [-0.08, 1.54, 0.24] }),
        ]),
      );
      for (const side of [1, -1]) {
        const a = new Group();
        a.position.set(side * 0.34, 1.3, 0.05);
        a.add(
          mesh([
            part(new BoxGeometry(0.12, 0.5, 0.12), main, { pos: [0, -0.25, 0.05] }),
            part(new ConeGeometry(0.05, 0.22, 4), accent, { pos: [0, -0.58, 0.1], rot: [Math.PI, 0, 0] }),
          ]),
        );
        body.add(a);
        arms.push(a);
      }
      height = 2;
      break;
    }
    case 'slime': {
      // 말랑한 슬라임
      style = 'bounce';
      body.add(
        mesh([
          part(new SphereGeometry(0.42, 10, 8), main, { pos: [0, 0.36, 0], scale: [1, 0.78, 1] }),
          part(new SphereGeometry(0.2, 8, 6), shade(main, 1.25), { pos: [0.1, 0.5, 0.1] }),
          part(new BoxGeometry(0.07, 0.1, 0.03), accent, { pos: [0.12, 0.42, 0.38] }),
          part(new BoxGeometry(0.07, 0.1, 0.03), accent, { pos: [-0.12, 0.42, 0.38] }),
        ]),
      );
      height = 0.9;
      break;
    }
  }
  const size = spec.size ?? 1;
  if (size !== 1 && spec.kind !== 'humanoid') {
    body.scale.setScalar(size);
    height *= size;
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

  return { root, body, legs, arms, meshes, height, style };
}

/**
 * 사람형 몬스터 (해골·오크·다크엘프·고블린·트롤…). 머리 모양과 무기를 바꿔 끼운다.
 * arms[0] = 오른팔(무기), arms[1] = 왼팔(방패·활). 반환값은 키
 */
function buildHumanoid(spec: HumanoidSpec, mesh: (p: Parameters<typeof merge>[0]) => Mesh, body: Group, legs: Group[], arms: Group[], glow: number): number {
  const size = spec.size ?? 1;
  const { skin, cloth } = spec;
  const armor = spec.armor ?? cloth;
  const hair = spec.hair ?? shade(cloth, 0.7);
  const steel = 0xc8d0dc;
  const wood = 0x7a5232;
  const skel = spec.head === 'skull';
  const g = new Group();
  g.scale.setScalar(size);
  body.add(g);

  // 다리
  for (const x of [0.13, -0.13]) {
    const leg = new Group();
    leg.position.set(x, 0.66, 0);
    leg.add(
      mesh([
        part(new BoxGeometry(skel ? 0.08 : 0.16, 0.5, skel ? 0.08 : 0.17), skel ? skin : shade(cloth, 0.8), { pos: [0, -0.26, 0] }),
        part(new BoxGeometry(0.17, 0.12, 0.24), skel ? skin : 0x3a2a1e, { pos: [0, -0.6, 0.03] }),
      ]),
    );
    g.add(leg);
    legs.push(leg);
  }
  // 몸통
  const torso = [
    part(new BoxGeometry(0.5, 0.56, 0.3), skel ? 0x000000 : cloth, { pos: [0, 0.98, 0] }),
    part(new BoxGeometry(0.52, 0.1, 0.32), 0x3a2a1e, { pos: [0, 0.74, 0] }),
  ];
  if (skel) {
    // 갈비뼈
    torso.length = 0;
    torso.push(part(new BoxGeometry(0.08, 0.56, 0.08), skin, { pos: [0, 0.98, -0.05] }));
    for (let i = 0; i < 4; i++) torso.push(part(new BoxGeometry(0.42 - i * 0.04, 0.05, 0.22), skin, { pos: [0, 1.16 - i * 0.12, 0.02] }));
    torso.push(part(new BoxGeometry(0.34, 0.1, 0.18), skin, { pos: [0, 0.74, 0] }));
    if (spec.armor) torso.push(part(new BoxGeometry(0.54, 0.16, 0.34), armor, { pos: [0, 1.22, 0] }));
  } else if (spec.armor) torso.push(part(new BoxGeometry(0.54, 0.34, 0.34), armor, { pos: [0, 1.08, 0] }), part(new BoxGeometry(0.2, 0.12, 0.36), shade(armor, 1.2), { pos: [0, 1.1, 0.02] }));
  if (spec.cape) torso.push(part(new BoxGeometry(0.5, 0.8, 0.05), spec.cape, { pos: [0, 0.86, -0.19], rot: [0.12, 0, 0] }));
  g.add(mesh(torso));

  // 머리
  const head: Parameters<typeof merge>[0] = [];
  const hy = 1.5;
  const eyes = (y: number, z: number, w = 0.07) => [part(new BoxGeometry(w, 0.05, 0.02), glow, { pos: [0.08, y, z] }), part(new BoxGeometry(w, 0.05, 0.02), glow, { pos: [-0.08, y, z] })];
  switch (spec.head) {
    case 'skull':
      head.push(part(new BoxGeometry(0.34, 0.32, 0.34), skin, { pos: [0, hy, 0] }), part(new BoxGeometry(0.26, 0.1, 0.26), shade(skin, 0.85), { pos: [0, hy - 0.2, 0.03] }), part(new BoxGeometry(0.1, 0.08, 0.02), 0x1a1410, { pos: [0.08, hy + 0.02, 0.17] }), part(new BoxGeometry(0.1, 0.08, 0.02), 0x1a1410, { pos: [-0.08, hy + 0.02, 0.17] }), ...eyes(hy + 0.02, 0.18, 0.04));
      break;
    case 'orc':
      head.push(
        part(new BoxGeometry(0.4, 0.36, 0.36), skin, { pos: [0, hy, 0] }),
        part(new BoxGeometry(0.42, 0.08, 0.1), shade(skin, 0.75), { pos: [0, hy + 0.08, 0.16] }),
        part(new BoxGeometry(0.3, 0.14, 0.12), shade(skin, 0.9), { pos: [0, hy - 0.12, 0.17] }),
        part(new ConeGeometry(0.035, 0.14, 4), 0xf4ecd8, { pos: [0.1, hy - 0.06, 0.22] }),
        part(new ConeGeometry(0.035, 0.14, 4), 0xf4ecd8, { pos: [-0.1, hy - 0.06, 0.22] }),
        part(new ConeGeometry(0.06, 0.16, 4), skin, { pos: [0.24, hy + 0.04, 0], rot: [0, 0, -1.3] }),
        part(new ConeGeometry(0.06, 0.16, 4), skin, { pos: [-0.24, hy + 0.04, 0], rot: [0, 0, 1.3] }),
        part(new BoxGeometry(0.12, 0.12, 0.3), hair, { pos: [0, hy + 0.22, -0.02] }),
        ...eyes(hy + 0.02, 0.185),
      );
      break;
    case 'elf':
      head.push(
        part(new BoxGeometry(0.3, 0.34, 0.3), skin, { pos: [0, hy, 0] }),
        part(new ConeGeometry(0.05, 0.3, 4), skin, { pos: [0.22, hy + 0.06, -0.02], rot: [0, 0, -1.1] }),
        part(new ConeGeometry(0.05, 0.3, 4), skin, { pos: [-0.22, hy + 0.06, -0.02], rot: [0, 0, 1.1] }),
        part(new BoxGeometry(0.34, 0.12, 0.34), hair, { pos: [0, hy + 0.18, -0.02] }),
        part(new BoxGeometry(0.3, 0.46, 0.08), hair, { pos: [0, hy - 0.1, -0.17] }),
        ...eyes(hy + 0.02, 0.155, 0.06),
      );
      break;
    case 'goblin':
      head.push(
        part(new BoxGeometry(0.4, 0.34, 0.34), skin, { pos: [0, hy, 0] }),
        part(new ConeGeometry(0.09, 0.34, 4), skin, { pos: [0.3, hy + 0.06, 0], rot: [0, 0, -1.35] }),
        part(new ConeGeometry(0.09, 0.34, 4), skin, { pos: [-0.3, hy + 0.06, 0], rot: [0, 0, 1.35] }),
        part(new ConeGeometry(0.05, 0.16, 4), shade(skin, 0.85), { pos: [0, hy - 0.02, 0.22], rot: [Math.PI / 2, 0, 0] }),
        ...eyes(hy + 0.06, 0.175, 0.08),
      );
      break;
    case 'hood':
      head.push(
        part(new SphereGeometry(0.2, 7, 5), 0x0a0a12, { pos: [0, hy, 0.02] }),
        part(new ConeGeometry(0.28, 0.6, 7), cloth, { pos: [0, hy + 0.1, -0.04], rot: [-0.2, 0, 0] }),
        part(new BoxGeometry(0.46, 0.14, 0.4), cloth, { pos: [0, hy - 0.2, 0] }),
        ...eyes(hy, 0.2, 0.05),
      );
      break;
    case 'helm':
      head.push(
        part(new BoxGeometry(0.38, 0.38, 0.38), armor, { pos: [0, hy, 0] }),
        part(new BoxGeometry(0.3, 0.05, 0.02), glow, { pos: [0, hy + 0.02, 0.195] }),
        part(new BoxGeometry(0.06, 0.24, 0.4), shade(armor, 1.25), { pos: [0, hy + 0.1, 0] }),
        part(new BoxGeometry(0.06, 0.18, 0.3), hair, { pos: [0, hy + 0.3, -0.06] }),
      );
      break;
    case 'zombie':
      head.push(
        part(new BoxGeometry(0.34, 0.34, 0.32), skin, { pos: [0.03, hy - 0.04, 0.04], rot: [0.2, 0, 0.18] }),
        part(new BoxGeometry(0.16, 0.06, 0.02), 0x2a1a1a, { pos: [0.03, hy - 0.14, 0.21] }),
        ...eyes(hy, 0.2, 0.05),
      );
      break;
    case 'horned':
      head.push(
        part(new BoxGeometry(0.34, 0.32, 0.32), skin, { pos: [0, hy, 0] }),
        part(new ConeGeometry(0.06, 0.3, 5), 0x2a1a1a, { pos: [0.14, hy + 0.26, 0], rot: [0, 0, -0.35] }),
        part(new ConeGeometry(0.06, 0.3, 5), 0x2a1a1a, { pos: [-0.14, hy + 0.26, 0], rot: [0, 0, 0.35] }),
        part(new BoxGeometry(0.18, 0.05, 0.02), 0x2a0a0a, { pos: [0, hy - 0.1, 0.165] }),
        ...eyes(hy + 0.03, 0.165),
      );
      break;
  }
  g.add(mesh(head));

  // 팔과 무기
  const armMat = skel ? skin : spec.armor && !skel ? armor : skin;
  const weapon = (w: HumanoidSpec['weapon'], side: 1 | -1): Parameters<typeof merge>[0] => {
    const hand = -0.52;
    switch (w) {
      case 'sword':
        return [part(new BoxGeometry(0.07, 0.07, 0.7), steel, { pos: [0, hand, 0.38] }), part(new BoxGeometry(0.22, 0.05, 0.06), 0x8a7a5a, { pos: [0, hand, 0.04] })];
      case 'axe':
        return [part(new BoxGeometry(0.05, 0.05, 0.75), wood, { pos: [0, hand, 0.3] }), part(new BoxGeometry(0.05, 0.3, 0.22), steel, { pos: [0, hand + 0.1, 0.6] })];
      case 'axes':
        return [part(new BoxGeometry(0.05, 0.05, 0.55), wood, { pos: [0, hand, 0.22] }), part(new BoxGeometry(0.05, 0.24, 0.2), steel, { pos: [0, hand + 0.08, 0.44] })];
      case 'club':
        return [part(new CylinderGeometry(0.06, 0.14, 0.9, 6), wood, { pos: [0, hand, 0.42], rot: [Math.PI / 2, 0, 0] }), part(new DodecahedronGeometry(0.1, 0), 0x6a6a6a, { pos: [0, hand + 0.06, 0.8] })];
      case 'spear':
        return [part(new CylinderGeometry(0.03, 0.03, 1.5, 5), wood, { pos: [0, hand, 0.5], rot: [Math.PI / 2, 0, 0] }), part(new ConeGeometry(0.06, 0.26, 4), steel, { pos: [0, hand, 1.3], rot: [Math.PI / 2, 0, 0] })];
      case 'staff':
        return [part(new CylinderGeometry(0.035, 0.035, 1.5, 5), wood, { pos: [0, hand + 0.35, 0.12] }), part(new OctahedronGeometry(0.12), glow, { pos: [0, hand + 1.15, 0.12] })];
      case 'daggers':
        return [part(new BoxGeometry(0.05, 0.05, 0.36), steel, { pos: [0, hand, 0.2] })];
      case 'bow':
        return side === -1 ? [part(new BoxGeometry(0.04, 0.9, 0.05), wood, { pos: [0, hand, 0.18] }), part(new BoxGeometry(0.01, 0.86, 0.01), 0xe8e8e8, { pos: [0, hand, 0.08] })] : [];
      case 'claws':
        return [part(new ConeGeometry(0.03, 0.18, 4), 0xe8e0d0, { pos: [0.04, hand - 0.08, 0.08], rot: [0.6, 0, 0] }), part(new ConeGeometry(0.03, 0.18, 4), 0xe8e0d0, { pos: [-0.04, hand - 0.08, 0.08], rot: [0.6, 0, 0] })];
    }
  };
  for (const side of [1, -1] as const) {
    const arm = new Group();
    arm.position.set(side * -0.33, 1.2, 0);
    const parts: Parameters<typeof merge>[0] = [part(new BoxGeometry(skel ? 0.07 : 0.13, 0.5, skel ? 0.07 : 0.14), armMat, { pos: [0, -0.25, 0] })];
    if (spec.armor && !skel) parts.push(part(new BoxGeometry(0.18, 0.12, 0.2), shade(armor, 1.15), { pos: [0, -0.02, 0] }));
    const w = spec.weapon;
    if (side === 1 && w !== 'bow') parts.push(...weapon(w, 1));
    if (side === -1) {
      if (w === 'bow' || w === 'axes' || w === 'daggers' || w === 'claws') parts.push(...weapon(w, -1));
      else if (spec.shield) parts.push(part(new BoxGeometry(0.08, 0.56, 0.42), armor, { pos: [-0.06, -0.42, 0.12] }), part(new OctahedronGeometry(0.07), glow, { pos: [-0.11, -0.42, 0.12] }));
    }
    arm.add(mesh(parts));
    g.add(arm);
    arms.push(arm);
  }
  return 1.85 * size;
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
