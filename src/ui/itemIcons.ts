import { AmbientLight, BufferGeometry, DirectionalLight, Group, Mesh, MeshLambertMaterial, OrthographicCamera, Scene, Sphere, WebGLRenderer } from 'three';
import { CLASSES, type ClassId } from '../data/classes';
import type { Equip } from '../data/equipment';
import { buildHero, type HeroGear, type HeroLook } from '../models/hero';
import { buildEquipGeometry, buildItemGeometry, buildToolGeometry } from '../models/items';
import { buildSkillGeometry } from '../models/skills';
import { buildUiIcon, type UiIcon } from '../models/uiIcons';

/**
 * 아이템 모델을 한 번 그려서 이미지로 만들어 두는 아이콘 공장.
 * 작은 WebGL 캔버스 하나로 그리고 dataURL로 저장해 UI의 <img>에 쓴다.
 */
let renderer: WebGLRenderer | null = null;
let failed = false;
const scene = new Scene();
const camera = new OrthographicCamera(-1, 1, 1, -1, 0.1, 20);
const material = new MeshLambertMaterial({ vertexColors: true, flatShading: true });
const cache = new Map<string, string>();

scene.add(new AmbientLight(0xffffff, 1.6));
const sun = new DirectionalLight(0xffffff, 2.4);
sun.position.set(2, 4, 3);
scene.add(sun);

function getRenderer(w: number, h: number): WebGLRenderer | null {
  if (failed) return null;
  try {
    if (!renderer) {
      renderer = new WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
      renderer.setClearColor(0x000000, 0);
    }
    renderer.setPixelRatio(1);
    renderer.setSize(w, h, false);
    return renderer;
  } catch {
    failed = true;
    return null;
  }
}

/** 쿼터뷰 각도에서 물체가 꽉 차게 찍는다 */
function snap(obj: Group | Mesh, w: number, h: number, radius: number, cy: number): string {
  const r = getRenderer(w, h);
  if (!r) return '';
  const aspect = w / h;
  camera.left = -radius * aspect;
  camera.right = radius * aspect;
  camera.top = radius;
  camera.bottom = -radius;
  camera.position.set(3.2, cy + 3, 4.2);
  camera.lookAt(0, cy, 0);
  camera.updateProjectionMatrix();
  scene.add(obj);
  r.render(scene, camera);
  scene.remove(obj);
  return r.domElement.toDataURL('image/png');
}

function geoIcon(key: string, make: () => BufferGeometry): string {
  const hit = cache.get(key);
  if (hit !== undefined) return hit;
  const g = make();
  g.computeBoundingSphere();
  const s = g.boundingSphere ?? new Sphere();
  g.translate(-s.center.x, -s.center.y, -s.center.z);
  const url = snap(new Mesh(g, material), 96, 96, s.radius * 1.05, 0);
  g.dispose();
  cache.set(key, url);
  return url;
}

/** 화면 버튼·이름표용 3D 아이콘 */
export function uiIconUrl(name: UiIcon): string {
  return geoIcon(`u:${name}`, () => buildUiIcon(name));
}

/** 직업 기본 무기 (공격 버튼) */
export function weaponIconUrl(cls: ClassId): string {
  return geoIcon(`w:${cls}`, () => buildEquipGeometry({ uid: '', slot: 'weapon', cls, tier: 2, grade: 0, plus: 0 }));
}

export function itemIconUrl(id: string): string {
  return geoIcon(`i:${id}`, () => buildItemGeometry(id));
}

export function skillIconUrl(cls: ClassId, index: number): string {
  return geoIcon(`s:${cls}:${index}`, () => buildSkillGeometry(cls, index));
}

export function toolIconUrl(kind: 'pickaxe' | 'axe', tier: number): string {
  return geoIcon(`t:${kind}:${tier}`, () => buildToolGeometry(kind, tier));
}

export function equipIconUrl(e: Equip): string {
  return geoIcon(`e:${e.slot}:${e.cls ?? ''}:${e.tier}:${e.grade}`, () => buildEquipGeometry(e));
}

/** 대화창 초상화: 허리 위부터 크게 */
export function bustUrl(key: string, look: HeroLook): string {
  const k = `b:${key}`;
  const hit = cache.get(k);
  if (hit !== undefined) return hit;
  const rig = buildHero(material, look);
  rig.root.rotation.y = 0.45;
  const url = snap(rig.root, 200, 200, 0.62, 1.28);
  for (const m of rig.meshes) m.geometry.dispose();
  cache.set(k, url);
  return url;
}

/** 장비창 왼쪽에 서 있는 캐릭터 */
export function heroPortraitUrl(cls: ClassId, gear?: HeroGear): string {
  const key = `h:${cls}:${JSON.stringify(gear ?? {})}`;
  const hit = cache.get(key);
  if (hit !== undefined) return hit;
  const look = CLASSES[cls].look;
  const rig = buildHero(material, { ...look, shield: look.weapon === 'sword', hat: look.weapon === 'staff' ? 'wizard' : 'none', gear });
  rig.root.rotation.y = 0.35;
  const url = snap(rig.root, 180, 260, 1.05, 0.95);
  for (const m of rig.meshes) m.geometry.dispose();
  cache.set(key, url);
  return url;
}
