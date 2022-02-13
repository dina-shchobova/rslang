import { PageRoutes, PageComponentThunk } from './types';

export class ApplicationRoute {
  private content: HTMLDivElement;

  private routes: PageRoutes;

  private notFound: PageComponentThunk;

  private unmount: () => void;

  constructor(content: HTMLDivElement, routes: PageRoutes, notFound: PageComponentThunk) {
    this.content = content;
    this.routes = routes;
    this.notFound = notFound;
    this.unmount = () => { };
  }

  async router() {
    const urlWithQuery = (window.location.hash.slice(1).toLowerCase() || '/').split('?');
    const url = urlWithQuery[0];
    let query = {};
    if (urlWithQuery[1]) {
      const params = urlWithQuery[1].split('&').map((p) => p.split('='));
      query = Object.fromEntries(params);
    }
    const resource = url.split('/')[1];
    const request = { resource };
    const parsedURL = request.resource ? `/${request.resource}` : '/';
    this.unmount();
    const route = this.routes[parsedURL] ?? this.notFound;
    const { html, mount, unmount } = await route(query);
    this.unmount = unmount || (() => { });
    this.content.innerHTML = html;
    if (mount) mount();
  }

  async listen() {
    window.addEventListener('hashchange', async () => this.router());
    window.addEventListener('load', async () => this.router());
  }
}
