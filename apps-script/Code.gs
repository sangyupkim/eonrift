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
    if (p.action === 'trial') return out(trialBoard(String(p.week || ''), String(p.player || '')));
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

// ---------------- 주간 시련 순위 ----------------
// 열: 주 | 기기 | 이름 | 직업 | 레벨 | 점수 | 기록 | 걸린 시간(초) | 보스 | 버전 | 올린 시각
function rankSheet() {
  const ss = book();
  const sh = ss.getSheetByName(RANK_SHEET) || ss.insertSheet(RANK_SHEET);
  if (sh.getLastRow() === 0) {
    sh.appendRow(['주', '기기', '이름', '직업', '레벨', '점수', '기록', '걸린 시간(초)', '보스', '버전', '올린 시각']);
    sh.setFrozenRows(1);
  }
  return sh;
}

function trialSubmit(d) {
  const week = String(d.week || '');
  const player = String(d.player || '').slice(0, 60);
  const name = String(d.name || '').trim().slice(0, 12);
  const score = Math.floor(Number(d.score));
  const seconds = Math.floor(Number(d.seconds));
  if (!/^\d{4}-W\d{2}$/.test(week) || !player || !name) return { ok: false, error: 'bad_data' };
  if (!(score >= 0 && score <= 10000 + TRIAL_TIME * 10) || !(seconds >= 0 && seconds <= TRIAL_TIME)) return { ok: false, error: 'bad_score' };
  if (Number(d.check) !== hashStr(week + '|' + player + '|' + score + '|' + seconds) % 1000003) return { ok: false, error: 'bad_check' };
  const cache = CacheService.getScriptCache();
  const key = 't_' + player;
  if (cache.get(key)) return { ok: false, error: 'too_fast' };
  cache.put(key, '1', 10);

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sh = rankSheet();
    const rows = sh.getLastRow() > 1 ? sh.getRange(2, 1, sh.getLastRow() - 1, 6).getValues() : [];
    const row = [week, player, safe(name, 12), safe(d.cls, 10), Number(d.level) || 1, score, scoreText(score), seconds, safe(d.boss, 20), safe(d.version, 10), new Date()];
    for (let i = 0; i < rows.length; i++) {
      if (String(rows[i][0]) === week && String(rows[i][1]) === player) {
        // 같은 주·같은 기기: 더 좋은 기록일 때만 바꾸고, 이름은 늘 새로
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

function trialBoard(week, player) {
  if (!/^\d{4}-W\d{2}$/.test(week)) return { ok: false, error: 'bad_week' };
  const sh = rankSheet();
  if (sh.getLastRow() <= 1) return { ok: true, rows: [] };
  const rows = sh
    .getRange(2, 1, sh.getLastRow() - 1, 8)
    .getValues()
    .filter((r) => String(r[0]) === week)
    .map((r) => ({ name: String(r[2]).replace(/^'/, ''), cls: String(r[3]), level: Number(r[4]) || 1, score: Number(r[5]) || 0, seconds: Number(r[7]) || 0, me: String(r[1]) === player }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 50);
  return { ok: true, rows };
}
