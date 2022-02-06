import './style.scss';
import { ChooseLevel } from './sprint/script/chooseLevel';

const burger = document.querySelector('.menu') as HTMLElement;
(function switchBurger() {
  burger.addEventListener('click', () => {
    burger.classList.toggle('burger_active');
  });
}());

const chooseLevel = new ChooseLevel();
chooseLevel.createFieldChoose();
