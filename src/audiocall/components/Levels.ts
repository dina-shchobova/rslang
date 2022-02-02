const htmlCodeLevels = `
    <h2>Аудиовызов</h2>
      <p>Выбрать правильный перевод слова озвученного слова</p>
      <h3>Выберите уровень</h3>
      <div class="levels-buttons">
        <div class="level-button">A1</div>
        <div class="level-button">A2</div>
        <div class="level-button">B1</div>
        <div class="level-button">B2</div>
        <div class="level-button">C1</div>
        <div class="level-button">C2</div>
      </div>
      <button class="audiocall-start">Старт</button>
`;

class LevelsAudiocall {
  rootElement?: HTMLElement;

  constructor() {
    this.rootElement = undefined;
  }

  createRootElement(): HTMLElement {
    const rootElement = document.createElement('div');
    rootElement.id = 'levels';
    rootElement.innerHTML = htmlCodeLevels;
    this.rootElement = rootElement;
    return rootElement;
  }

  mount(elem: HTMLElement): void {
    elem.appendChild(this.createRootElement());
    LevelsAudiocall.mounted();
  }

  static mounted(): void {

  }
}

export { LevelsAudiocall };
