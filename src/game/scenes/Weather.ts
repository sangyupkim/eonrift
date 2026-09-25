import {
  AdditiveBlending,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  Color,
  DirectionalLight,
  DoubleSide,
  HemisphereLight,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  PointLight,
  Points,
  PointsMaterial,
  type Scene,
} from 'three';

/**
 * 차원마을의 날씨와 낮밤. 차원 공간이라 정해진 시간이 없다:
 * 몇 분마다 제멋대로 낮·해질녘·밤, 맑음·비·눈이 바뀐다. 밤에는 가로등과 창문에 불이 켜진다. (보기만 바뀌는 효과)
 */
export type TimeOfDay = 'day' | 'dusk' | 'night';
export type Sky = 'clear' | 'rain' | 'snow';

interface WeatherState {
  time: TimeOfDay;
  sky: Sky;
  /** 다음에 바뀌는 시각 (ms) */
  next: number;
}

/** 마을을 나갔다 와도 날씨가 이어지도록 모듈에 둔다 */
const state: WeatherState = { time: 'day', sky: 'clear', next: 0 };

const LOOK: Record<TimeOfDay, { bg: number; hemiSky: number; hemi: number; sun: number; sunColor: number }> = {
  day: { bg: 0x1c1a30, hemiSky: 0xffe8d0, hemi: 1.8, sun: 2.3, sunColor: 0xffe2b8 },
  dusk: { bg: 0x2e1a2c, hemiSky: 0xffb08a, hemi: 1.15, sun: 1.5, sunColor: 0xff9a5a },
  night: { bg: 0x05070f, hemiSky: 0x6a7ad8, hemi: 0.5, sun: 0.35, sunColor: 0x8aa0ff },
};

function roll(now: number): void {
  const r = Math.random();
  state.time = r < 0.45 ? 'day' : r < 0.65 ? 'dusk' : 'night';
  const s = Math.random();
  state.sky = s < 0.55 ? 'clear' : s < 0.8 ? 'rain' : 'snow';
  // 2~6분마다 바뀐다
  state.next = now + (120 + Math.random() * 240) * 1000;
}

export class VillageWeather {
  private night = 0;
  private rainK = 0;
  private snowK = 0;
  private bg = new Color();
  private readonly rain: LineSegments;
  private readonly snow: Points;
  private readonly rainPos: Float32Array;
  private readonly snowPos: Float32Array;
  private readonly glowMats: MeshBasicMaterial[] = [];
  private readonly lights: PointLight[] = [];
  private t = 0;
  private cx = 0;
  private cz = 0;

  constructor(
    private scene: Scene,
    private hemi: HemisphereLight,
    private sun: DirectionalLight,
    lamps: { x: number; z: number }[],
    windows: { x: number; z: number; y: number; rot: number }[],
  ) {
    const now = Date.now();
    if (now >= state.next) roll(now);
    // 들어오자마자 지금 날씨로 (서서히 바뀌는 건 도중에만)
    this.night = state.time === 'night' ? 1 : state.time === 'dusk' ? 0.35 : 0;
    this.rainK = state.sky === 'rain' ? 1 : 0;
    this.snowK = state.sky === 'snow' ? 1 : 0;

    // 가로등 불빛: 등 머리의 빛 + 가까운 몇 개에는 실제 조명
    const lampMat = new MeshBasicMaterial({ color: 0xffd88a, transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false });
    this.glowMats.push(lampMat);
    lamps.forEach((l, i) => {
      const m = new Mesh(new BoxGeometry(0.5, 0.55, 0.5), lampMat);
      m.position.set(l.x, 2.35, l.z);
      scene.add(m);
      if (i < 8) {
        const pl = new PointLight(0xffc870, 0, 9, 1.6);
        pl.position.set(l.x, 2.2, l.z);
        scene.add(pl);
        this.lights.push(pl);
      }
    });
    // 창문 불빛
    const winMat = new MeshBasicMaterial({ color: 0xffc86a, transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false, side: DoubleSide });
    this.glowMats.push(winMat);
    for (const w of windows) {
      const m = new Mesh(new PlaneGeometry(0.62, 0.56), winMat);
      m.position.set(w.x, w.y, w.z);
      m.rotation.y = w.rot;
      scene.add(m);
    }

    // 비: 짧은 선, 눈: 점. 플레이어 주변 상자 안에서 돈다
    const RN = 900;
    this.rainPos = new Float32Array(RN * 6);
    for (let i = 0; i < RN; i++) this.resetDrop(i, Math.random() * 16);
    const rg = new BufferGeometry();
    rg.setAttribute('position', new BufferAttribute(this.rainPos, 3));
    this.rain = new LineSegments(rg, new LineBasicMaterial({ color: 0xaac8ff, transparent: true, opacity: 0, depthWrite: false }));
    this.rain.frustumCulled = false;
    scene.add(this.rain);

    const SN = 700;
    this.snowPos = new Float32Array(SN * 3);
    for (let i = 0; i < SN; i++) {
      this.snowPos[i * 3] = (Math.random() - 0.5) * 48;
      this.snowPos[i * 3 + 1] = Math.random() * 16;
      this.snowPos[i * 3 + 2] = (Math.random() - 0.5) * 48;
    }
    const sg = new BufferGeometry();
    sg.setAttribute('position', new BufferAttribute(this.snowPos, 3));
    this.snow = new Points(sg, new PointsMaterial({ color: 0xffffff, size: 4, sizeAttenuation: false, transparent: true, opacity: 0, depthWrite: false }));
    this.snow.frustumCulled = false;
    scene.add(this.snow);
    this.apply();
  }

  /** 지금 날씨 (표시용) */
  get label(): string {
    const t = { day: '낮', dusk: '해질녘', night: '밤' }[state.time];
    const s = { clear: '맑음', rain: '비', snow: '눈' }[state.sky];
    return `${t} · ${s}`;
  }

  private resetDrop(i: number, y = 14 + Math.random() * 4): void {
    const x = this.cx + (Math.random() - 0.5) * 48;
    const z = this.cz + (Math.random() - 0.5) * 48;
    const p = this.rainPos;
    p[i * 6] = x;
    p[i * 6 + 1] = y;
    p[i * 6 + 2] = z;
    p[i * 6 + 3] = x - 0.08;
    p[i * 6 + 4] = y - 0.7;
    p[i * 6 + 5] = z + 0.05;
  }

  update(dt: number, focus: { x: number; z: number }): void {
    this.t += dt;
    this.cx = focus.x;
    this.cz = focus.z;
    const now = Date.now();
    if (now >= state.next) roll(now);
    // 8초쯤에 걸쳐 천천히 바뀐다
    const k = Math.min(1, dt * 0.15);
    const nightT = state.time === 'night' ? 1 : state.time === 'dusk' ? 0.35 : 0;
    this.night += (nightT - this.night) * k;
    this.rainK += ((state.sky === 'rain' ? 1 : 0) - this.rainK) * k;
    this.snowK += ((state.sky === 'snow' ? 1 : 0) - this.snowK) * k;
    this.apply();

    if (this.rainK > 0.02) {
      const p = this.rainPos;
      const n = p.length / 6;
      for (let i = 0; i < n; i++) {
        p[i * 6 + 1] -= dt * 26;
        p[i * 6 + 4] -= dt * 26;
        p[i * 6] -= dt * 1.2;
        p[i * 6 + 3] -= dt * 1.2;
        if (p[i * 6 + 4] < 0 || Math.abs(p[i * 6] - this.cx) > 26 || Math.abs(p[i * 6 + 2] - this.cz) > 26) this.resetDrop(i);
      }
      this.rain.geometry.attributes.position.needsUpdate = true;
    }
    if (this.snowK > 0.02) {
      const p = this.snowPos;
      const n = p.length / 3;
      for (let i = 0; i < n; i++) {
        p[i * 3 + 1] -= dt * 1.4;
        p[i * 3] += Math.sin(this.t * 0.8 + i) * dt * 0.4;
        if (p[i * 3 + 1] < 0) {
          p[i * 3 + 1] = 14 + Math.random() * 2;
          p[i * 3] = this.cx + (Math.random() - 0.5) * 48;
          p[i * 3 + 2] = this.cz + (Math.random() - 0.5) * 48;
        }
        // 플레이어를 따라 상자를 옮긴다
        if (p[i * 3] - this.cx > 24) p[i * 3] -= 48;
        if (p[i * 3] - this.cx < -24) p[i * 3] += 48;
        if (p[i * 3 + 2] - this.cz > 24) p[i * 3 + 2] -= 48;
        if (p[i * 3 + 2] - this.cz < -24) p[i * 3 + 2] += 48;
      }
      this.snow.geometry.attributes.position.needsUpdate = true;
    }
  }

  /** 낮밤·구름 정도를 빛과 하늘색에 반영 */
  private apply(): void {
    const n = this.night;
    const day = LOOK.day;
    const night = LOOK.night;
    const dusk = LOOK.dusk;
    // 낮 → 해질녘(0.35) → 밤(1) 사이를 섞는다
    const a = n < 0.35 ? day : dusk;
    const b = n < 0.35 ? dusk : night;
    const t = n < 0.35 ? n / 0.35 : (n - 0.35) / 0.65;
    const mix = (x: number, y: number) => x + (y - x) * t;
    const cloud = 1 - this.rainK * 0.3 - this.snowK * 0.12;
    this.hemi.intensity = mix(a.hemi, b.hemi) * cloud;
    this.sun.intensity = mix(a.sun, b.sun) * (1 - this.rainK * 0.5 - this.snowK * 0.3);
    this.hemi.color.set(a.hemiSky).lerp(new Color(b.hemiSky), t);
    this.sun.color.set(a.sunColor).lerp(new Color(b.sunColor), t);
    this.bg.set(a.bg).lerp(new Color(b.bg), t);
    if (this.rainK > 0) this.bg.lerp(new Color(0x2a2e3a), this.rainK * 0.4 * (1 - n));
    this.scene.background = this.bg;
    // 해질녘부터 불이 들어온다
    const lit = Math.max(0, Math.min(1, (n - 0.2) / 0.6));
    this.glowMats[0].opacity = lit * 0.75;
    this.glowMats[1].opacity = lit * 0.85;
    for (const l of this.lights) l.intensity = lit * 14;
    (this.rain.material as LineBasicMaterial).opacity = this.rainK * 0.55;
    (this.snow.material as PointsMaterial).opacity = this.snowK * 0.9;
  }
}

/** 개발용: 날씨를 바로 정한다 */
export function setWeather(time: TimeOfDay, sky: Sky): void {
  state.time = time;
  state.sky = sky;
  state.next = Date.now() + 10 * 60 * 1000;
}
