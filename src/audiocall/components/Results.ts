import { gameCallState } from '../scripts/audiocallState';
import {
  IGameCallComponent, ICallLevelsComponent,
} from '../scripts/audiocallTypes';
import { wordStatToday } from '../../countNewAndLearnWords/wordsStat';
import { BASE_URL } from '../../services/constants';
import { WordData } from '../../sprint/script/dataTypes';

const htmlCodeResult = `
      <h2 class="title">Результаты</h2>
      <div class="field_white field_scroll field_words">
        <div class="results-subtitle">
          <span class="text-advantages">Вы знаете</span>
          <span class="count-answer count-correct-answer"></span>
        </div>
        <div class="game-call__right-answers">

        </div>
        <hr>
        <div class="results-subtitle">
          <span class="text-advantages">Вы не знаете</span>
          <span class="count-answer count-wrong-answer"></span>
        </div>

        <div class="game-call__wrong-answers">

        </div>
      </div>

      <a class="close-link"><div class="game-call__close-result">Закрыть</div>
`;

class Results implements ICallLevelsComponent {
  rootElement?: HTMLElement;

  game: IGameCallComponent;

  sound?: HTMLAudioElement;

  currentWord?: WordData;

  constructor(game: IGameCallComponent) {
    this.game = game;
    this.rootElement = undefined;
    this.sound = undefined;
    this.currentWord = undefined;
  }

  createRootElement(): HTMLElement {
    const rootElement = document.createElement('div');
    rootElement.id = 'game-call__results';
    rootElement.classList.add('field');
    rootElement.innerHTML = htmlCodeResult;
    this.rootElement = rootElement;
    return rootElement;
  }

  mount(elem: HTMLElement): void {
    elem.appendChild(this.createRootElement());
    this.mounted();
  }

  mounted(): void {
    this.addCloseButtonListeners();
    this.insertAnswerGroups();
    this.insertNumberAnswer();
    this.addSoundIconsListener();
    Results.sendGameFinishedStats();
  }

  insertAnswerGroups(): void {
    this.insertAnswer('.game-call__right-answers', gameCallState.correctAnswers, 'correct-answer');
    this.insertAnswer('.game-call__wrong-answers', gameCallState.wrongAnswers, 'wrong-answer');
  }

  static async sendGameFinishedStats(): Promise<void> {
    Promise.all(gameCallState.newWordsPromises).then((newWordsMarks: boolean[]) => {
      const newWordsCount = newWordsMarks.filter((m) => m).length;
      wordStatToday.updateTodayGameStatOnGameFinish(
        'audiocall',
        gameCallState.maxSeries,
        gameCallState.correctAnswers.length,
        gameCallState.wrongAnswers.length,
        newWordsCount,
      );
    });
  }

  getElementBySelector(selector: string): HTMLElement {
    return (this.rootElement as HTMLElement).querySelector(selector) as HTMLElement;
  }

  insertAnswer(selector: string, arrayAnswers: WordData[], answerClass: 'correct-answer' | 'wrong-answer'): void {
    const box = this.getElementBySelector(selector);
    arrayAnswers.forEach((answer) => {
      const wordBox = document.createElement('div');
      wordBox.classList.add('quiz-answer__word');
      const soundBox = document.createElement('div');
      soundBox.classList.add('sound-container');
      wordBox.appendChild(soundBox);
      const soundIconBox = document.createElement('div');
      soundIconBox.classList.add('sound-icon');
      soundIconBox.classList.add(answerClass);
      soundIconBox.setAttribute('data-id', answer.id);
      soundBox.appendChild(soundIconBox);
      const spellingBox = document.createElement('div');
      spellingBox.classList.add('quiz-answer__word-spelling');
      wordBox.appendChild(spellingBox);
      spellingBox.innerHTML = `${answer.word} - ${answer.wordTranslate}`;
      box.appendChild(wordBox);
    });
  }

  // sound

  getPlayer(): HTMLAudioElement {
    if (!this.sound) {
      this.sound = new Audio();
    }
    return this.sound;
  }

  static getClickedWord(id: string): WordData {
    const allAnswer = [...gameCallState.correctAnswers, ...gameCallState.wrongAnswers];
    return allAnswer.find((item) => item.id === id) as WordData;
  }

  playSoundAnswer(wordToPlay: WordData): void {
    const sound = this.getPlayer();
    const { audio } = wordToPlay;
    sound.src = `${BASE_URL}${audio}`;
    sound.play();
  }

  addSoundIconsListener(): void {
    const soundIcons = (this.rootElement as HTMLElement).querySelectorAll('.sound-icon');
    soundIcons.forEach(
      (elem) => elem.addEventListener('click', (e: Event) => {
        const wordToPlay = Results.getClickedWord((e.target as HTMLElement).dataset.id as string);
        this.playSoundAnswer(wordToPlay);
      }),
    );
  }

  //

  insertNumberAnswer(): void {
    const numberCorrectBox = this.getElementBySelector('.count-correct-answer');
    numberCorrectBox.innerHTML = (gameCallState.correctAnswers.length).toString();
    const numberWrongBox = this.getElementBySelector('.count-wrong-answer');
    numberWrongBox.innerHTML = (gameCallState.wrongAnswers.length).toString();
  }

  addCloseButtonListeners(): void {
    const closeButton = this.getElementBySelector('.game-call__close-result');
    (closeButton as HTMLElement).addEventListener('click', () => this.closeGame());
  }

  static clearStateResults(): void {
    gameCallState.level = 1;
    gameCallState.correctAnswers = [];
    gameCallState.wrongAnswers = [];
    gameCallState.newWordsPromises = [];
  }

  async closeGame(): Promise<void> {
    const closeLink = this.getElementBySelector('.close-link');
    if (this.game.fromBook) {
      closeLink.setAttribute('href', '#/text-book');
    } else {
      this.game.chooseLevel();
    }
  }
}

export { Results };
