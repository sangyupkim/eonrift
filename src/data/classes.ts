export type ClassId = 'sword' | 'mage' | 'archer';

export interface SkillDef {
  name: string;
  mp: number;
  cooldown: number;
  description: string;
}

export interface ClassDef {
  id: ClassId;
  name: string;
  short: string;
  baseHp: number;
  baseMp: number;
  baseAtk: number;
  /** 기본 공격 간격 (초) */
  attackTime: number;
  look: { tunic: number; tunicDark: number; hair: number; weapon: 'sword' | 'staff' | 'bow' };
  basic: string;
  skills: [SkillDef, SkillDef, SkillDef];
  weaponNoun: string;
}

export const CLASSES: Record<ClassId, ClassDef> = {
  sword: {
    id: 'sword',
    name: '검사',
    short: '검',
    baseHp: 130,
    baseMp: 50,
    baseAtk: 12,
    attackTime: 0.36,
    look: { tunic: 0x2f6fd6, tunicDark: 0x2456a8, hair: 0x4a3024, weapon: 'sword' },
    basic: '3타 베기 콤보',
    weaponNoun: '검',
    skills: [
      { name: '돌진 베기', mp: 12, cooldown: 4, description: '앞으로 돌진하며 지나가는 적을 벤다.' },
      { name: '회전 베기', mp: 16, cooldown: 6, description: '주변의 모든 적을 벤다.' },
      { name: '대지 가르기', mp: 22, cooldown: 8, description: '앞으로 뻗어 나가는 충격파를 날린다.' },
    ],
  },
  mage: {
    id: 'mage',
    name: '마법사',
    short: '마',
    baseHp: 90,
    baseMp: 110,
    baseAtk: 14,
    attackTime: 0.45,
    look: { tunic: 0x7a3fc4, tunicDark: 0x5a2c96, hair: 0xd8d0e8, weapon: 'staff' },
    basic: '마력탄',
    weaponNoun: '지팡이',
    skills: [
      { name: '화염구', mp: 16, cooldown: 3.5, description: '부딪히면 폭발하는 화염구를 던진다.' },
      { name: '얼음 장판', mp: 20, cooldown: 7, description: '적을 느리게 하고 계속 피해를 주는 얼음 장판을 깐다.' },
      { name: '번개 연쇄', mp: 24, cooldown: 6, description: '가까운 적들 사이로 번개가 튄다.' },
    ],
  },
  archer: {
    id: 'archer',
    name: '궁수',
    short: '궁',
    baseHp: 105,
    baseMp: 70,
    baseAtk: 11,
    attackTime: 0.3,
    look: { tunic: 0x3f9a4a, tunicDark: 0x2c7236, hair: 0xc9782e, weapon: 'bow' },
    basic: '화살 연사',
    weaponNoun: '활',
    skills: [
      { name: '관통 화살', mp: 12, cooldown: 3, description: '적을 꿰뚫는 강한 화살을 쏜다.' },
      { name: '부채꼴 연사', mp: 16, cooldown: 5, description: '다섯 발의 화살을 부채꼴로 쏜다.' },
      { name: '후방 도약', mp: 14, cooldown: 7, description: '뒤로 뛰며 그 자리에 폭발하는 덫을 남긴다.' },
    ],
  },
};

export const CLASS_ORDER: ClassId[] = ['sword', 'mage', 'archer'];

export function expToNext(level: number): number {
  return Math.round(24 * Math.pow(level, 1.55));
}
