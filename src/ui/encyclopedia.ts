import { BONUS_NAMES, bonusText, ENGRAVE_OPTS, ENGRAVE_STAGES, engraveCost, FOODS, TITLES, TRANSCEND_STATS, transcendPointCost, type BonusKey } from '../data/bonus';
import { CLASS_ORDER, CLASSES, MAX_SKILL_LEVEL, SKILL_LEARN, STAT_INFO, ULTIMATES, ultPower, type ClassId } from '../data/classes';
import { equipManaCraftCost, plateCraftCost, rollManaGrade } from '../data/crafting';
import {
  AFFIXES,
  AFFIX_IDS,
  RIFT_TIME,
  RUSH_DAILY,
  RUSH_DIFFS,
  TRIAL_GRADES,
  TRIAL_TIME,
  TRIAL_HP,
  riftReward,
  rushReward,
  towerFirstClear,
} from '../data/endgame';
import { AWAKEN_HOLD, awakenCost, SKILL_AWAKEN, ULT_AWAKEN } from '../data/awaken';
import { specialPool, specialRange, specialRerollCost, SPECIALS, type SpecialKey } from '../data/special';
import { enhanceCost, EQUIP_MAX_DUR, EQUIP_SLOTS, GRADES, repairMaterial, SERIES, SERIES_IDS, slotName, type Equip } from '../data/equipment';
import { PRODUCER_CAP, PRODUCER_LIMIT, PRODUCER_MAX_LEVEL, producerTime } from '../data/factory';
import { BUILD_ORDER, BUILDINGS, ESSENCE_BOOST, ESSENCE_BURN, FACTORY_SIZES, MAX_BUILDING_LEVEL, OFFLINE_CAP_HOURS, RECIPES, generatorPower, type BuildingType } from '../data/factory';
import { ESSENCE_TIERS, ITEMS, ORE_TIERS, TIER_MANA_PLATE, TIER_PLANK, TIER_PLATE, WOOD_TIERS } from '../data/items';
import { BOSS_RESPAWN_MS, BOSS_TIME_LIMIT, FARM_COOLDOWN_MS } from '../data/monsters';
import { BOSS_SPECIES, MIDBOSS_SPECIES } from '../data/species';
import { THEMES } from '../data/themes';
import { TIER_INGOT, TOOL_TIER_NAMES } from '../data/tools';
import { ultUpgradeCost } from '../data/ultUpgrade';
import { BAG_MAX_LEVEL, BAG_STEP, DIM_BAG_MAX, DIM_BAG_START, STORAGE_MAX_LEVEL, storageSlotsFor, STORE_STACK, type Progress } from '../game/Progress';
import { BAG_SLOTS } from '../config';
import { NPCS } from '../game/scenes/VillageScene';
import { bustUrl, equipIconUrl, heroPortraitUrl, itemIconUrl, monsterIconUrl, skillIconUrl, toolIconUrl, weaponIconUrl } from './itemIcons';
import { buildingThumb } from './thumbs';

/**
 * 종합 백과사전: 게임 규칙을 항목별로 쉽게 정리한다.
 * 숫자는 게임 데이터에서 바로 읽어 와서, 밸런스를 바꿔도 백과사전이 따라간다.
 * '차원의 끝'(엔드 콘텐츠)은 모든 스테이지를 클리어한 뒤에 열린다.
 */

export interface EncyPage {
  id: string;
  name: string;
  /** 탭 아이콘 (아이템 그림) */
  icon: string;
  /** 잠겼으면 조건 문구 */
  locked?: string;
  html: () => string;
}

const hex = (c: number) => `#${c.toString(16).padStart(6, '0')}`;
const img = (src: string, cls = 'enc-img') => (src ? `<img class="${cls}" src="${src}" alt="">` : '');
/** 아이템 하나: 그림 + 이름 (+개수) */
const it = (id: string, n?: number) => (ITEMS[id] ? `<span class="enc-chip">${img(itemIconUrl(id), 'enc-ico')}${ITEMS[id].name}${n !== undefined ? ` ×${n}` : ''}</span>` : id);
const items = (r: Record<string, number>) => Object.entries(r).map(([id, n]) => it(id, n)).join(' ');
const eq = (e: Partial<Equip>) => img(equipIconUrl({ uid: '', slot: 'helmet', tier: 1, grade: 0, plus: 0, ...e } as Equip), 'enc-ico');
const card = (title: string, body: string, pic = '') => `<div class="enc-card">${pic ? `<div class="enc-pic">${pic}</div>` : ''}<div class="enc-body"><h4>${title}</h4>${body}</div></div>`;
const table = (head: string[], rows: string[][]) =>
  `<div class="enc-table-wrap"><table class="enc-table"><thead><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const tip = (t: string) => `<p class="enc-tip">💡 ${t}</p>`;
const flow = (steps: string[]) => `<div class="enc-flow">${steps.map((s) => `<span>${s}</span>`).join('<b>→</b>')}</div>`;
const min = (ms: number) => Math.round(ms / 60000);
const pct = (v: number) => `${Math.round(v * 100)}%`;

const SIGNATURE_TEXT: Record<string, string> = {
  b1: '뿌리 가시가 줄지어 솟는다(둔화) · 대지 울림 고리 세 겹 — 고리 사이 틈에 서기',
  b2: '도끼를 휘두르며 2~3번 연속 돌진 · 도끼 회오리로 쫓아온다 · 전투 함성(6초 격노)',
  b3: '고드름 비(줄마다 빈틈 하나) · 순간이동 후 얼음 파편 · 절대 냉기(품으로 파고들기)',
  b4: '수정 기둥을 세워 십자 광선 · 침묵 저주(스킬 봉인) · 나선 탄막',
  b5: '유도 미사일 연사(계속 움직이기) · 과열 대폭발(멀리 도망) · 회전 레이저',
  b6: '용암 분출(세 겹 물결, 용암이 남음) · 화염 돌진(지나간 자리에 불길)',
  b7: '차원 붕괴 바둑판(두 번에 나눠 터짐) · 순간이동 · 십자→대각 베기',
  m1: '멧돼지 연속 돌진 · 내려찍기 · 포자 웅덩이',
  m2: '부하 소환 · 폭탄 투척 · 전투 함성',
  m3: '내려찍기 · 고드름 비 · 도약 · 절대 냉기',
  m4: '창 연속 찌르기 · 순간이동 · 침묵 저주',
  m5: '유도 미사일 · 회전 레이저 · 돌진',
  m6: '화염 돌진 · 용암 분출 · 도약',
  m7: '연속 찌르기 · 차원 붕괴 바둑판 · 십자 베기',
};

const NPC_ROLE: Record<string, string> = {
  chief: '이야기의 중심. 매일 의뢰 3개(수락한 것만 진행)와 납품 의뢰를 준다.',
  guide: '처음 온 사람을 돕는 안내인. 튜토리얼·메인 퀘스트를 준다.',
  smith: '대장간: 장비·도구 강화, 수리, 각인·특수 옵션 다시 굴리기(엔딩 뒤).',
  engineer: '마공학자: 공장 건물 도면·강화 도면, 차원집 확장.',
  merchant: '상점: 물약을 사고, 필요 없는 재료·장비를 판다.',
  trainer: '교관: 스킬 배우기·강화, 궁극기 강화(차원 파편).',
  researcher: '몬스터 연구자: 도감에 새 몬스터가 오르면 보상을 준다. 일반 몬스터 1000마리 → 그 몬스터의 능력치 +2, 파수꾼 30번 → 모든 능력치 +1, 수호자 30번 → 모든 능력치 +2, 단계 마스터(그 단계 일반 몬스터 모두 1000마리) → 모든 능력치 +3. 영구, 모든 직업 공통.',
  stranger: '정체를 알 수 없는 인물. 이야기를 따라가면 만나게 된다.',
};

function basics(): string {
  return `
  <h3>게임의 흐름</h3>
  ${flow(['🏘 차원마을', '🌀 차원문', '⚔ 던전(10개의 방)', '🎒 재료·장비', '🏭 차원집 공장', '🔨 대장간 강화', '⬆ 더 깊은 단계'])}
  <p>던전에서 몬스터를 잡고 광석·나무를 캐서 돌아온 뒤, 공장에서 재료를 가공해 장비를 강화하고 더 깊은 단계로 내려간다. 7단계 수호자의 차원석을 모두 모으면 마지막 이야기가 열린다.</p>
  <h3>조작</h3>
  ${table(
    ['동작', '휴대폰', 'PC'],
    [
      ['이동', '왼쪽 조이스틱', 'WASD · 방향키 (또는 마우스 클릭 이동)'],
      ['공격', '[공격] 버튼', 'J · 클릭'],
      ['회피', '신발 버튼', 'Space'],
      ['스킬', '스킬 버튼 3개', '1 · 2 · 3'],
      ['궁극기', '궁극기 버튼', 'F'],
      ['물약', '물약 버튼', 'Q'],
      ['채집·대화', '채집/대화 버튼', 'E'],
      ['지도 · 가방 · 메뉴', '위쪽 버튼', 'M · I · Esc'],
    ],
  )}
  ${tip('메뉴 → 🎮 조작 설정: PC는 키보드 이동/마우스 클릭 이동(오른쪽·왼쪽 버튼 선택), 클릭 공격 켜고 끄기, 모든 키 바꾸기. 휴대폰은 [버튼 배치 편집]으로 공격·회피·스킬·물약 버튼을 끌어 옮기고 크기를 바꾼다 (초기화 가능).')}
  <h3>퀘스트</h3>
  <p>머리 위에 <b>!</b>가 뜬 주민에게 말을 걸면 퀘스트를 받는다. 촌장 에단은 매일 일일 의뢰 3개를 주는데, <b>수락한 의뢰만</b> 진행된다. 목표를 채우면 의뢰한 주민에게 보고.</p>
  ${tip('화면 왼쪽 퀘스트 알림판은 머리글을 눌러 접고 펼 수 있다. 캐릭터 → 퀘스트 탭의 [표시] 체크로 알림판에 띄울 퀘스트를 고른다.')}
  <h3>쓰러지면</h3>
  ${card('일반 가방은 잃는다', `<p>던전에서 쓰러지면 <b>일반 가방</b>의 짐은 모두 잃는다. <b>차원가방</b>과 <b>물약 주머니</b>는 지켜진다.</p>${tip('귀한 것은 가방 화면에서 차원가방으로 옮겨 두자. 귀환석을 쓰면 짐을 모두 들고 마을로 돌아온다.')}`, img(itemIconUrl('return_stone')))}
  <h3>내구도</h3>
  <p>장비는 맞을 때(방어구)·때릴 때(무기) 조금씩 닳는다(최대 ${EQUIP_MAX_DUR}). 0이 되면 능력치가 사라지니 대장간에서 수리하자.</p>`;
}

function classes(): string {
  const cls = (id: ClassId) => {
    const c = CLASSES[id];
    const dodge = id === 'sword' ? '구르기' : id === 'mage' ? '블링크(순간이동)' : '후방 도약';
    const skills = c.skills.map((s, i) => `<li>${img(skillIconUrl(id, i), 'enc-ico')}<b>${s.name}</b> <small>MP ${s.mp} · ${s.cooldown}초 · Lv.${SKILL_LEARN[i].level}부터</small><br><small class="dim">${s.description}</small></li>`).join('');
    const ults = ULTIMATES[id].map((u) => `<li><b>${u.name}</b> <small>MP ${u.mp} · ${u.stone}단계 차원석 + Lv.${u.level}에 해금</small><br><small class="dim">${u.description}</small></li>`).join('');
    return card(
      `${img(weaponIconUrl(id), 'enc-ico')} ${c.name} <small>무기: ${c.weaponNoun} · 회피: ${dodge} · 기본 공격: ${c.basic}</small>`,
      `<ul class="enc-list">${skills}</ul><p class="enc-sub">궁극기</p><ul class="enc-list">${ults}</ul>`,
      img(heroPortraitUrl(id), 'enc-portrait'),
    );
  };
  return `
  <p>직업은 세 가지. 직업마다 <b>레벨·스탯·장비·스킬이 따로</b> 쌓이고, 마을의 <b>직업의 전당</b>에서 언제든 바꿀 수 있다. 검사로 시작하고, 마법사와 궁수는 이야기를 따라가면 열린다.</p>
  ${CLASS_ORDER.map(cls).join('')}
  <h3>스탯</h3>
  <p>레벨이 오를 때마다 스탯 포인트 5점. 가방 화면의 [능력치]에서 찍는다.</p>
  ${table(['스탯', '효과'], Object.values(STAT_INFO).map((s) => [s.name, s.desc]))}
  <h3>스킬·궁극기 강화</h3>
  <p>궁극기는 수호자의 차원석을 얻고 <b>첫 번째는 Lv.15, 두 번째는 Lv.35</b>가 되면 열린다. 캐릭터 → 스킬에서 하나를 골라 궁극기 칸에 둔다. 궁극기·스킬은 던전에서만 쓸 수 있다.</p><p>교관 카엘에게 스킬을 배우고 Lv.${MAX_SKILL_LEVEL}까지 올린다(골드 + 판 + 마력 정수). 강화할 때마다 공격 스킬은 위력 +15%, 방어·보조 스킬은 지속 시간이 늘고, 재사용 대기는 Lv.5까지 −6%씩·그 뒤로 −2%씩. 효과는 Lv.4~6에서 고리·불꽃이, Lv.7~10에서 문양·빛기둥·금빛 불꽃이 더해진다. 배운 스킬은 캐릭터 → 스킬에서 퀵슬롯(1·2·3)에 놓는다 (스킬을 누르고 칸을 누른다). 궁극기는 수호자의 차원석으로 열리고, 엔딩 뒤 <b>차원 파편</b>으로 Lv.5까지 올린다 (레벨마다 위력 +${pct(ultPower(2) - 1)}, 재사용 −5초).</p>
  ${table(['궁극기', '필요 파편'], [1, 2, 3, 4].map((lv) => [`Lv.${lv} → ${lv + 1}`, it('dim_shard', ultUpgradeCost(lv)!.items.dim_shard)]))}
  <h3>스킬 각성</h3>
  <p>스킬 <b>Lv.${MAX_SKILL_LEVEL}</b>(궁극기는 Lv.5)이면 교관 카엘에게 최고급 재료를 내고 각성한다. 각성은 두 방향 중 하나를 골라 쓰고, 교관에게 가면 <b>언제든 공짜로</b> 바꿀 수 있다.</p>
  <ul class="enc-list">
    <li><b>A · 충전형</b> — 스킬을 2번까지 모아 두었다가 연달아 쓴다 (버튼에 남은 횟수).</li>
    <li><b>B · 집중형</b> — 버튼을 꾹 누르면 최대 ${AWAKEN_HOLD}초 힘을 모으고(버튼 둘레가 금빛으로 차오름), 떼는 순간 훨씬 강하게 나간다. 모으는 동안은 천천히 걷는다.</li>
  </ul>
  ${table(['비용', '재료'], [['스킬', `${awakenCost(false).gold.toLocaleString()} G · ${items(awakenCost(false).items)}`], ['궁극기', `${awakenCost(true).gold.toLocaleString()} G · ${items(awakenCost(true).items)}`]])}
  ${CLASS_ORDER.map((c) => table([`${CLASSES[c].name} 스킬`, 'A · 충전형', 'B · 집중형'], [...CLASSES[c].skills.map((sk, i) => [sk.name, SKILL_AWAKEN[c][i].a.name, `${SKILL_AWAKEN[c][i].b.name}<br><small class="dim">${SKILL_AWAKEN[c][i].b.desc.replace('꾹 눌러 힘을 모은다. ', '')}</small>`]), ...ULTIMATES[c].map((u, i) => [`${u.name} (궁극기)`, ULT_AWAKEN[c][i].a.name, `${ULT_AWAKEN[c][i].b.name}<br><small class="dim">${ULT_AWAKEN[c][i].b.desc.replace('꾹 눌러 힘을 모은다. ', '')}</small>`])])).join('')}`;
}

function equipment(): string {
  const gradeRows = GRADES.map((g, i) => [`<span class="enc-grade" style="--c:${hex(g.color)}">${eq({ slot: 'armor', tier: 3, grade: i })}${g.name}</span>`, `×${g.mult.toFixed(2)}`, i === 6 ? '수호자·파수꾼만 아주 낮은 확률로' : i >= 4 ? '보스·깊은 방에서 드물게' : '몬스터 · 상자 · 제작']);
  const mana = [0, 0, 0, 0, 0, 0];
  for (let i = 0; i < 1000; i++) mana[rollManaGrade((i + 0.5) / 1000)]++;
  const enh = Array.from({ length: 10 }, (_, p) => {
    const c = enhanceCost({ uid: '', slot: 'armor', tier: 1, grade: 0, plus: p })!;
    return [`+${p} → +${p + 1}`, pct(c.rate), `${p >= 5 ? '마력판' : '판'} ×${c.count}`];
  });
  const spTxt = (k: SpecialKey) => {
    const [lo, hi] = specialRange(k, 4, 1);
    const f = (v: number) => (SPECIALS[k].int ? String(Math.round(v)) : String(Math.round(v * 10) / 10));
    return SPECIALS[k].text(12345.6).replace('12345.6', `${f(lo)}~${f(hi)}`) + (SPECIALS[k].tierScaled ? ' <small class="dim">(단계가 높을수록 큼)</small>' : '');
  };
  const spRows: string[][] = [
    ['검', specialPool('weapon', 'sword').map(spTxt).join('<br>')],
    ['지팡이', specialPool('weapon', 'mage').map(spTxt).join('<br>')],
    ['활', specialPool('weapon', 'archer').map(spTxt).join('<br>')],
    ['방어구 공통', specialPool('helmet').slice(0, 4).map(spTxt).join('<br>')],
    ...(['helmet', 'armor', 'pants', 'boots'] as const).map((sl) => [`+ ${slotName(sl)}`, specialPool(sl).slice(4).map(spTxt).join('<br>')]),
    ['장신구 공통', specialPool('ring').slice(0, 4).map(spTxt).join('<br>')],
    ...(['ring', 'necklace'] as const).map((sl) => [`+ ${slotName(sl)}`, specialPool(sl).slice(4).map(spTxt).join('<br>')]),
  ];
  return `
  <h3>부위</h3>
  <div class="enc-row">${EQUIP_SLOTS.map((s) => `<span class="enc-slot">${eq({ slot: s, tier: 2, grade: 1, cls: 'sword' })}${slotName(s, 'sword')}</span>`).join('')}</div>
  <p>무기는 직업마다 다르다(검·지팡이·활). 방어구·장신구는 어느 직업이나 낄 수 있다.</p>
  ${tip('던전 안에서는 가방에 든 장비로만 바꿔 낄 수 있다. 장비·도구는 차원집 제작대에서 만들고, 강화·수리는 대장장이 고른에게 한다.')}
  <h3>재질 (단계)</h3>
  <div class="enc-row">${TOOL_TIER_NAMES.map((n, i) => `<span class="enc-slot">${eq({ slot: 'weapon', cls: 'sword', tier: i + 1, grade: 0 })}${i + 1}. ${n}</span>`).join('')}</div>
  <p>단계가 오를수록 크게 강해진다. 다음 단계 무기는 이전 단계 +10보다 세다.</p>
  <h3>등급</h3>
  ${table(['등급', '능력치 배율', '얻는 곳'], gradeRows)}
  ${tip(`제작대에서 판자 대신 <b>마력 판자</b>로 만들면 고급 이상 보장 (희귀 ${Math.round(mana[2] / 10)}% · 영웅 ${Math.round(mana[3] / 10)}% · 유니크 ${(mana[4] / 10).toFixed(1)}% · 전설 ${(mana[5] / 10).toFixed(1)}%).`)}
  <h3>계열 (방어구·장신구)</h3>
  ${SERIES_IDS.map((id) => {
    const s = SERIES[id];
    const look = id === 'guard' ? '판금 투구·흉갑' : id === 'arcane' ? '마법사 모자·로브' : '깃털 모자·가죽 갑옷';
    return card(
      `<span style="color:${hex(s.color)}">${s.prefix}</span> <small>(${CLASSES[s.fits].name} 추천)</small>`,
      `<p>${Object.entries(s.bonus).map(([k, v]) => bonusText(k as BonusKey, v!)).join(' · ')} <small class="dim">(1개 기준, 등급·강화·단계가 높을수록 커짐)</small></p><p class="dim">모습: ${look}</p>`,
      `${eq({ slot: 'helmet', tier: 3, grade: 2, series: id })}${eq({ slot: 'armor', tier: 3, grade: 2, series: id })}`,
    );
  }).join('')}
  <h3>특수 옵션 (유니크 이상)</h3>
  <p>유니크는 <b>1줄</b>, 전설은 <b>2줄</b>, 차원은 <b>3줄</b>의 특수 옵션이 드롭·제작 때 저절로 붙는다. 한 장비에 같은 옵션은 한 번만. 값은 전설 ×1.2, 차원 ×1.4.</p>
  ${table(['부위', '붙을 수 있는 옵션 (유니크 기준 범위)'], spRows)}
  ${tip('엔딩 뒤 대장간에서 특수 옵션을 다시 굴리고, 마음에 드는 줄을 고정할 수 있다 (차원의 끝 항목).')}
  <h3>강화 (대장장이 고른)</h3>
  ${table(['단계', '성공 확률', '재료 (장비 재질)'], enh)}
  <p>+1~+5는 <b>판</b>, +6~+10은 <b>마력판</b>을 쓴다. 실패해도 강화 단계는 떨어지지 않고 재료만 사라진다. 차원 등급은 재료·골드가 세 배.</p>
  <h3>수리 (대장장이 고른)</h3>
  ${table(
    ['강화 단계', '수리 재료 (구리 장비 예)'],
    [
      ['+0 ~ +2', it(repairMaterial(1, 0).id)],
      ['+3 ~ +5', it(repairMaterial(1, 3).id)],
      ['+6 ~ +8', it(repairMaterial(1, 6).id)],
      ['+9 ~ +10', it(repairMaterial(1, 9).id)],
    ],
  )}`;
}

function materials(): string {
  const tierRows = ORE_TIERS.map((ore, i) => [
    `${i + 1}단계`,
    it(ore),
    it(WOOD_TIERS[i]),
    it(TIER_INGOT[i]),
    it(TIER_PLANK[i]),
    it(TIER_PLATE[i]),
    it(TIER_MANA_PLATE[i]),
  ]);
  return `
  <h3>가공 흐름</h3>
  ${flow([`${it('copper_ore')}`, `제련로 → ${it('copper_ingot')}`, `제작대 (+판자) → ${it('copper_plate')}`])}
  ${flow([`${it('wood')}`, `벌목소 → ${it('plank')}`])}
  ${flow([`${it('copper_ingot')} + 정수`, `마력 주입기 → ${it('mana_copper')}`, `제작대 (+판자) → ${it('mana_copper_plate')}`])}
  ${tip('판은 +1~+5 강화, 마력판은 +6~+10 강화에 쓴다. 판자는 장비·도구 제작과 판 합성에 모두 필요하다.')}
  <h3>단계별 재료</h3>
  ${table(['단계', '광석', '나무', '주괴', '판자', '판', '마력판'], tierRows)}
  <p>각 단계 던전에서는 그 단계와 한 단계 아래 자원이 나온다 (뒤쪽 방일수록 높은 단계가 많다).</p>
  <h3>채집 도구</h3>
  ${card('곡괭이 · 도끼', `<p>광맥은 곡괭이, 나무는 도끼로 캔다. <b>도구 단계까지</b>는 내구도가 1씩, <b>한 단계 위</b>는 3씩 닳고, 그보다 위는 캘 수 없다.</p><p>광맥과 나무는 2~5번 치면 다한다 (하나하나 다르다). 대장간에서 강화하면 캐는 속도 +6% · 추가 채집 +5% (단계마다). 도구 수리는 <b>골드만</b> 든다. 제작대에서 ${it('copper_ingot', 4)} + ${it('plank', 3)} 식으로 새 단계 도구를 만든다.</p>`, `${img(toolIconUrl('pickaxe', 2))}${img(toolIconUrl('axe', 2))}`)}
  <h3>마력 정수</h3>
  ${table(
    ['정수', '나오는 곳', '발전기에서', '생산 속도'],
    ESSENCE_TIERS.map((id, i) => [it(id), ['1~3단계 몬스터', '4~5단계 몬스터', '6단계 몬스터', '7단계 몬스터', '차원 응축기'][i], `${Math.round(ESSENCE_BURN[id] / 60)}분`, `×${ESSENCE_BOOST[id]}`]),
  )}
  <h3>특수 재료</h3>
  <div class="enc-row">${it('gear_part')} ${it('magi_alloy')}</div>
  <p>5단계(폐허가 된 마공학 공장)의 잔해에서 나온다. 차원가방 확장 키트·공장 확장에 쓴다.</p>`;
}

function stages(): string {
  return `
  <h3>7개의 단계</h3>
  ${table(
    ['단계', '장소', '특징'],
    THEMES.map((t) => [
      `<span class="enc-dot" style="--c:${hex(t.portalColor)}"></span>${t.tier}단계`,
      t.name,
      `${it(ORE_TIERS[t.tier - 1])} ${it(WOOD_TIERS[t.tier - 1])}${t.special.length ? ` · ${t.special.map((s) => (s === 'gear_pile' ? it('gear_part') : it('magi_alloy'))).join(' ')}` : ''}`,
    ]),
  )}
  <h3>한 단계 = 방 10개</h3>
  ${flow(['1~4번 방', '5번 방: 파수꾼', '6~9번 방', '10번 방: 수호자'])}
  <p>방을 깨면 다음 방으로 이어 하거나 마을로 돌아갈 수 있다. 뒤쪽 방일수록 몬스터가 세고 좋은 재료·장비가 나온다. 다음 단계의 1번 방은 항상 이전 단계의 마지막 방보다 세고, 경험치·골드도 더 많다.</p>
  <p>레벨에 비해 너무 낮은 단계에서는 경험치가 줄어든다: 단계×10+10레벨부터 50%, +20레벨 25%, +30레벨 10% (예: 1단계는 Lv.20부터 절반). 7단계는 줄지 않는다.</p>
  ${card('수호자와 차원석', `<p>10번 방의 <b>수호자</b>를 처음 쓰러뜨리면 그 단계의 <b>차원석</b>을 얻는다. 차원석으로 다음 단계가 열리고, 1·4단계 차원석은 궁극기를 연다. 7개를 모두 모으면 마지막 이야기가 시작된다.</p>`, img(itemIconUrl('dim_shard')))}
  <h3>보스 규칙</h3>
  <ul class="enc-list">
    <li><b>제한 시간 ${BOSS_TIME_LIMIT / 60}분</b> — 넘기면 피할 수 없는 공격으로 쓰러진다.</li>
    <li><b>보호막</b> — 체력 줄을 일정량 깎으면 보호막을 펴고 수호병을 부른다. 수호병을 모두 잡으면 풀린다.</li>
    <li><b>빈틈</b> — 고유 패턴을 쓴 뒤 잠깐 지쳐 멈춘다 (체력바에 "빈틈!"). 이때 몰아치자.</li>
    <li><b>격노</b> — 체력이 절반 아래면 패턴이 빨라진다.</li>
    <li><b>재등장</b> — 쓰러뜨린 파수꾼은 ${min(BOSS_RESPAWN_MS.midboss)}분, 수호자는 ${min(BOSS_RESPAWN_MS.boss) / 60}시간 뒤 다시 나온다 (그동안은 정예가 지킨다).</li>
  </ul>
  <h3>그 밖의 장소</h3>
  ${card('채집 특화 맵', `<p>차원문에서 <b>벌목지</b>·<b>광맥지</b>를 고르면 나무 또는 광맥만 가득한 맵에 들어간다. 종류마다 ${min(FARM_COOLDOWN_MS)}분에 한 번.</p>`, img(itemIconUrl('wood')))}
  ${card('보물 상자', '<p>던전 곳곳의 상자를 열면 재료·장비가 나온다. 가끔 몬스터가 습격하는데, 막아 내면 더 좋은 보상을 준다.</p>', img(itemIconUrl('gold_plate')))}`;
}

function bosses(): string {
  const row = (list: typeof BOSS_SPECIES, kind: string, crowned: boolean) =>
    list.map((sp, i) => card(`${i + 1}단계 ${kind} · ${sp.name}`, `<p>${SIGNATURE_TEXT[sp.id] ?? ''}</p>`, img(monsterIconUrl(sp, i + 1, crowned), 'enc-mon'))).join('');
  return `
  <p>보스는 <b>고유 패턴 → 숨 고르기(빈틈) → 기본 공격 2~3번</b>을 반복한다. 빨간 판은 곧 공격이 떨어지는 자리다. 멀리서만 싸우면 넓은 원거리 공격이나 도약으로 쫓아온다.</p>
  <h3>수호자 (10번 방)</h3>
  ${row(BOSS_SPECIES, '수호자', true)}
  <h3>파수꾼 (5번 방)</h3>
  ${row(MIDBOSS_SPECIES, '파수꾼', false)}`;
}

function factory(): string {
  const bRows = BUILD_ORDER.map((t: BuildingType) => {
    const b = BUILDINGS[t];
    return card(
      `${b.name} <small>${t === 'generator' ? `전력 +${b.power}` : b.power ? `전력 ${b.power}` : ''}${b.blueprint ? ' · 도면 필요' : ''}</small>`,
      `<p>${b.description}</p>${Object.keys(b.cost).length ? `<p class="dim">건설: ${items(b.cost)}</p>` : ''}`,
      img(buildingThumb(t), 'enc-bld'),
    );
  }).join('');
  const machineName = (m: string) => BUILDINGS[m as BuildingType]?.name ?? m;
  const recipeRows = RECIPES.filter((r) => r.machine !== 'workbench' || !r.id.startsWith('equip'))
    .map((r) => [machineName(r.machine), `Lv.${r.tier}`, items(r.inputs), `${it(r.output, r.count)}`, `${r.time}초`]);
  const plateRows = [1, 2, 3, 4, 5, 6, 7].map((t) => ['제작대', `Lv.${t}`, items(plateCraftCost(t).items), it(TIER_PLATE[t - 1]), `${plateCraftCost(t).time}초`]);
  return `
  <p>차원집은 나만의 공장이다. 마을의 차원집 문으로 들어가 <b>건설 모드(망치 버튼, B)</b>로 건물을 놓는다. 건설 재료는 공유 창고에서 빠진다.</p>
  <h3>기본 구조</h3>
  ${flow([`${img(buildingThumb('box'), 'enc-ico')} 보관상자(투입)`, `${img(buildingThumb('belt'), 'enc-ico')} 레일`, `${img(buildingThumb('smelter'), 'enc-ico')} 기계`, `${img(buildingThumb('belt'), 'enc-ico')} 레일`, `${img(buildingThumb('box'), 'enc-ico')} 보관상자(출하)`])}
  <p>기계는 <b>마력선</b>으로 <b>마력 발전기</b>와 이어야 움직인다. 발전기에 마력 정수를 넣으면 <b>좋은 것부터</b> 타면서 전력을 만든다 (좋은 정수일수록 오래 타고 생산이 빨라진다). 연료는 돌아가는 기계가 쓰는 전력만큼 줄고, 쉬는 기계는 전력을 쓰지 않는다. 수요가 공급보다 크면 기계들이 그만큼 느려진다.</p><p>레시피북(제작대·기계 화면)에서 회색으로 보이는 재료는 지금 부족한 것. 완성품은 기계 앞쪽 레일로 나간다.</p>
  ${tip(`게임을 꺼 둔 동안에도 최대 ${OFFLINE_CAP_HOURS}시간까지 공장이 돌아간다.`)}
  <h3>건물</h3>
  ${bRows}
  <h3>생산 건물 (엔딩 무렵)</h3>
  <p>재료 없이 <b>전력만</b> 이어 두면 자원이 저절로 쌓이는 건물. 세라에게 도면을 사서 짓고, 건물을 눌러 [공유 창고로 받기]로 가져간다. 건물 하나에 쌓이는 양에는 한도가 있어서 오래 비워 두면 가득 찬 채로 멈춘다. 희귀한 것일수록 오래 걸린다. 업그레이드는 도면 없이 건물 창에서 바로 하지만 아주 비싸다.</p>
  ${table(
    ['건물', '조건 · 개수', '만드는 것', '한도'],
    [
      [`${img(buildingThumb('oregen'), 'enc-ico')} ${BUILDINGS.oregen.name}`, `7-10 클리어 · 최대 ${PRODUCER_LIMIT.oregen}개`, `Lv.1~${PRODUCER_MAX_LEVEL.oregen}: ${ORE_TIERS.map((o) => `${it(o)} ${producerTime(o)}초`).join(' ')}`, `${PRODUCER_CAP.oregen}개`],
      [`${img(buildingThumb('manawell'), 'enc-ico')} ${BUILDINGS.manawell.name}`, `이야기 완료 · 최대 ${PRODUCER_LIMIT.manawell}개`, `Lv.1~${PRODUCER_MAX_LEVEL.manawell}: ${['essence_low', 'essence_mid', 'essence_high'].map((o) => `${it(o)} ${producerTime(o)}초`).join(' ')}`, `${PRODUCER_CAP.manawell}개`],
    ],
  )}
  <h3>건물 레벨과 공장 크기</h3>
  <ul class="enc-list">
    <li><b>건물 레벨 (Lv.1~${MAX_BUILDING_LEVEL})</b> — 마공학자 세라에게 강화 도면을 사서 올린다. 레벨 = 다룰 수 있는 재료 단계. 레벨마다 가공 속도 +15%, 발전기는 전력 +15 (Lv.${MAX_BUILDING_LEVEL} ${generatorPower(MAX_BUILDING_LEVEL)}).</li>
    <li><b>공장 크기</b> — ${FACTORY_SIZES.map((f) => `${f.size}×${f.size}`).join(' → ')} (세라에게 확장).</li>
    <li><b>제작대 레벨</b> — 만들 수 있는 최고 단계. 판 합성·장비·도구·귀환석을 만든다.</li>
  </ul>
  <h3>레시피</h3>
  ${table(['기계', '레벨', '재료', '결과', '시간'], [...plateRows, ...recipeRows])}
  ${tip(`장비 제작: 제작대에서 주괴 + 판자 (마력 판자를 쓰면 좋은 등급). 예) 1단계 투구 마력 제작 = ${items(equipManaCraftCost('helmet', 1).items)}`)}
  ${tip('마력 치유석을 발전기와 이어 두면 옆에 서 있는 동안 HP·MP가 빠르게 찬다. 물약보다 싸다.')}`;
}

function storage(): string {
  return `
  <h3>가방의 종류</h3>
  ${card('일반 가방', `<p>던전에서 줍는 것이 먼저 들어가는 가방. 처음 ${BAG_SLOTS}칸, 공유 창고 화면에서 [가방 확장]으로 ${BAG_STEP}칸씩 ${BAG_MAX_LEVEL}번 → 최대 ${BAG_SLOTS + BAG_STEP * BAG_MAX_LEVEL}칸. <b>쓰러지면 잃는다.</b></p><p>아이템을 누르고 [버리기]로 버릴 수 있다.</p>`, img(itemIconUrl('plank')))}
  ${card('차원가방', `<p>쓰러져도 지켜지는 가방. 처음 ${DIM_BAG_START}칸, ${it('bag_kit')}으로 늘려 최대 ${DIM_BAG_MAX}칸.</p>`, img(itemIconUrl('bag_kit')))}
  ${card('물약 주머니', '<p>던전에 들어갈 때 창고의 물약을 자동으로 챙긴다. 쓰러져도 잃지 않는다.</p>', img(itemIconUrl('potion')))}
  <h3>창고</h3>
  ${card('공유 창고 (마을 · 차원집 입구)', `<p>모든 직업이 함께 쓰는 창고. 한 칸에 ${STORE_STACK}개. Lv.1 ${storageSlotsFor(1)}칸 → Lv.${STORAGE_MAX_LEVEL} ${storageSlotsFor(STORAGE_MAX_LEVEL)}칸 (골드 + 판·판자로 업그레이드).</p>${tip('[재료 모두 창고로] 버튼으로 가방의 재료를 한 번에 넣을 수 있다.')}`)}
  ${card('일반 창고 (차원집 건물)', '<p>공장 안에 짓는 창고. 레벨당 20칸. 여러 개를 지어도 하나로 이어지고, 안의 재료는 차원집에서 제작·건설에 바로 쓰인다. 레일로 들어온 아이템도 받는다.</p>', img(buildingThumb('warehouse'), 'enc-bld'))}
  <h3>저장</h3>
  <p>진행은 이 기기에 자동 저장된다. 다른 기기로 옮기거나 백업하려면 타이틀·메뉴의 <b>저장 코드 만들기</b> → 새 기기에서 <b>저장 코드로 불러오기</b>.</p>`;
}

function village(): string {
  return `
  <h3>마을 사람들</h3>
  ${NPCS.map((n) => card(`${n.name} <small>${n.faction}</small>`, `<p>${NPC_ROLE[n.id] ?? ''}</p>`, img(bustUrl(`ency:${n.id}`, n.look), 'enc-portrait'))).join('')}
  <h3>시설</h3>
  <ul class="enc-list">
    <li><b>차원문 광장</b> — 던전·채집 특화 맵으로 가는 문. 깬 단계의 어느 방에서든 시작할 수 있다.</li>
    <li><b>차원집 문</b> — 나만의 공장.</li>
    <li><b>대장간 · 상점 · 직업의 전당 · 창고</b> — 가까이 가서 [상호작용].</li>
  </ul>
  ${tip('마을은 몇 분마다 낮·해질녘·밤, 맑음·비·눈이 바뀐다 (보기만 바뀐다).')}`;
}

function endgame(): string {
  const engRows = Array.from({ length: ENGRAVE_STAGES }, (_, i) => [`${i + 1}단`, `${engraveCost(i + 1).gold.toLocaleString()} G`, items(engraveCost(i + 1).items)]);
  return `
  <p>7단계 수호자를 쓰러뜨리고 이야기를 마치면 마을 남쪽에 <b>차원의 끝</b> 구역이 열린다. 건물에 닿으면 들어간다.</p>
  <h3>해금 순서</h3>
  ${flow(['🗼 무한의 탑', '(10층) 💀 보스 러시', '(일반 완주) 🌀 심연 균열', '(3단계) 🏆 주간 차원 시련'])}
  ${card('🗼 무한의 탑', `<p>둥근 단에서 웨이브 3번을 버티면 한 층을 오른다. 5층마다 파수꾼, 10층마다 수호자. 1~10층은 층마다 +5%, 11층부터는 10층마다 한 번에 +15% 강해진다.</p><p>처음 깬 층 보상 (예: 10층 ${towerFirstClear(10).gold} G + ${it('dim_dust', towerFirstClear(10).dust)}). 하루 한 번 최고 층 기준 소탕 보상.</p>`)}
  ${card('💀 보스 러시', `${table(['난이도', '내용', 'S등급 보상'], RUSH_DIFFS.map((d, i) => [d.name, d.desc, `${rushReward(i as 0 | 1 | 2, 'S').gold.toLocaleString()} G + ${it('dim_dust', rushReward(i as 0 | 1 | 2, 'S').dust)}`]))}<p>걸린 시간으로 S(10분)·A(15분)·B(20분)·C 등급. 하루 ${RUSH_DAILY}번 무료, 그 뒤는 ${it('dim_alloy', 2)}. 지옥은 매번 ${it('dim_alloy2', 1)}.</p>`)}
  ${card('🌀 심연 균열', `<p>${Math.round(RIFT_TIME / 60)}분 안에 깨면 다음 단계가 열린다. 단계마다 몬스터 +12%, 변이가 붙는다(그날은 같은 변이). 입장: 1~10단계 ${it('dim_alloy', 1)}, 11단계부터 ${it('dim_alloy2', 1)}. 보상 예) 5단계 ${riftReward(5, true).gold.toLocaleString()} G + ${it('dim_dust', riftReward(5, true).dust)}, 좋은 장비 확률 증가.</p>${table(['변이', '효과'], AFFIX_IDS.map((a) => [`<span style="color:${hex(AFFIXES[a].color)}">${AFFIXES[a].name}</span>`, AFFIXES[a].text]))}`)}
  ${card('🏆 주간 차원 시련', `<p>매주 무작위 수호자 한 마리와 <b>${TRIAL_TIME / 60}분</b> 동안 싸운다. 내 장비·능력치 그대로. 체력이 7-10 수호자의 ${TRIAL_HP}배라 <b>깎은 체력 비율</b>이 기록이고, 쓰러뜨리면 <b>걸린 시간</b>이 기록. 체력 10%마다 격노 단계가 올라 공격·속도가 오르고 패턴이 강해진다.</p>${table(['등급', '기준', '보상 (발밑 오라)'], TRIAL_GRADES.map((g) => [`<span style="color:${hex(g.color)}">${g.name}</span>`, g.min >= 10000 ? '처치' : `체력 ${g.min / 100}%`, g.aura]))}`)}
  <h3>차원 재료</h3>
  ${flow([it('dim_dust'), `차원 응축기 (가루 8 + ${it('essence_high')} + ${it('titanium_plate')}) → ${it('dim_shard')}`])}
  ${flow([it('dim_dust'), `차원 응축기 (가루 4 + ${it('essence_supreme')} + ${it('orichalcum_ingot')}) → ${it('essence_dim')}`])}
  <p>차원 가루는 엔딩 뒤 모든 수호자·파수꾼과 차원의 끝에서 나온다. 파편은 궁극기 강화·각인·초월에, 차원 합금(${it('dim_alloy')} ${it('dim_alloy2')})은 균열·러시 입장에 쓴다.</p>
  <h3>각인 (대장장이 고른)</h3>
  <p>장비 하나에 1단부터 5단까지 차례로 새긴다. 옵션은 무작위 (${ENGRAVE_OPTS.map((o) => BONUS_NAMES[o.key]).join('·')}), 단계가 높을수록 값이 크다(1단 ×1 → 5단 ×4). 원하는 옵션이 나올 때까지 다시 굴릴 수 있다. 단마다 따로 굴리므로 <b>같은 옵션을 여러 단에</b> 맞출 수도 있다 (예: 5단 모두 공격력).</p>
  ${table(['단', '골드', '재료 (새기기·다시 굴리기 같음)'], engRows)}
  <h3>특수 옵션 다시 굴리기 (대장장이 고른)</h3>
  <p>유니크 이상 장비의 특수 옵션을 새로 뽑는다. 전설·차원은 마음에 드는 줄에 <b>🔒 고정</b>을 걸면 그 줄은 그대로 두고 나머지만 바뀐다 (적어도 한 줄은 풀어 둬야 함). 고정한 줄마다 골드 ×2.5 · 재료 ×2, ${it('dim_dust')}과 그 단계 마력 금속이 더 든다.</p>
  ${table(['장비', '고정 없음', '1줄 고정', '2줄 고정'], [4, 5, 6].map((g) => [`${GRADES[g].name} 7단계`, ...[0, 1, 2].map((l) => (l <= g - 4 ? `${specialRerollCost(g, 7, l).gold.toLocaleString()} G<br>${items(specialRerollCost(g, 7, l).items)}` : '-'))]))}
  ${tip('비용은 장비 단계가 낮을수록 싸다 (골드 단계마다 -20%, 재료는 그 단계 판·판자와 아래 단계 주괴·판자).')}
  <h3>초월 (99레벨 뒤)</h3>
  <p>99레벨이 되면 경험치가 <b>초월 레벨</b>로 쌓이고, 레벨마다 초월 포인트 1점. 포인트를 찍을 때 ${it('dim_shard')}가 든다 (찍은 수가 많을수록 비싸짐: 1~5번째 ${transcendPointCost(0)}개, 6~10번째 ${transcendPointCost(5)}개 …).</p>
  ${table(['능력치', '1점당'], TRANSCEND_STATS.map((t) => [BONUS_NAMES[t.key], bonusText(t.key, t.per)]))}
  <h3>칭호</h3>
  ${table(['칭호', '조건', '효과'], TITLES.map((t) => [t.name, t.cond, Object.entries(t.bonus).map(([k, v]) => bonusText(k as BonusKey, v!)).join(', ')]))}
  <h3>음식 (연금 솥)</h3>
  ${table(['음식', '30분 효과'], Object.entries(FOODS).map(([id, b]) => [it(id), Object.entries(b).map(([k, v]) => bonusText(k as BonusKey, v!)).join(', ')]))}`;
}

/** 백과사전 항목. 엔딩(모든 스테이지 클리어) 전에는 '차원의 끝'이 잠겨 있다 */
export function encyclopediaPages(p: Progress): EncyPage[] {
  const endOpen = p.flag('endgame') > 0;
  return [
    { id: 'basics', name: '처음이라면', icon: itemIconUrl('return_stone'), html: basics },
    { id: 'classes', name: '직업·스킬', icon: weaponIconUrl('sword'), html: classes },
    { id: 'equip', name: '장비·강화', icon: equipIconUrl({ uid: '', slot: 'armor', tier: 3, grade: 3, plus: 0 }), html: equipment },
    { id: 'materials', name: '재료·채집', icon: itemIconUrl('iron_ore'), html: materials },
    { id: 'stages', name: '스테이지', icon: itemIconUrl('dim_shard'), html: stages },
    { id: 'bosses', name: '보스', icon: monsterIconUrl(BOSS_SPECIES[1], 2, true), html: bosses },
    { id: 'factory', name: '차원집·공장', icon: buildingThumb('smelter'), html: factory },
    { id: 'storage', name: '가방·창고', icon: itemIconUrl('bag_kit'), html: storage },
    { id: 'village', name: '마을', icon: itemIconUrl('potion'), html: village },
    { id: 'end', name: '차원의 끝', icon: itemIconUrl('dim_dust'), locked: endOpen ? undefined : '모든 스테이지(7-10 수호자)를 클리어하고 이야기를 마치면 열립니다', html: endgame },
  ];
}
