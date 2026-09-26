import type { Action } from './input';

/**
 * 조작 설정 (기기마다 브라우저에 저장).
 * PC: 키보드 이동 또는 마우스 클릭 이동, 모든 키 바꾸기. 모바일: 버튼 위치·크기.
 */
export type MoveDir = 'up' | 'down' | 'left' | 'right';
export type Bindable = MoveDir | Action;

export interface Controls {
  /** 이동: 키보드(WASD 등) 또는 마우스 클릭 */
  moveMode: 'keys' | 'mouse';
  /** 마우스 이동에 쓰는 버튼 (다른 쪽 버튼이 공격) */
  moveButton: 'left' | 'right';
  /** 마우스 클릭으로 기본 공격 */
  mouseAttack: boolean;
  keys: Record<Bindable, string>;
  /** 모바일 버튼 배치: 버튼 id → 옮긴 거리(px)와 크기 배율 */
  layout: Record<string, { dx: number; dy: number; scale: number }>;
}

export const DEFAULT_KEYS: Record<Bindable, string> = {
  up: 'w',
  down: 's',
  left: 'a',
  right: 'd',
  attack: 'j',
  dodge: ' ',
  interact: 'e',
  skill1: '1',
  skill2: '2',
  skill3: '3',
  ult: 'f',
  potion: 'q',
  bag: 'i',
  char: 'c',
  map: 'm',
  recipes: 'r',
  build: 'b',
  warp: 'g',
  pause: 'escape',
};

/** 설정 화면에 보이는 순서와 이름 */
export const BIND_LIST: { id: Bindable; name: string }[] = [
  { id: 'up', name: '위로 이동' },
  { id: 'down', name: '아래로 이동' },
  { id: 'left', name: '왼쪽 이동' },
  { id: 'right', name: '오른쪽 이동' },
  { id: 'attack', name: '기본 공격' },
  { id: 'dodge', name: '회피' },
  { id: 'interact', name: '상호작용' },
  { id: 'skill1', name: '스킬 1' },
  { id: 'skill2', name: '스킬 2' },
  { id: 'skill3', name: '스킬 3' },
  { id: 'ult', name: '궁극기' },
  { id: 'potion', name: '물약' },
  { id: 'bag', name: '가방' },
  { id: 'char', name: '캐릭터' },
  { id: 'map', name: '큰 지도' },
  { id: 'recipes', name: '레시피 (차원집)' },
  { id: 'build', name: '건설 (차원집)' },
  { id: 'warp', name: '워프 게이트' },
  { id: 'pause', name: '메뉴' },
];

const STORE = 'eonrift-controls';

export function defaultControls(): Controls {
  return { moveMode: 'keys', moveButton: 'right', mouseAttack: true, keys: { ...DEFAULT_KEYS }, layout: {} };
}

export function loadControls(): Controls {
  const d = defaultControls();
  try {
    const raw = localStorage.getItem(STORE);
    if (!raw) return d;
    const c = JSON.parse(raw) as Partial<Controls>;
    return {
      moveMode: c.moveMode === 'mouse' ? 'mouse' : 'keys',
      moveButton: c.moveButton === 'left' ? 'left' : 'right',
      mouseAttack: c.mouseAttack !== false,
      keys: { ...d.keys, ...(c.keys ?? {}) },
      layout: c.layout ?? {},
    };
  } catch {
    return d;
  }
}

export function saveControls(c: Controls): void {
  try {
    localStorage.setItem(STORE, JSON.stringify(c));
  } catch {
    /* 저장이 막힌 브라우저: 이번 판에만 쓴다 */
  }
}

/** 키 이름을 보기 좋게 */
export function keyLabel(k: string): string {
  if (k === ' ') return 'Space';
  if (k === 'escape') return 'Esc';
  if (k.startsWith('arrow')) return { arrowup: '↑', arrowdown: '↓', arrowleft: '←', arrowright: '→' }[k] ?? k;
  if (k === 'mouse0') return '마우스 왼쪽';
  if (k === 'mouse2') return '마우스 오른쪽';
  return k.length === 1 ? k.toUpperCase() : k[0].toUpperCase() + k.slice(1);
}
