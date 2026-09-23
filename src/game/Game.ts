import { MeshLambertMaterial, OrthographicCamera, PCFShadowMap, Plane, Raycaster, Vector2, Vector3, WebGLRenderer } from 'three';
import { BAG_SLOTS, CAMERA_OFFSET, PLAYER, TILE, VIEW_HEIGHT } from '../config';
import { Audio } from '../core/audio';
import { Input } from '../core/input';
import { Rng, randomSeed } from '../core/rng';
import { CLASSES, expToNext, type ClassId } from '../data/classes';
import { equipName, GRADES, rollEquip } from '../data/equipment';
import { BUILDINGS, FACTORY_SIZES, OFFLINE_CAP_HOURS, type BuildingType } from '../data/factory';
import { ITEMS } from '../data/items';
import { moveWithCollision } from '../dungeon/collision';
import { generateDungeon, isFloor } from '../dungeon/generator';
import { Factory, type Dir } from '../factory/sim';
import { BuildBar } from '../ui/buildbar';
import { Dialogue } from '../ui/dialogue';
import { Hud } from '../ui/hud';
import { Minimap } from '../ui/minimap';
import { hex, Screens } from '../ui/screens';
import { Bag } from './Bag';
import { Combat } from './Combat';
import type { Monster } from './Monster';
import { Player } from './Player';
import { DIM_BAG_MAX, deleteSave, hasSave, loadSave, newSave, Progress, type SaveData } from './Progress';
import { hasNews, objective, resetForNewCycle, scriptFor } from './Story';
import { DungeonScene, type NodeInstance } from './scenes/DungeonScene';
import { HomeScene } from './scenes/HomeScene';
import type { Interactable, Level } from './scenes/Level';
import { NPCS, VillageScene, type NpcId, type VillageSpot } from './scenes/VillageScene';

type Mode = 'title' | 'play' | 'menu' | 'dialogue' | 'dead';

interface Run {
  tier: number;
  bag: Bag;
  dimBag: Bag;
  gold: number;
  exp: number;
  time: number;
}

const ESSENCE = (tier: number) => (tier <= 3 ? 'essence_low' : tier <= 5 ? 'essence_mid' : 'essence_high');
const NPC_IDS = new Set<string>(NPCS.map((n) => n.id));

export class Game {
  private renderer: WebGLRenderer;
  private camera: OrthographicCamera;
  private camTarget = new Vector3();
  private input: Input;
  private hud: Hud;
  private screens: Screens;
  private dialogue: Dialogue;
  private buildBar: BuildBar;
  private audio = new Audio();
  private fadeEl: HTMLDivElement;

  private progress!: Progress;
  private factory!: Factory;
  private level!: Level;
  private player!: Player;
  private playerMaterial = new MeshLambertMaterial({ vertexColors: true, flatShading: true });
  private combat!: Combat;
  private minimap: Minimap | null = null;
  private run: Run | null = null;
  private mode: Mode = 'title';
  private building = false;
  private hitStopT = 0;
  private shakeT = 0;
  private lastTime = 0;
  private saveTimer = 0;
  private minimapTimer = 0;
  private factoryAcc = 0;
  private potionCd = 0;
  private deadTimer = 0;
  private pendingNgPlus = false;
  private raycaster = new Raycaster();
  private ground = new Plane(new Vector3(0, 1, 0), 0);
  private dragCell: { x: number; y: number } | null = null;

  constructor(private container: HTMLElement) {
    this.renderer = new WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFShadowMap;
    container.appendChild(this.renderer.domElement);

    this.camera = new OrthographicCamera(-1, 1, 1, -1, 0.1, 200);
    this.input = new Input(this.renderer.domElement);
    const click = () => this.audio.play('click');
    this.hud = new Hud(container, this.input, () => this.audio.unlock());
    this.buildBar = new BuildBar(container, {
      onDone: () => this.setBuilding(false),
      onExpand: () => this.openExpand(),
      onChange: () => {},
      click,
    });
    this.screens = new Screens(container, click);
    this.dialogue = new Dialogue(container, {
      set: (flag, v) => this.progress.setFlag(flag, v),
      run: (cmd) => this.runCommand(cmd),
      shake: () => (this.shakeT = 0.6),
      click,
    });
    this.fadeEl = document.createElement('div');
    this.fadeEl.className = 'scene-fade';
    container.appendChild(this.fadeEl);

    window.addEventListener('resize', () => this.resize());
    window.addEventListener('orientationchange', () => setTimeout(() => this.resize(), 250));
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.saveNow();
        if (this.mode === 'play') this.openPause();
      }
    });
    window.addEventListener('pagehide', () => this.saveNow());
    window.addEventListener('pointerdown', () => this.audio.unlock(), { capture: true });
    this.setupBuildPointer();

    // 타이틀 뒤 배경으로 쓸 던전
    this.progress = new Progress(newSave());
    this.factory = new Factory(this.progress.data.factory, 8);
    this.enterDungeon(1, true);
    this.resize();
    this.showTitle();

    this.lastTime = performance.now();
    this.renderer.setAnimationLoop((t) => this.frame(t));
  }

  // =============== 시작 / 저장 ===============
  private showTitle(): void {
    this.mode = 'title';
    this.hud.setVisible(false);
    this.screens.title(
      hasSave(),
      () => this.startGame(newSave(), true),
      () => {
        const data = loadSave();
        this.startGame(data ?? newSave(), !data);
      },
    );
  }

  private startGame(data: SaveData, isNew: boolean): void {
    requestFullscreenLandscape();
    this.audio.unlock();
    if (isNew) deleteSave();
    this.progress = new Progress(data);
    this.audio.setEnabled(data.settings.sound);
    this.factory = new Factory(data.factory, this.progress.factorySize);
    this.factory.onOutput = (item) => this.progress.add(item, 1);
    this.screens.close();
    const offline = isNew ? 0 : Math.min(OFFLINE_CAP_HOURS * 3600, (Date.now() - data.lastSaved) / 1000);
    this.mode = 'play';
    this.enterVillage('start');
    if (isNew) {
      this.saveNow();
      this.playScript('prologue');
    } else if (offline > 60 && this.progress.flag('home') && data.factory.buildings.length) {
      const before = { ...data.storage };
      this.factory.simulate(offline, this.progress);
      const produced = new Map<string, number>();
      for (const [id, n] of Object.entries(data.storage)) if (n > (before[id] ?? 0)) produced.set(id, n - (before[id] ?? 0));
      this.openMenu(() => this.screens.offlineReward(offline, produced, () => this.resume()));
      this.saveNow();
    }
  }

  private saveNow(): void {
    if (this.mode === 'title') return;
    this.progress.save();
  }

  // =============== 장면 전환 ===============
  private resize(): void {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.renderer.setSize(w, h);
    const aspect = w / h;
    const viewH = aspect >= 1 ? VIEW_HEIGHT : (VIEW_HEIGHT * 1.6) / aspect;
    this.camera.top = viewH / 2;
    this.camera.bottom = -viewH / 2;
    this.camera.left = (-viewH * aspect) / 2;
    this.camera.right = (viewH * aspect) / 2;
    this.camera.updateProjectionMatrix();
    this.hud.joystick.reset();
    if (this.building) this.fitBuildCamera();
  }

  private fade(): void {
    this.fadeEl.classList.remove('go');
    void this.fadeEl.offsetWidth;
    this.fadeEl.classList.add('go');
  }

  private loadLevel(level: Level): void {
    if (this.level) this.level.dispose();
    this.level = level;
    this.buildMode(false);
    this.makePlayer(level.playerStart.x, level.playerStart.z, level.playerStart.facing);
    this.camTarget.set(level.playerStart.x, 0, level.playerStart.z);
    level.sun.castShadow = this.progress.data.settings.shadows;
    this.hud.setMode(level.kind);
    this.hud.setBoss(null);
    this.minimap = null;
    this.hud.setMinimap(null);
    this.fade();
  }

  private makePlayer(x: number, z: number, facing: number): void {
    if (this.player) this.player.rig.root.parent?.remove(this.player.rig.root);
    const cls = CLASSES[this.progress.data.currentClass];
    this.player = new Player(this.playerMaterial, cls);
    this.player.facing = facing;
    this.player.setPosition(x, z);
    const st = this.progress.stats();
    this.player.maxHp = this.player.hp = st.maxHp;
    this.player.maxMp = this.player.mp = st.maxMp;
    this.level.scene.add(this.player.rig.root);
    this.combat = new Combat({
      player: this.player,
      stats: () => this.progress.stats(),
      level: () => this.level,
      dungeon: () => (this.level instanceof DungeonScene && this.run ? this.level : null),
      damageMonster: (m, mult, knock, fx, fz) => this.damageMonster(m, mult, knock, fx, fz),
      gather: (n) => this.gather(n),
      shake: (a) => (this.shakeT = Math.max(this.shakeT, a)),
      hitStop: (t) => (this.hitStopT = Math.max(this.hitStopT, t)),
      sfx: (n) => this.audio.play(n),
    });
    this.hud.setClass(cls.short, hex(cls.look.tunic), cls.skills.map((s) => s.name));
  }

  private enterVillage(arrival: 'portal' | 'home' | 'start'): void {
    const p = this.progress;
    const village = new VillageScene(
      (spot) => this.interactVillage(spot),
      (id) => id !== 'stranger' || p.stoneCount >= 4,
      p.flag('home') > 0,
      arrival,
    );
    this.loadLevel(village);
    this.run = null;
    this.hud.setLocation(p.data.ngPlus ? `차원마을 · ${p.data.ngPlus + 1}회차` : '차원마을', 0xffd88a);
    this.audio.playMusic('village');
    // 차원가방 확장 키트는 창고에 들어오면 바로 쓴다
    let grown = 0;
    while (p.count('bag_kit') > 0 && p.data.dimBag.length < DIM_BAG_MAX) {
      p.take('bag_kit', 1);
      p.data.dimBag.push(null);
      grown++;
    }
    if (grown) this.hud.toast(`차원가방이 ${p.data.dimBag.length}칸으로 늘어났습니다`, 3000);
    if (this.mode !== 'dialogue') this.mode = 'play';
    this.hud.setVisible(this.mode === 'play');
    this.refreshHud();
  }

  private enterDungeon(tier: number, background = false): void {
    const data = generateDungeon(randomSeed(), tier);
    const dungeon = new DungeonScene(data, this.progress.data.ngPlus, {
      player: () => this.player.position,
      cameraQuat: () => this.camera.quaternion,
      hurtPlayer: (d, x, z) => this.hurtPlayer(d, x, z),
      monsterKilled: (m) => this.monsterKilled(m),
      monsterHitByProjectile: (m, proj) => this.combat.projectileHit(m, proj),
      exit: () => this.finishRun('clear'),
      shake: (a) => (this.shakeT = Math.max(this.shakeT, a)),
    });
    this.loadLevel(dungeon);
    if (background) return;
    const dim = new Bag(this.progress.data.dimBag.length, this.progress.data.dimBag);
    this.run = { tier, bag: new Bag(BAG_SLOTS), dimBag: dim, gold: 0, exp: 0, time: 0 };
    this.minimap = new Minimap(data);
    this.hud.setMinimap(this.minimap.canvas);
    this.hud.setLocation(`${tier}단계 · ${dungeon.theme.name}`, dungeon.theme.portalColor);
    this.audio.playMusic('dungeon');
    this.audio.play('portal');
    this.mode = 'play';
    this.hud.setVisible(true);
    this.hud.toast(`${tier}단계 · ${dungeon.theme.name} — 끝의 수호자를 쓰러뜨리면 귀환 차원문이 열립니다`, 3500);
    this.refreshHud();
  }

  private enterHome(): void {
    this.factory.size = this.progress.factorySize;
    const home = new HomeScene(this.factory, () => {
      this.saveNow();
      this.enterVillage('home');
    });
    this.loadLevel(home);
    this.hud.setLocation(`차원집 · ${this.factory.size}×${this.factory.size}`, 0xc28cff);
    this.audio.playMusic('home');
    this.audio.play('portal');
    this.mode = 'play';
    this.hud.setVisible(true);
    this.refreshHud();
    if (!this.progress.flag('homeTutorial')) {
      this.progress.setFlag('homeTutorial');
      this.hud.toast('오른쪽 위 망치 버튼(B 키)으로 건설 모드를 엽니다', 4000);
    }
  }

  // =============== 메뉴 ===============
  private openMenu(open: () => void, onClosed?: () => void): void {
    this.mode = 'menu';
    this.hud.setVisible(false);
    this.buildBar.hide();
    open();
    if (onClosed) this.afterMenu = onClosed;
  }

  private afterMenu: (() => void) | null = null;

  private resume(): void {
    this.mode = 'play';
    this.hud.setVisible(true);
    if (this.building) this.buildBar.show((t) => this.buildingUnlocked(t));
    this.input.clearPressed();
    this.refreshHud();
    this.saveNow();
    const cb = this.afterMenu;
    this.afterMenu = null;
    cb?.();
  }

  private openPause(): void {
    const d = this.progress.data;
    this.openMenu(() =>
      this.screens.pause({
        inDungeon: this.level instanceof DungeonScene && !!this.run,
        seed: this.level instanceof DungeonScene ? this.level.grid.seed : undefined,
        returnStones: this.progress.count('return_stone'),
        shadows: d.settings.shadows,
        sound: d.settings.sound,
        onReturnStone: () => {
          if (!this.progress.take('return_stone', 1)) return;
          this.finishRun('return');
        },
        onGiveUp: () => this.fall(),
        onToggleShadows: (on) => {
          d.settings.shadows = on;
          this.level.sun.castShadow = on;
        },
        onToggleSound: (on) => {
          d.settings.sound = on;
          this.audio.setEnabled(on);
        },
        onTitle: () => {
          this.saveNow();
          this.run = null;
          this.enterDungeon(1, true);
          this.showTitle();
        },
        onClose: () => this.resume(),
      }),
    );
  }

  private openBagOrInventory(): void {
    if (this.run) {
      const run = this.run;
      this.openMenu(() =>
        this.screens.bag(
          run.bag,
          run.dimBag,
          (from, i) => {
            if (from === 'bag') {
              if (run.bag.moveTo(i, run.dimBag) === 0) this.hud.toast('차원가방이 가득 찼습니다');
            } else run.dimBag.moveTo(i, run.bag);
          },
          () => this.resume(),
        ),
      );
    } else this.openInventory('equip');
  }

  private openInventory(tab: 'equip' | 'storage' | 'stats'): void {
    this.openMenu(() => this.screens.inventory(this.progress, tab, () => this.applyStats(), () => this.resume()));
  }

  /** 장비가 바뀌면 최대 HP/MP를 다시 계산한다 */
  private applyStats(): void {
    const st = this.progress.stats();
    const hpRatio = this.player.hp / this.player.maxHp;
    this.player.maxHp = st.maxHp;
    this.player.maxMp = st.maxMp;
    this.player.hp = Math.max(1, Math.round(st.maxHp * hpRatio));
    this.player.mp = Math.min(this.player.mp, st.maxMp);
  }

  private openExpand(): void {
    this.openMenu(() =>
      this.screens.factoryExpand(
        this.progress,
        () => {
          const p = this.progress;
          const next = FACTORY_SIZES[p.data.factory.sizeLevel + 1];
          if (!next?.cost || p.data.gold < next.cost.gold || !p.takeAll(next.cost.items)) return;
          p.data.gold -= next.cost.gold;
          p.data.factory.sizeLevel++;
          this.audio.play('level');
          this.afterMenu = () => {
            this.enterHome();
            this.hud.toast(`차원집이 ${p.factorySize}×${p.factorySize}로 넓어졌습니다`);
          };
          this.screens.close();
        },
        () => this.resume(),
      ),
    );
  }

  // =============== 마을 상호작용 ===============
  private interactVillage(spot: VillageSpot): void {
    const p = this.progress;
    switch (spot) {
      case 'portal':
        this.openMenu(() =>
          this.screens.tierSelect(
            p,
            (tier) => {
              this.afterMenu = () => this.enterDungeon(tier);
              this.screens.close();
            },
            () => this.resume(),
          ),
        );
        break;
      case 'home':
        if (!p.flag('home')) this.hud.toast('문이 굳게 닫혀 있다. 차원석의 힘이 필요해 보인다.');
        else {
          this.saveNow();
          this.enterHome();
        }
        break;
      case 'forge':
        this.openMenu(() => this.screens.forge(p, () => this.applyStats(), () => this.resume()));
        break;
      case 'shop':
        this.openMenu(() => this.screens.shop(p, () => this.audio.play('coin'), () => this.resume()));
        break;
      case 'hall':
        this.openMenu(() =>
          this.screens.classHall(
            p,
            (id) => {
              this.afterMenu = () => this.switchClass(id);
              this.screens.close();
            },
            () => this.resume(),
          ),
        );
        break;
      case 'storage':
        this.openInventory('storage');
        break;
      default:
        this.talk(spot);
    }
  }

  private talk(npc: NpcId): void {
    const p = this.progress;
    const script = scriptFor(npc, p);
    if (script === 'stone_n') p.setFlag(`stoneTalk${p.stoneCount}`);
    this.playScript(script, () => {
      if (npc === 'merchant') this.interactVillage('shop');
      else if (npc === 'smith' && script === 'smith_idle') this.interactVillage('forge');
      else if (script === 'home_unlock') this.enterVillage('start');
    });
  }

  private switchClass(id: ClassId): void {
    if (id === this.progress.data.currentClass) return;
    this.progress.data.currentClass = id;
    const pos = { ...this.player.position };
    this.makePlayer(pos.x, pos.z, this.player.facing);
    this.level.effects.pillar(pos.x, pos.z, CLASSES[id].look.tunic);
    this.audio.play('level');
    this.hud.toast(`${CLASSES[id].name}(으)로 전환했습니다`);
    this.refreshHud();
  }

  // =============== 스토리 ===============
  private playScript(id: string, after?: () => void): void {
    this.mode = 'dialogue';
    this.hud.setVisible(false);
    this.dialogue.play(id, () => {
      if (this.pendingNgPlus) {
        this.pendingNgPlus = false;
        this.startNewCycle();
        return;
      }
      this.mode = 'play';
      this.hud.setVisible(true);
      this.input.clearPressed();
      this.refreshHud();
      this.saveNow();
      after?.();
    });
  }

  private runCommand(cmd: string): void {
    const p = this.progress;
    switch (cmd) {
      case 'unlockHome':
        p.setFlag('home');
        this.audio.play('stone');
        break;
      case 'unlockMage':
        p.unlockClass('mage');
        this.audio.play('level');
        break;
      case 'unlockArcher':
        p.unlockClass('archer');
        this.audio.play('level');
        break;
      case 'ngplus':
        this.pendingNgPlus = true;
        break;
    }
  }

  /** 엔딩 후 회차 넘기기: 장비, 레벨, 차원집은 남고 차원석은 다시 모은다 */
  private startNewCycle(): void {
    const p = this.progress;
    p.take('resonator', 1);
    p.data.ngPlus++;
    p.data.dimStones = [];
    p.data.maxTier = 1;
    resetForNewCycle(p);
    this.saveNow();
    this.mode = 'dialogue';
    this.enterVillage('start');
    this.playScript('ngplus');
  }

  // =============== 전투 ===============
  private damageMonster(m: Monster, mult: number, knock: number, fx: number, fz: number): void {
    if (!m.alive) return;
    const st = this.progress.stats();
    const crit = Math.random() * 100 < st.crit;
    const raw = st.atk * mult * (0.9 + Math.random() * 0.2) * (crit ? 1.6 : 1);
    const dmg = Math.max(1, Math.round(raw * (40 / (40 + m.defense))));
    const killed = m.damage(dmg, fx, fz, knock);
    const s = this.toScreen(m.x, m.rig.height * m.rig.root.scale.y + 0.3, m.z);
    this.hud.floatText(s.x, s.y, String(dmg), crit ? '#ffd23a' : '#ffffff', crit ? 'crit' : 'normal');
    this.level.particles.burst(m.x, 0.8, m.z, 0xffffff, crit ? 8 : 4, 0.8);
    this.audio.play(crit ? 'crit' : 'hit');
    if (killed) this.monsterKilled(m);
  }

  private hurtPlayer(dmg: number, fx: number, fz: number): void {
    const pl = this.player;
    if (pl.isInvulnerable || this.mode !== 'play') return;
    const st = this.progress.stats();
    const final = Math.max(1, Math.round(dmg * (0.9 + Math.random() * 0.2) * (60 / (60 + st.def))));
    pl.hurt(final);
    const s = this.toScreen(pl.position.x, 2, pl.position.z);
    this.hud.floatText(s.x, s.y, `-${final}`, '#ff5a5a', 'hurt');
    this.shakeT = Math.max(this.shakeT, 0.25);
    this.audio.play('hurt');
    const lv = this.level;
    const d = Math.hypot(pl.position.x - fx, pl.position.z - fz) || 1;
    moveWithCollision(lv.grid, pl.position, ((pl.position.x - fx) / d) * 0.5, ((pl.position.z - fz) / d) * 0.5, PLAYER.radius, lv.obstacles);
    if (!pl.alive) {
      this.mode = 'dead';
      this.deadTimer = 0;
      this.hud.setVisible(false);
      this.audio.play('fall');
    }
  }

  private monsterKilled(m: Monster): void {
    const run = this.run;
    if (!run || !(this.level instanceof DungeonScene)) return;
    const tier = run.tier;
    const rng = new Rng(randomSeed());
    this.audio.play('kill');
    this.level.particles.burst(m.x, 0.7, m.z, 0xffffff, 12, 1.2);

    const exp = Math.round(m.exp * (1 + this.progress.data.ngPlus * 0.5));
    run.exp += exp;
    const ups = this.progress.addExp(exp);
    if (ups > 0) {
      this.applyStats();
      this.player.hp = this.player.maxHp;
      this.player.mp = this.player.maxMp;
      this.level.effects.pillar(this.player.position.x, this.player.position.z, 0xffe07a);
      this.audio.play('level');
      this.hud.toast(`레벨 업! Lv.${this.progress.cls.level}`);
    }

    const gold = Math.round(rng.int(2, 5) * tier * (m.isBoss ? 25 : m.kind === 'elite' ? 4 : 1));
    run.gold += gold;
    this.progress.data.gold += gold;

    const s = this.toScreen(m.x, 1.8, m.z);
    let line = 0;
    const loot = (text: string, color: string) => this.hud.floatText(s.x, s.y - 22 * line++, text, color, 'small');
    loot(`+${gold} G`, '#ffd23a');

    // 마력 정수
    if (rng.chance(m.kind === 'normal' ? 0.65 : 1)) {
      const n = m.isBoss ? 8 : m.kind === 'elite' ? 3 : 1;
      const id = ESSENCE(tier);
      const added = run.bag.add(id, n);
      if (added) loot(`+${added} ${ITEMS[id].name}`, hex(ITEMS[id].color));
      else this.hud.toast('가방이 가득 찼습니다');
    }
    // 장비
    const eqCount = m.isBoss ? 2 : rng.chance(m.kind === 'elite' ? 0.4 : 0.035) ? 1 : 0;
    for (let i = 0; i < eqCount; i++) {
      const e = rollEquip(rng, tier, this.progress.data.currentClass, m.isBoss ? 0.3 : m.kind === 'elite' ? 0.12 : 0);
      if (run.bag.addEquip(e)) loot(`${GRADES[e.grade].name} ${equipName(e)}`, hex(GRADES[e.grade].color));
      else this.hud.toast('가방이 가득 차서 장비를 줍지 못했습니다');
    }

    if (m.isBoss) {
      this.hud.setBoss(null);
      this.audio.playMusic('dungeon');
      const p = this.progress;
      p.data.maxTier = Math.min(7, Math.max(p.data.maxTier, tier + 1));
      if (!p.data.dimStones.includes(tier)) {
        p.data.dimStones.push(tier);
        this.audio.play('stone');
        this.level.effects.pillar(m.x, m.z, 0x5ef0ff, 8);
        this.hud.toast(`차원석을 얻었다! (${p.stoneCount}/7) · 귀환 차원문이 열렸다`, 4000);
      } else this.hud.toast('수호자를 쓰러뜨렸다 · 귀환 차원문이 열렸다', 3000);
      this.saveNow();
    }
    this.refreshHud();
  }

  private gather(n: NodeInstance): void {
    if (!(this.level instanceof DungeonScene) || !this.run) return;
    const s = this.toScreen(n.x, 1.6, n.z);
    let line = 0;
    for (const drop of this.level.hitNode(n)) {
      const added = this.run.bag.add(drop.itemId, drop.count);
      const item = ITEMS[drop.itemId];
      if (added > 0) this.hud.floatText(s.x, s.y - line++ * 22, `+${added} ${item.name}`, hex(item.color), 'small');
      if (added < drop.count) this.hud.toast('가방이 가득 찼습니다');
    }
    this.audio.play('gather');
    this.refreshHud();
  }

  /** 던전을 무사히 나왔다 (보스 처치 후 차원문 또는 귀환석) */
  private finishRun(how: 'clear' | 'return'): void {
    const run = this.run;
    if (!run) return;
    const p = this.progress;
    const items = new Map<string, number>();
    for (const bag of [run.bag, run.dimBag]) for (const [id, n] of bag.totals()) items.set(id, (items.get(id) ?? 0) + n);
    const equips = [...run.bag.equips(), ...run.dimBag.equips()];
    p.depositSlots(run.bag.slots);
    p.depositSlots(run.dimBag.slots);
    run.dimBag.clear();
    p.data.dimBag = run.dimBag.slots;
    p.setFlag('returned');
    this.audio.play('portal');
    const explored = this.exploredRatio();
    this.run = null;
    this.saveNow();
    this.openMenu(
      () =>
        this.screens.result(
          { title: how === 'clear' ? '귀환 성공' : '귀환석으로 귀환', items, equips, seconds: run.time, explored, gold: run.gold, exp: run.exp },
          () => this.resume(),
        ),
      () => {
        this.enterVillage('portal');
        this.saveNow();
      },
    );
  }

  /** 쓰러짐: 착용 장비는 남고, 일반 가방은 모두 잃고, 차원가방은 지켜진다 */
  private fall(): void {
    const run = this.run;
    if (!run) return;
    const p = this.progress;
    const lost = run.bag.totals();
    const lostEquips = run.bag.equips().length;
    const kept = run.dimBag.totals();
    const keptEquips = run.dimBag.equips();
    p.depositSlots(run.dimBag.slots);
    run.dimBag.clear();
    p.data.dimBag = run.dimBag.slots;
    p.setFlag('returned');
    const explored = this.exploredRatio();
    this.run = null;
    this.saveNow();
    this.openMenu(
      () =>
        this.screens.result(
          {
            title: '쓰러졌다…',
            note: '틈새가 몸을 마을로 밀어냈다. 일반 가방의 짐은 틈새에 삼켜졌다.',
            items: kept,
            equips: keptEquips,
            lost,
            lostEquips,
            seconds: run.time,
            explored,
            gold: run.gold,
            exp: run.exp,
          },
          () => this.resume(),
        ),
      () => {
        this.enterVillage('portal');
        this.saveNow();
      },
    );
  }

  private exploredRatio(): number {
    if (!this.minimap || !(this.level instanceof DungeonScene)) return 0;
    const d = this.level.grid;
    let total = 0;
    let seen = 0;
    for (let y = 0; y < d.height; y++)
      for (let x = 0; x < d.width; x++) {
        if (!isFloor(d, x, y)) continue;
        total++;
        if (this.minimap.isExplored(x, y)) seen++;
      }
    return total ? seen / total : 0;
  }

  // =============== 공장 건설 ===============
  private buildingUnlocked(t: BuildingType): boolean {
    return this.progress.stoneCount >= BUILDINGS[t].unlockStones;
  }

  private buildMode(on: boolean): void {
    this.building = on;
    this.hud.setBuilding(on);
    if (on) this.buildBar.show((t) => this.buildingUnlocked(t));
    else this.buildBar.hide();
    if (this.level instanceof HomeScene) this.level.setBuildMode(on);
    this.camera.zoom = 1;
    this.camera.updateProjectionMatrix();
    if (on) this.fitBuildCamera();
  }

  private setBuilding(on: boolean): void {
    this.buildMode(on);
    this.saveNow();
  }

  private fitBuildCamera(): void {
    if (!(this.level instanceof HomeScene)) return;
    const L = this.factory.size * TILE;
    const viewH = this.camera.top - this.camera.bottom;
    const viewW = this.camera.right - this.camera.left;
    this.camera.zoom = Math.min(1, viewW / (L * 1.55), viewH / (L * 1.2));
    this.camera.updateProjectionMatrix();
  }

  private pickCell(e: PointerEvent): { x: number; y: number } | null {
    const rect = this.renderer.domElement.getBoundingClientRect();
    const ndc = new Vector2(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
    this.raycaster.setFromCamera(ndc, this.camera);
    const hit = new Vector3();
    if (!this.raycaster.ray.intersectPlane(this.ground, hit)) return null;
    const x = Math.floor(hit.x / TILE);
    const y = Math.floor(hit.z / TILE);
    return this.factory.inBounds(x, y) ? { x, y } : null;
  }

  private setupBuildPointer(): void {
    const canvas = this.renderer.domElement;
    canvas.addEventListener('pointerdown', (e) => {
      if (!this.building || this.mode !== 'play') return;
      const cell = this.pickCell(e);
      if (!cell) return;
      canvas.setPointerCapture(e.pointerId);
      this.dragCell = cell;
      this.applyTool(cell, null);
    });
    canvas.addEventListener('pointermove', (e) => {
      if (!this.building || !(this.level instanceof HomeScene)) return;
      const cell = this.pickCell(e);
      const tool = this.buildBar.tool;
      if (cell) {
        const occupied = !!this.factory.at(cell.x, cell.y);
        this.level.showCursor(cell.x, cell.y, tool === 'remove' || tool === 'config' ? occupied : !occupied);
      } else this.level.hideCursor();
      if (!this.dragCell || !cell || (cell.x === this.dragCell.x && cell.y === this.dragCell.y)) return;
      if (tool !== 'belt' && tool !== 'wire' && tool !== 'remove') return;
      // 한 칸씩 이어지도록 가로·세로로만 따라간다
      let prev = this.dragCell;
      while (this.dragCell && (prev.x !== cell.x || prev.y !== cell.y)) {
        const dx = Math.sign(cell.x - prev.x);
        const dy = dx !== 0 ? 0 : Math.sign(cell.y - prev.y);
        const next = { x: prev.x + dx, y: prev.y + dy };
        this.applyTool(next, prev);
        prev = next;
      }
      if (this.dragCell) this.dragCell = cell;
    });
    const end = () => (this.dragCell = null);
    canvas.addEventListener('pointerup', end);
    canvas.addEventListener('pointercancel', end);
  }

  private applyTool(cell: { x: number; y: number }, from: { x: number; y: number } | null): void {
    const f = this.factory;
    const p = this.progress;
    const tool = this.buildBar.tool;
    const existing = f.at(cell.x, cell.y);
    if (tool === 'remove') {
      if (!existing) return;
      f.remove(cell.x, cell.y, p);
      for (const [id, n] of Object.entries(BUILDINGS[existing.type].cost)) p.add(id, n);
      this.audio.play('build');
      return;
    }
    if (tool === 'config') {
      if (!existing) return;
      this.dragCell = null;
      this.openMenu(() => this.screens.factoryConfig(f, existing, p, () => this.saveNow(), () => this.resume()));
      return;
    }
    // 끌어서 깔 때: 레일 방향은 움직인 방향, 이전 레일도 이쪽을 보게 돌린다
    let dir = this.buildBar.dir as Dir;
    if (from) {
      const dx = cell.x - from.x;
      const dy = cell.y - from.y;
      dir = (dx === 1 ? 0 : dy === 1 ? 1 : dx === -1 ? 2 : 3) as Dir;
      const prev = f.at(from.x, from.y);
      if (prev && prev.type === 'belt' && tool === 'belt') prev.dir = dir;
    }
    if (existing) {
      if (existing.type === tool && !from) {
        f.rotate(cell.x, cell.y);
        this.audio.play('click');
      } else if (existing.type === tool && tool === 'belt') existing.dir = dir;
      return;
    }
    const cost = BUILDINGS[tool].cost;
    if (!p.hasAll(cost)) {
      const need = Object.entries(cost)
        .map(([id, n]) => `${ITEMS[id].name} ${p.count(id)}/${n}`)
        .join(', ');
      this.hud.toast(`재료가 부족합니다 (${need})`);
      this.dragCell = null;
      return;
    }
    p.takeAll(cost);
    const b = f.place(tool, cell.x, cell.y, dir);
    if (!b) return;
    if (tool === 'generator') p.setFlag('factoryBuilt');
    this.audio.play('build');
    this.level.particles.burst((cell.x + 0.5) * TILE, 0.5, (cell.y + 0.5) * TILE, BUILDINGS[tool].color, 5, 0.6);
    if (tool === 'input' || tool === 'assembler') {
      // 바로 설정 창을 연다
      this.dragCell = null;
      this.openMenu(() => this.screens.factoryConfig(f, b, p, () => this.saveNow(), () => this.resume()));
    }
  }

  // =============== 매 프레임 ===============
  private frame(now: number): void {
    const dt = Math.min(0.05, (now - this.lastTime) / 1000);
    this.lastTime = now;

    // 공장은 어디에 있든 계속 돌아간다
    if (this.mode !== 'title' && this.progress.flag('home')) {
      this.factoryAcc += dt;
      while (this.factoryAcc >= 0.1) {
        this.factory.step(0.1, this.progress);
        this.factoryAcc -= 0.1;
      }
    }

    switch (this.mode) {
      case 'play':
        this.updatePlay(dt);
        break;
      case 'dead':
        this.deadTimer += dt;
        this.player.update(dt, { move: { x: 0, y: 0 }, applyMove: () => {} });
        this.level.update(dt, this.player.position);
        if (this.deadTimer > 1.6 && this.mode === 'dead') this.fall();
        break;
      case 'menu':
        if (this.input.consume('pause') || (this.input.consume('bag') && this.screens.isOpen)) this.screens.close();
        break;
      default:
        this.level.update(dt, this.player.position);
        this.player.update(dt, { move: { x: 0, y: 0 }, applyMove: () => {} });
    }

    if (this.mode !== 'title') {
      this.saveTimer += dt;
      if (this.saveTimer > 30) {
        this.saveTimer = 0;
        this.saveNow();
      }
    }

    this.updateCamera(dt);
    this.updateLabels();
    this.renderer.render(this.level.scene, this.camera);
  }

  private nearestInteractable(): Interactable | null {
    let best: Interactable | null = null;
    let bestD = Infinity;
    const p = this.player.position;
    for (const it of this.level.interactables) {
      if (it.enabled && !it.enabled()) continue;
      const d = Math.hypot(it.x - p.x, it.z - p.z);
      if (d < it.range && d < bestD) {
        bestD = d;
        best = it;
      }
    }
    return best;
  }

  private updatePlay(dt: number): void {
    const input = this.input;
    if (input.consume('pause')) return this.openPause();
    if (input.consume('bag')) return this.openBagOrInventory();
    if (input.consume('build') && this.level instanceof HomeScene) this.setBuilding(!this.building);

    if (this.hitStopT > 0) {
      this.hitStopT -= dt;
      return;
    }

    const pl = this.player;
    this.combat.update(dt);
    this.potionCd = Math.max(0, this.potionCd - dt);
    if (this.run) this.run.time += dt;

    const move = this.building ? { x: 0, y: 0 } : input.getMove();
    const near = this.building ? null : this.nearestInteractable();
    this.hud.setInteract(near ? near.label : null);

    const attack = input.consume('attack');
    const interact = input.consume('interact');
    if (near && (attack || interact)) {
      input.attackButtonHeld = false;
      near.action();
      return;
    }
    if (input.consume('dodge') && !this.building && pl.startRoll(move)) this.audio.play('dash');
    for (let i = 0; i < 3; i++) {
      if (input.consume(`skill${i + 1}` as 'skill1')) {
        const msg = this.combat.useSkill(i);
        if (msg) this.hud.toast(msg);
      }
    }
    if (input.consume('potion')) this.drinkPotion();
    if ((attack || input.attackHeld) && !near && !this.building && pl.canAct) this.combat.basicAttack();

    const level = this.level;
    const obstacles = level instanceof DungeonScene ? level.playerObstacles() : level.obstacles;
    pl.update(dt, {
      move,
      applyMove: (dx, dz) => moveWithCollision(level.grid, pl.position, dx, dz, PLAYER.radius, obstacles),
    });
    level.update(dt, pl.position);

    if (level instanceof DungeonScene) {
      const boss = level.boss;
      if (boss && boss.alive && boss.aggro) {
        this.hud.setBoss(`${boss.name}${boss.phase2 ? ' · 격노' : ''}`, boss.hp / boss.maxHp);
        this.audio.playMusic('boss');
      }
      if (this.minimap) {
        this.minimap.reveal(pl.position.x, pl.position.z);
        this.minimapTimer -= dt;
        if (this.minimapTimer <= 0) {
          this.minimapTimer = 0.1;
          const markers = level.nodes.filter((n) => n.alive).map((n) => ({ x: n.x, z: n.z, color: hex(n.def.accentColor), size: 0.45 }));
          for (const m of level.monsters) if (m.alive) markers.push({ x: m.x, z: m.z, color: m.isBoss ? '#ff3030' : '#ff7a7a', size: m.isBoss ? 1 : 0.4 });
          const exit = level.portals.find((p) => p.kind === 'exit')!;
          markers.push({ x: exit.x, z: exit.z, color: level.exitOpen ? hex(level.theme.portalColor) : '#777', size: 1.1 });
          this.minimap.draw({ ...pl.position, facing: pl.facing }, markers);
        }
      }
    }
    this.refreshHud();
  }

  private drinkPotion(): void {
    if (!(this.level instanceof DungeonScene)) return this.hud.toast('물약은 던전에서 마실 수 있습니다');
    if (this.potionCd > 0) return;
    if (!this.progress.take('potion', 1)) return this.hud.toast('물약이 없습니다 (상점·연금 솥에서 구하기)');
    const pl = this.player;
    pl.hp = Math.min(pl.maxHp, pl.hp + pl.maxHp * 0.5);
    pl.mp = Math.min(pl.maxMp, pl.mp + pl.maxMp * 0.5);
    this.potionCd = 1;
    this.level.effects.ring(pl.position.x, pl.position.z, 2, 0xff7a9a, 0.4);
    this.audio.play('pickup');
  }

  private refreshHud(): void {
    const p = this.progress;
    const pl = this.player;
    const c = p.cls;
    this.hud.setBars(pl.hp, pl.maxHp, pl.mp, pl.maxMp, c.exp, expToNext(c.level), c.level);
    this.hud.setGold(p.data.gold);
    if (this.run && this.level instanceof DungeonScene) {
      const boss = this.level.boss;
      this.hud.setObjective(boss && boss.alive ? '가장 깊은 방의 수호자를 쓰러뜨리자 (미니맵의 큰 빨간 점)' : '귀환 차원문으로 돌아가 전리품을 가져가자');
    } else this.hud.setObjective(objective(p));
    this.hud.setPotions(p.count('potion'));
    this.hud.setDodgeCooldown(pl.rollCooldown / (PLAYER.rollCooldown + PLAYER.rollTime));
    const skills = pl.cls.skills;
    this.hud.setSkills(
      this.combat.cooldowns.map((cd, i) => cd / skills[i].cooldown),
      skills.map((s) => pl.mp >= s.mp),
    );
    if (this.run) this.hud.setBagCount(this.run.bag.used, BAG_SLOTS);
  }

  private updateLabels(): void {
    if (this.mode !== 'play' || this.building) return this.hud.setLabels([]);
    const labels: { text: string; x: number; y: number; accent?: boolean }[] = [];
    const p = this.player.position;
    for (const it of this.level.interactables) {
      if (!it.title || Math.hypot(it.x - p.x, it.z - p.z) > 14) continue;
      const isNpc = NPC_IDS.has(it.id);
      const news = isNpc && hasNews(it.id as NpcId, this.progress);
      const s = this.toScreen(it.x, isNpc ? 2.3 : it.id === 'portal' ? 4.6 : 3.3, it.z);
      labels.push({ text: news ? `! ${it.title}` : it.title, x: s.x, y: s.y, accent: news });
    }
    this.hud.setLabels(labels);
  }

  private toScreen(x: number, y: number, z: number): { x: number; y: number } {
    const v = new Vector3(x, y, z).project(this.camera);
    return { x: ((v.x + 1) / 2) * this.container.clientWidth, y: ((1 - v.y) / 2) * this.container.clientHeight };
  }

  private updateCamera(dt: number): void {
    const target = this.building && this.level instanceof HomeScene ? this.level.center : this.player.position;
    const k = 1 - Math.exp(-dt * 7);
    this.camTarget.x += (target.x - this.camTarget.x) * k;
    this.camTarget.z += (target.z - this.camTarget.z) * k;
    this.shakeT = Math.max(0, this.shakeT - dt);
    const s = this.shakeT * 0.7;
    const sx = (Math.random() - 0.5) * s;
    const sz = (Math.random() - 0.5) * s;
    this.camera.position.set(this.camTarget.x + CAMERA_OFFSET.x + sx, CAMERA_OFFSET.y, this.camTarget.z + CAMERA_OFFSET.z + sz);
    this.camera.lookAt(this.camTarget.x + sx, 0, this.camTarget.z + sz);
  }

  /** 개발용 (?debug): 현재 상태 */
  debugInfo(): Record<string, unknown> {
    return { mode: this.mode, level: this.level.kind, player: { ...this.player.position, hp: this.player.hp }, gold: this.progress.data.gold, stones: this.progress.data.dimStones };
  }
}

/** 모바일에서 전체 화면 + 가로 고정을 시도한다 (지원하지 않는 브라우저는 조용히 넘어간다) */
function requestFullscreenLandscape(): void {
  if (!window.matchMedia('(pointer: coarse)').matches) return;
  const el = document.documentElement;
  el.requestFullscreen?.()
    .then(() => (screen.orientation as ScreenOrientation & { lock?: (o: string) => Promise<void> }).lock?.('landscape'))
    .catch(() => {});
}
