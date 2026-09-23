import type { Input } from '../core/input';

const RADIUS = 56;
const DEAD_ZONE = 0.12;

/**
 * 플로팅 가상 조이스틱.
 * 화면 왼쪽 영역 어디를 눌러도 그 자리에 생기고, 손을 떼면 좌하단 기본 위치로 돌아간다.
 */
export class Joystick {
  private base: HTMLDivElement;
  private knob: HTMLDivElement;
  private pointerId: number | null = null;
  private origin = { x: 0, y: 0 };

  constructor(
    private zone: HTMLElement,
    private input: Input,
  ) {
    this.base = document.createElement('div');
    this.base.className = 'joy-base';
    this.knob = document.createElement('div');
    this.knob.className = 'joy-knob';
    this.base.appendChild(this.knob);
    zone.appendChild(this.base);
    this.reset();

    zone.addEventListener('pointerdown', (e) => this.onDown(e));
    zone.addEventListener('pointermove', (e) => this.onMove(e));
    zone.addEventListener('pointerup', (e) => this.onUp(e));
    zone.addEventListener('pointercancel', (e) => this.onUp(e));
  }

  private onDown(e: PointerEvent): void {
    // 마우스는 PC에서 공격에 쓰므로 조이스틱은 터치·펜만 받는다
    if (this.pointerId !== null || e.pointerType === 'mouse') return;
    e.preventDefault();
    this.pointerId = e.pointerId;
    this.zone.setPointerCapture(e.pointerId);
    const rect = this.zone.getBoundingClientRect();
    // 화면 가장자리에서 눌러도 조이스틱이 잘리지 않게 한다
    this.origin = {
      x: Math.max(rect.left + RADIUS + 8, Math.min(e.clientX, rect.right - RADIUS - 8)),
      y: Math.max(rect.top + RADIUS + 8, Math.min(e.clientY, rect.bottom - RADIUS - 8)),
    };
    this.base.classList.add('active');
    this.place(this.origin.x - rect.left, this.origin.y - rect.top);
    this.update(e.clientX, e.clientY);
  }

  private onMove(e: PointerEvent): void {
    if (e.pointerId !== this.pointerId) return;
    e.preventDefault();
    this.update(e.clientX, e.clientY);
  }

  private onUp(e: PointerEvent): void {
    if (e.pointerId !== this.pointerId) return;
    this.pointerId = null;
    this.reset();
  }

  private update(clientX: number, clientY: number): void {
    let dx = clientX - this.origin.x;
    let dy = clientY - this.origin.y;
    const len = Math.hypot(dx, dy);
    if (len > RADIUS) {
      dx = (dx / len) * RADIUS;
      dy = (dy / len) * RADIUS;
    }
    this.knob.style.transform = `translate(${dx}px, ${dy}px)`;
    const mag = Math.min(1, len / RADIUS);
    if (mag < DEAD_ZONE) {
      this.input.stickX = 0;
      this.input.stickY = 0;
      return;
    }
    // 데드존 밖에서 0부터 다시 시작하도록 보정 (화면 y는 아래가 +라서 뒤집는다)
    const scaled = (mag - DEAD_ZONE) / (1 - DEAD_ZONE);
    this.input.stickX = (dx / (len || 1)) * scaled;
    this.input.stickY = (-dy / (len || 1)) * scaled;
  }

  reset(): void {
    this.input.stickX = 0;
    this.input.stickY = 0;
    this.base.classList.remove('active');
    this.knob.style.transform = 'translate(0px, 0px)';
    const rect = this.zone.getBoundingClientRect();
    const safeLeft = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--safe-left')) || 0;
    this.place(RADIUS + 36 + safeLeft, rect.height - RADIUS - 30);
  }

  private place(x: number, y: number): void {
    this.base.style.left = `${x - RADIUS}px`;
    this.base.style.top = `${y - RADIUS}px`;
  }
}
