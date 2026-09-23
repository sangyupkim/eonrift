import { OrthographicCamera, PCFShadowMap, Vector3, WebGLRenderer } from 'three';
import { BAG_SLOTS, CAMERA_OFFSET, PLAYER, VIEW_HEIGHT } from '../config';
import { Input } from '../core/input';
import { randomSeed } from '../core/rng';
import { ITEMS } from '../data/items';
import { moveWithCollision } from '../dungeon/collision';
import { generateDungeon, isFloor } from '../dungeon/generator';
import { Hud } from '../ui/hud';
import { Minimap } from '../ui/minimap';
import { Screens } from '../ui/screens';
import { Bag } from './Bag';
import { DungeonScene, type NodeInstance } from './DungeonScene';
import { Player } from './Player';

type Mode = 'title' | 'select' | 'play' | 'paused' | 'bag' | 'result';

const hex = (c: number) => `#${c.toString(16).padStart(6, '0')}`;

export class Game {
  private renderer: WebGLRenderer;
  private camera: OrthographicCamera;
  private camTarget = new Vector3();
  private input: Input;
  private hud: Hud;
  private screens: Screens;
  private bag = new Bag(BAG_SLOTS);

  private dungeon!: DungeonScene;
  private player!: Player;
  private minimap!: Minimap;
  private mode: Mode = 'title';
  private tier = 1;
  private runTime = 0;
  private hitStop = 0;
  private shake = 0;
  private lastTime = 0;
  private minimapTimer = 0;
  private shadows = true;
  private nearExit = false;

  constructor(private container: HTMLElement) {
    this.renderer = new WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFShadowMap;
    container.appendChild(this.renderer.domElement);

    this.camera = new OrthographicCamera(-1, 1, 1, -1, 0.1, 200);
    this.input = new Input(this.renderer.domElement);
    this.hud = new Hud(container, this.input);
    this.screens = new Screens(container);

    window.addEventListener('resize', () => this.resize());
    // 화면 회전 직후에는 크기가 늦게 바뀌는 기기가 있다
    window.addEventListener('orientationchange', () => setTimeout(() => this.resize(), 250));
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.mode === 'play') this.openPause();
    });

    // 타이틀 뒤에도 던전이 보이도록 하나 만들어 둔다
    this.loadDungeon(1, randomSeed());
    this.resize();
    this.hud.setVisible(false);
    this.screens.title(() => {
      requestFullscreenLandscape();
      this.openSelect();
    });

    this.lastTime = performance.now();
    this.renderer.setAnimationLoop((t) => this.frame(t));
  }

  private resize(): void {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.renderer.setSize(w, h);
    const aspect = w / h;
    // 세로 화면(데스크톱 창을 좁힌 경우)에서도 너무 가깝지 않게 가로 폭 기준으로 맞춘다
    const viewH = aspect >= 1 ? VIEW_HEIGHT : (VIEW_HEIGHT * 1.6) / aspect;
    this.camera.top = viewH / 2;
    this.camera.bottom = -viewH / 2;
    this.camera.left = (-viewH * aspect) / 2;
    this.camera.right = (viewH * aspect) / 2;
    this.camera.updateProjectionMatrix();
    this.hud.joystick.reset();
  }

  private loadDungeon(tier: number, seed: number): void {
    if (this.dungeon) this.dungeon.dispose();
    this.tier = tier;
    const data = generateDungeon(seed, tier);
    this.dungeon = new DungeonScene(data);
    this.player = new Player(this.dungeon.heroMaterial);
    this.player.onAttackHit = () => this.resolveAttack();
    this.dungeon.scene.add(this.player.rig.root);
    const start = this.dungeon.playerStart;
    // 입구 차원문을 등지고 안쪽(화면 아래쪽)을 바라본다
    this.player.facing = Math.PI / 4;
    this.player.setPosition(start.x, start.z);
    this.camTarget.set(start.x, 0, start.z);

    this.minimap = new Minimap(data);
    this.hud.setMinimap(this.minimap.canvas);
    this.hud.setTier(tier, this.dungeon.theme.name, this.dungeon.theme.portalColor);
    this.setShadows(this.shadows);
    this.bag.clear();
    this.hud.setBagCount(0, BAG_SLOTS);
    this.runTime = 0;
  }

  private setShadows(on: boolean): void {
    this.shadows = on;
    this.dungeon.sun.castShadow = on;
  }

  private openSelect(): void {
    this.mode = 'select';
    this.hud.setVisible(false);
    this.screens.tierSelect((tier) => this.enterDungeon(tier));
  }

  private enterDungeon(tier: number): void {
    this.loadDungeon(tier, randomSeed());
    this.screens.close();
    this.mode = 'play';
    this.hud.setVisible(true);
    this.input.clearPressed();
    this.hud.toast(`${tier}단계 · ${this.dungeon.theme.name}`);
  }

  private openPause(): void {
    this.mode = 'paused';
    this.hud.setVisible(false);
    this.screens.pause({
      seed: this.dungeon.data.seed,
      shadows: this.shadows,
      onResume: () => this.resume(),
      onRegenerate: () => this.enterDungeon(this.tier),
      onLeave: () => this.openSelect(),
      onToggleShadows: (on) => this.setShadows(on),
    });
  }

  private openBag(): void {
    this.mode = 'bag';
    this.hud.setVisible(false);
    this.screens.bag(this.bag, () => this.resume());
  }

  private resume(): void {
    this.screens.close();
    this.mode = 'play';
    this.hud.setVisible(true);
    this.input.clearPressed();
  }

  private finishRun(): void {
    this.mode = 'result';
    this.hud.setVisible(false);
    let explored = 0;
    let total = 0;
    const d = this.dungeon.data;
    for (let y = 0; y < d.height; y++) {
      for (let x = 0; x < d.width; x++) {
        if (!isFloor(d, x, y)) continue;
        total++;
        if (this.minimap.isExplored(x, y)) explored++;
      }
    }
    this.screens.result({ items: this.bag.totals(), seconds: this.runTime, explored: explored / total }, () => this.openSelect());
  }

  private frame(now: number): void {
    const dt = Math.min(0.05, (now - this.lastTime) / 1000);
    this.lastTime = now;

    if (this.mode === 'play') this.update(dt);
    else if (this.mode === 'paused' || this.mode === 'bag') {
      // 같은 키로 다시 닫는다 (Esc: 메뉴, I: 가방)
      const closeKey = this.mode === 'paused' ? 'pause' : 'bag';
      if (this.input.consume(closeKey) || (this.mode === 'bag' && this.input.consume('pause'))) this.resume();
    } else if (this.mode === 'title' || this.mode === 'select') this.idleCamera(dt);

    this.updateCamera(dt);
    this.renderer.render(this.dungeon.scene, this.camera);
  }

  /** 타이틀·선택 화면 뒤에서 카메라가 천천히 떠돈다 */
  private idleCamera(dt: number): void {
    this.dungeon.update(dt, this.player.position);
    this.player.update(dt, { move: { x: 0, y: 0 }, applyMove: () => {} });
  }

  private update(dt: number): void {
    const input = this.input;
    if (input.consume('pause')) return this.openPause();
    if (input.consume('bag')) return this.openBag();

    // 타격 순간 아주 짧게 멈춘다 (히트스탑)
    if (this.hitStop > 0) {
      this.hitStop -= dt;
      input.consume('dodge');
      return;
    }

    this.runTime += dt;
    const move = input.getMove();
    const exit = this.dungeon.portals.find((p) => p.kind === 'exit')!;
    this.nearExit = Math.hypot(exit.x - this.player.position.x, exit.z - this.player.position.z) < PLAYER.interactRange + 1.15;
    this.hud.setInteract(this.nearExit ? '귀환' : null);

    const attackPressed = input.consume('attack');
    const interactPressed = input.consume('interact');
    if (this.nearExit && (attackPressed || interactPressed)) return this.finishRun();

    if (input.consume('dodge')) this.player.startRoll(move);
    for (const s of ['skill1', 'skill2', 'skill3'] as const) {
      if (input.consume(s)) this.hud.toast('스킬은 전투 시스템(M3)에서 열립니다');
    }
    if ((attackPressed || input.attackHeld) && !this.nearExit && this.player.canAct) {
      const target = this.findTarget(PLAYER.autoAimRange);
      const angle = target ? Math.atan2(target.x - this.player.position.x, target.z - this.player.position.z) : null;
      this.player.startAttack(angle);
    }

    const { dungeon, player } = this;
    player.update(dt, {
      move,
      applyMove: (dx, dz) => moveWithCollision(dungeon.data, player.position, dx, dz, PLAYER.radius, dungeon.obstacles),
    });
    dungeon.update(dt, player.position);

    this.hud.setDodgeCooldown(player.rollReady / (PLAYER.rollCooldown + PLAYER.rollTime));

    this.minimap.reveal(player.position.x, player.position.z);
    this.minimapTimer -= dt;
    if (this.minimapTimer <= 0) {
      this.minimapTimer = 0.1;
      const markers = dungeon.nodes
        .filter((n) => n.alive)
        .map((n) => ({ x: n.x, z: n.z, color: hex(n.def.accentColor), size: 0.45 }));
      markers.push({ x: exit.x, z: exit.z, color: hex(dungeon.theme.portalColor), size: 1.1 });
      this.minimap.draw({ ...player.position, facing: player.facing }, markers);
    }
  }

  /** 자동 조준: 가까운 채집물 중 가장 가까운 것 */
  private findTarget(range: number): NodeInstance | null {
    let best: NodeInstance | null = null;
    let bestD = range;
    for (const n of this.dungeon.nodes) {
      if (!n.alive || n.dying > 0) continue;
      const d = Math.hypot(n.x - this.player.position.x, n.z - this.player.position.z) - n.def.radius;
      if (d < bestD) {
        bestD = d;
        best = n;
      }
    }
    return best;
  }

  /** 휘두르기 판정: 앞쪽 부채꼴 안의 채집물을 친다 */
  private resolveAttack(): void {
    const p = this.player.position;
    const fx = Math.sin(this.player.facing);
    const fz = Math.cos(this.player.facing);
    let hitAny = false;
    let offset = 0;
    for (const n of this.dungeon.nodes) {
      if (!n.alive || n.dying > 0) continue;
      const dx = n.x - p.x;
      const dz = n.z - p.z;
      const d = Math.hypot(dx, dz);
      if (d - n.def.radius > PLAYER.attackRange) continue;
      if (d > 0.01 && (dx * fx + dz * fz) / d < Math.cos(1.2)) continue;
      hitAny = true;
      for (const drop of this.dungeon.hitNode(n)) {
        const added = this.bag.add(drop.itemId, drop.count);
        const item = ITEMS[drop.itemId];
        const screen = this.toScreen(n.x, 1.6, n.z);
        if (added > 0) this.hud.floatText(screen.x, screen.y - offset * 22, `+${added} ${item.name}`, hex(item.color));
        if (added < drop.count) this.hud.toast('가방이 가득 찼습니다');
        offset++;
      }
    }
    if (hitAny) {
      this.hitStop = 0.045;
      this.shake = 0.18;
      const used = this.bag.slots.filter(Boolean).length;
      this.hud.setBagCount(used, BAG_SLOTS);
    }
  }

  private toScreen(x: number, y: number, z: number): { x: number; y: number } {
    const v = new Vector3(x, y, z).project(this.camera);
    return {
      x: ((v.x + 1) / 2) * this.container.clientWidth,
      y: ((1 - v.y) / 2) * this.container.clientHeight,
    };
  }

  private updateCamera(dt: number): void {
    const p = this.player.position;
    const k = 1 - Math.exp(-dt * 7);
    this.camTarget.x += (p.x - this.camTarget.x) * k;
    this.camTarget.z += (p.z - this.camTarget.z) * k;
    this.shake = Math.max(0, this.shake - dt);
    const s = this.shake * 0.6;
    const sx = (Math.random() - 0.5) * s;
    const sz = (Math.random() - 0.5) * s;
    this.camera.position.set(this.camTarget.x + CAMERA_OFFSET.x + sx, CAMERA_OFFSET.y, this.camTarget.z + CAMERA_OFFSET.z + sz);
    this.camera.lookAt(this.camTarget.x + sx, 0, this.camTarget.z + sz);
  }
}

/** 모바일에서 전체 화면 + 가로 고정을 시도한다 (지원하지 않는 브라우저는 조용히 넘어간다) */
function requestFullscreenLandscape(): void {
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  if (!coarse) return;
  const el = document.documentElement;
  el.requestFullscreen?.()
    .then(() => (screen.orientation as ScreenOrientation & { lock?: (o: string) => Promise<void> }).lock?.('landscape'))
    .catch(() => {});
}
