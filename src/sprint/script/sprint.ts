import '../style/sprint.scss';
import { getWord } from './services';
import { Timer } from './timer';
import { exitGame } from './sprintGameControl';
import { amountTrueAnswers, Score } from './score';
import {
  WordData, ISprint, sound, gameCallState,
} from './dataTypes';
import { wordsStatLongTerm } from '../../countNewAndLearnWords/wordsStat';

const AMOUNT_WORDS = 20;
const AMOUNT_PAGE = 30;
const HALF_SECOND = 500;
let amountWords = 0;
let currentPage = 0;
let currentWord = 0;
let trueAnswer = false;
let answers: (string | boolean)[][] = [];
const VOLUME = 0.4;
let words: [WordData] | [];
let wordId = '';
let currentSeriesLength = 0;

const htmlCodeSprint = `
  <div class="sprint">
    <div class="game-wrap">
      <div class="current-state">
        <div class="timer">60</div>
      </div>
      <div class="sprint-game">
          <div class="word"></div>
          <div class="translate"></div>
          <div class="response-type">
              <button class="answer-false button" id="false">Неверно</button>
              <button class="answer-true button" id="true">Верно</button>
          </div>
      </div>
    </div>
  </div>
`;

export class Sprint implements ISprint {
  private timer: Timer;

  private score: Score;

  private keyPressListener?: (e:KeyboardEvent) => void;

  constructor() {
    this.timer = new Timer(this);
    this.score = new Score();
  }

  async createPageGameSprint(group: number): Promise<void> {
    answers = []; wordId = '';

    exitGame.isExit = false;
    const gameSprint = document.querySelector('.game-sprint') as HTMLElement;
    const chooseLevels = document.querySelector('.choose-wrap') as HTMLElement;
    const sprintPage = document.createElement('div');
    sprintPage.innerHTML = htmlCodeSprint;
    sprintPage.classList.add('sprint-wrap');
    gameSprint.appendChild(sprintPage);
    chooseLevels?.remove();

    await this.generateWord(group);
    this.addUserAnswerListeners(group);
    this.timer.startTimer(answers);
    this.score.createScoreWrap();
  }

  randomGeneratePage = (): void => {
    currentPage = Math.floor(Math.random() * AMOUNT_PAGE);
  };

  async generateWord(group: number): Promise<void> {
    words = [];
    this.randomGeneratePage();
    const word = document.querySelector('.word');
    words = await getWord(group, currentPage);
    wordId = words[currentWord].id;

    await this.generateWordTranslate(group, words[currentWord].wordTranslate)
      .then(() => {
        if (!words[currentWord].word) return;
        if (word) word.innerHTML = words[currentWord]?.word;
      });
  }

  generateWordTranslate = async (group: number, trueTranslate: string): Promise<void> => {
    const wordTranslate = document.querySelector('.translate');
    const numberTranslateWord = Math.floor(Math.random() * AMOUNT_WORDS);
    if (!words) return;
    const translateWord = [words[numberTranslateWord].wordTranslate, trueTranslate];
    const word = translateWord[Math.floor(Math.random() * translateWord.length)];

    if (wordTranslate) wordTranslate.innerHTML = word;
    trueAnswer = trueTranslate === word;
  };

  addUserAnswerListeners(group: number): void {
    const answerIncorrectButton = document.querySelector('.answer-false') as HTMLElement;
    const answerCorrectButton = document.querySelector('.answer-true') as HTMLElement;

    const addAnswerButtonClickListener = (button: HTMLElement) => {
      button.addEventListener('click', async () => {
        await this.switchWord(button, group);
      });
    };

    this.addKeyPressListener(group);
    addAnswerButtonClickListener(answerCorrectButton);
    addAnswerButtonClickListener(answerIncorrectButton);
  }

  addKeyPressListener(group: number) {
    const answerFalse = document.querySelector('.answer-false') as HTMLElement;
    const answerTrue = document.querySelector('.answer-true') as HTMLElement;
    this.keyPressListener = (e) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') this.switchWord(answerFalse, group);
      if (e.code === 'ArrowRight' || e.code === 'KeyD') this.switchWord(answerTrue, group);
    };
    this.keyPressListener = this.keyPressListener.bind(this);
    document.addEventListener('keydown', this.keyPressListener);
  }

  removeKeyPressListeners() {
    if (this.keyPressListener) {
      document.removeEventListener('keydown', this.keyPressListener);
    }
  }

  makeButtonActiveOrInactive = (type: string): void => {
    const answerFalse = document.querySelector('.answer-false');
    const answerTrue = document.querySelector('.answer-true');

    const makeButtonActive = () => {
      answerFalse?.setAttribute('disabled', 'disabled');
      answerTrue?.setAttribute('disabled', 'disabled');
    };

    const makeButtonInactive = () => {
      answerFalse?.removeAttribute('disabled');
      answerTrue?.removeAttribute('disabled');
    };

    return type === 'active' ? makeButtonActive() : makeButtonInactive();
  };

  switchWord = async (button: HTMLElement, group: number) => {
    this.makeButtonActiveOrInactive('active');
    await this.checkAnswer(button.getAttribute('id'));
    currentWord++;
    amountWords++;
    if (amountWords % AMOUNT_WORDS === 0) {
      currentPage++;
      currentWord = 0;
    }
    await this.generateWord(group);
    this.makeButtonActiveOrInactive('inactive');
  };

  async checkAnswer(typeAnswer: string | null): Promise<void> {
    const sprintGame = document.querySelector('.sprint-game') as HTMLElement;
    sound.src = String(trueAnswer) === typeAnswer ? '/call_correct.mp3' : '/call_wrong.wav';
    sound.volume = VOLUME;
    sound.play();

    sprintGame.classList.add(String(trueAnswer) === typeAnswer ? 'true' : 'false');
    answers[amountWords] = [words[currentWord]?.word, words[currentWord]?.wordTranslate, words[currentWord]?.audio];
    answers[amountWords]?.push(String(trueAnswer) === typeAnswer);

    if (String(trueAnswer) === typeAnswer) {
      amountTrueAnswers.count++;
      if (amountTrueAnswers.count > amountTrueAnswers.maxCount) amountTrueAnswers.maxCount = amountTrueAnswers.count;
      amountTrueAnswers.numberBulb = amountTrueAnswers.numberBulb === 2 ? 0 : amountTrueAnswers.numberBulb + 1;
      gameCallState.trueAnswers++;
      gameCallState.newWordsPromises.push(await wordsStatLongTerm.wordAnsweredCorrectlyInGame(wordId));
      currentSeriesLength++;
      if (currentSeriesLength > gameCallState.maxSeries) {
        gameCallState.maxSeries = currentSeriesLength;
      }
    } else {
      amountTrueAnswers.count = 0;
      amountTrueAnswers.numberBulb = -1;
      gameCallState.falseAnswers++;
      gameCallState.newWordsPromises.push(await wordsStatLongTerm.wordAnsweredIncorrectlyInGame(wordId));
      currentSeriesLength = 0;
    }

    this.score.countAnswers();

    setTimeout(() => {
      sprintGame.classList.remove('true', 'false');
    }, HALF_SECOND);
  }
}
