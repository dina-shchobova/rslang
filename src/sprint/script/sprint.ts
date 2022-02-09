import '../style/sprint.scss';
import { getWord } from './services';
import { Timer } from './timer';
import { SprintGameControl, exitGame } from './sprintGameControl';
import { Score, amountTrueAnswers } from './score';
import { sound } from './dataTypes';

const AMOUNT_WORDS = 20;
let amountWords = 0;
let currentPage = 0;
let currentWord = 0;
let trueAnswer = false;
const answers: (string | boolean)[][] = [];
const HALF_SECOND = 500;
const VOLUME = 0.4;

const htmlCodeSprint = `
    <div class="sprint">
      <div class="sprint-header">
          <div class="sound button"></div>
          <div class="zoom button"></div>
          <a href="#/"><div class="close button"></div></a>
      </div>
      <div class="game-wrap">
        <div class="current-state">
          <div class="timer">60</div>
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
    exitGame.isExit = false;
    const main = document.querySelector('main') as HTMLElement;
    const chooseLevels = document.querySelector('.choose-levels') as HTMLElement;
    const sprintPage = document.createElement('div');

    sprintPage.innerHTML = htmlCodeSprint;
    sprintPage.classList.add('sprint-wrap');
    main.appendChild(sprintPage);
    chooseLevels.remove();

    await this.generateWord(group);
    this.showNextWord(group);
    this.timer.startTimer(answers);
    this.controlGame.controlGame();
    this.score.createScoreWrap();
  }

  randomGeneratePage = (): void => {
    currentPage = Math.floor(Math.random() * AMOUNT_WORDS);
  };

  async generateWord(group: number): Promise<void> {
    this.randomGeneratePage();
    const word = document.querySelector('.word') as HTMLElement;
    const words = await getWord(group, currentPage);

    answers[amountWords] = [words[currentWord].word, words[currentWord].wordTranslate, words[currentWord].audio];
    await this.generateWordTranslate(group, words[currentWord].wordTranslate)
      .then(() => {
        word.innerHTML = words[currentWord].word;
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
      amountTrueAnswers.numberBulb = amountTrueAnswers.numberBulb === 2 ? 0 : amountTrueAnswers.numberBulb + 1;
    } else {
      amountTrueAnswers.count = 0;
      amountTrueAnswers.numberBulb = -1;
    }
    this.score.countAnswers();

    setTimeout(() => {
      sprintGame.classList.remove('true', 'false');
    }, HALF_SECOND);
  }
}
