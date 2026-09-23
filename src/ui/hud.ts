import type { Action, Input } from '../core/input';
import { ICONS } from './icons';
import { Joystick } from './joystick';

const el = <K extends keyof HTMLElementTagNameMap>(tag: K, className = '', html = '') => {
  const e = document.createElement(tag);
  if (className) e.className = className;
  if (html) e.innerHTML = html;
  return e;
};

export type HudMode = 'village' | 'dungeon' | 'home';

/** 플레이 화면 HUD */
export class Hud {
  readonly root: HTMLDivElement;
  readonly joystick: Joystick;
  private portrait: HTMLDivElement;
  private hpFill: HTMLDivElement;
  private hpText: HTMLSpanElement;
  private mpFill: HTMLDivElement;
  private mpText: HTMLSpanElement;
  private expFill: HTMLDivElement;
  private lvText: HTMLSpanElement;
  private goldEl: HTMLDivElement;
  private locationEl: HTMLDivElement;
  private objectiveEl: HTMLDivElement;
  private bossEl: HTMLDivElement;
  private bossFill: HTMLDivElement;
  private bossName: HTMLDivElement;
  private minimapSlot: HTMLDivElement;
  private attackBtn: HTMLButtonElement;
  private attackIcon: HTMLSpanElement;
  private attackLabel: HTMLSpanElement;
  private dodgeShade: HTMLDivElement;
  private skillBtns: HTMLButtonElement[] = [];
  private skillShades: HTMLDivElement[] = [];
  private skillLabels: HTMLSpanElement[] = [];
  private potionBtn: HTMLButtonElement;
  private potionCount: HTMLSpanElement;
  private bagBtn: HTMLButtonElement;
  private bagCount: HTMLSpanElement;
  private invBtn: HTMLButtonElement;
  private buildBtn: HTMLButtonElement;
  private toastEl: HTMLDivElement;
  private floatLayer: HTMLDivElement;
  private labelLayer: HTMLDivElement;
  private labelPool: HTMLDivElement[] = [];
  private toastTimer = 0;
  private lastInteract: string | null = '';
  private lastBars = '';

  constructor(
    parent: HTMLElement,
    private input: Input,
    private onPress: () => void,
  ) {
    this.root = el('div', 'hud');
    parent.appendChild(this.root);

    const joyZone = el('div', 'joy-zone');
    this.root.appendChild(joyZone);
    this.joystick = new Joystick(joyZone, input);

    this.labelLayer = el('div', 'label-layer');
    this.floatLayer = el('div', 'float-layer');
    this.root.append(this.labelLayer, this.floatLayer);

    // 좌상단 상태
    const status = el('div', 'status');
    this.portrait = el('div', 'portrait', '검');
    const bars = el('div', 'bars');
    const bar = (cls: string) => {
      const b = el('div', `bar ${cls}`);
      const fill = el('div', 'fill');
      const txt = el('span');
      b.append(fill, txt);
      bars.appendChild(b);
      return [fill, txt] as const;
    };
    [this.hpFill, this.hpText] = bar('hp');
    [this.mpFill, this.mpText] = bar('mp');
    const exp = el('div', 'bar exp');
    this.expFill = el('div', 'fill');
    this.lvText = el('span');
    exp.append(this.expFill, this.lvText);
    bars.appendChild(exp);
    status.append(this.portrait, bars);
    this.locationEl = el('div', 'tier-label');
    this.goldEl = el('div', 'gold-label');
    const infoRow = el('div', 'info-row');
    infoRow.append(this.locationEl, this.goldEl);
    status.appendChild(infoRow);
    this.objectiveEl = el('div', 'objective');
    status.appendChild(this.objectiveEl);
    this.root.appendChild(status);

    // 보스 체력바
    this.bossEl = el('div', 'boss-bar hidden');
    this.bossName = el('div', 'boss-name');
    const bb = el('div', 'boss-track');
    this.bossFill = el('div', 'boss-fill');
    bb.appendChild(this.bossFill);
    this.bossEl.append(this.bossName, bb);
    this.root.appendChild(this.bossEl);

    // 우상단
    const topRight = el('div', 'top-right');
    this.minimapSlot = el('div', 'minimap-slot');
    const menuCol = el('div', 'menu-col');
    this.bagBtn = this.button('icon-btn', ICONS.bag, 'bag');
    this.bagCount = el('span', 'badge');
    this.bagBtn.appendChild(this.bagCount);
    this.invBtn = this.button('icon-btn', ICONS.person, 'bag');
    this.buildBtn = this.button('icon-btn build-btn', ICONS.hammer, 'build');
    menuCol.append(this.button('icon-btn', ICONS.pause, 'pause'), this.bagBtn, this.invBtn, this.buildBtn);
    topRight.append(this.minimapSlot, menuCol);
    this.root.appendChild(topRight);

    // 우하단 행동 버튼
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
      this.onPress();
    });
    const release = () => {
      input.attackButtonHeld = false;
      this.attackBtn.classList.remove('down');
    };
    this.attackBtn.addEventListener('pointerup', release);
    this.attackBtn.addEventListener('pointercancel', release);

    const dodge = this.button('act dodge', ICONS.dodge, 'dodge');
    this.dodgeShade = el('div', 'cooldown');
    dodge.appendChild(this.dodgeShade);

    for (let i = 0; i < 3; i++) {
      const b = this.button(`act skill s${i + 1}`, '', `skill${i + 1}` as Action);
      const label = el('span', 'skill-name');
      const shade = el('div', 'cooldown');
      b.append(label, shade);
      this.skillBtns.push(b);
      this.skillLabels.push(label);
      this.skillShades.push(shade);
    }
    this.potionBtn = this.button('act potion', ICONS.potion, 'potion');
    this.potionCount = el('span', 'badge');
    this.potionBtn.appendChild(this.potionCount);
    actions.append(this.attackBtn, dodge, ...this.skillBtns, this.potionBtn);
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
      this.onPress();
    });
    const up = () => b.classList.remove('down');
    b.addEventListener('pointerup', up);
    b.addEventListener('pointerleave', up);
    b.addEventListener('pointercancel', up);
    return b;
  }

  setVisible(v: boolean): void {
    this.root.classList.toggle('hidden', !v);
    if (!v) {
      this.joystick.reset();
      this.input.attackButtonHeld = false;
    }
  }

  /** 장소에 따라 보이는 버튼이 다르다 */
  setMode(mode: HudMode): void {
    this.root.dataset.mode = mode;
  }

  setBuilding(on: boolean): void {
    this.root.classList.toggle('building', on);
  }

  setClass(short: string, color: string, skillNames: string[]): void {
    this.portrait.textContent = short;
    this.portrait.style.background = `linear-gradient(160deg, ${color}, #1c2240)`;
    skillNames.forEach((n, i) => (this.skillLabels[i].textContent = n));
  }

  setBars(hp: number, maxHp: number, mp: number, maxMp: number, exp: number, expMax: number, level: number): void {
    const key = `${Math.ceil(hp)}|${maxHp}|${Math.floor(mp)}|${maxMp}|${exp}|${expMax}|${level}`;
    if (key === this.lastBars) return;
    this.lastBars = key;
    this.hpFill.style.width = `${(hp / maxHp) * 100}%`;
    this.hpText.textContent = `${Math.ceil(hp)} / ${maxHp}`;
    this.mpFill.style.width = `${(mp / maxMp) * 100}%`;
    this.mpText.textContent = `${Math.floor(mp)} / ${maxMp}`;
    this.expFill.style.width = `${Math.min(100, (exp / expMax) * 100)}%`;
    this.lvText.textContent = `Lv.${level}`;
    this.hpFill.parentElement!.classList.toggle('low', hp / maxHp < 0.3);
  }

  setGold(n: number): void {
    this.goldEl.textContent = `${n.toLocaleString()} G`;
  }

  setLocation(text: string, color: number): void {
    this.locationEl.innerHTML = `<i style="background:#${color.toString(16).padStart(6, '0')}"></i>${text}`;
  }

  setObjective(text: string): void {
    this.objectiveEl.textContent = text ? `▶ ${text}` : '';
    this.objectiveEl.classList.toggle('hidden', !text);
  }

  setBoss(name: string | null, ratio = 1): void {
    this.bossEl.classList.toggle('hidden', !name);
    if (name) {
      this.bossName.textContent = name;
      this.bossFill.style.width = `${Math.max(0, ratio) * 100}%`;
    }
  }

  setMinimap(canvas: HTMLCanvasElement | null): void {
    this.minimapSlot.replaceChildren(...(canvas ? [canvas] : []));
  }

  setInteract(label: string | null): void {
    if (label === this.lastInteract) return;
    this.lastInteract = label;
    const on = label !== null;
    this.attackBtn.classList.toggle('interact', on);
    this.attackIcon.innerHTML = on ? ICONS.portal : ICONS.sword;
    this.attackLabel.textContent = on ? label : '공격';
  }

  setDodgeCooldown(ratio: number): void {
    this.dodgeShade.style.transform = `scaleY(${ratio})`;
  }

  setSkills(cooldowns: number[], ready: boolean[]): void {
    cooldowns.forEach((r, i) => {
      this.skillShades[i].style.transform = `scaleY(${r})`;
      this.skillBtns[i].classList.toggle('no-mp', !ready[i]);
    });
  }

  setPotions(n: number): void {
    this.potionCount.textContent = String(n);
    this.potionBtn.classList.toggle('empty', n === 0);
  }

  setBagCount(used: number, total: number): void {
    this.bagCount.textContent = `${used}/${total}`;
    this.bagCount.classList.toggle('full', used >= total);
  }

  /** 머리 위 이름표 */
  setLabels(labels: { text: string; x: number; y: number; accent?: boolean }[]): void {
    while (this.labelPool.length < labels.length) {
      const l = el('div', 'name-label');
      this.labelLayer.appendChild(l);
      this.labelPool.push(l);
    }
    this.labelPool.forEach((l, i) => {
      const d = labels[i];
      if (!d) {
        l.style.display = 'none';
        return;
      }
      l.style.display = '';
      if (l.textContent !== d.text) l.textContent = d.text;
      l.classList.toggle('accent', !!d.accent);
      l.style.transform = `translate(${d.x}px, ${d.y}px) translate(-50%, -100%)`;
    });
  }

  toast(text: string, ms = 1800): void {
    this.toastEl.textContent = text;
    this.toastEl.classList.add('show');
    window.clearTimeout(this.toastTimer);
    this.toastTimer = window.setTimeout(() => this.toastEl.classList.remove('show'), ms);
  }

  floatText(x: number, y: number, text: string, color: string, kind: 'normal' | 'crit' | 'hurt' | 'small' = 'normal'): void {
    if (this.floatLayer.childElementCount > 40) this.floatLayer.firstElementChild?.remove();
    const f = el('div', `float-text ${kind}`);
    f.textContent = text;
    f.style.left = `${x + (Math.random() - 0.5) * 20}px`;
    f.style.top = `${y}px`;
    f.style.color = color;
    f.addEventListener('animationend', () => f.remove());
    this.floatLayer.appendChild(f);
  }
}
