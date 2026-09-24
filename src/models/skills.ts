import { BoxGeometry, BufferGeometry, ConeGeometry, CylinderGeometry, IcosahedronGeometry, OctahedronGeometry, SphereGeometry, TorusGeometry } from 'three';
import type { ClassId } from '../data/classes';
import { merge, part } from './util';

/** 스킬 아이콘용 작은 3D 상징물. 직업·스킬 번호마다 하나씩 */

const STEEL = 0xdfe6ef;
const GOLD = 0xe8c14a;
const WOOD = 0x8a5a34;

const sword = (rot: number, x = 0, y = 0, blade = STEEL): BufferGeometry[] => {
  // 칼날 방향 단위 벡터 (z축으로 rot만큼 돌린 +y)
  const ax = -Math.sin(rot);
  const ay = Math.cos(rot);
  return [
    part(new BoxGeometry(0.1, 0.72, 0.04), blade, { pos: [x + ax * 0.12, y + ay * 0.12, 0], rot: [0, 0, rot] }),
    part(new BoxGeometry(0.3, 0.06, 0.08), GOLD, { pos: [x - ax * 0.26, y - ay * 0.26, 0], rot: [0, 0, rot] }),
    part(new BoxGeometry(0.07, 0.2, 0.07), WOOD, { pos: [x - ax * 0.38, y - ay * 0.38, 0], rot: [0, 0, rot] }),
  ];
};

const arrow = (rot: number, x = 0, y = 0, color = 0xc8ffb0, len = 0.8): BufferGeometry[] => [
  part(new CylinderGeometry(0.025, 0.025, len, 5), WOOD, { pos: [x, y, 0], rot: [0, 0, rot] }),
  part(new ConeGeometry(0.08, 0.2, 4), color, { pos: [x - Math.sin(rot) * len * 0.55, y + Math.cos(rot) * len * 0.55, 0], rot: [0, 0, rot] }),
  part(new BoxGeometry(0.12, 0.1, 0.02), 0xffffff, { pos: [x + Math.sin(rot) * len * 0.45, y - Math.cos(rot) * len * 0.45, 0], rot: [0, 0, rot] }),
];

const shield = (color: number, scale = 1): BufferGeometry[] => [
  part(new CylinderGeometry(0.42 * scale, 0.42 * scale, 0.08, 8), 0x7a8494, { rot: [Math.PI / 2, 0, 0] }),
  part(new CylinderGeometry(0.32 * scale, 0.32 * scale, 0.1, 8), color, { rot: [Math.PI / 2, 0, 0], pos: [0, 0, 0.02] }),
  part(new OctahedronGeometry(0.1 * scale), GOLD, { pos: [0, 0, 0.08] }),
];

export function buildSkillGeometry(cls: ClassId, index: number): BufferGeometry {
  let g: BufferGeometry[];
  switch (`${cls}:${index}`) {
    // ---- 검사 ----
    case 'sword:0': // 돌진 베기: 기울어진 검 + 잔상
      g = [...sword(-0.8), part(new BoxGeometry(0.5, 0.05, 0.02), 0x9fd8ff, { pos: [-0.25, -0.1, -0.05] }), part(new BoxGeometry(0.4, 0.05, 0.02), 0x9fd8ff, { pos: [-0.3, 0.05, -0.05] })];
      break;
    case 'sword:1': // 회전 베기: 검 + 회오리 고리
      g = [...sword(0.3), part(new TorusGeometry(0.42, 0.04, 5, 20), 0x9fd8ff, { rot: [1.2, 0, 0] })];
      break;
    case 'sword:2': // 대지 가르기: 갈라진 땅
      g = [
        part(new BoxGeometry(0.9, 0.12, 0.5), 0x8a6a4a, { pos: [0, -0.3, 0] }),
        part(new ConeGeometry(0.12, 0.5, 4), 0xffb070, { pos: [-0.2, 0, 0] }),
        part(new ConeGeometry(0.1, 0.4, 4), 0xffb070, { pos: [0.05, -0.05, 0] }),
        part(new ConeGeometry(0.08, 0.3, 4), 0xffb070, { pos: [0.28, -0.1, 0] }),
      ];
      break;
    case 'sword:3': // 철벽 태세: 두꺼운 벽
      g = [part(new BoxGeometry(0.8, 0.6, 0.2), 0x8a96aa), part(new BoxGeometry(0.84, 0.1, 0.24), 0x5a6478, { pos: [0, 0.1, 0] }), part(new BoxGeometry(0.84, 0.1, 0.24), 0x5a6478, { pos: [0, -0.15, 0] })];
      break;
    case 'sword:4': // 수호의 방패
      g = shield(0x3a78d8, 1.1);
      break;
    case 'sword:5': // 전투 함성: 뿔나팔
      g = [part(new ConeGeometry(0.28, 0.8, 8, 1, true), GOLD, { rot: [0, 0, -1.2] }), part(new TorusGeometry(0.28, 0.04, 4, 10), 0xff8a5a, { pos: [0.38, 0.14, 0], rot: [0, Math.PI / 2, 0] })];
      break;
    // ---- 마법사 ----
    case 'mage:0': // 화염구
      g = [part(new IcosahedronGeometry(0.34, 1), 0xff6a2a), part(new IcosahedronGeometry(0.22, 0), 0xffd070, { pos: [0.06, 0.06, 0.14] }), part(new ConeGeometry(0.2, 0.5, 6), 0xff9a3a, { pos: [-0.35, -0.25, 0], rot: [0, 0, 2.3] })];
      break;
    case 'mage:1': // 얼음 장판
      g = [part(new CylinderGeometry(0.46, 0.46, 0.06, 12), 0xbfefff, { pos: [0, -0.2, 0] }), part(new OctahedronGeometry(0.16), 0x9fe8ff, { pos: [0, 0.05, 0], scale: [0.7, 1.8, 0.7] }), part(new OctahedronGeometry(0.1), 0x9fe8ff, { pos: [0.25, -0.05, 0.1], scale: [0.7, 1.6, 0.7] }), part(new OctahedronGeometry(0.1), 0x9fe8ff, { pos: [-0.24, -0.06, -0.1], scale: [0.7, 1.5, 0.7] })];
      break;
    case 'mage:2': // 번개 연쇄: 지그재그
      g = [0, 1, 2, 3].map((i) => part(new BoxGeometry(0.1, 0.34, 0.08), 0xffe45a, { pos: [(i % 2 ? 0.1 : -0.1) + (i - 1.5) * 0.05, 0.36 - i * 0.24, 0], rot: [0, 0, i % 2 ? 0.7 : -0.7] }));
      break;
    case 'mage:3': // 마나 실드: 방울 + 수정
      g = [part(new IcosahedronGeometry(0.42, 1), 0x6ab4ff), part(new OctahedronGeometry(0.15), 0xd8f0ff, { scale: [1, 1.4, 1] })];
      break;
    case 'mage:4': // 점멸: 화살표 + 반짝
      g = [part(new BoxGeometry(0.5, 0.14, 0.08), 0x9fe8ff, { pos: [-0.1, 0, 0] }), part(new ConeGeometry(0.2, 0.3, 3), 0x9fe8ff, { pos: [0.3, 0, 0], rot: [0, 0, -Math.PI / 2] }), part(new OctahedronGeometry(0.08), 0xffffff, { pos: [-0.35, 0.22, 0] }), part(new OctahedronGeometry(0.06), 0xffffff, { pos: [-0.2, -0.24, 0] })];
      break;
    case 'mage:5': // 마력 순환: 구슬 + 두 고리
      g = [part(new SphereGeometry(0.2, 10, 8), 0x7fd6ff), part(new TorusGeometry(0.38, 0.035, 5, 18), 0xb67cff, { rot: [1.1, 0.3, 0] }), part(new TorusGeometry(0.38, 0.035, 5, 18), 0x5ee0ff, { rot: [-0.4, 1.2, 0] })];
      break;
    // ---- 궁수 ----
    case 'archer:0': // 관통 화살
      g = [...arrow(-0.8, 0, 0, 0xffe07a, 1), part(new TorusGeometry(0.16, 0.03, 4, 10), 0xffffff, { rot: [0, Math.PI / 2, 0.8] })];
      break;
    case 'archer:1': // 부채꼴 연사
      g = [-0.6, -0.3, 0, 0.3, 0.6].flatMap((r) => arrow(r, -Math.sin(r) * 0.15, Math.cos(r) * 0.15 - 0.05, 0xc8ffb0, 0.6));
      break;
    case 'archer:2': // 후방 도약 덫
      g = [part(new CylinderGeometry(0.34, 0.38, 0.12, 10), 0x6a5a4a, { pos: [0, -0.2, 0] }), part(new SphereGeometry(0.2, 8, 6), 0x3a3a40, { pos: [0, 0.02, 0] }), part(new ConeGeometry(0.05, 0.16, 5), 0xffb040, { pos: [0.1, 0.25, 0], rot: [0, 0, -0.4] })];
      break;
    case 'archer:3': // 바람 걸음: 깃털
      g = [part(new CylinderGeometry(0.02, 0.02, 0.8, 4), 0xffffff, { rot: [0, 0, 0.6] }), part(new BoxGeometry(0.22, 0.6, 0.02), 0xc8ffb0, { pos: [0.04, 0.04, 0], rot: [0, 0, 0.6] }), part(new TorusGeometry(0.34, 0.025, 4, 14, Math.PI), 0x9fffd8, { pos: [0, -0.1, 0.05], rot: [0, 0, 0.3] })];
      break;
    case 'archer:4': // 연막탄: 구름
      g = [
        part(new SphereGeometry(0.24, 8, 6), 0xb0b0c0, { pos: [-0.18, -0.05, 0] }),
        part(new SphereGeometry(0.3, 8, 6), 0xc8c8d4, { pos: [0.08, 0.06, 0] }),
        part(new SphereGeometry(0.2, 8, 6), 0x9a9aaa, { pos: [0.3, -0.12, 0] }),
      ];
      break;
    case 'archer:5': // 사냥꾼의 집중: 과녁
    default:
      g = [
        part(new CylinderGeometry(0.42, 0.42, 0.05, 16), 0xffffff, { rot: [Math.PI / 2, 0, 0] }),
        part(new CylinderGeometry(0.3, 0.3, 0.06, 16), 0xff4a4a, { rot: [Math.PI / 2, 0, 0] }),
        part(new CylinderGeometry(0.16, 0.16, 0.07, 16), 0xffffff, { rot: [Math.PI / 2, 0, 0] }),
        part(new CylinderGeometry(0.07, 0.07, 0.08, 12), 0xff4a4a, { rot: [Math.PI / 2, 0, 0] }),
        ...arrow(-0.7, 0.2, 0.2, 0xffd060, 0.6),
      ];
      break;
  }
  return merge(g);
}
