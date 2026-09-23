import type { Progress } from './Progress';
import type { NpcId } from './scenes/VillageScene';

/** 지금 해야 할 일 (HUD 목표 표시) */
export function objective(p: Progress): string {
  const stones = p.stoneCount;
  const f = (n: string) => p.flag(n) > 0;
  if (!f('intro')) return '';
  if (!f('returned')) return '북쪽 차원문 광장에서 1단계 차원문에 들어가자';
  if (!f('legend')) return '분수대 옆의 촌장 에단과 이야기하자';
  if (stones === 0) return '1단계 차원문 끝의 수호자를 쓰러뜨리자';
  if (!f('stone1Talk')) return '촌장 에단에게 차원석을 보여주자';
  if (!f('home')) return '동쪽의 마공학자 세라와 이야기하자';
  if (!f('factoryBuilt')) return '차원집(동쪽 보라색 문)에서 발전기를 세워 보자';
  if (stones >= 2 && !p.data.unlockedClasses.includes('mage')) return '촌장 에단과 이야기하자';
  if (stones >= 3 && !f('smith3')) return '대장장이 고른과 이야기하자';
  if (stones >= 4 && !p.data.unlockedClasses.includes('archer')) return '마을 남서쪽의 수상한 인물을 찾아가자';
  if (stones < 7) return `${stones + 1}단계 수호자를 쓰러뜨리자 (차원석 ${stones}/7)`;
  if (!f('resonatorHint')) return '마공학자 세라와 이야기하자';
  if (p.count('resonator') === 0) return '차원집 조립기로 차원석 공명 장치를 만들자';
  return '촌장 에단에게 공명 장치를 가져가자';
}

/** NPC에게 말을 걸었을 때 재생할 대사 */
export function scriptFor(npc: NpcId, p: Progress): string {
  const stones = p.stoneCount;
  const f = (n: string) => p.flag(n) > 0;
  switch (npc) {
    case 'chief':
      if (f('returned') && !f('legend')) return 'legend';
      if (stones >= 1 && !f('stone1Talk')) return 'stone1';
      if (stones >= 2 && !p.data.unlockedClasses.includes('mage')) return 'ch2';
      if (stones >= 7 && p.count('resonator') > 0) return 'final';
      if (stones >= 3 && !f(`stoneTalk${stones}`)) return 'stone_n';
      return 'chief_idle';
    case 'engineer':
      if (stones >= 1 && f('stone1Talk') && !f('home')) return 'home_unlock';
      if (stones >= 7 && !f('resonatorHint')) return 'engineer_final';
      return 'engineer_idle';
    case 'smith':
      if (stones >= 3 && !f('smith3')) return 'smith_ch3';
      return 'smith_idle';
    case 'stranger':
      if (!p.data.unlockedClasses.includes('archer')) return 'secret';
      return 'stranger_idle';
    case 'guide':
      return stones >= 1 ? 'guide_after_stone' : 'guide_idle';
    case 'merchant':
      return 'merchant_idle';
  }
}

/** 이야기할 거리가 있는 NPC에 '!' 표시 */
export function hasNews(npc: NpcId, p: Progress): boolean {
  const s = scriptFor(npc, p);
  return !s.endsWith('_idle') && s !== 'guide_after_stone' && s !== 'stone_n';
}

/** 회차를 넘길 때 초기화할 이야기 플래그 */
export function resetForNewCycle(p: Progress): void {
  const keep = new Set(['intro', 'returned', 'legend', 'home', 'factoryBuilt', 'endingA', 'endingB']);
  for (const k of Object.keys(p.data.flags)) if (!keep.has(k)) delete p.data.flags[k];
  // 세라에게 다시 들르지 않아도 되도록 첫 차원석 이야기는 유지
  p.setFlag('stone1Talk');
}
