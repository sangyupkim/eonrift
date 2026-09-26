import { CLASS_ORDER, MAX_LEVEL, POINTS_PER_LEVEL, CLASSES, type ClassId } from '../data/classes';
import { newEndgame } from '../data/endgame';
import { EQUIP_SLOTS, withSpecials, type Equip } from '../data/equipment';
import { BUILDINGS, FACTORY_SIZES, MAX_BUILDING_LEVEL, UPGRADABLE } from '../data/factory';
import { ESSENCE_TIERS, ORE_TIERS, TIER_MANA_METAL, TIER_MANA_PLANK, TIER_MANA_PLATE, TIER_PLANK, TIER_PLATE, WOOD_TIERS } from '../data/items';
import { MAIN_QUESTS } from '../data/quests';
import { newTool, TIER_INGOT } from '../data/tools';
import { newSave, parseSave, zeroStats, type SaveData } from './Progress';

/**
 * 테스트 캐릭터: 모든 직업 99레벨, 전 부위 7단계 차원 등급 +10, 스킬 최고 레벨, 궁극기 두 개,
 * 스토리·엔딩 완료(차원의 끝 열림), 모든 도면, 재료와 골드 넉넉히.
 */
export function makeTestSave(): SaveData {
  const d = newSave();
  let n = 0;
  const gear = (cls: ClassId): Partial<Record<Equip['slot'], Equip>> => {
    const out: Partial<Record<Equip['slot'], Equip>> = {};
    for (const slot of EQUIP_SLOTS) out[slot] = withSpecials({ uid: `test-${cls}-${slot}-${n++}`, slot, cls: slot === 'weapon' ? cls : undefined, tier: 7, grade: 6, plus: 10 });
    return out;
  };
  for (const id of CLASS_ORDER) {
    const def = CLASSES[id];
    const pts = (MAX_LEVEL - 1) * POINTS_PER_LEVEL;
    const alloc = zeroStats();
    const main = def.damage === 'physical' ? 'str' : 'int';
    alloc[main] = Math.round(pts * 0.6);
    alloc.vit = Math.round(pts * 0.3);
    alloc.dex = pts - alloc[main] - alloc.vit;
    d.classes[id] = { level: MAX_LEVEL, exp: 0, equipment: gear(id), alloc, points: 0, skills: [5, 5, 5, 5, 5, 5], quick: [0, 1, 2], ult: 0, ultLv: [1, 1], tlv: 5, texp: 0, tpts: {} };
  }
  d.unlockedClasses = [...CLASS_ORDER];
  d.gold = 10_000_000;
  d.cleared = 70;
  d.dimStones = [1, 2, 3, 4, 5, 6, 7];
  d.storageLevel = 10;
  const st: Record<string, number> = {};
  for (const list of [TIER_PLATE, TIER_MANA_PLATE, TIER_INGOT, TIER_MANA_METAL, TIER_PLANK, TIER_MANA_PLANK, ORE_TIERS, WOOD_TIERS]) for (const id of list) st[id] = 99;
  for (const id of ESSENCE_TIERS) st[id] = 99;
  Object.assign(st, {
    dim_dust: 500,
    dim_shard: 300,
    dim_alloy: 20,
    dim_alloy2: 20,
    food_atk: 10,
    food_guard: 10,
    food_luck: 10,
    food_exp: 10,
    potion_high: 30,
    potion_mid: 20,
    return_stone: 10,
  });
  d.storage = st;
  const flags = ['intro', 'returned', 'home', 'factoryBuilt', 'tool_pickaxe', 'tool_axe', 'legend', 'endgame', 'endingA', 'smith3', 'resonatorHint', 'stone1Talk', 'stoneTalk3', 'stoneTalk4', 'stoneTalk5', 'stoneTalk6', 'stoneTalk7'];
  for (const f of flags) d.flags[f] = 1;
  for (const t of Object.values(BUILDINGS)) if (t.blueprint) d.flags[`bp_${t.type}`] = 1;
  for (const t of UPGRADABLE) for (let lv = 2; lv <= MAX_BUILDING_LEVEL; lv++) d.flags[`bp_${t}_lv${lv}`] = 1;
  d.quests.done = [...MAIN_QUESTS.map((q) => q.id), 'm_research'];
  d.tools = { pickaxe: { ...newTool(7), plus: 10 }, axe: { ...newTool(7), plus: 10 } };
  d.factory = { sizeLevel: FACTORY_SIZES.length - 1, buildings: [] };
  // 균열 11단계(상급 합금)와 보스 러시 지옥까지 바로 시험할 수 있게
  d.end = { ...newEndgame(), towerBest: 10, riftBest: 10, rushGradeBest: ['B', 'B', ''], rushBest: [1200, 1200, 0] };
  return parseSave(JSON.stringify(d))!;
}
