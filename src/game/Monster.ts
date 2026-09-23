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
import { ARCHETYPES, BOSS_NAMES, MIDBOSS_NAMES, MONSTER_NAMES, tierScale, type Archetype, type ArchetypeDef } from '../data/monsters';
import { moveWithCollision, type CircleObstacle } from '../dungeon/collision';
import type { DungeonData } from '../dungeon/generator';
import { buildMonster, MONSTER_COLORS, type MonsterRig } from '../models/monsters';
import { Telegraph, type Effects, type TelegraphShape } from './Effects';

export type MonsterKind = 'normal' | 'elite' | 'midboss' | 'boss';

type State = 'idle' | 'chase' | 'windup' | 'dash' | 'recover' | 'dead';

type BossPattern = 'slam' | 'cone' | 'volley' | 'charge' | 'summon' | 'rain';

export interface ProjectileSpec {
  x: number;
  z: number;
  angle: number;
  speed: number;
  damage: number;
  color: number;
  radius?: number;
  kind?: 'orb' | 'arrow' | 'shard' | 'wave';
}

export interface MonsterWorld {
  grid: DungeonData;
  obstacles: CircleObstacle[];
  scene: Scene;
  effects: Effects;
  player: { x: number; z: number };
  monsters: Monster[];
  hurtPlayer(dmg: number, fromX: number, fromZ: number): void;
  fireEnemyProjectile(spec: ProjectileSpec): void;
  summon(arch: Archetype, x: number, z: number): Monster;
  announce(text: string): void;
  burst(x: number, y: number, z: number, color: number, count: number, power?: number): void;
  shake(amount: number): void;
}

const BOSS_ARCH: Archetype[] = ['tank', 'charger', 'ranged', 'bomber', 'tank', 'melee', 'ranged'];
const BOSS_PATTERNS: BossPattern[][] = [
  ['slam', 'cone', 'summon'],
  ['charge', 'slam', 'cone'],
  ['volley', 'rain', 'summon'],
  ['volley', 'slam', 'rain'],
  ['slam', 'charge', 'volley', 'summon'],
  ['cone', 'rain', 'charge', 'slam'],
  ['volley', 'rain', 'charge', 'summon', 'slam'],
];

const HIT_TINT = new Color(0xffffff);

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

  constructor(
    readonly arch: Archetype,
    readonly kind: MonsterKind,
    readonly tier: number,
    stage: number,
    ngPlus: number,
    x: number,
    z: number,
    readonly homeRoom: number,
  ) {
    const boss = kind === 'boss' || kind === 'midboss';
    const archetype = kind === 'boss' ? BOSS_ARCH[tier - 1] : kind === 'midboss' ? BOSS_ARCH[(tier + 2) % 7] : arch;
    this.arch = archetype;
    this.def = ARCHETYPES[archetype];
    const scale = tierScale(tier, stage, ngPlus);
    const mult = kind === 'boss' ? { hp: 26, atk: 1.5, size: 2.1 } : kind === 'midboss' ? { hp: 14, atk: 1.3, size: 1.65 } : kind === 'elite' ? { hp: 3, atk: 1.4, size: 1.35 } : { hp: 1, atk: 1, size: 1 };
    this.maxHp = this.hp = Math.round(this.def.hp * scale.hp * mult.hp);
    // 중간보스 5줄 (3줄을 깎으면 보호막), 수호자 7줄 (3줄·5줄에서 보호막)
    this.bars = kind === 'boss' ? 7 : kind === 'midboss' ? 5 : 1;
    this.gimmickAt = kind === 'boss' ? [4, 2] : kind === 'midboss' ? [2] : [];
    this.atk = this.def.atk * scale.atk * mult.atk;
    this.defense = this.def.def * (1 + (tier - 1) * 0.6);
    this.speed = this.def.speed * (boss ? 0.95 : 1);
    this.radius = this.def.radius * mult.size;
    this.x = x;
    this.z = z;
    this.name = kind === 'boss' ? BOSS_NAMES[tier - 1] : kind === 'midboss' ? MIDBOSS_NAMES[tier - 1] : (kind === 'elite' ? '정예 ' : '') + MONSTER_NAMES[tier][archetype];
    this.exp = Math.round(this.def.exp * Math.pow(tier, 1.6) * (1 + (stage - 1) * 0.15) * (kind === 'boss' ? 30 : kind === 'midboss' ? 15 : kind === 'elite' ? 3 : 0.3));

    this.material = new MeshLambertMaterial({ vertexColors: true, flatShading: true });
    const colors = MONSTER_COLORS[tier - 1];
    this.rig = buildMonster(this.material, archetype, kind === 'elite' ? { ...colors, accent: 0xffd23a } : colors, boss);
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
    if (this.shielded) {
      this.flash = 0.5;
      return false;
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
      this.state = 'dead';
      this.deathTime = 0;
      this.hpBar.visible = false;
      return true;
    }
    return false;
  }

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
        turn(toPlayer, 8);
        const wantDist = this.arch === 'ranged' && !this.isBoss ? 5.5 : 0;
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
        if (tel && (this.arch === 'ranged' || this.pattern === 'volley') && tel.t < tel.duration * 0.7) {
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
          world.hurtPlayer(this.atk * 1.2, this.x, this.z);
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
    }
    this.setState('windup');
  }

  private beginBossPattern(world: MonsterWorld, dist: number, toPlayer: number): void {
    if (this.bossQueue.length === 0) {
      const pats = BOSS_PATTERNS[this.tier - 1];
      this.bossQueue = [...(this.isFinal ? pats : pats.slice(0, 2))].sort(() => Math.random() - 0.5);
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
      if (t && t.contains(p.x, p.z, 0.35)) world.hurtPlayer(this.atk * mult, this.x, this.z);
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
        case 'rain':
          for (const r of this.rainSpots) {
            if (r.contains(p.x, p.z, 0.35)) {
              world.hurtPlayer(this.atk * 0.9, r.x, r.z);
              break;
            }
          }
          for (const r of this.rainSpots) {
            world.effects.ring(r.x, r.z, 2, 0xff7040, 0.35);
            world.burst(r.x, 0.3, r.z, 0xff9a50, 6);
          }
          world.shake(0.2);
          break;
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
        world.fireEnemyProjectile({ x: this.x, z: this.z, angle: this.facing, speed: 10, damage: this.atk, color: MONSTER_COLORS[this.tier - 1].accent });
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

    if (this.arch === 'bomber') {
      const bounce = Math.abs(Math.sin(this.walkPhase * 1.4)) * 0.3;
      r.body.position.y = bounce;
      if (this.state === 'windup') r.body.scale.setScalar(1 + Math.sin(this.t * 30) * 0.08 + this.t * 0.2);
    } else if (this.arch === 'ranged') {
      r.body.position.y = 0.15 + Math.sin(this.walkPhase * 0.5 + this.t) * 0.08;
      if (r.arms[0]) r.arms[0].rotation.y += dt * 4;
    } else if (this.arch === 'tank' && r.arms.length) {
      const raise = this.state === 'windup' ? -2.4 * Math.min(1, this.t * 2) : moving ? swing * 0.5 : 0;
      r.arms[0].rotation.x += (raise - r.arms[0].rotation.x) * Math.min(1, dt * 10);
      r.arms[1].rotation.x += (raise - r.arms[1].rotation.x) * Math.min(1, dt * 10);
    }

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
