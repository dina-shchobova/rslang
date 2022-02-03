import './style.scss';
import { Authorization } from './authorization/authorization';

const authorization = new Authorization();
authorization.createFieldAuthorization();

const burger = document.querySelector('.menu') as HTMLElement;
(function switchBurger() {
  burger.addEventListener('click', () => {
    burger.classList.toggle('burger_active');
  });
}());
