// Eon Rift 의견함 + 주간 시련 순위 (구글 앱스 스크립트)
// 스프레드시트 주소의 /d/ 와 /edit 사이 긴 문자열 (시트에서 만든 스크립트면 비워 둬도 됨)
const SPREADSHEET_ID = '';
const SHEET_NAME = '의견';
const RANK_SHEET = '시련 순위';
const MAX_LEN = 500;
const FEEDBACK_COOLDOWN = 30; // 초
const TRIAL_TIME = 180; // 게임의 시련 시간과 같아야 함

function book() {
  return SPREADSHEET_ID ? SpreadsheetApp.openById(SPREADSHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();
}

function out(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

const safe = (v, n) => {
  v = String(v ?? '').slice(0, n || MAX_LEN);
  return /^[=+\-@]/.test(v) ? "'" + v : v;
};

// 게임과 같은 해시 (기록 위조를 어렵게)
function hashStr(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

function scoreText(score) {
  if (score >= 10000) {
    const t = Math.max(0, Math.round(TRIAL_TIME - (score - 10000) / 10));
    return '처치 ' + Math.floor(t / 60) + ':' + String(t % 60).padStart(2, '0');
  }
  return (score / 100).toFixed(2) + '%';
}

// 주소를 열면 연결 상태, ?action=trial&week=… 이면 그 주 순위
function doGet(e) {
  try {
    const p = (e && e.parameter) || {};
    if (p.action === 'trial') return out(trialBoard(String(p.week || ''), String(p.player || ''), String(p.board || 'trial')));
    return out({ ok: true, sheet: book().getName() });
  } catch (err) {
    return out({ ok: false, error: String(err) });
  }
}

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents || '{}');
    if (d.type === 'trial') return out(trialSubmit(d));
    return out(feedback(d));
  } catch (err) {
    return out({ ok: false, error: String(err) });
  }
}

// ---------------- 의견 ----------------
function feedback(d) {
  const text = String(d.message || '').trim().slice(0, MAX_LEN);
  if (!text) return { ok: false, error: 'empty' };
  const cache = CacheService.getScriptCache();
  const key = 'u_' + String(d.player || 'anon').slice(0, 60);
  if (cache.get(key)) return { ok: false, error: 'too_fast' };
  cache.put(key, '1', FEEDBACK_COOLDOWN);
  const ss = book();
  const sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0) {
    sh.appendRow(['받은 시각', '종류', '의견', '닉네임', '버전', '직업·레벨', '진행도', '기기']);
    sh.setFrozenRows(1);
  }
  sh.appendRow([new Date(), safe(d.kind), safe(text), safe(d.name), safe(d.version), safe(d.cls), safe(d.progress), safe(d.device)]);
  return { ok: true };
}

// ---------------- 순위 (v10: 일일 차원 시련 · 주간 차원 레이드 · 무한 러쉬) ----------------
// 열: 날짜/주 | 기기 | 이름 | 직업 | 레벨 | 점수 | 기록 | 걸린 시간(초) | 보스 | 버전 | 올린 시각
// 순위표마다 시트가 따로 있다. 예전(주간 시련) 기록은 '시련 순위' 시트에 그대로 남는다.
const BOARDS = {
  trial: { sheet: RANK_SHEET, maxScore: 10000 + TRIAL_TIME * 10, maxSec: TRIAL_TIME, text: scoreText },
  raid: { sheet: '레이드 순위', maxScore: 10000 + 300 * 10, maxSec: 300, text: (sc) => (sc >= 10000 ? '처치 ' + fmt(300 - (sc - 10000) / 10) : (sc / 100).toFixed(2) + '%') },
  horde: { sheet: '무한 러쉬 순위', maxScore: 1000000, maxSec: 36000, text: (sc) => sc + '마리' },
};

function fmt(t) {
  t = Math.max(0, Math.round(t));
  return Math.floor(t / 60) + ':' + String(t % 60).padStart(2, '0');
}

function boardOf(name) {
  return BOARDS[name] || BOARDS.trial;
}

function rankSheet(board) {
  const ss = book();
  const name = boardOf(board).sheet;
  const sh = ss.getSheetByName(name) || ss.insertSheet(name);
  if (sh.getLastRow() === 0) {
    sh.appendRow(['날짜/주', '기기', '이름', '직업', '레벨', '점수', '기록', '걸린 시간(초)', '보스', '버전', '올린 시각']);
    sh.setFrozenRows(1);
  }
  return sh;
}

// 주 키(2026-W39) 또는 날짜 키(2026-09-26)
const KEY_RE = /^\d{4}-(W\d{2}|\d{2}-\d{2})$/;

function trialSubmit(d) {
  const board = String(d.board || 'trial');
  const B = boardOf(board);
  const week = String(d.week || '');
  const player = String(d.player || '').slice(0, 60);
  const name = String(d.name || '').trim().slice(0, 12);
  const score = Math.floor(Number(d.score));
  const seconds = Math.floor(Number(d.seconds));
  if (!KEY_RE.test(week) || !player || !name) return { ok: false, error: 'bad_data' };
  if (!(score >= 0 && score <= B.maxScore) || !(seconds >= 0 && seconds <= B.maxSec)) return { ok: false, error: 'bad_score' };
  if (Number(d.check) !== hashStr(week + '|' + player + '|' + score + '|' + seconds) % 1000003) return { ok: false, error: 'bad_check' };
  const cache = CacheService.getScriptCache();
  const key = 't_' + board + '_' + player;
  if (cache.get(key)) return { ok: false, error: 'too_fast' };
  cache.put(key, '1', 10);

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sh = rankSheet(board);
    const rows = sh.getLastRow() > 1 ? sh.getRange(2, 1, sh.getLastRow() - 1, 6).getValues() : [];
    // 날짜 키는 시트가 날짜로 바꾸지 않게 글자로 넣는다
    const row = ["'" + week, player, safe(name, 12), safe(d.cls, 10), Number(d.level) || 1, score, B.text(score), seconds, safe(d.boss, 20), safe(d.version, 10), new Date()];
    for (let i = 0; i < rows.length; i++) {
      if (keyOf(rows[i][0]) === week && String(rows[i][1]) === player) {
        // 같은 날(주)·같은 기기: 더 좋은 기록일 때만 바꾸고, 이름은 늘 새로
        if (score > Number(rows[i][5])) sh.getRange(i + 2, 1, 1, row.length).setValues([row]);
        else sh.getRange(i + 2, 3).setValue(row[2]);
        return { ok: true };
      }
    }
    sh.appendRow(row);
    return { ok: true };
  } finally {
    lock.releaseLock();
  }
}

function trialBoard(week, player, board) {
  if (!KEY_RE.test(week)) return { ok: false, error: 'bad_week' };
  const sh = rankSheet(board);
  if (sh.getLastRow() <= 1) return { ok: true, rows: [] };
  const rows = sh
    .getRange(2, 1, sh.getLastRow() - 1, 8)
    .getValues()
    // 시트가 날짜 칸을 날짜로 바꿔 버린 경우도 같은 키로 본다
    .filter((r) => keyOf(r[0]) === week)
    .map((r) => ({ name: String(r[2]).replace(/^'/, ''), cls: String(r[3]), level: Number(r[4]) || 1, score: Number(r[5]) || 0, seconds: Number(r[7]) || 0, me: String(r[1]) === player }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 50);
  return { ok: true, rows };
}

function keyOf(v) {
  if (v instanceof Date) return Utilities.formatDate(v, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  return String(v);
}
