import { gameCallState } from '../scripts/audiocallState';
import { IGameCallComponent, ICallLevelsComponent } from '../scripts/audiocallTypes';

const htmlCodeLevels = `
    <h2 class="title">Аудиовызов</h2>
      <p class="game-call__game-description">Выбрать правильный перевод озвученного слова</p>
      <h3 class="text-advantages instructions">Выберите уровень</h3>
      <div class="game-call__levels-buttons">
        <div class="game-call__level-button button_shadow" data-level="0">A1</div>
        <div class="game-call__level-button button_shadow" data-level="1">A2</div>
        <div class="game-call__level-button button_shadow" data-level="2">B1</div>
        <div class="game-call__level-button button_shadow" data-level="3">B2</div>
        <div class="game-call__level-button button_shadow" data-level="4">C1</div>
        <div class="game-call__level-button button_shadow" data-level="5">C2</div>
      </div>
      <div class="game-call__start">Старт</div>
`;

class Levels implements ICallLevelsComponent {
  rootElement?: HTMLElement;

  game: IGameCallComponent;

  levelButtons?: NodeList;

  constructor(game: IGameCallComponent) {
    this.game = game;
    this.rootElement = undefined;
    this.levelButtons = undefined;
  }

  createRootElement(): HTMLElement {
    const rootElement = document.createElement('div');
    rootElement.id = 'game-call__levels';
    rootElement.classList.add('field');
    rootElement.innerHTML = htmlCodeLevels;
    this.rootElement = rootElement;
    return rootElement;
  }

  mount(elem: HTMLElement): void {
    elem.appendChild(this.createRootElement());
    this.mounted();
  }

  mounted(): void {
    this.addLevelButtonsListeners();
    this.addStartButtonListeners();
  }

  getElementBySelector(selector: string): HTMLElement {
    return (this.rootElement as HTMLElement).querySelector(selector) as HTMLElement;
  }

  getLevelButtons(): NodeList {
    if (!this.levelButtons) {
      this.levelButtons = (this.rootElement as HTMLElement).querySelectorAll('.game-call__level-button');
    }
    return this.levelButtons;
  }

  addLevelButtonsListeners(): void {
    this.getLevelButtons()
      .forEach((elem) => elem.addEventListener(
        'click',
        (e) => this.selectLevel(e.target as HTMLElement),
      ));
  }

  selectLevel(elem: HTMLElement): void {
    this.getLevelButtons()
      .forEach((btn) => (btn as HTMLElement).classList.remove('game-call__level-button_active'));
    elem.classList.add('game-call__level-button_active');
    gameCallState.level = parseInt(elem.dataset.level as string, 10);
  }

  addStartButtonListeners(): void {
    const startButton = this.getElementBySelector('.game-call__start');
    (startButton as HTMLElement).addEventListener('click', () => this.game.startGame());
  }
}

export { Levels };
