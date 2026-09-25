/**
 * Web Audio 효과음(즉석 합성)과 배경음(마을·던전·차원집은 sound/ 파일).
 * 브라우저 정책상 첫 터치 뒤에 켜진다.
 */
export class Audio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  /** 배경음·효과음 따로 조절 (0~1) */
  private musicBus: GainNode | null = null;
  private sfxBus: GainNode | null = null;
  musicVolume = 0.7;
  sfxVolume = 0.8;
  private music: { stop: () => void } | null = null;
  private musicKind = '';
  private noiseBuf: AudioBuffer | null = null;
  enabled = true;

  unlock(): void {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') void this.ctx.resume();
      return;
    }
    try {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new Ctor();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.enabled ? 0.5 : 0;
      this.master.connect(this.ctx.destination);
      this.musicBus = this.ctx.createGain();
      this.musicBus.gain.value = this.musicVolume;
      this.musicBus.connect(this.master);
      this.sfxBus = this.ctx.createGain();
      this.sfxBus.gain.value = this.sfxVolume;
      this.sfxBus.connect(this.master);
      const len = this.ctx.sampleRate;
      this.noiseBuf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const d = this.noiseBuf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      if (this.musicKind) this.playMusic(this.musicKind, true);
    } catch {
      this.ctx = null;
    }
  }

  /** 배경음 크기 (0~1) */
  setMusicVolume(v: number): void {
    this.musicVolume = Math.min(1, Math.max(0, v));
    if (this.musicBus && this.ctx) this.musicBus.gain.setTargetAtTime(this.musicVolume, this.ctx.currentTime, 0.05);
  }

  /** 효과음 크기 (0~1) */
  setSfxVolume(v: number): void {
    this.sfxVolume = Math.min(1, Math.max(0, v));
    if (this.sfxBus && this.ctx) this.sfxBus.gain.setTargetAtTime(this.sfxVolume, this.ctx.currentTime, 0.05);
  }

  setEnabled(on: boolean): void {
    this.enabled = on;
    if (this.master && this.ctx) this.master.gain.setTargetAtTime(on ? 0.5 : 0, this.ctx.currentTime, 0.05);
  }

  private tone(freq: number, dur: number, type: OscillatorType, vol: number, slideTo?: number, delay = 0): void {
    if (!this.ctx || !this.master) return;
    const t = this.ctx.currentTime + delay;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g).connect(this.sfxBus!);
    o.start(t);
    o.stop(t + dur + 0.02);
  }

  private noise(dur: number, vol: number, freq: number, q = 1, delay = 0): void {
    if (!this.ctx || !this.master || !this.noiseBuf) return;
    const t = this.ctx.currentTime + delay;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuf;
    const f = this.ctx.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.value = freq;
    f.Q.value = q;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.connect(f).connect(g).connect(this.sfxBus!);
    src.start(t, Math.random() * 0.5);
    src.stop(t + dur + 0.02);
  }

  /** 대화 글자 소리: 말하는 사람마다 음높이가 다른 짧은 '띠' 소리 */
  blip(pitch: number): void {
    if (!this.ctx || !this.enabled) return;
    const f = pitch * (0.94 + Math.random() * 0.12);
    this.tone(f, 0.05, 'square', 0.035, f * 0.85);
    this.tone(f * 2, 0.03, 'triangle', 0.02);
  }

  play(name: string): void {
    if (!this.ctx || !this.enabled) return;
    switch (name) {
      case 'swing':
        this.noise(0.12, 0.35, 1800, 0.8);
        break;
      case 'hit':
        this.noise(0.08, 0.5, 900, 1.2);
        this.tone(160, 0.1, 'square', 0.12, 80);
        break;
      case 'crit':
        this.noise(0.1, 0.5, 1200, 1);
        this.tone(520, 0.15, 'square', 0.12, 260);
        break;
      case 'gather':
        this.tone(700 + Math.random() * 200, 0.08, 'triangle', 0.2);
        this.noise(0.06, 0.25, 3000, 2);
        break;
      case 'pickup':
        this.tone(880, 0.08, 'sine', 0.15);
        this.tone(1320, 0.1, 'sine', 0.12, undefined, 0.06);
        break;
      case 'hurt':
        this.tone(220, 0.2, 'sawtooth', 0.2, 90);
        break;
      case 'dash':
        this.noise(0.2, 0.3, 700, 0.6);
        break;
      case 'magic':
        this.tone(600, 0.2, 'sine', 0.18, 1200);
        break;
      case 'bow':
        this.tone(300, 0.08, 'triangle', 0.2, 900);
        this.noise(0.1, 0.2, 2500, 1);
        break;
      case 'boom':
        this.noise(0.4, 0.6, 250, 0.7);
        this.tone(90, 0.35, 'sine', 0.3, 40);
        break;
      case 'slam':
        this.noise(0.3, 0.5, 300, 0.7);
        this.tone(70, 0.3, 'sine', 0.35, 35);
        break;
      case 'ice':
        this.tone(1400, 0.3, 'triangle', 0.12, 700);
        this.noise(0.3, 0.2, 5000, 2);
        break;
      case 'zap':
        this.noise(0.18, 0.4, 3500, 0.5);
        this.tone(1000, 0.15, 'sawtooth', 0.1, 300);
        break;
      case 'kill':
        this.tone(330, 0.1, 'square', 0.1, 200);
        this.noise(0.15, 0.3, 600, 1);
        break;
      case 'level':
        [523, 659, 784, 1047].forEach((f, i) => this.tone(f, 0.25, 'triangle', 0.18, undefined, i * 0.09));
        break;
      case 'portal':
        this.tone(200, 0.6, 'sine', 0.2, 800);
        this.tone(300, 0.6, 'sine', 0.12, 1200, 0.1);
        break;
      case 'click':
        this.tone(1200, 0.04, 'square', 0.06);
        break;
      case 'coin':
        this.tone(1320, 0.07, 'square', 0.08);
        this.tone(1760, 0.12, 'square', 0.08, undefined, 0.06);
        break;
      case 'build':
        this.tone(440, 0.06, 'square', 0.08);
        this.noise(0.08, 0.2, 1500, 1);
        break;
      case 'stone':
        [392, 523, 659, 784, 1047, 1319].forEach((f, i) => this.tone(f, 0.5, 'sine', 0.14, undefined, i * 0.1));
        break;
      case 'fall':
        this.tone(400, 1, 'sawtooth', 0.15, 60);
        break;
    }
  }

  /** 파일로 된 배경음 (sound/ 폴더, CC BY 4.0 · orangefreesounds.com) */
  private static readonly FILES: Record<string, string | string[]> = {
    dungeon: 'sound/dungeon.mp3',
    // 여러 곡을 넣으면 번갈아 튼다 (들어올 때마다, 오래 머물면 몇 분마다 바뀐다)
    village: 'sound/village2.mp3',
    home: 'sound/home.mp3',
    boss: 'sound/boss.mp3',
  };
  /** 여러 곡인 장소: 다음에 틀 곡 번호 */
  private rotation: Record<string, number> = {};
  private rotateTimer = 0;
  /** 여러 곡인 장소에서 다음 곡으로 넘어가기까지 (ms) */
  private static readonly ROTATE_MS = 150_000;
  private buffers = new Map<string, Promise<AudioBuffer | null>>();

  private loadBuffer(url: string): Promise<AudioBuffer | null> {
    let p = this.buffers.get(url);
    if (!p) {
      const ctx = this.ctx!;
      p = fetch(url)
        .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error(url))))
        .then((b) => new Promise<AudioBuffer>((res, rej) => ctx.decodeAudioData(b, res, rej)))
        .catch(() => null);
      this.buffers.set(url, p);
    }
    return p;
  }

  /** 파일 배경음을 끊김 없이 반복 재생한다. 파일을 못 읽으면 합성 배경음으로 */
  private playFile(kind: string, url: string): void {
    const ctx = this.ctx!;
    const out = ctx.createGain();
    out.gain.value = 0;
    out.connect(this.musicBus!);
    let src: AudioBufferSourceNode | null = null;
    let stopped = false;
    this.music = {
      stop: () => {
        stopped = true;
        out.gain.setTargetAtTime(0, ctx.currentTime, 0.4);
        window.setTimeout(() => {
          src?.stop();
          out.disconnect();
        }, 2000);
      },
    };
    void this.loadBuffer(url).then((buf) => {
      if (stopped || this.musicKind !== kind) return;
      if (!buf) {
        this.music = null;
        this.playSynth(kind);
        return;
      }
      src = ctx.createBufferSource();
      src.buffer = buf;
      src.loop = true;
      // MP3 앞뒤에 붙는 짧은 무음을 건너뛰어 이음새를 줄인다
      src.loopStart = Math.min(0.03, buf.duration / 4);
      src.loopEnd = Math.max(src.loopStart + 0.1, buf.duration - 0.03);
      src.connect(out);
      src.start(0, src.loopStart);
      out.gain.setTargetAtTime(0.55, ctx.currentTime, 0.6);
    });
  }

  /** 장소별 배경음 (마을·던전·차원집·보스전은 파일, 파일을 못 읽으면 합성음) */
  playMusic(kind: string, force = false): void {
    if (this.musicKind === kind && !force) return;
    this.musicKind = kind;
    this.music?.stop();
    this.music = null;
    window.clearTimeout(this.rotateTimer);
    if (!this.ctx || !this.master) return;
    const file = Audio.FILES[kind];
    if (Array.isArray(file)) {
      const i = (this.rotation[kind] ?? 0) % file.length;
      this.rotation[kind] = i + 1;
      // 한동안 틀고 나면 다음 곡으로 (서서히 바뀐다)
      this.rotateTimer = window.setTimeout(() => {
        if (this.musicKind === kind) this.playMusic(kind, true);
      }, Audio.ROTATE_MS);
      return this.playFile(kind, file[i]);
    }
    if (file) return this.playFile(kind, file);
    this.playSynth(kind);
  }

  /** 합성 배경음: 느린 화음 반복 */
  private playSynth(kind: string): void {
    if (!this.ctx || !this.master) return;
    const ctx = this.ctx;
    const out = ctx.createGain();
    out.gain.value = 0.07;
    out.connect(this.musicBus!);
    const chords: Record<string, number[][]> = {
      village: [
        [261.6, 329.6, 392],
        [220, 261.6, 329.6],
        [174.6, 220, 261.6],
        [196, 246.9, 293.7],
      ],
      dungeon: [
        [110, 130.8, 164.8],
        [98, 116.5, 146.8],
        [103.8, 123.5, 155.6],
        [92.5, 110, 138.6],
      ],
      home: [
        [196, 246.9, 293.7],
        [220, 277.2, 329.6],
        [246.9, 293.7, 370],
        [220, 277.2, 329.6],
      ],
      boss: [
        [82.4, 98, 123.5],
        [87.3, 103.8, 130.8],
      ],
    };
    const prog = chords[kind] ?? chords.village;
    let step = 0;
    let stopped = false;
    const len = kind === 'boss' ? 1.6 : 3.2;
    const playChord = () => {
      if (stopped) return;
      const t = ctx.currentTime;
      for (const f of prog[step % prog.length]) {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = kind === 'boss' ? 'sawtooth' : 'triangle';
        o.frequency.value = f;
        g.gain.setValueAtTime(0.001, t);
        g.gain.linearRampToValueAtTime(kind === 'boss' ? 0.25 : 0.5, t + 0.6);
        g.gain.linearRampToValueAtTime(0.001, t + len);
        o.connect(g).connect(out);
        o.start(t);
        o.stop(t + len + 0.1);
      }
      step++;
    };
    playChord();
    const id = window.setInterval(playChord, len * 1000 - 100);
    this.music = {
      stop: () => {
        stopped = true;
        window.clearInterval(id);
        out.gain.setTargetAtTime(0, ctx.currentTime, 0.3);
        window.setTimeout(() => out.disconnect(), 1500);
      },
    };
  }
}
