import { mico } from './icons';
/** 홈 화면에 앱으로 설치하기 (PWA) */
interface InstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let deferred: InstallPromptEvent | null = null;

const isStandalone = () =>
  window.matchMedia('(display-mode: fullscreen)').matches ||
  window.matchMedia('(display-mode: standalone)').matches ||
  (navigator as Navigator & { standalone?: boolean }).standalone === true;

const isIos = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

export function setupInstall(): void {
  window.addEventListener('beforeinstallprompt', (e) => {
    // 브라우저 기본 배너 대신 타이틀의 설치 버튼으로 띄운다
    e.preventDefault();
    deferred = e as InstallPromptEvent;
    // 타이틀이 이미 떠 있으면 설치 버튼을 붙인다
    const menu = document.querySelector('.title-menu');
    if (menu && !menu.querySelector('[data-a="install"]') && !isStandalone()) {
      const b = document.createElement('button');
      b.className = 'install';
      b.dataset.a = 'install';
      b.innerHTML = `${mico('phone', '📲', 'mico-inline')} 앱으로 설치`;
      b.addEventListener('click', () => void promptInstall());
      menu.appendChild(b);
    }
  });
  window.addEventListener('appinstalled', () => {
    deferred = null;
    document.querySelector('[data-a="install"]')?.remove();
  });
}

/** 설치 버튼을 보여 줄지: 이미 앱으로 실행 중이면 숨긴다 */
export function canInstall(): boolean {
  if (isStandalone()) return false;
  return deferred !== null || isIos() || /android/i.test(navigator.userAgent);
}

export async function promptInstall(): Promise<void> {
  if (deferred) {
    await deferred.prompt();
    const choice = await deferred.userChoice;
    if (choice.outcome === 'accepted') deferred = null;
    return;
  }
  if (isIos()) {
    alert('iPhone·iPad(Safari): 아래쪽 공유 버튼(□↑)을 누른 뒤 "홈 화면에 추가"를 고르세요.');
  } else {
    alert('브라우저 메뉴(⋮)에서 "앱 설치" 또는 "홈 화면에 추가"를 고르세요.\n(크롬에서 설치 버튼이 바로 안 뜨면 페이지를 한 번 새로고침해 보세요.)');
  }
}
