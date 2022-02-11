import axios from 'axios';
import { IWordObject, PageComponentThunk } from '../../services/types';
import { createOneWordDiv } from '../components/play-word';

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

  private async updateUI() {
    window.location.hash = this.formatHash();
    this.container.innerHTML = await this.getWordsConainer();
  }

  getView(words: IWordObject[]) {
    return `<div id="pagination-buttons">
        <button id="prev-button" data-role="${BUTTON_PREV_ROLE}"${this.page === 0 ? ' disabled' : ''}
        data-href="${this.formatHash(this.group, this.page - 1)}">Previous page</button>
        <button id="next-buttom" data-role="${BUTTON_NEXT_ROLE}"${this.page === MAX_PAGE ? ' disabled' : ''}
        data-href="${this.formatHash(this.group, this.page + 1)}">Next page</button>
      </div>
      ${words.map((wordObject: IWordObject) => this.wordComponent(wordObject)).join('')}`;
  }

  async getWords() {
    const url = `${this.baseUrl}words?group=${this.group}&page=${this.page}`;
    return axios.get(url).then((d) => d.data);
  }

  async getWordsConainer() {
    return this.getView(await this.getWords());
  }

  setPage(page: number) {
    if (page < 0 || page > MAX_PAGE) return;
    this.page = page;
  }

  setGroup(group: number) {
    if (group < 0 || group > MAX_GROUP) return;
    this.group = group;
  }
}

let textbook: TextBookClass;

const cardDescription = (wordObject: IWordObject) => `
  <p class="word-translate">${wordObject.wordTranslate}</p>
  <img class="word-image" src="${BASE_URL + wordObject.image} " alt="${wordObject.word}"/>
  <p class="text-meaning">${wordObject.textMeaning}</p>
  <p class="text-meaning-translate">${wordObject.textMeaningTranslate}</p>
  <p class="text-example">${wordObject.textExample}</p>
  <p class=""text-example-translate>${wordObject.textExampleTranslate}</p>`;
const createCard = (wordObject: IWordObject) => `
  <div class="word-card">${createOneWordDiv(wordObject)}${cardDescription(wordObject)}</div>`;

const clickHandler = async (e: MouseEvent): Promise<void> => {
  const target = e.target as HTMLElement;
  window.location.hash = target.dataset.href || '/';
};

const mount = () => {
  const el = document.getElementById('pagination-buttons') as HTMLDivElement;
  el.addEventListener('click', clickHandler);
};

const unmount = () => {
  const el = document.getElementById('pagination-buttons') as HTMLDivElement;
  if (el) el.removeEventListener('click', clickHandler);
};

export const TextBook: PageComponentThunk = async (params) => {
  textbook = new TextBookClass(BASE_URL, document.querySelector('#page_container') || document.body, createCard);
  const args = params as { group: string, page: string };
  const group = +args.group;
  const page = +args.page;

  if (!Number.isNaN(group)) { textbook.setGroup(group); }
  if (!Number.isNaN(page)) { textbook.setPage(page); }

  return { html: await textbook.getWordsConainer(), mount, unmount };
};
