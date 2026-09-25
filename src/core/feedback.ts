/**
 * 의견함: 게임 안에서 쓴 의견을 구글 스프레드시트(앱스 스크립트 웹 앱)로 보낸다.
 * 한 사람당 10분에 한 번, 500자까지.
 */
export const FEEDBACK_URL = 'https://script.google.com/macros/s/AKfycby9zIAgmZNELF9DZDwPFXYCxCN4hxEJ83JvFjEY4kZxvCDVniIhVMAKh-7coyxoHOqP/exec';
export const FEEDBACK_MAX = 500;
export const FEEDBACK_NAME_MAX = 20;
export const FEEDBACK_COOLDOWN_MS = 10 * 60 * 1000;
export const FEEDBACK_KINDS = ['버그', '밸런스', '건의', '칭찬', '기타'] as const;

const LAST_KEY = 'nonamerpg-feedback-last';
const NAME_KEY = 'nonamerpg-feedback-name';
const ID_KEY = 'nonamerpg-feedback-id';

const get = (k: string): string | null => {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
};
const set = (k: string, v: string): void => {
  try {
    localStorage.setItem(k, v);
  } catch {
    /* 저장이 막힌 브라우저 */
  }
};

/** 다음에 보낼 수 있을 때까지 남은 시간 (ms, 0이면 지금 가능) */
export function feedbackWait(now = Date.now()): number {
  const last = Number(get(LAST_KEY) ?? 0);
  return Math.max(0, last + FEEDBACK_COOLDOWN_MS - now);
}

export const savedFeedbackName = (): string => get(NAME_KEY) ?? '';

/** 기기마다 정해진 익명 번호 (시트 쪽 도배 방지용) */
function playerId(): string {
  let id = get(ID_KEY);
  if (!id) {
    id = Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
    set(ID_KEY, id);
  }
  return id;
}

export function deviceLabel(): string {
  const mobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) || navigator.maxTouchPoints > 1;
  return `${mobile ? '모바일' : 'PC'} ${window.innerWidth}×${window.innerHeight}`;
}

export interface FeedbackInfo {
  version: string;
  cls?: string;
  progress?: string;
}

/** 보내기. 성공하면 true (보낸 시각을 기억해 10분 동안 막는다) */
export async function sendFeedback(kind: string, name: string, message: string, info: FeedbackInfo): Promise<boolean> {
  const body = JSON.stringify({
    kind,
    name: name.slice(0, FEEDBACK_NAME_MAX),
    message: message.slice(0, FEEDBACK_MAX),
    version: info.version,
    cls: info.cls ?? '',
    progress: info.progress ?? '',
    device: deviceLabel(),
    player: playerId(),
  });
  // text/plain 이면 브라우저가 사전 확인 없이 바로 보낸다 (앱스 스크립트는 사전 확인을 받지 못한다)
  const init: RequestInit = { method: 'POST', body, headers: { 'Content-Type': 'text/plain;charset=utf-8' } };
  let ok = false;
  try {
    const res = await fetch(FEEDBACK_URL, init);
    const j = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
    // 응답을 못 읽었어도 요청 자체는 갔다
    ok = res.ok && (j?.ok ?? true);
    if (j?.error === 'too_fast') ok = true;
  } catch {
    // 응답을 읽지 못하게 막힌 경우: 답을 보지 않는 방식으로 한 번 더 보낸다 (중복은 시트 쪽에서 막는다)
    try {
      await fetch(FEEDBACK_URL, { ...init, mode: 'no-cors' });
      ok = true;
    } catch {
      ok = false;
    }
  }
  if (ok) {
    set(LAST_KEY, String(Date.now()));
    set(NAME_KEY, name);
  }
  return ok;
}
