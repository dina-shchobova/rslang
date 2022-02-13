import axios from 'axios';
import { BASE_URL } from '../../services/constants';
import { IWordObject, PageComponentThunk } from '../../services/types';
import { createOneWordDiv, createHandler as createAudioHandler } from '../components/play-word';

const MAX_PAGE = 30;
const MAX_GROUP = 7;
const ZERO_PAGE = 1;
const PAGINATION_BTNS_QUANITY = 7;

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

  formatHash(group?: number, page?: number) {
    return `/text-book?group=${group || this.group}&page=${page || this.page}`;
  }

  private getButton(page: number) {
    let current = '';
    if (page === this.page) {
      current = 'current-page';
    }
    return `
      <button class="btn ${current}" data-href="${this.formatHash(this.group, page)}">
        ${page}
      </button>
    `;
  }

  private createPagerButton(
    btnRole: string,
    btnHrefNum: number,
    btnContent: string,
    btnClass = '',
    btnID = '',
    btnAble = '',
  ) {
    return `
      <button
        id="${btnID}"
        class="btn ${btnClass}"
        data-role="${btnRole}"
        data-href="${this.formatHash(this.group, btnHrefNum)}"
        ${btnAble}
      >
        ${btnContent}
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

  getView(words: IWordObject[]) {
    let pager;
    let isZeroPageCurrent = '';
    let isLastPageCurrent = '';
    const pageOffSet = 2;

    const arrayStartsFromTwo = [...Array(PAGINATION_BTNS_QUANITY).keys()]
      .map((x) => x + pageOffSet);
    const arrayStartsFromTwentyThree = [...Array(PAGINATION_BTNS_QUANITY).keys()]
      .map((x) => x + MAX_PAGE - PAGINATION_BTNS_QUANITY);
    const arrayFromSeven = [...Array(PAGINATION_BTNS_QUANITY).keys()];

    const middleWhenLeftElementIsTwo = PAGINATION_BTNS_QUANITY - pageOffSet;
    const middleWhenMaxElementisTwentyNine = MAX_PAGE - (PAGINATION_BTNS_QUANITY - pageOffSet);
    const previousPage = this.page - 1;
    const nextPage = this.page + 1;

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

    return `
    <div id="pagination-buttons" class="pagination-buttons">
    ${this.createPagerButton(
    BUTTON_PREV_ROLE, previousPage, '&#9664', '', 'prev-button', this.page === ZERO_PAGE ? ' disabled' : '',
  )}
    ${this.createPagerButton(
    '', ZERO_PAGE, ZERO_PAGE.toString(), isZeroPageCurrent,
  )}
    ${this.createPagerButton(
    '', this.page - PAGINATION_BTNS_QUANITY, '...', '',
    this.page <= PAGINATION_BTNS_QUANITY ? ' disabled' : '',
    // title=`${this.page > PAGINATION_BTNS_QUANITY ? this.page - PAGINATION_BTNS_QUANITY : ''}`

  )}

    ${pager}
    <button
      class="btn"
      data-href="${this.formatHash(this.group, this.page + PAGINATION_BTNS_QUANITY)}"
      title="${this.page <= MAX_PAGE - PAGINATION_BTNS_QUANITY ? `to page ${this.page + PAGINATION_BTNS_QUANITY}` : ''}"
      ${this.page > MAX_PAGE - PAGINATION_BTNS_QUANITY ? ' disabled' : ''}
    >
      ...
    </button>
    <button
      class="btn ${isLastPageCurrent}"
      data-href="${this.formatHash(this.group, MAX_PAGE)}"
    >
      ${MAX_PAGE}
    </button>
    <button
      class="btn"
      id="next-button"
      data-role="${BUTTON_NEXT_ROLE}"
      data-href="${this.formatHash(this.group, nextPage)}"
      ${this.page === MAX_PAGE ? ' disabled' : ''}
    >
      &#9654;
    </button>
  </div>
  <div class="word-cards-container" id="words-container">
    ${words.map((wordObject: IWordObject) => this.wordComponent(wordObject)).join('')}
  </div>`;
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
