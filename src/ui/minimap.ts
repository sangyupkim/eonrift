import { TILE } from '../config';
import { isFloor, type DungeonData } from '../dungeon/generator';

const REVEAL_RADIUS = 5;
/** 미니맵 마름모의 한 변에 들어가는 타일 수 (플레이어 중심) */
const VIEW_TILES = 30;

/**
 * 탐험한 곳만 보이는 미니맵.
 * 화면과 방향을 맞추려고 45° 돌린 마름모 모양으로 그린다 (조이스틱 위 = 미니맵 위).
 */
export class Minimap {
  readonly canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private explored: Uint8Array;
  private size = 0;

  constructor(private data: DungeonData) {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'minimap';
    this.ctx = this.canvas.getContext('2d')!;
    this.explored = new Uint8Array(data.width * data.height);
  }

  private resize(): void {
    const css = this.canvas.clientWidth || 140;
    const px = Math.round(css * Math.min(window.devicePixelRatio || 1, 2));
    if (px !== this.size) {
      this.size = px;
      this.canvas.width = this.canvas.height = px;
    }
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

  draw(
    player: { x: number; z: number; facing: number },
    markers: { x: number; z: number; color: string; size: number }[],
  ): void {
    this.resize();
    const { ctx, size, data } = this;
    const { width, height } = data;
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
    ctx.fillStyle = 'rgba(8, 10, 24, 0.6)';
    ctx.fill();
    ctx.lineWidth = Math.max(1, size / 110);
    ctx.strokeStyle = 'rgba(200, 210, 255, 0.35)';
    ctx.stroke();
    ctx.save();
    ctx.clip();

    // 플레이어를 가운데 두고 45° 돌린다
    const scale = (half * Math.SQRT2) / VIEW_TILES;
    ctx.translate(size / 2, size / 2);
    ctx.rotate(Math.PI / 4);
    ctx.scale(scale, scale);
    ctx.translate(-player.x / TILE, -player.z / TILE);

    ctx.fillStyle = 'rgba(210, 220, 240, 0.8)';
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (this.explored[y * width + x] && isFloor(data, x, y)) ctx.fillRect(x, y, 1.02, 1.02);
      }
    }

    for (const m of markers) {
      const tx = m.x / TILE;
      const ty = m.z / TILE;
      if (!this.explored[Math.floor(ty) * width + Math.floor(tx)]) continue;
      ctx.fillStyle = m.color;
      ctx.beginPath();
      ctx.arc(tx, ty, m.size, 0, Math.PI * 2);
      ctx.fill();
    }

    // 플레이어 화살표
    const px = player.x / TILE;
    const py = player.z / TILE;
    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(-player.facing);
    ctx.fillStyle = '#4fd1ff';
    ctx.strokeStyle = '#0b1a2a';
    ctx.lineWidth = 0.3;
    ctx.beginPath();
    ctx.moveTo(0, 1.4);
    ctx.lineTo(0.95, -0.9);
    ctx.lineTo(0, -0.4);
    ctx.lineTo(-0.95, -0.9);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.restore();
  }
}
