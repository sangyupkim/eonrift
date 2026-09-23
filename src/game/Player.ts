import { GreaterDepth, Material, Mesh, MeshBasicMaterial } from 'three';
import { PLAYER, SCREEN_RIGHT, SCREEN_UP } from '../config';
import { buildHero, type HeroRig } from '../models/hero';

export type PlayerState = 'idle' | 'move' | 'roll' | 'attack';

export interface MoveContext {
  move: { x: number; y: number };
  /** 실제 이동을 적용하는 함수 (충돌 처리 포함) */
  applyMove: (dx: number, dz: number) => void;
}

const lerpAngle = (a: number, b: number, t: number) => {
  let d = ((b - a + Math.PI) % (Math.PI * 2)) - Math.PI;
  if (d < -Math.PI) d += Math.PI * 2;
  return a + d * t;
};

/** 검사 캐릭터: 이동, 구르기, 휘두르기와 그 애니메이션 */
export class Player {
  readonly rig: HeroRig;
  readonly position = { x: 0, z: 0 };
  facing = 0;
  state: PlayerState = 'idle';

  private speed = 0;
  private walkPhase = 0;
  private stateTime = 0;
  private rollDir = { x: 0, z: 1 };
  private rollCooldown = 0;
  private hitDone = false;
  private time = 0;
  /** 공격 판정이 나오는 순간 한 번 호출된다 */
  onAttackHit: (() => void) | null = null;

  constructor(material: Material) {
    this.rig = buildHero(material);
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

  get rollReady(): number {
    return this.rollCooldown;
  }

  /** 대상 방향으로 몸을 돌리고 휘두른다 */
  startAttack(targetAngle: number | null): boolean {
    if (!this.canAct) return false;
    if (targetAngle !== null) this.facing = targetAngle;
    this.state = 'attack';
    this.stateTime = 0;
    this.hitDone = false;
    return true;
  }

  startRoll(move: { x: number; y: number }): boolean {
    if (this.state === 'roll' || this.rollCooldown > 0) return false;
    const len = Math.hypot(move.x, move.y);
    if (len > 0.1) {
      this.rollDir = {
        x: (SCREEN_RIGHT.x * move.x + SCREEN_UP.x * move.y) / len,
        z: (SCREEN_RIGHT.z * move.x + SCREEN_UP.z * move.y) / len,
      };
      this.facing = Math.atan2(this.rollDir.x, this.rollDir.z);
    } else {
      this.rollDir = { x: Math.sin(this.facing), z: Math.cos(this.facing) };
    }
    this.state = 'roll';
    this.stateTime = 0;
    this.rollCooldown = PLAYER.rollCooldown + PLAYER.rollTime;
    return true;
  }

  update(dt: number, ctx: MoveContext): void {
    this.time += dt;
    this.stateTime += dt;
    this.rollCooldown = Math.max(0, this.rollCooldown - dt);

    const { move } = ctx;
    const mag = Math.min(1, Math.hypot(move.x, move.y));
    const dirX = SCREEN_RIGHT.x * move.x + SCREEN_UP.x * move.y;
    const dirZ = SCREEN_RIGHT.z * move.x + SCREEN_UP.z * move.y;

    if (this.state === 'roll') {
      const t = this.stateTime / PLAYER.rollTime;
      const speed = PLAYER.rollSpeed * (1 - t * 0.55);
      ctx.applyMove(this.rollDir.x * speed * dt, this.rollDir.z * speed * dt);
      if (t >= 1) this.state = 'idle';
    } else if (this.state === 'attack') {
      // 휘두르는 동안 천천히 움직일 수 있다
      if (mag > 0.1) ctx.applyMove(dirX * PLAYER.walkSpeed * 0.25 * dt, dirZ * PLAYER.walkSpeed * 0.25 * dt);
      const t = this.stateTime / PLAYER.attackTime;
      if (!this.hitDone && t >= PLAYER.attackHitAt) {
        this.hitDone = true;
        this.onAttackHit?.();
      }
      if (t >= 1) this.state = 'idle';
    } else {
      // 가속·감속을 부드럽게
      const targetSpeed = mag > 0.12 ? PLAYER.walkSpeed * mag : 0;
      this.speed += (targetSpeed - this.speed) * Math.min(1, dt * 14);
      if (mag > 0.12) {
        const angle = Math.atan2(dirX, dirZ);
        this.facing = lerpAngle(this.facing, angle, Math.min(1, dt * 16));
        const len = Math.hypot(dirX, dirZ);
        ctx.applyMove((dirX / len) * this.speed * dt, (dirZ / len) * this.speed * dt);
        this.state = 'move';
      } else {
        if (this.speed > 0.05) {
          ctx.applyMove(Math.sin(this.facing) * this.speed * dt, Math.cos(this.facing) * this.speed * dt);
        }
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

    // 기본 자세 목표값
    let legL = 0;
    let legR = 0;
    let armL = 0.1;
    let armR = -0.35;
    let swordX = -1.0;
    let torsoY = 0;
    let torsoX = 0;
    let bodyY = 0.6;
    let bodyRoll = 0;

    const moving = this.state === 'move' || (this.state !== 'roll' && this.speed > 0.3);
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

    if (this.state === 'attack') {
      // 위에서 아래로 내려치기: 앞 30%는 들어 올리고 나머지는 빠르게 내린다
      const t = this.stateTime / PLAYER.attackTime;
      const up = t < 0.3 ? t / 0.3 : 1 - Math.min(1, (t - 0.3) / 0.25);
      const down = t < 0.3 ? 0 : Math.min(1, (t - 0.3) / 0.25);
      armR = -0.35 - up * 2.6 - (1 - up) * down * 0.3;
      swordX = -1.0 + up * 0.4 - down * 0.2;
      torsoY = up * 0.35 - down * 0.45;
      torsoX = -up * 0.12 + down * 0.22;
      legL = 0.35;
      legR = -0.25;
      armL = 0.5;
      // 판정 순간에는 즉시 자세를 맞춘다 (타격감)
      r.armR.rotation.x = armR;
      r.torso.rotation.y = torsoY;
    }

    if (this.state === 'roll') {
      const t = Math.min(1, this.stateTime / PLAYER.rollTime);
      bodyRoll = t * Math.PI * 2;
      bodyY = 0.45 + Math.sin(t * Math.PI) * 0.15;
      legL = legR = -1.2;
      armL = armR = -1.4;
      r.body.rotation.x = bodyRoll;
    } else {
      r.body.rotation.x = 0;
    }

    ease(r.legL.rotation, legL);
    ease(r.legR.rotation, legR);
    ease(r.armL.rotation, armL);
    ease(r.armR.rotation, armR);
    ease(r.sword.rotation, swordX);
    ease(r.torso.rotation, torsoX);
    r.torso.rotation.y += (torsoY - r.torso.rotation.y) * k;
    r.body.position.y = bodyY;
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
