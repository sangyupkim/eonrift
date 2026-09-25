import './style.css';
import { Game } from './game/Game';
import { setupInstall } from './ui/install';

// 설치 제안 이벤트는 페이지가 뜨자마자 오므로 게임보다 먼저 받아 둔다
setupInstall();

const app = document.getElementById('app')!;
const game = new Game(app);
// 주소 뒤에 ?debug 를 붙이면 개발자 도구에서 game 객체를 쓸 수 있다
if (new URLSearchParams(location.search).has('debug')) {
  (window as unknown as { game: Game }).game = game;
  void import('./game/scenes/Weather').then((w) => ((window as unknown as { setWeather: typeof w.setWeather }).setWeather = w.setWeather));
}

// 홈 화면 추가와 오프라인 실행 (배포 빌드에서만)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}
