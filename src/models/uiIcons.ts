import { BoxGeometry, BufferGeometry, ConeGeometry, CylinderGeometry, OctahedronGeometry, SphereGeometry, TorusGeometry } from 'three';
import { merge, part } from './util';

/** 화면 버튼·이름표에 쓰는 작은 3D 아이콘 */
export type UiIcon =
  | 'bag'
  | 'armor'
  | 'hammer'
  | 'book'
  | 'portal'
  | 'glove'
  | 'boot'
  | 'crate_in'
  | 'crate_out'
  | 'scroll'
  | 'refresh'
  | 'phone'
  | 'key'
  | 'sparkle'
  | 'hourglass'
  | 'warning'
  | 'target'
  | 'arrow'
  | 'music'
  | 'speaker'
  | 'disk'
  | 'shield'
  | 'skull';

const WOOD = 0x9a6a3c;
const WOOD_D = 0x6a4424;
const STEEL = 0xc8d2e0;
const STEEL_D = 0x7a8494;
const GOLD = 0xe8c14a;
const LEATHER = 0x8a5a34;
const LEATHER_D = 0x5e3a20;

/** 상자 + 위아래 화살표 (보관상자 투입·출하) */
function crate(up: boolean): BufferGeometry[] {
  const c = up ? 0xffd04a : 0x5ec8ff;
  return [
    part(new BoxGeometry(0.9, 0.62, 0.8), WOOD, { pos: [0, -0.2, 0] }),
    part(new BoxGeometry(0.94, 0.1, 0.84), WOOD_D, { pos: [0, 0.08, 0] }),
    part(new BoxGeometry(0.94, 0.08, 0.84), WOOD_D, { pos: [0, -0.46, 0] }),
    part(new BoxGeometry(0.14, 0.5, 0.86), WOOD_D, { pos: [0, -0.2, 0] }),
    part(new BoxGeometry(0.16, 0.34, 0.16), c, { pos: [0, up ? 0.36 : 0.56, 0] }),
    part(new ConeGeometry(0.26, 0.3, 4), c, { pos: [0, up ? 0.66 : 0.28, 0], rot: [up ? 0 : Math.PI, Math.PI / 4, 0] }),
  ];
}

export function buildUiIcon(name: UiIcon): BufferGeometry {
  let g: BufferGeometry[];
  switch (name) {
    case 'bag': // 가죽 배낭
      g = [
        part(new BoxGeometry(0.8, 0.86, 0.5), LEATHER, { pos: [0, -0.05, 0] }),
        part(new BoxGeometry(0.84, 0.36, 0.54), LEATHER_D, { pos: [0, 0.24, 0.02] }),
        part(new BoxGeometry(0.6, 0.32, 0.16), LEATHER_D, { pos: [0, -0.26, 0.3] }),
        part(new BoxGeometry(0.14, 0.14, 0.06), GOLD, { pos: [0, 0.1, 0.3] }),
        part(new TorusGeometry(0.2, 0.05, 5, 10, Math.PI), LEATHER_D, { pos: [0, 0.4, 0] }),
      ];
      break;
    case 'armor': // 가슴 갑옷
      g = [
        part(new BoxGeometry(0.8, 0.8, 0.42), 0x4a78d0, { pos: [0, -0.05, 0] }),
        part(new BoxGeometry(0.62, 0.5, 0.1), STEEL, { pos: [0, 0.02, 0.24] }),
        part(new SphereGeometry(0.24, 8, 6), STEEL_D, { pos: [0.5, 0.28, 0], scale: [1, 0.7, 1] }),
        part(new SphereGeometry(0.24, 8, 6), STEEL_D, { pos: [-0.5, 0.28, 0], scale: [1, 0.7, 1] }),
        part(new BoxGeometry(0.84, 0.12, 0.46), LEATHER_D, { pos: [0, -0.38, 0] }),
        part(new BoxGeometry(0.14, 0.12, 0.06), GOLD, { pos: [0, -0.38, 0.24] }),
        part(new OctahedronGeometry(0.1), 0x5ef0ff, { pos: [0, 0.08, 0.3] }),
      ];
      break;
    case 'hammer': // 망치 (건설)
      g = [
        part(new CylinderGeometry(0.06, 0.07, 1.1, 6), WOOD, { pos: [0.05, -0.1, 0], rot: [0, 0, 0.6] }),
        part(new BoxGeometry(0.62, 0.3, 0.3), STEEL_D, { pos: [-0.26, 0.34, 0], rot: [0, 0, 0.6] }),
        part(new BoxGeometry(0.1, 0.34, 0.34), STEEL, { pos: [-0.5, 0.18, 0], rot: [0, 0, 0.6] }),
        part(new BoxGeometry(0.12, 0.18, 0.12), LEATHER_D, { pos: [0.3, -0.5, 0], rot: [0, 0, 0.6] }),
      ];
      break;
    case 'book': // 레시피북
      g = [
        part(new BoxGeometry(0.84, 0.16, 1.0), 0x7a3a2a, { pos: [0, -0.08, 0] }),
        part(new BoxGeometry(0.76, 0.14, 0.94), 0xf2e6c8, { pos: [0.02, 0.06, 0] }),
        part(new BoxGeometry(0.84, 0.06, 1.0), 0x9a4a34, { pos: [0, 0.16, 0] }),
        part(new BoxGeometry(0.08, 0.26, 1.02), 0x5e2a1c, { pos: [-0.42, 0.04, 0] }),
        part(new OctahedronGeometry(0.12), GOLD, { pos: [0.05, 0.22, 0], scale: [1, 0.4, 1] }),
        part(new BoxGeometry(0.08, 0.02, 0.4), 0xff5a5a, { pos: [0.2, 0.2, 0.62], rot: [0.5, 0, 0] }),
      ];
      break;
    case 'portal': // 차원문 (워프)
      g = [
        part(new CylinderGeometry(0.4, 0.4, 0.06, 20), 0x8a5cff, { rot: [Math.PI / 2, 0, 0] }),
        part(new CylinderGeometry(0.26, 0.26, 0.08, 16), 0xc8a8ff, { rot: [Math.PI / 2, 0, 0] }),
        part(new CylinderGeometry(0.1, 0.1, 0.1, 10), 0xf4ecff, { rot: [Math.PI / 2, 0, 0] }),
        part(new TorusGeometry(0.46, 0.1, 6, 18), 0x6a6878),
        part(new TorusGeometry(0.46, 0.04, 4, 18), 0x5ef0ff, { pos: [0, 0, 0.07] }),
        part(new BoxGeometry(0.7, 0.12, 0.3), 0x6a6878, { pos: [0, -0.56, 0] }),
      ];
      break;
    case 'glove': // 장갑 낀 손 (상호작용)
      g = [
        part(new BoxGeometry(0.56, 0.5, 0.22), 0xe0b080, { pos: [0, -0.1, 0] }),
        ...[-0.2, -0.07, 0.07, 0.2].map((x, i) => part(new BoxGeometry(0.12, 0.38 + (i === 1 || i === 2 ? 0.08 : 0), 0.18), 0xf0c898, { pos: [x, 0.3 + (i === 1 || i === 2 ? 0.04 : 0), 0] })),
        part(new BoxGeometry(0.14, 0.32, 0.18), 0xf0c898, { pos: [-0.36, -0.02, 0.04], rot: [0, 0, 0.6] }),
        part(new BoxGeometry(0.6, 0.2, 0.26), LEATHER, { pos: [0, -0.42, 0] }),
        part(new BoxGeometry(0.62, 0.05, 0.28), GOLD, { pos: [0, -0.32, 0] }),
      ];
      break;
    case 'boot': // 날개 달린 장화 (구르기)
      g = [
        part(new BoxGeometry(0.34, 0.6, 0.36), LEATHER, { pos: [-0.1, 0.1, 0] }),
        part(new BoxGeometry(0.66, 0.26, 0.38), LEATHER, { pos: [0.06, -0.28, 0] }),
        part(new BoxGeometry(0.7, 0.08, 0.42), LEATHER_D, { pos: [0.06, -0.44, 0] }),
        part(new BoxGeometry(0.38, 0.1, 0.4), LEATHER_D, { pos: [-0.1, 0.38, 0] }),
        part(new BoxGeometry(0.44, 0.12, 0.04), 0xffffff, { pos: [-0.3, 0.3, 0.2], rot: [0, 0, 0.5] }),
        part(new BoxGeometry(0.36, 0.1, 0.04), 0xe8f4ff, { pos: [-0.3, 0.16, 0.2], rot: [0, 0, 0.3] }),
        part(new BoxGeometry(0.28, 0.08, 0.04), 0xd0e8ff, { pos: [-0.28, 0.04, 0.2], rot: [0, 0, 0.1] }),
      ];
      break;
    case 'crate_in':
      g = crate(false);
      break;
    case 'crate_out':
      g = crate(true);
      break;
    case 'scroll': // 두루마리 (패치노트)
      g = [
        part(new BoxGeometry(0.7, 0.9, 0.04), 0xf2e6c8),
        part(new CylinderGeometry(0.08, 0.08, 0.84, 8), 0xd8c49a, { pos: [0, 0.46, 0], rot: [0, 0, Math.PI / 2] }),
        part(new CylinderGeometry(0.08, 0.08, 0.84, 8), 0xd8c49a, { pos: [0, -0.46, 0], rot: [0, 0, Math.PI / 2] }),
        ...[0.22, 0.08, -0.06, -0.2].map((y, i) => part(new BoxGeometry(i === 3 ? 0.3 : 0.5, 0.04, 0.02), 0x6a4a34, { pos: [i === 3 ? -0.1 : 0, y, 0.03] })),
        part(new CylinderGeometry(0.1, 0.1, 0.04, 10), 0xd03a3a, { pos: [0.2, -0.28, 0.04], rot: [Math.PI / 2, 0, 0] }),
      ];
      break;
    case 'refresh': // 도는 화살표 두 개 (업데이트)
      g = [
        part(new TorusGeometry(0.4, 0.08, 5, 14, Math.PI * 0.8), 0x5ec8ff, { rot: [0, 0, 0.3] }),
        part(new ConeGeometry(0.16, 0.26, 4), 0x5ec8ff, { pos: [-0.36, 0.24, 0], rot: [0, 0, 0.5] }),
        part(new TorusGeometry(0.4, 0.08, 5, 14, Math.PI * 0.8), 0x7affb0, { rot: [0, 0, 0.3 + Math.PI] }),
        part(new ConeGeometry(0.16, 0.26, 4), 0x7affb0, { pos: [0.36, -0.24, 0], rot: [0, 0, 0.5 + Math.PI] }),
      ];
      break;
    case 'phone': // 휴대폰 (앱 설치)
      g = [
        part(new BoxGeometry(0.5, 0.9, 0.1), 0x2a2a3a),
        part(new BoxGeometry(0.42, 0.72, 0.02), 0x5ec8ff, { pos: [0, 0.02, 0.06] }),
        part(new BoxGeometry(0.16, 0.16, 0.02), 0xffd04a, { pos: [0, 0.08, 0.08] }),
        part(new ConeGeometry(0.1, 0.14, 4), 0xffffff, { pos: [0, -0.14, 0.08], rot: [Math.PI, Math.PI / 4, 0] }),
      ];
      break;
    case 'key': // 열쇠 (저장 코드 불러오기)
      g = [
        part(new TorusGeometry(0.2, 0.07, 6, 12), GOLD, { pos: [-0.3, 0.2, 0], rot: [0, 0, 0] }),
        part(new BoxGeometry(0.66, 0.1, 0.1), GOLD, { pos: [0.1, -0.06, 0], rot: [0, 0, -0.6] }),
        part(new BoxGeometry(0.1, 0.18, 0.08), GOLD, { pos: [0.28, -0.3, 0], rot: [0, 0, -0.6] }),
        part(new BoxGeometry(0.1, 0.14, 0.08), GOLD, { pos: [0.16, -0.2, 0], rot: [0, 0, -0.6] }),
        part(new OctahedronGeometry(0.08), 0x5ef0ff, { pos: [-0.3, 0.2, 0.06] }),
      ];
      break;
    case 'sparkle': // 마력 반짝임
      g = [
        part(new OctahedronGeometry(0.34), 0xb67cff, { scale: [0.6, 1.4, 0.6] }),
        part(new OctahedronGeometry(0.16), 0x5ef0ff, { pos: [0.34, 0.3, 0], scale: [0.6, 1.3, 0.6] }),
        part(new OctahedronGeometry(0.12), 0xffe070, { pos: [-0.32, -0.28, 0.1], scale: [0.6, 1.3, 0.6] }),
      ];
      break;
    case 'hourglass': // 모래시계 (시간)
      g = [
        part(new CylinderGeometry(0.34, 0.34, 0.08, 8), WOOD_D, { pos: [0, 0.46, 0] }),
        part(new CylinderGeometry(0.34, 0.34, 0.08, 8), WOOD_D, { pos: [0, -0.46, 0] }),
        part(new ConeGeometry(0.26, 0.4, 8), 0xcfefff, { pos: [0, 0.22, 0], rot: [Math.PI, 0, 0] }),
        part(new ConeGeometry(0.26, 0.4, 8), 0xcfefff, { pos: [0, -0.22, 0] }),
        part(new ConeGeometry(0.2, 0.22, 8), 0xf0c860, { pos: [0, -0.3, 0] }),
        part(new CylinderGeometry(0.04, 0.04, 0.9, 5), WOOD, { pos: [0.3, 0, 0.1] }),
        part(new CylinderGeometry(0.04, 0.04, 0.9, 5), WOOD, { pos: [-0.3, 0, -0.1] }),
      ];
      break;
    case 'target': // 과녁 (자동 조준)
      g = [
        part(new CylinderGeometry(0.46, 0.46, 0.06, 16), 0xffffff, { rot: [Math.PI / 2, 0, 0] }),
        part(new CylinderGeometry(0.34, 0.34, 0.08, 16), 0xff4a4a, { rot: [Math.PI / 2, 0, 0] }),
        part(new CylinderGeometry(0.2, 0.2, 0.1, 16), 0xffffff, { rot: [Math.PI / 2, 0, 0] }),
        part(new CylinderGeometry(0.09, 0.09, 0.12, 12), 0xff4a4a, { rot: [Math.PI / 2, 0, 0] }),
      ];
      break;
    case 'arrow': // 앞 방향 화살표
      g = [
        part(new BoxGeometry(0.56, 0.18, 0.14), 0x5ec8ff, { pos: [-0.14, 0, 0] }),
        part(new ConeGeometry(0.3, 0.4, 4), 0x5ec8ff, { pos: [0.3, 0, 0], rot: [0, 0, -Math.PI / 2], scale: [1, 1, 0.5] }),
      ];
      break;
    case 'music': // 음표
      g = [
        part(new SphereGeometry(0.16, 10, 8), 0xb67cff, { pos: [-0.26, -0.3, 0], scale: [1.2, 0.9, 0.8] }),
        part(new SphereGeometry(0.16, 10, 8), 0xb67cff, { pos: [0.26, -0.2, 0], scale: [1.2, 0.9, 0.8] }),
        part(new BoxGeometry(0.06, 0.66, 0.06), 0xb67cff, { pos: [-0.1, 0.02, 0] }),
        part(new BoxGeometry(0.06, 0.66, 0.06), 0xb67cff, { pos: [0.42, 0.12, 0] }),
        part(new BoxGeometry(0.58, 0.12, 0.08), 0xd8b0ff, { pos: [0.16, 0.38, 0], rot: [0, 0, 0.18] }),
      ];
      break;
    case 'speaker': // 스피커 (효과음)
      g = [
        part(new BoxGeometry(0.56, 0.8, 0.36), 0x3a3a4a, { pos: [-0.14, 0, 0] }),
        part(new CylinderGeometry(0.2, 0.2, 0.06, 14), 0x8a8aa0, { pos: [-0.14, -0.14, 0.18], rot: [Math.PI / 2, 0, 0] }),
        part(new CylinderGeometry(0.08, 0.08, 0.08, 10), 0x2a2a34, { pos: [-0.14, -0.14, 0.2], rot: [Math.PI / 2, 0, 0] }),
        part(new CylinderGeometry(0.09, 0.09, 0.06, 10), 0x8a8aa0, { pos: [-0.14, 0.22, 0.18], rot: [Math.PI / 2, 0, 0] }),
        part(new TorusGeometry(0.2, 0.035, 4, 10, 1.6), 0x5ec8ff, { pos: [0.18, 0, 0.1], rot: [0, 0, -0.8] }),
        part(new TorusGeometry(0.34, 0.035, 4, 12, 1.4), 0x5ec8ff, { pos: [0.18, 0, 0.1], rot: [0, 0, -0.7] }),
      ];
      break;
    case 'disk': // 저장 (디스크 모양 수정판)
      g = [
        part(new BoxGeometry(0.8, 0.8, 0.12), 0x3a5ab0),
        part(new BoxGeometry(0.44, 0.26, 0.04), 0xd8dce6, { pos: [0, 0.24, 0.07] }),
        part(new BoxGeometry(0.1, 0.18, 0.04), 0x3a5ab0, { pos: [0.1, 0.24, 0.09] }),
        part(new BoxGeometry(0.56, 0.3, 0.04), 0xf2f2f2, { pos: [0, -0.18, 0.07] }),
      ];
      break;
    case 'shield': // 방패 (장비 교체)
      g = [
        part(new CylinderGeometry(0.44, 0.44, 0.1, 8), 0x7a8494, { rot: [Math.PI / 2, 0, 0] }),
        part(new CylinderGeometry(0.34, 0.34, 0.12, 8), 0x3a78d8, { rot: [Math.PI / 2, 0, 0] }),
        part(new OctahedronGeometry(0.12), GOLD, { pos: [0, 0, 0.1] }),
      ];
      break;
    case 'skull': // 해골 (죽음)
      g = [
        part(new SphereGeometry(0.36, 10, 8), 0xeae4d8, { pos: [0, 0.08, 0] }),
        part(new BoxGeometry(0.4, 0.22, 0.34), 0xeae4d8, { pos: [0, -0.24, 0.02] }),
        part(new SphereGeometry(0.09, 8, 6), 0x2a1a2a, { pos: [-0.14, 0.06, 0.3] }),
        part(new SphereGeometry(0.09, 8, 6), 0x2a1a2a, { pos: [0.14, 0.06, 0.3] }),
        part(new ConeGeometry(0.05, 0.1, 3), 0x2a1a2a, { pos: [0, -0.08, 0.33], rot: [0, 0, Math.PI] }),
      ];
      break;
    case 'warning': // 경고 표지
    default:
      g = [
        part(new CylinderGeometry(0.02, 0.56, 0.9, 3), 0xffc83a, { rot: [0, 0, 0], scale: [1, 1, 0.25] }),
        part(new BoxGeometry(0.1, 0.34, 0.1), 0x2a2a2a, { pos: [0, -0.02, 0.16] }),
        part(new BoxGeometry(0.1, 0.1, 0.1), 0x2a2a2a, { pos: [0, -0.3, 0.16] }),
      ];
      break;
  }
  return merge(g);
}
