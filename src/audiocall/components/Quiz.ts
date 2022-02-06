import { IAnswerOnPage, IGameCallComponent, IWordData } from '../scripts/audiocallTypes';
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
        <div class="game-call__quiz-answer field field_white">
          <div class="quiz-answer__img"></div>
          <div class="quiz-answer__description">
            <div class="quiz-answer__word">
              <div class="sound-container">
                <div class="sound-icon"></div>
              </div>
              <div class="quiz-answer__word-spelling"></div>
            </div>
            <div class="quiz-answer__word-translate"></div>
            <div class="quiz-answer__example-spelling"></div>
            <div class="quiz-answer__example-translate"></div>
          </div>
        </div>
        <div class="game-call__question">
          <div class="sound-icon"></div>
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
      <div class="counter-words"></div>
`;

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

  sound: HTMLAudioElement | undefined;

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
    this.sound = undefined;
  }

  createRootElement(): HTMLElement {
    const rootElement = document.createElement('div');
    rootElement.id = 'game-call__quiz';
    rootElement.classList.add('field');
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
    this.addSoundIconsListener();
  }

  getElementBySelector(selector: string): HTMLElement {
    return (this.rootElement as HTMLElement).querySelector(selector) as HTMLElement;
  }

  // load words

  async loadWordsForTour(): Promise<void> {
    const amountPage = 29;
    this.wordsForTour = [];
    const page = Math.floor(Math.random() * amountPage);
    const rawResponse = await fetch(`${BACKEND_URL}words?page=${page}&group=${gameCallState.level}`, {
      // FIXME: Move To resource
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
      this.answerImgContainer = this.getElementBySelector('.quiz-answer__img');
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

  getRandomIncorrectWord(): IWordData {
    const allWordsAmount = this.wordsForTour.length;
    const randomNumber = Math.floor(Math.random() * allWordsAmount);
    const potentialWord = this.wordsForTour[randomNumber];
    if (this.answersOnPage.findIndex((answerOnPage) => answerOnPage.answerData.id === potentialWord.id) !== -1) {
      return this.getRandomIncorrectWord();
    }
    return potentialWord;
  }

  updateAnswersOnPage(): void {
    this.answersOnPage = [];
    this.setCorrectAnswerOnPage();
    this.preloadImgAnswer();
    this.playSoundAnswer();
    const amountIncorrectAnswersOnPage = 4;
    this.answersOnPage.push(this.correctAnswerOnPage as IAnswerOnPage);
    for (let i = 0; i < amountIncorrectAnswersOnPage; i++) {
      const wordForAnswer = this.getRandomIncorrectWord();
      const wrappedAnswer = Quiz.wrapAnswer(wordForAnswer);
      this.answersOnPage.push(wrappedAnswer);
      this.answersOnPage = shuffleAnswers(this.answersOnPage);
    }
    this.updateAnswerButtonsView();
  }

  // play sound

  getPlayer(): HTMLAudioElement {
    if (!this.sound) {
      this.sound = new Audio();
    }
    return this.sound;
  }

  playSoundAnswer(): void {
    const sound = this.getPlayer();
    const { audio } = (this.correctAnswerOnPage as IAnswerOnPage).answerData;
    sound.src = `${BACKEND_URL}${audio}`;
    sound.play();
  }

  addSoundIconsListener(): void {
    const soundIcons = (this.rootElement as HTMLElement).querySelectorAll('.sound-icon');
    soundIcons.forEach((elem) => elem.addEventListener('click', () => this.playSoundAnswer()));
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
    buttonElement.innerHTML = answer.answerData.wordTranslate;
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
    this.makeAnswerVisible();
    const numOfClickedAnswer: number = parseInt(elem.dataset.number as string, 10);
    const selectedAnswer = this.answersOnPage[numOfClickedAnswer];
    if (selectedAnswer.inactive) {
      return;
    }
    let answeredCorrectly = false;
    if (this.answersOnPage[numOfClickedAnswer] === this.correctAnswerOnPage) {
      answeredCorrectly = true;
    }
    this.saveToResults(answeredCorrectly);
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

  saveToResults(isCorrect: boolean): void {
    if (isCorrect) {
      gameCallState.correctAnswers.push((this.correctAnswerOnPage as IAnswerOnPage).answerData);
    } else {
      gameCallState.wrongAnswers.push((this.correctAnswerOnPage as IAnswerOnPage).answerData);
    }
  }

  // control button
  getControlButton(): HTMLElement {
    if (!this.controlButton) {
      this.controlButton = this.getElementBySelector('.game-call__quiz-control') as HTMLElement;
    }
    return this.controlButton;
  }

  addControlButtonListeners(): void {
    this.getControlButton()
      .addEventListener('click', () => this.onControlButtonClick());
  }

  onControlButtonClick(): void {
    this.currentWordNumber += 1;
    if (this.currentWordNumber === this.wordsForTour.length) {
      this.game.showResults();
    } else {
      const counterBox = this.getElementBySelector('.counter-words');
      counterBox.innerHTML = (this.currentWordNumber).toString();
      this.updateAnswersOnPage();
      this.updateAnswerView();
    }
  }

  // show answer

  updateAnswerView(): void {
    this.makeInvisibleAnswer();
    const spellingWordContainer = this.getElementBySelector('.quiz-answer__word-spelling');
    const translateWordContainer = this.getElementBySelector('.quiz-answer__word-translate');
    const exampleSpellingContainer = this.getElementBySelector('.quiz-answer__example-spelling');
    const exampleTranslateContainer = this.getElementBySelector('.quiz-answer__example-translate');
    const {
      word, transcription, wordTranslate, textExample, textExampleTranslate,
    } = (this.correctAnswerOnPage as IAnswerOnPage).answerData;
    spellingWordContainer.innerHTML = `${word} ${transcription}`;
    translateWordContainer.innerHTML = wordTranslate;
    exampleSpellingContainer.innerHTML = textExample;
    exampleTranslateContainer.innerHTML = textExampleTranslate;
  }

  makeAnswerVisible(): void {
    const answerContainer = this.getElementBySelector('.game-call__quiz-answer');
    answerContainer.style.visibility = 'visible';
    const questionContainer = this.getElementBySelector('.game-call__question');
    questionContainer.style.visibility = 'hidden';
  }

  makeInvisibleAnswer(): void {
    const answerContainer = this.getElementBySelector('.game-call__quiz-answer');
    answerContainer.style.visibility = 'hidden';
    const questionContainer = this.getElementBySelector('.game-call__question');
    questionContainer.style.visibility = 'visible';
  }
}

export { Quiz, BACKEND_URL };
