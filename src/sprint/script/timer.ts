import { SprintResult } from './sprintResult';
import { exitGame } from './sprintGameControl';

const ONE_SECOND = 1000;

export class Timer {
  startTimer = (answers: (string | boolean)[][]): void => {
    const timer = document.querySelector('.timer') as HTMLElement;
    const sprintPage = document.querySelector('.sprint-page') as HTMLElement;
    let currentTimer = +timer.innerHTML;

    const interval = setTimeout(function tick() {
      if (exitGame.isExit) clearTimeout(interval);
      if (currentTimer === -1) {
        clearTimeout(interval);
        new SprintResult().showResult(answers);
      }

      timer.innerHTML = `${currentTimer--}`;
      setTimeout(tick, ONE_SECOND);
    }, ONE_SECOND);

    sprintPage.addEventListener('click', () => {
      clearTimeout(interval);
      exitGame.isExit = false;
    });
  };
}
