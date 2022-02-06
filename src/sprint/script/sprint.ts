import '../style/sprint.scss';
import { getWord } from './services';
import { Timer } from './timer';

let amountWords = 0;
let currentPage = 0;
let currentWord = 0;
let trueAnswer = false;
const answers: (string | boolean)[][] = [];

const htmlCodeSprint = `
    <div class="sprint">
      <div class="sprint-header">
          <div class="sound button"></div>
          <div class="zoom button"></div>
          <div class="close button"></div>
      </div>
      <div class="timer">60</div>
      <div class="sprint-game">
          <div class="word"></div>
          <div class="translate"></div>
          <div class="response-type">
              <div class="answer-false button" id="false">Неверно</div>
              <div class="answer-true button" id="true">Верно</div>
          </div>
      </div>
    </div>
`;

export class Sprint {
  private timer: Timer;

  constructor() {
    this.timer = new Timer();
  }

  async createPageGameSprint(group: number): Promise<void> {
    const body = document.querySelector('body') as HTMLElement;
    const sprintPage = document.createElement('div');
    sprintPage.innerHTML = htmlCodeSprint;
    sprintPage.classList.add('sprint-wrap');
    body.appendChild(sprintPage);

    await this.generateWord(group, currentPage);
    this.showNextWord(group);
    this.timer.startTimer(answers);
  }

  async generateWord(group: number, page = 0): Promise<void> {
    const word = document.querySelector('.word') as HTMLElement;
    const words = await getWord(group, page);

    answers[currentWord] = [words[currentWord].word, words[currentWord].wordTranslate, words[currentWord].audio];
    await this.generateWordTranslate(group, words[currentWord].wordTranslate)
      .then(() => {
        word.innerHTML = words[currentWord].word;
      });
  }

  generateWordTranslate = async (group: number, trueTranslate: string): Promise<void> => {
    const wordTranslate = document.querySelector('.translate') as HTMLElement;
    const numberTranslateWord = Math.floor(Math.random() * 20);
    const translate = await getWord(group, currentPage);

    wordTranslate.innerHTML = translate[numberTranslateWord].wordTranslate;
    trueAnswer = trueTranslate === translate[numberTranslateWord].wordTranslate;
  };

  showNextWord(group: number): void {
    const answerFalse = document.querySelector('.answer-false') as HTMLElement;
    const answerTrue = document.querySelector('.answer-true') as HTMLElement;

    const switchWord = async (button: HTMLElement) => {
      this.checkAnswer(button.getAttribute('id'));
      currentWord++;
      amountWords++;
      if (amountWords % 19 === 0) {
        currentPage++;
        currentWord = 0;
      }
      await this.generateWord(group, currentPage);
    };

    const clickAnswer = (button: HTMLElement) => {
      button.addEventListener('click', async () => {
        await switchWord(button);
      });
    };

    document.addEventListener('keydown', async (e) => {
      if (e.code === 'ArrowLeft') await switchWord(answerFalse);
      if (e.code === 'ArrowRight') await switchWord(answerTrue);
    });

    clickAnswer(answerTrue);
    clickAnswer(answerFalse);
  }

  checkAnswer = (typeAnswer: string | null): void => {
    const sprintGame = document.querySelector('.sprint-game') as HTMLElement;
    // new Audio(String(trueAnswer) === typeAnswer ? './assets/true.mp3' : './assets/false.mp3').play();
    sprintGame.classList.add(String(trueAnswer) === typeAnswer ? 'true' : 'false');
    answers[currentWord].push(String(trueAnswer) === typeAnswer);
    setTimeout(() => {
      sprintGame.classList.remove('true', 'false');
    }, 1000);
  };
}
