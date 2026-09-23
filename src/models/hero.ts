import { BoxGeometry, CylinderGeometry, Group, Material, Mesh, OctahedronGeometry } from 'three';
import { merge, part } from './util';

/** 검사 캐릭터의 관절 구조. 애니메이션은 각 관절 그룹을 회전시켜 만든다 */
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
  sword: Group;
  meshes: Mesh[];
}

const C = {
  skin: 0xf2c9a0,
  hair: 0x4a3024,
  tunic: 0x2f6fd6,
  tunicDark: 0x2456a8,
  pants: 0x3b3550,
  boot: 0x5a3a24,
  belt: 0x6b4424,
  gold: 0xe8c14a,
  steel: 0xc9d2dc,
  steelDark: 0x8c96a3,
  eye: 0x1c1a24,
};

export const HIP_HEIGHT = 0.6;

export function buildHero(material: Material): HeroRig {
  const meshes: Mesh[] = [];
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
        part(new BoxGeometry(0.17, 0.44, 0.19), C.pants, { pos: [0, -0.22, 0] }),
        part(new BoxGeometry(0.19, 0.16, 0.27), C.boot, { pos: [0, -0.52, 0.03] }),
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
  torso.add(
    mesh([
      part(new BoxGeometry(0.5, 0.48, 0.32), C.tunic, { pos: [0, 0.27, 0] }),
      part(new BoxGeometry(0.56, 0.16, 0.36), C.tunicDark, { pos: [0, -0.02, 0] }),
      part(new BoxGeometry(0.53, 0.07, 0.35), C.belt, { pos: [0, 0.07, 0] }),
      part(new BoxGeometry(0.1, 0.08, 0.04), C.gold, { pos: [0, 0.07, 0.18] }),
      part(new BoxGeometry(0.14, 0.14, 0.03), C.gold, { pos: [0, 0.33, 0.165], rot: [0, 0, Math.PI / 4] }),
      part(new BoxGeometry(0.22, 0.12, 0.26), C.steel, { pos: [0.3, 0.49, 0] }),
      part(new BoxGeometry(0.22, 0.12, 0.26), C.steel, { pos: [-0.3, 0.49, 0] }),
    ]),
  );

  // 머리 (2~2.5등신이 되도록 크게)
  const head = new Group();
  head.position.y = 0.5;
  torso.add(head);
  head.add(
    mesh([
      part(new BoxGeometry(0.52, 0.48, 0.46), C.skin, { pos: [0, 0.26, 0] }),
      part(new BoxGeometry(0.57, 0.16, 0.51), C.hair, { pos: [0, 0.53, -0.01] }),
      part(new BoxGeometry(0.57, 0.38, 0.14), C.hair, { pos: [0, 0.33, -0.2] }),
      part(new BoxGeometry(0.52, 0.1, 0.07), C.hair, { pos: [0, 0.45, 0.22] }),
      part(new BoxGeometry(0.16, 0.08, 0.07), C.hair, { pos: [0.16, 0.39, 0.22] }),
      part(new BoxGeometry(0.06, 0.28, 0.42), C.hair, { pos: [0.28, 0.34, -0.02] }),
      part(new BoxGeometry(0.06, 0.28, 0.42), C.hair, { pos: [-0.28, 0.34, -0.02] }),
      part(new BoxGeometry(0.07, 0.11, 0.02), C.eye, { pos: [0.11, 0.24, 0.235] }),
      part(new BoxGeometry(0.07, 0.11, 0.02), C.eye, { pos: [-0.11, 0.24, 0.235] }),
    ]),
  );

  // 팔
  const makeArm = (x: number) => {
    const arm = new Group();
    arm.position.set(x, 0.44, 0);
    arm.add(
      mesh([
        part(new BoxGeometry(0.15, 0.26, 0.17), C.tunic, { pos: [0, -0.12, 0] }),
        part(new BoxGeometry(0.13, 0.22, 0.14), C.skin, { pos: [0, -0.34, 0] }),
      ]),
    );
    torso.add(arm);
    return arm;
  };
  const armL = makeArm(0.33);
  const armR = makeArm(-0.33);

  // 왼팔 방패
  const shield = mesh([
    part(new CylinderGeometry(0.24, 0.24, 0.05, 8), C.steelDark, { rot: [0, 0, Math.PI / 2] }),
    part(new CylinderGeometry(0.18, 0.18, 0.06, 8), C.tunic, { pos: [0.005, 0, 0], rot: [0, 0, Math.PI / 2] }),
    part(new OctahedronGeometry(0.06), C.gold, { pos: [0.04, 0, 0] }),
  ]);
  shield.position.set(0.1, -0.28, 0.02);
  armL.add(shield);

  // 오른손 검 (손잡이에서 -y 방향으로 칼날이 뻗는다)
  const sword = new Group();
  sword.position.set(0, -0.42, 0.02);
  sword.add(
    mesh([
      part(new BoxGeometry(0.06, 0.18, 0.06), C.belt, { pos: [0, 0.02, 0] }),
      part(new BoxGeometry(0.08, 0.06, 0.08), C.gold, { pos: [0, 0.12, 0] }),
      part(new BoxGeometry(0.3, 0.05, 0.09), C.gold, { pos: [0, -0.09, 0] }),
      part(new BoxGeometry(0.1, 0.72, 0.035), C.steel, { pos: [0, -0.47, 0] }),
      part(new BoxGeometry(0.03, 0.72, 0.04), C.steelDark, { pos: [0, -0.47, 0] }),
      part(new OctahedronGeometry(0.07), C.steel, { pos: [0, -0.84, 0], scale: [0.72, 1.2, 0.25] }),
    ]),
  );
  armR.add(sword);

  return { root, body, torso, head, armL, armR, legL, legR, sword, meshes };
}
