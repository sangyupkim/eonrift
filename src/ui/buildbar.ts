import { BUILD_ORDER, BUILDINGS, type BuildingType } from '../data/factory';
import { ITEMS } from '../data/items';
import { hex } from './screens';

export type BuildTool = BuildingType | 'remove' | 'config';

const DIR_ARROWS = ['→', '↓', '←', '↑'];

/** 공장 건설 모드의 하단 도구 모음 */
export class BuildBar {
  readonly root: HTMLDivElement;
  private info: HTMLDivElement;
  tool: BuildTool = 'belt';
  dir = 0;

  constructor(
    parent: HTMLElement,
    private handlers: { onDone: () => void; onExpand: () => void; onChange: () => void; click: () => void },
  ) {
    this.root = document.createElement('div');
    this.root.className = 'buildbar hidden';
    parent.appendChild(this.root);
    this.info = document.createElement('div');
    this.info.className = 'build-info';
  }

  show(unlocked: (t: BuildingType) => boolean): void {
    const tools = BUILD_ORDER.filter(unlocked)
      .map((t) => {
        const d = BUILDINGS[t];
        return `<button class="tool" data-tool="${t}" style="--c:${hex(d.color)}"><i></i><span>${d.name}</span></button>`;
      })
      .join('');
    this.root.innerHTML = `
      <div class="build-top">
        <button class="tool-sm" data-act="rotate">회전 <b class="dir">${DIR_ARROWS[this.dir]}</b></button>
        <button class="tool-sm" data-tool="config">설정</button>
        <button class="tool-sm danger" data-tool="remove">철거</button>
        <button class="tool-sm" data-act="expand">확장</button>
        <button class="tool-sm primary" data-act="done">완료</button>
      </div>
      <div class="build-tools">${tools}</div>`;
    this.root.prepend(this.info);
    this.root.classList.remove('hidden');
    this.root.querySelectorAll<HTMLButtonElement>('[data-tool]').forEach((b) =>
      b.addEventListener('click', () => {
        this.handlers.click();
        this.select(b.dataset.tool as BuildTool);
      }),
    );
    this.root.querySelector('[data-act="rotate"]')!.addEventListener('click', () => {
      this.handlers.click();
      this.dir = (this.dir + 1) % 4;
      this.root.querySelector('.dir')!.textContent = DIR_ARROWS[this.dir];
      this.refreshInfo();
    });
    this.root.querySelector('[data-act="done"]')!.addEventListener('click', () => this.handlers.onDone());
    this.root.querySelector('[data-act="expand"]')!.addEventListener('click', () => this.handlers.onExpand());
    this.select(this.tool);
  }

  hide(): void {
    this.root.classList.add('hidden');
  }

  select(tool: BuildTool): void {
    this.tool = tool;
    this.root.querySelectorAll<HTMLButtonElement>('[data-tool]').forEach((b) => b.classList.toggle('on', b.dataset.tool === tool));
    this.refreshInfo();
    this.handlers.onChange();
  }

  private refreshInfo(): void {
    if (this.tool === 'remove') this.info.innerHTML = '<b>철거</b> · 누른 건물을 없애고 재료를 돌려받습니다';
    else if (this.tool === 'config') this.info.innerHTML = '<b>설정</b> · 투입 상자의 아이템, 조립기의 설계를 고릅니다';
    else {
      const d = BUILDINGS[this.tool];
      const cost = Object.entries(d.cost)
        .map(([id, n]) => `${ITEMS[id].name} ${n}`)
        .join(', ');
      const drag = this.tool === 'belt' || this.tool === 'wire' ? ' · 끌어서 이어 깔기' : ` · 방향 ${DIR_ARROWS[this.dir]}`;
      this.info.innerHTML = `<b>${d.name}</b>${d.power ? ` · 전력 ${d.type === 'generator' ? '+' : '-'}${d.power}` : ''} · ${cost || '무료'}${drag}<br><small>${d.description}</small>`;
    }
  }
}
