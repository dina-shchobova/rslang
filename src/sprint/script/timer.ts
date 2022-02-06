import { SprintResult } from './sprintResult';

export class Timer {
  startTimer = (answers: (string | boolean)[][]): void => {
    const timer = document.querySelector('.timer') as HTMLElement;
    let currentTimer = +timer.innerHTML;

    const interval = setInterval(() => {
      if (currentTimer === -1) {
        clearInterval(interval);
        new SprintResult().showResult(answers);
      }
      timer.innerHTML = `${currentTimer--}`;
    }, 1000);
  };
}
