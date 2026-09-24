import {
  AdditiveBlending, AmbientLight, CircleGeometry, Color, DirectionalLight, DoubleSide, Group, IcosahedronGeometry, Mesh,
  MeshBasicMaterial, MeshLambertMaterial, OctahedronGeometry, PerspectiveCamera, PointLight, RingGeometry, Scene, TorusGeometry, WebGLRenderer,
} from 'three';
import { CLASSES } from '../../src/data/classes';
import { buildHero } from '../../src/models/hero';
import { TIER_METAL } from '../../src/models/items';

/**
 * 앱 아이콘 만들기: 차원의 틈새 앞에 선 검사를 3D로 그려 PNG로 뽑는다.
 * `node scripts/make-icons.mjs` 가 이 페이지를 열어 결과를 web/public 에 저장한다.
 */
const S = 1024;
const renderer = new WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1);
renderer.setSize(S, S, false);
renderer.setClearColor(0x000000, 0);

const scene = new Scene();
const mat = new MeshLambertMaterial({ vertexColors: true, flatShading: true });
scene.add(new AmbientLight(0xb8c0ff, 1.3));
const key = new DirectionalLight(0xffffff, 2.6);
key.position.set(2, 4, 5);
scene.add(key);
// 뒤쪽 틈새에서 나오는 보랏빛 역광
const rim = new PointLight(0xa070ff, 30, 12, 1.5);
rim.position.set(0, 1.6, -1.2);
scene.add(rim);
const rim2 = new PointLight(0x5ef0ff, 18, 10, 1.5);
rim2.position.set(-1.5, 2.2, -0.6);
scene.add(rim2);

// ---- 차원의 틈새 (뒤쪽 소용돌이 고리) ----
const rift = new Group();
rift.position.set(0, 1.45, -1.6);
scene.add(rift);
const glow = (color: number, opacity: number) =>
  new MeshBasicMaterial({ color, transparent: true, opacity, blending: AdditiveBlending, depthWrite: false, side: DoubleSide });
rift.add(new Mesh(new CircleGeometry(1.35, 48), glow(0x2a0f5a, 0.9)));
for (let i = 0; i < 7; i++) {
  const r = 0.35 + i * 0.16;
  const ring = new Mesh(new RingGeometry(r, r + 0.07, 48, 1, i * 0.9, Math.PI * 1.3), glow(i % 2 ? 0x8a5cff : 0x4ee6ff, 0.55 - i * 0.04));
  ring.position.z = 0.01 * i;
  rift.add(ring);
}
rift.add(new Mesh(new CircleGeometry(0.32, 32), glow(0xe8dcff, 0.9)));
const frame = new Mesh(new TorusGeometry(1.42, 0.09, 8, 64), new MeshLambertMaterial({ color: 0x5ef0ff, emissive: new Color(0x38c8ff), emissiveIntensity: 1.2 }));
rift.add(frame);
const frameOuter = new Mesh(new TorusGeometry(1.58, 0.04, 6, 64), glow(0xb08aff, 0.8));
rift.add(frameOuter);

// 떠다니는 차원 파편
const shard = new MeshLambertMaterial({ color: 0x9a7cff, emissive: new Color(0x5a3ad8), emissiveIntensity: 0.9, flatShading: true });
const shardC = new MeshLambertMaterial({ color: 0x7ff4ff, emissive: new Color(0x2ab0d8), emissiveIntensity: 0.9, flatShading: true });
for (const [x, y, z, s, m] of [
  [-1.35, 2.55, -0.4, 0.16, shardC], [1.4, 2.35, -0.6, 0.13, shard], [1.25, 0.55, 0.2, 0.1, shardC], [-1.25, 0.8, 0.1, 0.12, shard], [0.9, 2.95, -1, 0.08, shardC],
] as const) {
  const m2 = new Mesh(new OctahedronGeometry(s), m);
  m2.position.set(x, y, z);
  m2.scale.y = 1.6;
  m2.rotation.set(x, y, z);
  scene.add(m2);
}

// 발밑 빛 웅덩이
const pool = new Mesh(new CircleGeometry(1.1, 40), glow(0x6a4aff, 0.35));
pool.rotation.x = -Math.PI / 2;
pool.position.y = 0.01;
scene.add(pool);

// ---- 검사 ----
const look = CLASSES.sword.look;
const gold = TIER_METAL[2];
const rig = buildHero(mat, {
  ...look,
  shield: true,
  hat: 'none',
  gear: { weapon: { metal: 0xe8f4ff, gem: 0x5ef0ff }, helmet: { metal: gold, gem: 0x5ef0ff }, armor: { metal: gold, gem: 0xb67cff }, pants: 0x3a3f5a, boots: 0x6a4a30 },
});
scene.add(rig.root);
rig.root.rotation.y = 0.5;
// 검을 치켜든 자세
rig.armR.rotation.x = -2.7;
rig.armR.rotation.z = -0.15;
rig.weapon.rotation.x = -0.6;
rig.armL.rotation.x = 0.35;
rig.legL.rotation.x = 0.3;
rig.legR.rotation.x = -0.25;
rig.torso.rotation.y = -0.15;
// 검날 빛
for (const m of rig.gearMeshes.weapon) {
  const g = new Mesh(m.geometry, glow(0x7fe8ff, 0.35));
  g.scale.setScalar(1.12);
  m.add(g);
}

const camera = new PerspectiveCamera(30, 1, 0.1, 50);
camera.position.set(0.9, 1.9, 7.2);
camera.lookAt(0, 1.45, 0);

(window as unknown as { render: (opts: { maskable: boolean; size: number }) => string }).render = ({ maskable, size }) => {
  // 마스커블 아이콘은 가운데 80%만 보이므로 한 발 물러나서 찍는다
  camera.position.set(0.9, 1.9, maskable ? 8.6 : 7.2);
  camera.lookAt(0, 1.45, 0);
  renderer.render(scene, camera);

  const c = document.createElement('canvas');
  c.width = c.height = S;
  const x = c.getContext('2d')!;
  const bg = x.createRadialGradient(S / 2, S * 0.42, 0, S / 2, S * 0.5, S * 0.75);
  bg.addColorStop(0, '#3a1f78');
  bg.addColorStop(0.5, '#1a1040');
  bg.addColorStop(1, '#07060f');
  if (!maskable) {
    const r = S * 0.2;
    x.beginPath();
    x.roundRect(S * 0.02, S * 0.02, S * 0.96, S * 0.96, r);
    x.clip();
  }
  x.fillStyle = bg;
  x.fillRect(0, 0, S, S);
  // 별
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 90; i++) {
    x.fillStyle = `rgba(${200 + rnd() * 55},${200 + rnd() * 55},255,${0.25 + rnd() * 0.6})`;
    const s = 1 + rnd() * 3;
    x.fillRect(rnd() * S, rnd() * S, s, s);
  }
  // 블룸: 흐리게 한 사본을 더한다
  x.globalCompositeOperation = 'lighter';
  x.filter = 'blur(28px)';
  x.globalAlpha = 0.8;
  x.drawImage(renderer.domElement, 0, 0);
  x.filter = 'none';
  x.globalAlpha = 1;
  x.globalCompositeOperation = 'source-over';
  x.drawImage(renderer.domElement, 0, 0);
  // 가장자리 비네트
  const v = x.createRadialGradient(S / 2, S / 2, S * 0.35, S / 2, S / 2, S * 0.72);
  v.addColorStop(0, 'rgba(0,0,0,0)');
  v.addColorStop(1, 'rgba(0,0,0,0.55)');
  x.fillStyle = v;
  x.fillRect(0, 0, S, S);
  if (!maskable) {
    x.strokeStyle = 'rgba(160,130,255,0.55)';
    x.lineWidth = S * 0.012;
    x.beginPath();
    x.roundRect(S * 0.026, S * 0.026, S * 0.948, S * 0.948, S * 0.195);
    x.stroke();
  }

  const out = document.createElement('canvas');
  out.width = out.height = size;
  const o = out.getContext('2d')!;
  o.imageSmoothingQuality = 'high';
  o.drawImage(c, 0, 0, size, size);
  return out.toDataURL('image/png');
};
(window as unknown as { ready: boolean }).ready = true;
