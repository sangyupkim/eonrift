import type { Action, Input } from '../core/input';
import { ICONS, mico, richText } from './icons';
import { itemIconUrl, weaponIconUrl } from './itemIcons';
import type { ClassId } from '../data/classes';
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
    this.buffEl = el('div', 'buffs');
    status.appendChild(this.buffEl);
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
    this.bagBtn = this.button('icon-btn', mico('bag', ICONS.bag), 'bag');
    this.bagCount = el('span', 'badge');
    this.bagBtn.appendChild(this.bagCount);
    this.invBtn = this.button('icon-btn', mico('armor', ICONS.person), 'char');
    this.buildBtn = this.button('icon-btn build-btn', mico('hammer', ICONS.hammer), 'build');
    const recipeBtn = this.button('icon-btn recipe-btn', mico('book', ICONS.book), 'recipes');
    // 방을 정리한 뒤 언제든 워프 창을 여는 버튼 (자원을 캐고 바로 돌아갈 때)
    this.warpBtn = this.button('warp-btn hidden', `${mico('portal', ICONS.warp)}<span>워프</span>`, 'warp');
    this.root.appendChild(this.warpBtn);
    menuCol.append(this.button('icon-btn', ICONS.pause, 'pause'), this.bagBtn, this.invBtn, this.buildBtn, recipeBtn);
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
    this.interactBtn = this.button('act interact-btn hidden', mico('glove', ICONS.hand), 'interact');
    this.interactLabel = el('span', 'lbl');
    this.interactBtn.appendChild(this.interactLabel);

    const dodge = this.button('act dodge', mico('boot', ICONS.dodge), 'dodge');
    this.dodgeBtn = dodge;
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
    // 궁극기 칸: 수호자를 쓰러뜨려 얻는다. 잠겨 있으면 얻는 방법을 알려 준다
    const ult = el('button', 'act skill ult locked') as HTMLButtonElement;
    this.ultBtn = ult;
    this.ultIcon = document.createElement('img');
    this.ultIcon.className = 'skill-icon';
    this.ultIcon.alt = '';
    this.ultIcon.style.display = 'none';
    this.ultLabel = el('span', 'skill-name', '궁극기');
    this.ultShade = el('div', 'cooldown');
    this.ultSec = el('span', 'cd-sec');
    ult.append(this.ultIcon, this.ultLabel, this.ultShade, this.ultSec);
    ult.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      if (this.ultLockedMsg) this.toast(this.ultLockedMsg, 2600);
      else {
        input.press('ult');
        this.onPress();
      }
    });
    this.potionBtn = this.button('act potion', itemIconUrl('potion') ? `<img class="mico" src="${itemIconUrl('potion')}" alt="">` : ICONS.potion, 'potion');
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

    // 마을 상단: 보스 재등장·채집 맵 대기 시간 (접었다 펼 수 있음)
    this.timersEl = el('div', 'timers hidden');
    this.timersEl.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.timersOpen = !this.timersOpen;
      this.onTimersToggle?.(this.timersOpen);
      this.renderTimers();
    });
    this.root.appendChild(this.timersEl);

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

  private warpBtn!: HTMLButtonElement;
  setWarpButton(on: boolean): void {
    this.warpBtn.classList.toggle('hidden', !on);
  }

  setBuilding(on: boolean): void {
    this.root.classList.toggle('building', on);
  }

  /** 왼쪽 위 캐릭터 상반신 (장비가 바뀌면 다시 그린다). 이미지를 못 만들면 직업 글자 */
  setPortrait(url: string, short: string): void {
    if (!url) {
      this.portrait.textContent = short;
      return;
    }
    let img = this.portrait.querySelector('img');
    if (!img) {
      this.portrait.textContent = '';
      img = document.createElement('img');
      img.alt = '';
      const badge = el('span', 'lv-badge');
      this.portrait.append(img, badge);
    }
    if (img.dataset.src !== url) {
      img.dataset.src = url;
      img.src = url;
    }
  }

  setClass(short: string, color: string, skillNames: string[], cls?: ClassId): void {
    // 공격 버튼: 직업 무기 3D 아이콘
    const w = cls ? weaponIconUrl(cls) : '';
    if (w) this.attackIcon.innerHTML = `<img class="mico" src="${w}" alt="">`;
    if (!this.portrait.querySelector('img')) this.portrait.textContent = short;
    this.portrait.style.background = `linear-gradient(160deg, ${color}, #1c2240)`;
    skillNames.slice(0, this.skillLabels.length).forEach((n, i) => (this.skillLabels[i].textContent = n));
  }

  setBars(hp: number, maxHp: number, mp: number, maxMp: number, exp: number, expMax: number, level: number): void {
    const lb = this.portrait.querySelector('.lv-badge');
    if (lb && lb.textContent !== `Lv.${level}`) lb.textContent = `Lv.${level}`;
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
    const html = `<i style="background:#${color.toString(16).padStart(6, '0')}"></i>${richText(text)}`;
    if (this.locationEl.innerHTML !== html) this.locationEl.innerHTML = html;
  }

  private waveEl: HTMLDivElement | null = null;
  /** 웨이브 표시 (무한의 탑): 화면 위 가운데. null이면 숨김 */
  setWave(cur: number, total: number, cleared = false, hide = false): void {
    if (!this.waveEl) {
      this.waveEl = el('div', 'wave-bar hidden');
      this.root.appendChild(this.waveEl);
    }
    this.waveEl.classList.toggle('hidden', hide);
    this.root.classList.toggle('has-wave', !hide);
    if (hide) return;
    const dots = Array.from({ length: total }, (_, i) => `<em class="${i < cur - 1 || cleared ? 'done' : i === cur - 1 ? 'now' : ''}">${i + 1}</em>`).join('');
    const html = `<b>${cleared ? 'CLEAR' : `WAVE ${cur}`}</b><div class="wave-dots">${dots}</div>`;
    if (this.waveEl.innerHTML !== html) this.waveEl.innerHTML = html;
    this.waveEl.classList.toggle('clear', cleared);
  }

  private buffEl!: HTMLDivElement;
  /** 걸려 있는 버프 표시 */
  setBuffs(list: { text: string; bad?: boolean }[]): void {
    const html = list.map((t) => `<span class="${t.bad ? 'bad' : ''}">${t.text}</span>`).join('');
    if (this.buffEl.innerHTML !== html) this.buffEl.innerHTML = html;
  }

  setObjective(text: string): void {
    const t = text ? text.split('\n').map((l, i) => (i === 0 ? `▶ ${l}` : `· ${l}`)).join('\n') : '';
    if (this.objectiveEl.dataset.t !== t) {
      this.objectiveEl.dataset.t = t;
      this.objectiveEl.innerHTML = richText(t);
    }
    this.objectiveEl.classList.toggle('hidden', !text);
  }

  /** 레이드 보스 체력: 여러 줄. 지금 줄은 앞에, 다음 줄 색이 뒤에 깔린다 */
  setBoss(name: string | null, ratio = 1, bars = 1, shielded = false, hurry = false): void {
    this.bossEl.classList.toggle('hidden', !name);
    if (!name) return;
    const COLORS = ['#ff5a4a', '#ff9a3a', '#ffd23a', '#7aff9a', '#5ac8ff', '#a07aff', '#ff6ad0'];
    const total = Math.max(0, ratio) * bars;
    const left = Math.ceil(total - 1e-6);
    const cur = left > 0 ? total - (left - 1) : 0;
    if (this.bossName.dataset.t !== name) {
      this.bossName.dataset.t = name;
      this.bossName.innerHTML = richText(name);
    }
    this.bossFill.style.width = `${cur * 100}%`;
    this.bossFill.style.background = COLORS[(left - 1 + COLORS.length) % COLORS.length];
    const track = this.bossFill.parentElement!;
    track.style.background = left > 1 ? COLORS[(left - 2 + COLORS.length) % COLORS.length] + '66' : 'rgba(0,0,0,0.6)';
    track.dataset.bars = bars > 1 ? `×${left}` : '';
    this.bossEl.classList.toggle('shielded', shielded);
    this.bossEl.classList.toggle('hurry', hurry);
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
  setBubbles(list: { x: number; y: number; icon: string; progress: number; onClick: () => void }[]): void {
    while (this.bubblePool.length < list.length) {
      const b = el('button', 'prod-bubble') as HTMLButtonElement;
      b.innerHTML = '<img alt=""><span class="bar"><span></span></span>';
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
      const img = b.firstElementChild as HTMLImageElement;
      if (img.dataset.src !== d.icon) {
        img.dataset.src = d.icon;
        img.src = d.icon;
      }
      (b.querySelector('.bar span') as HTMLElement).style.width = `${Math.round(d.progress * 100)}%`;
    });
  }

  private dodgeKey = '';
  private dodgeBtn: HTMLButtonElement | null = null;
  /** 회피 버튼 모양: 직업마다 (구르기·블링크·후방 도약) */
  setDodgeIcon(url: string | null, label: string): void {
    const key = `${url}|${label}`;
    if (key === this.dodgeKey || !this.dodgeBtn) return;
    this.dodgeKey = key;
    this.dodgeBtn.querySelector('.dodge-art')?.remove();
    if (url) {
      const art = el('div', 'dodge-art', `<img src="${url}" alt=""><span class="lbl">${label}</span>`);
      this.dodgeBtn.prepend(art);
    }
    this.dodgeBtn.classList.toggle('custom', !!url);
  }

  setDodgeCooldown(ratio: number): void {
    this.dodgeShade.style.transform = `scaleY(${ratio})`;
  }

  private ultBtn!: HTMLButtonElement;
  private ultIcon!: HTMLImageElement;
  private ultLabel!: HTMLSpanElement;
  private ultShade!: HTMLDivElement;
  private ultSec!: HTMLSpanElement;
  private ultLockedMsg = '';
  private ultCdWas = false;

  /** 궁극기 칸. lockedMsg가 있으면 잠김 */
  setUlt(o: { name: string; icon: string; ratio: number; secs: number; ready: boolean; lockedMsg?: string }): void {
    this.ultLockedMsg = o.lockedMsg ?? '';
    const b = this.ultBtn;
    b.classList.toggle('locked', !!o.lockedMsg);
    const cooling = o.ratio > 0.001;
    b.classList.toggle('cooling', cooling);
    b.classList.toggle('no-mp', !o.ready);
    if (this.ultCdWas && !cooling) {
      b.classList.remove('ready-flash');
      void b.offsetWidth;
      b.classList.add('ready-flash');
    }
    this.ultCdWas = cooling;
    this.ultShade.style.transform = `scaleY(${Math.min(1, o.ratio)})`;
    const sec = cooling ? String(Math.ceil(o.secs)) : '';
    if (this.ultSec.textContent !== sec) this.ultSec.textContent = sec;
    if (this.ultLabel.textContent !== o.name) this.ultLabel.textContent = o.name;
    if (this.ultIcon.dataset.src !== o.icon) {
      this.ultIcon.dataset.src = o.icon;
      if (o.icon) this.ultIcon.src = o.icon;
      this.ultIcon.style.display = o.icon ? '' : 'none';
    }
  }

  /** 퀵슬롯 3칸. names[i]가 null이면 빈 칸 */
  private skillCdWas: boolean[] = [];
  private skillIcons: (HTMLImageElement | null)[] = [];
  private skillSecs: (HTMLSpanElement | null)[] = [];
  /**
   * 퀵슬롯 3칸. names[i]가 null이면 빈 칸.
   * 재사용 대기 중에는 빨간 그늘 + 남은 초, 다시 쓸 수 있게 되면 한 번 번쩍인다
   */
  setSkills(cooldowns: number[], ready: boolean[], names: (string | null)[], icons: string[] = [], secs: number[] = []): void {
    cooldowns.forEach((r, i) => {
      const btn = this.skillBtns[i];
      const cooling = r > 0.001;
      this.skillShades[i].style.transform = `scaleY(${Math.min(1, r)})`;
      btn.classList.toggle('cooling', cooling);
      if (this.skillCdWas[i] && !cooling) {
        btn.classList.remove('ready-flash');
        void btn.offsetWidth;
        btn.classList.add('ready-flash');
      }
      this.skillCdWas[i] = cooling;
      btn.classList.toggle('no-mp', !ready[i]);
      btn.classList.toggle('locked', names[i] === null);
      const label = names[i] ?? '비어 있음';
      if (this.skillLabels[i].textContent !== label) this.skillLabels[i].textContent = label;
      // 3D 아이콘
      let img = this.skillIcons[i];
      if (!img) {
        img = document.createElement('img');
        img.className = 'skill-icon';
        img.alt = '';
        btn.insertBefore(img, btn.firstChild);
        this.skillIcons[i] = img;
      }
      const url = icons[i] ?? '';
      if (img.dataset.src !== url) {
        img.dataset.src = url;
        if (url) img.src = url;
        img.style.display = url ? '' : 'none';
      }
      let sec = this.skillSecs[i];
      if (!sec) {
        sec = document.createElement('span');
        sec.className = 'cd-sec';
        btn.appendChild(sec);
        this.skillSecs[i] = sec;
      }
      const t = cooling && secs[i] ? String(Math.ceil(secs[i])) : '';
      if (sec.textContent !== t) sec.textContent = t;
    });
  }

  private potionShade: HTMLDivElement | null = null;
  setPotions(n: number, cooldown = 0): void {
    this.potionCount.textContent = String(n);
    this.potionBtn.classList.toggle('empty', n === 0);
    if (!this.potionShade) {
      this.potionShade = el('div', 'cooldown') as HTMLDivElement;
      this.potionBtn.appendChild(this.potionShade);
    }
    this.potionShade.style.transform = `scaleY(${Math.min(1, Math.max(0, cooldown))})`;
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
      if (l.dataset.t !== d.text) {
        l.dataset.t = d.text;
        l.innerHTML = richText(d.text);
      }
      l.classList.toggle('accent', !!d.accent);
      l.style.transform = `translate(${d.x}px, ${d.y}px) translate(-50%, -100%)`;
    });
  }

  private timersEl: HTMLDivElement;
  private timerChips: string[] | null = null;
  timersOpen = true;
  onTimersToggle: ((open: boolean) => void) | null = null;

  /** 대기 시간 칩 목록. null이면 숨긴다 */
  setTimers(chips: string[] | null): void {
    if (JSON.stringify(chips) === JSON.stringify(this.timerChips)) return;
    this.timerChips = chips;
    this.renderTimers();
  }

  private renderTimers(): void {
    const chips = this.timerChips;
    this.timersEl.classList.toggle('hidden', !chips);
    if (!chips) return;
    this.timersEl.classList.toggle('open', this.timersOpen);
    this.timersEl.innerHTML = `<span class="t-head">${richText(':hourglass:')} 타이머 ${this.timersOpen ? '▴' : '▾'}</span>${this.timersOpen ? chips.map((c) => `<span class="t-chip">${c}</span>`).join('') : ''}`;
  }

  toast(text: string, ms = 1800): void {
    this.toastEl.innerHTML = richText(text);
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
