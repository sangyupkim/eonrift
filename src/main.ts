import './style.css';
import { Game } from './game/Game';

const app = document.getElementById('app')!;
const game = new Game(app);
// 주소 뒤에 ?debug 를 붙이면 개발자 도구에서 game 객체를 쓸 수 있다
if (new URLSearchParams(location.search).has('debug')) (window as unknown as { game: Game }).game = game;

// 홈 화면 추가와 오프라인 실행 (배포 빌드에서만)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}
