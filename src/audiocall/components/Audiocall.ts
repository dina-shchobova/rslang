import { LevelsAudiocall } from './Levels';

const htmlCodeAudiocall = `

    <div class="controls">
      <div class="btn-back"></div>
      <div>
        <div class="btn-sound"></div>
        <div class="btn-fullscreen"></div>
      </div>
    </div>
    <div class="content">

    </div>
`;

interface IComponent {
  rootElement?: HTMLElement;
}

class Audiocall implements IComponent {
  rootElement?: HTMLElement;

  contentContainer?: HTMLElement;

  pages;

  constructor() {
    this.rootElement = undefined;
    this.contentContainer = undefined;
    this.pages = {
    // levels: Levels,
    // quiz: Quiz,
    // result: Result,
    };
  }

  createRootElement(): HTMLElement {
    const rootElement = document.createElement('div');
    rootElement.id = 'audiocall';
    rootElement.innerHTML = htmlCodeAudiocall;
    this.rootElement = rootElement;
    return rootElement;
  }

  mount(elem: HTMLElement): void {
    elem.appendChild(this.createRootElement());
    this.mounted();
  }

  mounted(): void {
    this.mountChildElement();
  }

  mountChildElement(): IComponent {
    const levels = new LevelsAudiocall();
    levels.mount(this.getContentContainer());
    return this;
  }

  getContentContainer(): HTMLElement {
    if (!this.contentContainer) {
      this.contentContainer = (this.rootElement as HTMLElement).querySelector('.content') as HTMLElement;
    }
    return this.contentContainer;
  }
}

export { Audiocall };
