import { ChooseLevel } from './chooseLevel';

export class StartGameSprint {
  start = (): void => {
    const sprintPage = document.querySelector('.sprint-page') as HTMLElement;
    const chooseLevel = new ChooseLevel();
    sprintPage.addEventListener('click', () => {
      const choose = document.querySelector('.choose-levels');
      const result = document.querySelector('.sprint-result');
      const game = document.querySelector('.sprint-wrap');
      if (choose) choose.remove();
      if (result) result.remove();
      if (game) game.remove();
      chooseLevel.createFieldChoose();
    });
  };
}
