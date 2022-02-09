import { PageContentRoutes, PageContentThunk } from './types';

export class ApplicationRoute {
  content: HTMLDivElement;

  routes: PageContentRoutes;

  notFound: PageContentThunk;

  constructor(content: HTMLDivElement, routes: PageContentRoutes, notFound: PageContentThunk) {
    this.content = content;
    this.routes = routes;
    this.notFound = notFound;
  }

  router() {
    const url = window.location.hash.slice(1).toLowerCase() || '/';
    const resource = url.split('/')[1];
    const request = { resource };
    const parsedURL = request.resource ? `/${request.resource}` : '/';
    if (this.routes[parsedURL]) return this.routes[parsedURL]();
    return this.notFound();
  }

  private async setHTML() {
    const temp = await this.router();
    this.content.innerHTML = temp;
  }

  async listen() {
    window.addEventListener('hashchange', this.setHTML);
    window.addEventListener('load', this.setHTML);
  }
}
