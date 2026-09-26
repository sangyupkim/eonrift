import { loadControls, type Bindable, type Controls } from './controls';

/** 한 번 누를 때 한 번만 처리되는 입력 */
export type Action = 'attack' | 'dodge' | 'interact' | 'bag' | 'char' | 'recipes' | 'warp' | 'pause' | 'skill1' | 'skill2' | 'skill3' | 'ult' | 'potion' | 'build' | 'map';

/**
 * 키보드, 마우스, 가상 조이스틱, 화면 버튼 입력을 하나로 모은다.
 * 이동 벡터는 화면 기준이다 (x: 오른쪽, y: 위쪽). 키는 조작 설정에서 바꿀 수 있다.
 */
export class Input {
  /** 가상 조이스틱 값 (-1 ~ 1) */
  stickX = 0;
  stickY = 0;
  /** 화면 공격 버튼을 누르고 있는지 */
  attackButtonHeld = false;
  /** 조작 설정 */
  controls: Controls = loadControls();
  /** 마우스 이동: 누르고 있는 동안의 커서 위치 (화면 좌표) */
  mouseMoveHeld = false;
  mouseX = 0;
  mouseY = 0;
  /** 마우스로 찍은 곳까지 걸어가는 중인지 (게임이 도착하면 끈다) */
  mouseMoveActive = false;
  /** 키를 바꾸는 중: 다음 키 입력을 여기로 보낸다 */
  capture: ((key: string) => void) | null = null;

  private keys = new Set<string>();
  private mouseHeld = false;
  private pressed = new Set<Action>();
  private keyToAction = new Map<string, Bindable>();

  constructor(canvas: HTMLElement) {
    this.setControls(this.controls);
    window.addEventListener(
      'keydown',
      (e) => {
        const key = e.key.toLowerCase();
        if (this.capture) {
          e.preventDefault();
          e.stopPropagation();
          const cb = this.capture;
          this.capture = null;
          cb(key);
          return;
        }
        if (e.repeat) return;
        // 글자 입력칸(저장 코드)에서는 게임 키로 쓰지 않는다
        const tag = (e.target as HTMLElement | null)?.tagName;
        if (tag === 'TEXTAREA' || tag === 'INPUT') return;
        this.keys.add(key);
        const b = this.keyToAction.get(key);
        if (b) {
          if (b !== 'up' && b !== 'down' && b !== 'left' && b !== 'right') this.pressed.add(b);
          e.preventDefault();
        } else if (key.startsWith('arrow')) e.preventDefault();
      },
      true,
    );
    window.addEventListener('keyup', (e) => this.keys.delete(e.key.toLowerCase()));
    window.addEventListener('blur', () => {
      this.keys.clear();
      this.mouseHeld = false;
      this.mouseMoveHeld = false;
      this.attackButtonHeld = false;
    });
    // PC 마우스: 이동 방식에 따라 한쪽 버튼은 이동, 다른 쪽(또는 왼쪽)은 공격
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    canvas.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse') return;
      const c = this.controls;
      const btn = e.button === 0 ? 'left' : e.button === 2 ? 'right' : null;
      if (!btn) return;
      if (c.moveMode === 'mouse' && btn === c.moveButton) {
        this.mouseMoveHeld = true;
        this.mouseMoveActive = true;
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
        return;
      }
      const attackBtn = c.moveMode === 'mouse' ? (c.moveButton === 'left' ? 'right' : 'left') : 'left';
      if (c.mouseAttack && btn === attackBtn) {
        this.mouseHeld = true;
        this.pressed.add('attack');
      }
    });
    window.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse' || !this.mouseMoveHeld) return;
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });
    window.addEventListener('pointerup', (e) => {
      if (e.pointerType !== 'mouse') return;
      this.mouseHeld = false;
      this.mouseMoveHeld = false;
    });
  }

  /** 조작 설정 적용 (키 → 동작 표를 다시 만든다) */
  setControls(c: Controls): void {
    this.controls = c;
    this.keyToAction.clear();
    for (const [b, k] of Object.entries(c.keys) as [Bindable, string][]) if (k) this.keyToAction.set(k, b);
    this.mouseMoveActive = false;
  }

  press(action: Action): void {
    this.pressed.add(action);
  }

  /** 이번 프레임에 눌렸는지 확인하고 소비한다 */
  consume(action: Action): boolean {
    return this.pressed.delete(action);
  }

  clearPressed(): void {
    this.pressed.clear();
  }

  get attackHeld(): boolean {
    return this.attackButtonHeld || this.mouseHeld || this.keys.has(this.controls.keys.attack);
  }

  /** 키보드 이동 (방향키는 언제나 함께 쓸 수 있다) */
  keyMove(): { x: number; y: number } {
    const k = this.controls.keys;
    let x = 0;
    let y = 0;
    if (this.keys.has(k.left) || this.keys.has('arrowleft')) x -= 1;
    if (this.keys.has(k.right) || this.keys.has('arrowright')) x += 1;
    if (this.keys.has(k.up) || this.keys.has('arrowup')) y += 1;
    if (this.keys.has(k.down) || this.keys.has('arrowdown')) y -= 1;
    if (x === 0 && y === 0) return { x: 0, y: 0 };
    const len = Math.hypot(x, y);
    return { x: x / len, y: y / len };
  }

  /** 화면 기준 이동 방향 (키보드 → 조이스틱). 마우스 이동은 게임이 따로 계산한다. 길이는 0~1 */
  getMove(): { x: number; y: number } {
    const k = this.keyMove();
    if (k.x !== 0 || k.y !== 0) {
      this.mouseMoveActive = false;
      return k;
    }
    if (this.stickX !== 0 || this.stickY !== 0) this.mouseMoveActive = false;
    return { x: this.stickX, y: this.stickY };
  }
}
