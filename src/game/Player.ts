import { Color, GreaterDepth, Material, Mesh, MeshBasicMaterial, MeshLambertMaterial } from 'three';
import { PLAYER, SCREEN_RIGHT, SCREEN_UP } from '../config';
import type { ClassDef } from '../data/classes';
import { buildHero, type HeroGear, type HeroRig } from '../models/hero';

export type Pose = 'swing' | 'spin' | 'cast' | 'shoot' | 'thrust' | 'gather';
export type DashPose = 'roll' | 'lunge' | 'leap';

export interface ActionSpec {
  pose: Pose;
  duration: number;
  /** 판정 시점 (0~1) */
  hitAt: number;
  onHit: () => void;
  combo?: number;
  moveMult?: number;
  /** 채집 도구 */
  tool?: 'pickaxe' | 'axe';
}

export interface DashSpec {
  dirX: number;
  dirZ: number;
  speed: number;
  duration: number;
  pose: DashPose;
  invuln: boolean;
  onStep?: () => void;
  onEnd?: () => void;
}

export interface MoveContext {
  move: { x: number; y: number };
  applyMove: (dx: number, dz: number) => void;
}

const lerpAngle = (a: number, b: number, t: number) => {
  let d = ((b - a + Math.PI) % (Math.PI * 2)) - Math.PI;
  if (d < -Math.PI) d += Math.PI * 2;
  return a + d * t;
};

const HURT = new Color(0xff3030);

/** 주인공: 이동, 구르기, 행동(공격·스킬) 애니메이션과 HP/MP */
export class Player {
  readonly rig: HeroRig;
  readonly position = { x: 0, z: 0 };
  facing = 0;
  state: 'idle' | 'move' | 'action' | 'dash' | 'dead' = 'idle';
  hp = 100;
  mp = 50;
  maxHp = 100;
  maxMp = 50;
  invuln = 0;
  private hurtFlash = 0;
  private speed = 0;
  private walkPhase = 0;
  private time = 0;
  private action: (ActionSpec & { t: number; done: boolean }) | null = null;
  private dash: (DashSpec & { t: number }) | null = null;
  rollCooldown = 0;
  private material: MeshLambertMaterial;

  constructor(
    material: Material,
    readonly cls: ClassDef,
    gear?: HeroGear,
  ) {
    this.material = material as MeshLambertMaterial;
    this.rig = buildHero(material, {
      tunic: cls.look.tunic,
      tunicDark: cls.look.tunicDark,
      hair: cls.look.hair,
      weapon: cls.look.weapon,
      shield: cls.look.weapon === 'sword',
      hat: cls.look.weapon === 'staff' ? 'wizard' : 'none',
      gear,
    });
    addSilhouette(this.rig.meshes);
  }

  setPosition(x: number, z: number): void {
    this.position.x = x;
    this.position.z = z;
    this.syncRoot();
  }

  get canAct(): boolean {
    return this.state === 'idle' || this.state === 'move';
  }

  get alive(): boolean {
    return this.state !== 'dead';
  }

  /** 화면 기준 입력을 월드 방향으로 */
  static worldDir(move: { x: number; y: number }): { x: number; z: number; len: number } {
    const x = SCREEN_RIGHT.x * move.x + SCREEN_UP.x * move.y;
    const z = SCREEN_RIGHT.z * move.x + SCREEN_UP.z * move.y;
    return { x, z, len: Math.hypot(x, z) };
  }

  startAction(spec: ActionSpec, faceAngle: number | null): boolean {
    if (!this.canAct) return false;
    if (faceAngle !== null) this.facing = faceAngle;
    this.action = { ...spec, t: 0, done: false };
    this.state = 'action';
    return true;
  }

  startDash(spec: DashSpec): void {
    if (!this.alive) return;
    this.action = null;
    this.dash = { ...spec, t: 0 };
    this.state = 'dash';
    if (spec.pose !== 'leap') this.facing = Math.atan2(spec.dirX, spec.dirZ);
  }

  startRoll(move: { x: number; y: number }): boolean {
    if (this.rollCooldown > 0 || this.state === 'dash' || !this.alive) return false;
    const d = Player.worldDir(move);
    const dir = d.len > 0.1 ? { x: d.x / d.len, z: d.z / d.len } : { x: Math.sin(this.facing), z: Math.cos(this.facing) };
    this.startDash({ dirX: dir.x, dirZ: dir.z, speed: PLAYER.rollSpeed, duration: PLAYER.rollTime, pose: 'roll', invuln: true });
    this.rollCooldown = PLAYER.rollCooldown + PLAYER.rollTime;
    return true;
  }

  get isInvulnerable(): boolean {
    return this.invuln > 0 || (this.dash?.invuln ?? false) || !this.alive;
  }

  hurt(amount: number): void {
    this.hp = Math.max(0, this.hp - amount);
    this.hurtFlash = 1;
    this.invuln = 0.45;
    if (this.hp <= 0) {
      this.state = 'dead';
      this.action = null;
      this.dash = null;
    }
  }

  update(dt: number, ctx: MoveContext): void {
    this.time += dt;
    this.rollCooldown = Math.max(0, this.rollCooldown - dt);
    this.invuln = Math.max(0, this.invuln - dt);
    this.mp = Math.min(this.maxMp, this.mp + dt * (2 + this.maxMp * 0.02));

    const d = Player.worldDir(ctx.move);
    const mag = Math.min(1, Math.hypot(ctx.move.x, ctx.move.y));

    if (this.state === 'dead') {
      // 쓰러지는 동작
      this.rig.body.rotation.x += (-1.5 - this.rig.body.rotation.x) * Math.min(1, dt * 6);
      this.rig.body.position.y += (0.25 - this.rig.body.position.y) * Math.min(1, dt * 6);
      this.syncRoot();
      return;
    }

    if (this.state === 'dash' && this.dash) {
      const ds = this.dash;
      ds.t += dt;
      const k = ds.t / ds.duration;
      const speed = ds.speed * (ds.pose === 'roll' ? 1 - k * 0.55 : 1);
      ctx.applyMove(ds.dirX * speed * dt, ds.dirZ * speed * dt);
      ds.onStep?.();
      if (k >= 1) {
        this.dash = null;
        this.state = 'idle';
        ds.onEnd?.();
      }
    } else if (this.state === 'action' && this.action) {
      const a = this.action;
      a.t += dt;
      const mm = a.moveMult ?? 0.25;
      if (mag > 0.1 && mm > 0) ctx.applyMove((d.x / d.len) * PLAYER.walkSpeed * mm * mag * dt, (d.z / d.len) * PLAYER.walkSpeed * mm * mag * dt);
      if (!a.done && a.t >= a.duration * a.hitAt) {
        a.done = true;
        a.onHit();
      }
      if (a.t >= a.duration) {
        this.action = null;
        this.state = 'idle';
      }
    } else {
      const targetSpeed = mag > 0.12 ? PLAYER.walkSpeed * mag : 0;
      this.speed += (targetSpeed - this.speed) * Math.min(1, dt * 14);
      if (mag > 0.12) {
        this.facing = lerpAngle(this.facing, Math.atan2(d.x, d.z), Math.min(1, dt * 16));
        ctx.applyMove((d.x / d.len) * this.speed * dt, (d.z / d.len) * this.speed * dt);
        this.state = 'move';
      } else {
        if (this.speed > 0.05) ctx.applyMove(Math.sin(this.facing) * this.speed * dt, Math.cos(this.facing) * this.speed * dt);
        this.state = 'idle';
      }
    }

    this.animate(dt);
    this.syncRoot();
  }

  private syncRoot(): void {
    this.rig.root.position.set(this.position.x, 0, this.position.z);
    this.rig.root.rotation.y = this.facing;
  }

  private animate(dt: number): void {
    const r = this.rig;
    const k = Math.min(1, dt * 18);
    const ease = (obj: { x: number }, v: number) => (obj.x += (v - obj.x) * k);
    const weapon = this.cls.look.weapon;

    let legL = 0;
    let legR = 0;
    let armL = 0.1;
    let armR = -0.35;
    let weaponX = weapon === 'sword' ? -1.0 : 0.35;
    let torsoY = 0;
    let torsoX = 0;
    let bodyY = 0.6;
    let spin = 0;

    const moving = this.state === 'move' || (this.state === 'idle' && this.speed > 0.3);
    if (moving) {
      this.walkPhase += dt * (6 + this.speed * 1.6);
      const s = Math.sin(this.walkPhase);
      const amt = Math.min(1, this.speed / PLAYER.walkSpeed);
      legL = s * 0.85 * amt;
      legR = -s * 0.85 * amt;
      armL = 0.1 - s * 0.6 * amt;
      armR = -0.35 + s * 0.35 * amt;
      torsoX = 0.12 * amt;
      bodyY = 0.6 + Math.abs(Math.cos(this.walkPhase)) * 0.07 * amt;
    } else {
      bodyY = 0.6 + Math.sin(this.time * 2.4) * 0.012;
    }

    if (this.state === 'action' && this.action) {
      const a = this.action;
      const t = Math.min(1, a.t / a.duration);
      const h = a.hitAt;
      const up = t < h ? t / h : 1 - Math.min(1, (t - h) / 0.3);
      const down = t < h ? 0 : Math.min(1, (t - h) / 0.25);
      legL = 0.35;
      legR = -0.25;
      switch (a.pose) {
        case 'swing': {
          const side = a.combo === 1 ? -1 : 1;
          const big = a.combo === 2 ? 1.25 : 1;
          armR = -0.35 - up * 2.6 * big - (1 - up) * down * 0.3;
          weaponX = -1.0 + up * 0.4 - down * 0.2;
          torsoY = side * (up * 0.45 - down * 0.55) * big;
          torsoX = -up * 0.12 + down * 0.22;
          armL = 0.5;
          if (a.combo === 2) bodyY = 0.6 + Math.sin(t * Math.PI) * 0.25;
          r.armR.rotation.x = armR;
          r.torso.rotation.y = torsoY;
          break;
        }
        case 'gather':
          // 도구를 머리 위로 들었다가 내려찍는다
          armR = -0.35 - up * 2.4 - (1 - up) * down * 0.2;
          armL = -0.3 - up * 1.8;
          weaponX = -1.2 + up * 0.3;
          torsoX = -up * 0.1 + down * 0.3;
          r.armR.rotation.x = armR;
          break;
        case 'spin':
          spin = t * Math.PI * 2;
          armR = -1.5;
          armL = -1.2;
          weaponX = -1.4;
          break;
        case 'thrust':
          armR = -1.5 - up * 0.2;
          weaponX = -0.1;
          torsoX = 0.2;
          break;
        case 'cast':
          armR = -0.6 - up * 1.4 + down * 0.6;
          armL = -0.4 - up * 1.0;
          weaponX = -armR * 0.7;
          torsoX = -up * 0.1 + down * 0.15;
          break;
        case 'shoot':
          armR = -1.55;
          armL = -1.35;
          weaponX = 1.55;
          torsoY = 0.35;
          break;
      }
    }

    if (this.state === 'dash' && this.dash) {
      const t = Math.min(1, this.dash.t / this.dash.duration);
      switch (this.dash.pose) {
        case 'roll':
          r.body.rotation.x = t * Math.PI * 2;
          bodyY = 0.45 + Math.sin(t * Math.PI) * 0.15;
          legL = legR = -1.2;
          armL = armR = -1.4;
          break;
        case 'lunge':
          armR = -1.55;
          weaponX = -0.05;
          torsoX = 0.35;
          legL = 0.8;
          legR = -0.8;
          break;
        case 'leap':
          bodyY = 0.6 + Math.sin(t * Math.PI) * 1.1;
          legL = legR = -0.6;
          armR = -1.55;
          armL = -1.35;
          weaponX = 1.55;
          break;
      }
    }
    if (!(this.state === 'dash' && this.dash?.pose === 'roll')) r.body.rotation.x = 0;

    ease(r.legL.rotation, legL);
    ease(r.legR.rotation, legR);
    ease(r.armL.rotation, armL);
    ease(r.armR.rotation, armR);
    ease(r.weapon.rotation, weaponX);
    ease(r.torso.rotation, torsoX);
    r.torso.rotation.y += (torsoY - r.torso.rotation.y) * k;
    r.body.rotation.y = spin;
    // 채집 중에는 무기 대신 도구를 든다
    const tool = this.state === 'action' && this.action?.pose === 'gather' ? this.action.tool : undefined;
    r.weapon.visible = !tool;
    r.pickaxe.visible = tool === 'pickaxe';
    r.axe.visible = tool === 'axe';
    r.pickaxe.rotation.x = r.axe.rotation.x = weaponX;
    r.body.position.y = bodyY;

    // 맞았을 때 붉게, 무적 시간에는 깜빡인다
    if (this.hurtFlash > 0) {
      this.hurtFlash = Math.max(0, this.hurtFlash - dt * 5);
      this.material.emissive.copy(HURT).multiplyScalar(this.hurtFlash * 0.7);
    } else this.material.emissive.setHex(0);
    r.root.visible = this.invuln <= 0 || Math.floor(this.time * 20) % 2 === 0;
  }
}

/**
 * 벽 뒤에 가려져도 캐릭터 윤곽이 보이도록 실루엣을 그린다.
 * 실루엣(renderOrder 1)은 벽보다 뒤에 있을 때만 그려지고,
 * 그 다음 캐릭터 본체(renderOrder 2)가 덮어써서 자기 몸에는 실루엣이 생기지 않는다.
 */
function addSilhouette(meshes: Mesh[]): void {
  const mat = new MeshBasicMaterial({ color: 0x7fb4ff, depthFunc: GreaterDepth, depthWrite: false });
  for (const m of meshes) {
    const sil = new Mesh(m.geometry, mat);
    sil.renderOrder = 1;
    m.renderOrder = 2;
    m.add(sil);
  }
}
