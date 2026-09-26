import type { DebuffId } from '../data/species';
import { AdditiveBlending, AlwaysStencilFunc, Color, CylinderGeometry, DoubleSide, GreaterDepth, Group, Material, Mesh, MeshBasicMaterial, MeshLambertMaterial, NotEqualStencilFunc, OctahedronGeometry, Plane, ReplaceStencilOp, RingGeometry, Vector3 } from 'three';
import { PLAYER, SCREEN_RIGHT, SCREEN_UP } from '../config';
import type { ClassDef } from '../data/classes';
import { buildHero, glowColor, type HeroGear, type HeroRig } from '../models/hero';

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

export type BuffId = 'ironwall' | 'block' | 'warcry' | 'manashield' | 'focus' | 'windwalk' | 'smoke' | 'hunter' | 'haste' | 'swift' | DebuffId;
export interface Buff {
  id: BuffId;
  name: string;
  t: number;
  /** 막기 같은 횟수형 버프 */
  stacks?: number;
  /** 몬스터가 건 약화 효과 */
  bad?: boolean;
  /** 지속 피해 (초당) */
  dps?: number;
  tick?: number;
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
  /** 이동 속도 보너스 (각인·칭호) */
  moveBonus = 0;
  /** 전투 중에도 차는 MP (초당 최대 MP 비율, 비전 장비) */
  mpRegenBonus = 0;
  /** 특수 옵션: 초당 최대 체력의 몇 배 재생 */
  hpRegenBonus = 0;
  private walkPhase = 0;
  private time = 0;
  private action: (ActionSpec & { t: number; done: boolean }) | null = null;
  private dash: (DashSpec & { t: number }) | null = null;
  /** 다음 회피 충전까지 남은 시간 (충전이 가득이면 0) */
  rollCooldown = 0;
  /** 회피 충전 횟수 (장화 특수 옵션으로 늘어난다)와 지금 남은 충전 */
  dodgeCharges = 1;
  dodgeStock = 1;
  get canDodge(): boolean {
    return this.dodgeStock >= 1;
  }
  /** 회피를 한 번 쓴다: 충전 하나를 쓰고, 충전 중이 아니면 재충전을 시작한다 */
  useDodge(cooldown: number): void {
    this.dodgeStock = Math.max(0, this.dodgeStock - 1);
    if (this.rollCooldown <= 0) this.rollCooldown = this.dodgeMax = cooldown;
    else this.dodgeMax = Math.max(this.dodgeMax, cooldown);
  }
  /** 걸려 있는 버프 (방어·보조 스킬) */
  buffs: Buff[] = [];
  /** 마지막으로 싸운 뒤 지난 시간 */
  private combatT = 99;
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
    addSilhouette(this.rig.meshes, this.material);
    if (gear?.glow) this.addGlow(gear.glow);
  }

  setPosition(x: number, z: number): void {
    this.position.x = x;
    this.position.z = z;
    this.syncRoot();
  }

  /** 잠깐 무적 (막기·회피 직후 연속 피격 방지) */
  invulnFor(t: number): void {
    this.invuln = Math.max(this.invuln, t);
  }

  addBuff(id: BuffId, name: string, duration: number, stacks?: number): void {
    this.buffs = this.buffs.filter((b) => b.id !== id);
    this.buffs.push({ id, name, t: duration, stacks });
  }

  /** 약화 효과: 같은 것이 걸려 있으면 시간만 새로 (지속 피해는 더 센 쪽) */
  addDebuff(id: DebuffId, name: string, duration: number, dps?: number): void {
    const old = this.buffs.find((b) => b.id === id);
    if (old) {
      old.t = Math.max(old.t, duration);
      if (dps) old.dps = Math.max(old.dps ?? 0, dps);
      return;
    }
    this.buffs.push({ id, name, t: duration, bad: true, dps, tick: 1 });
  }

  /** 지속 피해: 무적 시간 없이 체력만 깎는다 */
  hurtDot(amount: number): void {
    this.hp = Math.max(0, this.hp - amount);
    this.hurtFlash = Math.max(this.hurtFlash, 0.4);
    if (this.hp <= 0) {
      this.state = 'dead';
      this.action = null;
      this.dash = null;
    }
  }

  buff(id: BuffId): Buff | undefined {
    return this.buffs.find((b) => b.id === id);
  }

  get canAct(): boolean {
    return (this.state === 'idle' || this.state === 'move') && !this.buff('stun');
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

  /** 회피 버튼의 재사용 대기 최대값 (HUD 비율용): 직업마다 다르다 */
  dodgeMax = 0;

  /** 입력 방향(없으면 바라보는 방향)의 단위 벡터 */
  dodgeDir(move: { x: number; y: number }): { x: number; z: number } {
    const d = Player.worldDir(move);
    return d.len > 0.1 ? { x: d.x / d.len, z: d.z / d.len } : { x: Math.sin(this.facing), z: Math.cos(this.facing) };
  }

  /** 마법사 블링크: 정해진 거리를 한순간에 이동한다. 무적은 없다 */
  startBlink(move: { x: number; y: number }, onEnd: () => void): boolean {
    if (this.buff('stun') || !this.canDodge || this.state === 'dash' || !this.alive) return false;
    const dir = this.dodgeDir(move);
    this.startDash({ dirX: dir.x, dirZ: dir.z, speed: PLAYER.blinkDist / 0.1, duration: 0.1, pose: 'lunge', invuln: false, onEnd });
    this.useDodge(PLAYER.blinkCooldown);
    return true;
  }

  startRoll(move: { x: number; y: number }): boolean {
    if (this.buff('stun') || !this.canDodge || this.state === 'dash' || !this.alive) return false;
    const d = Player.worldDir(move);
    const dir = d.len > 0.1 ? { x: d.x / d.len, z: d.z / d.len } : { x: Math.sin(this.facing), z: Math.cos(this.facing) };
    this.startDash({ dirX: dir.x, dirZ: dir.z, speed: PLAYER.rollSpeed, duration: PLAYER.rollTime, pose: 'roll', invuln: true });
    this.useDodge(PLAYER.rollCooldown + PLAYER.rollTime);
    return true;
  }

  get isInvulnerable(): boolean {
    return this.invuln > 0 || (this.dash?.invuln ?? false) || !this.alive;
  }

  /** 싸웠다(때리거나 맞았다): MP 회복이 3초 멈춘다 */
  inCombat(): void {
    this.combatT = 0;
  }

  get mpRegenerating(): boolean {
    return this.combatT >= MP_REGEN_DELAY;
  }

  hurt(amount: number): void {
    this.combatT = 0;
    this.hp = Math.max(0, this.hp - amount);
    this.hurtFlash = 1;
    this.invuln = 0.45;
    if (this.hp <= 0) {
      this.state = 'dead';
      this.action = null;
      this.dash = null;
    }
  }

  /** 강화 빛: 장비 모양을 살짝 크게 덧씌운 빛나는 껍질. 단계가 높을수록 진하고 색이 바뀐다 */
  private glows: { mat: MeshBasicMaterial; base: number; speed: number }[] = [];
  private addGlow(glow: NonNullable<HeroGear['glow']>): void {
    const add = (meshes: Mesh[], plus: number, scale: number) => {
      if (plus <= 0) return;
      const mat = new MeshBasicMaterial({ color: glowColor(plus), transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false });
      for (const m of meshes) {
        const shell = new Mesh(m.geometry, mat);
        shell.scale.setScalar(scale);
        m.add(shell);
      }
      this.glows.push({ mat, base: 0.1 + plus * 0.035, speed: 2 + plus * 0.25 });
    };
    // 강화한 부위의 장비 조각에만 빛을 씌운다
    for (const [slot, plus] of Object.entries(glow) as [keyof typeof glow, number][]) add(this.rig.gearMeshes[slot], plus, slot === 'weapon' ? 1.14 : 1.08);
  }

  private aura: { group: Group; spin: Group; motes: Mesh[]; mats: MeshBasicMaterial[]; level: number } | null = null;

  /** 발밑 오라 (주간 시련 보상). level 0~4: 고리 → 이중 고리 → 문양 → 빛기둥 → 떠오르는 빛 */
  setAura(level: number, color: number): void {
    if (this.aura) {
      this.rig.root.remove(this.aura.group);
      this.aura = null;
    }
    if (level < 0) return;
    const group = new Group();
    const spin = new Group();
    group.add(spin);
    const mats: MeshBasicMaterial[] = [];
    const mat = (opacity: number) => {
      const m = new MeshBasicMaterial({ color, transparent: true, opacity, blending: AdditiveBlending, depthWrite: false, side: DoubleSide });
      mats.push(m);
      return m;
    };
    const flat = (g: RingGeometry, o: number, y = 0.04) => {
      const m = new Mesh(g, mat(o));
      m.rotation.x = -Math.PI / 2;
      m.position.y = y;
      m.renderOrder = 2;
      spin.add(m);
      return m;
    };
    flat(new RingGeometry(0.62, 0.8, 40), 0.5);
    flat(new RingGeometry(0.2, 0.62, 40), 0.12);
    if (level >= 1) flat(new RingGeometry(0.95, 1.0, 48), 0.45, 0.05);
    if (level >= 2) {
      // 바깥 고리 위의 여섯 문양
      for (let i = 0; i < 6; i++) {
        const d = new Mesh(new OctahedronGeometry(0.09, 0), mat(0.8));
        const a = (i / 6) * Math.PI * 2;
        d.position.set(Math.cos(a) * 0.98, 0.08, Math.sin(a) * 0.98);
        d.scale.set(1, 0.3, 1.6);
        d.rotation.y = -a;
        spin.add(d);
      }
    }
    if (level >= 3) {
      const col = new Mesh(new CylinderGeometry(0.72, 0.8, 1.6, 24, 1, true), mat(0.1));
      col.position.y = 0.8;
      group.add(col);
    }
    const motes: Mesh[] = [];
    if (level >= 4) {
      for (let i = 0; i < 8; i++) {
        const m = new Mesh(new OctahedronGeometry(0.06, 0), mat(0.9));
        m.userData.phase = i / 8;
        group.add(m);
        motes.push(m);
      }
    }
    this.rig.root.add(group);
    this.aura = { group, spin, motes, mats, level };
  }

  private updateAura(): void {
    const a = this.aura;
    if (!a) return;
    // 캐릭터가 도는 방향과 관계없이 천천히 돈다
    a.group.rotation.y = -this.facing;
    a.spin.rotation.y = this.time * (0.6 + a.level * 0.15);
    a.mats[0].opacity = 0.4 + 0.15 * Math.sin(this.time * 2.4);
    for (const m of a.motes) {
      const k = (this.time * 0.35 + (m.userData.phase as number)) % 1;
      const ang = (m.userData.phase as number) * Math.PI * 2 + this.time * 1.2;
      m.position.set(Math.cos(ang) * 0.75, k * 2, Math.sin(ang) * 0.75);
      (m.material as MeshBasicMaterial).opacity = 0.9 * (1 - k);
    }
  }

  update(dt: number, ctx: MoveContext): void {
    this.updateAura();
    // 강화 빛은 천천히 숨 쉬듯 밝아졌다 어두워진다
    for (const g of this.glows) g.mat.opacity = g.base * (0.65 + 0.35 * Math.sin(this.time * g.speed));
    this.time += dt;
    for (const b of this.buffs) b.t -= dt;
    this.buffs = this.buffs.filter((b) => b.t > 0 && (b.stacks === undefined || b.stacks > 0));
    // 회피 충전: 하나씩 차례로 찬다
    if (this.dodgeStock > this.dodgeCharges) this.dodgeStock = this.dodgeCharges;
    if (this.dodgeStock < this.dodgeCharges) {
      if (this.rollCooldown <= 0) this.rollCooldown = this.dodgeMax || 1;
      this.rollCooldown -= dt;
      if (this.rollCooldown <= 0) {
        this.dodgeStock++;
        this.rollCooldown = this.dodgeStock < this.dodgeCharges ? this.dodgeMax : 0;
      }
    } else this.rollCooldown = 0;
    this.invuln = Math.max(0, this.invuln - dt);
    // MP는 전투 중에는 차지 않는다: 3초 동안 때리지도 맞지도 않아야 회복된다
    this.combatT += dt;
    if (this.combatT >= MP_REGEN_DELAY) this.mp = Math.min(this.maxMp, this.mp + dt * (2 + this.maxMp * 0.02));
    else if (this.mpRegenBonus > 0) this.mp = Math.min(this.maxMp, this.mp + dt * this.maxMp * this.mpRegenBonus);
    if (this.hpRegenBonus > 0 && this.state !== 'dead' && this.hp > 0) this.hp = Math.min(this.maxHp, this.hp + dt * this.maxHp * this.hpRegenBonus);

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
    } else if (this.buff('stun')) {
      // 기절: 제자리에서 비틀거린다
      this.speed = 0;
      this.state = 'idle';
      this.rig.body.rotation.z = Math.sin(this.time * 9) * 0.12;
    } else {
      this.rig.body.rotation.z = 0;
      const targetSpeed = mag > 0.12 ? PLAYER.walkSpeed * (1 + this.moveBonus) * mag * (this.buff('windwalk') ? 1.4 : 1) * (this.buff('swift') ? 1.2 : 1) * (this.buff('slow') ? 0.6 : 1) : 0;
      this.speed += (targetSpeed - this.speed) * Math.min(1, dt * 14);
      if (mag > 0.12) {
        this.facing = lerpAngle(this.facing, Math.atan2(d.x, d.z), Math.min(1, dt * 34));
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

    let rollZ = 0;
    let rollScale = 1;
    if (this.state === 'dash' && this.dash) {
      const t = Math.min(1, this.dash.t / this.dash.duration);
      switch (this.dash.pose) {
        case 'roll': {
          // 엉덩이가 아니라 몸 가운데를 축으로 웅크려 구른다 (머리가 땅에 파묻히지 않게)
          const th = t * Math.PI * 2;
          const c = 0.42 * ROLL_TUCK;
          r.body.rotation.x = th;
          bodyY = 0.78 - c * Math.cos(th) + Math.sin(t * Math.PI) * 0.12;
          rollZ = -c * Math.sin(th);
          rollScale = ROLL_TUCK;
          legL = legR = -1.5;
          armL = armR = -1.6;
          break;
        }
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
    r.body.position.z = rollZ;
    r.body.scale.setScalar(rollScale);

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

/** 전투가 끝나고 MP가 차기 시작할 때까지 (초) */
const MP_REGEN_DELAY = 3;

/** 구를 때 몸을 웅크리는 비율 */
const ROLL_TUCK = 0.82;

/**
 * 벽이나 나무 뒤에 가려져도 캐릭터 윤곽이 은은하게 비쳐 보이게 한다.
 * - 가려진 부분에만(GreaterDepth) 반투명한 푸른 그림자를 칠한다
 * - 스텐실로 한 픽셀에 한 번만 칠해서, 팔·몸이 겹친 곳이 진해지지 않는다
 * - 바닥 높이 아래는 잘라 내서 땅에 살짝 묻힐 때 파랗게 물들지 않는다
 * 본체(renderOrder 2)가 나중에 덮어써서 자기 몸에는 실루엣이 생기지 않는다.
 */
function addSilhouette(meshes: Mesh[], body: MeshLambertMaterial): void {
  // 보이는 몸이 먼저 스텐실에 1을 찍는다 → 실루엣은 몸이 보이는 곳에는 절대 칠해지지 않는다
  // (반투명 실루엣은 불투명한 몸보다 나중에 그려져서, 몸 뒤에 숨은 팔·다리의 실루엣이 몸 위에 비치던 문제)
  body.stencilWrite = true;
  body.stencilRef = 1;
  body.stencilFunc = AlwaysStencilFunc;
  body.stencilZPass = ReplaceStencilOp;
  const mat = new MeshBasicMaterial({
    color: 0x9ab8ff,
    transparent: true,
    opacity: 0.32,
    depthFunc: GreaterDepth,
    depthWrite: false,
    clippingPlanes: [new Plane(new Vector3(0, 1, 0), -0.12)],
    stencilWrite: true,
    stencilRef: 1,
    stencilFunc: NotEqualStencilFunc,
    stencilZPass: ReplaceStencilOp,
  });
  for (const m of meshes) {
    const sil = new Mesh(m.geometry, mat);
    sil.renderOrder = 1;
    m.renderOrder = 2;
    m.add(sil);
  }
}
