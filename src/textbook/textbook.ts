import { BASE_URL } from '../services/constants';
import { IWordObject } from '../services/types';
import { AggregatedWordsResponsePaginatedResults, WordData } from '../sprint/script/dataTypes';
import { createOneWordDiv } from '../views/components/play-word';
import { LearnedWords } from './learnedWords';
import { backendRequest } from '../services/requests';
import { getUsersWordsOnPage } from './requests';

const ZERO_PAGE = 1;
const MAX_PAGE = 30;
const MAX_GROUP = 7;
const PAGINATION_BTNS_QUANITY = 7;

const BTN_PREV_ROLE = 'text-book-prev-page';
const BTN_NEXT_ROLE = 'text-book-next-button';

export class TextBookClass {
  private group: number;

  private page: number;

  private baseUrl: string;

  private container: HTMLElement;

  private wordsOnPage: WordData[];

  private usersWordsOnPage: AggregatedWordsResponsePaginatedResults[];

  constructor(baseUrl: string, container: HTMLElement,
    initGroup = 1, initPage = ZERO_PAGE) {
    this.group = initGroup;
    this.page = initPage;
    this.baseUrl = baseUrl;
    this.container = container;
    this.wordsOnPage = [];
    this.usersWordsOnPage = [];
  }

  isUserLoggedIn = false;

  userWords: Set<string> = new Set();

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
      <a class="group-link color7" href="/#">Сложные слова</a>
      ${[...Array(6).keys()].map((n: number) => `
      <a
        class="group-link color${n + 1} ${this.group === n + 1 ? 'hide-link' : ''}"
        href="#/text-book?group=${n + 1}&page=1"
      >
        Раздел ${n + 1}
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
    <div class="textbook-container">
      <button id="scroll-up" class="scroll-up">&#187;</button>
      <div class="textbook-games">
        <a class="textbook-games-link" href="#/sprint?level=${this.group}&page=${this.page}">
            <button class="book-game">Спринт</button>
        </a>
        <a class="textbook-games-link" href="#/audiocall?level=${this.group}&page=${this.page}">
            <button class="book-game">Аудиовызов</button>
        </a>
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
      ${words.map((wordObject: IWordObject) => this.createCard(wordObject)).join('')}
    </div>
  </div>
  `;
  }

  async getWords() {
    return backendRequest(`words?group=${this.group - 1}&page=${this.page - 1}`);
  }

  async getRenderedPage() {
    this.wordsOnPage = await this.getWords();
    this.usersWordsOnPage = await getUsersWordsOnPage(this.wordsOnPage.map((w) => w.word));
    setTimeout(() => {
      new LearnedWords().makePageInactive();
    }, 10);
    return this.getView(this.wordsOnPage);
  }

  setPage(page: number) {
    if (page < 0 || page > MAX_PAGE) return;
    this.page = page;
  }

  setGroup(group: number) {
    if (group < 0 || group > MAX_GROUP) return;
    this.group = group;
  }

  private cardDescription(wordObject: IWordObject) {
    const isAuthorized = localStorage.getItem('userAuthorized');
    let wrongCount = 0;
    let rightCount = 0;
    let wordIsLearned = false;
    let wordIsHard = false;
    this.usersWordsOnPage.forEach((userWord) => {
      if (wordObject.word === userWord.word) {
        if (userWord.userWord?.optional?.progress?.right) {
          rightCount = userWord.userWord.optional.progress.right;
        }
        if (userWord.userWord?.optional?.progress?.wrong) {
          wrongCount = userWord.userWord.optional.progress.wrong;
        }
        if (userWord.userWord?.optional?.dateLearned) {
          wordIsLearned = true;
        } else if (userWord.userWord?.difficulty === 'hard') {
          wordIsHard = true;
        }
      }
    });
    const userAuthorized = `
    <p class="word-translate">${wordObject.wordTranslate}</p>
    <p class="text-meaning">${wordObject.textMeaning}</p>
    <p class="text-meaning-translate">${wordObject.textMeaningTranslate}</p>
    <div class="line"></div>
    <p class="text-example">${wordObject.textExample}</p>
    <p class="text-example-translate">${wordObject.textExampleTranslate}</p>
    <div class="card-buttons-container">
      <button
        class="difficult-word button-word ${wordIsHard ? 'button-hard-word' : ''}"
        data-word-id="${wordObject.id}"
        data-is-hard="${wordIsHard}"
      >Сложное слово
      </button>
      <button
        class="learned-word button-word ${wordIsLearned ? 'button-learned-word' : ''}"
        data-word-id="${wordObject.id}"
        data-is-learned="${wordIsLearned}"
      >Изученное слово</button>
    </div>
    <div class="progress" data-progressId="${wordObject.id}">Ответы:
        <div class="right">правильные - <div class="amount-right">${rightCount}</div>,</div>
        <div class="wrong">ошибки - <div class="amount-wrong">${wrongCount}</div></div>
    </div>
  `;

    const userNotAuthorized = `
     <p class="word-translate">${wordObject.wordTranslate}</p>
     <p class="text-meaning">${wordObject.textMeaning}</p>
     <p class="text-meaning-translate">${wordObject.textMeaningTranslate}</p>
     <div class="line"></div>
     <p class="text-example">${wordObject.textExample}</p>
     <p class="text-example-translate">${wordObject.textExampleTranslate}</p>
  `;

    return isAuthorized ? userAuthorized : userNotAuthorized;
  }

  private createCard = (wordObject: IWordObject) => {
    let wordIsLearned = false;
    let wordIsHard = false;
    this.usersWordsOnPage.forEach((userWord) => {
      if (wordObject.word === userWord.word) {
        if (userWord.userWord?.optional?.dateLearned) {
          wordIsLearned = true;
        } else if (userWord.userWord?.difficulty === 'hard') {
          wordIsHard = true;
        }
      }
    });
    let cardAdditionalClass = '';
    if (wordIsLearned) {
      cardAdditionalClass = 'learned';
    } else if (wordIsHard) {
      cardAdditionalClass = 'hard';
    }
    return `
  <div class="word-card ${cardAdditionalClass}" data-cardId="${wordObject.id}">
    <img class="word-image" src="${BASE_URL + wordObject.image} " alt="${wordObject.word}"/>
    <div class="word-description">
      ${createOneWordDiv(wordObject)}${this.cardDescription(wordObject)}
    </div>
  </div>
  `;
  };
}
