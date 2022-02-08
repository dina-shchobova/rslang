import { SprintResult } from './sprintResult';
import { exitGame } from './sprintGameControl';

const ONE_SECOND = 1000;

export class Timer {
  startTimer = (answers: (string | boolean)[][]): void => {
    const timer = document.querySelector('.timer') as HTMLElement;
    const sprintPage = document.querySelector('.sprint-page') as HTMLElement;
    let currentTimer = +timer.innerHTML;

    setTimeout(function tick() {
      if (exitGame.isExit) return;
      if (currentTimer === -1) {
        new SprintResult().showResult(answers);
        return;
      }

      timer.innerHTML = `${currentTimer--}`;
      setTimeout(tick, ONE_SECOND);
    }, ONE_SECOND);

    sprintPage.addEventListener('click', () => {
      exitGame.isExit = true;
    });
  };
}
