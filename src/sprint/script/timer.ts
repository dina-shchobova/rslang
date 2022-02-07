import { SprintResult } from './sprintResult';
import { exitGame } from './sprintGameControl';

export class Timer {
  startTimer = (answers: (string | boolean)[][]): void => {
    const timer = document.querySelector('.timer') as HTMLElement;
    let currentTimer = +timer.innerHTML;

    const interval = setInterval(() => {
      if (exitGame.isExit) clearInterval(interval);
      if (currentTimer === -1) {
        clearInterval(interval);
        new SprintResult().showResult(answers);
      }
      timer.innerHTML = `${currentTimer--}`;
    }, 1000);
  };
}
