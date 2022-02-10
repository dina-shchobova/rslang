import { ChooseLevel } from './chooseLevel';

export class StartGameSprint {
  start = (): void => {
    const chooseLevel = new ChooseLevel();
    const choose = document.querySelector('.choose-levels');
    const result = document.querySelector('.sprint-result');
    const game = document.querySelector('.sprint-wrap');

    const deleteNode = (node: Element | null) => {
      if (node) node.remove();
    };
    deleteNode(choose);
    deleteNode(result);
    deleteNode(game);

    chooseLevel.createFieldChoose();
  };
}
