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
    const url1 = (window.location.hash.slice(1).toLowerCase() || '/').split('?');
    const url = url1[0];
    let query = {};
    if (url1[1]) {
      const params = url1[1].split('&').map((p) => p.split('='));
      query = Object.fromEntries(params);
    }
    const resource = url.split('/')[1];
    const request = { resource };
    const parsedURL = request.resource ? `/${request.resource}` : '/';
    this.unmount();
    const route = this.routes[parsedURL] ?? this.notFound;
    const { html, mount, unmount } = await route(query);
    this.unmount = unmount || (() => { });
    if (mount) mount();
    return html;
  }

  async listen() {
    window.addEventListener('hashchange', async () => this.setHTML());
    window.addEventListener('load', async () => this.setHTML());
  }

  private async setHTML() {
    this.content.innerHTML = await this.router();
  }
}
