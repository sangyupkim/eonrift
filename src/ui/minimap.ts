import { TILE } from '../config';
import { isFloor, type DungeonData } from '../dungeon/generator';

const REVEAL_RADIUS = 5;
/** 작은 미니맵 마름모의 한 변에 들어가는 타일 수 (플레이어 중심) */
const VIEW_TILES = 30;

export interface MapMarker {
  x: number;
  z: number;
  color: string;
  size: number;
  /** 어두운 테두리 (몬스터 점) */
  outline?: boolean;
  label?: string;
}

/**
 * 미니맵. 던전은 탐험한 곳만 보이고, 마을과 차원집은 처음부터 다 보인다.
 * 화면과 방향을 맞추려고 45° 돌린 마름모 모양으로 그린다 (조이스틱 위 = 미니맵 위).
 */
export class Minimap {
  readonly canvas: HTMLCanvasElement;
  readonly bigCanvas: HTMLCanvasElement;
  private explored: Uint8Array;

  constructor(
    private data: DungeonData,
    fog: boolean,
  ) {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'minimap';
    this.bigCanvas = document.createElement('canvas');
    this.bigCanvas.className = 'bigmap';
    this.explored = new Uint8Array(data.width * data.height).fill(fog ? 0 : 1);
  }

  private fit(canvas: HTMLCanvasElement): number {
    const css = canvas.clientWidth || 140;
    const px = Math.round(css * Math.min(window.devicePixelRatio || 1, 2));
    if (canvas.width !== px) canvas.width = canvas.height = px;
    return px;
  }

  /** 플레이어 주변과, 들어간 방 전체를 밝힌다 */
  reveal(wx: number, wz: number): void {
    const { width, height, roomIndex, rooms } = this.data;
    const tx = Math.floor(wx / TILE);
    const ty = Math.floor(wz / TILE);
    for (let y = ty - REVEAL_RADIUS; y <= ty + REVEAL_RADIUS; y++) {
      for (let x = tx - REVEAL_RADIUS; x <= tx + REVEAL_RADIUS; x++) {
        if (x < 0 || y < 0 || x >= width || y >= height) continue;
        if ((x - tx) ** 2 + (y - ty) ** 2 <= REVEAL_RADIUS ** 2) this.explored[y * width + x] = 1;
      }
    }
    const room = tx >= 0 && ty >= 0 && tx < width && ty < height ? roomIndex[ty * width + tx] : -1;
    if (room >= 0) {
      const r = rooms[room];
      for (let y = r.y - 1; y <= r.y + r.h; y++) {
        for (let x = r.x - 1; x <= r.x + r.w; x++) this.explored[y * width + x] = 1;
      }
    }
  }

  isExplored(tx: number, ty: number): boolean {
    return this.explored[ty * this.data.width + tx] === 1;
  }

  draw(player: { x: number; z: number; facing: number }, markers: MapMarker[], big = false): void {
    const canvas = big ? this.bigCanvas : this.canvas;
    const size = this.fit(canvas);
    const ctx = canvas.getContext('2d')!;
    const { width, height } = this.data;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, size, size);

    // 배경 마름모
    const half = size / 2 - 2;
    ctx.beginPath();
    ctx.moveTo(size / 2, 2);
    ctx.lineTo(size - 2, size / 2);
    ctx.lineTo(size / 2, size - 2);
    ctx.lineTo(2, size / 2);
    ctx.closePath();
    ctx.fillStyle = big ? 'rgba(8, 10, 24, 0.85)' : 'rgba(8, 10, 24, 0.6)';
    ctx.fill();
    ctx.lineWidth = Math.max(1, size / 110);
    ctx.strokeStyle = 'rgba(200, 210, 255, 0.35)';
    ctx.stroke();
    ctx.save();
    ctx.clip();

    // 작은 지도는 플레이어 중심, 큰 지도는 맵 전체
    const view = big ? (width + height) * 0.72 : VIEW_TILES;
    const cx = big ? width / 2 : player.x / TILE;
    const cy = big ? height / 2 : player.z / TILE;
    const scale = (half * Math.SQRT2) / view;
    ctx.translate(size / 2, size / 2);
    ctx.rotate(Math.PI / 4);
    ctx.scale(scale, scale);
    ctx.translate(-cx, -cy);

    ctx.fillStyle = 'rgba(210, 220, 240, 0.8)';
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (this.explored[y * width + x] && isFloor(this.data, x, y)) ctx.fillRect(x, y, 1.02, 1.02);
      }
    }

    const labels: { x: number; y: number; text: string }[] = [];
    for (const m of markers) {
      const tx = m.x / TILE;
      const ty = m.z / TILE;
      if (!this.explored[Math.floor(ty) * width + Math.floor(tx)]) continue;
      ctx.fillStyle = m.color;
      ctx.beginPath();
      ctx.arc(tx, ty, m.size * (big ? 1.2 : 1), 0, Math.PI * 2);
      ctx.fill();
      if (m.outline) {
        ctx.strokeStyle = 'rgba(40, 0, 0, 0.9)';
        ctx.lineWidth = 0.25;
        ctx.stroke();
      }
      if (big && m.label) labels.push({ x: tx, y: ty, text: m.label });
    }

    const px = player.x / TILE;
    const py = player.z / TILE;
    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(-player.facing);
    const k = big ? 1.4 : 1;
    ctx.fillStyle = '#4fd1ff';
    ctx.strokeStyle = '#0b1a2a';
    ctx.lineWidth = 0.3;
    ctx.beginPath();
    ctx.moveTo(0, 1.4 * k);
    ctx.lineTo(0.95 * k, -0.9 * k);
    ctx.lineTo(0, -0.4 * k);
    ctx.lineTo(-0.95 * k, -0.9 * k);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // 이름표는 회전하지 않은 화면 좌표로 쓴다
    const m = ctx.getTransform();
    ctx.restore();
    if (labels.length) {
      ctx.font = `${Math.round(size / 40)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillStyle = '#fff';
      ctx.strokeStyle = 'rgba(0,0,0,0.8)';
      ctx.lineWidth = 3;
      for (const l of labels) {
        const sx = m.a * l.x + m.c * l.y + m.e;
        const sy = m.b * l.x + m.d * l.y + m.f;
        ctx.strokeText(l.text, sx, sy - size / 50);
        ctx.fillText(l.text, sx, sy - size / 50);
      }
    }
  }
}
