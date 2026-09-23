import { AmbientLight, DirectionalLight, Mesh, MeshLambertMaterial, OrthographicCamera, Scene, WebGLRenderer } from 'three';
import type { BuildingType } from '../data/factory';
import { buildBuildingGeometry } from '../models/factory';

const cache = new Map<string, string>();
let renderer: WebGLRenderer | null = null;

/** 건물 모델을 쿼터뷰로 찍은 작은 이미지 (건설 도구 아이콘) */
export function buildingThumb(type: BuildingType): string {
  const hit = cache.get(type);
  if (hit) return hit;
  try {
    const size = 96;
    renderer ??= new WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true });
    renderer.setSize(size, size, false);
    renderer.setPixelRatio(1);
    renderer.setClearColor(0x000000, 0);
    const scene = new Scene();
    scene.add(new AmbientLight(0xffffff, 1.4));
    const sun = new DirectionalLight(0xffffff, 2.2);
    sun.position.set(-3, 6, 4);
    scene.add(sun);
    const geo = buildBuildingGeometry(type, type === 'wire' ? [true, false, true, false] : undefined);
    const mesh = new Mesh(geo, new MeshLambertMaterial({ vertexColors: true, flatShading: true }));
    scene.add(mesh);
    const cam = new OrthographicCamera(-1.6, 1.6, 1.6, -1.6, 0.1, 50);
    cam.position.set(6, 6.5, 6);
    cam.lookAt(0, 0.7, 0);
    renderer.render(scene, cam);
    const url = renderer.domElement.toDataURL();
    geo.dispose();
    (mesh.material as MeshLambertMaterial).dispose();
    cache.set(type, url);
    return url;
  } catch {
    return '';
  }
}
