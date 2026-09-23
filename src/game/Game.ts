import { bustUrl, itemIconUrl } from '../ui/itemIcons';
import { gearLook } from '../models/items';
import { TOOL_KIND_NAMES, TOOL_TIER_NAMES, toolBonusChance, toolName, toolSpeed, toolWear, type ToolKind } from '../data/tools';
import { MeshLambertMaterial, OrthographicCamera, PCFShadowMap, Plane, Raycaster, Vector2, Vector3, WebGLRenderer } from 'three';
import { BAG_SLOTS, CAMERA_OFFSET, PLAYER, TILE, VIEW_HEIGHT } from '../config';
import { Audio } from '../core/audio';
import { Input } from '../core/input';
import { Rng, randomSeed } from '../core/rng';
import { CLASSES, expToNext, MAX_SKILL_LEVEL, SKILL_LEARN, skillUpgradeCost, type ClassId } from '../data/classes';
import { durability, equipName, GRADES, rollEquip, type Equip } from '../data/equipment';
import { BUILDINGS, FACTORY_SIZES, OFFLINE_CAP_HOURS, type BuildingType } from '../data/factory';
import { ITEMS } from '../data/items';
import { QUEST_BY_ID, type NpcRef, type QuestDef } from '../data/quests';
import type { Step } from '../data/story';
import { moveWithCollision } from '../dungeon/collision';
import { generateDungeon, isFloor } from '../dungeon/generator';
import { Factory, MACHINE_TYPES, RECIPE_BY_ID, type BuildingState, type Dir } from '../factory/sim';
import { BuildBar } from '../ui/buildbar';
import { Dialogue } from '../ui/dialogue';
import { Hud } from '../ui/hud';
import { Minimap, type MapMarker } from '../ui/minimap';
import { hex, Screens } from '../ui/screens';
import { Bag } from './Bag';
import { Combat } from './Combat';
import type { Monster } from './Monster';
import { Player } from './Player';
import { DIM_BAG_MAX, deleteSave, hasSave, loadSave, newSave, Progress, stageIndex, stageOf, type SaveData } from './Progress';
import { objectiveNeed, objectiveProgress, Quests } from './Quests';
import { hasStory, objective, questLines, resetForNewCycle, scriptFor } from './Story';
import { DungeonScene, type NodeInstance } from './scenes/DungeonScene';
import { HomeScene } from './scenes/HomeScene';
import type { Interactable, Level } from './scenes/Level';
import { NPCS, VillageScene, type NpcId, type VillageSpot } from './scenes/VillageScene';

type Mode = 'title' | 'play' | 'menu' | 'dialogue' | 'dead';

interface Run {
  tier: number;
  stage: number;
  bag: Bag;
  dimBag: Bag;
  gold: number;
  exp: number;
  time: number;
  stagesCleared: number;
  /** 이번 방을 클리어 처리했는지 */
  roomCleared: boolean;
  /** 던전에 들어갈 때 가방에 있던 것 (결과 화면에서 새로 얻은 것만 보여 준다) */
  start: Map<string, number>;
  startEquips: Set<string>;
}

const ESSENCE = (tier: number) => (tier <= 3 ? 'essence_low' : tier <= 5 ? 'essence_mid' : 'essence_high');
const NPC_IDS = new Set<string>(NPCS.map((n) => n.id));
const MAX_STAGE = 70;

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
  private quests!: Quests;
  private factory!: Factory;
  private level!: Level;
  private player!: Player;
  private playerMaterial = new MeshLambertMaterial({ vertexColors: true, flatShading: true });
  private combat!: Combat;
  private minimap: Minimap | null = null;
  private bigMap = false;
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
  /** 공격 버튼을 연타해도 입력이 사라지지 않게 잠시 기억한다 */
  private attackBuffer = 0;
  private gathering: NodeInstance | null = null;
  private pendingNgPlus = false;
  private afterMenu: (() => void) | null = null;
  private raycaster = new Raycaster();
  private ground = new Plane(new Vector3(0, 1, 0), 0);
  private dragCell: { x: number; y: number } | null = null;
  private ghostCell: { x: number; y: number } | null = null;

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
      portrait: (speaker) => {
        const npc = NPCS.find((n) => n.name === speaker || n.name.endsWith(` ${speaker}`));
        return npc ? bustUrl(npc.id, npc.look) : '';
      },
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
    this.setProgress(new Progress(newSave()));
    this.enterDungeon(1, 1, true);
    this.resize();
    this.showTitle();

    this.lastTime = performance.now();
    this.renderer.setAnimationLoop((t) => this.frame(t));
  }

  private setProgress(p: Progress): void {
    this.progress = p;
    this.quests = new Quests(p.data.quests, {
      count: (id) => p.count(id),
      get stones() {
        return p.stoneCount;
      },
      get cleared() {
        return p.data.cleared;
      },
      flag: (f) => p.flag(f),
    });
    this.factory = new Factory(p.data.factory, p.factorySize);
    this.factory.onCraft = (item, n) => this.quests.event({ type: 'craft', item, count: n });
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
    this.setProgress(new Progress(data));
    this.audio.setEnabled(data.settings.sound);
    this.screens.close();
    const offline = isNew ? 0 : Math.min(OFFLINE_CAP_HOURS * 3600, (Date.now() - data.lastSaved) / 1000);
    this.mode = 'play';
    this.enterVillage('start');
    if (isNew) {
      this.saveNow();
      this.playScript('prologue', () => {
        // 프롤로그가 끝나면 리아의 첫 의뢰를 바로 받는다
        const q = QUEST_BY_ID.m1_hunt;
        this.quests.accept(q);
        this.hud.toast(`퀘스트 수락: ${q.title}`, 3000);
        this.refreshHud();
      });
    } else if (offline > 60 && this.progress.flag('home') && data.factory.buildings.length) {
      const before = this.boxSnapshot();
      this.factory.simulate(offline);
      const after = this.boxSnapshot();
      const produced = new Map<string, number>();
      for (const [id, n] of after) if (n > (before.get(id) ?? 0)) produced.set(id, n - (before.get(id) ?? 0));
      this.openMenu(() => this.screens.offlineReward(offline, produced, () => this.resume()));
      this.saveNow();
    }
  }

  /** 출하 보관상자의 내용물 합계 (오프라인 보상 계산용) */
  private boxSnapshot(): Map<string, number> {
    const m = new Map<string, number>();
    for (const b of this.factory.state.buildings) {
      if (b.type !== 'box' || b.mode !== 'out') continue;
      for (const [id, n] of Object.entries(b.buffer ?? {})) m.set(id, (m.get(id) ?? 0) + n);
    }
    return m;
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

  private loadLevel(level: Level, fogMap: boolean): void {
    if (this.level) this.level.dispose();
    this.level = level;
    this.buildMode(false);
    this.gathering = null;
    this.makePlayer(level.playerStart.x, level.playerStart.z, level.playerStart.facing);
    this.camTarget.set(level.playerStart.x, 0, level.playerStart.z);
    level.sun.castShadow = this.progress.data.settings.shadows;
    this.hud.setMode(level.kind);
    this.hud.setBoss(null);
    this.minimap = new Minimap(level.grid, fogMap);
    this.hud.setMinimap(this.minimap.canvas);
    this.setBigMap(false);
    this.fade();
  }

  private makePlayer(x: number, z: number, facing: number, keepHp = false): void {
    const prev = this.player;
    if (prev) prev.rig.root.parent?.remove(prev.rig.root);
    const cls = CLASSES[this.progress.data.currentClass];
    this.gearKey = JSON.stringify(gearLook(this.progress.cls.equipment, this.progress.data.tools));
    this.player = new Player(this.playerMaterial, cls, gearLook(this.progress.cls.equipment, this.progress.data.tools));
    this.player.facing = facing;
    this.player.setPosition(x, z);
    const st = this.progress.stats();
    this.player.maxHp = st.maxHp;
    this.player.maxMp = st.maxMp;
    this.player.hp = keepHp && prev ? Math.min(st.maxHp, Math.max(1, prev.hp)) : st.maxHp;
    this.player.mp = keepHp && prev ? Math.min(st.maxMp, prev.mp) : st.maxMp;
    this.level.scene.add(this.player.rig.root);
    const game = this;
    this.combat = new Combat({
      get player() {
        return game.player;
      },
      stats: () => this.progress.stats(),
      level: () => this.level,
      dungeon: () => (this.level instanceof DungeonScene && this.run ? this.level : null),
      damageMonster: (m, mult, knock, fx, fz) => this.damageMonster(m, mult, knock, fx, fz),
      shake: (a) => (this.shakeT = Math.max(this.shakeT, a)),
      hitStop: (t) => (this.hitStopT = Math.max(this.hitStopT, t)),
      sfx: (n) => this.audio.play(n),
      skillLevel: (i) => this.progress.cls.skills[i] ?? 0,
    });
    this.hud.setClass(cls.short, hex(cls.look.tunic), cls.skills.map((s) => s.name));
  }

  private enterVillage(arrival: 'portal' | 'home' | 'start' | { x: number; z: number; facing: number }): void {
    const p = this.progress;
    const village = new VillageScene(
      (spot) => this.interactVillage(spot),
      (id) => id !== 'stranger' || p.stoneCount >= 4,
      p.flag('home') > 0,
      arrival,
    );
    this.loadLevel(village, false);
    this.run = null;
    this.hud.setLocation(p.data.ngPlus ? `차원마을 · ${p.data.ngPlus + 1}회차` : '차원마을', 0xffd88a);
    this.audio.playMusic('village');
    let grown = 0;
    while (p.count('bag_kit') > 0 && p.data.dimBag.length < DIM_BAG_MAX) {
      p.take('bag_kit', 1);
      p.data.dimBag.push(null);
      grown++;
    }
    if (grown) this.hud.toast(`차원가방이 ${p.data.dimBag.length}칸으로 늘어났습니다`, 3000);
    if (this.quests.refreshDaily(p.maxTier, p.flag('home') > 0) && p.flag('legend')) this.hud.toast('촌장 에단의 일일 의뢰가 새로 올라왔습니다', 3000);
    if (this.mode !== 'dialogue') this.mode = 'play';
    this.hud.setVisible(this.mode === 'play');
    this.refreshHud();
  }

  /** 던전 입장. run이 있으면 가방을 들고 다음 방으로 이어 간다 */
  private enterDungeon(tier: number, stage: number, background = false): void {
    const data = generateDungeon(randomSeed(), tier, stage);
    const dungeon = new DungeonScene(data, this.progress.data.ngPlus, {
      player: () => this.player.position,
      cameraQuat: () => this.camera.quaternion,
      hurtPlayer: (d, x, z) => this.hurtPlayer(d, x, z),
      monsterKilled: (m) => this.monsterKilled(m),
      monsterHitByProjectile: (m, proj) => this.combat.projectileHit(m, proj),
      exit: () => this.openWarp(),
      gather: (n) => this.startGather(n),
      shake: (a) => (this.shakeT = Math.max(this.shakeT, a)),
    });
    const continuing = !background && this.run !== null;
    const prevPlayer = this.player;
    this.loadLevel(dungeon, true);
    if (background) return;
    if (continuing && prevPlayer) {
      // 다음 방으로: 체력은 이어지되 조금 회복한다
      this.player.hp = Math.min(this.player.maxHp, prevPlayer.hp + this.player.maxHp * 0.25);
      this.player.mp = Math.min(this.player.maxMp, prevPlayer.mp + this.player.maxMp * 0.25);
      this.run!.tier = tier;
      this.run!.stage = stage;
      this.run!.roomCleared = false;
    } else {
      const dim = new Bag(this.progress.data.dimBag.length, this.progress.data.dimBag);
      const bag = this.progress.invBag;
      const start = new Map<string, number>();
      for (const b of [bag, dim]) for (const [id, n] of b.totals()) start.set(id, (start.get(id) ?? 0) + n);
      const startEquips = new Set([...bag.equips(), ...dim.equips()].map((e) => e.uid));
      this.run = { tier, stage, bag, dimBag: dim, gold: 0, exp: 0, time: 0, stagesCleared: 0, roomCleared: false, start, startEquips };
    }
    this.hud.setLocation(`${tier}-${stage} · ${dungeon.theme.name}`, dungeon.theme.portalColor);
    this.audio.playMusic('dungeon');
    this.audio.play('portal');
    this.mode = 'play';
    this.hud.setVisible(true);
    const note = stage === 10 ? ' — 차원석을 지닌 수호자가 기다립니다' : stage === 5 ? ' — 파수꾼이 지키고 있습니다' : '';
    this.hud.toast(`${tier}-${stage} · ${dungeon.theme.name}${note}`, 3000);
    this.refreshHud();
  }

  private enterHome(): void {
    this.factory.size = this.progress.factorySize;
    const home = new HomeScene(
      this.factory,
      () => {
        this.saveNow();
        this.enterVillage('home');
      },
      (b) => this.openBuilding(b),
      () => this.openStorage(),
    );
    this.loadLevel(home, false);
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
    this.setBigMap(false);
    open();
    if (onClosed) this.afterMenu = onClosed;
  }

  private resume(): void {
    this.mode = 'play';
    this.hud.setVisible(true);
    if (this.building) this.buildBar.show((t) => this.buildingUnlocked(t));
    this.input.clearPressed();
    this.applyStats();
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
          this.finishRun('귀환석으로 귀환');
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
          this.enterDungeon(1, 1, true);
          this.showTitle();
        },
        onClose: () => this.resume(),
      }),
    );
  }

  /** 지금 들고 있는 일반 가방·차원가방 */
  private bags(): [Bag, Bag] {
    return this.run ? [this.run.bag, this.run.dimBag] : [this.progress.invBag, this.progress.dimBagObj];
  }

  private openBagOrInventory(): void {
    const [bag, dim] = this.bags();
    this.openMenu(() =>
      this.screens.bag(
        bag,
        dim,
        (from, i) => (from === 'bag' ? bag.moveTo(i, dim) : dim.moveTo(i, bag)) > 0,
        () => this.resume(),
        () => this.showInventory('equip'),
      ),
    );
  }

  private showInventory(tab: 'equip' | 'skills' | 'stats' | 'quest'): void {
    this.screens.inventory(this.progress, this.quests, tab, () => this.applyStats(), () => this.resume(), undefined, { bags: this.bags(), dungeon: !!this.run });
  }

  private openInventory(tab: 'equip' | 'skills' | 'stats' | 'quest'): void {
    this.openMenu(() => this.showInventory(tab));
  }

  private openStorage(): void {
    this.openMenu(() => this.screens.storage(this.progress, () => this.resume()));
  }

  /** 장비·스탯이 바뀌면 최대 HP/MP를 다시 계산한다 */
  private applyStats(): void {
    if (!this.player) return;
    const st = this.progress.stats();
    const hpRatio = this.player.hp / this.player.maxHp;
    this.player.maxHp = st.maxHp;
    this.player.maxMp = st.maxMp;
    this.player.hp = Math.max(1, Math.round(st.maxHp * hpRatio));
    this.player.mp = Math.min(this.player.mp, st.maxMp);
    this.refreshGear();
  }

  private gearKey = '';
  /** 장비가 바뀌면 캐릭터 모델을 새 장비 모습으로 다시 만든다 (위치·HP·방향은 그대로) */
  private refreshGear(): void {
    const gear = gearLook(this.progress.cls.equipment, this.progress.data.tools);
    const key = JSON.stringify(gear);
    if (key === this.gearKey || !this.player) return;
    this.gearKey = key;
    const prev = this.player;
    const next = new Player(this.playerMaterial, prev.cls, gear);
    next.facing = prev.facing;
    next.setPosition(prev.position.x, prev.position.z);
    next.maxHp = prev.maxHp;
    next.maxMp = prev.maxMp;
    next.hp = prev.hp;
    next.mp = prev.mp;
    prev.rig.root.parent?.remove(prev.rig.root);
    this.level.scene.add(next.rig.root);
    this.player = next;
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
            this.building = false;
            this.enterHome();
            this.hud.toast(`차원집이 ${p.factorySize}×${p.factorySize}로 넓어졌습니다`);
          };
          this.screens.close();
        },
        () => this.resume(),
      ),
    );
  }

  private setBigMap(on: boolean): void {
    this.bigMap = on && !!this.minimap;
    this.hud.showBigMap(this.bigMap ? this.minimap!.bigCanvas : null);
    this.minimapTimer = 0;
  }

  // =============== 마을 상호작용 ===============
  private interactVillage(spot: VillageSpot): void {
    const p = this.progress;
    switch (spot) {
      case 'portal':
        this.openStageSelect(p.maxTier);
        break;
      case 'home':
        if (!p.flag('home')) this.hud.toast('문이 굳게 닫혀 있다. 세라라면 방법을 알지도 모른다.');
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
        this.openStorage();
        break;
      default:
        this.talk(spot);
    }
  }

  private openStageSelect(tier: number): void {
    this.openMenu(() =>
      this.screens.stageSelect(
        this.progress,
        tier,
        (t, s) => {
          this.afterMenu = () => this.enterDungeon(t, s);
          this.screens.close();
        },
        () => this.resume(),
      ),
    );
  }

  /** NPC와 대화: 퀘스트 보고 → 이야기 → 새 퀘스트 → 진행 중 안내 → 인사와 시설 */
  private talk(npc: NpcId): void {
    const p = this.progress;
    const q = this.quests;
    const ref = npc as NpcRef;

    const ready = q.activeFor(ref).find((x) => q.canComplete(x));
    if (ready) return this.playSteps(ready.complete, () => this.completeQuest(ready));

    if (hasStory(npc, p)) {
      const script = scriptFor(npc, p);
      if (script === 'stone_n') p.setFlag(`stoneTalk${p.stoneCount}`);
      return this.playScript(script);
    }

    const offer = q.available(ref)[0];
    if (offer) return this.playSteps(offer.offer, () => this.offerQuest(offer));

    const pending = q.activeFor(ref)[0];
    if (pending?.pending) return this.playSteps(pending.pending);

    const script = scriptFor(npc, p);
    if (script === 'stone_n') p.setFlag(`stoneTalk${p.stoneCount}`);
    this.playScript(script, () => {
      if (npc === 'merchant') this.interactVillage('shop');
      else if (npc === 'smith') this.interactVillage('forge');
      else if (npc === 'trainer') this.openSkillShop();
      else if (npc === 'engineer' && q.isDone('m4_factory')) this.openBlueprints();
      else if (npc === 'chief' && p.flag('legend')) this.openDaily();
    });
  }

  private offerQuest(qd: QuestDef): void {
    this.openMenu(() =>
      this.screens.questOffer(
        qd,
        () => {
          this.quests.accept(qd);
          for (const f of qd.onAccept?.flags ?? []) this.progress.setFlag(f);
          for (const [id, n] of Object.entries(qd.onAccept?.items ?? {})) this.progress.add(id, n);
          this.audio.play('pickup');
          this.hud.toast(`퀘스트 수락: ${qd.title}${qd.onAccept?.flags?.includes('tool_pickaxe') ? ' · 곡괭이와 도끼를 받았다!' : ''}`, 3000);
          this.screens.close();
        },
        () => this.resume(),
      ),
    );
  }

  private completeQuest(qd: QuestDef): void {
    const p = this.progress;
    if (!this.quests.canComplete(qd)) return;
    for (const o of qd.objectives) if (o.type === 'deliver') p.take(o.item, o.count);
    this.quests.finish(qd);
    const r = qd.rewards;
    if (r.gold) p.data.gold += r.gold;
    for (const [id, n] of Object.entries(r.items ?? {})) p.add(id, n);
    for (const f of r.flags ?? []) p.setFlag(f);
    if (r.exp) this.gainExp(r.exp);
    this.audio.play('coin');
    const parts = [r.gold ? `${r.gold} G` : '', r.exp ? `경험치 ${r.exp}` : '', ...Object.entries(r.items ?? {}).map(([id, n]) => `${ITEMS[id].name}×${n}`)].filter(Boolean);
    this.hud.toast(`퀘스트 완료: ${qd.title}${parts.length ? ` (${parts.join(', ')})` : ''}`, 3500);
    this.saveNow();
    if (r.script) {
      const pos = { ...this.player.position, facing: this.player.facing };
      this.playScript(r.script, () => {
        // 차원집이 열리면 문이 빛나도록 마을을 다시 만든다 (서 있던 자리 그대로)
        if (r.flags?.includes('home') && this.level instanceof VillageScene) this.enterVillage(pos);
      });
    }
    this.refreshHud();
  }

  private openSkillShop(message?: string): void {
    this.openMenu(() =>
      this.screens.skillShop(
        this.progress,
        (i) => {
          const p = this.progress;
          const c = p.cls;
          const lv = c.skills[i] ?? 0;
          const cost = lv === 0 ? SKILL_LEARN[i] : lv < MAX_SKILL_LEVEL ? skillUpgradeCost(i, lv) : null;
          if (!cost || c.level < cost.level || p.data.gold < cost.gold) return;
          p.data.gold -= cost.gold;
          c.skills[i] = lv + 1;
          // 새로 배운 스킬은 빈 퀵슬롯에 자동으로 놓는다
          if (lv === 0 && !c.quick.includes(i)) {
            const empty = c.quick.indexOf(-1);
            if (empty >= 0) c.quick[empty] = i;
          }
          this.audio.play('level');
          const name = CLASSES[p.data.currentClass].skills[i].name;
          this.openSkillShop(lv === 0 ? `${name}을(를) 배웠습니다!` : `${name} Lv.${lv + 1}`);
        },
        () => this.resume(),
        message,
      ),
    );
  }

  /** 촌장에게 보고할 수 있는 일일 의뢰가 있는지 */
  private dailyReady(): boolean {
    const p = this.progress;
    const ctx = { count: (id: string) => p.count(id), stones: p.stoneCount, cleared: p.data.cleared, flag: (f: string) => p.flag(f) };
    return this.quests.state.daily.list.some((d) => d.accepted && !d.claimed && objectiveProgress(d.objective, d.progress, ctx) >= objectiveNeed(d.objective));
  }

  private openDaily(): void {
    this.quests.refreshDaily(this.progress.maxTier, this.progress.flag('home') > 0);
    this.openMenu(() =>
      this.screens.dailyBoard(
        this.progress,
        this.quests,
        (i) => {
          const d = this.quests.state.daily.list[i];
          if (!d || d.claimed) return;
          d.claimed = true;
          const p = this.progress;
          if (d.reward.gold) p.data.gold += d.reward.gold;
          for (const [id, n] of Object.entries(d.reward.items ?? {})) p.add(id, n);
          if (d.reward.exp) this.gainExp(d.reward.exp);
          this.audio.play('coin');
          this.hud.toast(`일일 의뢰 완료: ${d.title}`);
          this.openDaily();
        },
        (i) => {
          const d = this.quests.state.daily.list[i];
          if (!d || d.accepted) return;
          d.accepted = true;
          d.progress = 0;
          this.audio.play('pickup');
          this.hud.toast(`일일 의뢰 수락: ${d.title}`);
          this.openDaily();
        },
        () => this.resume(),
      ),
    );
  }

  private openBlueprints(message?: string): void {
    this.openMenu(() =>
      this.screens.blueprints(
        this.progress,
        (t) => {
          const p = this.progress;
          const bp = BUILDINGS[t].blueprint;
          if (!bp || p.flag(`bp_${t}`) || p.data.gold < bp.gold || !p.takeAll(bp.items)) return;
          p.data.gold -= bp.gold;
          p.setFlag(`bp_${t}`);
          this.audio.play('coin');
          this.openBlueprints(`${BUILDINGS[t].name} 도면을 샀습니다`);
        },
        () => this.resume(),
        message,
      ),
    );
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
    this.playSteps(null, after, id);
  }

  private playSteps(steps: Step[] | null, after?: () => void, scriptId?: string): void {
    this.mode = 'dialogue';
    this.hud.setVisible(false);
    this.setBigMap(false);
    const done = () => {
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
    };
    if (scriptId) this.dialogue.play(scriptId, done);
    else this.dialogue.playSteps(steps ?? [], done);
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

  /** 엔딩 후 회차 넘기기: 장비, 레벨, 차원집은 남고 차원석과 스테이지는 다시 */
  private startNewCycle(): void {
    const p = this.progress;
    p.take('resonator', 1);
    p.data.ngPlus++;
    p.data.dimStones = [];
    p.data.cleared = 0;
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
    this.gathering = null;
    // 맞을 때마다 가끔 방어구 하나가 닳는다
    if (Math.random() < 0.25) {
      const armor = (['helmet', 'armor', 'pants', 'boots'] as const).map((k) => this.progress.cls.equipment[k]).filter((e): e is Equip => !!e && durability(e) > 0);
      if (armor.length) this.wearEquip(armor[Math.floor(Math.random() * armor.length)]);
    }
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

  /** 장비 내구도 1 감소. 망가지면 능력치가 사라진다 */
  private wearEquip(e: Equip): void {
    e.dur = Math.max(0, durability(e) - 1);
    if (e.dur === 0) {
      this.applyStats();
      this.hud.toast(`${equipName(e)}이(가) 망가졌습니다! 대장장이 고른에게 수리하세요`, 3000);
    } else if (e.dur === 20) this.hud.toast(`${equipName(e)} 내구도 20 — 수리가 필요합니다`, 2000);
  }

  private gainExp(n: number): void {
    const ups = this.progress.addExp(n);
    if (ups > 0) {
      this.applyStats();
      this.player.hp = this.player.maxHp;
      this.player.mp = this.player.maxMp;
      this.level.effects.pillar(this.player.position.x, this.player.position.z, 0xffe07a);
      this.audio.play('level');
      this.hud.toast(`레벨 업! Lv.${this.progress.cls.level} · 스탯 포인트 +${ups * 5} (캐릭터 → 능력치)`, 3000);
    }
  }

  private monsterKilled(m: Monster): void {
    const run = this.run;
    if (!run || !(this.level instanceof DungeonScene)) return;
    const tier = run.tier;
    const rng = new Rng(randomSeed());
    this.audio.play('kill');
    this.level.particles.burst(m.x, 0.7, m.z, 0xffffff, 12, 1.2);
    this.quests.event({ type: 'kill', tier, elite: m.kind === 'elite' });

    const weapon = this.progress.cls.equipment.weapon;
    if (weapon && durability(weapon) > 0 && Math.random() < 0.12) this.wearEquip(weapon);

    const exp = Math.round(m.exp * (1 + this.progress.data.ngPlus * 0.5));
    run.exp += exp;
    this.gainExp(exp);

    const bossMult = m.kind === 'boss' ? 25 : m.kind === 'midboss' ? 10 : m.kind === 'elite' ? 4 : 1;
    const gold = Math.max(1, Math.round((m.kind === 'normal' ? rng.range(0.6, 1.6) : rng.int(2, 5)) * tier * (1 + (run.stage - 1) * 0.15) * bossMult));
    run.gold += gold;
    this.progress.data.gold += gold;

    const s = this.toScreen(m.x, 1.8, m.z);
    let line = 0;
    const loot = (text: string, color: string) => this.hud.floatText(s.x, s.y - 22 * line++, text, color, 'small');
    loot(`+${gold} G`, '#ffd23a');

    if (rng.chance(m.kind === 'normal' ? 0.18 + run.stage * 0.01 : 1)) {
      const n = m.kind === 'boss' ? 8 + Math.floor(run.stage / 5) : m.kind === 'midboss' ? 5 : m.kind === 'elite' ? 3 + Math.floor(run.stage / 4) : 1;
      const id = ESSENCE(tier);
      const added = run.bag.add(id, n);
      if (added) loot(`+${added} ${ITEMS[id].name}`, hex(ITEMS[id].color));
      else this.hud.toast('가방이 가득 찼습니다');
    }
    // 장비: 중간보스는 좋은 장비를 넉넉히
    const eqCount = m.kind === 'boss' ? 2 : m.kind === 'midboss' ? 2 : rng.chance(m.kind === 'elite' ? 0.4 + run.stage * 0.02 : 0.008 + run.stage * 0.0008) ? 1 : 0;
    const bonus = (m.kind === 'midboss' ? 0.35 : m.kind === 'boss' ? 0.3 : m.kind === 'elite' ? 0.12 : 0) + run.stage * 0.01;
    for (let i = 0; i < eqCount; i++) {
      const e = rollEquip(rng, tier, this.progress.data.currentClass, bonus);
      if (run.bag.addEquip(e)) loot(`${GRADES[e.grade].name} ${equipName(e)}`, hex(GRADES[e.grade].color));
      else this.hud.toast('가방이 가득 차서 장비를 줍지 못했습니다');
    }
    if (m.kind === 'midboss') {
      const stone = tier <= 2 ? 'stone_low' : tier <= 5 ? 'stone_mid' : 'stone_high';
      if (run.bag.add(stone, 2)) loot(`+2 ${ITEMS[stone].name}`, hex(ITEMS[stone].color));
      run.bag.add('potion', 2);
    }

    if (m.isBoss) {
      this.hud.setBoss(null);
      this.audio.playMusic('dungeon');
    }
    if (m.isFinal) {
      const p = this.progress;
      if (!p.data.dimStones.includes(tier)) {
        p.data.dimStones.push(tier);
        this.audio.play('stone');
        this.level.effects.pillar(m.x, m.z, 0x5ef0ff, 8);
        this.hud.toast(`차원석을 얻었다! (${p.stoneCount}/7)`, 4000);
      }
    }
    this.refreshHud();
  }

  /** 방의 몬스터를 모두 쓰러뜨렸을 때 */
  private roomClear(): void {
    const run = this.run!;
    run.roomCleared = true;
    run.stagesCleared++;
    const g = stageIndex(run.tier, run.stage);
    const p = this.progress;
    p.data.cleared = Math.max(p.data.cleared, g);
    this.quests.event({ type: 'stage' });
    this.audio.play('portal');
    this.saveNow();
    this.refreshHud();
    this.openMenu(() =>
      this.screens.ask(
        `${run.tier}-${run.stage} 클리어!`,
        '워프 게이트가 열렸습니다. 워프 게이트로 이동하시겠습니까?',
        () => {
          this.afterMenu = () => this.moveToWarp();
          this.screens.close();
        },
        () => this.resume(),
      ),
    );
  }

  /** 워프 게이트 바로 앞 빈 바닥으로 순간이동 */
  private moveToWarp(): void {
    const lv = this.level;
    if (!(lv instanceof DungeonScene)) return;
    const gate = lv.interactables.find((i) => i.id === 'exit');
    if (!gate) return;
    const pos = this.player.position;
    for (let r = 1.6; r <= 4; r += 0.8) {
      for (let k = 0; k < 8; k++) {
        const a = (k / 8) * Math.PI * 2;
        const x = gate.x + Math.sin(a) * r;
        const z = gate.z + Math.cos(a) * r;
        if (!isFloor(lv.grid, Math.floor(x / TILE), Math.floor(z / TILE))) continue;
        if (lv.obstacles.some((o) => Math.hypot(o.x - x, o.z - z) < o.radius + PLAYER.radius)) continue;
        lv.effects.ring(pos.x, pos.z, 1.5, 0x7affc0, 0.4);
        this.player.setPosition(x, z);
        lv.effects.pillar(x, z, 0x7affc0);
        this.audio.play('portal');
        return;
      }
    }
  }

  private openWarp(): void {
    const run = this.run;
    if (!run) return;
    const g = stageIndex(run.tier, run.stage);
    const next = g < MAX_STAGE ? stageOf(g + 1) : null;
    this.openMenu(() =>
      this.screens.warp(
        `${run.tier}-${run.stage}`,
        next ? `${next.tier}-${next.stage}` : null,
        () => {
          this.afterMenu = () => this.enterDungeon(next!.tier, next!.stage);
          this.screens.close();
        },
        () => {
          this.afterMenu = () => this.finishRun('귀환 성공');
          this.screens.close();
        },
        () => this.resume(),
      ),
    );
  }

  // =============== 채집 ===============
  private startGather(n: NodeInstance): void {
    if (!n.alive) return;
    const p = this.progress;
    if (n.def.style !== 'chest') {
      const tool = n.def.style === 'tree' ? 'tool_axe' : 'tool_pickaxe';
      if (!p.flag(tool)) {
        this.hud.toast(tool === 'tool_axe' ? '도끼가 있어야 나무를 벨 수 있습니다 (대장장이 고른)' : '곡괭이가 있어야 캘 수 있습니다 (대장장이 고른)', 2500);
        return;
      }
      const key: ToolKind = tool === 'tool_axe' ? 'axe' : 'pickaxe';
      const t = p.data.tools[key];
      if (t.dur <= 0) {
        this.hud.toast(`${toolName(key, t)}이(가) 망가졌습니다. 대장장이 고른에게 수리를 맡기세요`, 2500);
        return;
      }
      if (toolWear(t, n.def.tier) === null) {
        this.hud.toast(`${n.def.name}은(는) ${TOOL_TIER_NAMES[n.def.tier - 2]} ${TOOL_KIND_NAMES[key]} 이상이 있어야 캘 수 있습니다 (차원집 제작대)`, 3000);
        return;
      }
    }
    this.gathering = n;
  }

  /** 채집 중: 도구를 휘두를 때마다 한 번씩 캔다. 움직이면 멈춘다 */
  private updateGather(move: { x: number; y: number }): void {
    const n = this.gathering;
    const pl = this.player;
    if (!n) return;
    if (this.level instanceof DungeonScene && this.level.monsterNear(n.x, n.z)) {
      this.gathering = null;
      this.hud.toast('몬스터가 가까이 있어 채집을 멈췄습니다');
      return;
    }
    if (!n.alive || n.dying > 0 || Math.hypot(move.x, move.y) > 0.25 || Math.hypot(n.x - pl.position.x, n.z - pl.position.z) > n.def.radius + 2.2) {
      this.gathering = null;
      return;
    }
    if (!pl.canAct) return;
    const chest = n.def.style === 'chest';
    pl.startAction(
      {
        pose: chest ? 'thrust' : 'gather',
        tool: n.def.style === 'tree' ? 'axe' : 'pickaxe',
        duration: chest ? 0.35 : 0.7 / toolSpeed(this.progress.data.tools[n.def.style === 'tree' ? 'axe' : 'pickaxe']),
        hitAt: 0.6,
        moveMult: 0,
        onHit: () => this.gather(n),
      },
      Math.atan2(n.x - pl.position.x, n.z - pl.position.z),
    );
  }

  private gather(n: NodeInstance): void {
    if (!(this.level instanceof DungeonScene) || !this.run) return;
    const s = this.toScreen(n.x, 1.6, n.z);
    let line = 0;
    if (n.def.style !== 'chest') {
      const key: ToolKind = n.def.style === 'tree' ? 'axe' : 'pickaxe';
      const t = this.progress.data.tools[key];
      const before = t.dur;
      t.dur = Math.max(0, t.dur - (toolWear(t, n.def.tier) ?? 1));
      if (t.dur === 0) {
        this.gathering = null;
        this.hud.toast(`${toolName(key, t)}이(가) 망가졌습니다! (대장장이 고른에게 수리)`, 3000);
      } else if (before > 20 && t.dur <= 20) this.hud.toast(`${toolName(key, t)} 내구도가 얼마 남지 않았습니다`, 2000);
    }
    const drops = this.level.hitNode(n);
    // 강화한 도구는 확률적으로 하나 더 캔다
    if (n.def.style !== 'chest' && drops.length && Math.random() < toolBonusChance(this.progress.data.tools[n.def.style === 'tree' ? 'axe' : 'pickaxe'])) drops.push({ itemId: drops[0].itemId, count: 1 });
    for (const drop of drops) {
      const added = this.run.bag.add(drop.itemId, drop.count);
      const item = ITEMS[drop.itemId];
      if (added > 0) {
        this.hud.floatText(s.x, s.y - line++ * 22, `+${added} ${item.name}`, hex(item.color), 'small');
        this.quests.event({ type: 'gather', item: drop.itemId, count: added });
      }
      if (added < drop.count) {
        this.hud.toast('가방이 가득 찼습니다');
        this.gathering = null;
      }
    }
    this.shakeT = Math.max(this.shakeT, 0.08);
    this.audio.play('gather');
    this.refreshHud();
  }

  /** 던전을 무사히 나왔다 (워프 게이트 또는 귀환석) */
  private finishRun(title: string): void {
    const run = this.run;
    if (!run) return;
    const p = this.progress;
    // 가방의 짐은 그대로 들고 나온다. 창고에 넣는 건 창고에서 직접
    const items = new Map<string, number>();
    for (const bag of [run.bag, run.dimBag]) for (const [id, n] of bag.totals()) items.set(id, (items.get(id) ?? 0) + n);
    for (const [id, n] of run.start) {
      const left = (items.get(id) ?? 0) - n;
      if (left > 0) items.set(id, left);
      else items.delete(id);
    }
    const equips = [...run.bag.equips(), ...run.dimBag.equips()].filter((e) => !run.startEquips.has(e.uid));
    p.setFlag('returned');
    this.audio.play('portal');
    const explored = this.exploredRatio();
    this.run = null;
    this.saveNow();
    this.openMenu(
      () =>
        this.screens.result(
          { title, items, equips, seconds: run.time, explored, gold: run.gold, exp: run.exp, stages: run.stagesCleared },
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
    run.bag.clear();
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
            stages: run.stagesCleared,
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

  // =============== 공장 ===============
  private buildingUnlocked(t: BuildingType): boolean {
    return !BUILDINGS[t].blueprint || this.progress.flag(`bp_${t}`) > 0;
  }

  private openBuilding(b: BuildingState): void {
    const p = this.progress;
    const save = () => this.saveNow();
    if (b.type === 'generator') this.openMenu(() => this.screens.generator(this.factory, b, p, save, () => this.resume()));
    else if (b.type === 'box') this.openMenu(() => this.screens.box(b, p, save, () => this.resume()));
    else if (MACHINE_TYPES.has(b.type)) this.openMenu(() => this.screens.machine(this.factory, b, p, save, () => this.resume()));
    else if (b.type === 'workbench') this.openMenu(() => this.screens.workbench(this.factory, b, p, () => {
      this.applyStats();
      save();
    }, () => this.resume()));
  }

  private buildMode(on: boolean): void {
    this.building = on;
    this.hud.setBuilding(on);
    if (on) this.buildBar.show((t) => this.buildingUnlocked(t));
    else this.buildBar.hide();
    if (this.level instanceof HomeScene) {
      this.level.setBuildMode(on);
      if (!on) this.level.hideGhost();
    }
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
    this.camera.zoom = Math.min(1, viewW / (L * 1.55), viewH / (L * 1.25));
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

  /**
   * 건설 입력:
   * - 레일·마력선·철거: 누르고 끌면 연속으로
   * - 그 밖의 건물: 누른 채 움직이면 미리보기가 따라오고, 손을 떼면 그 자리에 짓는다
   */
  private setupBuildPointer(): void {
    const canvas = this.renderer.domElement;
    const isLine = () => this.buildBar.tool === 'belt' || this.buildBar.tool === 'wire' || this.buildBar.tool === 'remove';
    canvas.addEventListener('pointerdown', (e) => {
      if (!this.building || this.mode !== 'play') return;
      const cell = this.pickCell(e);
      if (!cell) return;
      canvas.setPointerCapture(e.pointerId);
      if (isLine()) {
        this.dragCell = cell;
        this.applyTool(cell, null);
      } else {
        this.ghostCell = cell;
        this.updateGhost(cell);
      }
    });
    canvas.addEventListener('pointermove', (e) => {
      if (!this.building || !(this.level instanceof HomeScene)) return;
      const cell = this.pickCell(e);
      if (!isLine()) {
        // 마우스는 누르지 않아도 미리보기를 보여 준다
        if (cell && (this.ghostCell || e.pointerType === 'mouse')) {
          if (this.ghostCell) this.ghostCell = cell;
          this.updateGhost(cell);
        } else if (!cell) this.level.hideGhost();
        return;
      }
      this.level.hideGhost();
      if (cell) this.level.showCursor(cell.x, cell.y, this.buildBar.tool === 'remove' ? !!this.factory.at(cell.x, cell.y) : !this.factory.at(cell.x, cell.y));
      else this.level.hideCursor();
      if (!this.dragCell || !cell || (cell.x === this.dragCell.x && cell.y === this.dragCell.y)) return;
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
    const end = (e: PointerEvent) => {
      this.dragCell = null;
      if (this.ghostCell && this.building && e.type === 'pointerup') {
        const cell = this.ghostCell;
        this.ghostCell = null;
        this.applyTool(cell, null);
        if (e.pointerType !== 'mouse' && this.level instanceof HomeScene) this.level.hideGhost();
      }
      this.ghostCell = null;
    };
    canvas.addEventListener('pointerup', end);
    canvas.addEventListener('pointercancel', end);
  }

  private updateGhost(cell: { x: number; y: number }): void {
    if (!(this.level instanceof HomeScene)) return;
    const tool = this.buildBar.tool;
    if (tool === 'remove') return;
    const existing = this.factory.at(cell.x, cell.y);
    const ok = (!existing || existing.type === tool) && this.progress.hasAll(BUILDINGS[tool].cost);
    this.level.showGhost(tool, cell.x, cell.y, existing && existing.type === tool ? existing.dir : this.buildBar.dir, ok);
    this.level.showCursor(cell.x, cell.y, ok);
  }

  private applyTool(cell: { x: number; y: number }, from: { x: number; y: number } | null): void {
    const f = this.factory;
    const p = this.progress;
    const tool = this.buildBar.tool;
    const existing = f.at(cell.x, cell.y);
    if (tool === 'remove') {
      if (!existing) return;
      f.remove(cell.x, cell.y, (id, n) => p.add(id, n));
      for (const [id, n] of Object.entries(BUILDINGS[existing.type].cost)) p.add(id, n);
      this.audio.play('build');
      return;
    }
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
    this.quests.event({ type: 'build', building: tool });
    this.audio.play('build');
    this.level.particles.burst((cell.x + 0.5) * TILE, 0.5, (cell.y + 0.5) * TILE, BUILDINGS[tool].color, 5, 0.6);
  }

  // =============== 매 프레임 ===============
  private frame(now: number): void {
    const dt = Math.min(0.05, (now - this.lastTime) / 1000);
    this.lastTime = now;

    // 공장은 어디에 있든 계속 돌아간다
    if (this.mode !== 'title' && this.progress.flag('home')) {
      this.factoryAcc += dt;
      while (this.factoryAcc >= 0.1) {
        this.factory.step(0.1);
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
    if (input.consume('pause')) {
      if (this.bigMap) return this.setBigMap(false);
      return this.openPause();
    }
    if (input.consume('bag')) return this.openBagOrInventory();
    if (input.consume('char')) return this.openInventory('equip');
    if (input.consume('map')) this.setBigMap(!this.bigMap);
    if (input.consume('build')) {
      if (this.level instanceof HomeScene) this.setBuilding(!this.building);
    }

    // 연타한 공격 입력을 잠시 기억해 두었다가 쓸 수 있을 때 쓴다
    if (input.consume('attack')) this.attackBuffer = 0.35;
    this.attackBuffer = Math.max(0, this.attackBuffer - dt);

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

    if (input.consume('interact') && near) {
      near.action();
      if (this.mode !== 'play') return;
    }
    if (input.consume('dodge') && !this.building && pl.startRoll(move)) {
      this.gathering = null;
      this.audio.play('dash');
    }
    for (let i = 0; i < 3; i++) {
      if (input.consume(`skill${i + 1}` as 'skill1')) {
        const idx = this.progress.cls.quick[i] ?? -1;
        const msg = idx < 0 ? '스킬 칸이 비어 있습니다 (캐릭터 → 스킬에서 배치)' : this.combat.useSkill(idx);
        if (msg) this.hud.toast(msg);
        else this.gathering = null;
      }
    }
    if (input.consume('potion')) this.drinkPotion();
    if ((this.attackBuffer > 0 || input.attackHeld) && !this.building && pl.canAct) {
      this.attackBuffer = 0;
      this.gathering = null;
      this.combat.basicAttack();
    }
    if (!this.building) this.updateGather(move);

    const level = this.level;
    const obstacles = level instanceof DungeonScene ? level.playerObstacles() : level.obstacles;
    pl.update(dt, {
      move,
      applyMove: (dx, dz) => moveWithCollision(level.grid, pl.position, dx, dz, PLAYER.radius, obstacles),
    });
    level.update(dt, pl.position);

    if (level instanceof DungeonScene && this.run) {
      const boss = level.boss;
      if (boss && boss.alive && boss.aggro) {
        this.hud.setBoss(`${boss.name}${boss.phase2 ? ' · 격노' : ''}`, boss.hp / boss.maxHp);
        this.audio.playMusic('boss');
      }
      if (!this.run.roomCleared && level.exitOpen) this.roomClear();
    }
    this.updateMap(dt);
    this.refreshHud();
  }

  private updateMap(dt: number): void {
    const mm = this.minimap;
    if (!mm) return;
    const pl = this.player;
    const level = this.level;
    if (level instanceof DungeonScene) mm.reveal(pl.position.x, pl.position.z);
    this.minimapTimer -= dt;
    if (this.minimapTimer > 0) return;
    this.minimapTimer = this.bigMap ? 0.2 : 0.1;
    const markers: MapMarker[] = [];
    if (level instanceof DungeonScene) {
      for (const n of level.nodes) if (n.alive) markers.push({ x: n.x, z: n.z, color: hex(n.def.accentColor), size: 0.45 });
      for (const m of level.monsters) if (m.alive) markers.push({ x: m.x, z: m.z, color: m.isBoss ? '#ff3030' : '#ff7a7a', size: m.isBoss ? 1 : 0.4, label: m.isBoss ? m.name : undefined });
      const exit = level.portals.find((p) => p.kind === 'exit')!;
      markers.push({ x: exit.x, z: exit.z, color: level.exitOpen ? hex(level.theme.portalColor) : '#777', size: 1.1, label: '워프 게이트' });
    } else {
      for (const it of level.interactables) {
        if (!it.title) continue;
        const npc = NPC_IDS.has(it.id);
        markers.push({ x: it.x, z: it.z, color: npc ? '#ffe07a' : '#8fd8ff', size: npc ? 0.7 : 0.9, label: it.title });
      }
    }
    mm.draw({ ...pl.position, facing: pl.facing }, markers, false);
    if (this.bigMap) mm.draw({ ...pl.position, facing: pl.facing }, markers, true);
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
      const d = this.level;
      const left = d.aliveCount;
      const boss = d.boss && d.boss.alive ? ` · ${d.boss.name}` : '';
      const head = left > 0 ? `남은 몬스터 ${left}${boss} (M: 지도)` : '워프 게이트로 가자 (다음 방 / 마을)';
      this.hud.setObjective([head, ...questLines(p, this.quests)].join('\n'));
    } else this.hud.setObjective(objective(p, this.quests));
    this.hud.setPotions(p.count('potion'));
    this.hud.setDodgeCooldown(pl.rollCooldown / (PLAYER.rollCooldown + PLAYER.rollTime));
    const skills = pl.cls.skills;
    const quick = p.cls.quick.map((i) => (i >= 0 && (p.cls.skills[i] ?? 0) > 0 ? i : -1));
    this.hud.setSkills(
      quick.map((i) => (i >= 0 ? (this.combat.cooldowns[i] ?? 0) / skills[i].cooldown : 0)),
      quick.map((i) => i < 0 || pl.mp >= skills[i].mp),
      quick.map((i) => (i >= 0 ? skills[i].name : null)),
    );
    const inv = this.run ? this.run.bag : this.progress.invBag;
    this.hud.setBagCount(inv.used, BAG_SLOTS);
  }

  /** 이름표와 생산 아이콘 */
  private updateLabels(): void {
    if (this.mode !== 'play') {
      this.hud.setLabels([]);
      this.hud.setBubbles([]);
      return;
    }
    const labels: { text: string; x: number; y: number; accent?: boolean }[] = [];
    const p = this.player.position;
    if (!this.building) {
      for (const it of this.level.interactables) {
        if (!it.title || Math.hypot(it.x - p.x, it.z - p.z) > 14) continue;
        const isNpc = NPC_IDS.has(it.id);
        let mark = '';
        if (isNpc) {
          const ref = it.id as NpcRef;
          const dailyReady = it.id === 'chief' && this.dailyReady();
          if (dailyReady || this.quests.activeFor(ref).some((q) => this.quests.canComplete(q))) mark = '? ';
          else if (hasStory(it.id as NpcId, this.progress) || this.quests.available(ref).length) mark = '! ';
        }
        const s = this.toScreen(it.x, isNpc ? 2.3 : it.id === 'portal' ? 4.6 : 3.3, it.z);
        labels.push({ text: `${mark}${it.title}`, x: s.x, y: s.y, accent: !!mark });
      }
    }
    // 보관상자 위에 투입/출하 표시
    if (this.level instanceof HomeScene) {
      for (const b of this.factory.state.buildings) {
        if (b.type !== 'box') continue;
        const s = this.toScreen((b.x + 0.5) * TILE, 1.9, (b.y + 0.5) * TILE);
        labels.push({ text: b.mode === 'in' ? '📥 투입' : '📤 출하', x: s.x, y: s.y, accent: b.mode !== 'in' });
      }
    }
    this.hud.setLabels(labels);
    if (this.level instanceof HomeScene) {
      this.hud.setBubbles(
        this.level.producing().map(({ b, x, z }) => {
          const s = this.toScreen(x, 2.6, z);
          const r = RECIPE_BY_ID[b.crafting!];
          return { x: s.x, y: s.y, icon: itemIconUrl(r.output), progress: b.progress ?? 0, onClick: () => this.openBuilding(b) };
        }),
      );
    } else this.hud.setBubbles([]);
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
    return { mode: this.mode, level: this.level.kind, player: { ...this.player.position, hp: this.player.hp }, gold: this.progress.data.gold, stones: this.progress.data.dimStones, cleared: this.progress.data.cleared };
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
