import axios from 'axios';
import { IWordObject } from '../../services/types';
import { createCard } from '../components/play-word';

export const BASE_URL = 'https://rs-learnwords.herokuapp.com/';
const MAX_PAGE = 29;
const MAX_GROUP = 6;

const BUTTON_PREV_ROLE = 'text-book-prev-page';
const BUTTON_NEXT_ROLE = 'text-book-next-button';

class TextBookClass {
  private group: number;

  private page: number;

  private baseUrl: string;

  private wordComponent: (x: IWordObject) => string;

  private container: HTMLElement;

  constructor(baseUrl: string, container: HTMLElement,
    wordComponent: (x: IWordObject) => string,
    initGroup = 1, initPage = 1) {
    this.group = initGroup;
    this.page = initPage;
    this.baseUrl = baseUrl;
    this.container = container;
    this.wordComponent = wordComponent;
  }

  private formatHash(group?: number, page?: number) {
    return `/text-book?group=${group || this.group}&page=${page || this.page}`;
  }

  private updateUI(words: IWordObject[]) {
    window.location.hash = this.formatHash();
    const view = `
      ${words.map((wordObject: IWordObject) => this.wordComponent(wordObject)).join('')}
      <div>
        <button data-role="${BUTTON_PREV_ROLE}"${this.page === 0 ? ' disabled' : ''}
          data-href="${this.formatHash(this.group, this.page - 1)}">Previous page</button>
        <button data-role="${BUTTON_NEXT_ROLE}"${this.page === MAX_PAGE ? ' disabled' : ''}
          data-href="${this.formatHash(this.group, this.page + 1)}">Next page</button>
      </div>`;
    this.container.innerHTML = view;
    return view;
  }

  async updateWordsConainer() {
    const url = `${this.baseUrl}words?group=${this.group}&page=${this.page}`;
    const words = await axios.get(url);
    return this.updateUI(words.data);
  }

  setPage(page: number) {
    if (page < 0 || page > MAX_PAGE) return;
    this.page = page;
  }

  setGroup(group: number) {
    if (group < 0 || group > MAX_GROUP) return;
    this.group = group;
  }

  async nextPage() {
    if (this.page >= MAX_PAGE) return;
    this.page++;
    await this.updateWordsConainer();
  }

  async prevPage() {
    if (this.page < 1) return;
    this.page--;
    await this.updateWordsConainer();
  }
}

let textbook: TextBookClass;
let isEventListenerAdded = false;
if (!isEventListenerAdded) {
  document.body.addEventListener('click', async (e: MouseEvent) => {
    isEventListenerAdded = true;
    const target = e.target as HTMLElement;
    switch (target.dataset.role) {
      case BUTTON_PREV_ROLE:
        await textbook.prevPage();
        break;
      case BUTTON_NEXT_ROLE:
        await textbook.nextPage();
        break;
      default:
        break;
    }
  });
}
export const TextBook = async (params?: Record<string, string>) => {
  textbook = new TextBookClass(BASE_URL, document.querySelector('#page_container') || document.body, createCard);
  const args = params as { group: string, page: string };
  const group = +args.group;
  const page = +args.page;

  if (!Number.isNaN(group)) { textbook.setGroup(group); }
  if (!Number.isNaN(page)) { textbook.setPage(page); }
  return textbook.updateWordsConainer();
};
