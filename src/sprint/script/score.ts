import { Points, MaxPoints } from './dataTypes';

const AMOUNT_BULBS = 3;

export const amountTrueAnswers = {
  maxCount: 0,
  count: 0,
  numberBulb: -1,
};
let maxTrueAnswer = 0;
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
    const pointsWrap = document.querySelector('.points');
    const bulbs = document.querySelectorAll('.light-bulb') as unknown as HTMLElement[];
    const score = document.querySelector('.score');

    bulbs.forEach((el) => el.classList.remove('active-light'));
    const addPoints = (points: number) => {
      currentScore += points;
      if (pointsWrap) {
        pointsWrap.innerHTML = `+${points}`;
      }
    };

    if (amountTrueAnswers.count < MaxPoints.twelve) {
      if (amountTrueAnswers.numberBulb === -1 && pointsWrap) pointsWrap.innerHTML = '+10';

      for (let i = 0; i <= amountTrueAnswers.numberBulb; i++) {
        bulbs[i]?.classList.add('active-light');
      }
    } else {
      bulbs.forEach((el) => el.classList.add('active-light'));
    }

    if (amountTrueAnswers.count !== 0) {
      if (amountTrueAnswers.count < MaxPoints.four) {
        addPoints(Points.ten);
      } else if (amountTrueAnswers.count < MaxPoints.seven) {
        addPoints(Points.twenty);
      } else if (amountTrueAnswers.count < MaxPoints.ten) {
        addPoints(Points.forty);
      } else {
        addPoints(Points.eighty);
      }
      if (score) {
        score.innerHTML = `${currentScore}`;
      }
    }

    if (maxTrueAnswer < amountTrueAnswers.count) maxTrueAnswer = amountTrueAnswers.count;
  };
}
