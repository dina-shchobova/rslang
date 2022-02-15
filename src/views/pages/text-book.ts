import axios from 'axios';
import { BASE_URL } from '../../services/constants';
import { IWordObject, PageComponentThunk } from '../../services/types';
import { createOneWordDiv, createHandler as createAudioHandler } from '../components/play-word';

const MAX_PAGE = 30;
const MAX_GROUP = 7;
const ZERO_PAGE = 1;
const PAGINATION_BTNS_QUANITY = 7;

const BTN_PREV_ROLE = 'text-book-prev-page';
const BTN_NEXT_ROLE = 'text-book-next-button';

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

  formatHash(group?: number, page?: number) {
    return `/text-book?group=${group || this.group}&page=${page || this.page}`;
  }

  private getButton(page: number) {
    let current = '';
    if (page === this.page) {
      current = 'current-page';
    }
    return `
      <button class="btn num ${current}" data-href="${this.formatHash(this.group, page)}">
        ${page}
      </button>
    `;
  }

  private createPagerButton(
    btnRole: string,
    btnHrefNum: number,
    btnContent: number | string,
    btnAble = '',
    btnClass = '',
    btnID = '',
    btnTitle = '',
  ) {
    return `
      <button
        data-role="${btnRole}"
        data-href="${this.formatHash(this.group, btnHrefNum)}"
        ${btnAble}
        class="btn ${btnClass}"
        id="${btnID}"
        title = "${btnTitle.toString()}",
      >
        ${btnContent.toString()}
      </button>
    `;
  }

  private createButtonsArray(paginationArray: number[]) {
    const middle = Math.floor(PAGINATION_BTNS_QUANITY / 2);
    const fn = paginationArray[0] === 0
      ? (x: number) => this.getButton(x + this.page - middle)
      : (x: number) => this.getButton(x);
    return paginationArray.map(fn).join('');
  }

  private getArrayFromNum = (num: number) => [...Array(PAGINATION_BTNS_QUANITY).keys()].map((x) => x + num);

  private getGroupButton = (): string => `
    <div class="dropdown-groups">
    <button class="dropdown-menu color${this.group}">${this.group}</button>
    <div class="dropdown-child">
      ${[...Array(6).keys()].map((n: number) => `
      <a
        class="group-link color${n + 1} ${this.group === n + 1 ? 'hide-link' : ''}"
        href="#/text-book?group=${n + 1}&page=1"
      >
        Группа ${n + 1}
      </a>
      `).join('')}
    </div>
  </div>
  `;

  getView(words: IWordObject[]) {
    let pager;
    let isZeroPageCurrent = '';
    let isLastPageCurrent = '';
    const pageOffSet = 2;

    const arrayStartsFromTwo = this.getArrayFromNum(pageOffSet);
    const arrayStartsFromTwentyThree = this.getArrayFromNum(MAX_PAGE - PAGINATION_BTNS_QUANITY);
    const arrayFromSeven = this.getArrayFromNum(0);

    const middleWhenLeftElementIsTwo = PAGINATION_BTNS_QUANITY - pageOffSet;
    const middleWhenMaxElementisTwentyNine = MAX_PAGE - (PAGINATION_BTNS_QUANITY - pageOffSet);
    const previousPage = this.page - 1;
    const nextPage = this.page + 1;
    const pageMinusSeven = this.page - PAGINATION_BTNS_QUANITY;
    const pagePlusSeven = this.page + PAGINATION_BTNS_QUANITY;

    if (this.page < middleWhenLeftElementIsTwo) {
      pager = this.createButtonsArray(arrayStartsFromTwo);
    } else if (this.page > middleWhenMaxElementisTwentyNine) {
      pager = this.createButtonsArray(arrayStartsFromTwentyThree);
    } else {
      pager = this.createButtonsArray(arrayFromSeven);
    }
    if (this.page === ZERO_PAGE) {
      isZeroPageCurrent = 'current-page';
    }
    if (this.page === MAX_PAGE) {
      isLastPageCurrent = 'current-page';
    }

    const disableLowThanZero = this.page <= PAGINATION_BTNS_QUANITY
      ? ''
      : `to page ${this.page - PAGINATION_BTNS_QUANITY}`;
    const disableMoreThanMaxPage = this.page > MAX_PAGE - PAGINATION_BTNS_QUANITY
      ? ''
      : `to page ${this.page + PAGINATION_BTNS_QUANITY}`;
    const disabledIfZero = this.page === ZERO_PAGE ? ' disabled' : '';
    const disabledIfMaxPage = this.page === MAX_PAGE ? ' disabled' : '';
    const disableLowThan7 = this.page <= PAGINATION_BTNS_QUANITY ? ' disabled' : '';
    const disableMoreThan23 = this.page > MAX_PAGE - PAGINATION_BTNS_QUANITY ? ' disabled' : '';

    return `
    <div class="textbook-games">
      <a class="textbook-games-link" href="#/sprint">Спринт</a>
      <a class="textbook-games-link" href="#/audiocall">Аудиовызов</a>
    </div>
    <div class="pages-groups-container">
      ${this.getGroupButton()}
      
      <div id="pagination-buttons" class="pagination-buttons">
      ${this.createPagerButton(BTN_PREV_ROLE, previousPage, '&#9664', disabledIfZero, '', 'prev-button')}
      ${this.createPagerButton('', ZERO_PAGE, ZERO_PAGE, '', `num ${isZeroPageCurrent}`)}
      ${this.createPagerButton('', pageMinusSeven, '...', disableLowThan7, 'num', '', disableLowThanZero)}
      ${pager}
      ${this.createPagerButton('', pagePlusSeven, '...', disableMoreThan23, 'num', '', disableMoreThanMaxPage)}
      ${this.createPagerButton('', MAX_PAGE, MAX_PAGE, '', `num ${isLastPageCurrent}`)}
      ${this.createPagerButton(BTN_NEXT_ROLE, nextPage, '&#9654;', disabledIfMaxPage)}
    </div>
  </div>
  <div class="word-cards-container color${this.group}" id="words-container">
    ${words.map((wordObject: IWordObject) => this.wordComponent(wordObject)).join('')}
  </div>
  `;
  }

  async getWords() {
    const url = `${this.baseUrl}words?group=${this.group - 1}&page=${this.page - 1}`;
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

let textbook: TextBookClass | null;
let pager: HTMLDivElement | null;
let removeAudioListener: () => void;

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

const pagerClickHandler = async (e: MouseEvent): Promise<void> => {
  const target = e.target as HTMLElement;
  if (target.dataset.href) window.location.hash = target.dataset.href;
};

const mount = () => {
  pager = document.getElementById('pagination-buttons') as HTMLDivElement;
  pager.addEventListener('click', pagerClickHandler);
  removeAudioListener = createAudioHandler(document.getElementById('words-container') as HTMLDivElement);
};

const unmount = () => {
  if (pager) pager.removeEventListener('click', pagerClickHandler);
  removeAudioListener();
  pager = null;
};

export const TextBook: PageComponentThunk = async (params) => {
  textbook = new TextBookClass(BASE_URL, document.querySelector('#page_container') || document.body, createCard, 1, 1);
  const args = params as { group: string, page: string };
  const group = +args.group;
  const page = +args.page;

  if (Number.isNaN(group) || Number.isNaN(page)) {
    window.location.hash = textbook.formatHash();
    return { html: '' };
  }

  textbook.setGroup(group);
  textbook.setPage(page);

  return { html: await textbook.getWordsConainer(), mount, unmount };
};
