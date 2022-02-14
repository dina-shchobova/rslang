import { gameCallState } from '../scripts/audiocallState';
import {
  IGameCallComponent, ICallLevelsComponent, IWordData,
} from '../scripts/audiocallTypes';
import { BACKEND_URL } from './Quiz';
import { SaveStatistics, statistics } from '../../statistic/saveStatistics';

const htmlCodeResult = `
      <h2 class="title">Результаты</h2>
      <div class="field_white field_scroll field_words">
        <div class="results-subtitle">
          <span class="text-advantages">Вы знаете</span>
          <span class="count-answer count-correct-answer"></span>
        </div>
        <div class="game-call__right-answers">

        </div>
        <div class="results-subtitle">
          <span class="text-advantages">Вы не знаете</span>
          <span class="count-answer count-wrong-answer"></span>
        </div>

        <div class="game-call__wrong-answers">

        </div>
      </div>

      <button class="game-call__close-result">Закрыть</button>
`;

class Results implements ICallLevelsComponent {
  rootElement?: HTMLElement;

  game: IGameCallComponent;

  sound?: HTMLAudioElement;

  currentWord?: IWordData;

  private saveStatistics: SaveStatistics;

  constructor(game: IGameCallComponent) {
    this.game = game;
    this.rootElement = undefined;
    this.sound = undefined;
    this.currentWord = undefined;
    this.saveStatistics = new SaveStatistics();
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
  }

  insertAnswerGroups(): void {
    this.insertAnswer('.game-call__right-answers', gameCallState.correctAnswers, 'correct-answer');
    this.insertAnswer('.game-call__wrong-answers', gameCallState.wrongAnswers, 'wrong-answer');
  }

  getElementBySelector(selector: string): HTMLElement {
    return (this.rootElement as HTMLElement).querySelector(selector) as HTMLElement;
  }

  insertAnswer(selector: string, arrayAnswers: IWordData[], answerClass: 'correct-answer' | 'wrong-answer'): void {
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

  static getClickedWord(id: string): IWordData {
    const allAnswer = [...gameCallState.correctAnswers, ...gameCallState.wrongAnswers];
    return allAnswer.find((item) => item.id === id) as IWordData;
  }

  playSoundAnswer(wordToPlay: IWordData): void {
    const sound = this.getPlayer();
    const { audio } = wordToPlay;
    sound.src = `${BACKEND_URL}${audio}`;
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
  }

  closeGame(): void {
    const userId = JSON.parse(<string>localStorage.getItem('user'))?.userId;
    if (userId) {
      const currentStatistics = JSON.parse(<string>localStorage.getItem('statistics'));
      Object(statistics.audiocall[0]).series = Math.max(currentStatistics.audiocall[0].series, gameCallState.maxSeries);
      Object(statistics.audiocall[0])
        .trueAnswers = currentStatistics.audiocall[0].trueAnswers + gameCallState.correctAnswers.length;
      Object(statistics.audiocall[0])
        .falseAnswers = currentStatistics.audiocall[0].falseAnswers + gameCallState.wrongAnswers.length;
      this.saveStatistics.saveStatistics('audiocall');
    }
    Results.clearStateResults();
    this.game.chooseLevel();
  }
}

export { Results };
