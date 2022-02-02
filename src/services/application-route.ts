import { Home } from '../views/pages/home';
import { TextBook } from '../views/pages/text-book';
import { Games } from '../views/pages/games';
import { Statistics } from '../views/pages/statistics';
import { Navbar } from '../views/components/navbar';
import Utils, { IResource } from './utils';

export const ApplicationRoute = (): void => {
  const routes: any = {
    '/': Home,
    '/text-book': TextBook,
    '/games': Games,
    '/winners': Statistics,
  };
  const headerStart = document.createElement('header');
  const pageContainer = document.createElement('div');
  headerStart.classList.add('header');
  headerStart.id = 'header';
  document.body.appendChild(headerStart);
  pageContainer.classList.add('container');
  pageContainer.id = 'page_container';
  document.body.appendChild(pageContainer);

  const router = async () => {
    const header = document.getElementById('header') as HTMLElement;
    const content = document.getElementById('page_container') as HTMLDivElement;
    header.innerHTML = await Navbar();
    const request: IResource = Utils.parseRequestURL();
    const parsedURL: string = request.resource ? `/${request.resource}` : '/';
    const page = routes[parsedURL];
    content.innerHTML = await page();
  };

  window.addEventListener('hashchange', router);
  window.addEventListener('load', router);
};
