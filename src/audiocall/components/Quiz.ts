import { IGameCallComponent } from '../scripts/audiocallTypes';
import { gameCallState } from '../scripts/audiocallState';

function shuffleAnswers(array: IAnswerOnPage[]): IAnswerOnPage[] {
  let currentIndex = array.length;
  let randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

const htmlCodeQuiz = `
      <div class="question-answer-container">
        <div class="game-call__quiz-answer">
          <div class="quiz-answer__img"></div>
          <div class="quiz-answer__description">
            <div class="quiz-answer__word">
            <div class="volume-container">
              <div class="volume-icon"></div>
            </div>
            <div class="quiz-answer__word-spelling"></div>
          </div>
            <div class="quiz-answer__word-translate"></div>
            <div class="quiz-answer__example-spelling"></div>
            <div class="quiz-answer__example-translate"></div>
          </div>
        </div>
        <div class="game-call__question">
          <div class="volume-icon"></div>
        </div>
      </div>
      <div class="game-call__answer-buttons">
        <div class="game-call__answer-button" data-number="0">...</div>
        <div class="game-call__answer-button" data-number="1">...</div>
        <div class="game-call__answer-button" data-number="2">...</div>
        <div class="game-call__answer-button" data-number="3">...</div>
        <div class="game-call__answer-button" data-number="4">...</div>
      </div>
      <div class="game-call__quiz-control">Дальше</div>
`;

interface IWordData{
  id: string,
  group: 0,
  page: 0,
  word: string,
  image: string,
  audio: string,
  audioMeaning: string,
  audioExample: string,
  textMeaning: string,
  textExample: string,
  transcription: string,
  wordTranslate: string,
  textMeaningTranslate: string,
  textExampleTranslate: string
}

interface IAnswerOnPage {
  answerData: IWordData;
  correct: undefined | boolean;
  inactive: boolean
}

const BACKEND_URL = 'https://rs-learnwords.herokuapp.com/';

class Quiz {
  game: IGameCallComponent;

  rootElement?: HTMLElement;

  answerButtons?: NodeList;

  controlButton?: HTMLElement;

  answerImgContainer?: HTMLElement;

  wordsForTour: IWordData[];

  answersOnPage: IAnswerOnPage[];

  correctAnswerOnPage: IAnswerOnPage | undefined;

  currentWordNumber: number;

  error: string | undefined;

  constructor(game: IGameCallComponent) {
    this.game = game;
    this.rootElement = undefined;
    this.answerButtons = undefined;
    this.controlButton = undefined;
    this.answerImgContainer = undefined;
    this.answersOnPage = [];
    this.wordsForTour = [];
    this.correctAnswerOnPage = undefined;
    this.currentWordNumber = 0;
    this.error = undefined;
  }

  createRootElement(): HTMLElement {
    const rootElement = document.createElement('div');
    rootElement.id = 'game-call__quiz';
    rootElement.innerHTML = htmlCodeQuiz;
    this.rootElement = rootElement;
    return rootElement;
  }

  mount(elem: HTMLElement): void {
    elem.appendChild(this.createRootElement());
    this.mounted();
  }

  async mounted(): Promise<void> {
    this.addAnswerButtonsListeners();
    this.addControlButtonListeners();
    await this.loadWordsForTour();
    this.updateAnswersOnPage();
    this.updateAnswerView();
  }

  // load words

  async loadWordsForTour(): Promise<void> {
    const amountPage = 29;
    this.wordsForTour = [];
    const page = Math.floor(Math.random() * amountPage);
    const rawResponse = await fetch(`${BACKEND_URL}words?page=${page}&group=${gameCallState.level}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (rawResponse.ok) {
      this.wordsForTour = await rawResponse.json();
      return undefined;
    }
    this.error = (`Ошибка HTTP: ${rawResponse.status}`);
    return undefined;
  }

  static wrapAnswer(answerData: IWordData):IAnswerOnPage {
    return {
      answerData,
      correct: undefined,
      inactive: false,
    };
  }

  setCorrectAnswerOnPage(): void {
    this.correctAnswerOnPage = Quiz.wrapAnswer(this.wordsForTour[this.currentWordNumber]);
  }

  getAnswerImgContainer(): HTMLElement {
    if (!this.answerImgContainer) {
      this.answerImgContainer = (this.rootElement as HTMLElement).querySelector('.quiz-answer__img') as HTMLElement;
    }
    return this.answerImgContainer;
  }

  preloadImgAnswer(): void {
    const imgContainer = this.getAnswerImgContainer();
    const { image } = (this.correctAnswerOnPage as IAnswerOnPage).answerData;
    const img = new Image();
    img.src = `${BACKEND_URL}${image}`;
    img.onload = () => {
      imgContainer.style.backgroundImage = `url(${img.src})`;
    };
  }

  getRandomWordNumber(): number {
    const amountWordsOnPage = 20;
    const number = Math.floor(Math.random() * amountWordsOnPage);
    if (number !== this.currentWordNumber) {
      return number;
    }
    return this.getRandomWordNumber();
  }

  updateAnswersOnPage(): void {
    this.answersOnPage = [];
    this.setCorrectAnswerOnPage();
    this.preloadImgAnswer();
    const amountIncorrectAnswersOnPage = 4;
    this.answersOnPage.push(this.correctAnswerOnPage as IAnswerOnPage);
    for (let i = 0; i < amountIncorrectAnswersOnPage; i++) {
      const wordForAnswer = this.wordsForTour[this.getRandomWordNumber()];
      const wrappedAnswer = Quiz.wrapAnswer(wordForAnswer);
      this.answersOnPage.push(wrappedAnswer);
      this.answersOnPage = shuffleAnswers(this.answersOnPage);
    }
    this.updateAnswerButtonsView();
  }

  // answer button

  getAnswersButtonsElements(): NodeList {
    if (!this.answerButtons) {
      this.answerButtons = (this.rootElement as HTMLElement).querySelectorAll('.game-call__answer-button');
    }
    return this.answerButtons;
  }

  static updateAnswerButton(buttonElement: HTMLElement, answer: IAnswerOnPage): void {
    const inactiveModifierClass = 'game-call__answer-button_inactive';
    const correctModifierClass = 'game-call__answer-button_correct';
    const incorrectModifierClass = 'game-call__answer-button_incorrect';
    const allModifiers = [inactiveModifierClass, correctModifierClass, incorrectModifierClass];
    buttonElement.innerHTML = answer.answerData.word;
    buttonElement.classList.remove(...allModifiers);
    if (answer.correct === true) {
      buttonElement.classList.add(correctModifierClass);
    } else if (answer.correct === false) {
      buttonElement.classList.add(incorrectModifierClass);
    } else if (answer.inactive) {
      buttonElement.classList.add(inactiveModifierClass);
    }
  }

  updateAnswerButtonsView(): void {
    const answerButtonElements = this.getAnswersButtonsElements();
    for (let i = 0; (i < this.answersOnPage.length) && (i < answerButtonElements.length); i += 1) {
      Quiz.updateAnswerButton(answerButtonElements[i] as HTMLElement, this.answersOnPage[i]);
    }
  }

  addAnswerButtonsListeners(): void {
    this.answerButtons = (this.rootElement as HTMLElement).querySelectorAll('.game-call__answer-button');
    this.answerButtons
      .forEach((elem) => elem.addEventListener('click', (e) => this.onAnswerButtonClick(e.target as HTMLElement)));
  }

  onAnswerButtonClick(elem: HTMLElement): void {
    this.makeVisibleAnswer();
    const numOfClickedAnswer: number = parseInt(elem.dataset.number as string, 10);
    const selectedAnswer = this.answersOnPage[numOfClickedAnswer];
    if (selectedAnswer.inactive) {
      return;
    }
    let answeredCorrectly = false;
    if (this.answersOnPage[numOfClickedAnswer] === this.correctAnswerOnPage) {
      answeredCorrectly = true;
    }
    this.answersOnPage.forEach((answerOnPage) => {
      if (answerOnPage === this.correctAnswerOnPage) {
        answerOnPage.correct = true;
      } else if (!answeredCorrectly && (this.answersOnPage.indexOf(answerOnPage) === numOfClickedAnswer)) {
        answerOnPage.correct = false;
      }
      answerOnPage.inactive = true;
    });
    this.updateAnswerButtonsView();
  }

  // control button
  getControlButton(): HTMLElement {
    if (!this.controlButton) {
      this.controlButton = document.querySelector('.game-call__quiz-control') as HTMLElement;
    }
    return this.controlButton;
  }

  addControlButtonListeners(): void {
    this.getControlButton()
      .addEventListener('click', () => this.onControlButtonClick());
  }

  onControlButtonClick(): void {
    if (this.currentWordNumber === 19) {
      this.game.showResults();
    } else {
      this.currentWordNumber += 1;
      this.updateAnswersOnPage();
      this.updateAnswerView();
    }
  }

  // show answer

  updateAnswerView(): void {
    this.makeInvisibleAnswer();
    const spellingWordContainer = (this.rootElement as HTMLElement)
      .querySelector('.quiz-answer__word-spelling') as HTMLElement;
    const translateWordContainer = (this.rootElement as HTMLElement)
      .querySelector('.quiz-answer__word-translate') as HTMLElement;
    const exampleSpellingContainer = (this.rootElement as HTMLElement)
      .querySelector('.quiz-answer__example-spelling') as HTMLElement;
    const exampleTranslateContainer = (this.rootElement as HTMLElement)
      .querySelector('.quiz-answer__example-translate') as HTMLElement;
    const {
      word, transcription, wordTranslate, textExample, textExampleTranslate,
    } = (this.correctAnswerOnPage as IAnswerOnPage).answerData;
    spellingWordContainer.innerHTML = `${word} ${transcription}`;
    translateWordContainer.innerHTML = wordTranslate;
    exampleSpellingContainer.innerHTML = textExample;
    exampleTranslateContainer.innerHTML = textExampleTranslate;
  }

  makeVisibleAnswer(): void {
    const answerContainer = (this.rootElement as HTMLElement).querySelector('.game-call__quiz-answer') as HTMLElement;
    answerContainer.style.visibility = 'visible';
    const questionContainer = (this.rootElement as HTMLElement).querySelector('.game-call__question') as HTMLElement;
    questionContainer.style.visibility = 'hidden';
  }

  makeInvisibleAnswer(): void {
    const answerContainer = (this.rootElement as HTMLElement).querySelector('.game-call__quiz-answer') as HTMLElement;
    answerContainer.style.visibility = 'hidden';
    const questionContainer = (this.rootElement as HTMLElement).querySelector('.game-call__question') as HTMLElement;
    questionContainer.style.visibility = 'visible';
  }
}

export { Quiz };
