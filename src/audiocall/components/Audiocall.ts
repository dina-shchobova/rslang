import { Levels } from './Levels';
import { Quiz } from './Quiz';
import { Results } from './Results';
import { SubPages, IGameCallComponent } from '../scripts/audiocallTypes';

const htmlCodeAudiocall = `

<!--    <div class="controls">-->
<!--      <div class="btn-back"></div>-->
<!--      <div>-->
<!--        <div class="btn-sound"></div>-->
<!--        <div class="btn-fullscreen"></div>-->
<!--      </div>-->
<!--    </div>-->
    <div class="game-call__content">

    </div>
`;

class Audiocall implements IGameCallComponent {
  rootElement?: HTMLElement;

  contentContainer?: HTMLElement;

  subPage: string;

  subPages: SubPages;

  constructor() {
    this.subPage = 'levels';
    this.rootElement = undefined;
    this.contentContainer = undefined;
    this.subPages = {
      levels: Levels,
      quiz: Quiz,
      result: Results,
    };
  }

  createRootElement(): HTMLElement {
    const rootElement = document.createElement('div');
    rootElement.id = 'game-call';
    rootElement.innerHTML = htmlCodeAudiocall;
    this.rootElement = rootElement;
    return rootElement;
  }

  mount(elem: HTMLElement): void {
    elem.appendChild(this.createRootElement());
    this.mounted();
  }

  mounted(): void {
    this.mountSubPage();
  }

  mountSubPage(): void {
    const childPage = new this.subPages[this.subPage](this);
    childPage.mount(this.getContentContainer());
  }

  getContentContainer(): HTMLElement {
    if (!this.contentContainer) {
      this.contentContainer = this.getElementBySelector('.game-call__content') as HTMLElement;
    }
    return this.contentContainer;
  }

  getElementBySelector(selector: string): HTMLElement {
    return (this.rootElement as HTMLElement).querySelector(selector) as HTMLElement;
  }

  startGame(): void {
    this.clearChildrenContainer();
    this.subPage = 'quiz';
    this.mountSubPage();
  }

  showResults(): void {
    this.clearChildrenContainer();
    this.subPage = 'result';
    this.mountSubPage();
  }

  chooseLevel(): void {
    this.clearChildrenContainer();
    this.subPage = 'levels';
    this.mountSubPage();
  }

  clearChildrenContainer(): void {
    this.getContentContainer().innerHTML = '';
  }
}

export { Audiocall };
