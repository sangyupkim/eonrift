/** 한 번 누를 때 한 번만 처리되는 입력 */
export type Action = 'attack' | 'dodge' | 'interact' | 'bag' | 'char' | 'pause' | 'skill1' | 'skill2' | 'skill3' | 'potion' | 'build' | 'map';

/**
 * 키보드, 가상 조이스틱, 화면 버튼 입력을 하나로 모은다.
 * 이동 벡터는 화면 기준이다 (x: 오른쪽, y: 위쪽).
 */
export class Input {
  /** 가상 조이스틱 값 (-1 ~ 1) */
  stickX = 0;
  stickY = 0;
  /** 화면 공격 버튼을 누르고 있는지 */
  attackButtonHeld = false;

  private keys = new Set<string>();
  private mouseHeld = false;
  private pressed = new Set<Action>();

  constructor(canvas: HTMLElement) {
    window.addEventListener('keydown', (e) => {
      if (e.repeat) return;
      // 글자 입력칸(저장 코드)에서는 게임 키로 쓰지 않는다
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'TEXTAREA' || tag === 'INPUT') return;
      const key = e.key.toLowerCase();
      this.keys.add(key);
      const action = KEY_ACTIONS[key];
      if (action) {
        this.pressed.add(action);
        e.preventDefault();
      }
    });
    window.addEventListener('keyup', (e) => this.keys.delete(e.key.toLowerCase()));
    window.addEventListener('blur', () => {
      this.keys.clear();
      this.mouseHeld = false;
      this.attackButtonHeld = false;
    });
    // PC: 캔버스 좌클릭으로 공격 (터치는 조이스틱과 버튼이 처리한다)
    canvas.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse' && e.button === 0) {
        this.mouseHeld = true;
        this.pressed.add('attack');
      }
    });
    window.addEventListener('pointerup', (e) => {
      if (e.pointerType === 'mouse') this.mouseHeld = false;
    });
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
    return this.attackButtonHeld || this.mouseHeld || this.keys.has('j');
  }

  /** 화면 기준 이동 방향. 길이는 0~1 */
  getMove(): { x: number; y: number } {
    let x = 0;
    let y = 0;
    if (this.keys.has('a') || this.keys.has('arrowleft')) x -= 1;
    if (this.keys.has('d') || this.keys.has('arrowright')) x += 1;
    if (this.keys.has('w') || this.keys.has('arrowup')) y += 1;
    if (this.keys.has('s') || this.keys.has('arrowdown')) y -= 1;
    if (x !== 0 || y !== 0) {
      const len = Math.hypot(x, y);
      return { x: x / len, y: y / len };
    }
    return { x: this.stickX, y: this.stickY };
  }
}

const KEY_ACTIONS: Record<string, Action> = {
  j: 'attack',
  ' ': 'dodge',
  e: 'interact',
  i: 'bag',
  c: 'char',
  escape: 'pause',
  '1': 'skill1',
  '2': 'skill2',
  '3': 'skill3',
  q: 'potion',
  b: 'build',
  m: 'map',
};
