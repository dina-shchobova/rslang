import { SprintResult } from './sprintResult';
import { exitGame } from './sprintGameControl';
import { ISprint } from './dataTypes';

const ONE_SECOND = 1000;

export class Timer {
  sprint: ISprint;

  constructor(sprint: ISprint) {
    this.sprint = sprint;
  }

  startTimer = (answers: (string | boolean)[][]): void => {
    const timer = document.querySelector('.timer') as HTMLElement;
    let currentTimer = +timer.innerHTML;

    const tick = () => {
      if (exitGame.isExit) return;
      if (currentTimer === -1) {
        this.sprint.removeKeyPressListeners();
        new SprintResult().showResult(answers);
        return;
      }

      timer.innerHTML = `${currentTimer--}`;
      setTimeout(tick, ONE_SECOND);
    };

    setTimeout(tick, ONE_SECOND);
  };
}
