import '../style/sprint.scss';
import { getWord } from './services';
import { Timer } from './timer';
import { SprintGameControl, exitGame } from './sprintGameControl';
import { Score, amountTrueAnswers } from './score';

const AMOUNT_WORDS = 20;
let amountWords = 0;
let currentPage = 0;
let currentWord = 0;
let trueAnswer = false;
const answers: (string | boolean)[][] = [];
const HALF_SECOND = 500;

const htmlCodeSprint = `
    <div class="sprint">
      <div class="sprint-header">
          <div class="sound button"></div>
          <div class="zoom button"></div>
          <div class="close button"></div>
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
    exitGame.isExit = false;
    const body = document.querySelector('body') as HTMLElement;
    const chooseLevels = document.querySelector('.choose-levels') as HTMLElement;
    const sprintPage = document.createElement('div');

    sprintPage.innerHTML = htmlCodeSprint;
    sprintPage.classList.add('sprint-wrap');
    body.appendChild(sprintPage);
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

    const switchWord = async (button: HTMLElement) => {
      this.checkAnswer(button.getAttribute('id'));
      currentWord++;
      amountWords++;
      if (amountWords % (AMOUNT_WORDS - 1) === 0) {
        currentPage++;
        currentWord = 0;
      }
      await this.generateWord(group);
    };

    const clickAnswer = (button: HTMLElement) => {
      button.addEventListener('click', async () => {
        await switchWord(button);
      });
    };

    document.addEventListener('keydown', async (e) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') await switchWord(answerFalse);
      if (e.code === 'ArrowRight' || e.code === 'KeyD') await switchWord(answerTrue);
    });

    clickAnswer(answerTrue);
    clickAnswer(answerFalse);
  }

  checkAnswer(typeAnswer: string | null): void {
    const sprintGame = document.querySelector('.sprint-game') as HTMLElement;
    // new Audio(String(trueAnswer) === typeAnswer ? '/public/assets/true.mp3' : '/public/assets/false.mp3').play();

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
