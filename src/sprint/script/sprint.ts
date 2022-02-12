import '../style/sprint.scss';
import { getWord, createUserWord } from './services';
import { Timer } from './timer';
import { SprintGameControl, exitGame } from './sprintGameControl';
import { Score, amountTrueAnswers } from './score';
import { sound } from './dataTypes';
import { statistics } from '../../statistic/saveStatistics';

const AMOUNT_WORDS = 20;
const AMOUNT_PAGE = 30;
const HALF_SECOND = 500;
let amountWords = 0;
let currentPage = 0;
let currentWord = 0;
let trueAnswer = false;
let answers: (string | boolean)[][] = [];
const VOLUME = 0.4;
let userId = '';
let trueAnswers = 0;
let falseAnswers = 0;
let currentStatistics = JSON.parse(<string>localStorage.getItem('statistics'));

const htmlCodeSprint = `
    <div class="sprint">
      <div class="game-header">
          <div class="sound button"></div>
          <div class="zoom button"></div>
          <a href="#/"><div class="close button"></div></a>
      </div>
      <div class="game-wrap">
        <div class="current-state">
          <div class="timer">10</div>
        </div>
        <div class="sprint-game">
            <div class="word"></div>
            <div class="translate"></div>
            <div class="response-type">
                <div class="answer-false button" id="false">Неверно</div>
                <div class="answer-true button" id="true">Верно</div>
            </div>
        </div>
      </div>
    </div>
`;

export class Sprint {
  private timer: Timer;

  private controlGame: SprintGameControl;

  private score: Score;

  constructor() {
    this.timer = new Timer();
    this.controlGame = new SprintGameControl();
    this.score = new Score();
  }

  async createPageGameSprint(group: number): Promise<void> {
    answers = [];
    userId = JSON.parse(<string>localStorage.getItem('user'))?.userId;
    exitGame.isExit = false;
    const main = document.querySelector('main') as HTMLElement;
    const chooseLevels = document.querySelector('.choose-levels') as HTMLElement;
    const sprintPage = document.createElement('div');
    currentStatistics = JSON.parse(<string>localStorage.getItem('statistics'));
    sprintPage.innerHTML = htmlCodeSprint;
    sprintPage.classList.add('sprint-wrap');
    main.appendChild(sprintPage);
    chooseLevels.remove();

    trueAnswers = currentStatistics.sprint[currentStatistics.sprint.length - 1].trueAnswers || 0;
    falseAnswers = currentStatistics.sprint[currentStatistics.sprint.length - 1].falseAnswers || 0;

    await this.generateWord(group);
    this.showNextWord(group);
    this.timer.startTimer(answers);
    this.controlGame.controlGame();
    this.score.createScoreWrap();
  }

  randomGeneratePage = (): void => {
    currentPage = Math.floor(Math.random() * AMOUNT_PAGE);
  };

  async generateWord(group: number): Promise<void> {
    this.randomGeneratePage();
    const word = document.querySelector('.word') as HTMLElement;
    const words = await getWord(group, currentPage);

    answers[amountWords] = [words[currentWord].word, words[currentWord].wordTranslate, words[currentWord].audio];
    await this.generateWordTranslate(group, words[currentWord].wordTranslate)
      .then(() => {
        word.innerHTML = words[currentWord].word;
        if (userId) {
          createUserWord(userId, words[currentWord].id, {
            difficulty: words[currentWord].word,
            optional: { testFieldString: 'test', testFieldBoolean: true },
          });
        }
      });
  }

  generateWordTranslate = async (group: number, trueTranslate: string): Promise<void> => {
    const wordTranslate = document.querySelector('.translate');
    const numberTranslateWord = Math.floor(Math.random() * AMOUNT_WORDS);
    const translate = await getWord(group, currentPage);
    if (!translate) return;
    const translateWord = [translate[numberTranslateWord].wordTranslate, trueTranslate];
    const word = translateWord[Math.floor(Math.random() * translateWord.length)];

    if (wordTranslate) wordTranslate.innerHTML = word;
    trueAnswer = trueTranslate === word;
  };

  showNextWord(group: number): void {
    const answerFalse = document.querySelector('.answer-false') as HTMLElement;
    const answerTrue = document.querySelector('.answer-true') as HTMLElement;

    const clickAnswer = (button: HTMLElement) => {
      button.addEventListener('click', async () => {
        await this.switchWord(button, group);
      });
    };

    this.keyPress(group);
    clickAnswer(answerTrue);
    clickAnswer(answerFalse);
  }

  keyPress(group: number) {
    const answerFalse = document.querySelector('.answer-false') as HTMLElement;
    const answerTrue = document.querySelector('.answer-true') as HTMLElement;
    document.addEventListener('keydown', async (e) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') await this.switchWord(answerFalse, group);
      if (e.code === 'ArrowRight' || e.code === 'KeyD') await this.switchWord(answerTrue, group);
    });
  }

  switchWord = async (button: HTMLElement, group: number) => {
    this.checkAnswer(button.getAttribute('id'));
    currentWord++;
    amountWords++;
    if (amountWords % AMOUNT_WORDS === 0) {
      currentPage++;
      currentWord = 0;
    }
    await this.generateWord(group);
  };

  checkAnswer(typeAnswer: string | null): void {
    const sprintGame = document.querySelector('.sprint-game') as HTMLElement;
    sound.src = String(trueAnswer) === typeAnswer ? '/assets/true.mp3' : '/assets/false.mp3';
    sound.volume = VOLUME;
    sound.play();

    sprintGame.classList.add(String(trueAnswer) === typeAnswer ? 'true' : 'false');
    answers[amountWords]?.push(String(trueAnswer) === typeAnswer);

    if (String(trueAnswer) === typeAnswer) {
      amountTrueAnswers.count++;
      if (amountTrueAnswers.count > amountTrueAnswers.maxCount) amountTrueAnswers.maxCount = amountTrueAnswers.count;
      amountTrueAnswers.numberBulb = amountTrueAnswers.numberBulb === 2 ? 0 : amountTrueAnswers.numberBulb + 1;
      trueAnswers++;
    } else {
      amountTrueAnswers.count = 0;
      amountTrueAnswers.numberBulb = -1;
      falseAnswers++;
    }

    if (userId) {
      Object(statistics.sprint[0]).trueAnswers = trueAnswers;
      Object(statistics.sprint[0]).falseAnswers = falseAnswers;
    }
    this.score.countAnswers();

    setTimeout(() => {
      sprintGame.classList.remove('true', 'false');
    }, HALF_SECOND);
  }
}
