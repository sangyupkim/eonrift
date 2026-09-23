import { ITEMS } from '../data/items';
import { THEMES } from '../data/themes';
import type { Bag } from '../game/Bag';
import { ICONS } from './icons';

const hex = (c: number) => `#${c.toString(16).padStart(6, '0')}`;

export interface ResultInfo {
  items: Map<string, number>;
  seconds: number;
  explored: number;
}

/** 타이틀, 차원문 선택, 일시정지, 가방, 결과 화면 */
export class Screens {
  private layer: HTMLDivElement;
  private current: HTMLElement | null = null;

  constructor(parent: HTMLElement) {
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
  }

  private open(className: string, html: string): HTMLElement {
    this.close();
    const s = document.createElement('div');
    s.className = `screen ${className}`;
    s.innerHTML = html;
    this.layer.appendChild(s);
    this.current = s;
    return s;
  }

  title(onStart: () => void): void {
    const s = this.open(
      'title',
      `<div class="title-box">
         <div class="title-sub">차원틈새에 떨어진 자의 이야기</div>
         <h1>영겁의 틈새</h1>
         <div class="title-start">화면을 터치하여 시작</div>
       </div>
       <div class="version">프로토타입 M1·M2</div>`,
    );
    // pointerup으로 넘기면 뒤따르는 click이 다음 화면의 버튼을 눌러 버린다
    s.addEventListener('click', () => onStart(), { once: true });
  }

  tierSelect(onPick: (tier: number) => void): void {
    const cards = THEMES.map(
      (t) => `<button class="tier-card" data-tier="${t.tier}" style="--c:${hex(t.portalColor)}">
          <span class="gate"></span>
          <b>${t.tier}단계</b>
          <span class="name">${t.name}</span>
        </button>`,
    ).join('');
    const s = this.open(
      'select',
      `<div class="panel wide">
         <h2>차원문 광장</h2>
         <p class="hint">들어갈 차원문을 고르세요. 들어갈 때마다 내부 모양이 바뀝니다. <em>(개발용: 모든 단계 개방)</em></p>
         <div class="tier-grid">${cards}</div>
       </div>`,
    );
    s.querySelectorAll<HTMLButtonElement>('.tier-card').forEach((b) =>
      b.addEventListener('click', () => onPick(Number(b.dataset.tier))),
    );
  }

  pause(opts: {
    seed: number;
    shadows: boolean;
    onResume: () => void;
    onRegenerate: () => void;
    onLeave: () => void;
    onToggleShadows: (on: boolean) => void;
  }): void {
    const s = this.open(
      'pause',
      `<div class="panel">
         <h2>일시정지</h2>
         <div class="menu">
           <button data-a="resume" class="primary">계속하기</button>
           <button data-a="regen">새 던전 생성 (같은 단계)</button>
           <button data-a="leave">차원문 광장으로</button>
           <label class="toggle"><input type="checkbox" ${opts.shadows ? 'checked' : ''}/> 그림자</label>
         </div>
         <div class="seed">시드 ${opts.seed}</div>
         <div class="keys">PC 조작: WASD 이동 · J/클릭 공격 · Space 구르기 · E 상호작용 · I 가방 · Esc 메뉴</div>
       </div>`,
    );
    const on = (a: string, f: () => void) => s.querySelector(`[data-a="${a}"]`)!.addEventListener('click', f);
    on('resume', opts.onResume);
    on('regen', opts.onRegenerate);
    on('leave', opts.onLeave);
    s.querySelector('input')!.addEventListener('change', (e) => opts.onToggleShadows((e.target as HTMLInputElement).checked));
  }

  bag(bag: Bag, onClose: () => void): void {
    const cell = (itemId: string | null, count = 0) => {
      if (!itemId) return '<div class="slot"></div>';
      const item = ITEMS[itemId];
      return `<div class="slot filled" data-item="${itemId}" style="--c:${hex(item.color)}">
          <span class="gem"></span><span class="cnt">${count}</span></div>`;
    };
    const slots = bag.slots.map((s) => cell(s?.itemId ?? null, s?.count)).join('');
    const dimSlots = Array.from({ length: 4 }, () => '<div class="slot dim"></div>').join('');
    const s = this.open(
      'bag',
      `<div class="panel wide">
         <button class="close">${ICONS.close}</button>
         <h2>가방</h2>
         <div class="bag-grid">${slots}</div>
         <div class="item-info">아이템을 누르면 설명이 나옵니다.</div>
         <h3>차원가방 <small>쓰러져도 지켜지는 가방 · 마을 시스템(M4)에서 열립니다</small></h3>
         <div class="bag-grid dim-row">${dimSlots}</div>
       </div>`,
    );
    const info = s.querySelector('.item-info')!;
    s.querySelectorAll<HTMLElement>('.slot.filled').forEach((e) =>
      e.addEventListener('click', () => {
        const item = ITEMS[e.dataset.item!];
        info.innerHTML = `<b style="color:${hex(item.color)}">${item.name}</b> — ${item.description}`;
      }),
    );
    s.querySelector('.close')!.addEventListener('click', onClose);
    s.addEventListener('pointerdown', (e) => {
      if (e.target === s) onClose();
    });
  }

  result(info: ResultInfo, onContinue: () => void): void {
    const rows = [...info.items]
      .map(([id, n]) => {
        const item = ITEMS[id];
        return `<li><span class="gem" style="--c:${hex(item.color)}"></span>${item.name}<b>× ${n}</b></li>`;
      })
      .join('');
    const m = Math.floor(info.seconds / 60);
    const sec = Math.floor(info.seconds % 60);
    const s = this.open(
      'result',
      `<div class="panel">
         <h2>귀환 성공</h2>
         <div class="stats"><span>탐험 시간 <b>${m}분 ${sec}초</b></span><span>탐험률 <b>${Math.round(info.explored * 100)}%</b></span></div>
         <ul class="loot">${rows || '<li class="empty">가져온 자원이 없습니다</li>'}</ul>
         <div class="menu"><button class="primary">차원문 광장으로</button></div>
       </div>`,
    );
    s.querySelector('button')!.addEventListener('click', onContinue);
  }
}
