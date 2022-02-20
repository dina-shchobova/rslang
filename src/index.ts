import './style.scss';
import { Authorization } from './authorization/authorization';

import { StartGameSprint } from './sprint/script/startGame';
import { ApplicationRoute } from './services/application-route';
import { Home } from './views/pages/home';

import { TextBook } from './views/pages/text-book';
import { AuthorizationPage } from './views/pages/authorization';
import { Games } from './views/pages/games';
import { Statistics } from './views/pages/statistics';
import './audiocall/styles/audiocallStyle.scss';
import { Audiocall } from './audiocall/components/Audiocall';
import { PageComponentThunk } from './services/types';
import { DifficultWords } from './views/pages/difficult-words';

const authorization = new Authorization();
authorization.createFieldAuthorization();

const main = document.body.querySelector('main') as HTMLElement;

const SprintBinder: PageComponentThunk = async () => {
  const startSprint = new StartGameSprint();
  return {
    html: '',
    mount: () => startSprint.start(),
    unmount: () => startSprint.stop(),
  };
};

const AudioCallBinder: PageComponentThunk = async () => {
  const audiocall = new Audiocall();
  return {
    html: '',
    mount: () => audiocall.mount(main),
    unmount: () => audiocall.unmount(),
  };
};

const routes = {
  '/': Home,
  '/text-book': TextBook,
  '/authorization': AuthorizationPage,
  '/games': Games,
  '/audiocall': AudioCallBinder,
  '/sprint': SprintBinder,
  '/statistics': Statistics,
  '/difficult-words': DifficultWords,
};

const notFound = async () => ({ html: '<div>Not Found</div>' });
const app = new ApplicationRoute(main, routes, notFound);
app.listen();

const burger = document.querySelector('.menu') as HTMLElement;
const overlay = document.querySelector('.overlay') as HTMLElement;
(function switchBurger() {
  burger.addEventListener('click', () => {
    burger.classList.toggle('burger_active');
    overlay.classList.toggle('hide-overlay');
  });
}());
