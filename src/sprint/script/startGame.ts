import { ChooseLevel } from './chooseLevel';

const deleteNode = (node: Element | undefined) => {
  if (node) node.remove();
};

export class StartGameSprint {
  chooseLevel: ChooseLevel;

  choose?: HTMLElement;

  result?: HTMLElement;

  game?: HTMLElement;

  constructor() {
    this.chooseLevel = new ChooseLevel();
  }

  start = (): void => {
    this.chooseLevel.createFieldChoose();
    this.choose = document.querySelector('.choose-levels') as HTMLElement;
    this.result = document.querySelector('.sprint-result') as HTMLElement;
    this.game = document.querySelector('.sprint-wrap') as HTMLElement;
  };

  stop(): void {
    deleteNode(this.choose);
    deleteNode(this.result);
    deleteNode(this.game);
    this.chooseLevel.unmount();
  }
}
