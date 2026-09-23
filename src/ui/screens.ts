import { CLASSES, CLASS_ORDER, expToNext, type ClassId } from '../data/classes';
import { enhanceCost, equipName, equipStats, equipValue, GRADES, type Equip } from '../data/equipment';
import { BUILDINGS, FACTORY_SIZES, RECIPES } from '../data/factory';
import { ITEMS, ITEM_LIST } from '../data/items';
import { THEMES } from '../data/themes';
import { MACHINE_TYPES, recipesFor, type BuildingState, type Factory } from '../factory/sim';
import type { Bag } from '../game/Bag';
import type { Progress } from '../game/Progress';
import { ICONS } from './icons';

export const hex = (c: number) => `#${c.toString(16).padStart(6, '0')}`;
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

export interface ResultInfo {
  title: string;
  items: Map<string, number>;
  equips: Equip[];
  lost?: Map<string, number>;
  lostEquips?: number;
  seconds: number;
  explored: number;
  gold: number;
  exp: number;
  note?: string;
}

const itemGem = (id: string) => `<span class="gem" style="--c:${hex(ITEMS[id]?.color ?? 0xffffff)}"></span>`;
const equipGem = (e: Equip) => `<span class="gem eq" style="--c:${hex(GRADES[e.grade].color)}"></span>`;

function equipLine(e: Equip): string {
  const s = equipStats(e);
  const parts = [];
  if (s.atk) parts.push(`공격 ${s.atk}`);
  if (s.def) parts.push(`방어 ${s.def}`);
  if (s.hp) parts.push(`HP ${s.hp}`);
  if (s.crit) parts.push(`치명 ${s.crit}%`);
  return parts.join(' · ');
}

function equipTitle(e: Equip): string {
  return `<b style="color:${hex(GRADES[e.grade].color)}">[${GRADES[e.grade].name}] ${esc(equipName(e))}</b>`;
}

/** 모든 메뉴 화면. 한 번에 하나만 열린다 */
export class Screens {
  private layer: HTMLDivElement;
  private current: HTMLElement | null = null;
  /** 화면이 닫힐 때 부르는 함수 (다시 그리기용 등) */
  private onCloseCb: (() => void) | null = null;

  constructor(
    parent: HTMLElement,
    private click: () => void,
  ) {
    this.layer = document.createElement('div');
    this.layer.className = 'screens';
    parent.appendChild(this.layer);
  }

  get isOpen(): boolean {
    return this.current !== null;
  }

  close(): void {
    this.current?.remove();
    this.current = null;
    const cb = this.onCloseCb;
    this.onCloseCb = null;
    cb?.();
  }

  private open(className: string, html: string, onClose?: () => void): HTMLElement {
    this.current?.remove();
    this.onCloseCb = null;
    const s = document.createElement('div');
    s.className = `screen ${className}`;
    s.innerHTML = html;
    this.layer.appendChild(s);
    this.current = s;
    if (onClose) {
      this.onCloseCb = onClose;
      s.querySelector('.close')?.addEventListener('click', () => this.close());
      s.addEventListener('pointerdown', (e) => {
        if (e.target === s) this.close();
      });
    }
    s.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).closest('button')) this.click();
    });
    return s;
  }

  private on(s: HTMLElement, selector: string, f: (el: HTMLElement) => void): void {
    s.querySelectorAll<HTMLElement>(selector).forEach((el) => el.addEventListener('click', () => f(el)));
  }

  // ---------------- 타이틀 ----------------
  title(hasSave: boolean, onNew: () => void, onContinue: () => void): void {
    const s = this.open(
      'title',
      `<div class="title-box">
         <div class="title-sub">차원틈새에 떨어진 자의 이야기</div>
         <h1>영겁의 틈새</h1>
         <div class="title-menu">
           ${hasSave ? '<button class="primary" data-a="continue">이어하기</button>' : ''}
           <button class="${hasSave ? '' : 'primary'}" data-a="new">새로 시작</button>
         </div>
       </div>
       <div class="version">v1.0 · 모바일 가로 화면 권장</div>`,
    );
    this.on(s, '[data-a="continue"]', onContinue);
    this.on(s, '[data-a="new"]', () => {
      if (hasSave && !confirm('저장된 진행을 지우고 새로 시작할까요?')) return;
      onNew();
    });
  }

  // ---------------- 차원문 선택 ----------------
  tierSelect(p: Progress, onPick: (tier: number) => void, onClose: () => void): void {
    const cards = THEMES.map((t) => {
      const locked = t.tier > p.data.maxTier;
      const cleared = p.data.dimStones.includes(t.tier);
      return `<button class="tier-card ${locked ? 'locked' : ''}" data-tier="${t.tier}" style="--c:${hex(t.portalColor)}" ${locked ? 'disabled' : ''}>
          <span class="gate"></span>
          <b>${t.tier}단계 ${cleared ? '<i class="stone">◆</i>' : ''}</b>
          <span class="name">${locked ? '봉인됨' : t.name}</span>
        </button>`;
    }).join('');
    const s = this.open(
      'select',
      `<div class="panel wide">
         <button class="close">${ICONS.close}</button>
         <h2>차원문 광장</h2>
         <p class="hint">들어갈 때마다 내부 모양이 바뀝니다. 끝의 수호자를 쓰러뜨리면 다음 문이 열립니다. ◆ = 차원석 획득${p.data.ngPlus ? ` · <em>${p.data.ngPlus}회차</em>` : ''}</p>
         <div class="tier-grid">${cards}</div>
       </div>`,
      onClose,
    );
    this.on(s, '.tier-card:not(.locked)', (b) => onPick(Number(b.dataset.tier)));
  }

  // ---------------- 일시정지 ----------------
  pause(opts: {
    inDungeon: boolean;
    seed?: number;
    returnStones: number;
    shadows: boolean;
    sound: boolean;
    onReturnStone: () => void;
    onGiveUp: () => void;
    onToggleShadows: (on: boolean) => void;
    onToggleSound: (on: boolean) => void;
    onTitle: () => void;
    onClose: () => void;
  }): void {
    const s = this.open(
      'pause',
      `<div class="panel">
         <button class="close">${ICONS.close}</button>
         <h2>메뉴</h2>
         <div class="menu">
           <button data-a="resume" class="primary">계속하기</button>
           ${opts.inDungeon ? `<button data-a="stone" ${opts.returnStones ? '' : 'disabled'}>귀환석 사용 (보유 ${opts.returnStones})</button>` : ''}
           ${opts.inDungeon ? '<button data-a="giveup" class="danger">포기하고 쓰러지기</button>' : ''}
           <label class="toggle"><input type="checkbox" data-t="shadow" ${opts.shadows ? 'checked' : ''}/> 그림자</label>
           <label class="toggle"><input type="checkbox" data-t="sound" ${opts.sound ? 'checked' : ''}/> 소리</label>
           <button data-a="title">타이틀로 (자동 저장)</button>
         </div>
         ${opts.seed !== undefined ? `<div class="seed">던전 시드 ${opts.seed}</div>` : ''}
         <div class="keys">PC 조작: WASD 이동 · J/클릭 공격 · Space 구르기 · 1·2·3 스킬 · Q 물약 · E 상호작용 · I 가방 · Esc 메뉴</div>
       </div>`,
      opts.onClose,
    );
    this.on(s, '[data-a="resume"]', () => this.close());
    this.on(s, '[data-a="stone"]', opts.onReturnStone);
    this.on(s, '[data-a="giveup"]', () => {
      if (confirm('포기하면 일반 가방의 아이템을 모두 잃습니다. 계속할까요?')) opts.onGiveUp();
    });
    this.on(s, '[data-a="title"]', opts.onTitle);
    s.querySelector<HTMLInputElement>('[data-t="shadow"]')!.addEventListener('change', (e) => opts.onToggleShadows((e.target as HTMLInputElement).checked));
    s.querySelector<HTMLInputElement>('[data-t="sound"]')!.addEventListener('change', (e) => opts.onToggleSound((e.target as HTMLInputElement).checked));
  }

  // ---------------- 던전 가방 (일반 가방 ↔ 차원가방) ----------------
  bag(bag: Bag, dimBag: Bag, onMove: (from: 'bag' | 'dim', index: number) => void, onClose: () => void): void {
    const render = () => {
      const cell = (s: Bag['slots'][number], from: string, i: number) => {
        if (!s) return '<div class="slot"></div>';
        if (s.equip) return `<div class="slot filled" data-from="${from}" data-i="${i}" style="--c:${hex(GRADES[s.equip.grade].color)}"><span class="gem eq"></span><span class="cnt">+${s.equip.plus}</span></div>`;
        return `<div class="slot filled" data-from="${from}" data-i="${i}" style="--c:${hex(ITEMS[s.itemId].color)}"><span class="gem"></span><span class="cnt">${s.count}</span></div>`;
      };
      const s = this.open(
        'bag',
        `<div class="panel wide">
           <button class="close">${ICONS.close}</button>
           <h2>가방 <small>${bag.used}/${bag.slots.length}</small></h2>
           <div class="bag-grid">${bag.slots.map((x, i) => cell(x, 'bag', i)).join('')}</div>
           <h3>차원가방 <small>쓰러져도 지켜지는 가방 · 칸을 눌러 옮기기</small></h3>
           <div class="bag-grid dim-row">${dimBag.slots.map((x, i) => cell(x, 'dim', i)).join('')}</div>
           <div class="item-info">아이템을 누르면 다른 가방으로 옮겨집니다.</div>
         </div>`,
        onClose,
      );
      const info = s.querySelector('.item-info')!;
      this.on(s, '.slot.filled', (e) => {
        const from = e.dataset.from as 'bag' | 'dim';
        const i = Number(e.dataset.i);
        const src = from === 'bag' ? bag : dimBag;
        const slot = src.slots[i]!;
        const name = slot.equip ? equipName(slot.equip) : ITEMS[slot.itemId].name;
        onMove(from, i);
        render();
        this.current!.querySelector('.item-info')!.textContent = `${name} → ${from === 'bag' ? '차원가방' : '일반 가방'}`;
      });
      void info;
    };
    render();
  }

  // ---------------- 결과 / 쓰러짐 ----------------
  result(info: ResultInfo, onContinue: () => void): void {
    const rows = [...info.items].map(([id, n]) => `<li>${itemGem(id)}${ITEMS[id].name}<b>× ${n}</b></li>`).join('');
    const eqRows = info.equips.map((e) => `<li>${equipGem(e)}<span>${equipTitle(e)}</span><b>장비</b></li>`).join('');
    const lostRows = info.lost ? [...info.lost].map(([id, n]) => `<li class="lost">${itemGem(id)}${ITEMS[id].name}<b>− ${n}</b></li>`).join('') : '';
    const m = Math.floor(info.seconds / 60);
    const sec = Math.floor(info.seconds % 60);
    const s = this.open(
      `result ${info.lost ? 'dead' : ''}`,
      `<div class="panel">
         <h2>${info.title}</h2>
         ${info.note ? `<p class="hint">${info.note}</p>` : ''}
         <div class="stats"><span>시간 <b>${m}분 ${sec}초</b></span><span>탐험률 <b>${Math.round(info.explored * 100)}%</b></span><span>골드 <b>+${info.gold}</b></span><span>경험치 <b>+${info.exp}</b></span></div>
         <ul class="loot">${rows}${eqRows}${lostRows}${!rows && !eqRows && !lostRows ? '<li class="empty">가져온 전리품이 없습니다</li>' : ''}</ul>
         ${info.lostEquips ? `<p class="hint">잃어버린 장비 ${info.lostEquips}개</p>` : ''}
         <div class="menu"><button class="primary" data-ok>마을로</button></div>
       </div>`,
      onContinue,
    );
    this.on(s, '[data-ok]', () => this.close());
  }

  // ---------------- 장비와 창고 ----------------
  inventory(p: Progress, tab: 'equip' | 'storage' | 'stats', onChange: () => void, onClose: () => void): void {
    const cls = CLASSES[p.data.currentClass];
    const st = p.stats();
    const c = p.cls;
    const slotNames = { weapon: cls.weaponNoun, armor: '갑옷', accessory: '반지' } as const;
    let body = '';
    if (tab === 'equip') {
      const equipped = (['weapon', 'armor', 'accessory'] as const)
        .map((slot) => {
          const e = c.equipment[slot];
          return `<div class="eq-slot">${e ? `${equipGem(e)}<div>${equipTitle(e)}<small>${equipLine(e)}</small></div><button data-un="${slot}">해제</button>` : `<span class="gem empty"></span><div><b class="dim">${slotNames[slot]} 없음</b></div>`}</div>`;
        })
        .join('');
      const list = p.data.equips
        .slice()
        .sort((a, b) => b.tier * 10 + b.grade - (a.tier * 10 + a.grade))
        .map((e) => {
          const ok = p.canEquip(e);
          return `<li>${equipGem(e)}<div>${equipTitle(e)}<small>${equipLine(e)}${e.cls && e.cls !== p.data.currentClass ? ` · ${CLASSES[e.cls].name} 전용` : ''}</small></div><button data-eq="${e.uid}" ${ok ? '' : 'disabled'}>장착</button></li>`;
        })
        .join('');
      body = `<div class="eq-slots">${equipped}</div><h3>보관 중인 장비</h3><ul class="list">${list || '<li class="empty">장비가 없습니다</li>'}</ul>`;
    } else if (tab === 'storage') {
      const items = ITEM_LIST.filter((i) => p.count(i.id) > 0)
        .map((i) => `<li>${itemGem(i.id)}<div><b>${i.name}</b><small>${i.description}</small></div><b class="num">${p.count(i.id)}</b></li>`)
        .join('');
      body = `<ul class="list">${items || '<li class="empty">창고가 비어 있습니다</li>'}</ul>`;
    } else {
      const next = expToNext(c.level);
      body = `<div class="stat-grid">
          <span>직업</span><b>${cls.name} Lv.${c.level}</b>
          <span>경험치</span><b>${c.exp} / ${next}</b>
          <span>HP</span><b>${st.maxHp}</b>
          <span>MP</span><b>${st.maxMp}</b>
          <span>공격력</span><b>${st.atk}</b>
          <span>방어력</span><b>${st.def}</b>
          <span>치명타</span><b>${st.crit}%</b>
          <span>골드</span><b>${p.data.gold}</b>
          <span>차원석</span><b>${p.data.dimStones.length} / 7</b>
          <span>회차</span><b>${p.data.ngPlus + 1}</b>
        </div>
        <h3>스킬</h3><ul class="list">${cls.skills.map((sk, i) => `<li><span class="key">${i + 1}</span><div><b>${sk.name}</b><small>${sk.description} · MP ${sk.mp} · ${sk.cooldown}초</small></div></li>`).join('')}</ul>`;
    }
    const s = this.open(
      'inventory',
      `<div class="panel wide tall">
         <button class="close">${ICONS.close}</button>
         <div class="tabs">
           <button data-tab="equip" class="${tab === 'equip' ? 'on' : ''}">장비</button>
           <button data-tab="storage" class="${tab === 'storage' ? 'on' : ''}">창고</button>
           <button data-tab="stats" class="${tab === 'stats' ? 'on' : ''}">능력치</button>
         </div>
         ${body}
       </div>`,
      onClose,
    );
    const again = (t = tab) => this.inventory(p, t, onChange, onClose);
    this.on(s, '[data-tab]', (b) => again(b.dataset.tab as typeof tab));
    this.on(s, '[data-eq]', (b) => {
      const e = p.data.equips.find((x) => x.uid === b.dataset.eq);
      if (e) p.equip(e);
      onChange();
      again();
    });
    this.on(s, '[data-un]', (b) => {
      p.unequip(b.dataset.un as 'weapon');
      onChange();
      again();
    });
  }

  // ---------------- 상점 ----------------
  shop(p: Progress, onChange: () => void, onClose: () => void, tab: 'buy' | 'sell' = 'buy', toast?: string): void {
    const goods: { id: string; label: string; price: number; make: () => boolean }[] = [
      { id: 'potion', label: '치유 물약', price: 30, make: () => (p.add('potion', 1), true) },
      { id: 'return_stone', label: '귀환석', price: 80, make: () => (p.add('return_stone', 1), true) },
    ];
    const t = Math.max(1, Math.min(3, p.data.maxTier - 1));
    for (const slot of ['weapon', 'armor', 'accessory'] as const) {
      const e: Equip = { uid: `shop-${slot}`, slot, cls: slot === 'weapon' ? p.data.currentClass : undefined, tier: t, grade: 0, plus: 0 };
      goods.push({
        id: `eq-${slot}`,
        label: `${equipName(e)} (${equipLine(e)})`,
        price: equipValue(e) * 4,
        make: () => {
          p.data.equips.push({ ...e, uid: `${Date.now()}${slot}${Math.random()}` });
          return true;
        },
      });
    }
    let body = '';
    if (tab === 'buy') {
      body = `<ul class="list">${goods
        .map((g, i) => `<li>${g.id.startsWith('eq') ? '<span class="gem eq" style="--c:#d8dce6"></span>' : itemGem(g.id)}<div><b>${esc(g.label)}</b><small>${g.id.startsWith('eq') ? '기본 장비' : ITEMS[g.id].description}</small></div><button data-buy="${i}" ${p.data.gold >= g.price ? '' : 'disabled'}>${g.price} G</button></li>`)
        .join('')}</ul>`;
    } else {
      const items = ITEM_LIST.filter((i) => p.count(i.id) > 0 && i.value > 0)
        .map((i) => `<li>${itemGem(i.id)}<div><b>${i.name} <span class="dim">× ${p.count(i.id)}</span></b><small>개당 ${i.value} G</small></div><button data-sell="${i.id}">1개</button><button data-sellall="${i.id}">전부</button></li>`)
        .join('');
      const eqs = p.data.equips.map((e) => `<li>${equipGem(e)}<div>${equipTitle(e)}<small>${equipLine(e)}</small></div><button data-selleq="${e.uid}">${equipValue(e)} G</button></li>`).join('');
      body = `<ul class="list">${items}${eqs || ''}${!items && !eqs ? '<li class="empty">팔 물건이 없습니다</li>' : ''}</ul>`;
    }
    const s = this.open(
      'shop',
      `<div class="panel wide tall">
         <button class="close">${ICONS.close}</button>
         <h2>상인 무트의 가게 <small class="gold">${p.data.gold} G</small></h2>
         <div class="tabs"><button data-tab="buy" class="${tab === 'buy' ? 'on' : ''}">사기</button><button data-tab="sell" class="${tab === 'sell' ? 'on' : ''}">팔기</button></div>
         ${toast ? `<div class="notice">${toast}</div>` : ''}
         ${body}
       </div>`,
      onClose,
    );
    const again = (tb = tab, msg?: string) => {
      onChange();
      this.shop(p, onChange, onClose, tb, msg);
    };
    this.on(s, '[data-tab]', (b) => again(b.dataset.tab as typeof tab));
    this.on(s, '[data-buy]', (b) => {
      const g = goods[Number(b.dataset.buy)];
      if (p.data.gold < g.price) return;
      p.data.gold -= g.price;
      g.make();
      again(tab, `${g.label.split(' (')[0]} 구입`);
    });
    this.on(s, '[data-sell]', (b) => {
      const id = b.dataset.sell!;
      if (p.take(id, 1)) p.data.gold += ITEMS[id].value;
      again(tab, `${ITEMS[id].name} 판매 +${ITEMS[id].value} G`);
    });
    this.on(s, '[data-sellall]', (b) => {
      const id = b.dataset.sellall!;
      const n = p.count(id);
      if (n > 0 && p.take(id, n)) p.data.gold += ITEMS[id].value * n;
      again(tab, `${ITEMS[id].name} ${n}개 판매 +${ITEMS[id].value * n} G`);
    });
    this.on(s, '[data-selleq]', (b) => {
      const e = p.data.equips.find((x) => x.uid === b.dataset.selleq);
      if (!e) return;
      p.data.equips = p.data.equips.filter((x) => x !== e);
      p.data.gold += equipValue(e);
      again(tab, `${equipName(e)} 판매 +${equipValue(e)} G`);
    });
  }

  // ---------------- 대장간 (강화) ----------------
  forge(p: Progress, onChange: () => void, onClose: () => void, selected?: string, message?: string): void {
    const c = p.cls;
    const all: Equip[] = [...(Object.values(c.equipment).filter(Boolean) as Equip[]), ...p.data.equips];
    const sel = all.find((e) => e.uid === selected) ?? all[0];
    const list = all
      .map((e) => `<li class="${e === sel ? 'sel' : ''}" data-pick="${e.uid}">${equipGem(e)}<div>${equipTitle(e)}<small>${equipLine(e)}${Object.values(c.equipment).includes(e) ? ' · 착용 중' : ''}</small></div></li>`)
      .join('');
    let detail = '<p class="hint">강화할 장비가 없습니다.</p>';
    if (sel) {
      const cost = enhanceCost(sel);
      if (!cost) detail = `<p>${equipTitle(sel)}</p><p class="hint">이미 최대 강화(+10)입니다.</p>`;
      else {
        const next = { ...sel, plus: sel.plus + 1 };
        const have = p.count(cost.stone);
        const ok = have >= cost.count && p.data.gold >= cost.gold;
        detail = `<p>${equipTitle(sel)} → <b>+${next.plus}</b></p>
          <p class="hint">${equipLine(sel)} → ${equipLine(next)}</p>
          <p>${itemGem(cost.stone)} ${ITEMS[cost.stone].name} ${cost.count}개 <span class="dim">(보유 ${have})</span> · ${cost.gold} G · 성공 확률 <b>${Math.round(cost.rate * 100)}%</b></p>
          <p class="hint">실패해도 단계가 내려가지 않지만 재료는 사라집니다.</p>
          <div class="menu"><button class="primary" data-enh ${ok ? '' : 'disabled'}>강화하기</button></div>`;
      }
    }
    const s = this.open(
      'forge',
      `<div class="panel wide tall">
         <button class="close">${ICONS.close}</button>
         <h2>대장장이 고른의 대장간 <small class="gold">${p.data.gold} G</small></h2>
         ${message ? `<div class="notice">${message}</div>` : ''}
         <div class="split"><ul class="list pick">${list || '<li class="empty">장비 없음</li>'}</ul><div class="detail">${detail}</div></div>
       </div>`,
      onClose,
    );
    this.on(s, '[data-pick]', (el) => this.forge(p, onChange, onClose, el.dataset.pick));
    this.on(s, '[data-enh]', () => {
      if (!sel) return;
      const cost = enhanceCost(sel)!;
      if (!p.take(cost.stone, cost.count) || p.data.gold < cost.gold) return;
      p.data.gold -= cost.gold;
      const success = Math.random() < cost.rate;
      if (success) sel.plus++;
      onChange();
      this.forge(p, onChange, onClose, sel.uid, success ? `<b class="ok">강화 성공! +${sel.plus}</b>` : '<b class="bad">강화 실패…</b>');
    });
  }

  // ---------------- 직업의 전당 ----------------
  classHall(p: Progress, onPick: (id: ClassId) => void, onClose: () => void): void {
    const cards = CLASS_ORDER.map((id) => {
      const c = CLASSES[id];
      const unlocked = p.data.unlockedClasses.includes(id);
      const lv = p.data.classes[id].level;
      return `<button class="class-card ${unlocked ? '' : 'locked'} ${p.data.currentClass === id ? 'on' : ''}" data-cls="${id}" ${unlocked ? '' : 'disabled'} style="--c:${hex(c.look.tunic)}">
          <span class="badge-cls">${c.short}</span>
          <b>${c.name}</b>
          <small>${unlocked ? `Lv.${lv} · ${c.basic}` : '스토리를 진행하면 해금'}</small>
        </button>`;
    }).join('');
    const s = this.open(
      'hall',
      `<div class="panel wide">
         <button class="close">${ICONS.close}</button>
         <h2>직업의 전당</h2>
         <p class="hint">레벨과 장비는 직업마다 따로, 차원집과 창고는 모두 함께 씁니다.</p>
         <div class="class-grid">${cards}</div>
       </div>`,
      onClose,
    );
    this.on(s, '[data-cls]', (b) => onPick(b.dataset.cls as ClassId));
  }

  // ---------------- 공장 설정 ----------------
  factoryConfig(f: Factory, b: BuildingState, p: Progress, onChange: () => void, onClose: () => void): void {
    const def = BUILDINGS[b.type];
    let body = `<p class="hint">${def.description}</p>`;
    if (b.type === 'input') {
      const items = ITEM_LIST.filter((i) => i.kind !== 'key' && (p.count(i.id) > 0 || b.recipe === i.id))
        .map((i) => `<li class="${b.recipe === i.id ? 'sel' : ''}" data-item="${i.id}">${itemGem(i.id)}<div><b>${i.name}</b></div><b class="num">${p.count(i.id)}</b></li>`)
        .join('');
      body += `<h3>꺼낼 아이템 <small>${b.recipe ? ITEMS[b.recipe].name : '선택 안 함'}</small></h3><ul class="list pick">${items || '<li class="empty">창고가 비어 있습니다</li>'}</ul>`;
    } else if (b.type === 'assembler') {
      const list = recipesFor('assembler')
        .map((r) => {
          const inputs = Object.entries(r.inputs).map(([id, n]) => `${ITEMS[id].name}×${n}`).join(' + ');
          return `<li class="${b.recipe === r.id ? 'sel' : ''}" data-recipe="${r.id}">${itemGem(r.output)}<div><b>${ITEMS[r.output].name}</b><small>${inputs} · ${r.time}초</small></div></li>`;
        })
        .join('');
      body += `<h3>조립 설계</h3><ul class="list pick">${list}</ul>`;
    } else if (MACHINE_TYPES.has(b.type)) {
      const list = RECIPES.filter((r) => r.machine === b.type)
        .map((r) => `<li>${itemGem(r.output)}<div><b>${ITEMS[r.output].name}${r.count > 1 ? ` ×${r.count}` : ''}</b><small>${Object.entries(r.inputs).map(([id, n]) => `${ITEMS[id].name}×${n}`).join(' + ')} · ${r.time}초</small></div></li>`)
        .join('');
      body += `<h3>레시피 (들어오는 재료에 따라 자동)</h3><ul class="list">${list}</ul>`;
    } else if (b.type === 'generator') {
      body += `<p>남은 연료: <b>${Math.ceil(b.fuel ?? 0)}초</b></p><p class="hint">창고의 마력 정수: 하급 ${p.count('essence_low')} · 중급 ${p.count('essence_mid')} · 상급 ${p.count('essence_high')}</p>`;
    }
    if (MACHINE_TYPES.has(b.type) || b.type === 'generator') {
      const net = f.networkInfo(b);
      const statusText = { working: '가동 중', 'no-power': '전력 부족', idle: '재료 대기', blocked: '출구 막힘', 'no-recipe': '설계 선택 필요' }[f.status(b)];
      body += `<p class="hint">전력망: 공급 ${net?.supply ?? 0} / 수요 ${net?.demand ?? 0}${MACHINE_TYPES.has(b.type) ? ` · 상태: <b>${statusText}</b>` : ''}</p>`;
      if (b.buffer && Object.keys(b.buffer).length) body += `<p class="hint">보관 중: ${Object.entries(b.buffer).filter(([, n]) => n > 0).map(([id, n]) => `${ITEMS[id].name} ${n}`).join(', ') || '없음'}</p>`;
    }
    const s = this.open(
      'factory-config',
      `<div class="panel wide tall">
         <button class="close">${ICONS.close}</button>
         <h2>${def.name}</h2>
         ${body}
       </div>`,
      onClose,
    );
    this.on(s, '[data-item]', (el) => {
      b.recipe = el.dataset.item!;
      onChange();
      this.factoryConfig(f, b, p, onChange, onClose);
    });
    this.on(s, '[data-recipe]', (el) => {
      // 설계를 바꾸면 맞지 않는 재료는 창고로 돌려준다
      for (const [id, n] of Object.entries(b.buffer ?? {})) if (n > 0) p.add(id, n);
      b.buffer = {};
      b.recipe = el.dataset.recipe!;
      onChange();
      this.factoryConfig(f, b, p, onChange, onClose);
    });
  }

  factoryExpand(p: Progress, onExpand: () => void, onClose: () => void): void {
    const next = FACTORY_SIZES[p.data.factory.sizeLevel + 1];
    let body = '<p>이미 가장 넓은 차원집입니다.</p>';
    if (next?.cost) {
      const cost = next.cost;
      const ok = p.data.gold >= cost.gold && p.hasAll(cost.items);
      body = `<p>공장 넓이 ${p.factorySize}×${p.factorySize} → <b>${next.size}×${next.size}</b></p>
        <ul class="list">${Object.entries(cost.items).map(([id, n]) => `<li>${itemGem(id)}<div><b>${ITEMS[id].name}</b></div><b class="num ${p.count(id) >= n ? '' : 'bad'}">${p.count(id)} / ${n}</b></li>`).join('')}
        <li><span class="gem" style="--c:#e8c14a"></span><div><b>골드</b></div><b class="num ${p.data.gold >= cost.gold ? '' : 'bad'}">${p.data.gold} / ${cost.gold}</b></li></ul>
        <div class="menu"><button class="primary" data-x ${ok ? '' : 'disabled'}>확장하기</button></div>`;
    }
    const s = this.open('factory-config', `<div class="panel"><button class="close">${ICONS.close}</button><h2>차원집 확장</h2>${body}</div>`, onClose);
    this.on(s, '[data-x]', onExpand);
  }

  // ---------------- 알림 ----------------
  notice(title: string, html: string, onOk: () => void, button = '확인'): void {
    const s = this.open('notice-screen', `<div class="panel"><h2>${title}</h2>${html}<div class="menu"><button class="primary" data-ok>${button}</button></div></div>`, onOk);
    this.on(s, '[data-ok]', () => this.close());
  }

  offlineReward(seconds: number, produced: Map<string, number>, onOk: () => void): void {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const rows = [...produced].filter(([, n]) => n > 0).map(([id, n]) => `<li>${itemGem(id)}${ITEMS[id].name}<b>+${n}</b></li>`).join('');
    this.notice(
      '오프라인 보상',
      `<p class="hint">자리를 비운 ${h ? `${h}시간 ` : ''}${m}분 동안 차원집 공장이 돌아갔습니다.</p><ul class="loot">${rows || '<li class="empty">새로 만들어진 것이 없습니다</li>'}</ul>`,
      onOk,
    );
  }
}
