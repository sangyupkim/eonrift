import { CLASSES, CLASS_ORDER, expToNext, MAX_LEVEL, STAT_INFO, STAT_KEYS, type ClassId, type StatKey } from '../data/classes';
import { EQUIP_SLOTS, enhanceCost, equipName, equipStats, equipValue, GRADES, slotName, type Equip } from '../data/equipment';
import { BUILDINGS, BUILD_ORDER, FACTORY_SIZES, RECIPES, type BuildingType } from '../data/factory';
import { ITEMS, ITEM_LIST } from '../data/items';
import type { QuestDef } from '../data/quests';
import { THEMES } from '../data/themes';
import { BOX_CAPACITY, boxTotal, ESSENCES, MACHINE_TYPES, RECIPE_BY_ID, recipesFor, type BuildingState, type Factory } from '../factory/sim';
import type { Bag, Slot } from '../game/Bag';
import { stageIndex, type Progress } from '../game/Progress';
import { objectiveNeed, objectiveProgress, objectiveText, type Quests } from '../game/Quests';
import { ICONS } from './icons';
import { canInstall, promptInstall } from './install';

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
  stages?: number;
  note?: string;
}

/** 목록 안의 아이콘 (절대 위치) */
const itemGem = (id: string) => `<span class="gem" style="--c:${hex(ITEMS[id]?.color ?? 0xffffff)}"></span>`;
const equipGem = (e: Equip) => `<span class="gem eq" style="--c:${hex(GRADES[e.grade].color)}"></span>`;
/** 글 사이에 들어가는 작은 아이콘 */
const inlineGem = (id: string) => `<i class="gem-inline" style="--c:${hex(ITEMS[id]?.color ?? 0xffffff)}"></i>`;

export function equipLine(e: Equip): string {
  const s = equipStats(e);
  const parts = [];
  if (s.atk) parts.push(`공격 ${s.atk}`);
  if (s.def) parts.push(`방어 ${s.def}`);
  if (s.hp) parts.push(`HP ${s.hp}`);
  if (s.mp) parts.push(`MP ${s.mp}`);
  if (s.crit) parts.push(`치명 ${s.crit}%`);
  return parts.join(' · ');
}

function equipTitle(e: Equip): string {
  return `<b style="color:${hex(GRADES[e.grade].color)}">[${GRADES[e.grade].name}] ${esc(equipName(e))}</b>`;
}

const KIND_NAMES = { material: '재료', essence: '마력 정수', processed: '가공품', consumable: '소모품', key: '중요 물품' };

/** 가방 칸의 정보 (이름, 종류, 설명) */
function slotInfo(s: Slot): string {
  if (s.equip) {
    const e = s.equip;
    return `${equipTitle(e)} <span class="dim">· ${slotName(e.slot, e.cls)}${e.cls ? ` (${CLASSES[e.cls].name} 전용)` : ''}</span><br>${equipLine(e)} · 판매가 ${equipValue(e)} G`;
  }
  const it = ITEMS[s.itemId];
  return `<b style="color:${hex(it.color)}">${it.name}</b> <span class="dim">· ${KIND_NAMES[it.kind]} · ${s.count}개 · 개당 ${it.value} G</span><br>${it.description}`;
}

/** 모든 메뉴 화면. 한 번에 하나만 열린다 */
export class Screens {
  private layer: HTMLDivElement;
  private current: HTMLElement | null = null;
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
    const scroll = this.current?.querySelector('.scroll')?.scrollTop ?? 0;
    const sameKind = this.current?.dataset.kind === className;
    this.current?.remove();
    this.onCloseCb = null;
    const s = document.createElement('div');
    s.className = `screen ${className}`;
    s.dataset.kind = className;
    if (sameKind) s.classList.add('no-anim');
    s.innerHTML = html;
    this.layer.appendChild(s);
    this.current = s;
    // 같은 화면을 다시 그릴 때는 스크롤 위치를 유지한다
    if (sameKind) {
      const sc = s.querySelector('.scroll');
      if (sc) sc.scrollTop = scroll;
    }
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
           ${canInstall() ? '<button class="install" data-a="install">📲 앱으로 설치</button>' : ''}
         </div>
       </div>
       <div class="version">v1.1 · 모바일 가로 화면 권장</div>`,
    );
    this.on(s, '[data-a="continue"]', onContinue);
    this.on(s, '[data-a="install"]', () => void promptInstall());
    this.on(s, '[data-a="new"]', () => {
      if (hasSave && !confirm('저장된 진행을 지우고 새로 시작할까요?')) return;
      onNew();
    });
  }

  // ---------------- 차원문 광장: 단계 → 방 선택 ----------------
  stageSelect(p: Progress, tier: number, onPick: (tier: number, stage: number) => void, onClose: () => void): void {
    const maxTier = p.maxTier;
    const tiers = THEMES.map((t) => {
      const locked = t.tier > maxTier;
      return `<button class="tier-tab ${t.tier === tier ? 'on' : ''} ${locked ? 'locked' : ''}" data-tier="${t.tier}" style="--c:${hex(t.portalColor)}" ${locked ? 'disabled' : ''}>
          <span class="gate"></span><b>${t.tier}${p.data.dimStones.includes(t.tier) ? '<i class="stone">◆</i>' : ''}</b></button>`;
    }).join('');
    const theme = THEMES[tier - 1];
    const stages = Array.from({ length: 10 }, (_, i) => {
      const st = i + 1;
      const g = stageIndex(tier, st);
      const open = g <= p.data.cleared + 1;
      const done = g <= p.data.cleared;
      const mark = st === 10 ? '수호자' : st === 5 ? '파수꾼' : '';
      return `<button class="stage-btn ${done ? 'done' : ''} ${mark ? 'boss' : ''}" data-stage="${st}" ${open ? '' : 'disabled'}>
          <b>${tier}-${st}</b><small>${!open ? '봉인' : mark || (done ? '클리어' : '도전')}</small></button>`;
    }).join('');
    const s = this.open(
      'select',
      `<div class="panel wide">
         <button class="close">${ICONS.close}</button>
         <h2>차원문 광장 <small>${theme.name}${p.data.ngPlus ? ` · ${p.data.ngPlus + 1}회차` : ''}</small></h2>
         <div class="tier-tabs">${tiers}</div>
         <p class="hint">방의 몬스터를 모두 쓰러뜨리면 워프 게이트가 열립니다. 5번째 방은 파수꾼(좋은 보상), 10번째 방은 차원석을 지닌 수호자.</p>
         <div class="stage-grid">${stages}</div>
       </div>`,
      onClose,
    );
    this.on(s, '.tier-tab:not(.locked)', (b) => this.stageSelect(p, Number(b.dataset.tier), onPick, onClose));
    this.on(s, '[data-stage]', (b) => onPick(tier, Number(b.dataset.stage)));
  }

  /** 워프 게이트: 다음 방으로 갈지, 마을로 갈지 */
  warp(label: string, next: string | null, onNext: () => void, onVillage: () => void, onClose: () => void): void {
    const s = this.open(
      'warp',
      `<div class="panel">
         <button class="close">${ICONS.close}</button>
         <h2>워프 게이트</h2>
         <p class="hint">${label} 클리어! 가방의 전리품은 그대로 들고 갑니다.</p>
         <div class="menu">
           ${next ? `<button class="primary" data-a="next">다음 방으로 (${next})</button>` : ''}
           <button data-a="village" class="${next ? '' : 'primary'}">마을로 귀환</button>
         </div>
       </div>`,
      onClose,
    );
    this.on(s, '[data-a="next"]', onNext);
    this.on(s, '[data-a="village"]', onVillage);
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
         <div class="keys">PC 조작: WASD 이동 · J/클릭 공격 · Space 구르기 · 1·2·3 스킬 · Q 물약 · E 상호작용·채집 · M 지도 · I 가방 · B 건설 · Esc 메뉴</div>
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

  // ---------------- 던전 가방: 누르면 정보, 끌어서 옮기기 ----------------
  bag(bag: Bag, dimBag: Bag, onMove: (from: 'bag' | 'dim', index: number) => boolean, onClose: () => void): void {
    let info = '아이템을 누르면 정보가 나오고, 끌어서 다른 가방에 놓으면 옮겨집니다.';
    const render = () => {
      const cell = (s: Slot | null, from: string, i: number) => {
        if (!s) return '<div class="slot"></div>';
        const color = s.equip ? GRADES[s.equip.grade].color : ITEMS[s.itemId].color;
        return `<div class="slot filled" data-from="${from}" data-i="${i}" style="--c:${hex(color)}"><span class="gem ${s.equip ? 'eq' : ''}"></span><span class="cnt">${s.equip ? `+${s.equip.plus}` : s.count}</span></div>`;
      };
      const s = this.open(
        'bag',
        `<div class="panel wide">
           <button class="close">${ICONS.close}</button>
           <h2>가방 <small>${bag.used}/${bag.slots.length}</small></h2>
           <div class="bag-grid" data-bag="bag">${bag.slots.map((x, i) => cell(x, 'bag', i)).join('')}</div>
           <div class="item-info">${info}</div>
           <h3>차원가방 <small>쓰러져도 지켜지는 가방 · ${dimBag.used}/${dimBag.slots.length}</small></h3>
           <div class="bag-grid dim-row" data-bag="dim">${dimBag.slots.map((x, i) => cell(x, 'dim', i)).join('')}</div>
         </div>`,
        onClose,
      );
      s.querySelectorAll<HTMLElement>('.slot.filled').forEach((el) => {
        el.addEventListener('pointerdown', (e) => {
          e.preventDefault();
          el.setPointerCapture(e.pointerId);
          const from = el.dataset.from as 'bag' | 'dim';
          const i = Number(el.dataset.i);
          const slot = (from === 'bag' ? bag : dimBag).slots[i]!;
          const sx = e.clientX;
          const sy = e.clientY;
          let ghost: HTMLElement | null = null;
          const move = (ev: PointerEvent) => {
            if (!ghost && Math.hypot(ev.clientX - sx, ev.clientY - sy) > 8) {
              ghost = el.cloneNode(true) as HTMLElement;
              ghost.classList.add('drag-ghost');
              ghost.style.width = `${el.offsetWidth}px`;
              ghost.style.height = `${el.offsetHeight}px`;
              document.body.appendChild(ghost);
              el.classList.add('dragging');
            }
            if (ghost) {
              ghost.style.transform = `translate(${ev.clientX - el.offsetWidth / 2}px, ${ev.clientY - el.offsetHeight / 2}px)`;
              const over = (document.elementFromPoint(ev.clientX, ev.clientY) as HTMLElement | null)?.closest<HTMLElement>('.bag-grid');
              s.querySelectorAll('.bag-grid').forEach((g) => g.classList.toggle('drop', g === over && over.dataset.bag !== from));
            }
          };
          const up = (ev: PointerEvent) => {
            el.removeEventListener('pointermove', move);
            el.removeEventListener('pointerup', up);
            el.removeEventListener('pointercancel', up);
            if (ghost) {
              ghost.remove();
              const over = (document.elementFromPoint(ev.clientX, ev.clientY) as HTMLElement | null)?.closest<HTMLElement>('.bag-grid');
              if (over && over.dataset.bag !== from) {
                const name = slot.equip ? equipName(slot.equip) : ITEMS[slot.itemId].name;
                info = onMove(from, i) ? `${name} → ${from === 'bag' ? '차원가방' : '일반 가방'}` : '<span class="bad">옮길 칸이 없습니다</span>';
              }
              render();
            } else {
              // 누르기만 했으면 정보를 보여 준다
              info = slotInfo(slot);
              s.querySelector('.item-info')!.innerHTML = info;
              s.querySelectorAll('.slot').forEach((x) => x.classList.toggle('sel', x === el));
            }
          };
          el.addEventListener('pointermove', move);
          el.addEventListener('pointerup', up);
          el.addEventListener('pointercancel', up);
        });
      });
    };
    render();
  }

  // ---------------- 결과 ----------------
  result(info: ResultInfo, onContinue: () => void): void {
    const rows = [...info.items].map(([id, n]) => `<li>${itemGem(id)}${ITEMS[id].name}<b>× ${n}</b></li>`).join('');
    const eqRows = info.equips.map((e) => `<li>${equipGem(e)}<span>${equipTitle(e)}</span><b>장비</b></li>`).join('');
    const lostRows = info.lost ? [...info.lost].map(([id, n]) => `<li class="lost">${itemGem(id)}${ITEMS[id].name}<b>− ${n}</b></li>`).join('') : '';
    const m = Math.floor(info.seconds / 60);
    const sec = Math.floor(info.seconds % 60);
    const s = this.open(
      `result ${info.lost ? 'dead' : ''}`,
      `<div class="panel tall">
         <h2>${info.title}</h2>
         ${info.note ? `<p class="hint">${info.note}</p>` : ''}
         <div class="stats"><span>시간 <b>${m}분 ${sec}초</b></span>${info.stages ? `<span>클리어 <b>${info.stages}방</b></span>` : ''}<span>골드 <b>+${info.gold}</b></span><span>경험치 <b>+${info.exp}</b></span></div>
         <ul class="loot scroll">${rows}${eqRows}${lostRows}${!rows && !eqRows && !lostRows ? '<li class="empty">가져온 전리품이 없습니다</li>' : ''}</ul>
         ${info.lostEquips ? `<p class="hint">잃어버린 장비 ${info.lostEquips}개</p>` : ''}
         <div class="menu"><button class="primary" data-ok>마을로</button></div>
       </div>`,
      onContinue,
    );
    this.on(s, '[data-ok]', () => this.close());
  }

  // ---------------- 캐릭터: 장비 · 창고 · 능력치 · 퀘스트 ----------------
  inventory(p: Progress, quests: Quests, tab: 'equip' | 'storage' | 'stats' | 'quest', onChange: () => void, onClose: () => void): void {
    const cls = CLASSES[p.data.currentClass];
    const st = p.stats();
    const c = p.cls;
    let body = '';
    if (tab === 'equip') {
      const equipped = EQUIP_SLOTS.map((slot) => {
        const e = c.equipment[slot];
        return `<div class="eq-slot">${e ? `${equipGem(e)}<div>${equipTitle(e)}<small>${equipLine(e)}</small></div><button data-un="${slot}">해제</button>` : `<span class="gem empty"></span><div><b class="dim">${slotName(slot, p.data.currentClass)} 없음</b></div>`}</div>`;
      }).join('');
      const list = p.data.equips
        .slice()
        .sort((a, b) => b.tier * 10 + b.grade - (a.tier * 10 + a.grade))
        .map((e) => {
          const ok = p.canEquip(e);
          return `<li>${equipGem(e)}<div>${equipTitle(e)}<small>${slotName(e.slot, e.cls)} · ${equipLine(e)}${e.cls && e.cls !== p.data.currentClass ? ` · ${CLASSES[e.cls].name} 전용` : ''}</small></div><button data-eq="${e.uid}" ${ok ? '' : 'disabled'}>장착</button></li>`;
        })
        .join('');
      body = `<div class="scroll"><div class="eq-slots">${equipped}</div><h3>보관 중인 장비</h3><ul class="list">${list || '<li class="empty">장비가 없습니다</li>'}</ul></div>`;
    } else if (tab === 'storage') {
      const items = ITEM_LIST.filter((i) => p.count(i.id) > 0)
        .map((i) => `<li>${itemGem(i.id)}<div><b>${i.name}</b><small>${i.description}</small></div><b class="num">${p.count(i.id)}</b></li>`)
        .join('');
      body = `<ul class="list scroll">${items || '<li class="empty">창고가 비어 있습니다</li>'}</ul>`;
    } else if (tab === 'stats') {
      const next = expToNext(c.level);
      const statRows = STAT_KEYS.map(
        (k) => `<div class="stat-row"><b>${STAT_INFO[k].name}</b><span class="num">${st.base[k]}</span><small>${STAT_INFO[k].desc}</small>
          <button data-stat="${k}" ${c.points > 0 ? '' : 'disabled'}>+1</button><button data-stat5="${k}" ${c.points >= 5 ? '' : 'disabled'}>+5</button></div>`,
      ).join('');
      body = `<div class="scroll">
        <div class="stat-grid">
          <span>직업</span><b>${cls.name} Lv.${c.level}${c.level >= MAX_LEVEL ? ' (최고)' : ''}</b>
          <span>경험치</span><b>${c.exp} / ${next}</b>
          <span>HP</span><b>${st.maxHp}</b>
          <span>MP</span><b>${st.maxMp}</b>
          <span>${cls.damage === 'physical' ? '물리' : '마법'} 공격력</span><b>${st.atk}</b>
          <span>방어력</span><b>${st.def}</b>
          <span>치명타</span><b>${st.crit}%</b>
          <span>공격 속도</span><b>${Math.round(st.speed * 100)}%</b>
          <span>골드</span><b>${p.data.gold}</b>
          <span>차원석</span><b>${p.data.dimStones.length} / 7</b>
        </div>
        <h3>스탯 <small>남은 포인트 <b class="${c.points ? 'ok' : ''}">${c.points}</b> · 레벨업마다 5포인트</small></h3>
        <div class="stat-rows">${statRows}</div>
        <h3>스킬</h3><ul class="list">${cls.skills.map((sk, i) => `<li><span class="key">${i + 1}</span><div><b>${sk.name}</b><small>${sk.description} · MP ${sk.mp} · ${sk.cooldown}초</small></div></li>`).join('')}</ul>
      </div>`;
    } else {
      const ql = quests.activeList();
      const row = (q: QuestDef) => {
        const prog = quests.progress(q);
        const done = prog.every((x) => x.cur >= x.need);
        return `<li class="quest ${q.kind}"><div><b>${q.kind === 'main' ? '[메인] ' : '[서브] '}${q.title}</b>
          <small>${prog.map((x) => `${x.text} ${x.cur}/${x.need}`).join(' · ')}</small>
          <small class="${done ? 'ok' : 'dim'}">${done ? `✔ ${npcName(q.npc)}에게 보고하기` : `의뢰인: ${npcName(q.npc)}`}</small></div></li>`;
      };
      const daily = quests.state.daily.list
        .map((d) => {
          const need = objectiveNeed(d.objective);
          const cur = objectiveProgress(d.objective, d.progress, { count: (id) => p.count(id), stones: p.stoneCount, cleared: p.data.cleared, flag: (f) => p.flag(f) });
          return `<li class="quest daily ${d.claimed ? 'claimed' : ''}"><div><b>[일일] ${d.title}</b><small>${objectiveText(d.objective)} ${Math.min(cur, need)}/${need}</small><small class="${d.claimed ? 'dim' : cur >= need ? 'ok' : 'dim'}">${d.claimed ? '보상 받음' : cur >= need ? '✔ 촌장 에단에게 보고하기' : '촌장 에단의 일일 의뢰'}</small></div></li>`;
        })
        .join('');
      body = `<ul class="list scroll">${ql.map(row).join('')}${daily}${!ql.length && !daily ? '<li class="empty">진행 중인 퀘스트가 없습니다. 머리 위에 !가 뜬 주민에게 말을 걸어 보세요.</li>' : ''}</ul>`;
    }
    const s = this.open(
      'inventory',
      `<div class="panel wide tall">
         <button class="close">${ICONS.close}</button>
         <div class="tabs">
           <button data-tab="equip" class="${tab === 'equip' ? 'on' : ''}">장비</button>
           <button data-tab="storage" class="${tab === 'storage' ? 'on' : ''}">창고</button>
           <button data-tab="stats" class="${tab === 'stats' ? 'on' : ''}">능력치${c.points ? ` <i class="dot">${c.points}</i>` : ''}</button>
           <button data-tab="quest" class="${tab === 'quest' ? 'on' : ''}">퀘스트</button>
         </div>
         ${body}
       </div>`,
      onClose,
    );
    const again = (t = tab) => this.inventory(p, quests, t, onChange, onClose);
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
    this.on(s, '[data-stat]', (b) => {
      p.allocate(b.dataset.stat as StatKey, 1);
      onChange();
      again();
    });
    this.on(s, '[data-stat5]', (b) => {
      p.allocate(b.dataset.stat5 as StatKey, 5);
      onChange();
      again();
    });
  }

  // ---------------- 퀘스트 제안 ----------------
  questOffer(q: QuestDef, onAccept: () => void, onClose: () => void): void {
    const obj = q.objectives.map((o) => `<li><span class="key">▸</span><div><b>${objectiveText(o)}</b><small>${o.type === 'clear' ? '' : `${objectiveNeed(o)}${o.type === 'deliver' || o.type === 'gather' || o.type === 'craft' ? '개' : o.type === 'build' ? '개 설치' : '마리'}`}</small></div></li>`).join('');
    const r = q.rewards;
    const rewards = [r.gold ? `${r.gold} G` : '', r.exp ? `경험치 ${r.exp}` : '', ...Object.entries(r.items ?? {}).map(([id, n]) => `${inlineGem(id)}${ITEMS[id].name} ×${n}`)].filter(Boolean).join(' · ');
    const s = this.open(
      'quest-offer',
      `<div class="panel">
         <button class="close">${ICONS.close}</button>
         <h2>${q.kind === 'main' ? '[메인] ' : '[서브] '}${q.title}</h2>
         <ul class="list">${obj}</ul>
         <p class="hint">보상: ${rewards || '없음'}</p>
         <div class="menu"><button class="primary" data-a="accept">수락하기</button></div>
       </div>`,
      onClose,
    );
    this.on(s, '[data-a="accept"]', onAccept);
  }

  /** 촌장의 일일 의뢰 게시판 */
  dailyBoard(p: Progress, quests: Quests, onClaim: (i: number) => void, onClose: () => void): void {
    const ctx = { count: (id: string) => p.count(id), stones: p.stoneCount, cleared: p.data.cleared, flag: (f: string) => p.flag(f) };
    const rows = quests.state.daily.list
      .map((d, i) => {
        const need = objectiveNeed(d.objective);
        const cur = Math.min(need, objectiveProgress(d.objective, d.progress, ctx));
        const r = d.reward;
        const reward = [r.gold ? `${r.gold} G` : '', r.exp ? `경험치 ${r.exp}` : '', ...Object.entries(r.items ?? {}).map(([id, n]) => `${ITEMS[id].name}×${n}`)].filter(Boolean).join(' · ');
        return `<li><div><b>${d.title}</b><small>${objectiveText(d.objective)} ${cur}/${need}</small><small class="dim">보상: ${reward}</small></div>
          <button data-claim="${i}" ${d.claimed || cur < need ? 'disabled' : ''}>${d.claimed ? '완료' : '보상 받기'}</button></li>`;
      })
      .join('');
    const s = this.open(
      'daily',
      `<div class="panel wide">
         <button class="close">${ICONS.close}</button>
         <h2>촌장의 일일 의뢰 <small>매일 새로 바뀝니다</small></h2>
         <ul class="list">${rows}</ul>
       </div>`,
      onClose,
    );
    this.on(s, '[data-claim]', (b) => onClaim(Number(b.dataset.claim)));
  }

  // ---------------- 상점 ----------------
  shop(p: Progress, onChange: () => void, onClose: () => void, tab: 'buy' | 'sell' = 'buy', toast?: string): void {
    const goods: { id: string; label: string; price: number; make: () => void; equip?: Equip }[] = [
      { id: 'potion', label: '치유 물약', price: 30, make: () => p.add('potion', 1) },
      { id: 'return_stone', label: '귀환석', price: 80, make: () => p.add('return_stone', 1) },
    ];
    const t = Math.max(1, Math.min(3, p.maxTier - 1));
    for (const slot of EQUIP_SLOTS) {
      const e: Equip = { uid: `shop-${slot}`, slot, cls: slot === 'weapon' ? p.data.currentClass : undefined, tier: t, grade: 0, plus: 0 };
      goods.push({
        id: `eq-${slot}`,
        label: equipName(e),
        equip: e,
        price: equipValue(e) * 4,
        make: () => p.data.equips.push({ ...e, uid: `${Date.now()}${slot}${Math.random()}` }),
      });
    }
    let body = '';
    if (tab === 'buy') {
      body = `<ul class="list scroll">${goods
        .map((g, i) => `<li>${g.equip ? equipGem(g.equip) : itemGem(g.id)}<div><b>${esc(g.label)}</b><small>${g.equip ? `기본 장비 · ${equipLine(g.equip)}` : ITEMS[g.id].description}</small></div><button data-buy="${i}" ${p.data.gold >= g.price ? '' : 'disabled'}>${g.price} G</button></li>`)
        .join('')}</ul>`;
    } else {
      const items = ITEM_LIST.filter((i) => p.count(i.id) > 0 && i.value > 0)
        .map((i) => `<li>${itemGem(i.id)}<div><b>${i.name} <span class="dim">× ${p.count(i.id)}</span></b><small>개당 ${i.value} G</small></div><button data-sell="${i.id}">1개</button><button data-sellall="${i.id}">전부</button></li>`)
        .join('');
      const eqs = p.data.equips.map((e) => `<li>${equipGem(e)}<div>${equipTitle(e)}<small>${equipLine(e)}</small></div><button data-selleq="${e.uid}">${equipValue(e)} G</button></li>`).join('');
      body = `<ul class="list scroll">${items}${eqs}${!items && !eqs ? '<li class="empty">팔 물건이 없습니다</li>' : ''}</ul>`;
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
      again(tab, `${g.label} 구입`);
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

  /** 세라의 도면 상점 */
  blueprints(p: Progress, onBuy: (t: BuildingType) => void, onClose: () => void, message?: string): void {
    const rows = BUILD_ORDER.filter((t) => BUILDINGS[t].blueprint)
      .map((t) => {
        const d = BUILDINGS[t];
        const bp = d.blueprint!;
        const owned = p.flag(`bp_${t}`) > 0;
        const cost = [`${bp.gold} G`, ...Object.entries(bp.items).map(([id, n]) => `${ITEMS[id].name} ${p.count(id)}/${n}`)].join(' · ');
        const ok = !owned && p.data.gold >= bp.gold && p.hasAll(bp.items);
        return `<li><span class="gem" style="--c:${hex(d.color)}"></span><div><b>${d.name} 도면</b><small>${d.description}</small><small class="dim">${owned ? '보유 중' : cost}</small></div><button data-bp="${t}" ${ok ? '' : 'disabled'}>${owned ? '보유' : '구입'}</button></li>`;
      })
      .join('');
    const s = this.open(
      'blueprints',
      `<div class="panel wide tall">
         <button class="close">${ICONS.close}</button>
         <h2>세라의 도면 <small class="gold">${p.data.gold} G</small></h2>
         ${message ? `<div class="notice">${message}</div>` : ''}
         <p class="hint">도면을 사면 차원집 건설 모드에서 그 건물을 지을 수 있습니다.</p>
         <ul class="list scroll">${rows}</ul>
       </div>`,
      onClose,
    );
    this.on(s, '[data-bp]', (b) => onBuy(b.dataset.bp as BuildingType));
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
          <p class="hint">${equipLine(sel)}<br>→ ${equipLine(next)}</p>
          <p>${inlineGem(cost.stone)}${ITEMS[cost.stone].name} ${cost.count}개 <span class="${have >= cost.count ? 'dim' : 'bad'}">(보유 ${have})</span></p>
          <p>${cost.gold} G · 성공 확률 <b>${Math.round(cost.rate * 100)}%</b></p>
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
         <div class="split"><ul class="list pick scroll">${list || '<li class="empty">장비 없음</li>'}</ul><div class="detail">${detail}</div></div>
       </div>`,
      onClose,
    );
    this.on(s, '[data-pick]', (el) => this.forge(p, onChange, onClose, el.dataset.pick));
    this.on(s, '[data-enh]', () => {
      if (!sel) return;
      const cost = enhanceCost(sel)!;
      if (p.count(cost.stone) < cost.count || p.data.gold < cost.gold) return;
      p.take(cost.stone, cost.count);
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
         <p class="hint">레벨·스탯·장비는 직업마다 따로, 차원집과 창고는 모두 함께 씁니다.</p>
         <div class="class-grid">${cards}</div>
       </div>`,
      onClose,
    );
    this.on(s, '[data-cls]', (b) => onPick(b.dataset.cls as ClassId));
  }

  // ---------------- 공장: 발전기 ----------------
  generator(f: Factory, b: BuildingState, p: Progress, onChange: () => void, onClose: () => void): void {
    const net = f.networkInfo(b);
    const rows = ESSENCES.map((id) => {
      const inside = b.buffer?.[id] ?? 0;
      const have = p.count(id);
      return `<li>${itemGem(id)}<div><b>${ITEMS[id].name}</b><small>발전기 안 ${inside}개 · 창고 ${have}개</small></div>
        <button data-put="${id}" data-n="1" ${have ? '' : 'disabled'}>+1</button><button data-put="${id}" data-n="10" ${have ? '' : 'disabled'}>+10</button><button data-put="${id}" data-n="all" ${have ? '' : 'disabled'}>전부</button>
        <button data-take="${id}" ${inside ? '' : 'disabled'}>빼기</button></li>`;
    }).join('');
    const s = this.open(
      'factory-config',
      `<div class="panel wide tall">
         <button class="close">${ICONS.close}</button>
         <h2>마력 발전기</h2>
         <p class="hint">여기에 넣은 마력 정수만 탑니다 (하급 2분 · 중급 5분 · 상급 10분). 전력을 쓰는 기계가 있을 때만 연료가 줄어듭니다.</p>
         <p>지금 타는 연료: <b>${Math.ceil(b.fuel ?? 0)}초</b> · 전력망 공급 ${net?.supply ?? 0} / 수요 ${net?.demand ?? 0}</p>
         <ul class="list scroll">${rows}</ul>
       </div>`,
      onClose,
    );
    const again = () => {
      onChange();
      this.generator(f, b, p, onChange, onClose);
    };
    this.on(s, '[data-put]', (el) => {
      const id = el.dataset.put!;
      const n = el.dataset.n === 'all' ? p.count(id) : Math.min(p.count(id), Number(el.dataset.n));
      if (n > 0 && p.take(id, n)) b.buffer![id] = (b.buffer![id] ?? 0) + n;
      again();
    });
    this.on(s, '[data-take]', (el) => {
      const id = el.dataset.take!;
      const n = b.buffer![id] ?? 0;
      if (n > 0) {
        p.add(id, n);
        delete b.buffer![id];
      }
      again();
    });
  }

  // ---------------- 공장: 보관상자 ----------------
  box(b: BuildingState, p: Progress, onChange: () => void, onClose: () => void): void {
    const inside = Object.entries(b.buffer ?? {}).filter(([, n]) => n > 0);
    const insideRows = inside
      .map(([id, n]) => `<li>${itemGem(id)}<div><b>${ITEMS[id].name}</b><small>상자 안 ${n}개</small></div><button data-out="${id}" data-n="1">1개</button><button data-out="${id}" data-n="10">10개</button><button data-out="${id}" data-n="all">전부 꺼내기</button></li>`)
      .join('');
    const storeRows = ITEM_LIST.filter((i) => i.kind !== 'key' && p.count(i.id) > 0)
      .map((i) => `<li>${itemGem(i.id)}<div><b>${i.name}</b><small>창고 ${p.count(i.id)}개</small></div><button data-in="${i.id}" data-n="1">1개</button><button data-in="${i.id}" data-n="10">10개</button><button data-in="${i.id}" data-n="all">전부 넣기</button></li>`)
      .join('');
    const s = this.open(
      'factory-config',
      `<div class="panel wide tall">
         <button class="close">${ICONS.close}</button>
         <h2>보관상자 <small>${boxTotal(b)} / ${BOX_CAPACITY}</small></h2>
         <div class="tabs">
           <button data-mode="in" class="${b.mode === 'in' ? 'on' : ''}">투입 (앞 기계로 보내기)</button>
           <button data-mode="out" class="${b.mode === 'out' ? 'on' : ''}">출하 (완성품 받기)</button>
         </div>
         <div class="scroll">
           <h3>상자 안</h3>
           <ul class="list">${insideRows || '<li class="empty">비어 있습니다</li>'}</ul>
           <h3>창고에서 넣기</h3>
           <ul class="list">${storeRows || '<li class="empty">창고가 비어 있습니다</li>'}</ul>
         </div>
       </div>`,
      onClose,
    );
    const again = () => {
      onChange();
      this.box(b, p, onChange, onClose);
    };
    this.on(s, '[data-mode]', (el) => {
      b.mode = el.dataset.mode as 'in' | 'out';
      again();
    });
    this.on(s, '[data-out]', (el) => {
      const id = el.dataset.out!;
      const have = b.buffer![id] ?? 0;
      const n = el.dataset.n === 'all' ? have : Math.min(have, Number(el.dataset.n));
      if (n > 0) {
        b.buffer![id] -= n;
        if (b.buffer![id] <= 0) delete b.buffer![id];
        p.add(id, n);
      }
      again();
    });
    this.on(s, '[data-in]', (el) => {
      const id = el.dataset.in!;
      const room = BOX_CAPACITY - boxTotal(b);
      const n = Math.min(room, el.dataset.n === 'all' ? p.count(id) : Math.min(p.count(id), Number(el.dataset.n)));
      if (n > 0 && p.take(id, n)) b.buffer![id] = (b.buffer![id] ?? 0) + n;
      again();
    });
  }

  // ---------------- 공장: 기계 ----------------
  machine(f: Factory, b: BuildingState, p: Progress, onChange: () => void, onClose: () => void): void {
    const def = BUILDINGS[b.type];
    let body = `<p class="hint">${def.description}</p>`;
    if (b.crafting) {
      const r = RECIPE_BY_ID[b.crafting];
      body += `<div class="notice">생산 중: ${inlineGem(r.output)}<b>${ITEMS[r.output].name}</b> ×${r.count} · ${Math.floor((b.progress ?? 0) * 100)}% (총 ${r.time}초)</div>`;
    }
    if (b.type === 'assembler') {
      const list = recipesFor('assembler')
        .map((r) => {
          const inputs = Object.entries(r.inputs).map(([id, n]) => `${ITEMS[id].name}×${n}`).join(' + ');
          return `<li class="${b.recipe === r.id ? 'sel' : ''}" data-recipe="${r.id}">${itemGem(r.output)}<div><b>${ITEMS[r.output].name}</b><small>${inputs} · ${r.time}초</small></div></li>`;
        })
        .join('');
      body += `<h3>조립 설계 <small>누르면 바뀝니다</small></h3><ul class="list pick">${list}</ul>`;
    } else if (MACHINE_TYPES.has(b.type)) {
      const list = RECIPES.filter((r) => r.machine === b.type)
        .map((r) => `<li>${itemGem(r.output)}<div><b>${ITEMS[r.output].name}${r.count > 1 ? ` ×${r.count}` : ''}</b><small>${Object.entries(r.inputs).map(([id, n]) => `${ITEMS[id].name}×${n}`).join(' + ')} · ${r.time}초</small></div></li>`)
        .join('');
      body += `<h3>레시피 <small>들어오는 재료에 따라 자동</small></h3><ul class="list">${list}</ul>`;
    }
    const net = f.networkInfo(b);
    const statusText = { working: '가동 중', 'no-power': '전력 부족 (발전기 연료 확인)', idle: '재료 대기', blocked: '출구 막힘', 'no-recipe': '설계 선택 필요' }[f.status(b)];
    body += `<p class="hint">${f.connected(b) ? `전력망: 공급 ${net?.supply ?? 0} / 수요 ${net?.demand ?? 0}` : '<span class="bad">마력선에 연결되어 있지 않습니다</span>'} · 상태: <b>${statusText}</b></p>`;
    const buf = Object.entries(b.buffer ?? {}).filter(([, n]) => n > 0);
    if (buf.length) body += `<p class="hint">대기 중인 재료: ${buf.map(([id, n]) => `${ITEMS[id].name} ${n}`).join(', ')}</p>`;
    const s = this.open(
      'factory-config',
      `<div class="panel wide tall">
         <button class="close">${ICONS.close}</button>
         <h2>${def.name}</h2>
         <div class="scroll">${body}</div>
       </div>`,
      onClose,
    );
    this.on(s, '[data-recipe]', (el) => {
      for (const [id, n] of Object.entries(b.buffer ?? {})) if (n > 0) p.add(id, n);
      b.buffer = {};
      b.recipe = el.dataset.recipe!;
      onChange();
      this.machine(f, b, p, onChange, onClose);
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
      `<p class="hint">자리를 비운 ${h ? `${h}시간 ` : ''}${m}분 동안 차원집 공장이 돌아갔습니다. 출하 보관상자를 확인해 보세요.</p><ul class="loot">${rows || '<li class="empty">새로 만들어진 것이 없습니다</li>'}</ul>`,
      onOk,
    );
  }
}

const NPC_NAMES: Record<string, string> = { chief: '촌장 에단', guide: '안내인 리아', smith: '대장장이 고른', engineer: '마공학자 세라', merchant: '상인 무트', stranger: '???' };
export const npcName = (id: string) => NPC_NAMES[id] ?? id;
