import './style.scss';
import { StartGameSprint } from './sprint/script/startGame';

const burger = document.querySelector('.menu') as HTMLElement;
(function switchBurger() {
  burger.addEventListener('click', () => {
    burger.classList.toggle('burger_active');
  });
}());

const startSprint = new StartGameSprint();
startSprint.start();
