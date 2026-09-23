import { BoxGeometry, ConeGeometry, CylinderGeometry, Group, Material, Mesh, OctahedronGeometry } from 'three';
import { merge, part } from './util';

/** 사람형 캐릭터(주인공, NPC)의 관절 구조. 애니메이션은 관절 그룹을 회전시켜 만든다 */
export interface HeroRig {
  root: Group;
  /** 엉덩이 높이의 중심. 구르기와 몸 흔들림에 쓴다 */
  body: Group;
  torso: Group;
  head: Group;
  armL: Group;
  armR: Group;
  legL: Group;
  legR: Group;
  weapon: Group;
  /** 채집 도구 (평소에는 숨김) */
  pickaxe: Group;
  axe: Group;
  meshes: Mesh[];
}

export type WeaponKind = 'sword' | 'staff' | 'bow' | 'hammer' | 'none';

export interface HeroLook {
  tunic: number;
  tunicDark: number;
  hair: number;
  skin?: number;
  pants?: number;
  weapon: WeaponKind;
  shield?: boolean;
  hat?: 'wizard' | 'none';
  beard?: number;
  apron?: number;
  /** 착용 장비 모습 (재질 색, 보석 색) */
  gear?: HeroGear;
}

export interface HeroGear {
  weapon?: { metal: number; gem: number };
  helmet?: { metal: number; gem: number };
  armor?: { metal: number; gem: number };
  pants?: number;
  boots?: number;
  necklace?: number;
  pickaxe?: number;
  axe?: number;
}

const darken = (c: number, k = 0.65) => (Math.round(((c >> 16) & 255) * k) << 16) | (Math.round(((c >> 8) & 255) * k) << 8) | Math.round((c & 255) * k);

const C = {
  skin: 0xf2c9a0,
  pants: 0x3b3550,
  boot: 0x5a3a24,
  belt: 0x6b4424,
  gold: 0xe8c14a,
  steel: 0xc9d2dc,
  steelDark: 0x8c96a3,
  eye: 0x1c1a24,
  wood: 0x7a5234,
};

export const HIP_HEIGHT = 0.6;

export function buildHero(material: Material, look: HeroLook): HeroRig {
  const meshes: Mesh[] = [];
  const skin = look.skin ?? C.skin;
  const gear = look.gear ?? {};
  const blade = gear.weapon?.metal ?? C.steel;
  const bladeDark = gear.weapon ? darken(gear.weapon.metal) : C.steelDark;
  const bootColor = gear.boots ?? C.boot;
  const mesh = (parts: Parameters<typeof merge>[0]) => {
    const m = new Mesh(merge(parts), material);
    m.castShadow = true;
    meshes.push(m);
    return m;
  };

  const root = new Group();
  const body = new Group();
  body.position.y = HIP_HEIGHT;
  root.add(body);

  // 다리 (오른쪽이 -x: 캐릭터는 +z를 바라본다)
  const makeLeg = (x: number) => {
    const leg = new Group();
    leg.position.set(x, 0, 0);
    leg.add(
      mesh([
        part(new BoxGeometry(0.17, 0.44, 0.19), look.pants ?? C.pants, { pos: [0, -0.22, 0] }),
        part(new BoxGeometry(0.19, 0.16, 0.27), bootColor, { pos: [0, -0.52, 0.03] }),
        ...(gear.boots !== undefined ? [part(new BoxGeometry(0.2, 0.08, 0.2), darken(gear.boots), { pos: [0, -0.4, 0] })] : []),
        ...(gear.pants !== undefined
          ? [part(new BoxGeometry(0.19, 0.22, 0.05), gear.pants, { pos: [0, -0.28, 0.1] }), part(new BoxGeometry(0.19, 0.06, 0.21), darken(gear.pants), { pos: [0, -0.05, 0] })]
          : []),
      ]),
    );
    body.add(leg);
    return leg;
  };
  const legL = makeLeg(0.13);
  const legR = makeLeg(-0.13);

  // 몸통
  const torso = new Group();
  body.add(torso);
  const torsoParts = [
    part(new BoxGeometry(0.5, 0.48, 0.32), look.tunic, { pos: [0, 0.27, 0] }),
    part(new BoxGeometry(0.56, 0.16, 0.36), look.tunicDark, { pos: [0, -0.02, 0] }),
    part(new BoxGeometry(0.53, 0.07, 0.35), C.belt, { pos: [0, 0.07, 0] }),
    part(new BoxGeometry(0.1, 0.08, 0.04), C.gold, { pos: [0, 0.07, 0.18] }),
  ];
  if (look.weapon === 'sword') {
    torsoParts.push(
      part(new BoxGeometry(0.14, 0.14, 0.03), C.gold, { pos: [0, 0.33, 0.165], rot: [0, 0, Math.PI / 4] }),
      part(new BoxGeometry(0.22, 0.12, 0.26), gear.armor?.metal ?? C.steel, { pos: [0.3, 0.49, 0] }),
      part(new BoxGeometry(0.22, 0.12, 0.26), gear.armor?.metal ?? C.steel, { pos: [-0.3, 0.49, 0] }),
    );
  } else if (look.weapon === 'staff') {
    // 긴 로브 자락
    torsoParts.push(part(new BoxGeometry(0.6, 0.34, 0.4), look.tunicDark, { pos: [0, -0.2, 0] }));
    torsoParts.push(part(new BoxGeometry(0.06, 0.4, 0.03), C.gold, { pos: [0, 0.25, 0.165] }));
  } else if (look.weapon === 'bow') {
    torsoParts.push(part(new BoxGeometry(0.08, 0.6, 0.05), C.belt, { pos: [0, 0.27, 0.17], rot: [0, 0, 0.7] }));
    // 등 뒤 화살통
    torsoParts.push(part(new CylinderGeometry(0.09, 0.08, 0.5, 6), C.belt, { pos: [0.12, 0.35, -0.22], rot: [0, 0, -0.35] }));
    torsoParts.push(part(new BoxGeometry(0.14, 0.08, 0.1), 0xe8e0d0, { pos: [0.21, 0.62, -0.22], rot: [0, 0, -0.35] }));
  }
  if (gear.armor) {
    const a = gear.armor;
    torsoParts.push(
      part(new BoxGeometry(0.44, 0.36, 0.05), a.metal, { pos: [0, 0.3, 0.17] }),
      part(new BoxGeometry(0.44, 0.3, 0.05), darken(a.metal), { pos: [0, 0.3, -0.17] }),
      part(new BoxGeometry(0.22, 0.12, 0.28), a.metal, { pos: [0.3, 0.5, 0] }),
      part(new BoxGeometry(0.22, 0.12, 0.28), a.metal, { pos: [-0.3, 0.5, 0] }),
      part(new OctahedronGeometry(0.05), a.gem, { pos: [0, 0.34, 0.2] }),
    );
  }
  if (gear.necklace !== undefined) torsoParts.push(part(new OctahedronGeometry(0.045), gear.necklace, { pos: [0, 0.44, 0.19] }));
  if (look.apron) torsoParts.push(part(new BoxGeometry(0.44, 0.6, 0.04), look.apron, { pos: [0, 0.12, 0.17] }));
  torso.add(mesh(torsoParts));

  // 머리 (2~2.5등신이 되도록 크게)
  const head = new Group();
  head.position.y = 0.5;
  torso.add(head);
  const headParts = [
    part(new BoxGeometry(0.52, 0.48, 0.46), skin, { pos: [0, 0.26, 0] }),
    part(new BoxGeometry(0.57, 0.16, 0.51), look.hair, { pos: [0, 0.53, -0.01] }),
    part(new BoxGeometry(0.57, 0.38, 0.14), look.hair, { pos: [0, 0.33, -0.2] }),
    part(new BoxGeometry(0.52, 0.1, 0.07), look.hair, { pos: [0, 0.45, 0.22] }),
    part(new BoxGeometry(0.16, 0.08, 0.07), look.hair, { pos: [0.16, 0.39, 0.22] }),
    part(new BoxGeometry(0.06, 0.28, 0.42), look.hair, { pos: [0.28, 0.34, -0.02] }),
    part(new BoxGeometry(0.06, 0.28, 0.42), look.hair, { pos: [-0.28, 0.34, -0.02] }),
    part(new BoxGeometry(0.07, 0.11, 0.02), C.eye, { pos: [0.11, 0.24, 0.235] }),
    part(new BoxGeometry(0.07, 0.11, 0.02), C.eye, { pos: [-0.11, 0.24, 0.235] }),
  ];
  if (gear.helmet) {
    const h = gear.helmet;
    headParts.push(
      part(new BoxGeometry(0.6, 0.2, 0.55), h.metal, { pos: [0, 0.57, -0.01] }),
      part(new BoxGeometry(0.62, 0.06, 0.57), darken(h.metal), { pos: [0, 0.46, -0.01] }),
      part(new BoxGeometry(0.07, 0.26, 0.07), darken(h.metal), { pos: [0, 0.3, 0.26] }),
      part(new ConeGeometry(0.06, 0.18, 5), h.gem, { pos: [0, 0.76, 0] }),
    );
  } else if (look.hat === 'wizard') {
    headParts.push(part(new CylinderGeometry(0.46, 0.46, 0.05, 8), look.tunicDark, { pos: [0, 0.6, 0] }));
    headParts.push(part(new ConeGeometry(0.3, 0.6, 8), look.tunic, { pos: [0, 0.9, -0.04], rot: [-0.2, 0, 0] }));
  }
  if (look.beard !== undefined) {
    headParts.push(part(new BoxGeometry(0.44, 0.26, 0.1), look.beard, { pos: [0, 0.06, 0.22] }));
  }
  head.add(mesh(headParts));

  // 팔
  const makeArm = (x: number) => {
    const arm = new Group();
    arm.position.set(x, 0.44, 0);
    arm.add(
      mesh([
        part(new BoxGeometry(0.15, 0.26, 0.17), look.tunic, { pos: [0, -0.12, 0] }),
        part(new BoxGeometry(0.13, 0.22, 0.14), skin, { pos: [0, -0.34, 0] }),
      ]),
    );
    torso.add(arm);
    return arm;
  };
  const armL = makeArm(0.33);
  const armR = makeArm(-0.33);

  if (look.shield) {
    const shield = mesh([
      part(new CylinderGeometry(0.24, 0.24, 0.05, 8), C.steelDark, { rot: [0, 0, Math.PI / 2] }),
      part(new CylinderGeometry(0.18, 0.18, 0.06, 8), look.tunic, { pos: [0.005, 0, 0], rot: [0, 0, Math.PI / 2] }),
      part(new OctahedronGeometry(0.06), C.gold, { pos: [0.04, 0, 0] }),
    ]);
    shield.position.set(0.1, -0.28, 0.02);
    armL.add(shield);
  }

  // 오른손 무기 (손잡이 기준)
  const weapon = new Group();
  weapon.position.set(0, -0.42, 0.02);
  switch (look.weapon) {
    case 'sword':
      // 칼날이 -y 방향으로 뻗는다
      weapon.add(
        mesh([
          part(new BoxGeometry(0.06, 0.18, 0.06), C.belt, { pos: [0, 0.02, 0] }),
          part(new BoxGeometry(0.08, 0.06, 0.08), C.gold, { pos: [0, 0.12, 0] }),
          part(new BoxGeometry(0.3, 0.05, 0.09), C.gold, { pos: [0, -0.09, 0] }),
          part(new BoxGeometry(0.1, 0.72, 0.035), blade, { pos: [0, -0.47, 0] }),
          part(new BoxGeometry(0.03, 0.72, 0.04), bladeDark, { pos: [0, -0.47, 0] }),
          part(new OctahedronGeometry(0.07), blade, { pos: [0, -0.84, 0], scale: [0.72, 1.2, 0.25] }),
          ...(gear.weapon ? [part(new OctahedronGeometry(0.04), gear.weapon.gem, { pos: [0, -0.09, 0.05] })] : []),
        ]),
      );
      break;
    case 'staff':
      // 위로 솟은 지팡이 끝에 마력 구슬
      weapon.add(
        mesh([
          part(new CylinderGeometry(0.035, 0.04, 1.3, 6), C.wood, { pos: [0, 0.35, 0] }),
          part(new OctahedronGeometry(0.1), gear.weapon?.metal ?? look.tunicDark, { pos: [0, 0.98, 0] }),
          part(new OctahedronGeometry(0.13), gear.weapon?.gem ?? 0x9fe8ff, { pos: [0, 1.12, 0] }),
        ]),
      );
      break;
    case 'bow':
      // 앞으로 휜 활 (위아래 활대 + 시위)
      weapon.add(
        mesh([
          part(new BoxGeometry(0.05, 0.2, 0.06), C.belt, { pos: [0, 0, 0.08] }),
          part(new BoxGeometry(0.04, 0.42, 0.05), C.wood, { pos: [0, 0.28, 0.02], rot: [-0.45, 0, 0] }),
          part(new BoxGeometry(0.04, 0.42, 0.05), C.wood, { pos: [0, -0.28, 0.02], rot: [0.45, 0, 0] }),
          part(new BoxGeometry(0.012, 0.9, 0.012), 0xf0f0e0, { pos: [0, 0, -0.07] }),
          part(new BoxGeometry(0.06, 0.08, 0.07), blade, { pos: [0, 0.48, -0.05] }),
          part(new BoxGeometry(0.06, 0.08, 0.07), blade, { pos: [0, -0.48, -0.05] }),
          ...(gear.weapon ? [part(new OctahedronGeometry(0.04), gear.weapon.gem, { pos: [0, 0, 0.13] })] : []),
        ]),
      );
      break;
    case 'hammer':
      weapon.add(
        mesh([
          part(new CylinderGeometry(0.035, 0.035, 0.7, 6), C.wood, { pos: [0, -0.2, 0] }),
          part(new BoxGeometry(0.2, 0.18, 0.34), C.steelDark, { pos: [0, -0.55, 0] }),
        ]),
      );
      break;
    case 'none':
      break;
  }
  armR.add(weapon);

  // 채집 도구: 손잡이가 -y로 뻗고 끝에 날이 달린다
  const pickaxe = new Group();
  pickaxe.position.copy(weapon.position);
  pickaxe.add(
    mesh([
      part(new CylinderGeometry(0.03, 0.035, 0.75, 6), C.wood, { pos: [0, -0.3, 0] }),
      part(new BoxGeometry(0.07, 0.08, 0.62), gear.pickaxe !== undefined ? darken(gear.pickaxe, 0.8) : C.steelDark, { pos: [0, -0.66, 0] }),
      part(new ConeGeometry(0.05, 0.16, 4), gear.pickaxe ?? C.steel, { pos: [0, -0.66, 0.36], rot: [Math.PI / 2, 0, 0] }),
      part(new ConeGeometry(0.05, 0.16, 4), gear.pickaxe ?? C.steel, { pos: [0, -0.66, -0.36], rot: [-Math.PI / 2, 0, 0] }),
    ]),
  );
  const axe = new Group();
  axe.position.copy(weapon.position);
  axe.add(
    mesh([
      part(new CylinderGeometry(0.03, 0.035, 0.75, 6), C.wood, { pos: [0, -0.3, 0] }),
      part(new BoxGeometry(0.05, 0.26, 0.26), gear.axe ?? C.steel, { pos: [0, -0.6, 0.14] }),
    ]),
  );
  pickaxe.visible = axe.visible = false;
  armR.add(pickaxe, axe);

  return { root, body, torso, head, armL, armR, legL, legR, weapon, pickaxe, axe, meshes };
}
