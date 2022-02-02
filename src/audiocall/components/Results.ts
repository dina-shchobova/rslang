import { gameCallState } from '../scripts/audiocallState';
import { IGameCallComponent, ICallLevelsComponent } from '../scripts/audiocallTypes';

const htmlCodeResult = `
      <h2>Результаты</h2>
      <div>
        <span>Вы знаете</span>
        <span class="rigth">${gameCallState.rightAnswers.length}</span>
      </div>
      <div class="game-call__right-answers">

      </div>
      <div>
        <span>Вы не знаете</span>
        <span class="wrong">${gameCallState.wrongAnswers.length}</span>
      </div>

      <div class="game-call__wrong-answers">

      </div>
      <button class="game-call__close-result">Закрыть</button>
`;

class Results implements ICallLevelsComponent {
  rootElement?: HTMLElement;

  game: IGameCallComponent;

  constructor(game: IGameCallComponent) {
    this.game = game;
    this.rootElement = undefined;
  }

  createRootElement(): HTMLElement {
    const rootElement = document.createElement('div');
    rootElement.id = 'game-call__results';
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
    this.insertWords('.game-call__right-answers', gameCallState.rightAnswers);
    this.insertWords('.game-call__wrong-answers', gameCallState.wrongAnswers);
  }

  insertWords(selector: string, arrayWords: string[]): void {
    const box = (this.rootElement as HTMLElement).querySelector(selector) as HTMLElement;
    arrayWords.forEach((word) => {
      const div = document.createElement('div');
      div.innerHTML = word;
      box.appendChild(div);
    });
  }

  addCloseButtonListeners(): void {
    const closeButton = (this.rootElement as HTMLElement).querySelector('.game-call__close-result');
    (closeButton as HTMLElement).addEventListener('click', () => this.closeGame());
  }

  closeGame(): void {
    this.game.chooseLevel();
  }
}

export { Results };
