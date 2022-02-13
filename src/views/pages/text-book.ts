import axios from 'axios';
import { IWordObject, PageComponentThunk } from '../../services/types';
import { createOneWordDiv } from '../components/play-word';

export const BASE_URL = 'https://rs-learnwords.herokuapp.com/';
const MAX_PAGE = 29;
const MAX_GROUP = 6;
const ZERO_PAGE = 0;
const PAGINATION_BUTTONS_QUANITY = 7;

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
    initGroup = 1, initPage = ZERO_PAGE) {
    this.group = initGroup;
    this.page = initPage;
    this.baseUrl = baseUrl;
    this.container = container;
    this.wordComponent = wordComponent;
  }

  private formatHash(group?: number, page?: number) {
    return `/text-book?group=${group || this.group}&page=${page}`;
  }

  private async updateUI() {
    window.location.hash = this.formatHash();
    this.container.innerHTML = await this.getWordsConainer();
  }

  private getButton(currentPage: number) {
    let current = '';
    if (currentPage - 1 === +window.location.hash.split('=')[2]) {
      current = 'current-page';
    }
    return `
      <button class="btn ${current}" data-href="${this.formatHash(this.group, currentPage - 1)}">
        ${currentPage}
      </button>
    `;
  }

  private getButtonsArray(paginationArray: number []) {
    if (paginationArray[0] < 2) return paginationArray.map((x) => this.getButton(x + this.page - 2)).join('');
    return paginationArray.map((x) => this.getButton(x)).join('');
  }

  getView(words: IWordObject[]) {
    let pager;
    let currentOne = '';
    let currentLast = '';
    if (this.page < PAGINATION_BUTTONS_QUANITY - 2) pager = this.getButtonsArray([2, 3, 4, 5, 6, 7, 8]);
    else if (this.page > MAX_PAGE - (PAGINATION_BUTTONS_QUANITY - 2)) {
      pager = this.getButtonsArray([23, 24, 25, 26, 27, 28, 29]);
    } else {
      pager = this.getButtonsArray([...Array(PAGINATION_BUTTONS_QUANITY).keys()]);
    }
    if (window.location.hash === '#/text-book' || this.page === 0) {
      currentOne = 'current-page';
    }
    if (this.page === 29) {
      currentLast = 'current-page';
    }
    return `<div id="pagination-buttons" class="pagination-buttons">
        <button class="btn" id="prev-button" data-role="${BUTTON_PREV_ROLE}"${this.page === 0 ? ' disabled' : ''}
        data-href="${this.formatHash(this.group, this.page - 1)}"${this.page === 0 ? ' disabled' : ''}>&#9664;</button>
        <button class="btn ${currentOne}" data-href="${this.formatHash(this.group, 0)}">1</button>
        <button class="btn"
          data-href="${this.formatHash(this.group, this.page - 7)}"${this.page < 7 ? ' disabled' : ''}>
          ...
        </button>
        ${pager}
        <button class="btn"
          data-href="${this.formatHash(this.group, this.page + 7)}"${this.page > 22 ? ' disabled' : ''}>
          ...
        </button>
        <button class="btn ${currentLast}" data-href="${this.formatHash(this.group, MAX_PAGE)}">${MAX_PAGE + 1}</button>
        <button class="btn" id="next-button" data-role="${BUTTON_NEXT_ROLE}"${this.page === MAX_PAGE ? ' disabled' : ''}
        data-href="${this.formatHash(this.group, this.page + 1)}">&#9654;</button>
      </div>
      <div class="word-cards-container">
        ${words.map((wordObject: IWordObject) => this.wordComponent(wordObject)).join('')}
      </div>`;
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
  <p class="text-meaning">${wordObject.textMeaning}</p>
  <p class="text-meaning-translate">${wordObject.textMeaningTranslate}</p>
  <div class="line"></div>
  <p class="text-example">${wordObject.textExample}</p>
  <p class="text-example-translate">${wordObject.textExampleTranslate}</p>`;
const createCard = (wordObject: IWordObject) => `
  <div class="word-card">
    <img class="word-image" src="${BASE_URL + wordObject.image} " alt="${wordObject.word}"/>
    <div class="word-description">
      ${createOneWordDiv(wordObject)}${cardDescription(wordObject)}
    </div>
  </div>
  `;

const clickHandler = async (e: MouseEvent): Promise<void> => {
  const target = e.target as HTMLElement;
  if (target.dataset.href) window.location.hash = target.dataset.href;
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
