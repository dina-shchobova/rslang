import { ChooseLevel } from './chooseLevel';

export class StartGameSprint {
  start = (): void => {
    const sprintPage = document.querySelector('.sprint-page') as HTMLElement;
    const chooseLevel = new ChooseLevel();
    sprintPage.addEventListener('click', () => {
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
    });
  };
}
