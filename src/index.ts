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
import { ChartDay } from './charts/chartByDay';

const authorization = new Authorization();
authorization.createFieldAuthorization();

const pageContainer = document.createElement('div');

pageContainer.classList.add('container');
pageContainer.id = 'page_container';
document.body.appendChild(pageContainer);

const content = document.getElementById('page_container') as HTMLDivElement;

const SprintBinder = async (): Promise<string> => {
  const main = document.body.querySelector('main') as HTMLElement;
  main.innerHTML = '';
  const startSprint = new StartGameSprint();
  startSprint.start();
  return '';
};

const AudioCallBinder = async (): Promise<string> => {
  const main = document.body.querySelector('main') as HTMLElement;
  main.innerHTML = '';
  const audiocall = new Audiocall();
  audiocall.mount(main);
  return '';
};

const routes = {
  '/': Home,
  '/text-book': TextBook,
  '/authorization': AuthorizationPage,
  '/games': Games,
  '/audiocall': AudioCallBinder,
  '/sprint': SprintBinder,
  '/winners': Statistics,
};

const notFound = async () => '<div>Not Found</div>';
const app = new ApplicationRoute(content, routes, notFound);
app.listen();

const burger = document.querySelector('.menu') as HTMLElement;
(function switchBurger() {
  burger.addEventListener('click', () => {
    burger.classList.toggle('burger_active');
  });
}());

const chart = new ChartDay();
const main = document.querySelector('main');
chart.mount(main as HTMLElement);
