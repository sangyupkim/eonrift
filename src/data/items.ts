export interface ItemDef {
  id: string;
  name: string;
  /** 가방 아이콘 색 */
  color: number;
  description: string;
}

const defs: ItemDef[] = [
  { id: 'iron_ore', name: '철광석', color: 0x8a8f99, description: '제련하면 철 주괴가 된다.' },
  { id: 'wood', name: '목재', color: 0x9a6a3c, description: '어디에나 쓰이는 기본 재료.' },
  { id: 'copper_ore', name: '구리광석', color: 0xd07a45, description: '마력선의 재료가 된다.' },
  { id: 'silver_ore', name: '은광석', color: 0xcfd8e3, description: '마력을 잘 머금는 금속.' },
  { id: 'frost_crystal', name: '서리 결정', color: 0x9fe3ff, description: '차갑게 빛나는 결정.' },
  { id: 'mana_crystal', name: '마력 수정', color: 0xb67cff, description: '순수한 마력이 굳은 수정.' },
  { id: 'mithril', name: '미스릴', color: 0x7fe0d0, description: '가볍고 단단한 전설의 금속.' },
  { id: 'gear_part', name: '톱니 부품', color: 0xc9a44a, description: '폐공장에서 건진 마공학 부품.' },
  { id: 'magi_alloy', name: '마공 합금', color: 0x6fa0c8, description: '마력을 전도하는 합금.' },
  { id: 'obsidian', name: '흑요석', color: 0x3a3048, description: '용암이 식어 만들어진 돌.' },
  { id: 'fire_core', name: '화염 핵', color: 0xff6a2a, description: '뜨거운 열기를 품은 핵.' },
  { id: 'dimension_crystal', name: '차원 결정', color: 0x5ef0ff, description: '차원의 힘이 굳어진 결정.' },
  { id: 'void_stone', name: '공허석', color: 0x6b4dff, description: '빛을 삼키는 기묘한 돌.' },
];

export const ITEMS: Record<string, ItemDef> = Object.fromEntries(defs.map((d) => [d.id, d]));
