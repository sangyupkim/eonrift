import { FEEDBACK_URL } from './feedback';

/**
 * 주간 시련 순위: 의견함과 같은 앱스 스크립트 웹 앱으로 기록을 올리고, 이번 주 순위를 받아 온다.
 * 기기마다 한 줄(그 주 최고 기록)만 남는다. 이름은 의견함 닉네임과 함께 쓴다.
 */
const NAME_KEY = 'nonamerpg-feedback-name';
const ID_KEY = 'nonamerpg-feedback-id';

export const NICK_MAX = 12;

/** 닉네임 다듬기: 앞뒤 빈칸·꺾쇠를 빼고 12자까지. 비면 빈 문자열 */
export function cleanNickname(v: string): string {
  return v.replace(/[<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, NICK_MAX);
}

function store(k: string, v?: string): string | null {
  try {
    if (v !== undefined) localStorage.setItem(k, v);
    return localStorage.getItem(k);
  } catch {
    return null;
  }
}

/** 의견함 이름 칸(타이틀 화면)에도 닉네임이 들어가게 기억해 둔다 */
export const rememberNickname = (n: string): void => void store(NAME_KEY, n.slice(0, NICK_MAX));

/** 의견함과 같은 기기 번호 (없으면 만든다) */
export function deviceId(): string {
  let id = store(ID_KEY);
  if (!id) id = store(ID_KEY, Math.random().toString(36).slice(2, 10) + Date.now().toString(36));
  return id ?? 'anon';
}

function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

export interface TrialEntry {
  week: string;
  name: string;
  cls: string;
  level: number;
  score: number;
  seconds: number;
  boss: string;
  version: string;
}

export interface BoardRow {
  name: string;
  cls: string;
  level: number;
  score: number;
  seconds: number;
  me?: boolean;
}

/** 기록 올리기. 이번 주 내 기록보다 좋을 때만 시트가 바꾼다 */
export async function submitTrial(e: TrialEntry): Promise<{ ok: boolean; reason?: string }> {
  const player = deviceId();
  const body = JSON.stringify({ type: 'trial', ...e, player, check: hashStr(`${e.week}|${player}|${e.score}|${e.seconds}`) % 1000003 });
  try {
    const res = await fetch(FEEDBACK_URL, { method: 'POST', body, headers: { 'Content-Type': 'text/plain;charset=utf-8' }, redirect: 'follow' });
    const j = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
    if (j?.ok) return { ok: true };
    if (j?.error === 'too_fast') return { ok: false, reason: '잠시 뒤에 다시 올려 주세요' };
    if (j?.error === 'unknown_type' || j?.error === 'empty') return { ok: false, reason: '시트 스크립트가 순위를 아직 모릅니다 (스크립트 업데이트 필요)' };
    return { ok: false, reason: j?.error ?? `HTTP ${res.status}` };
  } catch (err) {
    return { ok: false, reason: `연결 실패 (${String((err as Error)?.message ?? err)})` };
  }
}

/** 이번 주 순위 (위에서부터 최대 50명) */
export async function fetchBoard(week: string): Promise<{ ok: true; rows: BoardRow[] } | { ok: false; reason: string }> {
  try {
    const res = await fetch(`${FEEDBACK_URL}?action=trial&week=${encodeURIComponent(week)}&player=${encodeURIComponent(deviceId())}`, { redirect: 'follow' });
    const j = (await res.json().catch(() => null)) as { ok?: boolean; rows?: BoardRow[]; error?: string } | null;
    if (j?.ok && Array.isArray(j.rows)) return { ok: true, rows: j.rows };
    if (j?.ok) return { ok: false, reason: '시트 스크립트가 순위를 아직 모릅니다 (스크립트 업데이트 필요)' };
    return { ok: false, reason: j?.error ?? `HTTP ${res.status}` };
  } catch (err) {
    return { ok: false, reason: `연결 실패 (${String((err as Error)?.message ?? err)})` };
  }
}
