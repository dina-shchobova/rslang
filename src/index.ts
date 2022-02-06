import './style.scss';
import './audiocall/styles/audiocallStyle.scss';
import { Audiocall } from './audiocall/components/Audiocall';

const audiocall = new Audiocall();
audiocall.mount(document.body);

const burger = document.querySelector('.menu') as HTMLElement;
(function switchBurger() {
  burger.addEventListener('click', () => {
    burger.classList.toggle('burger_active');
  });
}());
