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
  private interactBtn: HTMLButtonElement;
  private interactLabel: HTMLSpanElement;
  private bigMapEl: HTMLDivElement;
  private bubbleLayer: HTMLDivElement;
  private bubblePool: HTMLButtonElement[] = [];
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
    this.bubbleLayer = el('div', 'bubble-layer');
    this.root.append(this.labelLayer, this.bubbleLayer, this.floatLayer);

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
    // 미니맵을 누르면 큰 지도
    this.minimapSlot.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      input.press('map');
    });
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

    // 상호작용 버튼: 대화·채집·입장 등 (공격 버튼과 따로 둔다)
    this.interactBtn = this.button('act interact-btn hidden', ICONS.hand, 'interact');
    this.interactLabel = el('span', 'lbl');
    this.interactBtn.appendChild(this.interactLabel);

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
    // 궁극기 칸: 보스 보상 시스템과 함께 열린다 (지금은 잠김)
    const ult = el('button', 'act skill ult locked') as HTMLButtonElement;
    ult.append(el('span', 'skill-name', '궁극기'));
    ult.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      this.toast('궁극기는 보스를 쓰러뜨려야 얻을 수 있습니다 (준비 중)', 2200);
    });
    this.potionBtn = this.button('act potion', ICONS.potion, 'potion');
    this.potionCount = el('span', 'badge');
    this.potionBtn.appendChild(this.potionCount);
    actions.append(this.attackBtn, this.interactBtn, dodge, ...this.skillBtns, ult, this.potionBtn);
    this.root.appendChild(actions);

    this.bigMapEl = el('div', 'bigmap-wrap hidden');
    this.bigMapEl.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      input.press('map');
    });
    this.root.appendChild(this.bigMapEl);

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
    this.objectiveEl.textContent = text ? text.split('\n').map((l, i) => (i === 0 ? `▶ ${l}` : `· ${l}`)).join('\n') : '';
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

  /** 가까이에 상호작용할 대상이 있으면 상호작용 버튼이 나타난다 (공격 버튼은 그대로) */
  setInteract(label: string | null): void {
    if (label === this.lastInteract) return;
    this.lastInteract = label;
    // 상호작용할 때는 공격 버튼 자리에 상호작용 버튼이 나온다
    this.interactBtn.classList.toggle('hidden', label === null);
    this.attackBtn.classList.toggle('hidden', label !== null);
    if (label) {
      this.interactLabel.textContent = label;
      this.input.attackButtonHeld = false;
      this.attackBtn.classList.remove('down');
    }
    void this.attackIcon;
    void this.attackLabel;
  }

  showBigMap(canvas: HTMLCanvasElement | null): void {
    this.bigMapEl.classList.toggle('hidden', !canvas);
    this.bigMapEl.replaceChildren(...(canvas ? [canvas, Object.assign(el('div', 'bigmap-hint'), { textContent: 'M 또는 화면을 눌러 닫기' })] : []));
  }

  /** 생산 중인 기계 위의 아이콘. 누르면 정보 창 */
  setBubbles(list: { x: number; y: number; color: string; progress: number; onClick: () => void }[]): void {
    while (this.bubblePool.length < list.length) {
      const b = el('button', 'prod-bubble') as HTMLButtonElement;
      b.innerHTML = '<i></i><span class="bar"><span></span></span>';
      b.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        (b as unknown as { cb?: () => void }).cb?.();
      });
      this.bubbleLayer.appendChild(b);
      this.bubblePool.push(b);
    }
    this.bubblePool.forEach((b, i) => {
      const d = list[i];
      if (!d) {
        b.style.display = 'none';
        return;
      }
      b.style.display = '';
      (b as unknown as { cb?: () => void }).cb = d.onClick;
      b.style.transform = `translate(${d.x}px, ${d.y}px) translate(-50%, -100%)`;
      (b.firstElementChild as HTMLElement).style.background = d.color;
      (b.querySelector('.bar span') as HTMLElement).style.width = `${Math.round(d.progress * 100)}%`;
    });
  }

  setDodgeCooldown(ratio: number): void {
    this.dodgeShade.style.transform = `scaleY(${ratio})`;
  }

  setSkills(cooldowns: number[], ready: boolean[], learned: boolean[]): void {
    cooldowns.forEach((r, i) => {
      this.skillShades[i].style.transform = `scaleY(${Math.min(1, r)})`;
      this.skillBtns[i].classList.toggle('no-mp', !ready[i]);
      this.skillBtns[i].classList.toggle('locked', !learned[i]);
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
