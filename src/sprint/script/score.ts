import { Points } from './dataTypes';

const AMOUNT_BULBS = 3;

export const amountTrueAnswers = {
  count: 0,
  numberBulb: -1,
};

let currentScore = 0;

export class Score {
  createScoreWrap = (): void => {
    const sprint = document.querySelector('.sprint') as HTMLElement;
    const currentState = document.querySelector('.current-state') as HTMLElement;
    const lightBulbs = document.createElement('div');
    const score = document.createElement('div');
    const pointsWrap = document.createElement('div');

    currentScore = 0;
    score.innerHTML = `${currentScore}`;
    pointsWrap.innerHTML = '+10';
    score.classList.add('score');
    lightBulbs.classList.add('bulbs');
    pointsWrap.classList.add('points');
    amountTrueAnswers.numberBulb = -1;
    amountTrueAnswers.count = 0;

    for (let i = 0; i < AMOUNT_BULBS; i++) {
      const bulb = document.createElement('div');
      bulb.classList.add('light-bulb');

      lightBulbs.appendChild(bulb);
    }

    sprint.append(lightBulbs, pointsWrap);
    currentState.appendChild(score);
  };

  countAnswers = (): void => {
    const pointsWrap = document.querySelector('.points') as HTMLElement;
    const bulbs = document.querySelectorAll('.light-bulb') as unknown as HTMLElement[];
    const score = document.querySelector('.score') as HTMLElement;

    bulbs.forEach((el) => el.classList.remove('active-light'));
    const addPoints = (points: number) => {
      currentScore += points;
      pointsWrap.innerHTML = `+${points}`;
    };

    if (amountTrueAnswers.count < 12) {
      if (amountTrueAnswers.numberBulb === -1) pointsWrap.innerHTML = '+10';

      for (let i = 0; i <= amountTrueAnswers.numberBulb; i++) {
        bulbs[i].classList.add('active-light');
      }
    } else {
      bulbs.forEach((el) => el.classList.add('active-light'));
    }

    if (amountTrueAnswers.count !== 0) {
      if (amountTrueAnswers.count < 4) {
        addPoints(Points.ten);
      } else if (amountTrueAnswers.count < 7) {
        addPoints(Points.twenty);
      } else if (amountTrueAnswers.count < 10) {
        addPoints(Points.forty);
      } else {
        addPoints(Points.eighty);
      }
      score.innerHTML = `${currentScore}`;
    }
  };
}
