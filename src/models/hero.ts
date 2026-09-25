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
  /** 부위별 장비 조각 (강화 빛을 그 부위에만 씌운다) */
  gearMeshes: Record<GlowPart, Mesh[]>;
}

export type GlowPart = 'weapon' | 'helmet' | 'armor' | 'pants' | 'boots';

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

/** 장비 모양: 판금(수호) · 가죽(사냥) · 천·로브(비전) */
export type GearStyle = 'plate' | 'leather' | 'cloth';

export interface HeroGear {
  /** 부위별 모양 (없으면 직업에 맞춰: 검사 판금, 궁수 가죽, 마법사 로브) */
  style?: Partial<Record<'helmet' | 'armor' | 'pants' | 'boots', GearStyle>>;
  weapon?: { metal: number; gem: number };
  helmet?: { metal: number; gem: number };
  armor?: { metal: number; gem: number };
  pants?: number;
  boots?: number;
  necklace?: number;
  pickaxe?: number;
  axe?: number;
  /** 강화 빛: 부위별 강화 단계 */
  glow?: Partial<Record<GlowPart, number>>;
}

/** 강화 단계별 빛 색: +1~3 파랑 · +4~6 초록 · +7~9 금빛 · +10 붉은 빛 */
export function glowColor(plus: number): number {
  return plus >= 10 ? 0xff4a4a : plus >= 7 ? 0xffd23a : plus >= 4 ? 0x4aff8a : 0x4aa8ff;
}

const darken = (c: number, k = 0.65) => (Math.round(((c >> 16) & 255) * k) << 16) | (Math.round(((c >> 8) & 255) * k) << 8) | Math.round((c & 255) * k);

/** 두 색을 t만큼 섞는다 */
const mix = (a: number, b: number, t: number) => {
  const ch = (sh: number) => Math.round(((a >> sh) & 255) * (1 - t) + ((b >> sh) & 255) * t);
  return (ch(16) << 16) | (ch(8) << 8) | ch(0);
};
/** 가죽·천 색: 기본 색에 장비 단계 재질 색이 조금 배어든다 */
const leatherOf = (metal: number) => mix(0x7a4e2c, metal, 0.18);
const clothOf = (metal: number) => mix(0x46307a, metal, 0.2);

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

/** 갑옷 (몸통 기준): 판금 흉갑 · 가죽 갑옷 · 로브 */
function armorGeo(style: GearStyle, metal: number, gem: number): ReturnType<typeof part>[] {
  if (style === 'leather') {
    const lc = leatherOf(metal);
    const strap = darken(lc, 0.7);
    return [
      // 가죽 조끼 (앞뒤), 어깨 덧댐, 가슴을 가로지르는 끈과 버클, 박음 징
      part(new BoxGeometry(0.5, 0.42, 0.05), lc, { pos: [0, 0.27, 0.17] }),
      part(new BoxGeometry(0.5, 0.4, 0.05), darken(lc, 0.85), { pos: [0, 0.28, -0.17] }),
      part(new BoxGeometry(0.2, 0.08, 0.28), lc, { pos: [0.28, 0.5, 0], rot: [0, 0, -0.35] }),
      part(new BoxGeometry(0.2, 0.08, 0.28), lc, { pos: [-0.28, 0.5, 0], rot: [0, 0, 0.35] }),
      part(new BoxGeometry(0.07, 0.62, 0.03), strap, { pos: [0, 0.28, 0.2], rot: [0, 0, -0.75] }),
      part(new BoxGeometry(0.08, 0.08, 0.03), metal, { pos: [0.08, 0.36, 0.215], rot: [0, 0, -0.75] }),
      part(new BoxGeometry(0.04, 0.04, 0.03), metal, { pos: [-0.16, 0.16, 0.2] }),
      part(new BoxGeometry(0.04, 0.04, 0.03), metal, { pos: [0.16, 0.16, 0.2] }),
      part(new BoxGeometry(0.56, 0.12, 0.37), strap, { pos: [0, 0.02, 0] }),
      part(new OctahedronGeometry(0.045), gem, { pos: [0.08, 0.36, 0.24] }),
    ];
  }
  if (style === 'cloth') {
    const cc = clothOf(metal);
    return [
      // 긴 로브: 몸통을 감싸고 허리 아래로 치맛자락, 어깨 망토, 가운데 장식 띠, 가슴 브로치
      part(new BoxGeometry(0.54, 0.46, 0.36), cc, { pos: [0, 0.26, 0] }),
      part(new BoxGeometry(0.64, 0.42, 0.42), darken(cc, 0.85), { pos: [0, -0.2, 0] }),
      part(new BoxGeometry(0.66, 0.1, 0.42), darken(cc, 0.7), { pos: [0, 0.47, 0] }),
      part(new BoxGeometry(0.4, 0.12, 0.34), cc, { pos: [0, 0.55, -0.04] }),
      part(new BoxGeometry(0.08, 0.84, 0.03), metal, { pos: [0, 0.05, 0.195] }),
      part(new BoxGeometry(0.66, 0.04, 0.43), metal, { pos: [0, -0.4, 0] }),
      part(new BoxGeometry(0.57, 0.06, 0.39), metal, { pos: [0, 0.07, 0] }),
      part(new OctahedronGeometry(0.06), gem, { pos: [0, 0.4, 0.22] }),
    ];
  }
  return [
    part(new BoxGeometry(0.44, 0.36, 0.05), metal, { pos: [0, 0.3, 0.17] }),
    part(new BoxGeometry(0.44, 0.3, 0.05), darken(metal), { pos: [0, 0.3, -0.17] }),
    part(new BoxGeometry(0.22, 0.12, 0.28), metal, { pos: [0.3, 0.5, 0] }),
    part(new BoxGeometry(0.22, 0.12, 0.28), metal, { pos: [-0.3, 0.5, 0] }),
    part(new OctahedronGeometry(0.05), gem, { pos: [0, 0.34, 0.2] }),
  ];
}

/** 투구 (머리 기준): 판금 투구 · 깃털 꽂은 사냥꾼 모자 · 마법사 모자 */
function helmetGeo(style: GearStyle, metal: number, gem: number, hair: number): ReturnType<typeof part>[] {
  if (style === 'leather') {
    const lc = mix(0x4a6a34, metal, 0.15);
    return [
      // 앞뒤로 긴 뾰족 모자, 앞으로 내민 챙, 띠, 옆에 꽂은 깃털
      part(new ConeGeometry(0.4, 0.36, 4), lc, { pos: [0, 0.7, -0.02], rot: [0, Math.PI / 4, 0], scale: [1, 1, 1.3] }),
      part(new BoxGeometry(0.6, 0.05, 0.62), darken(lc, 0.8), { pos: [0, 0.54, 0.02] }),
      part(new BoxGeometry(0.44, 0.04, 0.2), darken(lc, 0.8), { pos: [0, 0.55, 0.36], rot: [0.3, 0, 0] }),
      part(new BoxGeometry(0.58, 0.06, 0.6), metal, { pos: [0, 0.59, 0.01] }),
      part(new BoxGeometry(0.03, 0.46, 0.1), gem, { pos: [0.3, 0.8, -0.14], rot: [-0.7, 0, -0.35] }),
      part(new BoxGeometry(0.02, 0.4, 0.04), 0xf4f0e0, { pos: [0.31, 0.8, -0.14], rot: [-0.7, 0, -0.35] }),
      part(new BoxGeometry(0.57, 0.1, 0.1), hair, { pos: [0, 0.47, -0.22] }),
    ];
  }
  if (style === 'cloth') {
    const cc = clothOf(metal);
    return [
      // 넓은 챙, 뒤로 꺾인 뾰족 모자, 재질 띠와 보석
      part(new CylinderGeometry(0.5, 0.5, 0.05, 10), darken(cc, 0.8), { pos: [0, 0.58, 0] }),
      part(new ConeGeometry(0.31, 0.5, 8), cc, { pos: [0, 0.84, -0.03], rot: [-0.15, 0, 0] }),
      part(new ConeGeometry(0.15, 0.32, 6), cc, { pos: [0, 1.18, -0.15], rot: [-0.7, 0, 0] }),
      part(new CylinderGeometry(0.315, 0.315, 0.07, 8), metal, { pos: [0, 0.63, 0] }),
      part(new OctahedronGeometry(0.06), gem, { pos: [0, 0.64, 0.31] }),
      part(new OctahedronGeometry(0.035), metal, { pos: [0, 1.25, -0.28] }),
    ];
  }
  return [
    part(new BoxGeometry(0.6, 0.2, 0.55), metal, { pos: [0, 0.57, -0.01] }),
    part(new BoxGeometry(0.62, 0.06, 0.57), darken(metal), { pos: [0, 0.46, -0.01] }),
    part(new BoxGeometry(0.07, 0.26, 0.07), darken(metal), { pos: [0, 0.3, 0.26] }),
    part(new ConeGeometry(0.06, 0.18, 5), gem, { pos: [0, 0.76, 0] }),
  ];
}

export function buildHero(material: Material, look: HeroLook): HeroRig {
  const meshes: Mesh[] = [];
  const skin = look.skin ?? C.skin;
  const gear = look.gear ?? {};
  const blade = gear.weapon?.metal ?? C.steel;
  const bladeDark = gear.weapon ? darken(gear.weapon.metal) : C.steelDark;
  const bootColor = gear.boots ?? C.boot;
  const classStyle: GearStyle = look.weapon === 'staff' ? 'cloth' : look.weapon === 'bow' ? 'leather' : 'plate';
  const styleOf = (slot: 'helmet' | 'armor' | 'pants' | 'boots') => gear.style?.[slot] ?? classStyle;
  const mesh = (parts: Parameters<typeof merge>[0]) => {
    const m = new Mesh(merge(parts), material);
    m.castShadow = true;
    meshes.push(m);
    return m;
  };

  const gearMeshes: Record<GlowPart, Mesh[]> = { weapon: [], helmet: [], armor: [], pants: [], boots: [] };
  const gearMesh = (slot: GlowPart, parts: Parameters<typeof merge>[0]) => {
    const m = mesh(parts);
    gearMeshes[slot].push(m);
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
    leg.add(mesh([part(new BoxGeometry(0.17, 0.44, 0.19), look.pants ?? C.pants, { pos: [0, -0.22, 0] })]));
    // 신발: 판금 장화 · 가죽 장화 · 천 신발
    const bootStyle = gear.boots !== undefined ? styleOf('boots') : null;
    if (bootStyle === 'leather') {
      const lc = leatherOf(gear.boots!);
      leg.add(
        gearMesh('boots', [
          part(new BoxGeometry(0.2, 0.16, 0.28), darken(lc, 0.85), { pos: [0, -0.52, 0.03] }),
          part(new BoxGeometry(0.2, 0.2, 0.21), lc, { pos: [0, -0.38, 0] }),
          part(new BoxGeometry(0.22, 0.06, 0.23), darken(lc), { pos: [0, -0.27, 0] }),
          part(new BoxGeometry(0.05, 0.05, 0.03), gear.boots!, { pos: [0.06, -0.38, 0.11] }),
        ]),
      );
    } else if (bootStyle === 'cloth') {
      const cc = clothOf(gear.boots!);
      leg.add(
        gearMesh('boots', [
          part(new BoxGeometry(0.19, 0.13, 0.27), cc, { pos: [0, -0.53, 0.03] }),
          part(new ConeGeometry(0.06, 0.14, 4), darken(cc, 0.8), { pos: [0, -0.5, 0.21], rot: [Math.PI / 2 - 0.4, 0, 0] }),
          part(new BoxGeometry(0.2, 0.04, 0.21), gear.boots!, { pos: [0, -0.45, 0] }),
        ]),
      );
    } else {
      leg.add(
        gearMesh('boots', [
          part(new BoxGeometry(0.19, 0.16, 0.27), bootColor, { pos: [0, -0.52, 0.03] }),
          ...(gear.boots !== undefined ? [part(new BoxGeometry(0.2, 0.08, 0.2), darken(gear.boots), { pos: [0, -0.4, 0] })] : []),
        ]),
      );
    }
    if (gear.pants !== undefined) {
      const ps = styleOf('pants');
      if (ps === 'leather') {
        const lc = leatherOf(gear.pants);
        leg.add(
          gearMesh('pants', [
            part(new BoxGeometry(0.19, 0.3, 0.21), lc, { pos: [0, -0.16, 0] }),
            part(new BoxGeometry(0.12, 0.1, 0.04), gear.pants, { pos: [0, -0.3, 0.11] }),
            part(new BoxGeometry(0.2, 0.05, 0.22), darken(lc), { pos: [0, -0.04, 0] }),
          ]),
        );
      } else if (ps === 'cloth') {
        const cc = clothOf(gear.pants);
        leg.add(gearMesh('pants', [part(new BoxGeometry(0.2, 0.36, 0.22), cc, { pos: [0, -0.2, 0] }), part(new BoxGeometry(0.21, 0.04, 0.23), gear.pants, { pos: [0, -0.37, 0] })]));
      } else {
        leg.add(gearMesh('pants', [part(new BoxGeometry(0.19, 0.22, 0.05), gear.pants, { pos: [0, -0.28, 0.1] }), part(new BoxGeometry(0.19, 0.06, 0.21), darken(gear.pants), { pos: [0, -0.05, 0] })]));
      }
    }
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
      part(new BoxGeometry(0.22, 0.12, 0.26), gear.armor && styleOf('armor') === 'plate' ? gear.armor.metal : C.steel, { pos: [0.3, 0.49, 0] }),
      part(new BoxGeometry(0.22, 0.12, 0.26), gear.armor && styleOf('armor') === 'plate' ? gear.armor.metal : C.steel, { pos: [-0.3, 0.49, 0] }),
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
  const armorParts = gear.armor ? armorGeo(styleOf('armor'), gear.armor.metal, gear.armor.gem) : null;
  if (gear.necklace !== undefined) torsoParts.push(part(new OctahedronGeometry(0.045), gear.necklace, { pos: [0, 0.44, 0.19] }));
  if (look.apron) torsoParts.push(part(new BoxGeometry(0.44, 0.6, 0.04), look.apron, { pos: [0, 0.12, 0.17] }));
  torso.add(mesh(torsoParts));
  if (armorParts) torso.add(gearMesh('armor', armorParts));

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
  const helmetParts = gear.helmet ? helmetGeo(styleOf('helmet'), gear.helmet.metal, gear.helmet.gem, look.hair) : null;
  if (!helmetParts && look.hat === 'wizard') {
    headParts.push(part(new CylinderGeometry(0.46, 0.46, 0.05, 8), look.tunicDark, { pos: [0, 0.6, 0] }));
    headParts.push(part(new ConeGeometry(0.3, 0.6, 8), look.tunic, { pos: [0, 0.9, -0.04], rot: [-0.2, 0, 0] }));
  }
  if (look.beard !== undefined) {
    headParts.push(part(new BoxGeometry(0.44, 0.26, 0.1), look.beard, { pos: [0, 0.06, 0.22] }));
  }
  head.add(mesh(headParts));
  if (helmetParts) head.add(gearMesh('helmet', helmetParts));

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

  for (const c of weapon.children) if (c instanceof Mesh) gearMeshes.weapon.push(c);
  return { root, body, torso, head, armL, armR, legL, legR, weapon, pickaxe, axe, meshes, gearMeshes };
}
