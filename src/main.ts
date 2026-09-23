import './style.css';
import { Game } from './game/Game';

const app = document.getElementById('app')!;
const game = new Game(app);
// 주소 뒤에 ?debug 를 붙이면 개발자 도구에서 game 객체를 쓸 수 있다
if (new URLSearchParams(location.search).has('debug')) (window as unknown as { game: Game }).game = game;
