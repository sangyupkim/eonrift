import { SPECIALS, type SpecialKey, type SpecialLine } from './special';

/**
 * 유물 (v10): 유물 파편 5개를 몬스터 연구자 노아에게 가져가면 무작위 유물로 복원해 준다.
 * 종류(14가지)도 등급(일반~신화)도 값도 무작위라 더 좋은 유물을 노려 계속 복원하게 된다.
 * 직업마다 유물 3개를 장착한다 (같은 종류는 하나만). 필요 없는 유물은 분해해 파편 일부를 돌려받는다.
 */
export interface RelicDef {
  id: string;
  name: string;
  /** 붙는 특수 옵션 (값은 장비 유니크 최대값 × 등급 배율 × 굴림) */
  keys: SpecialKey[];
  color: number;
  /** 모습 */
  shape: 'seal' | 'heart' | 'scale' | 'eye' | 'feather' | 'hourglass' | 'fang' | 'spear' | 'scythe' | 'mirror' | 'cloak' | 'flame' | 'ring' | 'spring';
}

export const RELICS: RelicDef[] = [
  { id: 'warlord', name: '전쟁군주의 인장', keys: ['atk'], color: 0xff6a4a, shape: 'seal' },
  { id: 'giant', name: '거인의 심장', keys: ['hp'], color: 0xff4a6a, shape: 'heart' },
  { id: 'dragon', name: '용비늘 부적', keys: ['def', 'dmgReduce'], color: 0x6ab0ff, shape: 'scale' },
  { id: 'hawk', name: '매의 눈', keys: ['crit', 'critDmg'], color: 0xffd23a, shape: 'eye' },
  { id: 'storm', name: '폭풍 깃털', keys: ['speed', 'move'], color: 0x7affd0, shape: 'feather' },
  { id: 'hourglass', name: '시간의 모래시계', keys: ['cdr'], color: 0xe8d08a, shape: 'hourglass' },
  { id: 'fang', name: '흡혈귀의 송곳니', keys: ['lifesteal', 'killHeal'], color: 0xd02a4a, shape: 'fang' },
  { id: 'spear', name: '거인 사냥꾼의 창', keys: ['bossDmg'], color: 0xc8d2e0, shape: 'spear' },
  { id: 'scythe', name: '처형자의 낫', keys: ['execute'], color: 0x9a5aff, shape: 'scythe' },
  { id: 'mirror', name: '쌍둥이 거울', keys: ['double'], color: 0xbfe8ff, shape: 'mirror' },
  { id: 'cloak', name: '그림자 망토', keys: ['dodge', 'dodgeBuff'], color: 0x5a5a8a, shape: 'cloak' },
  { id: 'flame', name: '영겁의 불꽃', keys: ['ult', 'skillDmg'], color: 0xff9a2a, shape: 'flame' },
  { id: 'pact', name: '계약자의 고리', keys: ['summonDmg'], color: 0xc08aff, shape: 'ring' },
  { id: 'spring', name: '마나의 샘', keys: ['mpRegen', 'mp'], color: 0x5ea8ff, shape: 'spring' },
];
export const RELIC_BY_ID: Record<string, RelicDef> = Object.fromEntries(RELICS.map((r) => [r.id, r]));

export const RELIC_GRADES = [
  { name: '일반', color: 0xd8dce6, mult: 0.6, weight: 48, refund: 1 },
  { name: '희귀', color: 0x5aa8ff, mult: 0.9, weight: 30, refund: 2 },
  { name: '영웅', color: 0xc07aff, mult: 1.3, weight: 15, refund: 3 },
  { name: '전설', color: 0xff7a2a, mult: 1.8, weight: 5.5, refund: 5 },
  { name: '신화', color: 0x4affe0, mult: 2.5, weight: 1.5, refund: 8 },
];

export interface Relic {
  uid: string;
  /** 종류 id */
  id: string;
  /** 등급 0~4 */
  g: number;
  /** 옵션 (keys 순서) */
  lines: SpecialLine[];
}

/** 복원 비용: 유물 파편 5 + 골드 */
export const RELIC_CRAFT_SHARDS = 5;
export const RELIC_CRAFT_GOLD = 30000;
/** 직업마다 장착 칸 */
export const RELIC_SLOTS = 3;
/** 가지고 있을 수 있는 유물 수 */
export const RELIC_MAX = 60;

/** 등급 굴리기 (r: 0~1) */
export function rollRelicGrade(r: number): number {
  const total = RELIC_GRADES.reduce((a, g) => a + g.weight, 0);
  let x = r * total;
  for (let i = RELIC_GRADES.length - 1; i >= 0; i--) {
    x -= RELIC_GRADES[i].weight;
    if (x < 0) return i;
  }
  return 0;
}

/** 이 종류·등급에서 한 옵션의 값 범위 */
export function relicRange(k: SpecialKey, g: number): [number, number] {
  const d = SPECIALS[k];
  const m = RELIC_GRADES[g].mult;
  if (d.fixed) return [d.min, d.max];
  return [d.max * m * 0.6, d.max * m];
}

export function rollRelic(rand: () => number, uid: string): Relic {
  const def = RELICS[Math.floor(rand() * RELICS.length) % RELICS.length];
  const g = rollRelicGrade(rand());
  const lines = def.keys.map((k) => {
    const [lo, hi] = relicRange(k, g);
    const v = lo + (hi - lo) * rand();
    return { k, v: SPECIALS[k].int ? Math.round(v) : Math.round(v * 100) / 100 };
  });
  return { uid, id: def.id, g, lines };
}

export function relicName(r: Relic): string {
  return `${RELIC_GRADES[r.g].name} ${RELIC_BY_ID[r.id]?.name ?? '유물'}`;
}
