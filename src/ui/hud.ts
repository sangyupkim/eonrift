import type { Action, Input } from '../core/input';
import { ICONS } from './icons';
import { Joystick } from './joystick';

const el = <K extends keyof HTMLElementTagNameMap>(tag: K, className = '', html = '') => {
  const e = document.createElement(tag);
  if (className) e.className = className;
  if (html) e.innerHTML = html;
  return e;
};

/** 전투 화면 HUD: 상태 바, 미니맵, 조이스틱, 행동 버튼, 알림 */
export class Hud {
  readonly root: HTMLDivElement;
  readonly joystick: Joystick;
  private tierLabel: HTMLDivElement;
  private minimapSlot: HTMLDivElement;
  private attackBtn: HTMLButtonElement;
  private attackIcon: HTMLSpanElement;
  private attackLabel: HTMLSpanElement;
  private dodgeBtn: HTMLButtonElement;
  private dodgeShade: HTMLDivElement;
  private toastEl: HTMLDivElement;
  private floatLayer: HTMLDivElement;
  private bagCount: HTMLSpanElement;
  private toastTimer = 0;

  constructor(
    parent: HTMLElement,
    private input: Input,
  ) {
    this.root = el('div', 'hud');
    parent.appendChild(this.root);

    const joyZone = el('div', 'joy-zone');
    this.root.appendChild(joyZone);
    this.joystick = new Joystick(joyZone, input);

    this.floatLayer = el('div', 'float-layer');
    this.root.appendChild(this.floatLayer);

    // 좌상단: 초상화와 HP/MP
    const status = el(
      'div',
      'status',
      `<div class="portrait">검</div>
       <div class="bars">
         <div class="bar hp"><div class="fill" style="width:100%"></div><span>100 / 100</span></div>
         <div class="bar mp"><div class="fill" style="width:100%"></div><span>50 / 50</span></div>
       </div>`,
    );
    this.tierLabel = el('div', 'tier-label');
    status.appendChild(this.tierLabel);
    this.root.appendChild(status);

    // 우상단: 미니맵과 메뉴 버튼
    const topRight = el('div', 'top-right');
    this.minimapSlot = el('div', 'minimap-slot');
    const menuCol = el('div', 'menu-col');
    const bagBtn = this.button('icon-btn', ICONS.bag, 'bag');
    this.bagCount = el('span', 'badge');
    bagBtn.appendChild(this.bagCount);
    menuCol.append(this.button('icon-btn', ICONS.pause, 'pause'), bagBtn);
    topRight.append(this.minimapSlot, menuCol);
    this.root.appendChild(topRight);

    // 우하단: 행동 버튼
    const actions = el('div', 'actions');
    this.attackBtn = el('button', 'act attack') as HTMLButtonElement;
    this.attackIcon = el('span', 'ico', ICONS.sword);
    this.attackLabel = el('span', 'lbl', '공격');
    this.attackBtn.append(this.attackIcon, this.attackLabel);
    this.attackBtn.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      this.attackBtn.setPointerCapture(e.pointerId);
      input.attackButtonHeld = true;
      input.press('attack');
      this.attackBtn.classList.add('down');
    });
    const release = () => {
      input.attackButtonHeld = false;
      this.attackBtn.classList.remove('down');
    };
    this.attackBtn.addEventListener('pointerup', release);
    this.attackBtn.addEventListener('pointercancel', release);

    this.dodgeBtn = this.button('act dodge', ICONS.dodge, 'dodge');
    this.dodgeShade = el('div', 'cooldown');
    this.dodgeBtn.appendChild(this.dodgeShade);

    const skills = [1, 2, 3].map((n) => {
      const b = this.button(`act skill s${n} locked`, ICONS.lock, `skill${n}` as Action);
      return b;
    });
    actions.append(this.attackBtn, this.dodgeBtn, ...skills);
    this.root.appendChild(actions);

    this.toastEl = el('div', 'toast');
    this.root.appendChild(this.toastEl);

    this.root.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  private button(className: string, icon: string, action: Action): HTMLButtonElement {
    const b = el('button', className, icon) as HTMLButtonElement;
    b.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      this.input.press(action);
      b.classList.add('down');
    });
    const up = () => b.classList.remove('down');
    b.addEventListener('pointerup', up);
    b.addEventListener('pointerleave', up);
    b.addEventListener('pointercancel', up);
    return b;
  }

  setVisible(v: boolean): void {
    this.root.classList.toggle('hidden', !v);
    if (!v) this.joystick.reset();
  }

  setTier(tier: number, name: string, color: number): void {
    this.tierLabel.innerHTML = `<i style="background:#${color.toString(16).padStart(6, '0')}"></i>${tier}단계 · ${name}`;
  }

  setMinimap(canvas: HTMLCanvasElement): void {
    this.minimapSlot.replaceChildren(canvas);
  }

  /** 상호작용할 대상이 가까이 있으면 공격 버튼이 상호작용 버튼으로 바뀐다 */
  setInteract(label: string | null): void {
    const on = label !== null;
    if (this.attackBtn.classList.contains('interact') === on && (!on || this.attackLabel.textContent === label)) return;
    this.attackBtn.classList.toggle('interact', on);
    this.attackIcon.innerHTML = on ? ICONS.portal : ICONS.sword;
    this.attackLabel.textContent = on ? label : '공격';
  }

  setDodgeCooldown(ratio: number): void {
    this.dodgeShade.style.transform = `scaleY(${ratio})`;
    this.dodgeBtn.classList.toggle('cooling', ratio > 0);
  }

  setBagCount(used: number, total: number): void {
    this.bagCount.textContent = `${used}/${total}`;
    this.bagCount.classList.toggle('full', used >= total);
  }

  toast(text: string): void {
    this.toastEl.textContent = text;
    this.toastEl.classList.add('show');
    window.clearTimeout(this.toastTimer);
    this.toastTimer = window.setTimeout(() => this.toastEl.classList.remove('show'), 1800);
  }

  /** 화면 좌표에 떠오르는 글자 (획득량 등) */
  floatText(x: number, y: number, text: string, color: string): void {
    const f = el('div', 'float-text');
    f.textContent = text;
    f.style.left = `${x}px`;
    f.style.top = `${y}px`;
    f.style.color = color;
    f.addEventListener('animationend', () => f.remove());
    this.floatLayer.appendChild(f);
  }
}
