import {
  Color,
  DoubleSide,
  Group,
  Material,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  PlaneGeometry,
  Quaternion,
  Scene,
} from 'three';
import { ARCHETYPES, tierScale, type Archetype, type ArchetypeDef } from '../data/monsters';
import { BOSS_SPECIES, MIDBOSS_SPECIES, type DebuffSpec, type SpeciesDef } from '../data/species';
import { moveWithCollision, type CircleObstacle } from '../dungeon/collision';
import { TILE } from '../config';
import { isFloor, type DungeonData } from '../dungeon/generator';
import { buildMonster, MONSTER_COLORS, type MonsterRig } from '../models/monsters';
import { Telegraph, type Effects, type TelegraphShape } from './Effects';

export type MonsterKind = 'normal' | 'elite' | 'midboss' | 'boss';

/** down: 해골이 무너져 뼈 무더기가 된 상태 (잠시 뒤 다시 일어난다) */
type State = 'idle' | 'chase' | 'windup' | 'dash' | 'recover' | 'down' | 'dead';

/** 보스 패턴 + 일반 몬스터가 쓰는 공격 이름 */
type BossPattern = 'slam' | 'cone' | 'volley' | 'charge' | 'summon' | 'rain' | 'cross' | 'nova' | 'barrage' | 'doom' | 'spin' | 'bolt' | 'aoe' | 'thrust';

export interface ProjectileSpec {
  x: number;
  z: number;
  angle: number;
  speed: number;
  damage: number;
  color: number;
  radius?: number;
  kind?: 'orb' | 'arrow' | 'shard' | 'wave';
  /** 맞으면 거는 약화 효과 */
  debuff?: DebuffSpec;
}

export interface MonsterWorld {
  grid: DungeonData;
  obstacles: CircleObstacle[];
  scene: Scene;
  effects: Effects;
  player: { x: number; z: number };
  monsters: Monster[];
  /** 플레이어에게 피해. 실제로 들어간 피해를 돌려준다 (막거나 피하면 0) */
  hurtPlayer(dmg: number, fromX: number, fromZ: number, debuff?: DebuffSpec): number;
  fireEnemyProjectile(spec: ProjectileSpec): void;
  /** 종족 id나 행동 유형으로 몬스터를 불러낸다 */
  summon(what: string, x: number, z: number): Monster;
  /** 바닥에 한동안 남아 밟으면 피해를 주는 장판 (독 웅덩이 등) */
  hazard(x: number, z: number, r: number, duration: number, dps: number, color: number, debuff?: DebuffSpec): void;
  announce(text: string): void;
  /** 피할 수 없는 즉사 */
  killPlayer(): void;
  burst(x: number, y: number, z: number, color: number, count: number, power?: number): void;
  shake(amount: number): void;
}

/** 앞의 세 패턴은 중간보스도 쓰고, 수호자는 전부 쓴다 */
const BOSS_PATTERNS: BossPattern[][] = [
  ['slam', 'cone', 'cross', 'summon', 'nova'],
  ['charge', 'slam', 'cross', 'cone', 'barrage'],
  ['volley', 'rain', 'nova', 'summon', 'cross'],
  ['volley', 'slam', 'barrage', 'rain', 'nova'],
  ['slam', 'charge', 'cross', 'volley', 'summon', 'barrage'],
  ['cone', 'rain', 'nova', 'charge', 'slam', 'cross'],
  ['volley', 'rain', 'cross', 'charge', 'summon', 'slam', 'nova', 'barrage'],
];

const HIT_TINT = new Color(0xffffff);
/** 가까이 붙지 않고 거리를 벌리는 행동 유형 */
const KEEP_DIST: Partial<Record<Archetype, number>> = { ranged: 5.5, archer: 6, necro: 7, shaman: 6, caster: 6.5, spitter: 5 };
/** 예고 중에도 플레이어를 따라 조준하는 행동 유형 */
const AIMED = new Set<Archetype>(['ranged', 'archer', 'necro']);

export class Monster {
  readonly rig: MonsterRig;
  readonly def: ArchetypeDef;
  readonly name: string;
  readonly material: MeshLambertMaterial;
  maxHp: number;
  hp: number;
  atk: number;
  defense: number;
  speed: number;
  radius: number;
  x: number;
  z: number;
  facing = 0;
  state: State = 'idle';
  aggro = false;
  /** 레이드 보스: 체력 줄 수 (일반 몬스터는 1) */
  readonly bars: number;
  /** 보호막 기믹 중에는 피해를 받지 않는다 (수호병을 모두 쓰러뜨리면 풀린다) */
  shielded = false;
  private guards: Monster[] = [];
  /** 남은 줄 수가 이 값이 되면 기믹 발동 */
  private gimmickAt: number[] = [];
  private pendingGimmick = 0;
  /** 제한 시간이 끝나 즉사기를 쓰는 중 (피해를 받지 않는다) */
  dooming = false;
  /** 감속 남은 시간 */
  slow = 0;
  private t = 0;
  private flash = 0;
  private knockX = 0;
  private knockZ = 0;
  private telegraph: Telegraph | null = null;
  private dashLeft = 0;
  private dashHit = false;
  private walkPhase = Math.random() * 10;
  private bossQueue: BossPattern[] = [];
  private pattern: BossPattern | null = null;
  private rainSpots: Telegraph[] = [];
  private hpBar: Group;
  private hpFill: Mesh;
  readonly obstacle: CircleObstacle;
  readonly exp: number;
  deathTime = 0;
  readonly arch: Archetype;
  readonly species: SpeciesDef;
  /** 특수 행동용 타이머 (치유·소환·순간이동) */
  private skillT = 0;
  private attackCount = 0;
  private summoned: Monster[] = [];
  /** 격노 (광전사: 체력이 절반 아래) */
  private enraged = false;
  /** 방패로 막았을 때 불꽃 */
  private blockFx = 0;
  /** 해골: 이미 한 번 되살아났는지 */
  private revived = false;
  /** 슬라임: 쓰러질 때 나뉠 차례 */
  private pendingSplit = false;
  /** 마지막으로 맞은 뒤 지난 시간 (트롤 재생) */
  private sinceHit = 99;
  /** 겁쟁이: 도망치는 남은 시간 */
  private fleeT = 0;
  private fled = false;

  constructor(
    species: SpeciesDef,
    readonly kind: MonsterKind,
    readonly tier: number,
    stage: number,
    ngPlus: number,
    x: number,
    z: number,
    readonly homeRoom: number,
  ) {
    const boss = kind === 'boss' || kind === 'midboss';
    this.species = kind === 'boss' ? BOSS_SPECIES[tier - 1] : kind === 'midboss' ? MIDBOSS_SPECIES[tier - 1] : species;
    const archetype = this.species.arch;
    this.arch = archetype;
    this.def = ARCHETYPES[archetype];
    const scale = tierScale(tier, stage, ngPlus);
    // 보스 체력은 모양(원형)과 관계없이 같은 기준(220)에서 계산한다.
    // 기준: 구리 무기 +5로 X-10 수호자를 5분 안에 잡을 수 있을 정도
    const mult = kind === 'boss' ? { hp: 39, atk: 1.6, size: 2.1 } : kind === 'midboss' ? { hp: 21, atk: 1.4, size: 1.65 } : kind === 'elite' ? { hp: 3, atk: 1.4, size: 1.35 } : { hp: 1, atk: 1, size: 1 };
    this.maxHp = this.hp = Math.round((boss ? 220 : this.def.hp) * scale.hp * mult.hp);
    // 중간보스 5줄 (3줄을 깎으면 보호막), 수호자 7줄 (3줄·5줄에서 보호막)
    this.bars = kind === 'boss' ? 7 : kind === 'midboss' ? 5 : 1;
    this.gimmickAt = kind === 'boss' ? [4, 2] : kind === 'midboss' ? [2] : [];
    this.atk = this.def.atk * scale.atk * mult.atk;
    this.defense = (boss ? 6 : this.def.def) * scale.def;
    this.speed = this.def.speed * (boss ? 0.95 : 1);
    this.radius = this.def.radius * mult.size;
    this.x = x;
    this.z = z;
    this.name = (kind === 'elite' ? '정예 ' : '') + this.species.name;
    this.exp = Math.round(this.def.exp * Math.pow(tier, 1.6) * (1 + (stage - 1) * 0.15) * (kind === 'boss' ? 30 : kind === 'midboss' ? 15 : kind === 'elite' ? 3 : 0.3));

    this.material = new MeshLambertMaterial({ vertexColors: true, flatShading: true });
    const colors = this.species.colors ?? MONSTER_COLORS[tier - 1];
    this.rig = buildMonster(this.material, this.species.model, kind === 'elite' ? { ...colors, accent: 0xffd23a } : colors, boss, kind === 'elite' ? 0xffd23a : this.species.glow);
    this.rig.root.scale.setScalar(mult.size);
    if (kind === 'elite') this.material.emissive.setHex(0x3a2a00);
    this.rig.root.position.set(x, 0, z);
    this.rig.root.rotation.y = Math.random() * Math.PI * 2;
    this.facing = this.rig.root.rotation.y;
    this.obstacle = { x, z, radius: this.radius };

    // 머리 위 체력바 (보스는 화면 위쪽 HUD로 보여 준다)
    this.hpBar = new Group();
    const bg = new Mesh(new PlaneGeometry(1.1, 0.13), new MeshBasicMaterial({ color: 0x220a0a, side: DoubleSide, depthTest: false }));
    this.hpFill = new Mesh(new PlaneGeometry(1.06, 0.09), new MeshBasicMaterial({ color: kind === 'elite' ? 0xffc23a : 0xff4a4a, side: DoubleSide, depthTest: false }));
    this.hpFill.geometry.translate(0.53, 0, 0);
    this.hpFill.position.x = -0.53;
    this.hpFill.position.z = 0.001;
    bg.renderOrder = 10;
    this.hpFill.renderOrder = 11;
    this.hpBar.add(bg, this.hpFill);
    this.hpBar.position.set(x, this.rig.height * mult.size + 0.35, z);
    this.hpBar.visible = false;
  }

  get alive(): boolean {
    return this.state !== 'dead';
  }

  /** 수호자와 중간보스 (보스 패턴을 쓴다) */
  get isBoss(): boolean {
    return this.kind === 'boss' || this.kind === 'midboss';
  }

  /** 차원석을 지닌 10번째 방의 수호자 */
  get isFinal(): boolean {
    return this.kind === 'boss';
  }

  get phase2(): boolean {
    return this.isBoss && this.hp < this.maxHp * 0.5;
  }

  addTo(scene: Scene): void {
    scene.add(this.rig.root, this.hpBar);
  }

  removeFrom(scene: Scene): void {
    scene.remove(this.rig.root, this.hpBar);
    this.clearTelegraph(scene);
  }

  /** 남은 체력 줄 수 */
  get barsLeft(): number {
    return Math.max(0, Math.ceil((this.hp / this.maxHp) * this.bars - 1e-6));
  }

  get guardsLeft(): number {
    return this.guards.filter((g) => g.alive).length;
  }

  /** 피해를 받는다. 죽었으면 true */
  damage(amount: number, fromX: number, fromZ: number, knock: number): boolean {
    if (!this.alive) return false;
    if (this.state === 'down') return false;
    this.sinceHit = 0;
    if (this.shielded || this.dooming) {
      this.flash = 0.5;
      return false;
    }
    // 방패병: 정면에서 들어온 공격은 대부분 막는다 (등 뒤나 옆을 노려야 한다)
    if (this.arch === 'knight' && !this.isBoss && this.state !== 'recover' && this.state !== 'dash') {
      const a = Math.atan2(fromX - this.x, fromZ - this.z);
      let d = Math.abs(((a - this.facing + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
      if (d < 1.0) {
        amount *= 0.3;
        this.blockFx = 0.25;
      }
    }
    this.hp -= amount;
    // 기믹 줄에 닿으면 그 줄에서 멈추고 기믹을 준비한다
    const t = this.gimmickAt[0];
    if (t !== undefined && this.hp <= (this.maxHp * t) / this.bars) {
      this.hp = (this.maxHp * t) / this.bars;
      this.gimmickAt.shift();
      this.pendingGimmick = t;
    }
    this.flash = 1;
    this.aggro = true;
    const d = Math.hypot(this.x - fromX, this.z - fromZ) || 1;
    // 보스와 공격 중인 적은 잘 밀리지 않는다
    const resist = this.isBoss ? 0.1 : this.state === 'windup' || this.state === 'dash' ? 0.3 : 1;
    this.knockX += ((this.x - fromX) / d) * knock * resist;
    this.knockZ += ((this.z - fromZ) / d) * knock * resist;
    this.hpBar.visible = !this.isBoss;
    this.hpFill.scale.x = Math.max(0.001, this.hp / this.maxHp);
    if (this.hp <= 0) {
      // 해골: 한 번은 뼈 무더기로 무너졌다가 다시 일어난다
      if (this.species.trait === 'revive' && !this.revived && !this.isBoss) {
        this.revived = true;
        this.hp = 0;
        this.clearTelegraphLater = true;
        this.setState('down');
        this.hpBar.visible = false;
        return false;
      }
      if (this.species.trait === 'split' && !this.isBoss) this.pendingSplit = true;
      this.state = 'dead';
      this.deathTime = 0;
      this.hpBar.visible = false;
      return true;
    }
    return false;
  }

  /** 플레이어를 때린다: 약화 효과를 걸고, 흡혈 종족은 체력을 빨아들인다 */
  private hitPlayer(world: MonsterWorld, dmg: number, x: number, z: number): void {
    const dealt = world.hurtPlayer(dmg, x, z, this.isBoss ? undefined : this.species.debuff);
    if (dealt > 0 && this.species.trait === 'lifesteal') {
      this.hp = Math.min(this.maxHp, this.hp + dealt * 0.5);
      this.hpFill.scale.x = Math.max(0.001, this.hp / this.maxHp);
      world.effects.sparks(this.x, 1, this.z, 0xff3a4a, 6, { up: true, spread: 0.3 });
    }
  }

  private animateDown(): void {
    this.rig.root.position.set(this.x, 0, this.z);
  }

  /** 무너져 있는지 (공격이 통하지 않는다) */
  get isDown(): boolean {
    return this.state === 'down';
  }
  private clearTelegraphLater = false;

  private setState(s: State): void {
    this.state = s;
    this.t = 0;
  }

  private clearTelegraph(scene: Scene): void {
    if (this.telegraph) {
      scene.remove(this.telegraph.group);
      this.telegraph.dispose();
      this.telegraph = null;
    }
    for (const r of this.rainSpots) {
      scene.remove(r.group);
      r.dispose();
    }
    this.rainSpots = [];
  }

  /** 제한 시간 초과: 방 전체를 뒤덮는 즉사기. 예고가 끝나면 무조건 쓰러진다 */
  startDoom(world: MonsterWorld): void {
    if (this.dooming || !this.alive) return;
    this.dooming = true;
    this.bossQueue = [];
    for (const r of this.rainSpots) world.scene.remove(r.group);
    this.rainSpots = [];
    this.pattern = 'doom';
    this.startTelegraph(world, { kind: 'circle', r: 40 }, this.x, this.z, 0, 4);
    this.setState('windup');
    world.shake(0.8);
    world.announce(`제한 시간 초과! ${this.name}이(가) 틈새를 붕괴시킨다…`);
  }

  private startTelegraph(world: MonsterWorld, shape: TelegraphShape, x: number, z: number, facing: number, duration: number): void {
    this.clearTelegraph(world.scene);
    this.telegraph = new Telegraph(shape, x, z, facing, duration);
    world.scene.add(this.telegraph.group);
  }

  update(dt: number, world: MonsterWorld, cameraQuat: Quaternion): void {
    this.t += dt;
    this.hpBar.quaternion.copy(cameraQuat);

    // 레이드 기믹: 보호막 + 수호병 소환. 수호병을 모두 쓰러뜨리면 보호막이 깨진다
    if (this.pendingGimmick && this.alive) {
      const second = this.kind === 'boss' && this.pendingGimmick === 2;
      this.pendingGimmick = 0;
      this.shielded = true;
      const n = second ? 6 : 4;
      const kinds: Archetype[] = second ? ['tank', 'ranged', 'charger'] : ['melee', 'ranged'];
      this.guards = [];
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        const g = world.summon(kinds[i % kinds.length], this.x + Math.cos(a) * 4, this.z + Math.sin(a) * 4);
        this.guards.push(g);
      }
      world.effects.ring(this.x, this.z, 5, 0x7fd6ff, 0.8);
      world.shake(0.6);
      world.announce(`${this.name}이(가) 보호막을 펼쳤다! 수호병 ${n}마리를 쓰러뜨려라`);
    }
    if (this.shielded && this.guardsLeft === 0) {
      this.shielded = false;
      world.effects.ring(this.x, this.z, 4, 0xffffff, 0.5);
      world.shake(0.4);
      world.announce('보호막이 깨졌다!');
    }

    if (this.clearTelegraphLater) {
      this.clearTelegraphLater = false;
      this.clearTelegraph(world.scene);
      world.effects.sparks(this.x, 0.6, this.z, 0xe6dcc0, 12, { speed: 3 });
    }
    if (this.state === 'dead' && this.pendingSplit) {
      // 슬라임: 작은 슬라임 둘로 나뉜다
      this.pendingSplit = false;
      for (const side of [1, -1]) {
        const a = this.facing + (side * Math.PI) / 2;
        world.summon('slime_small', this.x + Math.sin(a) * 0.9, this.z + Math.cos(a) * 0.9);
      }
      world.effects.sparks(this.x, 0.4, this.z, this.species.colors?.main ?? 0x6ad86a, 14, { speed: 4 });
    }
    if (this.state === 'down') {
      // 뼈 무더기: 2.5초 뒤 다시 일어난다 (체력 절반)
      const k = Math.min(1, this.t / 0.3);
      this.rig.body.rotation.z = k * 1.5;
      this.rig.body.position.y = -0.3 * k;
      if (this.t > 2.2) this.rig.body.rotation.z = 1.5 * (1 - (this.t - 2.2) / 0.3);
      if (this.t >= 2.5) {
        this.hp = this.maxHp * 0.5;
        this.hpFill.scale.x = 0.5;
        this.rig.body.rotation.z = 0;
        this.rig.body.position.y = 0;
        world.effects.ring(this.x, this.z, 1.8, this.species.glow ?? 0x6affd0, 0.4);
        world.effects.sparks(this.x, 1, this.z, this.species.glow ?? 0x6affd0, 14, { up: true, spread: 0.4 });
        this.setState('chase');
      }
      this.animateDown();
      return;
    }
    if (this.state === 'dead') {
      this.deathTime += dt;
      const k = Math.min(1, this.deathTime / 0.45);
      this.rig.body.rotation.z = k * 1.4;
      this.rig.root.scale.setScalar(this.rig.root.scale.x * (1 - dt * 1.5));
      this.clearTelegraph(world.scene);
      return;
    }

    const p = world.player;
    const dx = p.x - this.x;
    const dz = p.z - this.z;
    const dist = Math.hypot(dx, dz);
    const toPlayer = Math.atan2(dx, dz);
    const speedMul = this.slow > 0 ? 0.5 : 1;
    this.slow = Math.max(0, this.slow - dt);
    let moving = false;

    const move = (mx: number, mz: number) => {
      const others = world.obstacles;
      moveWithCollision(world.grid, this, mx, mz, this.radius, others);
    };

    // 넉백
    if (Math.abs(this.knockX) + Math.abs(this.knockZ) > 0.01) {
      move(this.knockX * dt * 8, this.knockZ * dt * 8);
      this.knockX *= Math.exp(-dt * 10);
      this.knockZ *= Math.exp(-dt * 10);
    }

    this.skillT += dt;
    this.sinceHit += dt;
    // 트롤: 3초 동안 맞지 않으면 체력이 빠르게 찬다
    if (this.species.trait === 'regen' && this.sinceHit > 3 && this.hp < this.maxHp) {
      this.hp = Math.min(this.maxHp, this.hp + this.maxHp * 0.06 * dt);
      this.hpFill.scale.x = Math.max(0.001, this.hp / this.maxHp);
      if (Math.random() < dt * 4) world.effects.sparks(this.x, 1.2, this.z, 0x7aff6a, 2, { up: true, spread: 0.5 });
    }
    // 겁쟁이 (고블린): 체력이 30% 아래면 한 번 도망쳤다가 돌아온다
    if (this.species.trait === 'coward' && !this.fled && this.hp < this.maxHp * 0.3 && this.state === 'chase') {
      this.fled = true;
      this.fleeT = 2.5;
    }
    if (this.blockFx > 0) {
      if (this.blockFx >= 0.25) world.effects.sparks(this.x + Math.sin(this.facing) * 0.6, 1.1, this.z + Math.cos(this.facing) * 0.6, 0xffe08a, 6, { speed: 4 });
      this.blockFx = Math.max(0, this.blockFx - dt);
    }
    // 광전사: 체력이 절반 아래로 내려가면 격노 (빨라지고 붉게 달아오른다)
    if (this.arch === 'brute' && !this.isBoss && !this.enraged && this.hp < this.maxHp * 0.5) {
      this.enraged = true;
      this.speed *= 1.35;
      world.effects.ring(this.x, this.z, 2, 0xff3a1a, 0.4);
      world.effects.sparks(this.x, 1.2, this.z, 0xff5a2a, 12, { up: true, spread: 0.5 });
    }

    const turn = (target: number, rate: number) => {
      let d = ((target - this.facing + Math.PI) % (Math.PI * 2)) - Math.PI;
      if (d < -Math.PI) d += Math.PI * 2;
      this.facing += d * Math.min(1, dt * rate);
    };

    switch (this.state) {
      case 'idle':
        if (dist < (this.isBoss ? 11 : 9) || this.aggro) {
          this.aggro = true;
          this.setState('chase');
        }
        break;
      case 'chase': {
        if (this.fleeT > 0) {
          this.fleeT -= dt;
          turn(toPlayer + Math.PI, 10);
          move(Math.sin(this.facing) * this.speed * 1.2 * dt, Math.cos(this.facing) * this.speed * 1.2 * dt);
          moving = true;
          break;
        }
        turn(toPlayer, 8);
        const wantDist = this.isBoss ? 0 : KEEP_DIST[this.arch] ?? 0;
        if (!this.isBoss && this.special(world, dist, toPlayer)) break;
        if (this.isBoss) {
          if (this.t > (this.phase2 ? 0.5 : 0.9)) this.beginBossPattern(world, dist, toPlayer);
          else if (dist > 3) {
            move(Math.sin(this.facing) * this.speed * speedMul * dt, Math.cos(this.facing) * this.speed * speedMul * dt);
            moving = true;
          }
          break;
        }
        if (dist <= this.def.range && this.t > 0.25) {
          this.beginAttack(world, dist, toPlayer);
        } else if (dist > wantDist) {
          move(Math.sin(this.facing) * this.speed * speedMul * dt, Math.cos(this.facing) * this.speed * speedMul * dt);
          moving = true;
        } else if (dist < wantDist - 1.5) {
          move(-Math.sin(this.facing) * this.speed * 0.7 * dt, -Math.cos(this.facing) * this.speed * 0.7 * dt);
          moving = true;
        }
        break;
      }
      case 'windup': {
        const tel = this.telegraph;
        // 원거리 몬스터는 조준하는 동안 방향을 따라간다
        if (tel && (AIMED.has(this.arch) || this.pattern === 'volley') && this.pattern !== 'aoe' && this.pattern !== 'summon' && tel.t < tel.duration * 0.7) {
          turn(toPlayer, 6);
          tel.facing = this.facing;
          tel.x = this.x;
          tel.z = this.z;
          tel.sync();
        }
        const rainDone = this.rainSpots.map((r) => r.update(dt));
        if (tel && tel.update(dt)) this.release(world);
        else if (!tel && this.rainSpots.length && rainDone.every(Boolean)) this.release(world);
        break;
      }
      case 'dash': {
        const sp = (this.isBoss ? 15 : 13) * dt;
        const bx = this.x;
        const bz = this.z;
        move(Math.sin(this.facing) * sp, Math.cos(this.facing) * sp);
        const moved = Math.hypot(this.x - bx, this.z - bz);
        this.dashLeft -= sp;
        if (!this.dashHit && Math.hypot(p.x - this.x, p.z - this.z) < this.radius + 0.6) {
          this.dashHit = true;
          this.hitPlayer(world, this.atk * 1.2, this.x, this.z);
        }
        if (this.dashLeft <= 0 || moved < sp * 0.3) {
          if (moved < sp * 0.3) {
            world.shake(0.2);
            world.burst(this.x, 0.5, this.z, 0xcfc0a0, 10);
          }
          this.setState('recover');
        }
        break;
      }
      case 'recover': {
        const rec = this.isBoss ? (this.phase2 ? 0.6 : 0.9) : this.def.recover;
        if (this.t >= rec) this.setState('chase');
        break;
      }
    }

    // 몬스터끼리 겹치지 않게 살짝 밀어낸다
    for (const o of world.monsters) {
      if (o === this || !o.alive) continue;
      const ox = this.x - o.x;
      const oz = this.z - o.z;
      const d = Math.hypot(ox, oz);
      const min = this.radius + o.radius;
      if (d > 0.001 && d < min) {
        const push = (min - d) * 0.5;
        move((ox / d) * push, (oz / d) * push);
      }
    }

    this.obstacle.x = this.x;
    this.obstacle.z = this.z;
    this.animate(dt, moving);
  }

  private beginAttack(world: MonsterWorld, dist: number, toPlayer: number): void {
    this.facing = toPlayer;
    const w = this.def.windup;
    switch (this.arch) {
      case 'melee':
        this.startTelegraph(world, { kind: 'cone', r: 2.4, angle: 1.8 }, this.x, this.z, this.facing, w);
        break;
      case 'ranged':
        this.startTelegraph(world, { kind: 'line', length: Math.min(dist + 2, 11), width: 0.5 }, this.x, this.z, this.facing, w);
        break;
      case 'charger':
        if (dist < 2.5) {
          this.startTelegraph(world, { kind: 'cone', r: 2.4, angle: 1.6 }, this.x, this.z, this.facing, w * 0.7);
          this.pattern = 'cone';
        } else {
          this.startTelegraph(world, { kind: 'line', length: 8, width: 1.4 }, this.x, this.z, this.facing, w);
          this.pattern = 'charge';
        }
        break;
      case 'bomber':
        this.startTelegraph(world, { kind: 'circle', r: 2.5 }, this.x, this.z, 0, w);
        break;
      case 'tank':
        this.startTelegraph(world, { kind: 'circle', r: 2.9 }, this.x, this.z, 0, w);
        break;
      case 'brute':
        // 두 번 베고, 세 번째는 회전 베기
        if (this.attackCount % 3 === 2) {
          this.pattern = 'spin';
          this.startTelegraph(world, { kind: 'circle', r: 2.7 }, this.x, this.z, 0, w * (this.enraged ? 0.7 : 1.1));
        } else {
          this.pattern = 'cone';
          this.startTelegraph(world, { kind: 'cone', r: 2.6, angle: 2 }, this.x, this.z, this.facing, w * (this.enraged ? 0.7 : 1));
        }
        break;
      case 'archer':
        this.startTelegraph(world, { kind: 'line', length: Math.min(dist + 2, 12), width: 1.5 }, this.x, this.z, this.facing, w);
        break;
      case 'assassin':
      case 'swarm':
        this.startTelegraph(world, { kind: 'cone', r: this.arch === 'swarm' ? 1.7 : 2.3, angle: 1.6 }, this.x, this.z, this.facing, w);
        break;
      case 'necro':
        if (this.attackCount % 3 === 0 && this.summoned.filter((m) => m.alive).length < 4) {
          this.pattern = 'summon';
          this.startTelegraph(world, { kind: 'circle', r: 1.6 }, this.x, this.z, 0, w * 1.2);
        } else {
          this.pattern = 'bolt';
          this.startTelegraph(world, { kind: 'line', length: Math.min(dist + 2, 11), width: 0.6 }, this.x, this.z, this.facing, w);
        }
        break;
      case 'shaman':
      case 'spitter':
        // 플레이어 발밑에 떨어지는 마법·독
        this.pattern = 'aoe';
        this.startTelegraph(world, { kind: 'circle', r: this.arch === 'spitter' ? 1.8 : 2.2 }, world.player.x, world.player.z, 0, w);
        break;
      case 'caster': {
        // 플레이어와 그 둘레 세 곳에 마법이 떨어진다
        this.clearTelegraph(world.scene);
        this.pattern = 'rain';
        for (let i = 0; i < 3; i++) {
          const a = Math.random() * Math.PI * 2;
          const r = i === 0 ? 0 : 1.8 + Math.random() * 1.5;
          const t = new Telegraph({ kind: 'circle', r: 1.7 }, world.player.x + Math.cos(a) * r, world.player.z + Math.sin(a) * r, 0, w + i * 0.12);
          world.scene.add(t.group);
          this.rainSpots.push(t);
        }
        break;
      }
      case 'knight':
        if (this.attackCount % 3 === 2 && dist > 2.2) {
          // 방패 밀치기 돌진
          this.pattern = 'charge';
          this.startTelegraph(world, { kind: 'line', length: 5, width: 1.4 }, this.x, this.z, this.facing, w);
        } else {
          this.pattern = 'thrust';
          this.startTelegraph(world, { kind: 'line', length: 3.4, width: 1.1 }, this.x, this.z, this.facing, w);
        }
        break;
    }
    this.attackCount++;
    this.setState('windup');
  }

  /**
   * 종족 고유 행동 (쫓아가는 중에). 행동을 했으면 true
   * - 주술사: 다친 동료 치유
   * - 암살자: 플레이어 뒤로 순간이동
   */
  private special(world: MonsterWorld, dist: number, toPlayer: number): boolean {
    if (this.arch === 'shaman' && this.skillT > 5) {
      const hurt = world.monsters.filter((m) => m !== this && m.alive && !m.isBoss && m.hp < m.maxHp && Math.hypot(m.x - this.x, m.z - this.z) < 7);
      if (hurt.length) {
        this.skillT = 0;
        for (const m of hurt) {
          m.hp = Math.min(m.maxHp, m.hp + m.maxHp * 0.2);
          m.hpFill.scale.x = Math.max(0.001, m.hp / m.maxHp);
          world.effects.sparks(m.x, 0.6, m.z, 0x7aff6a, 8, { up: true, spread: 0.4 });
        }
        world.effects.glyph(this.x, this.z, 1.4, 0x7aff6a, 0.7);
        world.effects.ring(this.x, this.z, 7, 0x7aff6a, 0.5);
        return true;
      }
    }
    if (this.arch === 'assassin' && this.skillT > 4.5 && dist > 3 && dist < 10) {
      this.skillT = 0;
      // 플레이어 너머 1.6만큼 떨어진 곳 (막혀 있으면 가능한 만큼)
      const nx = world.player.x + Math.sin(toPlayer) * 1.6;
      const nz = world.player.z + Math.cos(toPlayer) * 1.6;
      const c = this.species.glow ?? MONSTER_COLORS[this.tier - 1].accent;
      world.effects.sparks(this.x, 1, this.z, c, 14, { up: true, spread: 0.4 });
      if (isFloor(world.grid, Math.floor(nx / TILE), Math.floor(nz / TILE))) {
        this.x = nx;
        this.z = nz;
      }
      world.effects.ring(this.x, this.z, 1.6, c, 0.3);
      world.effects.sparks(this.x, 1, this.z, c, 14, { speed: 4 });
      this.facing = Math.atan2(world.player.x - this.x, world.player.z - this.z);
      this.startTelegraph(world, { kind: 'cone', r: 2.3, angle: 1.8 }, this.x, this.z, this.facing, 0.45);
      this.setState('windup');
      return true;
    }
    return false;
  }

  private beginBossPattern(world: MonsterWorld, dist: number, toPlayer: number): void {
    if (this.bossQueue.length === 0) {
      const pats = BOSS_PATTERNS[this.tier - 1];
      this.bossQueue = [...(this.isFinal ? pats : pats.slice(0, 3))].sort(() => Math.random() - 0.5);
    }
    let pattern = this.bossQueue.shift()!;
    if (pattern === 'charge' && dist < 3) pattern = 'slam';
    this.pattern = pattern;
    this.facing = toPlayer;
    const speed = this.phase2 ? 0.75 : 1;
    switch (pattern) {
      case 'slam':
        this.startTelegraph(world, { kind: 'circle', r: 5 }, this.x, this.z, 0, 1.1 * speed);
        break;
      case 'cone':
        this.startTelegraph(world, { kind: 'cone', r: 7, angle: 2.1 }, this.x, this.z, this.facing, 1.0 * speed);
        break;
      case 'charge':
        this.startTelegraph(world, { kind: 'line', length: 13, width: 2.4 }, this.x, this.z, this.facing, 1.0 * speed);
        break;
      case 'volley':
        this.startTelegraph(world, { kind: 'circle', r: 1.6 }, this.x, this.z, 0, 0.9 * speed);
        break;
      case 'summon':
        this.startTelegraph(world, { kind: 'circle', r: 2 }, this.x, this.z, 0, 0.9 * speed);
        break;
      case 'cross': {
        // 보스를 중심으로 십자(격노 시 8방향) 베기
        this.clearTelegraph(world.scene);
        const n = this.phase2 ? 8 : 4;
        const base = Math.random() < 0.5 ? 0 : Math.PI / 4;
        for (let i = 0; i < n; i++) {
          const t = new Telegraph({ kind: 'line', length: 15, width: 2.2 }, this.x, this.z, base + (i / n) * Math.PI * 2, 1.3 * speed);
          world.scene.add(t.group);
          this.rainSpots.push(t);
        }
        break;
      }
      case 'nova': {
        // 바깥 고리가 터진다: 보스 품으로 파고들어야 산다
        this.clearTelegraph(world.scene);
        for (const [ring, count] of [
          [4.5, 8],
          [7.5, 12],
        ] as const) {
          for (let i = 0; i < count; i++) {
            const a = (i / count) * Math.PI * 2 + ring;
            const t = new Telegraph({ kind: 'circle', r: 1.9 }, this.x + Math.cos(a) * ring, this.z + Math.sin(a) * ring, 0, 1.5 * speed);
            world.scene.add(t.group);
            this.rainSpots.push(t);
          }
        }
        break;
      }
      case 'barrage': {
        // 방 곳곳에 운석이 떨어진다 (늦게 떨어지는 것도 섞인다)
        this.clearTelegraph(world.scene);
        const count = this.phase2 ? 14 : 9;
        for (let i = 0; i < count; i++) {
          const a = Math.random() * Math.PI * 2;
          const r = i < 2 ? Math.random() * 1.5 : 2 + Math.random() * 7;
          const t = new Telegraph({ kind: 'circle', r: 1.7 }, world.player.x + Math.cos(a) * r, world.player.z + Math.sin(a) * r, 0, 1.0 * speed + Math.random() * 0.6);
          world.scene.add(t.group);
          this.rainSpots.push(t);
        }
        break;
      }
      case 'rain': {
        this.clearTelegraph(world.scene);
        const count = this.phase2 ? 6 : 4;
        for (let i = 0; i < count; i++) {
          const a = Math.random() * Math.PI * 2;
          const r = i === 0 ? 0 : 1.5 + Math.random() * 3.5;
          const t = new Telegraph({ kind: 'circle', r: 2 }, world.player.x + Math.cos(a) * r, world.player.z + Math.sin(a) * r, 0, 1.2 * speed + i * 0.08);
          world.scene.add(t.group);
          this.rainSpots.push(t);
        }
        break;
      }
    }
    this.setState('windup');
  }

  /** 예고가 끝나 실제 공격이 나가는 순간 */
  private release(world: MonsterWorld): void {
    const tel = this.telegraph;
    const p = world.player;
    const hitIf = (t: Telegraph | null, mult: number) => {
      if (t && t.contains(p.x, p.z, 0.35)) this.hitPlayer(world, this.atk * mult, this.x, this.z);
    };

    if (this.isBoss) {
      switch (this.pattern) {
        case 'slam':
          hitIf(tel, 1.3);
          world.effects.ring(this.x, this.z, 5, 0xffb070, 0.4);
          world.shake(0.4);
          break;
        case 'cone':
          hitIf(tel, 1.2);
          world.effects.slash(this.x, this.z, this.facing, 7, 0xff8a5a, 2.1, 0.6);
          world.shake(0.25);
          break;
        case 'charge':
          this.clearTelegraph(world.scene);
          this.dashLeft = 13;
          this.dashHit = false;
          this.setState('dash');
          return;
        case 'volley': {
          const n = this.phase2 ? 16 : 10;
          const off = Math.random();
          for (let i = 0; i < n; i++) {
            world.fireEnemyProjectile({ x: this.x, z: this.z, angle: ((i + off) / n) * Math.PI * 2, speed: 7, damage: this.atk * 0.7, color: MONSTER_COLORS[this.tier - 1].accent, radius: 0.35 });
          }
          break;
        }
        case 'summon': {
          const kinds: Archetype[] = ['melee', 'bomber', 'ranged'];
          const n = this.phase2 ? 3 : 2;
          for (let i = 0; i < n; i++) {
            const a = (i / n) * Math.PI * 2;
            world.summon(kinds[i % kinds.length], this.x + Math.cos(a) * 2.5, this.z + Math.sin(a) * 2.5);
          }
          world.effects.ring(this.x, this.z, 3, 0xb080ff, 0.5);
          break;
        }
        case 'doom':
          world.effects.ring(this.x, this.z, 30, 0x2a0040, 1.2);
          world.effects.ring(this.x, this.z, 12, 0xff2a6a, 0.8);
          world.burst(p.x, 0.8, p.z, 0xff2a6a, 40, 2.5);
          world.shake(1.2);
          world.killPlayer();
          this.dooming = false;
          break;
        case 'rain':
        case 'cross':
        case 'nova':
        case 'barrage': {
          const mult = this.pattern === 'cross' ? 1.3 : this.pattern === 'nova' ? 1.2 : 0.9;
          for (const r of this.rainSpots) {
            if (r.contains(p.x, p.z, 0.35)) {
              world.hurtPlayer(this.atk * mult, r.x, r.z);
              break;
            }
          }
          for (const r of this.rainSpots) {
            if (this.pattern === 'cross') world.effects.slash(this.x, this.z, r.facing, 15, 0xff8a5a, 0.3, 0.5);
            else {
              world.effects.ring(r.x, r.z, 2, 0xff7040, 0.35);
              world.burst(r.x, 0.3, r.z, 0xff9a50, 5);
            }
          }
          world.shake(this.pattern === 'cross' ? 0.35 : 0.25);
          break;
        }
      }
      this.clearTelegraph(world.scene);
      this.setState('recover');
      return;
    }

    switch (this.arch) {
      case 'melee':
        hitIf(tel, 1);
        world.effects.slash(this.x, this.z, this.facing, 2.4, 0xffffff, 1.8, 0.7);
        break;
      case 'ranged':
        world.fireEnemyProjectile({ x: this.x, z: this.z, angle: this.facing, speed: 10, damage: this.atk, color: MONSTER_COLORS[this.tier - 1].accent, debuff: this.species.debuff });
        break;
      case 'charger':
        if (this.pattern === 'charge') {
          this.clearTelegraph(world.scene);
          this.dashLeft = 8;
          this.dashHit = false;
          this.setState('dash');
          return;
        }
        hitIf(tel, 1);
        world.effects.slash(this.x, this.z, this.facing, 2.4, 0xffffff, 1.6, 0.6);
        break;
      case 'bomber':
        hitIf(tel, 1);
        world.effects.ring(this.x, this.z, 2.6, 0xffa040, 0.35);
        world.burst(this.x, 0.5, this.z, 0xffa040, 16, 1.4);
        world.shake(0.25);
        this.clearTelegraph(world.scene);
        // 자폭: 경험치는 주지 않고 사라진다
        this.hp = 0;
        this.state = 'dead';
        this.deathTime = 0.45;
        this.hpBar.visible = false;
        this.rig.root.visible = false;
        return;
      case 'tank':
        hitIf(tel, 1);
        world.effects.ring(this.x, this.z, 2.9, 0xe0d0b0, 0.35);
        world.shake(0.2);
        break;
      case 'brute':
        hitIf(tel, this.pattern === 'spin' ? 1.2 : 1);
        if (this.pattern === 'spin') {
          world.effects.slash(this.x, this.z, this.facing, 2.7, this.enraged ? 0xff4a2a : 0xffc08a, Math.PI * 2, 0.8);
          world.shake(0.2);
        } else {
          world.effects.slash(this.x, this.z, this.facing, 2.6, this.enraged ? 0xff4a2a : 0xffe0c0, 2, 0.8);
          // 격노 중에는 쉬지 않고 이어서 벤다
          if (this.enraged && Math.random() < 0.5) {
            this.clearTelegraph(world.scene);
            this.facing = Math.atan2(p.x - this.x, p.z - this.z);
            this.pattern = 'cone';
            this.startTelegraph(world, { kind: 'cone', r: 2.6, angle: 2 }, this.x, this.z, this.facing, 0.35);
            this.setState('windup');
            return;
          }
        }
        break;
      case 'archer': {
        const c = this.species.glow ?? 0xffe08a;
        for (const off of [-0.18, 0, 0.18]) world.fireEnemyProjectile({ x: this.x, z: this.z, angle: this.facing + off, speed: 14, damage: this.atk * 0.8, color: c, kind: 'arrow', radius: 0.3, debuff: this.species.debuff });
        break;
      }
      case 'assassin':
      case 'swarm':
        hitIf(tel, this.arch === 'assassin' ? 1.2 : 1);
        world.effects.slash(this.x, this.z, this.facing, this.arch === 'swarm' ? 1.6 : 2.3, this.species.glow ?? 0xffffff, 1.6, 0.8);
        break;
      case 'necro': {
        const c = this.species.glow ?? 0x9aff5a;
        if (this.pattern === 'summon') {
          for (let i = 0; i < 2; i++) {
            const a = this.facing + (i ? 1 : -1) * 1.2;
            const m = world.summon('skel_warrior', this.x + Math.sin(a) * 2, this.z + Math.cos(a) * 2);
            this.summoned.push(m);
            world.effects.pillar(m.x, m.z, c, 2.5);
          }
          world.effects.glyph(this.x, this.z, 1.8, c, 0.8);
        } else world.fireEnemyProjectile({ x: this.x, z: this.z, angle: this.facing, speed: 9, damage: this.atk * 1.1, color: c, radius: 0.4, debuff: this.species.debuff });
        break;
      }
      case 'shaman':
        hitIf(tel, 1.1);
        if (tel) world.effects.explosion(tel.x, tel.z, 2.2, this.species.glow ?? 0x7aff6a);
        break;
      case 'spitter':
        hitIf(tel, 0.6);
        if (tel) {
          const c = this.species.colors?.accent ?? 0x9aff4a;
          world.hazard(tel.x, tel.z, 1.8, 3.5, this.atk * 0.45, c, this.species.debuff);
          world.effects.sparks(tel.x, 0.3, tel.z, c, 12, { speed: 3 });
        }
        break;
      case 'caster': {
        const c = this.species.glow ?? 0xff5aff;
        for (const r of this.rainSpots) {
          if (r.contains(p.x, p.z, 0.35)) {
            this.hitPlayer(world, this.atk * 0.9, r.x, r.z);
            break;
          }
        }
        for (const r of this.rainSpots) world.effects.explosion(r.x, r.z, 1.7, c);
        break;
      }
      case 'knight':
        if (this.pattern === 'charge') {
          this.clearTelegraph(world.scene);
          this.dashLeft = 5;
          this.dashHit = false;
          this.setState('dash');
          return;
        }
        hitIf(tel, 1.1);
        world.effects.slash(this.x, this.z, this.facing, 3.2, this.species.glow ?? 0xffffff, 0.7, 1);
        break;
    }
    this.clearTelegraph(world.scene);
    this.setState('recover');
  }

  private animate(dt: number, moving: boolean): void {
    const r = this.rig;
    r.root.position.set(this.x, 0, this.z);
    r.root.rotation.y = this.facing;
    this.hpBar.position.x = this.x;
    this.hpBar.position.z = this.z;

    if (moving) this.walkPhase += dt * this.speed * 3.2;
    const swing = moving ? Math.sin(this.walkPhase) * 0.6 : 0;
    r.legs.forEach((leg, i) => (leg.rotation.x = i % 2 === (i < 2 ? 0 : 1) ? swing : -swing));

    // 공격 예고 중에는 몸을 뒤로 젖혔다가 앞으로 내민다
    let lean = 0;
    if (this.state === 'windup') lean = -0.25 * Math.min(1, this.t * 3);
    else if (this.state === 'dash') lean = 0.35;
    r.body.rotation.x += (lean - r.body.rotation.x) * Math.min(1, dt * 12);

    const ease = (g: Group | undefined, prop: 'x' | 'y' | 'z', v: number, rate = 10) => {
      if (g) g.rotation[prop] += (v - g.rotation[prop]) * Math.min(1, dt * rate);
    };
    const windK = this.state === 'windup' ? Math.min(1, this.t * 3) : 0;
    const striking = this.state === 'recover' && this.t < 0.25;
    switch (r.style) {
      case 'bounce': {
        const bounce = Math.abs(Math.sin(this.walkPhase * 1.4)) * 0.3;
        r.body.position.y = bounce;
        if (this.state === 'windup') r.body.scale.setScalar(1 + Math.sin(this.t * 30) * 0.08 + this.t * 0.2);
        else r.body.scale.set(1 + bounce * 0.3, 1 - bounce * 0.3, 1 + bounce * 0.3);
        break;
      }
      case 'float':
        r.body.position.y = 0.15 + Math.sin(this.walkPhase * 0.5 + this.t) * 0.08;
        if (r.arms.length === 1) r.arms[0].rotation.y += dt * 4;
        else for (const a of r.arms) ease(a, 'x', this.state === 'windup' ? -2 * windK : striking ? 0.6 : Math.sin(this.t * 2) * 0.2);
        break;
      case 'golem': {
        const raise = this.state === 'windup' ? -2.4 * Math.min(1, this.t * 2) : moving ? swing * 0.5 : 0;
        ease(r.arms[0], 'x', raise);
        ease(r.arms[1], 'x', raise);
        break;
      }
      case 'bat':
        r.body.position.y = 0.2 + Math.sin(this.t * 3 + this.walkPhase) * 0.12;
        r.arms.forEach((a, i) => (a.rotation.z = Math.sin(this.t * 22) * 0.7 * (i ? -1 : 1)));
        break;
      case 'spider':
        r.legs.forEach((l, i) => (l.rotation.x = moving ? Math.sin(this.walkPhase * 2 + i) * 0.35 : 0));
        break;
      case 'humanoid': {
        // 팔: 걸을 때 흔들고, 예고 때 무기를 치켜들었다가 내려친다
        const both = ['axes', 'daggers', 'claws', 'club'].includes((this.species.model as { weapon?: string }).weapon ?? '');
        const bow = (this.species.model as { weapon?: string }).weapon === 'bow';
        const cast = this.arch === 'necro' || this.arch === 'shaman' || this.arch === 'caster';
        let right = moving ? -swing * 0.6 : 0;
        let left = moving ? swing * 0.6 : 0;
        if (this.state === 'windup') {
          if (bow) {
            right = -1.5 * windK;
            left = -1.55 * windK;
          } else if (cast) {
            right = -2.6 * windK;
            left = -0.8 * windK;
          } else {
            right = -2.5 * windK;
            if (both) left = -2.5 * windK;
          }
        } else if (striking && !bow && !cast) {
          right = 0.7;
          if (both) left = 0.7;
        } else if (this.state === 'dash') {
          right = -1.4;
          left = -1.2;
        }
        ease(r.arms[0], 'x', right, 14);
        ease(r.arms[1], 'x', left, 14);
        break;
      }
    }
    if (this.enraged) this.material.emissive.setRGB(0.25 + Math.sin(this.t * 8) * 0.08, 0.02, 0);

    // 맞았을 때 하얗게 번쩍
    if (this.flash > 0) {
      this.flash = Math.max(0, this.flash - dt * 8);
      this.material.emissive.setHex(this.kind === 'elite' ? 0x3a2a00 : 0x000000).lerp(HIT_TINT, this.flash * 0.8);
    } else if (this.state === 'windup') {
      // 공격 직전 붉게 달아오른다
      const k = (Math.sin(this.t * 25) + 1) * 0.15;
      this.material.emissive.setRGB(k, 0, 0);
    } else {
      this.material.emissive.setHex(this.kind === 'elite' ? 0x3a2a00 : 0x000000);
    }
  }

  dispose(): void {
    this.rig.meshes.forEach((m) => m.geometry.dispose());
    this.material.dispose();
    this.hpBar.traverse((o) => {
      const m = o as Mesh;
      if (m.geometry) m.geometry.dispose();
      if (m.material) (m.material as Material).dispose();
    });
  }
}
