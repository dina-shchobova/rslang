import './style.scss';
import { Authorization } from './authorization/authorization';

import { ApplicationRoute } from './services/application-route';
import { Home } from './views/pages/home';
import { Games } from './views/pages/games';
import { Statistics } from './views/pages/statistics';
import { TextBook } from './views/pages/text-book';

const authorization = new Authorization();
authorization.createFieldAuthorization();

const content = document.getElementById('page_container') as HTMLDivElement;

const routes = {
  '/': Home,
  '/text-book': TextBook,
  '/games': Games,
  '/statistics': Statistics,
};

const notFound = async () => ({ html: '<div>Not Found</div>' });
const app = new ApplicationRoute(content, routes, notFound);
app.listen();

const burger = document.querySelector('.menu') as HTMLElement;
(function switchBurger() {
  burger.addEventListener('click', () => {
    burger.classList.toggle('burger_active');
  });
}());
