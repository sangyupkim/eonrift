import type { Archetype } from './monsters';

/**
 * 몬스터 종족: 이름, 행동 유형(공격 패턴), 모델, 색.
 * 단계마다 나오는 종족 목록(TIER_POOLS)에서 방마다 골라 배치한다.
 */
export type Faction = 'beast' | 'undead' | 'orc' | 'elf' | 'construct' | 'elemental' | 'void' | 'demon';

export type HeadKind = 'skull' | 'orc' | 'elf' | 'goblin' | 'hood' | 'helm' | 'zombie' | 'horned';
export type WeaponKind = 'sword' | 'axe' | 'axes' | 'bow' | 'staff' | 'daggers' | 'club' | 'spear' | 'claws';

export interface HumanoidSpec {
  kind: 'humanoid';
  head: HeadKind;
  weapon: WeaponKind;
  shield?: boolean;
  skin: number;
  cloth: number;
  armor?: number;
  /** 머리 장식(깃털·머리카락·뿔) 색 */
  hair?: number;
  cape?: number;
  /** 몸집 배율 (트롤 1.4, 고블린 0.72) */
  size?: number;
}

export type BeastKind = 'wolf' | 'spirit' | 'boar' | 'spore' | 'golem' | 'spider' | 'bat' | 'wraith' | 'slime';
export interface BeastSpec {
  kind: BeastKind;
  size?: number;
}
export type ModelSpec = HumanoidSpec | BeastSpec;

/**
 * 종족 특성
 * - revive: 처음 쓰러지면 뼈 무더기가 되었다가 다시 일어난다
 * - split: 쓰러지면 작은 개체 둘로 나뉜다
 * - lifesteal: 때린 만큼 체력을 빨아들인다
 * - regen: 3초 동안 맞지 않으면 체력이 빠르게 찬다
 * - evasive: 공격의 30%를 흘려 피한다
 * - coward: 체력이 적으면 도망쳤다가 돌아온다
 */
export type Trait = 'revive' | 'split' | 'lifesteal' | 'regen' | 'evasive' | 'coward';

/** 플레이어에게 거는 약화 효과 */
export type DebuffId = 'slow' | 'poison' | 'burn' | 'curse' | 'silence' | 'stun';
export interface DebuffSpec {
  id: DebuffId;
  chance: number;
  duration: number;
}

export const TRAIT_TEXT: Record<Trait, string> = {
  revive: '처음 쓰러지면 뼈 무더기가 되었다가 다시 일어난다',
  split: '쓰러지면 작은 슬라임 둘로 나뉜다',
  lifesteal: '때린 만큼 체력을 빨아들인다',
  regen: '3초 동안 맞지 않으면 체력이 빠르게 찬다',
  evasive: '공격의 30%를 흘려 피한다',
  coward: '체력이 적으면 도망쳤다가 돌아온다',
};

export const DEBUFF_INFO: Record<DebuffId, { name: string; text: string; color: number }> = {
  slow: { name: '둔화', text: '이동 속도 -40%', color: 0x7fd6ff },
  poison: { name: '중독', text: '초마다 피해', color: 0x8aff4a },
  burn: { name: '화상', text: '초마다 큰 피해', color: 0xff7a2a },
  curse: { name: '저주', text: '주는 피해 -30%', color: 0xb67cff },
  silence: { name: '침묵', text: '스킬 사용 불가', color: 0xc8c8d8 },
  stun: { name: '기절', text: '움직일 수도 공격할 수도 없음', color: 0xffe04a },
};

export interface SpeciesDef {
  id: string;
  name: string;
  arch: Archetype;
  faction: Faction;
  model: ModelSpec;
  /** 짐승·골렘 색 (없으면 단계 색) */
  colors?: { main: number; dark: number; accent: number };
  /** 눈 등 빛나는 색 (사람형) */
  glow?: number;
  /** 한 자리에 무리로 나오는 수 */
  pack?: number;
  trait?: Trait;
  /** 맞히면 거는 약화 효과 */
  debuff?: DebuffSpec;
  /** 도감에 따로 싣지 않는다 (분열한 작은 슬라임 등) */
  hidden?: boolean;
}

const S = (d: SpeciesDef) => d;
const BONE = 0xe6dcc0;
const ORC = 0x6a9a44;
const DELF = 0x6c6aa0;

/** 단계 테마 몬스터 (예전부터 있던 짐승·정령·골렘). 단계 색을 쓴다 */
const THEMED: Record<number, [string, string, string, string, string]> = {
  1: ['이끼 늑대', '숲 정령술사', '뿔 멧돼지', '포자 버섯', '이끼 골렘'],
  2: ['협곡 하이에나', '모래 주술사', '붉은 들소', '폭발 선인장', '사암 골렘'],
  3: ['서리 늑대', '빙결 정령사', '얼음 뿔소', '서리 정령', '빙하 골렘'],
  4: ['수정 도마뱀', '수정 현자', '수정 멧돼지', '불안정한 수정', '수정 거인'],
  5: ['폭주 경비견', '마공 포탑', '돌격 기계', '자폭 드론', '마공 골렘'],
  6: ['용암 사냥개', '화염 정령', '불꽃 황소', '마그마 방울', '흑요석 골렘'],
  7: ['공허 추적자', '차원 관찰자', '균열 돌진자', '공허 파편', '차원 수호자'],
};
const THEMED_DEBUFF: Record<number, Partial<Record<Archetype, DebuffSpec>>> = {
  1: { bomber: { id: 'poison', chance: 1, duration: 4 } },
  3: { melee: { id: 'slow', chance: 0.4, duration: 2.5 }, ranged: { id: 'slow', chance: 0.7, duration: 3 }, bomber: { id: 'slow', chance: 1, duration: 3 } },
  6: { melee: { id: 'burn', chance: 0.3, duration: 3 }, ranged: { id: 'burn', chance: 0.6, duration: 3 }, bomber: { id: 'burn', chance: 1, duration: 3 } },
  7: { ranged: { id: 'silence', chance: 0.4, duration: 2.5 } },
};
const THEMED_ARCH: [Archetype, BeastKind][] = [
  ['melee', 'wolf'],
  ['ranged', 'spirit'],
  ['charger', 'boar'],
  ['bomber', 'spore'],
  ['tank', 'golem'],
];

const list: SpeciesDef[] = [];
for (let t = 1; t <= 7; t++)
  THEMED_ARCH.forEach(([arch, kind], i) =>
    list.push({
      id: `t${t}_${arch}`,
      name: THEMED[t][i],
      arch,
      faction: kind === 'golem' ? 'construct' : kind === 'spirit' || kind === 'spore' ? 'elemental' : 'beast',
      model: { kind },
      // 서리 단계는 둔화, 용암 단계는 화상, 포자 버섯은 중독, 공허 관찰자는 침묵
      debuff: THEMED_DEBUFF[t]?.[arch],
    }),
  );

list.push(
  // ---- 언데드 ----
  S({ id: 'skel_warrior', name: '해골 전사', arch: 'melee', faction: 'undead', model: { kind: 'humanoid', head: 'skull', weapon: 'sword', skin: BONE, cloth: 0x4a3e34, armor: 0x7a6a58 }, glow: 0x6affd0, trait: 'revive' }),
  S({ id: 'skel_archer', name: '해골 궁수', arch: 'archer', faction: 'undead', model: { kind: 'humanoid', head: 'skull', weapon: 'bow', skin: BONE, cloth: 0x3a3a44 }, glow: 0x6affd0, trait: 'revive' }),
  S({ id: 'ghoul', name: '구울', arch: 'brute', faction: 'undead', model: { kind: 'humanoid', head: 'zombie', weapon: 'claws', skin: 0x7a9a78, cloth: 0x4a4038, size: 1.05 }, glow: 0xffe05a, trait: 'lifesteal', debuff: { id: 'poison', chance: 0.35, duration: 4 } }),
  S({ id: 'wraith', name: '망령', arch: 'assassin', faction: 'undead', model: { kind: 'wraith' }, colors: { main: 0x8a94b0, dark: 0x3a3e58, accent: 0x7affe8 }, trait: 'evasive', debuff: { id: 'curse', chance: 0.3, duration: 5 } }),
  S({ id: 'necromancer', name: '강령술사', arch: 'necro', faction: 'undead', model: { kind: 'humanoid', head: 'hood', weapon: 'staff', skin: 0xb0b0a0, cloth: 0x3a2a4a, cape: 0x2a1a3a }, glow: 0x9aff5a, debuff: { id: 'curse', chance: 0.6, duration: 6 } }),
  S({ id: 'death_knight', name: '데스나이트', arch: 'knight', faction: 'undead', model: { kind: 'humanoid', head: 'helm', weapon: 'sword', shield: true, skin: 0x3a3a44, cloth: 0x22222a, armor: 0x44485a, cape: 0x5a1a22, hair: 0x9a1a2a, size: 1.1 }, glow: 0xff3a4a, debuff: { id: 'curse', chance: 0.35, duration: 5 } }),
  S({ id: 'frost_wraith', name: '서리 망령', arch: 'assassin', faction: 'undead', model: { kind: 'wraith' }, colors: { main: 0xbfe4f4, dark: 0x5a86a8, accent: 0x9ff4ff }, trait: 'evasive', debuff: { id: 'slow', chance: 0.6, duration: 3 } }),
  // ---- 오크·고블린·트롤 ----
  S({ id: 'orc_grunt', name: '오크 전사', arch: 'melee', faction: 'orc', model: { kind: 'humanoid', head: 'orc', weapon: 'axe', skin: ORC, cloth: 0x6a4a2a, armor: 0x7a6a5a, size: 1.1 }, glow: 0xff4a2a }),
  S({ id: 'orc_berserker', name: '오크 광전사', arch: 'brute', faction: 'orc', model: { kind: 'humanoid', head: 'orc', weapon: 'axes', skin: 0x5a8a3a, cloth: 0x8a2a1a, hair: 0x2a1a10, size: 1.2 }, glow: 0xff2a1a }),
  S({ id: 'orc_shaman', name: '오크 주술사', arch: 'shaman', faction: 'orc', model: { kind: 'humanoid', head: 'orc', weapon: 'staff', skin: 0x6a9a54, cloth: 0x5a3a6a, hair: 0xe6dcc0, cape: 0x4a2a1a }, glow: 0x7aff6a }),
  S({ id: 'goblin', name: '고블린', arch: 'swarm', faction: 'orc', model: { kind: 'humanoid', head: 'goblin', weapon: 'daggers', skin: 0x7aa84a, cloth: 0x6a4a2a, size: 0.7 }, glow: 0xffd84a, pack: 3, trait: 'coward' }),
  S({ id: 'goblin_archer', name: '고블린 궁수', arch: 'archer', faction: 'orc', model: { kind: 'humanoid', head: 'goblin', weapon: 'bow', skin: 0x6a9a44, cloth: 0x4a5a2a, size: 0.76 }, glow: 0xffd84a, trait: 'coward' }),
  S({ id: 'troll', name: '동굴 트롤', arch: 'tank', faction: 'orc', model: { kind: 'humanoid', head: 'orc', weapon: 'club', skin: 0x7a8a6a, cloth: 0x5a4a34, size: 1.45 }, glow: 0xffa03a, trait: 'regen' }),
  S({ id: 'ice_troll', name: '서리 트롤', arch: 'tank', faction: 'orc', model: { kind: 'humanoid', head: 'orc', weapon: 'club', skin: 0x9ab8c8, cloth: 0x4a5a6a, hair: 0xe8f4ff, size: 1.45 }, glow: 0x5ae0ff, trait: 'regen', debuff: { id: 'slow', chance: 0.5, duration: 3 } }),
  S({ id: 'fire_orc', name: '화염 광전사', arch: 'brute', faction: 'orc', model: { kind: 'humanoid', head: 'orc', weapon: 'axes', skin: 0x8a4a2a, cloth: 0x2a1a1a, armor: 0x3a2a2a, hair: 0xff6a1a, size: 1.2 }, glow: 0xffaa2a, debuff: { id: 'burn', chance: 0.4, duration: 3 } }),
  // ---- 다크엘프 ----
  S({ id: 'delf_assassin', name: '다크엘프 암살자', arch: 'assassin', faction: 'elf', model: { kind: 'humanoid', head: 'elf', weapon: 'daggers', skin: DELF, cloth: 0x22223a, hair: 0xe8e8f4, cape: 0x3a1a4a }, glow: 0xff4ad8, debuff: { id: 'poison', chance: 0.5, duration: 5 } }),
  S({ id: 'delf_archer', name: '다크엘프 궁수', arch: 'archer', faction: 'elf', model: { kind: 'humanoid', head: 'elf', weapon: 'bow', skin: DELF, cloth: 0x2a3a3a, hair: 0xd8d8e8 }, glow: 0xff4ad8 }),
  S({ id: 'delf_witch', name: '다크엘프 마녀', arch: 'caster', faction: 'elf', model: { kind: 'humanoid', head: 'hood', weapon: 'staff', skin: DELF, cloth: 0x4a1a5a, cape: 0x2a0a3a }, glow: 0xff5aff, debuff: { id: 'silence', chance: 0.5, duration: 3 } }),
  S({ id: 'delf_guard', name: '다크엘프 근위병', arch: 'knight', faction: 'elf', model: { kind: 'humanoid', head: 'elf', weapon: 'spear', shield: true, skin: DELF, cloth: 0x2a2a3a, armor: 0x5a4a8a, hair: 0xe8e8f4 }, glow: 0xff4ad8 }),
  // ---- 짐승·벌레 ----
  S({ id: 'giant_spider', name: '거대 거미', arch: 'spitter', faction: 'beast', model: { kind: 'spider' }, colors: { main: 0x4a3a2a, dark: 0x2a2018, accent: 0x9aff4a }, debuff: { id: 'poison', chance: 1, duration: 5 } }),
  S({ id: 'crystal_spider', name: '수정 거미', arch: 'spitter', faction: 'beast', model: { kind: 'spider' }, colors: { main: 0x8a6ac8, dark: 0x4a3a78, accent: 0x7fffe0 }, debuff: { id: 'slow', chance: 1, duration: 3 } }),
  S({ id: 'iron_spider', name: '강철 거미', arch: 'spitter', faction: 'construct', model: { kind: 'spider' }, colors: { main: 0x7a7a80, dark: 0x3a3a40, accent: 0xff8a2a }, debuff: { id: 'slow', chance: 1, duration: 3 } }),
  S({ id: 'bat', name: '흡혈 박쥐', arch: 'swarm', faction: 'beast', model: { kind: 'bat' }, colors: { main: 0x4a3a4a, dark: 0x2a1a2a, accent: 0xff3a3a }, pack: 4, trait: 'lifesteal' }),
  S({ id: 'slime_small', name: '꼬마 슬라임', arch: 'swarm', faction: 'elemental', model: { kind: 'slime', size: 0.6 }, colors: { main: 0x8aea7a, dark: 0x4aaa4a, accent: 0x1a3a1a }, hidden: true }),
  S({ id: 'slime', name: '슬라임', arch: 'swarm', faction: 'elemental', model: { kind: 'slime' }, colors: { main: 0x6ad86a, dark: 0x3a9a3a, accent: 0x1a3a1a }, pack: 3, trait: 'split' }),
  S({ id: 'lava_imp', name: '화염 임프', arch: 'swarm', faction: 'demon', model: { kind: 'humanoid', head: 'horned', weapon: 'claws', skin: 0xc84a2a, cloth: 0x3a1a1a, size: 0.66 }, glow: 0xffe04a, pack: 3, debuff: { id: 'burn', chance: 0.35, duration: 3 } }),
  // ---- 공허·기계 ----
  S({ id: 'mech_knight', name: '마공 기사', arch: 'knight', faction: 'construct', model: { kind: 'humanoid', head: 'helm', weapon: 'spear', shield: true, skin: 0x6a6a70, cloth: 0x3a3a40, armor: 0x8a7a5a, hair: 0xff8a2a, size: 1.1 }, glow: 0xff9a2a }),
  S({ id: 'void_wraith', name: '공허 망령', arch: 'assassin', faction: 'void', model: { kind: 'wraith' }, colors: { main: 0x4a3a8a, dark: 0x1a1a3a, accent: 0x5ef0ff }, trait: 'evasive', debuff: { id: 'silence', chance: 0.35, duration: 3 } }),
  S({ id: 'void_knight', name: '공허 기사', arch: 'knight', faction: 'void', model: { kind: 'humanoid', head: 'helm', weapon: 'sword', shield: true, skin: 0x2a2a4a, cloth: 0x1a1a2a, armor: 0x3a3a6a, cape: 0x4a2a8a, hair: 0x5ef0ff, size: 1.1 }, glow: 0x5ef0ff, debuff: { id: 'curse', chance: 0.3, duration: 5 } }),
  S({ id: 'void_witch', name: '공허 마녀', arch: 'caster', faction: 'void', model: { kind: 'humanoid', head: 'hood', weapon: 'staff', skin: 0x8a8ab0, cloth: 0x2a2a5a, cape: 0x1a1a3a }, glow: 0x5ef0ff, debuff: { id: 'silence', chance: 0.45, duration: 3 } }),
);

export const SPECIES: Record<string, SpeciesDef> = Object.fromEntries(list.map((d) => [d.id, d]));

/**
 * 단계별로 나오는 종족과 가중치. 앞에 있을수록 먼저(얕은 방부터) 나온다.
 * 한 번 들어갈 때는 이 중 몇 종류만 골라 섞는다 (stagePool)
 */
export const TIER_POOLS: Record<number, [string, number][]> = {
  1: [['t1_melee', 3], ['goblin', 2], ['t1_ranged', 2], ['slime', 2], ['skel_warrior', 2], ['t1_charger', 1], ['giant_spider', 1], ['t1_bomber', 1], ['t1_tank', 1]],
  2: [['orc_grunt', 3], ['t2_melee', 2], ['goblin', 2], ['goblin_archer', 2], ['t2_charger', 1], ['orc_shaman', 1], ['orc_berserker', 2], ['t2_bomber', 1], ['t2_tank', 1]],
  3: [['t3_melee', 2], ['skel_warrior', 2], ['bat', 2], ['skel_archer', 2], ['ghoul', 2], ['t3_ranged', 1], ['frost_wraith', 1], ['t3_bomber', 1], ['necromancer', 1], ['ice_troll', 1], ['t3_tank', 1]],
  4: [['t4_melee', 2], ['crystal_spider', 2], ['delf_archer', 2], ['delf_assassin', 2], ['t4_ranged', 1], ['delf_witch', 2], ['t4_charger', 1], ['delf_guard', 1], ['t4_bomber', 1], ['t4_tank', 1]],
  5: [['t5_melee', 2], ['t5_ranged', 2], ['iron_spider', 2], ['t5_charger', 2], ['mech_knight', 2], ['ghoul', 1], ['t5_bomber', 1], ['necromancer', 1], ['t5_tank', 1]],
  6: [['t6_melee', 2], ['lava_imp', 2], ['fire_orc', 2], ['t6_bomber', 2], ['t6_ranged', 1], ['orc_shaman', 1], ['t6_charger', 1], ['troll', 1], ['t6_tank', 1]],
  7: [['t7_melee', 1], ['void_wraith', 2], ['void_knight', 2], ['skel_archer', 1], ['void_witch', 2], ['t7_charger', 1], ['delf_assassin', 1], ['t7_ranged', 1], ['necromancer', 1], ['death_knight', 1], ['t7_bomber', 1], ['t7_tank', 1]],
};

/**
 * 이번 방(스테이지)에 나올 종족 몇 가지만 고른다.
 * 깊은 방일수록 고를 수 있는 종류가 늘고(앞에서부터), 한 번에 섞이는 수도 3 → 5로 늘어난다
 */
export function stagePool(tier: number, stage: number, rand: () => number): [string, number][] {
  const all = TIER_POOLS[tier];
  const unlocked = all.slice(0, Math.min(all.length, 3 + Math.floor((stage - 1) * 0.75)));
  const k = Math.min(unlocked.length, 3 + Math.floor((stage - 1) / 4));
  // 가장 앞의 종족(그 단계의 대표 몬스터)은 늘 넣고 나머지는 무작위
  const rest = unlocked.slice(1).sort(() => rand() - 0.5);
  return [unlocked[0], ...rest.slice(0, k - 1)];
}

/** 보스·중간보스 모습 (패턴은 보스 공통) */
export const BOSS_SPECIES: SpeciesDef[] = [
  S({ id: 'b1', name: '고대 숲의 수호수', arch: 'tank', faction: 'construct', model: { kind: 'golem' } }),
  S({ id: 'b2', name: '협곡의 폭군', arch: 'brute', faction: 'orc', model: { kind: 'humanoid', head: 'orc', weapon: 'axes', skin: 0x5a8a3a, cloth: 0x7a1a1a, armor: 0x6a5a4a, hair: 0x1a1a1a, cape: 0x8a2a1a, size: 1.2 }, glow: 0xff3a1a }),
  S({ id: 'b3', name: '빙결 여제', arch: 'caster', faction: 'elf', model: { kind: 'humanoid', head: 'elf', weapon: 'staff', skin: 0xb8d8f0, cloth: 0x3a6a9a, hair: 0xf0faff, cape: 0x9ad8ff }, glow: 0x9ff4ff }),
  S({ id: 'b4', name: '수정 심장', arch: 'tank', faction: 'construct', model: { kind: 'golem' } }),
  S({ id: 'b5', name: '폭주한 마공 거신', arch: 'tank', faction: 'construct', model: { kind: 'golem' } }),
  S({ id: 'b6', name: '용암 군주', arch: 'brute', faction: 'demon', model: { kind: 'humanoid', head: 'horned', weapon: 'club', skin: 0x8a2a1a, cloth: 0x2a1010, armor: 0x3a2a2a, cape: 0xff5a1a, size: 1.25 }, glow: 0xffc02a }),
  S({ id: 'b7', name: '틈새의 파수꾼', arch: 'caster', faction: 'void', model: { kind: 'wraith' }, colors: { main: 0x3a3a8a, dark: 0x1a1a3a, accent: 0x5ef0ff } }),
];

export const MIDBOSS_SPECIES: SpeciesDef[] = [
  S({ id: 'm1', name: '이끼 파수꾼', arch: 'charger', faction: 'beast', model: { kind: 'boar' } }),
  S({ id: 'm2', name: '고블린 족장', arch: 'brute', faction: 'orc', model: { kind: 'humanoid', head: 'goblin', weapon: 'club', skin: 0x7aa84a, cloth: 0x8a6a2a, hair: 0xe8c14a, cape: 0x8a2a1a, size: 0.95 }, glow: 0xffd84a }),
  S({ id: 'm3', name: '서리 트롤 우두머리', arch: 'tank', faction: 'orc', model: { kind: 'humanoid', head: 'orc', weapon: 'club', skin: 0x9ab8c8, cloth: 0x4a5a6a, hair: 0xe8f4ff, size: 1.4 }, glow: 0x5ae0ff }),
  S({ id: 'm4', name: '다크엘프 근위대장', arch: 'knight', faction: 'elf', model: { kind: 'humanoid', head: 'elf', weapon: 'spear', shield: true, skin: DELF, cloth: 0x2a2a3a, armor: 0x7a5aaa, hair: 0xe8e8f4, cape: 0x5a1a6a }, glow: 0xff4ad8 }),
  S({ id: 'm5', name: '경비 거신', arch: 'tank', faction: 'construct', model: { kind: 'golem' } }),
  S({ id: 'm6', name: '용암 파수꾼', arch: 'melee', faction: 'beast', model: { kind: 'wolf' } }),
  S({ id: 'm7', name: '틈새의 문지기', arch: 'knight', faction: 'undead', model: { kind: 'humanoid', head: 'helm', weapon: 'sword', shield: true, skin: 0x3a3a44, cloth: 0x22222a, armor: 0x44485a, cape: 0x5a1a22, hair: 0x5ef0ff, size: 1.15 }, glow: 0x5ef0ff }),
];

/** 가중치대로 하나 고르기 */
export function pickSpecies(tier: number, rand: () => number, filter?: (s: SpeciesDef) => boolean, favor?: Faction, from: [string, number][] = TIER_POOLS[tier]): SpeciesDef {
  let pool = from.map(([id, w]) => [SPECIES[id], SPECIES[id].faction === favor ? w * 4 : w] as const).filter(([s]) => !filter || filter(s));
  if (!pool.length) pool = TIER_POOLS[tier].map(([id, w]) => [SPECIES[id], w] as const).filter(([sp]) => !filter || filter(sp));
  const total = pool.reduce((a, [, w]) => a + w, 0);
  let r = rand() * total;
  for (const [s, w] of pool) {
    r -= w;
    if (r <= 0) return s;
  }
  return pool[pool.length - 1]?.[0] ?? SPECIES[`t${tier}_melee`];
}

/** 소환용: 종족 id이면 그 종족, 행동 유형이면 그 단계에서 그 유형인 종족 */
export function resolveSpecies(tier: number, what: string, rand: () => number): SpeciesDef {
  if (SPECIES[what]) return SPECIES[what];
  const arch = what as Archetype;
  const inPool = TIER_POOLS[tier].some(([id]) => SPECIES[id].arch === arch);
  return inPool ? pickSpecies(tier, rand, (s) => s.arch === arch) : SPECIES[`t${tier}_${arch}`] ?? SPECIES[`t${tier}_melee`];
}

/** 단계마다 나오는 세력 (방 하나를 한 세력이 차지하게 할 때) */
export function tierFactions(tier: number, from: [string, number][] = TIER_POOLS[tier]): Faction[] {
  return [...new Set(from.map(([id]) => SPECIES[id].faction))];
}
