import { MAIN_QUESTS } from '../data/quests';
import { npcName } from '../ui/screens';
import type { Progress } from './Progress';
import type { Quests } from './Quests';
import type { NpcId } from './scenes/VillageScene';

/** 지금 해야 할 일 (HUD 목표 표시). 메인 퀘스트가 먼저, 그 뒤로는 차원석 이야기 */
export function objective(p: Progress, quests: Quests): string {
  const stones = p.stoneCount;
  const f = (n: string) => p.flag(n) > 0;
  if (!f('intro')) return '';
  for (const q of MAIN_QUESTS) {
    if (quests.isDone(q.id)) continue;
    if (quests.isActive(q.id)) {
      if (quests.canComplete(q)) return `${npcName(q.npc)}에게 보고하자 (${q.title})`;
      const prog = quests.progress(q).filter((x) => x.cur < x.need);
      return `${q.title}: ${prog.map((x) => `${x.text} ${x.cur}/${x.need}`).join(', ')}`;
    }
    return `${npcName(q.npc)}에게 말을 걸자 (머리 위 !)`;
  }
  if (stones >= 2 && !p.data.unlockedClasses.includes('mage')) return '촌장 에단과 이야기하자';
  if (stones >= 3 && !f('smith3')) return '대장장이 고른과 이야기하자';
  if (stones >= 4 && !p.data.unlockedClasses.includes('archer')) return '마을 남서쪽의 수상한 인물을 찾아가자';
  if (stones < 7) return `${stones + 1}-10의 수호자를 쓰러뜨리자 (차원석 ${stones}/7)`;
  if (!f('resonatorHint')) return '마공학자 세라와 이야기하자';
  if (p.count('resonator') === 0) return '차원집 조립기로 차원석 공명 장치를 만들자';
  return '촌장 에단에게 공명 장치를 가져가자';
}

/** 퀘스트가 아닌 이야기 대사 (차원석 진행에 따른 장면) */
export function scriptFor(npc: NpcId, p: Progress): string {
  const stones = p.stoneCount;
  const f = (n: string) => p.flag(n) > 0;
  switch (npc) {
    case 'chief':
      if (stones >= 2 && !p.data.unlockedClasses.includes('mage')) return 'ch2';
      if (stones >= 7 && p.count('resonator') > 0) return 'final';
      if (stones >= 3 && !f(`stoneTalk${stones}`)) return 'stone_n';
      return 'chief_idle';
    case 'engineer':
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

/** 이야기할 거리가 있는지 (평범한 인사가 아닌 대사) */
export function hasStory(npc: NpcId, p: Progress): boolean {
  const s = scriptFor(npc, p);
  return !s.endsWith('_idle') && s !== 'guide_after_stone' && s !== 'stone_n';
}

/** 회차를 넘길 때 초기화할 이야기 플래그 */
export function resetForNewCycle(p: Progress): void {
  const keep = new Set(['intro', 'returned', 'legend', 'home', 'factoryBuilt', 'endingA', 'endingB', 'tool_pickaxe', 'tool_axe', 'stone1Talk']);
  for (const k of Object.keys(p.data.flags)) if (!keep.has(k) && !k.startsWith('bp_')) delete p.data.flags[k];
}
