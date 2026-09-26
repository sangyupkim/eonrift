import { SCRIPTS, type Step } from '../data/story';

export interface DialogueHandlers {
  set: (flag: string, v: number) => void;
  run: (cmd: string) => void;
  shake: () => void;
  click: () => void;
  /** 말하는 사람 이름 → 초상화 이미지 (없으면 빈 문자열) */
  portrait?: (speaker: string) => string;
  /** 대화창에 보일 이름 ('나' → 닉네임) */
  displayName?: (speaker: string) => string;
  /** 글자가 나올 때 소리 (speaker: 말하는 사람) */
  blip?: (speaker: string) => void;
}

/**
 * 대화창과 간단한 컷신 연출 (페이드, 번쩍임, 제목 카드, 선택지).
 * 화면을 누르면 다음 줄로 넘어가고, 글자가 나오는 중이면 한 번에 다 보여 준다.
 */
export class Dialogue {
  private root: HTMLDivElement;
  private box: HTMLDivElement;
  private nameEl: HTMLDivElement;
  private textEl: HTMLDivElement;
  private choicesEl: HTMLDivElement;
  private fade: HTMLDivElement;
  private card: HTMLDivElement;
  private queue: Step[] = [];
  private typing = 0;
  private fullText = '';
  private shown = 0;
  private waitingChoice = false;
  private onDone: (() => void) | null = null;
  active = false;

  constructor(
    parent: HTMLElement,
    private handlers: DialogueHandlers,
  ) {
    this.root = document.createElement('div');
    this.root.className = 'dialogue hidden';
    this.root.innerHTML = `
      <div class="dlg-fade"></div>
      <div class="dlg-card"></div>
      <div class="dlg-box">
        <img class="dlg-portrait" alt="">
        <div class="dlg-name"></div>
        <div class="dlg-text"></div>
        <div class="dlg-choices"></div>
        <div class="dlg-next">▼</div>
      </div>
      <button class="dlg-skip">건너뛰기 ▶▶</button>`;
    parent.appendChild(this.root);
    this.box = this.root.querySelector('.dlg-box')!;
    this.nameEl = this.root.querySelector('.dlg-name')!;
    this.textEl = this.root.querySelector('.dlg-text')!;
    this.choicesEl = this.root.querySelector('.dlg-choices')!;
    this.fade = this.root.querySelector('.dlg-fade')!;
    this.card = this.root.querySelector('.dlg-card')!;
    this.root.addEventListener('pointerup', (e) => {
      if ((e.target as HTMLElement).closest('button')) return;
      this.advance();
    });
    this.root.querySelector('.dlg-skip')!.addEventListener('click', () => this.skip());
  }

  play(scriptId: string, onDone?: () => void): void {
    this.playSteps(SCRIPTS[scriptId] ?? [], onDone);
  }

  playSteps(steps: Step[], onDone?: () => void): void {
    if (!steps.length) {
      onDone?.();
      return;
    }
    this.queue = [...steps];
    this.onDone = onDone ?? null;
    this.active = true;
    this.root.classList.remove('hidden');
    this.fade.className = 'dlg-fade';
    this.next();
  }

  private next(): void {
    window.clearInterval(this.typing);
    this.card.classList.remove('show');
    const step = this.queue.shift();
    if (!step) return this.finish();
    if ('s' in step) {
      this.box.classList.add('show');
      this.box.classList.toggle('narration', step.s === '');
      this.nameEl.textContent = this.handlers.displayName?.(step.s) ?? step.s;
      const img = this.box.querySelector<HTMLImageElement>('.dlg-portrait')!;
      const url = step.s ? (this.handlers.portrait?.(step.s) ?? '') : '';
      if (url) {
        if (img.dataset.src !== url) {
          img.dataset.src = url;
          img.src = url;
        }
        img.style.display = '';
      } else img.style.display = 'none';
      this.box.classList.toggle('has-portrait', !!url);
      this.choicesEl.innerHTML = '';
      this.fullText = step.t;
      this.shown = 0;
      this.textEl.textContent = '';
      const speaker = step.s;
      this.typing = window.setInterval(() => {
        this.shown++;
        this.textEl.textContent = this.fullText.slice(0, this.shown);
        // 두 글자마다, 공백·문장부호는 건너뛰고 말소리
        const ch = this.fullText[this.shown - 1] ?? '';
        if (this.shown % 2 === 1 && /[^\s.,!?…~·]/.test(ch)) this.handlers.blip?.(speaker);
        if (this.shown >= this.fullText.length) window.clearInterval(this.typing);
      }, 28);
    } else if ('choice' in step) {
      this.waitingChoice = true;
      this.box.classList.add('show');
      this.choicesEl.innerHTML = step.choice.map((c, i) => `<button data-i="${i}">${c.text}</button>`).join('');
      this.choicesEl.querySelectorAll<HTMLButtonElement>('button').forEach((b) =>
        b.addEventListener('click', () => {
          this.handlers.click();
          this.waitingChoice = false;
          const c = step.choice[Number(b.dataset.i)];
          this.queue = [...(SCRIPTS[c.next] ?? [])];
          this.choicesEl.innerHTML = '';
          this.next();
        }),
      );
    } else if ('fx' in step) {
      if (step.fx === 'fadeOut') this.fade.className = 'dlg-fade black';
      else if (step.fx === 'fadeIn') this.fade.className = 'dlg-fade';
      else if (step.fx === 'flash') {
        this.fade.className = 'dlg-fade white';
        window.setTimeout(() => (this.fade.className = this.fade.className.replace(' white', '')), 350);
      } else if (step.fx === 'shake') this.handlers.shake();
      window.setTimeout(() => this.next(), step.fx === 'flash' ? 400 : 250);
    } else if ('title' in step) {
      this.box.classList.remove('show');
      this.card.innerHTML = `<h2>${step.title}</h2>${step.sub ? `<p>${step.sub}</p>` : ''}`;
      this.card.classList.add('show');
    } else if ('set' in step) {
      this.handlers.set(step.set, step.v ?? 1);
      this.next();
    } else if ('run' in step) {
      this.handlers.run(step.run);
      this.next();
    }
  }

  private advance(): void {
    if (!this.active || this.waitingChoice) return;
    if (this.shown < this.fullText.length && this.box.classList.contains('show') && this.textEl.textContent !== this.fullText) {
      window.clearInterval(this.typing);
      this.shown = this.fullText.length;
      this.textEl.textContent = this.fullText;
      return;
    }
    this.handlers.click();
    this.next();
  }

  /** 선택지 전까지 나머지를 건너뛴다. 플래그와 명령은 그대로 실행한다 */
  private skip(): void {
    window.clearInterval(this.typing);
    while (this.queue.length) {
      const step = this.queue[0];
      if ('choice' in step) {
        this.next();
        return;
      }
      this.queue.shift();
      if ('set' in step) this.handlers.set(step.set, step.v ?? 1);
      if ('run' in step) this.handlers.run(step.run);
    }
    if (!this.waitingChoice) this.finish();
  }

  private finish(): void {
    window.clearInterval(this.typing);
    this.active = false;
    this.fullText = '';
    this.box.classList.remove('show');
    this.card.classList.remove('show');
    this.fade.className = 'dlg-fade';
    this.root.classList.add('hidden');
    const cb = this.onDone;
    this.onDone = null;
    cb?.();
  }
}
