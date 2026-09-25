import { BUILD_ID, GAME_VERSION } from '../config';
import { PATCH_NOTES } from '../data/patchnotes';
import { applyUpdate, fetchRemoteVersion, isNewer, type RemoteVersion } from './update';
import { CLASSES, CLASS_ORDER, expToNext, MAX_LEVEL, MAX_SKILL_LEVEL, SKILL_LEARN, skillUpgradeCost, STAT_INFO, STAT_KEYS, MAX_ULT_LEVEL, ultCooldown, ultPower, ULTIMATES, type ClassId, type StatKey } from '../data/classes';
import { ultUpgradeCost } from '../data/ultUpgrade';
import { TOOL_KIND_NAMES, TOOL_TIER_NAMES, toolBonusChance, toolEnhanceCost, toolMaxDur, toolName, toolRepair, toolSpeed, type ToolKind, type ToolState } from '../data/tools';
import { equipCraftCost, equipManaCraftCost, MANA_PLATE_OF, manaPlateCraftCost, plateCraftCost, toolCraftCost, workbenchUpgradeCost, type CraftCost } from '../data/crafting';
import { durability, EQUIP_SLOTS, EQUIP_MAX_DUR, enhanceCost, repairCost, type EquipSlot, equipName, equipStats, equipValue, GRADES, slotName, type Equip } from '../data/equipment';
import { BUILDINGS, BUILD_ORDER, buildingUpgradeCost, ESSENCE_BOOST, ESSENCE_BURN, FACTORY_SIZES, generatorPower, levelSpeed, MAX_BUILDING_LEVEL, RECIPES, UPGRADABLE, upgradeBlueprintCost, type BuildingType } from '../data/factory';
import { ITEMS, ITEM_LIST, ORE_TIERS, TIER_PLATE, WOOD_TIERS } from '../data/items';
import type { QuestDef } from '../data/quests';
import { THEMES } from '../data/themes';
import { canEnqueue, enqueueJob, WORKBENCH_OUT_MAX, WORKBENCH_QUEUE_MAX, BOX_CAPACITY, boxTotal, ESSENCES, MACHINE_TYPES, RECIPE_BY_ID, recipesFor, type BuildingState, type Factory, type WorkJob } from '../factory/sim';
import type { Bag, Slot } from '../game/Bag';
import { stageIndex, STORAGE_EXPAND_STEP, STORE_STACK, warehouseSlots, type Progress } from '../game/Progress';
import { objectiveNeed, objectiveProgress, objectiveText, todayKey, type Quests } from '../game/Quests';
import { ICONS, mico, richText } from './icons';
import { buildingThumb } from './thumbs';
import { gearLook } from '../models/items';
import { equipIconUrl, heroPortraitUrl, itemIconUrl, monsterIconUrl, skillIconUrl, toolIconUrl } from './itemIcons';
import { BESTIARY, BESTIARY_BY_ID, COLLECTION_MILESTONES, killMilestones, milestoneReward, RESEARCH_BONUS, type BestiaryReward } from '../data/bestiary';
import { DEBUFF_INFO, TRAIT_TEXT, type Faction } from '../data/species';
import { endLock, AFFIXES, ALLOY, ALLOY2, RIFT_ALLOY2_FROM, riftEntry, rushEntry, formatClock, riftAffixes, riftMult, riftReward, RIFT_ALLOY, RIFT_TIME, rushReward, RUSH_DAILY, RUSH_DIFFS, RUSH_EXTRA_ALLOY, SHARD, DUST, DUST_PER_SHARD, END_NAMES, type EndContent, readTrialCode, trialCode, trialGrade, TRIAL_GRADES, trialSpec, TRIAL_TIME, weekKey, towerBoss, towerDaily, towerFirstClear, towerMult, rushFights, type RushDiff } from '../data/endgame';
import { BONUS_NAMES, bonusText, TRANSCEND_STATS, transcendCost, transcendExp, engraveCost, engraveRange, ENGRAVE_STAGES, ENGRAVE_STAGE_NAMES, rollEngrave, TITLES, type BonusKey } from '../data/bonus';
import { Rng } from '../core/rng';
import type { Archetype } from '../data/monsters';

const FACTION_NAME: Record<Faction, string> = { beast: '야수', undead: '언데드', orc: '오크족', elf: '다크엘프', construct: '구조물', elemental: '정령', void: '공허', demon: '악마' };
const ARCH_NAME: Record<Archetype, string> = {
  melee: '근접',
  ranged: '원거리 마법',
  charger: '돌진',
  bomber: '자폭',
  tank: '거대',
  brute: '광전사',
  archer: '궁수',
  assassin: '암살자',
  necro: '소환술사',
  shaman: '치유사',
  caster: '마법사',
  swarm: '떼',
  spitter: '독 뱉기',
  knight: '방패병',
};
import { canInstall, promptInstall } from './install';

export const hex = (c: number) => `#${c.toString(16).padStart(6, '0')}`;
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

export interface ResultInfo {
  title: string;
  items: Map<string, number>;
  equips: Equip[];
  lost?: Map<string, number>;
  lostEquips?: number;
  seconds: number;
  explored: number;
  gold: number;
  exp: number;
  stages?: number;
  note?: string;
}

/** 목록 안의 아이콘 (절대 위치) */
/** 글 속 작은 3D 아이콘 (그리기 실패 시 이모지) */
const SPK = (name: Parameters<typeof mico>[0], fallback: string) => mico(name, fallback, 'mico-inline');

/** 3D 모델로 그린 아이콘. 그리기에 실패하면 예전 보석 모양으로 */
const itemGem = (id: string) => {
  const url = itemIconUrl(id);
  return url ? `<img class="gem ico" src="${url}" alt="">` : `<span class="gem" style="--c:${hex(ITEMS[id]?.color ?? 0xffffff)}"></span>`;
};
const equipGem = (e: Equip) => {
  const url = equipIconUrl(e);
  return url ? `<img class="gem ico eq-ico" style="--c:${hex(GRADES[e.grade].color)}" src="${url}" alt="">` : `<span class="gem eq" style="--c:${hex(GRADES[e.grade].color)}"></span>`;
};
const toolGem = (k: ToolKind, t: ToolState) => {
  const url = toolIconUrl(k, t.tier);
  return url ? `<img class="gem ico" src="${url}" alt="">` : '';
};
/** 개수를 창고 칸(99개씩)으로 나눈다 */
const stacks = (n: number): number[] => {
  const out: number[] = [];
  for (let left = n; left > 0; left -= STORE_STACK) out.push(Math.min(STORE_STACK, left));
  return out;
};
/** 글 사이에 들어가는 작은 아이콘 */
const inlineGem = (id: string) => {
  const url = itemIconUrl(id);
  return url ? `<img class="gem-inline ico" src="${url}" alt="">` : `<i class="gem-inline" style="--c:${hex(ITEMS[id]?.color ?? 0xffffff)}"></i>`;
};

/** 남은 시간 글자: "1시간 20분", "42분", "30초" */
export function formatWait(ms: number): string {
  const sec = Math.ceil(ms / 1000);
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  if (h > 0) return `${h}시간${m ? ` ${m}분` : ''}`;
  if (m > 0) return `${m}분`;
  return `${sec}초`;
}

/** 제작대 작업 이름과 아이콘 (창·말풍선 공용) */
export function workJobName(j: WorkJob): string {
  if (j.kind === 'item') return ITEMS[j.id].name;
  if (j.kind === 'tool') return `${TOOL_TIER_NAMES[j.tier - 1]} ${TOOL_KIND_NAMES[j.id as ToolKind]}`;
  return `${j.mana ? `${SPK('sparkle', '✨')} ` : ''}${equipName(workJobEquip(j))}`;
}
export function workJobEquip(j: WorkJob): Equip {
  return { uid: '', slot: j.id as EquipSlot, cls: j.cls as ClassId | undefined, tier: j.tier, grade: 0, plus: 0 };
}
export function workJobIconUrl(j: WorkJob): string {
  if (j.kind === 'item') return itemIconUrl(j.id);
  if (j.kind === 'tool') return toolIconUrl(j.id as ToolKind, j.tier);
  return equipIconUrl(workJobEquip(j));
}
const workJobIcon = (j: WorkJob) => {
  const url = workJobIconUrl(j);
  return url ? `<img class="wb-ico" src="${url}" alt="">` : '';
};

export function equipLine(e: Equip): string {
  const s = equipStats(e);
  const parts = [];
  if (s.atk) parts.push(`공격 ${s.atk}`);
  if (s.def) parts.push(`방어 ${s.def}`);
  if (s.hp) parts.push(`HP ${s.hp}`);
  if (s.mp) parts.push(`MP ${s.mp}`);
  if (s.crit) parts.push(`치명 ${s.crit}%`);
  // 각인 (망가진 장비는 빈 문자열 그대로 두어 '망가짐'으로 보이게)
  if (parts.length && e.eng?.length) parts.push(`<span class="eng">각인 ${e.eng.map((l) => bonusText(l.k, l.v)).join(', ')}</span>`);
  return parts.join(' · ');
}

function equipTitle(e: Equip): string {
  return `<b style="color:${hex(GRADES[e.grade].color)}">[${GRADES[e.grade].name}] ${esc(equipName(e))}</b>`;
}

const KIND_NAMES = { material: '재료', essence: '마력 정수', processed: '가공품', consumable: '소모품', key: '중요 물품' };

/** 가방 칸의 정보 (이름, 종류, 설명) */
function slotInfo(s: Slot): string {
  if (s.equip) {
    const e = s.equip;
    return `${equipTitle(e)} <span class="dim">· ${slotName(e.slot, e.cls)}${e.cls ? ` (${CLASSES[e.cls].name} 전용)` : ''}</span><br>${equipLine(e)} · 판매가 ${equipValue(e)} G`;
  }
  const it = ITEMS[s.itemId];
  return `<b style="color:${hex(it.color)}">${it.name}</b> <span class="dim">· ${KIND_NAMES[it.kind]} · ${s.count}개 · 개당 ${it.value} G</span><br>${it.description}`;
}

/** 모든 메뉴 화면. 한 번에 하나만 열린다 */
export class Screens {
  private layer: HTMLDivElement;
  private current: HTMLElement | null = null;
  private onCloseCb: (() => void) | null = null;

  constructor(
    parent: HTMLElement,
    private click: () => void,
  ) {
    this.layer = document.createElement('div');
    this.layer.className = 'screens';
    parent.appendChild(this.layer);
  }

  get isOpen(): boolean {
    return this.current !== null;
  }

  close(): void {
    this.current?.remove();
    this.current = null;
    const cb = this.onCloseCb;
    this.onCloseCb = null;
    cb?.();
  }

  private open(className: string, html: string, onClose?: () => void): HTMLElement {
    const scroll = this.current?.querySelector('.scroll')?.scrollTop ?? 0;
    const sameKind = this.current?.dataset.kind === className;
    this.current?.remove();
    this.onCloseCb = null;
    const s = document.createElement('div');
    s.className = `screen ${className}`;
    s.dataset.kind = className;
    if (sameKind) s.classList.add('no-anim');
    s.innerHTML = html;
    this.layer.appendChild(s);
    this.current = s;
    // 같은 화면을 다시 그릴 때는 스크롤 위치를 유지한다
    if (sameKind) {
      const sc = s.querySelector('.scroll');
      if (sc) sc.scrollTop = scroll;
    }
    if (onClose) {
      this.onCloseCb = onClose;
      s.querySelector('.close')?.addEventListener('click', () => this.close());
      // 바깥을 눌러 닫기: 열리자마자 들어온 터치(조이스틱·공격 버튼을 누르고 있던 손가락)는 무시하고,
      // 바깥에서 눌렀다 뗀 경우에만 닫는다. 예/아니오 창은 바깥을 눌러도 닫히지 않는다
      const openedAt = performance.now();
      let downOnBg = false;
      s.addEventListener('pointerdown', (e) => {
        downOnBg = e.target === s && performance.now() - openedAt > 400;
      });
      s.addEventListener('pointerup', (e) => {
        if (downOnBg && e.target === s && className !== 'ask') this.close();
        downOnBg = false;
      });
    }
    s.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).closest('button')) this.click();
    });
    return s;
  }

  private on(s: HTMLElement, selector: string, f: (el: HTMLElement) => void): void {
    s.querySelectorAll<HTMLElement>(selector).forEach((el) => el.addEventListener('click', () => f(el)));
  }

  // ---------------- 타이틀 ----------------
  title(hasSave: boolean, onNew: () => void, onContinue: () => void, onLoadCode?: () => void, onTest?: () => void): void {
    const s = this.open(
      'title',
      `<div class="title-box">
         <div class="title-sub">차원틈새에 떨어진 자의 이야기</div>
         <h1>영겁의 틈새</h1>
         <div class="title-menu">
           ${hasSave ? '<button class="primary" data-a="continue">이어하기</button>' : ''}
           <button class="${hasSave ? '' : 'primary'}" data-a="new">새로 시작</button>
           ${canInstall() ? `<button class="install" data-a="install">${SPK('phone', '📲')} 앱으로 설치</button>` : ''}
           <button class="update" data-a="loadcode">${SPK('key', '📥')} 저장 코드로 불러오기</button>
           <button class="update" data-a="update">${SPK('refresh', '🔄')} 업데이트 확인</button>
         </div>
       </div>
       ${onTest ? '<div class="secret-spot" data-a="secret" aria-hidden="true"></div>' : ''}
       <button class="patch-btn" data-a="patch">${SPK('scroll', '📜')} 패치노트</button>
       <div class="version">v${GAME_VERSION} (${BUILD_ID}) · 모바일 가로 화면 권장</div>`,
    );
    this.on(s, '[data-a="continue"]', onContinue);
    this.on(s, '[data-a="install"]', () => void promptInstall());
    if (onLoadCode) this.on(s, '[data-a="loadcode"]', onLoadCode);
    // 숨은 입구: 왼쪽 위 빈 곳을 3초 안에 5번 누르면 테스트 캐릭터
    if (onTest) {
      let taps: number[] = [];
      this.on(s, '[data-a="secret"]', () => {
        const now = performance.now();
        taps = [...taps.filter((t) => now - t < 3000), now];
        if (taps.length >= 5) {
          taps = [];
          onTest();
        }
      });
    }
    this.on(s, '[data-a="patch"]', () => this.patchNotes(() => this.title(hasSave, onNew, onContinue, onLoadCode, onTest)));
    // 업데이트 확인 → 새 버전이 있으면 같은 버튼이 "업데이트" 버튼으로 바뀐다
    let remote: RemoteVersion | null = null;
    this.on(s, '[data-a="update"]', (b) => {
      if (remote && isNewer(remote)) {
        b.textContent = '업데이트 중…';
        void applyUpdate(remote);
        return;
      }
      b.textContent = '확인 중…';
      void fetchRemoteVersion().then((r) => {
        remote = r;
        if (!r) b.innerHTML = `${SPK('warning', '⚠')} 확인 실패 (인터넷 연결 확인)`;
        else if (isNewer(r)) {
          b.textContent = `⬆ 새 버전 v${r.version} 받기`;
          b.classList.add('primary');
        } else b.textContent = `✔ 최신 버전입니다 (v${GAME_VERSION})`;
      });
    });
    this.on(s, '[data-a="new"]', () => {
      if (hasSave && !confirm('저장된 진행을 지우고 새로 시작할까요?')) return;
      onNew();
    });
  }

  // ---------------- 차원문 광장: 단계 → 방 선택 ----------------
  stageSelect(p: Progress, tier: number, onPick: (tier: number, stage: number) => void, onClose: () => void, onFarm?: (tier: number, kind: 'wood' | 'ore') => void, onEnd?: () => void): void {
    const maxTier = p.maxTier;
    const tiers = THEMES.map((t) => {
      const locked = t.tier > maxTier;
      return `<button class="tier-tab ${t.tier === tier ? 'on' : ''} ${locked ? 'locked' : ''}" data-tier="${t.tier}" style="--c:${hex(t.portalColor)}" ${locked ? 'disabled' : ''}>
          <span class="gate"></span><b>${t.tier}${p.data.dimStones.includes(t.tier) ? '<i class="stone">◆</i>' : ''}</b></button>`;
    }).join('');
    const theme = THEMES[tier - 1];
    const stages = Array.from({ length: 10 }, (_, i) => {
      const st = i + 1;
      const g = stageIndex(tier, st);
      const open = g <= p.data.cleared + 1;
      const done = g <= p.data.cleared;
      const mark = st === 10 ? '수호자' : st === 5 ? '파수꾼' : '';
      const wait = p.bossWait(tier, st);
      const sub = !open ? '봉인' : mark ? (wait > 0 ? `${mark} ${formatWait(wait)}` : mark) : done ? '클리어' : '도전';
      return `<button class="stage-btn ${done ? 'done' : ''} ${mark ? 'boss' : ''} ${wait > 0 ? 'waiting' : ''}" data-stage="${st}" ${open ? '' : 'disabled'}>
          <b>${tier}-${st}</b><small>${sub}</small></button>`;
    }).join('');
    // 채집 특화 맵: 종류마다 30분에 한 번 (어느 단계든 한 곳)
    const farmBtn = (kind: 'wood' | 'ore') => {
      const wait = p.farmWait(kind);
      const hasTool = p.flag(kind === 'wood' ? 'tool_axe' : 'tool_pickaxe') > 0;
      const icon = kind === 'wood' ? itemGem(WOOD_TIERS[tier - 1]) : itemGem(ORE_TIERS[tier - 1]);
      const unlocked = p.farmUnlocked(tier);
      const sub = !unlocked ? `${tier}-5 파수꾼 처치 후 열림` : !hasTool ? (kind === 'wood' ? '도끼 필요' : '곡괭이 필요') : wait > 0 ? `${formatWait(wait)} 뒤` : '입장 가능';
      const off = !unlocked || wait > 0 || !hasTool;
      return `<button class="farm-btn ${off ? 'waiting' : ''}" data-farm="${kind}" ${off ? 'disabled' : ''}>${icon}<span><b>${tier}단계 ${kind === 'wood' ? '벌목지' : '광맥지'}</b><small>${sub}</small></span></button>`;
    };
    const farmRow = onFarm ? `<h3>채집 특화 맵 <small>각각 30분에 한 번 (어느 단계든 한 곳)</small></h3><div class="farm-row">${farmBtn('wood')}${farmBtn('ore')}</div>` : '';
    const s = this.open(
      'select',
      `<div class="panel wide">
         <button class="close">${ICONS.close}</button>
         <h2>차원문 광장 <small>${theme.name}</small></h2>
         <div class="tier-tabs">${tiers}</div>
         ${onEnd && p.flag('endgame') && !endLock(p.data.end!, 'rift') ? `<button class="end-banner" data-end="1">${SPK('portal', '◎')} <b>심연 균열</b> <small>스테이지를 7-10보다 강한 난이도로 · 차원 가루·장비 파밍</small></button>` : ''}
         <p class="hint">5번째 방 파수꾼(1시간마다 재등장) · 10번째 방 차원석 수호자(4시간마다). 대기 중엔 정예가 지킵니다.</p>
         <div class="stage-grid">${stages}</div>
         ${farmRow}
       </div>`,
      onClose,
    );
    this.on(s, '.tier-tab:not(.locked):not(.end-tab)', (b) => this.stageSelect(p, Number(b.dataset.tier), onPick, onClose, onFarm, onEnd));
    this.on(s, '[data-end]', () => onEnd?.());
    this.on(s, '[data-stage]', (b) => onPick(tier, Number(b.dataset.stage)));
    this.on(s, '[data-farm]', (b) => onFarm?.(tier, b.dataset.farm as 'wood' | 'ore'));
  }

  // ---------------- 차원의 끝 (엔드 콘텐츠) ----------------
  endgame(
    p: Progress,
    h: { tower: (floor: number) => void; towerDaily: () => void; rush: (diff: RushDiff) => void; rift: (tier: number, level: number) => void; trial: () => void; trialAura: (grade: number) => void },
    onClose: () => void,
    message?: string,
    sel?: { tier: number; level: number },
    only: EndContent = 'tower',
    view: 'main' | 'info' | 'titles' = 'main',
  ): void {
    const e = p.data.end!;
    const today = todayKey();
    const cur = { tier: sel?.tier ?? Math.min(7, p.maxTier), level: sel?.level ?? Math.max(1, e.riftBest + 1) };
    const dust = (n: number) => (n ? `${inlineGem(DUST)}${n}` : '');
    const res = (id: string) => `<span class="res-chip">${inlineGem(id)}${p.count(id)}</span>`;
    const used = e.rushDate === today ? e.rushUsed : 0;
    const maxLevel = e.riftBest + 1;
    const tr = e.trial;
    const spec = trialSpec(weekKey());

    // ---------- 첫 화면: 필요한 것만 ----------
    let main = '';
    if (only === 'tower') {
      // 탑: 층 목록 (위가 높은 층). 들어오면 다음 도전 층이 보이도록 스크롤
      const next = e.towerBest + 1;
      const top = Math.max(next + 9, 20);
      const daily = towerDaily(e.towerBest);
      const dailyDone = e.towerDailyDate === today;
      const rows: string[] = [];
      for (let f = top; f >= 1; f--) {
        const b = towerBoss(f);
        const done = f <= e.towerBest;
        const isNext = f === next;
        const fc = towerFirstClear(f);
        const tag = b ? `<span class="fl-boss">${b.kind === 'boss' ? '수호자' : '파수꾼'}</span>` : '';
        const wall = f > 10 && f % 10 === 1 ? '<span class="fl-wall">+15% 벽</span>' : '';
        const right = done
          ? `<span class="ok">✓</span><button class="fl-go" data-tower="${f}">여기서</button>`
          : isNext
            ? `<button class="primary fl-go" data-tower="${f}">도전</button>`
            : `<span class="dim">${fc.gold} G ${dust(fc.dust)}</span>`;
        rows.push(`<div class="floor ${done ? 'done' : ''} ${isNext ? 'next' : ''} ${f > next ? 'locked' : ''}" ${isNext ? 'data-next' : ''}><b>${f}층</b>${tag}${wall}<span class="dim fl-m">×${towerMult(f).toFixed(2)}</span><span class="fl-r">${right}</span></div>`);
      }
      main = `<div class="end-summary"><span>최고 <b>${e.towerBest}층</b></span>
          <button class="small" data-daily ${dailyDone || e.towerBest < 1 ? 'disabled' : ''}>${dailyDone ? '오늘 소탕 완료' : `소탕 ${daily.gold} G ${dust(daily.dust)}`}</button></div>
        <div class="floor-list scroll" data-floors>${rows.join('')}</div>`;
    } else if (only === 'rush') {
      main = `<div class="end-summary"><span>일반·하드 무료 <b>${Math.max(0, RUSH_DAILY - used)}/${RUSH_DAILY}</b></span></div>
        <div class="rush-row">${RUSH_DIFFS.map((d, i) => {
          const locked = i > 0 && !e.rushGradeBest[i - 1];
          const cost = rushEntry(i as RushDiff, used);
          const short = !locked && !p.hasAll(cost);
          const costTxt = Object.entries(cost).map(([id, n]) => `${inlineGem(id)}${n}`).join(' ') || '무료';
          const best = e.rushBest[i] ? `${formatClock(e.rushBest[i])} · ${e.rushGradeBest[i]}` : '-';
          return `<button class="rush-btn big ${locked || short ? 'locked' : ''}" data-rush="${i}" ${locked || short ? 'disabled' : ''}>
            <b>${d.name}</b><small>${d.per}마리씩 · ${rushFights(i as RushDiff).length}전</small>
            <small class="dim">${locked ? `${RUSH_DIFFS[i - 1].name} 완주 후` : `최고 ${best}`}</small><small>${locked ? '' : costTxt}</small></button>`;
        }).join('')}</div>`;
    } else if (only === 'rift') {
      const affixes = riftAffixes(cur.level, today);
      const rr = riftReward(cur.level, true);
      const entry = riftEntry(cur.level);
      main = `<div class="end-summary"><span>최고 <b>${e.riftBest}단계</b></span></div>
        <div class="chips">${THEMES.map((t) => `<button class="chip ${t.tier === cur.tier ? 'on' : ''}" data-rtier="${t.tier}" ${t.tier > p.maxTier ? 'disabled' : ''} style="--c:${hex(t.portalColor)}">${t.tier} ${t.name}</button>`).join('')}</div>
        <div class="menu row stepper">
          <button data-rlv="-1" ${cur.level <= 1 ? 'disabled' : ''}>−</button><b>${cur.level}단계</b><button data-rlv="1" ${cur.level >= maxLevel ? 'disabled' : ''}>+</button>
          <span class="dim">보상 ${rr.gold} G ${dust(rr.dust)}</span>
        </div>
        <div class="chips">${affixes.length ? affixes.map((a) => `<span class="chip" style="--c:${hex(AFFIXES[a].color)}">${AFFIXES[a].name}</span>`).join('') : '<span class="dim">변이 없음</span>'}</div>
        <div class="menu row"><button class="primary" data-rift ${p.count(entry.id) < entry.n ? 'disabled' : ''}>입장 · ${inlineGem(entry.id)}${entry.n}</button></div>`;
    } else {
      const g = tr ? trialGrade(tr.best) : -1;
      const topG = tr?.topGrade ?? -1;
      const worn = p.data.aura ?? -1;
      main = `<div class="end-summary"><span>${weekKey()} · ${THEMES[spec.tier - 1].name}</span>
          <span>이번 주 <b>${tr?.best ?? 0}점</b> ${g >= 0 ? `<b style="color:${hex(TRIAL_GRADES[g].color)}">${TRIAL_GRADES[g].name}</b>` : ''}</span></div>
        <div class="chips">${spec.affixes.map((a) => `<span class="chip" style="--c:${hex(AFFIXES[a].color)}">${AFFIXES[a].name}</span>`).join('')}</div>
        <div class="menu row"><button class="primary" data-trial>도전하기</button></div>
        <h3 class="sub">발밑 오라 ${worn >= 0 ? '<button class="chip" data-taura="-1">끄기</button>' : ''}</h3>
        <div class="rush-row trial-row">${TRIAL_GRADES.map((t, i) => {
          const open = topG >= i;
          return `<button class="rush-btn aura-btn ${open ? '' : 'locked'} ${worn === i ? 'on' : ''}" data-taura="${i}" ${open ? '' : 'disabled'} style="--c:${hex(t.color)}"><b style="color:${hex(t.color)}">${t.name}</b><small class="dim">${t.min}점</small></button>`;
        }).join('')}</div>`;
    }

    // ---------- 설명: 규칙·보상·재료 ----------
    const infoOf: Record<EndContent, string> = {
      tower: `<ul class="info-list">
          <li>한 층은 둥근 단 하나. 웨이브 3번을 모두 정리하면 가운데 문으로 위층에 오릅니다.</li>
          <li>5층마다 파수꾼, 10층마다 수호자가 마지막 웨이브에 나옵니다.</li>
          <li>난이도: 1층은 7-10 수준. 1~10층은 층마다 +5%, 11층부터 층마다 +3%에 10층마다 한 번에 +15% 벽.</li>
          <li>보상: 층을 처음 돌파하면 골드와 ${inlineGem(DUST)}차원 가루. 하루 한 번 최고 층만큼 소탕 보상.</li>
          <li>깬 층은 어디서든 다시 시작할 수 있습니다 (다시 깨면 몬스터 전리품만).</li>
        </ul>`,
      rush: `<ul class="info-list">
          <li>1단계 파수꾼부터 7단계 수호자까지 연속으로 싸웁니다. 보스 사이에 체력 25%만 회복.</li>
          <li>일반: 한 마리씩 14전 · 하드: 두 마리씩 7전(체력 ×1.5, 공격 ×1.3) · 지옥: 세 마리씩 5전(체력 ×2.2, 공격 ×1.6).</li>
          <li>일반·하드는 하루 ${RUSH_DAILY}번 무료, 그 뒤는 ${inlineGem(ALLOY)}차원 합금 ${RUSH_EXTRA_ALLOY}. 지옥은 매번 ${inlineGem(ALLOY2)}상급 차원 합금 1.</li>
          <li>등급: 10분 안 S · 15분 A · 20분 B · 그 밖 C. 보상은 완주했을 때 한꺼번에 (S: 일반 ${dust(rushReward(0, 'S').dust)} · 하드 ${dust(rushReward(1, 'S').dust)} · 지옥 ${dust(rushReward(2, 'S').dust)}).</li>
        </ul>`,
      rift: `<ul class="info-list">
          <li>고른 맵(1~7단계)을 7-10보다 강한 난이도로 엽니다. 단계마다 몬스터 +12% (지금 ×${riftMult(cur.level).toFixed(2)}).</li>
          <li>${Math.floor(RIFT_TIME / 60)}분 안에 모두 쓰러뜨리면 다음 단계가 열리고 보상 전부, 늦으면 절반.</li>
          <li>차원 가루와 좋은 장비를 파밍하는 곳이라 광맥·나무는 적습니다 (자원은 기본 스테이지·채집 특화 맵).</li>
          <li>입장: 1~${RIFT_ALLOY2_FROM - 1}단계 ${inlineGem(ALLOY)}차원 합금 ${RIFT_ALLOY} · ${RIFT_ALLOY2_FROM}단계부터 ${inlineGem(ALLOY2)}상급 차원 합금 ${RIFT_ALLOY} (제작대).</li>
          <li>오늘의 변이: ${riftAffixes(cur.level, today).map((a) => `<b style="color:${hex(AFFIXES[a].color)}">${AFFIXES[a].name}</b> ${AFFIXES[a].text}`).join(' · ') || '없음'}</li>
        </ul>`,
      trial: `<ul class="info-list">
          <li>일주일 동안 모두 같은 맵·몬스터·변이. 능력치는 고정 스펙(99레벨·7단계 유니크 +5, 배운 스킬 최고 레벨, 궁극기 Lv.1, 각인·초월·칭호·음식 무시).</li>
          <li>중급 물약 3개 지급, ${formatClock(TRIAL_TIME)} 제한, 쓰러져도 짐을 잃지 않음. 몇 번이든 도전 가능.</li>
          <li>점수: 클리어 10000 + 남은 시간×10 + 최고 연속 처치×25 − 피격×40 − 물약×400.</li>
          <li>등급(${TRIAL_GRADES.map((t) => `${t.name} ${t.min}`).join(' · ')})을 처음 달성하면 그 등급의 발밑 오라를 얻습니다.</li>
          ${tr && tr.best ? `<li>내 기록 코드: <input class="code-box" readonly value="${trialCode(tr.week, tr.cls, tr.best, tr.time, tr.hits)}"></li>` : ''}
          <li>친구 코드 확인: <input class="code-box" data-tcode placeholder="DT-..."> <span data-tcode-out></span></li>
          <li>지난 기록: ${tr?.history.length ? tr.history.slice(0, 5).map((x) => `${x.week} ${x.best}점 ${x.grade >= 0 ? TRIAL_GRADES[x.grade].name : '-'}`).join(' · ') : '없음'}</li>
        </ul>`,
    };
    const common = `<p class="dim">보상은 ${inlineGem(DUST)}차원 가루로 받습니다. 차원집의 차원 응축기에서 가루 ${DUST_PER_SHARD} + 상급 정수 + 티타늄판 → ${inlineGem(SHARD)}차원 파편(궁극기 강화·각인·초월).</p>`;
    const titles = `<ul class="list">${TITLES.map((t) => {
      const got = p.data.titles?.includes(t.id);
      return `<li class="${got ? '' : 'locked'}"><div><b>${got ? `「${t.name}」` : '???'}</b><small>${t.cond} · ${Object.entries(t.bonus).map(([k, v]) => bonusText(k as BonusKey, v!)).join(', ')}</small></div>${got ? '<span class="ok">획득</span>' : ''}</li>`;
    }).join('')}</ul>`;
    const chips = only === 'tower' || only === 'trial' ? res(DUST) : `${res(DUST)}${res(ALLOY)}${res(ALLOY2)}`;

    const body = view === 'info' ? `<div class="scroll">${infoOf[only]}${only === 'trial' ? '' : common}</div>` : view === 'titles' ? `<div class="scroll">${titles}</div>` : main;
    const s = this.open(
      'endgame',
      `<div class="panel wide tall end-panel">
         <div class="end-head">
           ${view !== 'main' ? '<button class="small" data-view="main">← 돌아가기</button>' : ''}
           <h2>${END_NAMES[only]}${view === 'info' ? ' · 설명' : view === 'titles' ? ' · 칭호' : ''}</h2>
           <span class="res">${chips}</span>
           <span class="head-btns">${view === 'main' ? `<button class="small" data-view="info">설명</button><button class="small" data-view="titles">칭호 ${p.data.titles?.length ?? 0}</button>` : ''}<button class="close-inline">${ICONS.close}</button></span>
         </div>
         ${message ? `<div class="notice">${message}</div>` : ''}
         ${body}
       </div>`,
      onClose,
    );
    const again = (m?: string, ns = cur, v = view) => this.endgame(p, h, onClose, m, ns, only, v);
    this.on(s, '[data-view]', (b) => again(undefined, cur, b.dataset.view as 'main' | 'info' | 'titles'));
    this.on(s, '.close-inline', () => this.close());
    this.on(s, '[data-tower]', (b) => h.tower(Number(b.dataset.tower)));
    this.on(s, '[data-daily]', () => h.towerDaily());
    this.on(s, '[data-rush]', (b) => h.rush(Number(b.dataset.rush) as RushDiff));
    this.on(s, '[data-rtier]', (b) => again(message, { ...cur, tier: Number(b.dataset.rtier) }));
    this.on(s, '[data-rlv]', (b) => again(message, { ...cur, level: Math.max(1, Math.min(maxLevel, cur.level + Number(b.dataset.rlv))) }));
    this.on(s, '[data-rift]', () => h.rift(cur.tier, cur.level));
    this.on(s, '[data-trial]', () => h.trial());
    this.on(s, '[data-taura]', (b) => h.trialAura(Number(b.dataset.taura)));
    // 탑: 다음 도전 층이 목록 가운데 오도록
    const list = s.querySelector<HTMLElement>('[data-floors]');
    const nextRow = s.querySelector<HTMLElement>('[data-next]');
    if (list && nextRow) list.scrollTop = nextRow.offsetTop - list.offsetTop - list.clientHeight / 2 + nextRow.clientHeight / 2;
    const input = s.querySelector<HTMLInputElement>('[data-tcode]');
    const out = s.querySelector<HTMLElement>('[data-tcode-out]');
    input?.addEventListener('input', () => {
      const r = readTrialCode(input.value);
      if (out) out.innerHTML = !input.value.trim() ? '' : r ? `<b>${r.week}</b> ${CLASSES[r.cls as ClassId]?.name ?? r.cls} · <b>${r.score}점</b> ${trialGrade(r.score) >= 0 ? TRIAL_GRADES[trialGrade(r.score)].name : ''} · ${formatClock(r.seconds)} · 피격 ${r.hits}` : '<span class="bad">올바르지 않은 코드</span>';
    });
  }

  /** 워프 게이트: 다음 방으로 갈지, 마을로 갈지 */
  warp(label: string, next: string | null, onNext: () => void, onVillage: () => void, onClose: () => void): void {
    const s = this.open(
      'warp',
      `<div class="panel">
         <button class="close">${ICONS.close}</button>
         <h2>워프 게이트</h2>
         <p class="hint">${label} 클리어! 가방의 전리품은 그대로 들고 갑니다.</p>
         <div class="menu">
           ${next ? `<button class="primary" data-a="next">다음 방으로 (${next})</button>` : ''}
           <button data-a="village" class="${next ? '' : 'primary'}">마을로 귀환</button>
         </div>
       </div>`,
      onClose,
    );
    this.on(s, '[data-a="next"]', onNext);
    this.on(s, '[data-a="village"]', onVillage);
  }

  // ---------------- 일시정지 ----------------
  pause(opts: {
    inDungeon: boolean;
    seed?: number;
    returnStones: number;
    shadows: boolean;
    autoAim: boolean;
    onToggleAim: (on: boolean) => void;
    sound: boolean;
    onReturnStone: () => void;
    onGiveUp: () => void;
    onToggleShadows: (on: boolean) => void;
    onToggleSound: (on: boolean) => void;
    music: number;
    sfx: number;
    onMusicVolume: (v: number) => void;
    onSfxVolume: (v: number) => void;
    onTitle: () => void;
    onSaveCode: () => void;
    onBestiary?: () => void;
    /** 가진 음식 (먹으면 30분 버프) */
    foods?: { id: string; count: number }[];
    foodLeft?: string;
    onEat?: (id: string) => void;
    onClose: () => void;
  }): void {
    const s = this.open(
      'pause',
      `<div class="panel">
         <button class="close">${ICONS.close}</button>
         <h2>메뉴</h2>
         <div class="menu">
           <button data-a="resume" class="primary">계속하기</button>
           ${opts.inDungeon ? `<button data-a="stone" ${opts.returnStones ? '' : 'disabled'}>귀환석 사용 (보유 ${opts.returnStones})</button>` : ''}
           ${opts.inDungeon ? '<button data-a="giveup" class="danger">포기하고 쓰러지기</button>' : ''}
           <label class="toggle"><input type="checkbox" data-t="shadow" ${opts.shadows ? 'checked' : ''}/> 그림자</label>
           <div class="aim-row"><span>스킬 방향</span>
             <button data-aim="auto" class="${opts.autoAim ? 'on' : ''}">${SPK('target', '🎯')} 자동 조준</button>
             <button data-aim="face" class="${opts.autoAim ? '' : 'on'}">${SPK('arrow', '➡')} 바라보는 방향</button></div>
           <label class="toggle"><input type="checkbox" data-t="sound" ${opts.sound ? 'checked' : ''}/> 소리 켜기</label>
           <label class="volume">${SPK('music', '🎵')} 배경음 <input type="range" min="0" max="100" step="5" value="${Math.round(opts.music * 100)}" data-v="music"/><b data-vl="music">${Math.round(opts.music * 100)}</b></label>
           <label class="volume">${SPK('speaker', '🔊')} 효과음 <input type="range" min="0" max="100" step="5" value="${Math.round(opts.sfx * 100)}" data-v="sfx"/><b data-vl="sfx">${Math.round(opts.sfx * 100)}</b></label>
           ${opts.foods?.length ? `<div class="food-row">${opts.foodLeft ? `<small class="dim">먹은 음식: ${opts.foodLeft}</small>` : ''}${opts.foods.map((f) => `<button data-eat="${f.id}">${inlineGem(f.id)}${ITEMS[f.id].name} 먹기 (${f.count})</button>`).join('')}</div>` : ''}
           ${opts.onBestiary ? `<button data-a="bestiary">${SPK('book', '📖')} 몬스터 도감</button>` : ''}
           <button data-a="savecode">${SPK('disk', '💾')} 저장 코드 만들기</button>
           <button data-a="title">타이틀로 (자동 저장)</button>
         </div>
         ${opts.seed !== undefined ? `<div class="seed">던전 시드 ${opts.seed}</div>` : ''}
         <div class="keys">배경음: Dreamy Analog Synth Loop · Smooth Electro Ambient Bossa Nova Loop · Relaxing Dreamy Synth Rhodes Loop — orangefreesounds.com (CC BY 4.0)</div>
         <div class="keys">PC 조작: WASD 이동 · J/클릭 공격 · Space 회피(검사 구르기 · 마법사 블링크 · 궁수 후방 도약) · 1·2·3 스킬 · 4/F 궁극기 · Q 물약 · E 상호작용·채집 · M 지도 · I 가방 · B 건설 · Esc 메뉴</div>
       </div>`,
      opts.onClose,
    );
    this.on(s, '[data-a="resume"]', () => this.close());
    this.on(s, '[data-a="bestiary"]', () => opts.onBestiary?.());
    this.on(s, '[data-a="stone"]', opts.onReturnStone);
    this.on(s, '[data-eat]', (b) => opts.onEat?.(b.dataset.eat!));
    this.on(s, '[data-a="giveup"]', () => {
      if (confirm('포기하면 일반 가방의 아이템을 모두 잃습니다. 계속할까요?')) opts.onGiveUp();
    });
    this.on(s, '[data-a="title"]', opts.onTitle);
    this.on(s, '[data-a="savecode"]', opts.onSaveCode);
    s.querySelector<HTMLInputElement>('[data-t="shadow"]')!.addEventListener('change', (e) => opts.onToggleShadows((e.target as HTMLInputElement).checked));
    s.querySelector<HTMLInputElement>('[data-t="sound"]')!.addEventListener('change', (e) => opts.onToggleSound((e.target as HTMLInputElement).checked));
    s.querySelectorAll<HTMLButtonElement>('[data-aim]').forEach((b) =>
      b.addEventListener('click', () => {
        const auto = b.dataset.aim === 'auto';
        opts.onToggleAim(auto);
        s.querySelectorAll('[data-aim]').forEach((x) => x.classList.toggle('on', x === b));
      }),
    );
    for (const k of ['music', 'sfx'] as const) {
      const input = s.querySelector<HTMLInputElement>(`[data-v="${k}"]`)!;
      const label = s.querySelector<HTMLElement>(`[data-vl="${k}"]`)!;
      input.addEventListener('input', () => {
        label.textContent = input.value;
        (k === 'music' ? opts.onMusicVolume : opts.onSfxVolume)(Number(input.value) / 100);
      });
      // 효과음은 손을 뗄 때 한 번 들려준다
      if (k === 'sfx') input.addEventListener('change', () => this.click());
    }
  }

  // ---------------- 던전 가방: 누르면 정보, 반대쪽 가방을 누르면 옮기기 ----------------
  bag(bag: Bag, dimBag: Bag, onMove: (from: 'bag' | 'dim', index: number) => boolean, onClose: () => void, onEquip?: () => void): void {
    let info = '아이템을 누르면 정보가 나옵니다. 그다음 반대쪽 가방을 누르면 그쪽으로 옮겨집니다.';
    let sel: { from: 'bag' | 'dim'; i: number } | null = null;
    const render = () => {
      const cell = (s: Slot | null, from: string, i: number) => {
        const on = sel && sel.from === from && sel.i === i ? 'sel' : '';
        if (!s) return `<div class="slot" data-empty="${from}"></div>`;
        const color = s.equip ? GRADES[s.equip.grade].color : ITEMS[s.itemId].color;
        return `<div class="slot filled ${on}" data-from="${from}" data-i="${i}" style="--c:${hex(color)}">${s.equip ? equipGem(s.equip) : itemGem(s.itemId)}<span class="cnt">${s.equip ? `+${s.equip.plus}` : s.count}</span></div>`;
      };
      const target = sel ? (sel.from === 'bag' ? 'dim' : 'bag') : '';
      const s = this.open(
        'bag',
        `<div class="panel wide">
           <button class="close">${ICONS.close}</button>
           <h2>가방 <small>${bag.used}/${bag.slots.length}</small> ${onEquip ? `<button class="tool-sm" data-a="equip">${SPK('shield', '🛡')} 장비 교체</button>` : ''}</h2>
           <div class="bag-grid ${target === 'bag' ? 'drop' : ''}" data-bag="bag">${bag.slots.map((x, i) => cell(x, 'bag', i)).join('')}</div>
           <div class="item-info">${info}</div>
           <h3>차원가방 <small>쓰러져도 지켜지는 가방 · ${dimBag.used}/${dimBag.slots.length}</small></h3>
           <div class="bag-grid dim-row ${target === 'dim' ? 'drop' : ''}" data-bag="dim">${dimBag.slots.map((x, i) => cell(x, 'dim', i)).join('')}</div>
         </div>`,
        onClose,
      );
      if (onEquip) this.on(s, '[data-a="equip"]', onEquip);
      s.querySelectorAll<HTMLElement>('.bag-grid').forEach((grid) =>
        grid.addEventListener('click', (e) => {
          const el = (e.target as HTMLElement).closest<HTMLElement>('.slot');
          const gridName = grid.dataset.bag as 'bag' | 'dim';
          // 선택한 아이템이 있고 반대쪽 가방을 눌렀으면 옮긴다
          if (sel && gridName !== sel.from) {
            const src = (sel.from === 'bag' ? bag : dimBag).slots[sel.i];
            const name = src ? (src.equip ? equipName(src.equip) : ITEMS[src.itemId].name) : '';
            info = onMove(sel.from, sel.i) ? `${name} → ${sel.from === 'bag' ? '차원가방' : '일반 가방'}으로 옮겼습니다` : '<span class="bad">옮길 칸이 없습니다</span>';
            sel = null;
            this.click();
            return render();
          }
          if (el?.classList.contains('filled')) {
            const from = el.dataset.from as 'bag' | 'dim';
            const i = Number(el.dataset.i);
            sel = sel && sel.from === from && sel.i === i ? null : { from, i };
            info = sel ? `${slotInfo((from === 'bag' ? bag : dimBag).slots[i]!)}<br><small class="ok">▶ ${from === 'bag' ? '차원가방' : '일반 가방'}을 누르면 옮겨집니다</small>` : info;
            this.click();
            render();
          }
        }),
      );
    };
    render();
  }

  // ---------------- 레시피북 (차원집) ----------------
  recipeBook(p: Progress, tab: string, onClose: () => void): void {
    const tabs: [string, string][] = [
      ['smelter', '제련로'],
      ['crusher', '벌목소'],
      ['infuser', '마력 주입기'],
      ['alchemy', '연금 솥'],
      ['condenser', '차원 응축기'],
      ['workbench', '제작대'],
      ['source', '재료 얻는 곳'],
    ];
    const io = (items: Record<string, number>) =>
      Object.entries(items)
        .map(([id, n]) => `<span class="${p.count(id) >= n ? '' : 'dim'}">${inlineGem(id)}${ITEMS[id].name}×${n}</span>`)
        .join(' + ');
    const row = (out: string, count: number, inputs: Record<string, number>, note: string) =>
      `<li>${itemGem(out)}<div><b>${ITEMS[out].name}${count > 1 ? ` ×${count}` : ''} <small class="dim">보유 ${p.count(out)}</small></b><small>${io(inputs)}</small><small class="dim">${note}</small></div></li>`;
    let body = '';
    if (tab === 'workbench') {
      const rows: string[] = [];
      for (let t = 1; t <= 7; t++) {
        const c = plateCraftCost(t);
        rows.push(row(TIER_PLATE[t - 1], 1, c.items, `제작대 Lv.${t} · ${c.time}초 · +1~+5 강화 재료`));
        const m = manaPlateCraftCost(t);
        rows.push(row(MANA_PLATE_OF(t), 1, m.items, `제작대 Lv.${t} · ${m.time}초 · +6~+10 강화 재료`));
      }
      for (const r of recipesFor('workbench')) rows.push(row(r.output, r.count, r.inputs, `제작대 Lv.${r.tier} · ${r.time}초 · 조립`));
      body = `<p class="hint">제작대에서는 판 합성, 조립(귀환석 등), 채집 도구(주괴 4 + 판자 3), 장비(주괴 + 판자 / ${SPK('sparkle', '✨')} 마력 판자)를 만듭니다. 제작을 시작하면 전력을 쓰며 시간이 걸립니다. 제작대 레벨 = 만들 수 있는 최고 단계.</p><ul class="list">${rows.join('')}</ul>`;
    } else if (tab === 'source') {
      const src: [string, string][] = [
        ['copper_ore', '1~2챕터 던전 광맥 (곡괭이)'],
        ['iron_ore', '2~3챕터 던전 광맥 · 2챕터는 뒤쪽 방일수록 많음'],
        ['gold_ore', '3~4챕터 던전 광맥'],
        ['wood', '1~2챕터 던전 나무 (도끼) · 이후 단계 나무도 같은 방식'],
        ['essence_low', '1~3챕터 몬스터 (일반 약 20%, 정예·보스 확정) · 퀘스트 보상'],
        ['essence_mid', '4~5챕터 몬스터'],
        ['essence_high', '6챕터 몬스터'],
        ['essence_supreme', '7챕터 몬스터'],
        ['dim_dust', '5챕터 이상 파수꾼(6~8)·수호자(16~24) 확정 (엔딩 뒤에는 모든 챕터), 7챕터 정예(가끔), 무한의 탑 첫 돌파·소탕, 보스 러시 완주, 심연 균열, 촌장 납품 의뢰'],
        ['dim_shard', '차원 응축기: 차원 가루 8 + 상급 정수 + 티타늄판 → 궁극기 강화 · 각인 · 초월'],
        ['essence_dim', '차원 응축기: 차원 가루 4 + 최상급 정수 + 오리하르콘 주괴 → 최고 연료'],
        ['dim_alloy', '차원집 제작대 Lv.4 (구리·철·황금·다이아판 + 상급 정수) → 심연 균열 1~10단계 입장, 보스 러시 추가 도전'],
        ['dim_alloy2', '차원집 제작대 Lv.6 (티타늄·오리하르콘판 + 마력 티타늄판 + 최상급 정수) → 심연 균열 11단계 이상, 보스 러시 지옥'],
        ['gear_part', '5챕터 톱니 잔해'],
        ['magi_alloy', '5챕터 합금 잔해'],
        ['potion', '상인 무트 (기본 물약만 판매)'],
      ];
      body = `<ul class="list">${src.map(([id, where]) => `<li>${itemGem(id)}<div><b>${ITEMS[id].name} <small class="dim">보유 ${p.count(id)}</small></b><small>${where}</small></div></li>`).join('')}</ul>
        <p class="hint">광석·나무는 한 단계 위까지 지금 도구로 캘 수 있지만 내구도가 3배로 닳습니다.</p>`;
    } else {
      const recipes = RECIPES.filter((r) => r.machine === tab);
      const b = BUILDINGS[tab as BuildingType];
      body = `<p class="hint">${b.description} 레시피마다 필요한 건물 레벨이 있습니다 (세라의 강화 도면).</p><ul class="list">${recipes.map((r) => row(r.output, r.count, r.inputs, `${b.name} Lv.${r.tier} · ${r.time}초`)).join('')}</ul>`;
    }
    const s = this.open(
      'recipes',
      `<div class="panel wide tall">
         <button class="close">${ICONS.close}</button>
         <h2>레시피북 <small>회색 재료는 지금 부족한 것</small></h2>
         <div class="tabs recipe-tabs">${tabs.map(([k, n]) => `<button data-tab="${k}" class="${tab === k ? 'on' : ''}">${n}</button>`).join('')}</div>
         <div class="scroll">${body}</div>
       </div>`,
      onClose,
    );
    this.on(s, '[data-tab]', (el) => this.recipeBook(p, el.dataset.tab!, onClose));
  }

  // ---------------- 패치노트 ----------------
  patchNotes(onClose: () => void): void {
    const body = PATCH_NOTES.map(
      (n, i) => `<section class="patch ${i === 0 ? 'latest' : ''}"><h3>v${n.version} <small>${n.date}${i === 0 ? ' · 최신' : ''}</small></h3><ul>${n.items.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></section>`,
    ).join('');
    this.open(
      'patchnotes',
      `<div class="panel wide tall">
         <button class="close">${ICONS.close}</button>
         <h2>패치노트 <small>지금 버전 v${GAME_VERSION}</small></h2>
         <div class="scroll">${body}</div>
       </div>`,
      onClose,
    );
  }

  // ---------------- 저장 코드 ----------------
  saveCode(code: string, onClose: () => void): void {
    const s = this.open(
      'savecode',
      `<div class="panel wide">
         <button class="close">${ICONS.close}</button>
         <h2>저장 코드 <small>${code.length.toLocaleString()}자</small></h2>
         <p class="hint">이 코드를 메모장·메신저 등에 복사해 두세요. 타이틀 화면의 <b>저장 코드로 불러오기</b>에 붙여 넣으면 지금 상태로 돌아옵니다. (다른 기기로 옮길 때도 쓸 수 있어요)</p>
         <textarea class="code" readonly>${code}</textarea>
         <div class="menu two"><button class="primary" data-a="copy">복사하기</button><button data-a="close">닫기</button></div>
       </div>`,
      onClose,
    );
    const ta = s.querySelector<HTMLTextAreaElement>('textarea')!;
    this.on(s, '[data-a="copy"]', (b) => {
      ta.select();
      const done = () => (b.textContent = '✔ 복사했습니다');
      navigator.clipboard?.writeText(code).then(done, () => {
        document.execCommand('copy');
        done();
      }) ?? (document.execCommand('copy'), done());
    });
    this.on(s, '[data-a="close"]', () => this.close());
  }

  loadCode(onLoad: (code: string, done: (msg: string) => void) => void, onClose: () => void): void {
    const s = this.open(
      'loadcode',
      `<div class="panel wide">
         <button class="close">${ICONS.close}</button>
         <h2>저장 코드로 불러오기</h2>
         <p class="hint">복사해 둔 저장 코드를 붙여 넣으세요. <b class="bad">지금 이 기기의 진행은 코드의 내용으로 바뀝니다.</b></p>
         <textarea class="code" placeholder="YG1Z:..."></textarea>
         <div class="item-info" data-msg></div>
         <div class="menu two"><button class="primary" data-a="load">불러오기</button><button data-a="close">취소</button></div>
       </div>`,
      onClose,
    );
    const ta = s.querySelector<HTMLTextAreaElement>('textarea')!;
    const msg = s.querySelector<HTMLElement>('[data-msg]')!;
    this.on(s, '[data-a="load"]', () => {
      msg.textContent = '확인 중…';
      onLoad(ta.value, (m) => (msg.innerHTML = m));
    });
    this.on(s, '[data-a="close"]', () => this.close());
  }

  // ---------------- 예/아니오 ----------------
  ask(title: string, text: string, onYes: () => void, onNo: () => void): void {
    const s = this.open(
      'ask',
      `<div class="panel">
         <h2>${title}</h2>
         <p class="hint">${text}</p>
         <div class="menu two"><button class="primary" data-a="yes">예</button><button data-a="no">아니오</button></div>
       </div>`,
      onNo,
    );
    this.on(s, '[data-a="yes"]', onYes);
    this.on(s, '[data-a="no"]', () => this.close());
  }

  // ---------------- 결과 ----------------
  result(info: ResultInfo, onContinue: () => void): void {
    const rows = [...info.items].map(([id, n]) => `<li>${itemGem(id)}${ITEMS[id].name}<b>× ${n}</b></li>`).join('');
    const eqRows = info.equips.map((e) => `<li>${equipGem(e)}<span>${equipTitle(e)}</span><b>장비</b></li>`).join('');
    const lostRows = info.lost ? [...info.lost].map(([id, n]) => `<li class="lost">${itemGem(id)}${ITEMS[id].name}<b>− ${n}</b></li>`).join('') : '';
    const m = Math.floor(info.seconds / 60);
    const sec = Math.floor(info.seconds % 60);
    const s = this.open(
      `result ${info.lost ? 'dead' : ''}`,
      `<div class="panel tall">
         <h2>${info.title}</h2>
         ${info.note ? `<p class="hint">${info.note}</p>` : ''}
         <div class="stats"><span>시간 <b>${m}분 ${sec}초</b></span>${info.stages ? `<span>클리어 <b>${info.stages}방</b></span>` : ''}<span>골드 <b>+${info.gold}</b></span><span>경험치 <b>+${info.exp}</b></span></div>
         <ul class="loot scroll">${rows}${eqRows}${lostRows}${!rows && !eqRows && !lostRows ? '<li class="empty">가져온 전리품이 없습니다</li>' : ''}</ul>
         ${info.lostEquips ? `<p class="hint">잃어버린 장비 ${info.lostEquips}개</p>` : ''}
         <div class="menu"><button class="primary" data-ok>마을로</button></div>
       </div>`,
      onContinue,
    );
    this.on(s, '[data-ok]', () => this.close());
  }

  // ---------------- 캐릭터: 장비 · 창고 · 능력치 · 퀘스트 ----------------
  /** field.bags: 지금 가방들. 던전 안(dungeon)에서는 창고 장비를 쓸 수 없고, 벗은 장비는 가방으로 간다 */
  inventory(p: Progress, quests: Quests, tab: 'equip' | 'skills' | 'stats' | 'quest', onChange: () => void, onClose: () => void, selSlot?: EquipSlot, field?: { bags: Bag[]; dungeon: boolean }, selSkill?: number): void {
    const cls = CLASSES[p.data.currentClass];
    const st = p.stats();
    const c = p.cls;
    let body = '';
    if (tab === 'equip') {
      // 인형 옷 입히기: 가운데 캐릭터, 왼쪽은 몸에 입는 것, 오른쪽은 무기와 장신구
      const slotBox = (slot: EquipSlot) => {
        const e = c.equipment[slot];
        const name = slotName(slot, p.data.currentClass);
        const broken = e && durability(e) <= 0;
        return `<button class="doll-slot ${slot} ${e ? 'filled' : ''} ${selSlot === slot ? 'sel' : ''} ${broken ? 'broken' : ''}" data-slot="${slot}" ${e ? `style="--c:${hex(GRADES[e.grade].color)}"` : ''}>
          ${e ? equipGem(e) : ''}<span class="doll-label">${name}${e && e.plus ? ` +${e.plus}` : ''}</span>${e ? `<i class="dur" style="width:${durability(e)}%"></i>` : ''}</button>`;
      };
      const sel = selSlot ? c.equipment[selSlot] : undefined;
      const info = sel
        ? `${equipTitle(sel)}<br><small>${equipLine(sel) || '<span class="bad">망가짐 — 대장간에서 수리하세요</span>'} · 내구도 ${durability(sel)}/${EQUIP_MAX_DUR}</small> <button data-un="${selSlot}">해제</button>`
        : selSlot
          ? `<span class="dim">${slotName(selSlot, p.data.currentClass)} 칸이 비어 있습니다. 아래 목록에서 장착하세요.</span>`
          : '<span class="dim">칸을 누르면 장비 정보가 나옵니다.</span>';
      const bagEquips = field ? field.bags.flatMap((b) => b.equips()) : [];
      const pool = [...bagEquips, ...(field?.dungeon ? [] : p.data.equips)];
      const list = pool
        .filter((e) => !selSlot || e.slot === selSlot)
        .slice()
        .sort((a, b) => b.tier * 10 + b.grade - (a.tier * 10 + a.grade))
        .map((e) => {
          const ok = p.canEquip(e);
          return `<li>${equipGem(e)}<div>${equipTitle(e)}<small>${bagEquips.includes(e) ? '<span class="ok">[가방]</span> ' : '<span class="dim">[창고]</span> '}${slotName(e.slot, e.cls)} · ${equipLine(e) || '<span class="bad">망가짐</span>'} · 내구 ${durability(e)}${e.cls && e.cls !== p.data.currentClass ? ` · ${CLASSES[e.cls].name} 전용` : ''}</small></div><button data-eq="${e.uid}" ${ok ? '' : 'disabled'}>장착</button></li>`;
        })
        .join('');
      const portrait = heroPortraitUrl(p.data.currentClass, gearLook(c.equipment));
      body = `<div class="scroll"><div class="doll">
          <div class="doll-col">${(['helmet', 'armor', 'pants', 'boots'] as EquipSlot[]).map(slotBox).join('')}</div>
          <div class="doll-body">${portrait ? `<img src="${portrait}" alt="">` : ''}<small>${cls.name} Lv.${c.level}</small></div>
          <div class="doll-col">${(['weapon', 'necklace', 'ring'] as EquipSlot[]).map(slotBox).join('')}
            <div class="doll-stats"><span>공격 <b>${st.atk}</b></span><span>방어 <b>${st.def}</b></span><span>HP <b>${st.maxHp}</b></span><span>치명 <b>${st.crit}%</b></span></div></div>
        </div>
        <div class="item-info">${info}</div>
        <h3>채집 도구 <small>강화·수리: 대장장이 고른 · 제작: 차원집 제작대</small></h3>
        <div class="tool-row">${(['pickaxe', 'axe'] as ToolKind[])
          .map((k) => {
            const t = p.data.tools[k];
            const owned = p.flag(k === 'axe' ? 'tool_axe' : 'tool_pickaxe') > 0;
            if (!owned) return `<div class="tool-card dim">${k === 'axe' ? '도끼' : '곡괭이'} 없음</div>`;
            const r = t.dur / toolMaxDur(t);
            return `<div class="tool-card ${t.dur <= 0 ? 'broken' : ''}">${toolGem(k, t)}<div><b>${toolName(k, t)}</b><small>내구도 <span class="${t.dur <= 0 ? 'bad' : r < 0.2 ? 'warn' : ''}">${t.dur}/${toolMaxDur(t)}</span> · 속도 +${Math.round((toolSpeed(t) - 1) * 100)}%</small><i class="dur" style="width:${Math.round(r * 100)}%"></i></div></div>`;
          })
          .join('')}</div>
        <h3>${field?.dungeon ? '가방 속 장비 <small>던전에서는 가방에 든 장비로만 바꿀 수 있습니다</small>' : '가방·창고의 장비'} ${selSlot ? `<small>${slotName(selSlot, p.data.currentClass)}만 · <a data-slot="">전체 보기</a></small>` : ''}</h3><ul class="list">${list || '<li class="empty">장비가 없습니다</li>'}</ul></div>`;
    } else if (tab === 'skills') {
      const quickRow = c.quick
        .map((idx, slot) => {
          const sk = idx >= 0 ? cls.skills[idx] : null;
          return `<button class="quick-slot ${sk ? 'filled' : ''} ${selSkill === undefined ? '' : 'drop'}" data-quick="${slot}"><span class="key">${slot + 1}</span><b>${sk ? sk.name : '비어 있음'}</b>${sk ? `<small>Lv.${c.skills[idx]}</small>` : ''}</button>`;
        })
        .join('');
      const rows = cls.skills
        .map((sk, i) => {
          const lv = c.skills[i] ?? 0;
          const slot = c.quick.indexOf(i);
          return `<li class="${selSkill === i ? 'sel' : ''} ${lv ? '' : 'locked'}" ${lv ? `data-skillpick="${i}"` : ''}><img class="gem ico" src="${skillIconUrl(p.data.currentClass, i)}" alt=""><div><b class="slot-no">${slot >= 0 ? `[${slot + 1}번 칸]` : ''}</b><b>${sk.name} ${lv ? `<span class="ok">Lv.${lv}</span>` : '<span class="dim">(미습득 · 교관 카엘)</span>'}</b><small>${sk.description} · MP ${sk.mp} · ${sk.cooldown}초</small></div></li>`;
        })
        .join('');
      // 궁극기: 수호자의 차원석으로 열리고, 하나를 골라 궁극기 칸(4·F키)에 둔다
      const open = p.unlockedUlts();
      const cur = p.ultIndex;
      const ultRows = ULTIMATES[p.data.currentClass]
        .map((u, i) => {
          const got = open.includes(i);
          return `<li class="${cur === i ? 'sel' : ''} ${got ? '' : 'locked'}" ${got ? `data-ult="${i}"` : ''}><img class="gem ico" src="${skillIconUrl(p.data.currentClass, 6 + i)}" alt=""><div><b>${u.name} ${cur === i ? '<span class="ok">[장착]</span>' : got ? '<span class="dim">(누르면 장착)</span>' : `<span class="dim">(${u.stone}-10 수호자 처치 시 획득)</span>`}</b><small>${got ? `Lv.${p.ultLevel(i)} · 위력 ${Math.round(ultPower(p.ultLevel(i)) * 100)}% · ` : ''}${u.description} · MP ${u.mp} · ${ultCooldown(p.ultLevel(i))}초</small></div></li>`;
        })
        .join('');
      body = `<div class="scroll">
        <h3>퀵슬롯 <small>${selSkill === undefined ? '아래에서 스킬을 누른 뒤 놓을 칸을 누르세요. 칸을 누르면 비웁니다' : `<b class="ok">${cls.skills[selSkill].name}</b>을(를) 놓을 칸을 누르세요`}</small></h3>
        <div class="quick-row">${quickRow}</div>
        <h3>궁극기 <small>수호자를 처음 쓰러뜨려 차원석을 얻으면 열립니다 · 하나를 골라 궁극기 칸에 둡니다</small></h3><ul class="list">${ultRows}</ul>
        <h3>배운 스킬</h3><ul class="list">${rows}</ul></div>`;
    } else if (tab === 'stats') {
      const next = expToNext(c.level);
      const statRows = STAT_KEYS.map(
        (k) => `<div class="stat-row"><b>${STAT_INFO[k].name}</b><span class="num">${st.base[k]}</span><small>${STAT_INFO[k].desc}</small>
          <button data-stat="${k}" ${c.points > 0 ? '' : 'disabled'}>+1</button><button data-stat5="${k}" ${c.points >= 5 ? '' : 'disabled'}>+5</button></div>`,
      ).join('');
      body = `<div class="scroll">
        <div class="stat-grid">
          <span>직업</span><b>${cls.name} Lv.${c.level}${c.level >= MAX_LEVEL ? ' (최고)' : ''}</b>
          <span>경험치</span><b>${c.exp} / ${next}</b>
          <span>HP</span><b>${st.maxHp}</b>
          <span>MP</span><b>${st.maxMp}</b>
          <span>${cls.damage === 'physical' ? '물리' : '마법'} 공격력</span><b>${st.atk}</b>
          <span>방어력</span><b>${st.def}</b>
          <span>치명타</span><b>${st.crit}%</b>
          <span>공격 속도</span><b>${Math.round(st.speed * 100)}%</b>
          <span>골드</span><b>${p.data.gold}</b>
          <span>차원석</span><b>${p.data.dimStones.length} / 7</b>
        </div>
        <h3>스탯 <small>남은 포인트 <b class="${c.points ? 'ok' : ''}">${c.points}</b> · 레벨업마다 5포인트</small></h3>
        <div class="stat-rows">${statRows}</div>
        ${this.transcendBlock(p)}
        <h3>스킬 <small>교관 카엘에게서 배우고 강화합니다</small></h3><ul class="list">${cls.skills.map((sk, i) => `<li><span class="key">${i + 1}</span><div><b>${sk.name} ${c.skills[i] ? `Lv.${c.skills[i]}` : '<span class="dim">(미습득)</span>'}</b><small>${sk.description} · MP ${sk.mp} · ${sk.cooldown}초</small></div></li>`).join('')}</ul>
      </div>`;
    } else {
      const ql = quests.activeList();
      const row = (q: QuestDef) => {
        const prog = quests.progress(q);
        const done = prog.every((x) => x.cur >= x.need);
        return `<li class="quest ${q.kind}"><div><b>${q.kind === 'main' ? '[메인] ' : '[서브] '}${q.title}</b>
          <small>${prog.map((x) => `${x.text} ${x.cur}/${x.need}`).join(' · ')}</small>
          <small class="${done ? 'ok' : 'dim'}">${done ? `✔ ${npcName(q.npc)}에게 보고하기` : `의뢰인: ${npcName(q.npc)}`}</small></div></li>`;
      };
      const daily = quests.state.daily.list
        .filter((d) => d.accepted)
        .map((d) => {
          const need = objectiveNeed(d.objective);
          const cur = objectiveProgress(d.objective, d.progress, { count: (id) => p.count(id), stones: p.stoneCount, cleared: p.data.cleared, flag: (f) => p.flag(f), discovered: p.discovered });
          return `<li class="quest daily ${d.claimed ? 'claimed' : ''}"><div><b>[일일] ${d.title}</b><small>${objectiveText(d.objective)} ${Math.min(cur, need)}/${need}</small><small class="${d.claimed ? 'dim' : cur >= need ? 'ok' : 'dim'}">${d.claimed ? '보상 받음' : cur >= need ? '✔ 촌장 에단에게 보고하기' : '촌장 에단의 일일 의뢰'}</small></div></li>`;
        })
        .join('');
      body = `<ul class="list scroll">${ql.map(row).join('')}${daily}${!ql.length && !daily ? '<li class="empty">진행 중인 퀘스트가 없습니다. 머리 위에 !가 뜬 주민에게 말을 걸어 보세요.</li>' : ''}</ul>`;
    }
    const s = this.open(
      'inventory',
      `<div class="panel wide tall">
         <button class="close">${ICONS.close}</button>
         <div class="tabs">
           <button data-tab="equip" class="${tab === 'equip' ? 'on' : ''}">장비</button>
           <button data-tab="skills" class="${tab === 'skills' ? 'on' : ''}">스킬</button>
           <button data-tab="stats" class="${tab === 'stats' ? 'on' : ''}">능력치${c.points ? ` <i class="dot">${c.points}</i>` : ''}</button>
           <button data-tab="quest" class="${tab === 'quest' ? 'on' : ''}">퀘스트</button>
         </div>
         ${body}
       </div>`,
      onClose,
    );
    const again = (t = tab, slot = selSlot, sk?: number) => this.inventory(p, quests, t, onChange, onClose, slot, field, sk);
    this.on(s, '[data-ult]', (b) => {
      c.ult = Number(b.dataset.ult);
      onChange();
      again(tab, selSlot);
    });
    this.on(s, '[data-skillpick]', (b) => {
      const i = Number(b.dataset.skillpick);
      again(tab, selSlot, selSkill === i ? undefined : i);
    });
    this.on(s, '[data-quick]', (b) => {
      const slot = Number(b.dataset.quick);
      if (selSkill !== undefined) {
        // 이미 다른 칸에 있으면 그 칸은 비우고 옮긴다
        c.quick = c.quick.map((x) => (x === selSkill ? -1 : x));
        c.quick[slot] = selSkill;
      } else c.quick[slot] = -1;
      onChange();
      again(tab, selSlot);
    });
    this.on(s, '[data-tab]', (b) => again(b.dataset.tab as typeof tab, undefined));
    this.on(s, '[data-slot]', (b) => {
      this.click();
      const slot = (b.dataset.slot || undefined) as EquipSlot | undefined;
      again(tab, slot === selSlot ? undefined : slot);
    });
    this.on(s, '[data-eq]', (b) => {
      if (field && field.bags.some((bg) => bg.equips().some((x) => x.uid === b.dataset.eq))) {
        // 가방 칸의 장비와 끼고 있던 장비를 맞바꾼다
        for (const bag of field.bags) {
          const i = bag.slots.findIndex((x) => x?.equip?.uid === b.dataset.eq);
          if (i < 0) continue;
          const e = bag.slots[i]!.equip!;
          const prev = c.equipment[e.slot];
          bag.slots[i] = prev ? { itemId: 'equip', count: 1, equip: prev } : null;
          c.equipment[e.slot] = e;
          break;
        }
        onChange();
        return again();
      }
      const e = p.data.equips.find((x) => x.uid === b.dataset.eq);
      if (e) p.equip(e);
      onChange();
      again();
    });
    this.on(s, '[data-un]', (b) => {
      const slot = b.dataset.un as EquipSlot;
      if (field?.dungeon) {
        const e = c.equipment[slot];
        if (e && field.bags.some((bag) => bag.addEquip(e))) delete c.equipment[slot];
        else if (e) alert('가방에 빈 칸이 없습니다');
        onChange();
        return again();
      }
      p.unequip(slot);
      onChange();
      again();
    });
    this.on(s, '[data-stat]', (b) => {
      p.allocate(b.dataset.stat as StatKey, 1);
      onChange();
      again();
    });
    this.on(s, '[data-stat5]', (b) => {
      p.allocate(b.dataset.stat5 as StatKey, 5);
      onChange();
      again();
    });
    this.on(s, '[data-tp]', (b) => {
      if (!p.spendTranscend(b.dataset.tp as BonusKey, Number(b.dataset.n ?? 1))) return;
      onChange();
      again();
    });
  }

  /** 능력치 탭: 초월(99레벨 뒤)과 각인·칭호·음식 보너스 합계 */
  private transcendBlock(p: Progress): string {
    const c = p.cls;
    const bo = p.bonuses();
    const sum = (Object.entries(bo) as [BonusKey, number][]).filter(([, v]) => v).map(([k, v]) => bonusText(k, v)).join(' · ');
    const food = p.data.food && p.data.food.until > Date.now() ? `${ITEMS[p.data.food.id]?.name ?? ''} ${Math.ceil((p.data.food.until - Date.now()) / 60000)}분 남음` : '없음';
    let html = `<h3>추가 보너스 <small>각인 · 칭호 · 초월 · 음식</small></h3><p class="hint">${sum || '아직 없습니다 (엔딩 뒤 각인·칭호·초월이 열립니다)'}<br>음식: ${food}</p>`;
    if (c.level < MAX_LEVEL) return html;
    const pts = p.transcendPoints();
    const need = transcendExp(c.tlv ?? 0);
    const spent = p.transcendSpent();
    const shards = p.count('dim_shard');
    const c1 = transcendCost(spent, 1);
    const c5 = transcendCost(spent, 5);
    html += `<h3>초월 Lv.${c.tlv ?? 0} <small>경험치 ${c.texp ?? 0} / ${need} · 남은 초월 포인트 <b class="${pts ? 'ok' : ''}">${pts}</b></small></h3>
      <p class="hint">포인트를 찍을 때 ${inlineGem('dim_shard')}차원 파편이 듭니다 (보유 <b class="${shards >= c1 ? '' : 'bad'}">${shards}</b>). 찍은 포인트 5점마다 1점당 파편이 1개씩 늘어납니다 · 지금 1점당 ${c1}개</p>
      <div class="stat-rows">${TRANSCEND_STATS.map((t) => `<div class="stat-row"><b>${BONUS_NAMES[t.key]}</b><span class="num">${c.tpts?.[t.key] ?? 0}</span><small>1포인트당 ${bonusText(t.key, t.per)}</small>
        <button data-tp="${t.key}" data-n="1" ${pts > 0 && shards >= c1 ? '' : 'disabled'}>+1 <small>(파편 ${c1})</small></button><button data-tp="${t.key}" data-n="5" ${pts >= 5 && shards >= c5 ? '' : 'disabled'}>+5 <small>(파편 ${c5})</small></button></div>`).join('')}</div>`;
    return html;
  }

  // ---------------- 공유 창고: 가방 ⇄ 창고 ----------------
  storage(p: Progress, onClose: () => void, message?: string, onChange?: () => void): void {
    type Sel = { from: 'bag' | 'dim'; i: number } | { from: 'store'; id: string } | { from: 'storeEq'; uid: string } | null;
    let sel: Sel = null;
    let info = message ?? '아이템을 누르고 반대쪽(가방 ↔ 창고)을 누르면 옮겨집니다.';
    const bag = p.invBag;
    const dim = p.dimBagObj;
    const render = () => {
      const cell = (x: Slot | null, from: 'bag' | 'dim', i: number) => {
        if (!x) return '<div class="slot"></div>';
        const on = sel && sel.from === from && sel.i === i ? 'sel' : '';
        return `<div class="slot filled ${on}" data-from="${from}" data-i="${i}">${x.equip ? equipGem(x.equip) : itemGem(x.itemId)}<span class="cnt">${x.equip ? `+${x.equip.plus}` : x.count}</span></div>`;
      };
      // 한 칸에 99개씩 나눠 보여 준다
      const storeItems = ITEM_LIST.filter((it) => p.stored(it.id) > 0)
        .flatMap((it) => stacks(p.stored(it.id)).map((n) => `<div class="slot filled ${sel?.from === 'store' && sel.id === it.id ? 'sel' : ''}" data-store="${it.id}">${itemGem(it.id)}<span class="cnt">${n}</span></div>`))
        .join('');
      const used = p.storageUsed;
      const cap = p.storageCapacity;
      const cost = p.storageExpandCost;
      const emptyCells = Array.from({ length: Math.max(0, Math.min(cap - used, 40)) }, () => '<div class="slot"></div>').join('');
      const storeEq = p.data.equips
        .map((e) => `<div class="slot filled ${sel?.from === 'storeEq' && sel.uid === e.uid ? 'sel' : ''}" data-storeeq="${e.uid}">${equipGem(e)}<span class="cnt">+${e.plus}</span></div>`)
        .join('');
      const toStore = sel && (sel.from === 'bag' || sel.from === 'dim');
      const toBag = sel && (sel.from === 'store' || sel.from === 'storeEq');
      const sc = this.open(
        'storage',
        `<div class="panel wide tall">
           <button class="close">${ICONS.close}</button>
           <h2>공유 창고 <small class="${used > cap ? 'bad' : ''}">${used}/${cap}칸 · 한 칸 ${STORE_STACK}개</small> <button class="tool-sm" data-a="all">재료 모두 창고로</button> ${cost ? `<button class="tool-sm" data-a="expand" ${p.data.gold >= cost ? '' : 'disabled'}>+${STORAGE_EXPAND_STEP}칸 확장 (${cost} G)</button>` : '<small class="ok">최대 칸</small>'}</h2>
           <div class="item-info">${info}</div>
           <div class="store-split scroll">
             <div>
               <h3>가방 <small>${bag.used}/${bag.slots.length}</small></h3>
               <div class="bag-grid inv-grid ${toBag ? 'drop' : ''}" data-grid="bag">${bag.slots.map((x, i) => cell(x, 'bag', i)).join('')}</div>
               <h3>차원가방 <small>${dim.used}/${dim.slots.length}</small></h3>
               <div class="bag-grid inv-grid ${toBag ? 'drop' : ''}" data-grid="dim">${dim.slots.map((x, i) => cell(x, 'dim', i)).join('')}</div>
             </div>
             <div>
               <h3>창고 <small>${used > cap ? '<span class="bad">칸이 넘쳤습니다 — 비우거나 확장하세요</span>' : `빈 칸 ${cap - used}`}</small></h3>
               <div class="store-grid ${toStore ? 'drop' : ''}" data-grid="store">${storeItems}${storeEq}${emptyCells}</div>
             </div>
           </div>
         </div>`,
        onClose,
      );
      sc.querySelectorAll<HTMLElement>('[data-grid]').forEach((grid) =>
        grid.addEventListener('click', (ev) => {
          const el = (ev.target as HTMLElement).closest<HTMLElement>('.slot.filled');
          const g = grid.dataset.grid as 'bag' | 'dim' | 'store';
          // 선택한 것이 있고 반대쪽을 누르면 옮긴다
          if (sel && g === 'store' && (sel.from === 'bag' || sel.from === 'dim')) {
            const b = sel.from === 'bag' ? bag : dim;
            const x = b.slots[sel.i];
            if (x) {
              if (x.equip) {
                if (p.storageHasSlot) {
                  p.data.equips.push(x.equip);
                  b.slots[sel.i] = null;
                  info = `${equipName(x.equip)} → 창고`;
                } else info = '<span class="bad">창고에 빈 칸이 없습니다 (확장하세요)</span>';
              } else {
                const k = p.depositItem(x.itemId, x.count);
                x.count -= k;
                if (x.count <= 0) b.slots[sel.i] = null;
                info = k ? `${ITEMS[x.itemId].name} ×${k} → 창고${x.count > 0 ? ` <span class="bad">(칸이 모자라 ${x.count}개는 가방에)</span>` : ''}` : '<span class="bad">창고에 빈 칸이 없습니다 (확장하세요)</span>';
              }
            }
            sel = null;
            this.click();
            return render();
          }
          if (sel && g !== 'store' && (sel.from === 'store' || sel.from === 'storeEq')) {
            const b = g === 'bag' ? bag : dim;
            if (sel.from === 'store') {
              const id = sel.id;
              const n = b.add(id, p.stored(id));
              if (n > 0) {
                p.data.storage[id] -= n;
                if (p.data.storage[id] <= 0) delete p.data.storage[id];
                info = `${ITEMS[id].name} ×${n} → ${g === 'bag' ? '가방' : '차원가방'}`;
              } else info = '<span class="bad">가방에 빈 칸이 없습니다</span>';
            } else {
              const uid = sel.uid;
              const e = p.data.equips.find((x) => x.uid === uid);
              if (e && b.addEquip(e)) {
                p.data.equips = p.data.equips.filter((x) => x.uid !== uid);
                info = `${equipName(e)} → ${g === 'bag' ? '가방' : '차원가방'}`;
              } else info = '<span class="bad">가방에 빈 칸이 없습니다</span>';
            }
            sel = null;
            this.click();
            return render();
          }
          if (!el) return;
          this.click();
          if (el.dataset.store) {
            const id = el.dataset.store;
            sel = sel?.from === 'store' && sel.id === id ? null : { from: 'store', id };
            info = sel ? `${slotInfo({ itemId: id, count: p.stored(id) })}<br><small class="ok">▶ 가방을 누르면 꺼냅니다</small>` : info;
          } else if (el.dataset.storeeq) {
            const e = p.data.equips.find((x) => x.uid === el.dataset.storeeq)!;
            sel = sel?.from === 'storeEq' && sel.uid === e.uid ? null : { from: 'storeEq', uid: e.uid };
            info = sel ? `${slotInfo({ itemId: 'equip', count: 1, equip: e })}<br><small class="ok">▶ 가방을 누르면 꺼냅니다</small>` : info;
          } else {
            const from = el.dataset.from as 'bag' | 'dim';
            const i = Number(el.dataset.i);
            const same = sel && (sel.from === 'bag' || sel.from === 'dim') && sel.from === from && sel.i === i;
            sel = same ? null : { from, i };
            info = sel ? `${slotInfo((from === 'bag' ? bag : dim).slots[i]!)}<br><small class="ok">▶ 창고를 누르면 보관합니다</small>` : info;
          }
          render();
        }),
      );
      this.on(sc, '[data-a="all"]', () => {
        let n = 0;
        let left = 0;
        for (const b of [bag, dim])
          b.slots.forEach((x, i) => {
            if (!x || x.equip) return;
            const k = p.depositItem(x.itemId, x.count);
            n += k;
            x.count -= k;
            left += x.count;
            if (x.count <= 0) b.slots[i] = null;
          });
        sel = null;
        info = n ? `재료 ${n}개를 창고에 넣었습니다${left ? ` <span class="bad">(칸이 모자라 ${left}개는 가방에)</span>` : ''}` : left ? '<span class="bad">창고에 빈 칸이 없습니다</span>' : '넣을 재료가 없습니다';
        render();
      });
      this.on(sc, '[data-a="expand"]', () => {
        const c = p.storageExpandCost;
        if (!c || p.data.gold < c) return;
        p.data.gold -= c;
        p.data.storageSlots = p.storageCapacity + STORAGE_EXPAND_STEP;
        info = `<b class="ok">창고가 ${p.storageCapacity}칸으로 늘어났습니다</b>`;
        onChange?.();
        render();
      });
    };
    render();
  }

  // ---------------- 차원집 일반 창고 ----------------
  /** 차원집 안의 일반 창고는 모두 하나의 보관함. 가방 또는 공유 창고와 주고받는다 */
  warehouse(p: Progress, b: BuildingState, onChange: () => void, onClose: () => void, side: 'bag' | 'shared' = 'bag', message?: string): void {
    type Sel = { from: 'bag' | 'dim'; i: number } | { from: 'shared' | 'home'; id: string } | null;
    let sel: Sel = null;
    let info = message ?? '아이템을 누르고 반대쪽을 누르면 옮겨집니다. 차원집 안에서는 이 창고의 재료도 제작·건설에 바로 쓰입니다.';
    const bag = p.invBag;
    const dim = p.dimBagObj;
    const render = () => {
      const cap = p.homeCapacity;
      const used = p.homeUsed;
      const cell = (x: Slot | null, from: 'bag' | 'dim', i: number) => {
        if (!x) return '<div class="slot"></div>';
        if (x.equip) return `<div class="slot filled dim-eq">${equipGem(x.equip)}</div>`;
        const on = sel && sel.from === from && sel.i === i ? 'sel' : '';
        return `<div class="slot filled ${on}" data-from="${from}" data-i="${i}">${itemGem(x.itemId)}<span class="cnt">${x.count}</span></div>`;
      };
      const pool = (r: Record<string, number>, from: 'shared' | 'home') =>
        ITEM_LIST.filter((it) => (r[it.id] ?? 0) > 0)
          .flatMap((it) => stacks(r[it.id]).map((n) => `<div class="slot filled ${sel && 'id' in sel && sel.from === from && sel.id === it.id ? 'sel' : ''}" data-${from}="${it.id}">${itemGem(it.id)}<span class="cnt">${n}</span></div>`))
          .join('');
      const empty = Array.from({ length: Math.max(0, Math.min(cap - used, 40)) }, () => '<div class="slot"></div>').join('');
      const left =
        side === 'bag'
          ? `<h3>가방 <small>${bag.used}/${bag.slots.length}</small></h3><div class="bag-grid inv-grid" data-grid="bag">${bag.slots.map((x, i) => cell(x, 'bag', i)).join('')}</div>
             <h3>차원가방 <small>${dim.used}/${dim.slots.length}</small></h3><div class="bag-grid inv-grid" data-grid="dim">${dim.slots.map((x, i) => cell(x, 'dim', i)).join('')}</div>`
          : `<h3>공유 창고 <small>${p.storageUsed}/${p.storageCapacity}칸</small></h3><div class="store-grid" data-grid="shared">${pool(p.data.storage, 'shared') || '<p class="hint">비어 있음</p>'}</div>`;
      const sc = this.open(
        'storage',
        `<div class="panel wide tall">
           <button class="close">${ICONS.close}</button>
           <h2>일반 창고 <small class="${used > cap ? 'bad' : ''}">${used}/${cap}칸 · 한 칸 ${STORE_STACK}개</small> <button class="tool-sm" data-a="all">재료 모두 넣기</button></h2>
           ${this.levelBlock(b, p)}
           <div class="tabs"><button data-side="bag" class="${side === 'bag' ? 'on' : ''}">가방과 주고받기</button><button data-side="shared" class="${side === 'shared' ? 'on' : ''}">공유 창고와 주고받기</button></div>
           <div class="item-info">${info}</div>
           <div class="store-split scroll">
             <div>${left}</div>
             <div>
               <h3>일반 창고 <small>차원집의 일반 창고 ${p.data.factory.buildings.filter((x) => x.type === 'warehouse').length}개가 함께 씀 · 레일로 들어온 것도 여기로</small></h3>
               <div class="store-grid" data-grid="home">${pool(p.home, 'home')}${empty}</div>
             </div>
           </div>
         </div>`,
        onClose,
      );
      const moveToHome = (id: string, n: number) => p.addHome(id, n);
      sc.querySelectorAll<HTMLElement>('[data-grid]').forEach((grid) =>
        grid.addEventListener('click', (ev) => {
          const el = (ev.target as HTMLElement).closest<HTMLElement>('.slot.filled');
          const g = grid.dataset.grid as 'bag' | 'dim' | 'shared' | 'home';
          if (sel && g === 'home' && sel.from !== 'home') {
            if (sel.from === 'shared') {
              const id = sel.id;
              const k = moveToHome(id, p.stored(id));
              if (k) {
                p.data.storage[id] -= k;
                if (p.data.storage[id] <= 0) delete p.data.storage[id];
              }
              info = k ? `${ITEMS[id].name} ×${k} → 일반 창고` : '<span class="bad">일반 창고에 빈 칸이 없습니다</span>';
            } else if ('i' in sel) {
              const si = sel.i;
              const bb = sel.from === 'bag' ? bag : dim;
              const x = bb.slots[si];
              if (x && !x.equip) {
                const k = moveToHome(x.itemId, x.count);
                x.count -= k;
                if (x.count <= 0) bb.slots[si] = null;
                info = k ? `${ITEMS[x.itemId].name} ×${k} → 일반 창고` : '<span class="bad">일반 창고에 빈 칸이 없습니다</span>';
              }
            }
            sel = null;
            this.click();
            onChange();
            return render();
          }
          if (sel && sel.from === 'home' && g !== 'home') {
            const id = sel.id;
            const have = p.homeStored(id);
            let k = 0;
            if (g === 'shared') k = p.depositItem(id, have);
            else k = (g === 'bag' ? bag : dim).add(id, have);
            p.takeHome(id, k);
            info = k ? `${ITEMS[id].name} ×${k} → ${g === 'shared' ? '공유 창고' : g === 'bag' ? '가방' : '차원가방'}` : '<span class="bad">빈 칸이 없습니다</span>';
            sel = null;
            this.click();
            onChange();
            return render();
          }
          if (!el) return;
          this.click();
          if (el.dataset.home) {
            const id = el.dataset.home;
            sel = sel && 'id' in sel && sel.from === 'home' && sel.id === id ? null : { from: 'home', id };
            info = sel ? `${slotInfo({ itemId: id, count: p.homeStored(id) })}<br><small class="ok">▶ 반대쪽을 누르면 꺼냅니다</small>` : info;
          } else if (el.dataset.shared) {
            const id = el.dataset.shared;
            sel = sel && 'id' in sel && sel.from === 'shared' && sel.id === id ? null : { from: 'shared', id };
            info = sel ? `${slotInfo({ itemId: id, count: p.stored(id) })}<br><small class="ok">▶ 일반 창고를 누르면 옮깁니다</small>` : info;
          } else if (el.dataset.from) {
            const from = el.dataset.from as 'bag' | 'dim';
            const i = Number(el.dataset.i);
            sel = sel && 'i' in sel && sel.from === from && sel.i === i ? null : { from, i };
            info = sel ? `${slotInfo((from === 'bag' ? bag : dim).slots[i]!)}<br><small class="ok">▶ 일반 창고를 누르면 넣습니다</small>` : info;
          }
          render();
        }),
      );
      this.on(sc, '[data-side]', (el) => this.warehouse(p, b, onChange, onClose, el.dataset.side as 'bag' | 'shared'));
      this.on(sc, '[data-a="all"]', () => {
        let n = 0;
        let left = 0;
        if (side === 'bag')
          for (const bb of [bag, dim])
            bb.slots.forEach((x, i) => {
              if (!x || x.equip) return;
              const k = moveToHome(x.itemId, x.count);
              n += k;
              x.count -= k;
              left += x.count;
              if (x.count <= 0) bb.slots[i] = null;
            });
        else
          for (const [id, have] of Object.entries(p.data.storage)) {
            const k = moveToHome(id, have);
            n += k;
            left += have - k;
            p.data.storage[id] -= k;
            if (p.data.storage[id] <= 0) delete p.data.storage[id];
          }
        sel = null;
        info = n ? `재료 ${n}개를 일반 창고에 넣었습니다${left ? ` <span class="bad">(칸이 모자라 ${left}개는 그대로)</span>` : ''}` : '넣을 재료가 없거나 빈 칸이 없습니다';
        onChange();
        render();
      });
      this.bindUpgrade(sc, b, p, () => {
        onChange();
        render();
      });
    };
    render();
  }

  // ---------------- 퀘스트 제안 ----------------
  /** NPC와 대화: 인사말을 보여 주고, 이야기·퀘스트·시설 중에서 고른다 */
  npcTalk(name: string, greeting: string, options: { label: string; kind: 'story' | 'report' | 'offer' | 'pending' | 'service' | 'leave'; pick: () => void }[], onClose: () => void): void {
    const mark = { story: '💬', report: '✔', offer: '!', pending: '…', service: '▸', leave: '' } as const;
    const btn = (o: (typeof options)[number], i: number) => `<button class="talk-opt ${o.kind}" data-opt="${i}"><i>${mark[o.kind]}</i><span>${o.label}</span></button>`;
    // 퀘스트·이야기는 스크롤되는 목록, 시설·대화 끝내기는 아래에 고정
    const rows = options.map((o, i) => (o.kind === 'service' || o.kind === 'leave' ? '' : btn(o, i))).join('');
    const fixed = options.map((o, i) => (o.kind === 'service' || o.kind === 'leave' ? btn(o, i) : '')).join('');
    const s = this.open(
      'npc-talk',
      `<div class="panel talk-panel">
         <button class="close">${ICONS.close}</button>
         <h2>${esc(name)}</h2>
         <p class="talk-line">${richText(esc(greeting))}</p>
         ${rows ? `<div class="talk-opts scroll">${rows}</div>` : ''}
         <div class="talk-fixed">${fixed}</div>
       </div>`,
      onClose,
    );
    this.on(s, '[data-opt]', (b) => options[Number(b.dataset.opt)].pick());
  }

  questOffer(q: QuestDef, onAccept: () => void, onClose: () => void): void {
    const obj = q.objectives.map((o) => `<li><span class="key">▸</span><div><b>${objectiveText(o)}</b><small>${o.type === 'clear' ? '' : `${objectiveNeed(o)}${o.type === 'deliver' || o.type === 'gather' || o.type === 'craft' ? '개' : o.type === 'build' ? '개 설치' : '마리'}`}</small></div></li>`).join('');
    const r = q.rewards;
    const rewards = [r.gold ? `${r.gold} G` : '', r.exp ? `경험치 ${r.exp}` : '', ...Object.entries(r.items ?? {}).map(([id, n]) => `${inlineGem(id)}${ITEMS[id].name} ×${n}`)].filter(Boolean).join(' · ');
    const s = this.open(
      'quest-offer',
      `<div class="panel">
         <button class="close">${ICONS.close}</button>
         <h2>${q.kind === 'main' ? '[메인] ' : '[서브] '}${q.title}</h2>
         <ul class="list">${obj}</ul>
         <p class="hint">보상: ${rewards || '없음'}</p>
         <div class="menu"><button class="primary" data-a="accept">수락하기</button></div>
       </div>`,
      onClose,
    );
    this.on(s, '[data-a="accept"]', onAccept);
  }

  /** 촌장의 일일 의뢰 게시판 */
  dailyBoard(p: Progress, quests: Quests, onClaim: (i: number) => void, onAccept: (i: number) => void, onClose: () => void): void {
    const ctx = { count: (id: string) => p.count(id), stones: p.stoneCount, cleared: p.data.cleared, flag: (f: string) => p.flag(f), discovered: p.discovered };
    const rows = quests.state.daily.list
      .map((d, i) => {
        const need = objectiveNeed(d.objective);
        const cur = Math.min(need, objectiveProgress(d.objective, d.progress, ctx));
        const r = d.reward;
        const reward = [r.gold ? `${r.gold} G` : '', r.exp ? `경험치 ${r.exp}` : '', ...Object.entries(r.items ?? {}).map(([id, n]) => `${ITEMS[id].name}×${n}`)].filter(Boolean).join(' · ');
        const btn = d.claimed
          ? '<button disabled>완료</button>'
          : !d.accepted
            ? `<button data-accept="${i}">수락</button>`
            : `<button data-claim="${i}" ${cur < need ? 'disabled' : ''}>${cur < need ? '진행 중' : '완료 보고'}</button>`;
        return `<li class="${d.accepted && !d.claimed ? 'sel' : ''}"><div><b>${d.title}</b><small>${objectiveText(d.objective)} ${d.accepted ? `${cur}/${need}` : `(목표 ${need})`}</small><small class="dim">보상: ${reward}</small></div>${btn}</li>`;
      })
      .join('');
    const s = this.open(
      'daily',
      `<div class="panel wide">
         <button class="close">${ICONS.close}</button>
         <h2>촌장의 일일 의뢰 <small>매일 새로 바뀝니다 · 수락한 의뢰만 진행되고, 다 하면 촌장에게 보고하세요</small></h2>
         <ul class="list">${rows}</ul>
       </div>`,
      onClose,
    );
    this.on(s, '[data-claim]', (b) => onClaim(Number(b.dataset.claim)));
    this.on(s, '[data-accept]', (b) => onAccept(Number(b.dataset.accept)));
  }

  /** 상점 개수 입력 창: 패널 위에 겹쳐 띄운다 */
  private qtyPicker(s: HTMLElement, o: { title: string; unit: number; max: number; verb: string; onOk: (n: number) => void; summary?: (n: number) => string }): void {
    s.querySelector('.qty-pop')?.remove();
    const pop = document.createElement('div');
    pop.className = 'qty-pop';
    pop.innerHTML = `<div class="qty-box">
        <h3>${esc(o.title)}</h3>
        <div class="qty-row">
          <button data-d="-10">−10</button><button data-d="-1">−</button>
          <input type="number" inputmode="numeric" min="1" max="${o.max}" value="1" />
          <button data-d="1">+</button><button data-d="10">+10</button>
        </div>
        <div class="qty-row small"><button data-set="1">1개</button><button data-set="${o.max}">최대 ${o.max}</button></div>
        <p class="qty-total"></p>
        <div class="menu two"><button class="primary" data-ok>${o.verb}</button><button data-no>취소</button></div>
      </div>`;
    (s.querySelector('.panel') ?? s).appendChild(pop);
    const input = pop.querySelector('input')!;
    const total = pop.querySelector<HTMLElement>('.qty-total')!;
    const val = () => Math.max(1, Math.min(o.max, Math.floor(Number(input.value) || 1)));
    const show = () => (total.innerHTML = o.summary ? o.summary(val()) : `${val()}개 × ${o.unit} G = <b class="gold">${val() * o.unit} G</b>`);
    const set = (n: number) => {
      input.value = String(Math.max(1, Math.min(o.max, n)));
      show();
    };
    input.addEventListener('input', show);
    input.addEventListener('change', () => set(val()));
    this.on(pop, '[data-d]', (b) => set(val() + Number(b.dataset.d)));
    this.on(pop, '[data-set]', (b) => set(Number(b.dataset.set)));
    this.on(pop, '[data-no]', () => pop.remove());
    this.on(pop, '[data-ok]', () => o.onOk(val()));
    pop.addEventListener('pointerdown', (e) => e.stopPropagation());
    pop.addEventListener('pointerup', (e) => e.stopPropagation());
    show();
  }

  // ---------------- 몬스터 도감 ----------------
  /** canClaim: 연구자 노아 앞에서만 보상을 받을 수 있다 (다른 곳에서는 보기만) */
  bestiary(p: Progress, canClaim: boolean, onChange: () => void, onClose: () => void, tier = 1, message?: string): void {
    const found = p.discovered;
    const research = p.data.research ?? 0;
    const claimed = (id: string) => p.data.bestiaryClaim?.[id] ?? 0;
    const giveText = (r: BestiaryReward) => [r.gold ? `${r.gold} G` : '', ...Object.entries(r.items).map(([id, n]) => `${ITEMS[id].name}×${n}`)].filter(Boolean).join(' · ');
    const tabs = THEMES.map((t) => {
      const list = BESTIARY.filter((e) => e.tier === t.tier);
      const got = list.filter((e) => p.kills(e.species.id) > 0).length;
      const ready = list.some((e) => killMilestones(e).some((m, i) => i >= claimed(e.species.id) && p.kills(e.species.id) >= m));
      return `<button class="tier-tab ${t.tier === tier ? 'on' : ''}" data-tier="${t.tier}" style="--c:${hex(t.portalColor)}"><b>${t.tier}</b><small>${got}/${list.length}</small>${ready && canClaim ? '<i class="dot"></i>' : ''}</button>`;
    }).join('');
    const cards = BESTIARY.filter((e) => e.tier === tier)
      .map((e) => {
        const sp = e.species;
        const n = p.kills(sp.id);
        const known = n > 0;
        const url = monsterIconUrl(sp, e.tier, e.rank !== 'normal');
        const ms = killMilestones(e);
        const c = claimed(sp.id);
        const chips = ms
          .map((m, i) => {
            const r = milestoneReward(e, i);
            const done = i < c;
            const ready = !done && n >= m;
            return `<div class="bm ${done ? 'done' : ready ? 'ready' : ''}"><span>${m}${e.rank === 'normal' ? '마리' : '번'}</span><small>${giveText(r)}</small>${ready ? `<button data-claim="${sp.id}" ${canClaim ? '' : 'disabled'}>${canClaim ? '받기' : '노아에게'}</button>` : done ? '<b class="ok">받음</b>' : ''}</div>`;
          })
          .join('');
        const tags = [
          e.rank === 'boss' ? '<b class="bad">수호자</b>' : e.rank === 'midboss' ? '<b class="gold">파수꾼</b>' : '',
          known ? FACTION_NAME[sp.faction] : '',
          known ? ARCH_NAME[sp.arch] : '',
        ].filter(Boolean).join(' · ');
        const notes = known
          ? [sp.trait ? `<small class="trait">특성: ${TRAIT_TEXT[sp.trait]}</small>` : '', sp.debuff ? `<small class="debuff">약화: ${DEBUFF_INFO[sp.debuff.id].name} (${DEBUFF_INFO[sp.debuff.id].text})</small>` : '', sp.pack ? `<small class="dim">무리 지어 다님 (${sp.pack}마리)</small>` : ''].join('')
          : '<small class="dim">아직 쓰러뜨린 적 없음</small>';
        return `<li class="beast ${known ? '' : 'unknown'}">
            <img class="beast-img" src="${url}" alt="">
            <div class="beast-info"><b>${known ? sp.name : '???'}</b> <small class="dim">처치 ${n}</small><small>${tags}</small>${notes}<div class="bms">${chips}</div></div>
          </li>`;
      })
      .join('');
    const cols = COLLECTION_MILESTONES.map((m, i) => {
      const done = i < research;
      const ready = !done && found >= m.count;
      return `<div class="bm ${done ? 'done' : ready ? 'ready' : ''}"><span>${m.count}종</span><small>${giveText(m.reward)} · 연구 +${Math.round(RESEARCH_BONUS * 100)}%</small>${ready ? `<button data-col="${i}" ${canClaim && i === research ? '' : 'disabled'}>${canClaim ? '받기' : '노아에게'}</button>` : done ? '<b class="ok">받음</b>' : ''}</div>`;
    }).join('');
    const s = this.open(
      'bestiary',
      `<div class="panel wide tall">
         <button class="close">${ICONS.close}</button>
         <h2>몬스터 도감 <small>발견 ${found}/${BESTIARY.length} · 연구 보너스 공격력·체력 +${Math.round(research * RESEARCH_BONUS * 100)}%</small></h2>
         ${message ? `<div class="notice">${message}</div>` : ''}
         ${canClaim ? '' : '<p class="hint">보상은 마을의 몬스터 연구자 노아에게서 받을 수 있습니다.</p>'}
         <div class="scroll">
           <h3>수집 보상 <small>서로 다른 몬스터를 발견할수록</small></h3>
           <div class="bms wide">${cols}</div>
           <div class="tier-tabs">${tabs}</div>
           <ul class="list beasts">${cards}</ul>
         </div>
       </div>`,
      onClose,
    );
    const again = (t = tier, msg?: string) => this.bestiary(p, canClaim, onChange, onClose, t, msg);
    this.on(s, '[data-tier]', (b) => again(Number(b.dataset.tier)));
    const give = (r: BestiaryReward) => {
      p.data.gold += r.gold;
      for (const [id, n] of Object.entries(r.items)) p.add(id, n);
    };
    this.on(s, '[data-claim]', (b) => {
      if (!canClaim) return;
      const id = b.dataset.claim!;
      const e = BESTIARY_BY_ID[id];
      const i = claimed(id);
      if (!e || p.kills(id) < killMilestones(e)[i]) return;
      const r = milestoneReward(e, i);
      give(r);
      (p.data.bestiaryClaim ??= {})[id] = i + 1;
      onChange();
      again(tier, `<b class="ok">${e.species.name} 연구 보상: ${giveText(r)}</b>`);
    });
    this.on(s, '[data-col]', (b) => {
      if (!canClaim) return;
      const i = Number(b.dataset.col);
      const m = COLLECTION_MILESTONES[i];
      if (i !== research || !m || found < m.count) return;
      give(m.reward);
      p.data.research = research + 1;
      onChange();
      again(tier, `<b class="ok">수집 보상 ${m.count}종: ${giveText(m.reward)} · 연구 보너스 +${Math.round((research + 1) * RESEARCH_BONUS * 100)}%</b>`);
    });
  }

  // ---------------- 상점 ----------------
  shop(p: Progress, onChange: () => void, onClose: () => void, tab: 'buy' | 'sell' = 'buy', toast?: string): void {
    const goods: { id: string; label: string; price: number; make: () => void; equip?: Equip }[] = [
      { id: 'potion', label: '치유 물약', price: 30, make: () => p.add('potion', 1) },
      { id: 'return_stone', label: '귀환석', price: 80, make: () => p.add('return_stone', 1) },
    ];
    const t = Math.max(1, Math.min(3, p.maxTier - 1));
    for (const slot of EQUIP_SLOTS) {
      const e: Equip = { uid: `shop-${slot}`, slot, cls: slot === 'weapon' ? p.data.currentClass : undefined, tier: t, grade: 0, plus: 0 };
      goods.push({
        id: `eq-${slot}`,
        label: equipName(e),
        equip: e,
        price: equipValue(e) * 4,
        make: () => p.data.equips.push({ ...e, uid: `${Date.now()}${slot}${Math.random()}` }),
      });
    }
    let body = '';
    if (tab === 'buy') {
      body = `<ul class="list scroll">${goods
        .map((g, i) => `<li>${g.equip ? equipGem(g.equip) : itemGem(g.id)}<div><b>${esc(g.label)}</b><small>${g.equip ? `기본 장비 · ${equipLine(g.equip)}` : ITEMS[g.id].description}</small></div><button data-buy="${i}" ${p.data.gold >= g.price ? '' : 'disabled'}>${g.price} G</button></li>`)
        .join('')}</ul>`;
    } else {
      const items = ITEM_LIST.filter((i) => p.count(i.id) > 0 && i.value > 0)
        .map((i) => {
          const inBag = p.count(i.id) - p.stored(i.id);
          return `<li>${itemGem(i.id)}<div><b>${i.name} <span class="dim">× ${p.count(i.id)}</span></b><small>개당 ${i.value} G · 창고 ${p.stored(i.id)}${inBag ? ` · 가방 ${inBag}` : ''}</small></div><button data-sell="${i.id}">팔기</button></li>`;
        })
        .join('');
      // 창고 장비 + 가방·차원가방 장비
      const bagEquips = [p.invBag, p.dimBagObj].flatMap((b) => b.equips());
      const eqs = [...p.data.equips, ...bagEquips]
        .map((e) => `<li>${equipGem(e)}<div>${equipTitle(e)}<small>${bagEquips.includes(e) ? '<span class="ok">[가방]</span> ' : '<span class="dim">[창고]</span> '}${equipLine(e)}</small></div><button data-selleq="${e.uid}">${equipValue(e)} G</button></li>`)
        .join('');
      body = `<ul class="list scroll">${items}${eqs}${!items && !eqs ? '<li class="empty">팔 물건이 없습니다</li>' : ''}</ul>`;
    }
    const s = this.open(
      'shop',
      `<div class="panel wide tall">
         <button class="close">${ICONS.close}</button>
         <h2>상인 무트의 가게 <small class="gold">${p.data.gold} G</small></h2>
         <div class="tabs"><button data-tab="buy" class="${tab === 'buy' ? 'on' : ''}">사기</button><button data-tab="sell" class="${tab === 'sell' ? 'on' : ''}">팔기</button></div>
         ${toast ? `<div class="notice">${toast}</div>` : ''}
         ${body}
       </div>`,
      onClose,
    );
    const again = (tb = tab, msg?: string) => {
      onChange();
      this.shop(p, onChange, onClose, tb, msg);
    };
    this.on(s, '[data-tab]', (b) => again(b.dataset.tab as typeof tab));
    this.on(s, '[data-buy]', (b) => {
      const g = goods[Number(b.dataset.buy)];
      const max = Math.min(99, Math.floor(p.data.gold / g.price));
      if (max < 1) return;
      this.qtyPicker(s, { title: `${g.label} 사기`, unit: g.price, max, verb: '사기', onOk: (n) => {
        if (p.data.gold < g.price * n) return;
        p.data.gold -= g.price * n;
        for (let k = 0; k < n; k++) g.make();
        again(tab, `${g.label} ${n}개 구입 −${g.price * n} G`);
      } });
    });
    this.on(s, '[data-sell]', (b) => {
      const id = b.dataset.sell!;
      const max = p.count(id);
      if (max < 1) return;
      this.qtyPicker(s, { title: `${ITEMS[id].name} 팔기`, unit: ITEMS[id].value, max, verb: '팔기', onOk: (n) => {
        n = Math.min(n, p.count(id));
        if (n > 0 && p.take(id, n)) p.data.gold += ITEMS[id].value * n;
        again(tab, `${ITEMS[id].name} ${n}개 판매 +${ITEMS[id].value * n} G`);
      } });
    });
    this.on(s, '[data-selleq]', (b) => {
      const uid = b.dataset.selleq;
      let e = p.data.equips.find((x) => x.uid === uid);
      if (e) p.data.equips = p.data.equips.filter((x) => x !== e);
      else
        for (const bag of [p.invBag, p.dimBagObj]) {
          const i = bag.slots.findIndex((x) => x?.equip?.uid === uid);
          if (i >= 0) {
            e = bag.slots[i]!.equip;
            bag.slots[i] = null;
            break;
          }
        }
      if (!e) return;
      p.data.gold += equipValue(e);
      again(tab, `${equipName(e)} 판매 +${equipValue(e)} G`);
    });
  }

  /** 세라의 도면 상점 */
  blueprints(p: Progress, onBuy: (t: BuildingType) => void, onClose: () => void, message?: string, onBuyUpgrade?: (t: BuildingType, level: number) => void): void {
    // 강화 도면: 건물을 가진 뒤, 다음 레벨 도면 하나씩. 그 단계 던전을 열어야 판다
    const upRows = UPGRADABLE.filter((t) => !BUILDINGS[t].blueprint || p.flag(`bp_${t}`) > 0)
      .map((t) => {
        let lv = 2;
        while (lv <= MAX_BUILDING_LEVEL && p.flag(`bp_${t}_lv${lv}`)) lv++;
        const d = BUILDINGS[t];
        const thumb = buildingThumb(t);
        const icon = thumb ? `<img class="gem ico" src="${thumb}" alt="">` : '';
        if (lv > MAX_BUILDING_LEVEL) return `<li>${icon}<div><b>${d.name} 강화 도면</b><small class="ok">모든 레벨 도면 보유</small></div></li>`;
        const cost = upgradeBlueprintCost(t, lv);
        const opened = p.maxTier >= lv;
        const ok = opened && p.data.gold >= cost.gold && p.hasAll(cost.items);
        const costTxt = [`${cost.gold} G`, ...Object.entries(cost.items).map(([id, n]) => `${ITEMS[id].name} ${p.count(id)}/${n}`)].join(' · ');
        return `<li>${icon}<div><b>${d.name} Lv.${lv} 강화 도면</b><small>${t === 'generator' ? `전력 ${generatorPower(lv)}` : t === 'warehouse' ? `창고 하나당 ${warehouseSlots(lv)}칸` : `${TOOL_TIER_NAMES[lv - 1]} 단계 재료를 가공 · 속도 ×${levelSpeed(lv).toFixed(2)}`}</small><small class="dim">${opened ? costTxt : `${lv}단계 차원문을 열면 판매`}</small></div><button data-up="${t}:${lv}" ${ok ? '' : 'disabled'}>구입</button></li>`;
      })
      .join('');
    const rows = BUILD_ORDER.filter((t) => BUILDINGS[t].blueprint)
      .map((t) => {
        const d = BUILDINGS[t];
        const bp = d.blueprint!;
        const owned = p.flag(`bp_${t}`) > 0;
        const cost = [`${bp.gold} G`, ...Object.entries(bp.items).map(([id, n]) => `${ITEMS[id].name} ${p.count(id)}/${n}`)].join(' · ');
        const ok = !owned && p.data.gold >= bp.gold && p.hasAll(bp.items);
        const thumb = buildingThumb(t);
        return `<li>${thumb ? `<img class="gem ico" src="${thumb}" alt="">` : `<span class="gem" style="--c:${hex(d.color)}"></span>`}<div><b>${d.name} 도면</b><small>${d.description}</small><small class="dim">${owned ? '보유 중' : cost}</small></div><button data-bp="${t}" ${ok ? '' : 'disabled'}>${owned ? '보유' : '구입'}</button></li>`;
      })
      .join('');
    const s = this.open(
      'blueprints',
      `<div class="panel wide tall">
         <button class="close">${ICONS.close}</button>
         <h2>세라의 도면 <small class="gold">${p.data.gold} G</small></h2>
         ${message ? `<div class="notice">${message}</div>` : ''}
         <div class="scroll">
         <p class="notice">도면 없이 바로 지을 수 있는 기본 건물: 마력 발전기 · 마력선 · 레일 · 보관상자 · 제작대 · <b>마력 치유석(HP·MP 회복)</b> · 제련로 — 차원집의 망치 버튼(건설 모드)에서 고르세요.</p>
         <h3>건물 도면 <small>사면 차원집 건설 모드에서 지을 수 있습니다</small></h3>
         <ul class="list">${rows}</ul>
         <h3>강화 도면 <small>설치한 건물을 누르고 업그레이드하면 상위 재료를 가공합니다</small></h3>
         <ul class="list">${upRows}</ul>
         </div>
       </div>`,
      onClose,
    );
    this.on(s, '[data-bp]', (b) => onBuy(b.dataset.bp as BuildingType));
    this.on(s, '[data-up]', (b) => {
      const [t, lv] = b.dataset.up!.split(':');
      onBuyUpgrade?.(t as BuildingType, Number(lv));
    });
  }

  // ---------------- 대장간 (강화 · 수리) ----------------
  forge(p: Progress, onChange: () => void, onClose: () => void, selected?: string, message?: string): void {
    const c = p.cls;
    const worn = Object.values(c.equipment).filter(Boolean) as Equip[];
    // 착용 · 가방 · 차원가방 · 창고의 모든 장비
    const inBags = [p.invBag, p.dimBagObj].flatMap((b) => b.equips());
    const all: Equip[] = [...worn, ...inBags, ...p.data.equips];
    const tools = p.data.tools;
    const toolRows = (['pickaxe', 'axe'] as const)
      .filter((k) => p.flag(k === 'axe' ? 'tool_axe' : 'tool_pickaxe'))
      .map((k) => `<li class="${selected === `tool:${k}` ? 'sel' : ''}" data-pick="tool:${k}">${toolGem(k, tools[k])}<div><b>${toolName(k, tools[k])}</b><small>내구도 <span class="${tools[k].dur <= 0 ? 'bad' : ''}">${tools[k].dur}/${toolMaxDur(tools[k])}</span></small></div></li>`)
      .join('');
    const selTool = selected?.startsWith('tool:') ? (selected.slice(5) as 'pickaxe' | 'axe') : null;
    const sel = selTool ? undefined : (all.find((e) => e.uid === selected) ?? all[0]);
    const durTxt = (e: Equip) => `<span class="${durability(e) <= 0 ? 'bad' : durability(e) < 30 ? 'warn' : 'dim'}">내구 ${durability(e)}</span>`;
    const list = all
      .map((e) => `<li class="${e === sel ? 'sel' : ''}" data-pick="${e.uid}">${equipGem(e)}<div>${equipTitle(e)}<small>${equipLine(e) || '<span class="bad">망가짐</span>'} · ${durTxt(e)}${worn.includes(e) ? ' · 착용 중' : inBags.includes(e) ? ' · 가방' : ' · 창고'}</small></div></li>`)
      .join('');
    const costLine = (ore: string, count: number, gold: number) => {
      const have = p.count(ore);
      return `<p>${inlineGem(ore)}${ITEMS[ore].name} ${count}개 <span class="${have >= count ? 'dim' : 'bad'}">(창고 ${have})</span> · ${gold} G</p>`;
    };
    let detail = '<p class="hint">장비가 없습니다.</p>';
    if (selTool) {
      const t = tools[selTool];
      const cost = toolRepair(t);
      detail = `<p><b>${toolName(selTool, t)}</b> · 내구도 ${t.dur}/${toolMaxDur(t)}</p>
        <p class="hint">${TOOL_TIER_NAMES[t.tier - 1]} 단계 자원까지는 내구도 1, 한 단계 위(${TOOL_TIER_NAMES[t.tier] ?? '-'})는 3씩 닳습니다. 그보다 위는 캘 수 없습니다.<br>
        캐는 속도 +${Math.round((toolSpeed(t) - 1) * 100)}% · 추가 채집 ${Math.round(toolBonusChance(t) * 100)}%</p>`;
      if (cost) {
        const ok = p.count(cost.ore) >= cost.count && p.data.gold >= cost.gold;
        detail += `<h3>수리</h3>${costLine(cost.ore, cost.count, cost.gold)}<div class="menu"><button data-repair-tool="${selTool}" ${ok ? '' : 'disabled'}>수리하기</button></div>`;
      }
      const ec = toolEnhanceCost(t);
      if (ec) {
        const ok = p.count(ec.ore) >= ec.count && p.data.gold >= ec.gold;
        detail += `<h3>강화 → +${t.plus + 1} <small>속도 +6% · 추가 채집 +5%</small></h3>${costLine(ec.ore, ec.count, ec.gold)}<p>성공 확률 <b>${Math.round(ec.rate * 100)}%</b></p><div class="menu"><button class="primary" data-enh-tool="${selTool}" ${ok ? '' : 'disabled'}>강화하기</button></div>`;
      } else detail += '<p class="hint">최대 강화(+10)입니다.</p>';
    } else if (sel) {
      const cost = enhanceCost(sel);
      detail = `<p>${equipTitle(sel)}</p><p class="hint">${equipLine(sel) || '<span class="bad">망가짐</span>'} · 내구도 ${durability(sel)}/${EQUIP_MAX_DUR}</p>`;
      const rc = repairCost(sel);
      if (rc) {
        const ok = p.count(rc.ore) >= rc.count && p.data.gold >= rc.gold;
        detail += `<h3>수리 <small>+${sel.plus} 장비는 ${ITEMS[rc.ore].name}(으)로 고칩니다 · 강화가 높을수록 광석 → 주괴 → 판 → 마력판</small></h3>${costLine(rc.ore, rc.count, rc.gold)}<div class="menu"><button data-repair ${ok ? '' : 'disabled'}>수리하기</button></div>`;
      }
      if (!cost) detail += '<p class="hint">이미 최대 강화(+10)입니다.</p>';
      else {
        const next = { ...sel, plus: sel.plus + 1 };
        const have = p.count(cost.item);
        const ok = have >= cost.count && p.data.gold >= cost.gold;
        detail += `<h3>강화 → +${next.plus}</h3>
          <p class="hint">→ ${equipLine({ ...next, dur: EQUIP_MAX_DUR })}${durability(sel) <= 0 ? " (수리 후)" : ""}</p>
          <p>${inlineGem(cost.item)}${ITEMS[cost.item].name} ${cost.count}개 <span class="${have >= cost.count ? 'dim' : 'bad'}">(보유 ${have})</span></p>
          <p>${cost.gold} G · 성공 확률 <b>${Math.round(cost.rate * 100)}%</b></p>
          <p class="hint">실패해도 단계가 내려가지 않지만 재료는 사라집니다.</p>
          <div class="menu"><button class="primary" data-enh ${ok ? '' : 'disabled'}>강화하기</button></div>`;
      }
      detail += this.engraveBlock(p, sel);
    }
    const s = this.open(
      'forge',
      `<div class="panel wide tall">
         <button class="close">${ICONS.close}</button>
         <h2>대장장이 고른의 대장간 <small class="gold">${p.data.gold} G</small></h2>
         ${message ? `<div class="notice">${message}</div>` : ''}
         <div class="split"><ul class="list pick scroll">${toolRows}${list || '<li class="empty">장비 없음</li>'}</ul><div class="detail">${detail}</div></div>
       </div>`,
      onClose,
    );
    const again = (id?: string, msg?: string) => this.forge(p, onChange, onClose, id, msg);
    this.on(s, '[data-pick]', (el) => again(el.dataset.pick));
    this.on(s, '[data-repair-tool]', (b) => {
      const k = b.dataset.repairTool as 'pickaxe' | 'axe';
      const cost = toolRepair(tools[k]);
      if (!cost || p.count(cost.ore) < cost.count || p.data.gold < cost.gold) return;
      p.take(cost.ore, cost.count);
      p.data.gold -= cost.gold;
      tools[k].dur = toolMaxDur(tools[k]);
      again(`tool:${k}`, '<b class="ok">수리 완료!</b>');
    });
    this.on(s, '[data-enh-tool]', (b) => {
      const k = b.dataset.enhTool as ToolKind;
      const t = tools[k];
      const ec = toolEnhanceCost(t);
      if (!ec || p.count(ec.ore) < ec.count || p.data.gold < ec.gold) return;
      p.take(ec.ore, ec.count);
      p.data.gold -= ec.gold;
      const ok = Math.random() < ec.rate;
      if (ok) {
        t.plus++;
        t.dur = Math.min(toolMaxDur(t), t.dur + 10);
      }
      again(`tool:${k}`, ok ? `<b class="ok">강화 성공! ${toolName(k, t)}</b>` : '<b class="bad">강화 실패…</b>');
    });
    this.on(s, '[data-repair]', () => {
      if (!sel) return;
      const rc = repairCost(sel);
      if (!rc || p.count(rc.ore) < rc.count || p.data.gold < rc.gold) return;
      p.take(rc.ore, rc.count);
      p.data.gold -= rc.gold;
      sel.dur = EQUIP_MAX_DUR;
      onChange();
      again(sel.uid, '<b class="ok">수리 완료!</b>');
    });
    this.on(s, '[data-eng]', (b) => {
      if (!sel) return;
      const stage = Number(b.dataset.eng);
      const lines = (sel.eng ??= []);
      if (stage > lines.length + 1 || stage > ENGRAVE_STAGES) return;
      const cost = engraveCost(stage);
      if (p.data.gold < cost.gold || !p.hasAll(cost.items)) return;
      p.data.gold -= cost.gold;
      p.takeAll(cost.items);
      const line = rollEngrave(stage, new Rng((Math.random() * 2 ** 32) >>> 0));
      const old = lines[stage - 1];
      lines[stage - 1] = line;
      onChange();
      again(sel.uid, `<b class="ok">${ENGRAVE_STAGE_NAMES[stage - 1]} 각인: ${bonusText(line.k, line.v)}</b>${old ? ` <span class="dim">(이전: ${bonusText(old.k, old.v)})</span>` : ''}`);
    });
    this.on(s, '[data-enh]', () => {
      if (!sel) return;
      const cost = enhanceCost(sel)!;
      if (p.count(cost.item) < cost.count || p.data.gold < cost.gold) return;
      p.take(cost.item, cost.count);
      p.data.gold -= cost.gold;
      const success = Math.random() < cost.rate;
      if (success) sel.plus++;
      onChange();
      again(sel.uid, success ? `<b class="ok">강화 성공! +${sel.plus}</b>` : '<b class="bad">강화 실패…</b>');
    });
  }

  /** 대장간: 각인 (엔딩 뒤). 1단부터 차례로 새기고, 새긴 줄은 같은 비용으로 몇 번이든 다시 굴릴 수 있다 */
  private engraveBlock(p: Progress, e: Equip): string {
    if (!p.flag('endgame')) return '';
    const lines = e.eng ?? [];
    const costTxt = (stage: number) => {
      const c = engraveCost(stage);
      const items = Object.entries(c.items).map(([id, n]) => `<span class="${p.count(id) >= n ? '' : 'bad'}">${inlineGem(id)}${ITEMS[id].name} ${p.count(id)}/${n}</span>`).join(' · ');
      return `<span class="${p.data.gold >= c.gold ? '' : 'bad'}">${c.gold} G</span> · ${items}`;
    };
    const can = (stage: number) => {
      const c = engraveCost(stage);
      return p.data.gold >= c.gold && p.hasAll(c.items);
    };
    let rows = '';
    for (let i = 1; i <= ENGRAVE_STAGES; i++) {
      const l = lines[i - 1];
      if (l) {
        const [lo, hi] = engraveRange(l.k, i);
        const pct = hi > lo ? Math.round(((l.v - lo) / (hi - lo)) * 100) : 100;
        rows += `<div class="eng-line"><span class="stage">${ENGRAVE_STAGE_NAMES[i - 1]}</span><b>${bonusText(l.k, l.v)}</b><small class="dim">(범위 안 ${pct}%)</small><button data-eng="${i}" ${can(i) ? '' : 'disabled'}>다시 굴리기</button></div><div class="eng-line"><small class="dim">${costTxt(i)}</small></div>`;
      } else if (i === lines.length + 1) {
        rows += `<div class="eng-line"><span class="stage">${ENGRAVE_STAGE_NAMES[i - 1]}</span><button class="primary" data-eng="${i}" ${can(i) ? '' : 'disabled'}>${ENGRAVE_STAGE_NAMES[i - 1]} 각인 새기기</button></div><div class="eng-line"><small class="dim">${costTxt(i)}</small></div>`;
      } else rows += `<div class="eng-line empty"><span class="stage">${ENGRAVE_STAGE_NAMES[i - 1]}</span><small>앞 단계를 먼저 새기세요</small></div>`;
    }
    return `<h3>${SPK('anvil', '⚒')} 각인 <small>새길 때마다 옵션이 무작위 (공격력·체력·방어·치명타·공속·재사용·골드·이동·궁극기·MP·경험치)</small></h3>
      <p class="hint">단계가 높을수록 값이 크고(1단 ×1 → 5단 ×4) 윗 단계 판이 필요합니다. 원하는 옵션이 나올 때까지 다시 굴릴 수 있습니다.</p>${rows}`;
  }

  // ---------------- 교관: 스킬 배우기·강화 ----------------
  skillShop(p: Progress, onBuy: (i: number) => void, onClose: () => void, message?: string, onUlt?: (i: number) => void): void {
    const c = p.cls;
    const cls = CLASSES[p.data.currentClass];
    const rows = cls.skills
      .map((sk, i) => {
        const lv = c.skills[i] ?? 0;
        const cost = lv === 0 ? SKILL_LEARN[i] : lv < MAX_SKILL_LEVEL ? skillUpgradeCost(i, lv) : null;
        const ok = cost && c.level >= cost.level && p.data.gold >= cost.gold && p.hasAll(cost.items ?? {});
        const label = !cost ? '최대' : lv === 0 ? `배우기 ${cost.gold} G` : `강화 ${cost.gold} G`;
        const itemsTxt = cost?.items
          ? ' · ' + Object.entries(cost.items).map(([id, n]) => `<span class="${p.count(id) >= n ? '' : 'bad'}">${inlineGem(id)}${ITEMS[id].name} ${p.count(id)}/${n}</span>`).join(' · ')
          : '';
        const req = cost ? `필요 레벨 ${cost.level}${c.level < cost.level ? ' <span class="bad">(부족)</span>' : ''}${itemsTxt}` : '';
        return `<li><img class="gem ico" src="${skillIconUrl(p.data.currentClass, i)}" alt=""><div><b>${sk.name} ${lv ? `<span class="ok">Lv.${lv}</span>` : '<span class="dim">(미습득)</span>'}</b>
          <small>${sk.description} · MP ${sk.mp} · ${sk.cooldown}초</small>
          <small class="dim">${lv ? `위력 +${(lv - 1) * 15}% · 재사용 -${(lv - 1) * 6}%` : ''} ${req}</small></div>
          <button data-skill="${i}" ${ok ? '' : 'disabled'}>${label}</button></li>`;
      })
      .join('');
    const open = p.unlockedUlts();
    const ultRows = ULTIMATES[p.data.currentClass]
      .map((u, i) => {
        const got = open.includes(i);
        const lv = p.ultLevel(i);
        const cost = got ? ultUpgradeCost(lv) : null;
        const ok = cost && c.level >= cost.level && p.data.gold >= cost.gold && p.hasAll(cost.items);
        const itemsTxt = cost ? ' · ' + Object.entries(cost.items).map(([id, n]) => `<span class="${p.count(id) >= n ? '' : 'bad'}">${inlineGem(id)}${ITEMS[id].name} ${p.count(id)}/${n}</span>`).join(' · ') : '';
        const req = cost ? `필요 레벨 ${cost.level}${c.level < cost.level ? ' <span class="bad">(부족)</span>' : ''} · <span class="${p.data.gold >= cost.gold ? '' : 'bad'}">${cost.gold} G</span>${itemsTxt}` : '';
        const next = cost ? ` → Lv.${lv + 1}: 위력 ${Math.round(ultPower(lv + 1) * 100)}% · ${ultCooldown(lv + 1)}초` : '';
        return `<li class="${got ? '' : 'locked'}"><img class="gem ico" src="${skillIconUrl(p.data.currentClass, 6 + i)}" alt=""><div><b>${u.name} ${got ? `<span class="ok">Lv.${lv}</span>` : `<span class="dim">(${u.stone}-10 수호자 처치 시 획득)</span>`}</b>
          <small>${u.description} · 위력 ${Math.round(ultPower(lv) * 100)}% · ${ultCooldown(lv)}초${next}</small>
          <small class="dim">${req}</small></div>
          <button data-ult="${i}" ${ok ? '' : 'disabled'}>${!got ? '잠김' : cost ? '강화' : '최대'}</button></li>`;
      })
      .join('');
    const s = this.open(
      'skills',
      `<div class="panel wide tall">
         <button class="close">${ICONS.close}</button>
         <h2>교관 카엘의 훈련장 <small>${cls.name} · <span class="gold">${p.data.gold} G</span></small></h2>
         ${message ? `<div class="notice">${message}</div>` : ''}
         <p class="hint">스킬은 직업마다 따로 배웁니다. 강화할 때마다 공격 스킬은 위력 +15%, 방어·보조 스킬은 지속 시간이 늘고, 재사용 대기 -6% (최대 Lv.${MAX_SKILL_LEVEL}). 상위 스킬은 판·마력 금속이 필요합니다. 배운 스킬은 캐릭터 → 스킬에서 퀵슬롯에 놓으세요.</p>
         <ul class="list scroll">${rows}
           <li class="sub-head"><div><b>궁극기 강화</b><small class="dim">${inlineGem('dim_shard')}차원 파편은 5단계 이상 파수꾼·수호자와 차원의 끝에서 모은 차원 가루를 차원집의 차원 응축기로 압축해 만듭니다. 레벨마다 위력 +25%, 재사용 대기 -5초 (최대 Lv.${MAX_ULT_LEVEL}).</small></div></li>
           ${ultRows}</ul>
       </div>`,
      onClose,
    );
    this.on(s, '[data-skill]', (b) => onBuy(Number(b.dataset.skill)));
    this.on(s, '[data-ult]', (b) => onUlt?.(Number(b.dataset.ult)));
  }

  // ---------------- 직업의 전당 ----------------
  classHall(p: Progress, onPick: (id: ClassId) => void, onClose: () => void): void {
    const cards = CLASS_ORDER.map((id) => {
      const c = CLASSES[id];
      const unlocked = p.data.unlockedClasses.includes(id);
      const lv = p.data.classes[id].level;
      return `<button class="class-card ${unlocked ? '' : 'locked'} ${p.data.currentClass === id ? 'on' : ''}" data-cls="${id}" ${unlocked ? '' : 'disabled'} style="--c:${hex(c.look.tunic)}">
          ${heroPortraitUrl(id) ? `<img class="cls-portrait" src="${heroPortraitUrl(id)}" alt="">` : `<span class="badge-cls">${c.short}</span>`}
          <b>${c.name}</b>
          <small>${unlocked ? `Lv.${lv} · ${c.basic}` : '스토리를 진행하면 해금'}</small>
        </button>`;
    }).join('');
    const s = this.open(
      'hall',
      `<div class="panel wide">
         <button class="close">${ICONS.close}</button>
         <h2>직업의 전당</h2>
         <p class="hint">레벨·스탯·장비는 직업마다 따로, 차원집과 창고는 모두 함께 씁니다.</p>
         <div class="class-grid">${cards}</div>
       </div>`,
      onClose,
    );
    this.on(s, '[data-cls]', (b) => onPick(b.dataset.cls as ClassId));
  }

  // ---------------- 공장: 발전기 ----------------
  /** 건물 레벨 표시와 업그레이드 버튼 (세라의 강화 도면이 있어야 한다) */
  private levelBlock(b: BuildingState, p: Progress): string {
    if (!UPGRADABLE.includes(b.type)) return '';
    const lv = b.level ?? 1;
    const next = lv + 1;
    const speed = b.type === 'generator' ? `전력 ${generatorPower(lv)}` : b.type === 'warehouse' ? `${warehouseSlots(lv)}칸` : `속도 ×${levelSpeed(lv).toFixed(2)} · ${TOOL_TIER_NAMES[lv - 1]} 단계 재료까지`;
    let html = `<div class="level-box"><b>Lv.${lv}</b> <small>${speed}</small>`;
    if (next > MAX_BUILDING_LEVEL) html += ' <small class="ok">최고 레벨</small>';
    else if (!p.flag(`bp_${b.type}_lv${next}`)) html += `<small class="dim">Lv.${next}: 세라에게서 강화 도면(Lv.${next})을 사야 합니다</small>`;
    else {
      const cost = buildingUpgradeCost(b.type, next);
      const ok = p.hasAll(cost);
      html += `<small>Lv.${next} → ${b.type === 'generator' ? `전력 ${generatorPower(next)}` : b.type === 'warehouse' ? `${warehouseSlots(next)}칸` : `${TOOL_TIER_NAMES[next - 1]} 재료 가공 · 속도 ×${levelSpeed(next).toFixed(2)}`}</small>
        <small>${Object.entries(cost).map(([id, n]) => `<span class="${p.count(id) >= n ? '' : 'bad'}">${inlineGem(id)}${ITEMS[id].name} ${p.count(id)}/${n}</span>`).join(' · ')}</small>
        <button class="primary" data-upgrade ${ok ? '' : 'disabled'}>Lv.${next}로 업그레이드</button>`;
    }
    return html + '</div>';
  }

  /** 설치된 건물의 방향(출구)을 돌린다 */
  private bindRotate(s: HTMLElement, b: BuildingState, redraw: () => void): void {
    this.on(s, '[data-rotate]', () => {
      b.dir = ((b.dir + 1) % 4) as BuildingState['dir'];
      redraw();
    });
  }

  private bindUpgrade(s: HTMLElement, b: BuildingState, p: Progress, redraw: () => void): void {
    this.on(s, '[data-upgrade]', () => {
      const next = (b.level ?? 1) + 1;
      const cost = buildingUpgradeCost(b.type, next);
      if (!p.flag(`bp_${b.type}_lv${next}`) || !p.takeAll(cost)) return;
      b.level = next;
      redraw();
    });
  }

  generator(f: Factory, b: BuildingState, p: Progress, onChange: () => void, onClose: () => void): void {
    const net = f.networkInfo(b);
    const rows = ESSENCES.map((id) => {
      const inside = b.buffer?.[id] ?? 0;
      const have = p.count(id);
      return `<li>${itemGem(id)}<div><b>${ITEMS[id].name}</b><small>${Math.round(ESSENCE_BURN[id] / 60)}분 · 생산 속도 ×${ESSENCE_BOOST[id].toFixed(2)}</small><small>발전기 안 ${inside}개 · 창고 ${have}개</small></div>
        <button data-put="${id}" data-n="1" ${have ? '' : 'disabled'}>+1</button><button data-put="${id}" data-n="10" ${have ? '' : 'disabled'}>+10</button><button data-put="${id}" data-n="all" ${have ? '' : 'disabled'}>전부</button>
        <button data-take="${id}" ${inside ? '' : 'disabled'}>빼기</button></li>`;
    }).join('');
    const s = this.open(
      'factory-config',
      `<div class="panel wide tall">
         <button class="close">${ICONS.close}</button>
         <h2>마력 발전기 <button class="tool-sm rot" data-rotate>↻ 방향 돌리기</button></h2>
         ${this.levelBlock(b, p)}
         <p class="hint">넣어 둔 정수 중 <b>좋은 것부터</b> 탑니다. 좋은 정수일수록 오래 타고, 타는 동안 이 발전기에 이어진 기계가 더 빨리 만듭니다.<br>
           연료는 <b>돌아가는 기계가 쓰는 전력만큼</b> 줄어듭니다 (기계가 많이 돌수록 빨리 닳고, 쉬는 기계는 전력을 쓰지 않음). 수요가 공급보다 크면 기계들이 그만큼 느려집니다. 발전기 레벨을 올리면 공급 전력이 +15씩 늘어납니다.</p>
         <p>지금 타는 연료: <b>${b.fuel && b.fuel > 0 ? `${ITEMS[b.fuelId ?? 'essence_low'].name} ${Math.ceil(b.fuel)}초 분량` : '없음'}</b> · 생산 속도 <b>×${(net?.boost ?? 1).toFixed(2)}</b><br>
           전력망 공급 ${net?.supply ?? 0} / 수요 ${net?.demand ?? 0} · 연료 소모 ${net && net.supply > 0 ? `<b>${Math.round(Math.min(1, net.demand / net.supply) * 100)}%</b> 속도` : '멈춤'}</p>
         <ul class="list scroll">${rows}</ul>
       </div>`,
      onClose,
    );
    const again = () => {
      onChange();
      this.generator(f, b, p, onChange, onClose);
    };
    this.bindUpgrade(s, b, p, again);
    this.bindRotate(s, b, again);
    this.on(s, '[data-put]', (el) => {
      const id = el.dataset.put!;
      const n = el.dataset.n === 'all' ? p.count(id) : Math.min(p.count(id), Number(el.dataset.n));
      if (n > 0 && p.take(id, n)) b.buffer![id] = (b.buffer![id] ?? 0) + n;
      again();
    });
    this.on(s, '[data-take]', (el) => {
      const id = el.dataset.take!;
      const n = b.buffer![id] ?? 0;
      if (n > 0) {
        p.add(id, n);
        delete b.buffer![id];
      }
      again();
    });
  }

  // ---------------- 공장: 보관상자 ----------------
  box(b: BuildingState, p: Progress, onChange: () => void, onClose: () => void): void {
    const inside = Object.entries(b.buffer ?? {}).filter(([, n]) => n > 0);
    const insideRows = inside
      .map(([id, n]) => `<li>${itemGem(id)}<div><b>${ITEMS[id].name}</b><small>상자 안 ${n}개</small></div><button data-out="${id}" data-n="1">1개</button><button data-out="${id}" data-n="10">10개</button><button data-out="${id}" data-n="all">전부 꺼내기</button></li>`)
      .join('');
    const storeRows = ITEM_LIST.filter((i) => i.kind !== 'key' && p.count(i.id) > 0)
      .map((i) => `<li>${itemGem(i.id)}<div><b>${i.name}</b><small>창고 ${p.count(i.id)}개</small></div><button data-in="${i.id}" data-n="1">1개</button><button data-in="${i.id}" data-n="10">10개</button><button data-in="${i.id}" data-n="all">전부 넣기</button></li>`)
      .join('');
    const s = this.open(
      'factory-config',
      `<div class="panel wide tall">
         <button class="close">${ICONS.close}</button>
         <h2>보관상자 <small>${boxTotal(b)} / ${BOX_CAPACITY}</small> <button class="tool-sm rot" data-rotate>↻ 방향 돌리기</button></h2>
         <div class="tabs">
           <button data-mode="in" class="${b.mode === 'in' ? 'on' : ''}">투입 (앞 기계로 보내기)</button>
           <button data-mode="out" class="${b.mode === 'out' ? 'on' : ''}">출하 (완성품 받기)</button>
         </div>
         <div class="scroll">
           <h3>상자 안</h3>
           <ul class="list">${insideRows || '<li class="empty">비어 있습니다</li>'}</ul>
           <h3>창고에서 넣기</h3>
           <ul class="list">${storeRows || '<li class="empty">창고가 비어 있습니다</li>'}</ul>
         </div>
       </div>`,
      onClose,
    );
    const again = () => {
      onChange();
      this.box(b, p, onChange, onClose);
    };
    this.bindRotate(s, b, again);
    this.on(s, '[data-mode]', (el) => {
      b.mode = el.dataset.mode as 'in' | 'out';
      again();
    });
    this.on(s, '[data-out]', (el) => {
      const id = el.dataset.out!;
      const have = b.buffer![id] ?? 0;
      const n = el.dataset.n === 'all' ? have : Math.min(have, Number(el.dataset.n));
      if (n > 0) {
        b.buffer![id] -= n;
        if (b.buffer![id] <= 0) delete b.buffer![id];
        p.add(id, n);
      }
      again();
    });
    this.on(s, '[data-in]', (el) => {
      const id = el.dataset.in!;
      const room = BOX_CAPACITY - boxTotal(b);
      const n = Math.min(room, el.dataset.n === 'all' ? p.count(id) : Math.min(p.count(id), Number(el.dataset.n)));
      if (n > 0 && p.take(id, n)) b.buffer![id] = (b.buffer![id] ?? 0) + n;
      again();
    });
  }

  // ---------------- 공장: 기계 ----------------
  // ---------------- 제작대: 판 · 조립 · 채집 도구 · 장비 제작, 레벨업 ----------------
  workbench(f: Factory, b: BuildingState, p: Progress, onChange: () => void, onClose: () => void, tab: 'plates' | 'assemble' | 'tools' | 'equip' | 'level' = 'plates', message?: string): void {
    const lv = b.level ?? 1;
    const speed = levelSpeed(lv);
    const busy = !!b.job;
    const verb = busy ? '추가' : '제작';
    const fmtTime = (sec: number) => {
      const t = Math.ceil(sec / speed);
      return t >= 60 ? `${Math.floor(t / 60)}분${t % 60 ? ` ${t % 60}초` : ''}` : `${t}초`;
    };
    const costHtml = (c: CraftCost, n = 1) =>
      [
        ...Object.entries(c.items).map(([id, k]) => `<span class="${p.count(id) >= k * n ? '' : 'bad'}">${inlineGem(id)}${ITEMS[id].name} ${p.count(id)}/${k * n}</span>`),
        ...(c.gold ? [`<span class="${p.data.gold >= c.gold * n ? '' : 'bad'}">${c.gold * n} G</span>`] : []),
        ...(c.time ? [`<span class="dim">${SPK('hourglass', '⏱')} ${fmtTime(c.time * n)}</span>`] : []),
      ].join(' · ');
    const afford = (c: CraftCost, n = 1) => p.data.gold >= c.gold * n && Object.entries(c.items).every(([id, k]) => p.count(id) >= k * n);
    const queueFull = (b.queue?.length ?? 0) >= WORKBENCH_QUEUE_MAX;
    const can = (c: CraftCost) => afford(c) && !queueFull;
    const btn = (attr: string, c: CraftCost, label = verb) => `<button ${attr} ${can(c) ? '' : 'disabled'}>${label}</button>`;
    /** 가진 재료·골드로 만들 수 있는 최대 개수 */
    const maxCount = (c: CraftCost) => Math.min(99, ...Object.entries(c.items).map(([id, k]) => Math.floor(p.count(id) / k)), c.gold ? Math.floor(p.data.gold / c.gold) : 99);
    let body = '';
    if (tab === 'plates') {
      const rows = Array.from({ length: lv }, (_, i) => i + 1)
        .map((t) => {
          const c = plateCraftCost(t);
          const id = TIER_PLATE[t - 1];
          const m = manaPlateCraftCost(t);
          const mid = MANA_PLATE_OF(t);
          return `<li>${itemGem(id)}<div><b>${ITEMS[id].name} <small class="dim">보유 ${p.count(id)}</small></b><small>${TOOL_TIER_NAMES[t - 1]} 장비·도구 +1~+5 강화</small><small>${costHtml(c)}</small></div>${btn(`data-item="${id}:${t}:plate"`, c)}</li>
            <li>${itemGem(mid)}<div><b>${ITEMS[mid].name} <small class="dim">보유 ${p.count(mid)}</small></b><small>${TOOL_TIER_NAMES[t - 1]} 장비·도구 +6~+10 강화</small><small>${costHtml(m)}</small></div>${btn(`data-item="${mid}:${t}:mplate"`, m)}</li>`;
        })
        .join('');
      body = `<p class="hint">판 = 주괴 2 + 같은 단계 판자 2 (+1~+5 강화) · 마력판 = 마력 금속 2 + 같은 단계 판자 2 (+6~+10 강화). 완성품은 앞쪽 레일로 나갑니다.</p><ul class="list scroll">${rows}</ul>`;
    } else if (tab === 'assemble') {
      const rows = recipesFor('workbench')
        .map((r) => {
          const c: CraftCost = { items: r.inputs, gold: 0, time: r.time };
          const locked = r.tier > lv;
          return `<li class="${locked ? 'locked' : ''}">${itemGem(r.output)}<div><b>${ITEMS[r.output].name}${r.count > 1 ? ` ×${r.count}` : ''} <small class="dim">보유 ${p.count(r.output)}</small>${locked ? ` <small class="dim">(Lv.${r.tier} 필요)</small>` : ''}</b><small>${ITEMS[r.output].description}</small><small>${costHtml(c)}</small></div>${locked ? '' : btn(`data-item="${r.output}:${r.tier}:recipe"`, c)}</li>`;
        })
        .join('');
      body = `<p class="hint">여러 재료를 조립해 만듭니다. 완성품은 앞쪽 레일로 나갑니다.</p><ul class="list scroll">${rows}</ul>`;
    } else if (tab === 'tools') {
      body = (['pickaxe', 'axe'] as ToolKind[])
        .flatMap((k) => {
          const cur = p.data.tools[k];
          const owned = p.flag(k === 'axe' ? 'tool_axe' : 'tool_pickaxe') > 0;
          return Array.from({ length: lv }, (_, i) => i + 1)
            .filter((t) => !owned || t > cur.tier)
            .map((t) => {
              const c = toolCraftCost(t);
              return `<li>${toolGem(k, { tier: t, plus: 0, dur: 1 })}<div><b>${TOOL_TIER_NAMES[t - 1]} ${TOOL_KIND_NAMES[k]}</b><small>${TOOL_TIER_NAMES[t - 1]}${t < 7 ? `·${TOOL_TIER_NAMES[t]}` : ''} 자원까지 채집 · 내구도 ${toolMaxDur({ tier: t, plus: 0, dur: 0 })}</small><small>${costHtml(c)}</small></div>${btn(`data-tool="${k}:${t}"`, c)}</li>`;
            });
        })
        .join('');
      body = `<p class="hint">지금: ${toolName('pickaxe', p.data.tools.pickaxe)} · ${toolName('axe', p.data.tools.axe)}. 완성되면 지금 도구와 바뀝니다 (강화 단계는 초기화).</p><ul class="list scroll">${body || '<li class="empty">만들 수 있는 더 좋은 도구가 없습니다. 제작대 레벨을 올리세요.</li>'}</ul>`;
    } else if (tab === 'equip') {
      const rows: string[] = [];
      for (let t = lv; t >= 1; t--)
        for (const slot of EQUIP_SLOTS) {
          const e: Equip = { uid: '', slot, cls: slot === 'weapon' ? p.data.currentClass : undefined, tier: t, grade: 0, plus: 0 };
          const c = equipCraftCost(slot, t);
          const mc = equipManaCraftCost(slot, t);
          rows.push(`<li>${equipGem(e)}<div><b>${equipName(e)}</b><small>${equipLine(e)}</small><small>일반: ${costHtml(c)}</small><small class="mana-line">${SPK('sparkle', '✨')} 마력 제작 (고급 이상): ${costHtml(mc)}</small></div>${btn(`data-eqc="${slot}:${t}"`, c)}<button class="mana-btn" data-eqm="${slot}:${t}" ${can(mc) ? '' : 'disabled'}>${SPK('sparkle', '✨')} 마력</button></li>`);
        }
      body = `<p class="hint">일반 제작은 일반 등급, <b>${SPK('sparkle', '✨')} 마력 제작</b>(판자 대신 마력 판자)은 고급 이상 (희귀 30% · 영웅 9% · 유니크 2.5% · 전설 0.5%). 차원 등급은 제작할 수 없고 보스에게서만 나옵니다. 완성된 장비는 창고로 들어갑니다. 무기는 지금 직업(${CLASSES[p.data.currentClass].name}) 전용입니다.</p><ul class="list scroll">${rows.join('')}</ul>`;
    } else {
      const c = workbenchUpgradeCost(lv);
      body = c
        ? `<p>제작대 Lv.${lv} → <b>Lv.${lv + 1}</b></p><p class="hint">${TOOL_TIER_NAMES[lv]} 단계 판·도구·장비를 만들 수 있게 되고, 제작 속도가 ×${speed.toFixed(2)} → ×${levelSpeed(lv + 1).toFixed(2)}가 됩니다.</p>
          <p>${costHtml(c)}</p><div class="menu"><button class="primary" data-up ${afford(c) ? '' : 'disabled'}>레벨 올리기</button></div>`
        : '<p class="ok">최고 레벨입니다.</p>';
    }
    const job = b.job;
    const outN = b.out?.length ?? 0;
    const statusText = () => {
      const j = b.job;
      if (!j) return '';
      if ((b.out?.length ?? 0) >= WORKBENCH_OUT_MAX) return '<span class="bad">출구가 가득 차서 멈춤 — 완성품을 받거나 앞쪽에 레일·출하 상자를 두세요</span>';
      if (f.powerOf(b) > 0) return `<span class="ok">가동 중 · 한 개에 ${fmtTime(j.time)}</span>`;
      return `<span class="bad">${f.connected(b) ? '전력 부족 — 발전기에 마력 정수를 넣으세요' : '전력 없음 — 마력선으로 발전기와 이으세요'}</span>`;
    };
    const queue = b.queue ?? [];
    const queueHtml = queue.length
      ? `<ul class="wb-queue">${queue.map((j, i) => `<li>${workJobIcon(j)}<span>${workJobName(j)} ×${j.left}</span><button class="tool-sm" data-unq="${i}">✕</button></li>`).join('')}</ul>`
      : '';
    const jobHtml = job
      ? `<div class="wb-job">${workJobIcon(job)}<div class="wb-main"><div><b>${workJobName(job)}</b> 제작 중${job.left > 1 ? ` · 남은 ${job.left}개` : ''} <b data-pct>${Math.floor((b.progress ?? 0) * 100)}%</b></div><span class="bar"><i data-bar style="width:${Math.round((b.progress ?? 0) * 100)}%"></i></span><small data-status>${statusText()}</small></div><button class="tool-sm" data-cancel>취소</button></div>${queue.length ? `<div class="wb-qhead">예약 ${queue.length}/${WORKBENCH_QUEUE_MAX} <small class="dim">— 지금 작업이 끝나면 차례로 만듭니다</small></div>${queueHtml}` : `<p class="hint wb-tip">제작 중에도 아래에서 <b>추가</b>를 누르면 예약됩니다 (같은 것을 누르면 개수만 늘어남)</p>`}`
      : `<div class="notice">대기 중 — 아래에서 만들 것을 고르면 전력을 쓰며 제작이 시작됩니다${f.connected(b) ? '' : ' <span class="bad">(마력선에 연결되어 있지 않음)</span>'}</div>`;
    const outHtml = outN ? `<div class="notice">완성품 ${outN}개가 제작대에 쌓여 있습니다 (앞쪽 → 방향으로 레일을 이으면 자동으로 나갑니다) <button class="tool-sm" data-collect>창고로 받기</button></div>` : '';
    const s = this.open(
      'workbench',
      `<div class="panel wide tall">
         <button class="close">${ICONS.close}</button>
         <h2>제작대 Lv.${lv} <small class="gold">${p.data.gold} G</small> <button class="tool-sm rot" data-rotate>↻ 방향 돌리기</button></h2>
         ${jobHtml}${outHtml}
         ${message ? `<div class="notice">${message}</div>` : ''}
         <div class="tabs">
           <button data-tab="plates" class="${tab === 'plates' ? 'on' : ''}">판 합성</button>
           <button data-tab="assemble" class="${tab === 'assemble' ? 'on' : ''}">조립</button>
           <button data-tab="tools" class="${tab === 'tools' ? 'on' : ''}">채집 도구</button>
           <button data-tab="equip" class="${tab === 'equip' ? 'on' : ''}">장비</button>
           <button data-tab="level" class="${tab === 'level' ? 'on' : ''}">레벨업</button>
         </div>
         ${body}
       </div>`,
      onClose,
    );
    const again = (t = tab, msg?: string) => this.workbench(f, b, p, onChange, onClose, t, msg);
    this.bindRotate(s, b, () => again());
    // 열려 있는 동안 진행도를 갱신하고, 작업이 바뀌면 다시 그린다
    const key = () => `${b.job ? `${b.job.id}:${b.job.left}` : '-'}:${b.out?.length ?? 0}:${(b.queue ?? []).map((j) => `${j.id}${j.left}`).join(',')}`;
    const seen = key();
    const timer = window.setInterval(() => {
      if (!s.isConnected || !s.querySelector('.panel')) return window.clearInterval(timer);
      const now = key();
      // 개수 입력 창이 열려 있으면 닫힐 때까지 다시 그리지 않는다
      if (now !== seen && !s.querySelector('.qty-pop')) {
        window.clearInterval(timer);
        again(tab);
        return;
      }
      const pct = Math.floor((b.progress ?? 0) * 100);
      const bar = s.querySelector<HTMLElement>('[data-bar]');
      const txt = s.querySelector<HTMLElement>('[data-pct]');
      if (bar) bar.style.width = `${pct}%`;
      if (txt) txt.textContent = `${pct}%`;
      const st = s.querySelector<HTMLElement>('[data-status]');
      if (st) {
        const html = statusText();
        if (st.innerHTML !== html) st.innerHTML = html;
      }
    }, 300);
    const start = (c: CraftCost, n: number, make: Omit<WorkJob, 'left' | 'time' | 'cost'>) => {
      if (n < 1 || !afford(c, n)) return false;
      const job: WorkJob = { ...make, left: n, time: c.time, cost: { items: c.items, gold: c.gold } };
      if (!canEnqueue(b, job)) return false;
      p.takeAll(Object.fromEntries(Object.entries(c.items).map(([id, k]) => [id, k * n])));
      p.data.gold -= c.gold * n;
      enqueueJob(b, job);
      onChange();
      return true;
    };
    /** 개수를 고르고 제작(또는 예약)한다 */
    const pick = (title: string, c: CraftCost, make: Omit<WorkJob, 'left' | 'time' | 'cost'>, maxN = 99) => {
      const max = Math.min(maxN, maxCount(c));
      if (max < 1) return;
      const wasBusy = !!b.job;
      this.qtyPicker(s, {
        title,
        unit: 0,
        max,
        verb: wasBusy ? '예약 추가' : '제작 시작',
        summary: (n) => costHtml(c, n),
        onOk: (n) => {
          if (start(c, n, make)) again(tab, `<b class="ok">${title} ×${n} ${wasBusy ? '예약 추가!' : '제작 시작!'}</b>`);
        },
      });
    };
    this.on(s, '[data-tab]', (el) => again(el.dataset.tab as typeof tab));
    this.on(s, '[data-item]', (el) => {
      const [id, t, kind] = el.dataset.item!.split(':');
      const tier = Number(t);
      const r = kind === 'recipe' ? recipesFor('workbench').find((x) => x.output === id)! : null;
      const c = kind === 'plate' ? plateCraftCost(tier) : kind === 'mplate' ? manaPlateCraftCost(tier) : { items: r!.inputs, gold: 0, time: r!.time };
      pick(ITEMS[id].name, c, { kind: 'item', id, tier, count: r?.count ?? 1 });
    });
    this.on(s, '[data-tool]', (el) => {
      const [k, t] = el.dataset.tool!.split(':') as [ToolKind, string];
      // 도구는 만들면 지금 도구와 바뀌므로 한 번에 하나만
      pick(`${TOOL_TIER_NAMES[Number(t) - 1]} ${TOOL_KIND_NAMES[k]}`, toolCraftCost(Number(t)), { kind: 'tool', id: k, tier: Number(t), count: 1 }, 1);
    });
    const equipStart = (slot: EquipSlot, t: number, mana: boolean) => {
      const c = mana ? equipManaCraftCost(slot, t) : equipCraftCost(slot, t);
      const e: Equip = { uid: '', slot, cls: slot === 'weapon' ? p.data.currentClass : undefined, tier: t, grade: 0, plus: 0 };
      pick(`${mana ? '[마력] ' : ''}${equipName(e)}`, c, { kind: 'equip', id: slot, tier: t, mana, cls: e.cls, count: 1 });
    };
    this.on(s, '[data-eqc]', (el) => {
      const [slot, t] = el.dataset.eqc!.split(':') as [EquipSlot, string];
      equipStart(slot, Number(t), false);
    });
    this.on(s, '[data-eqm]', (el) => {
      const [slot, t] = el.dataset.eqm!.split(':') as [EquipSlot, string];
      equipStart(slot, Number(t), true);
    });
    const refund = (j: WorkJob) => {
      for (const [id, k] of Object.entries(j.cost.items)) p.add(id, k * j.left);
      p.data.gold += j.cost.gold * j.left;
    };
    this.on(s, '[data-unq]', (el) => {
      const i = Number(el.dataset.unq);
      const j = b.queue?.[i];
      if (!j) return;
      refund(j);
      b.queue!.splice(i, 1);
      onChange();
      again(tab, `예약한 ${workJobName(j)} ×${j.left}을(를) 취소하고 재료를 돌려받았습니다`);
    });
    this.on(s, '[data-cancel]', () => {
      const j = b.job;
      if (!j) return;
      refund(j);
      b.job = b.queue?.shift() ?? null;
      b.progress = 0;
      onChange();
      again(tab, `${workJobName(j)} 제작을 취소하고 재료 ${j.left}개 분량을 돌려받았습니다`);
    });
    this.on(s, '[data-collect]', () => {
      const n = b.out?.length ?? 0;
      for (const id of b.out ?? []) p.add(id, 1);
      b.out = [];
      onChange();
      again(tab, `완성품 ${n}개를 창고로 옮겼습니다`);
    });
    this.on(s, '[data-up]', () => {
      const c = workbenchUpgradeCost(lv);
      if (!c || !afford(c)) return;
      p.takeAll(c.items);
      p.data.gold -= c.gold;
      b.level = lv + 1;
      onChange();
      again('level', `<b class="ok">제작대 Lv.${lv + 1}!</b>`);
    });
  }

  machine(f: Factory, b: BuildingState, p: Progress, onChange: () => void, onClose: () => void): void {
    const def = BUILDINGS[b.type];
    let body = `<p class="hint">${def.description}</p>`;
    if (b.crafting) {
      const r = RECIPE_BY_ID[b.crafting];
      body += `<div class="notice">생산 중: ${inlineGem(r.output)}<b>${ITEMS[r.output].name}</b> ×${r.count} · ${Math.floor((b.progress ?? 0) * 100)}% (총 ${r.time}초)</div>`;
    }
    if (MACHINE_TYPES.has(b.type)) {
      const list = RECIPES.filter((r) => r.machine === b.type)
        .map((r) => `<li class="${r.tier > (b.level ?? 1) ? 'locked' : ''}">${itemGem(r.output)}<div><b>${ITEMS[r.output].name}${r.count > 1 ? ` ×${r.count}` : ''}${r.tier > (b.level ?? 1) ? ` <small class="dim">(Lv.${r.tier} 필요)</small>` : ''}</b><small>${Object.entries(r.inputs).map(([id, n]) => `${ITEMS[id].name}×${n}`).join(' + ')} · ${r.time}초</small></div></li>`)
        .join('');
      body += `<h3>레시피 <small>들어오는 재료에 따라 자동</small></h3><ul class="list">${list}</ul>`;
    }
    const net = f.networkInfo(b);
    const statusText = { working: '가동 중', 'no-power': '전력 부족 (발전기 연료 확인)', idle: '재료 대기', blocked: '출구 막힘', 'no-recipe': '설계 선택 필요' }[f.status(b)];
    body += `<p class="hint">${f.connected(b) ? `전력망: 공급 ${net?.supply ?? 0} / 수요 ${net?.demand ?? 0}${net && net.boost > 1 ? ` · 연료 효과 생산 속도 ×${net.boost.toFixed(2)}` : ""}` : '<span class="bad">마력선에 연결되어 있지 않습니다</span>'} · 상태: <b>${statusText}</b></p>`;
    const buf = Object.entries(b.buffer ?? {}).filter(([, n]) => n > 0);
    if (buf.length) body += `<p class="hint">대기 중인 재료: ${buf.map(([id, n]) => `${ITEMS[id].name} ${n}`).join(', ')}</p>`;
    const miss = f.missingInputs(b);
    if (miss)
      body = `<div class="notice warn-box">${SPK('warning', '⚠')} <b>${ITEMS[miss.recipe.output].name}</b>을(를) 만들려면 ${Object.entries(miss.missing)
        .map(([id, n]) => `${inlineGem(id)}<b>${ITEMS[id].name} ${n}개</b>`)
        .join(', ')}가 더 필요합니다. 투입 상자에 함께 넣어 주세요.</div>` + body;
    const s = this.open(
      'factory-config',
      `<div class="panel wide tall">
         <button class="close">${ICONS.close}</button>
         <h2>${def.name} <button class="tool-sm rot" data-rotate>↻ 방향 돌리기</button></h2>
         ${this.levelBlock(b, p)}
         <div class="scroll">${body}</div>
       </div>`,
      onClose,
    );
    this.bindUpgrade(s, b, p, () => {
      onChange();
      this.machine(f, b, p, onChange, onClose);
    });
    this.bindRotate(s, b, () => {
      onChange();
      this.machine(f, b, p, onChange, onClose);
    });
    this.on(s, '[data-recipe]', (el) => {
      for (const [id, n] of Object.entries(b.buffer ?? {})) if (n > 0) p.add(id, n);
      b.buffer = {};
      b.recipe = el.dataset.recipe!;
      onChange();
      this.machine(f, b, p, onChange, onClose);
    });
  }

  factoryExpand(p: Progress, onExpand: () => void, onClose: () => void): void {
    const next = FACTORY_SIZES[p.data.factory.sizeLevel + 1];
    let body = '<p>이미 가장 넓은 차원집입니다.</p>';
    if (next?.cost) {
      const cost = next.cost;
      const ok = p.data.gold >= cost.gold && p.hasAll(cost.items);
      body = `<p>공장 넓이 ${p.factorySize}×${p.factorySize} → <b>${next.size}×${next.size}</b></p>
        <ul class="list">${Object.entries(cost.items).map(([id, n]) => `<li>${itemGem(id)}<div><b>${ITEMS[id].name}</b></div><b class="num ${p.count(id) >= n ? '' : 'bad'}">${p.count(id)} / ${n}</b></li>`).join('')}
        <li>${itemGem('gold')}<div><b>골드</b></div><b class="num ${p.data.gold >= cost.gold ? '' : 'bad'}">${p.data.gold} / ${cost.gold}</b></li></ul>
        <div class="menu"><button class="primary" data-x ${ok ? '' : 'disabled'}>확장하기</button></div>`;
    }
    const s = this.open('factory-config', `<div class="panel"><button class="close">${ICONS.close}</button><h2>차원집 확장</h2>${body}</div>`, onClose);
    this.on(s, '[data-x]', onExpand);
  }

  // ---------------- 알림 ----------------
  notice(title: string, html: string, onOk: () => void, button = '확인'): void {
    const s = this.open('notice-screen', `<div class="panel"><h2>${title}</h2>${html}<div class="menu"><button class="primary" data-ok>${button}</button></div></div>`, onOk);
    this.on(s, '[data-ok]', () => this.close());
  }

  offlineReward(seconds: number, produced: Map<string, number>, onOk: () => void): void {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const rows = [...produced].filter(([, n]) => n > 0).map(([id, n]) => `<li>${itemGem(id)}${ITEMS[id].name}<b>+${n}</b></li>`).join('');
    this.notice(
      '오프라인 보상',
      `<p class="hint">자리를 비운 ${h ? `${h}시간 ` : ''}${m}분 동안 차원집 공장이 돌아갔습니다. 출하 보관상자를 확인해 보세요.</p><ul class="loot">${rows || '<li class="empty">새로 만들어진 것이 없습니다</li>'}</ul>`,
      onOk,
    );
  }
}

const NPC_NAMES: Record<string, string> = { trainer: '교관 카엘', chief: '촌장 에단', guide: '안내인 리아', smith: '대장장이 고른', engineer: '마공학자 세라', merchant: '상인 무트', stranger: '???', researcher: '몬스터 연구자 노아' };
export const npcName = (id: string) => NPC_NAMES[id] ?? id;
