import { IGameCallState } from './audiocallTypes';

const gameCallState: IGameCallState = {
  level: 1,
  correctAnswers: [],
  wrongAnswers: [],
  maxSeries: 0,
  percentCorrectAnswer: 0,
  soundEffectOn: true,

  getPercentCorrectAnswer(): number {
    return (100 * this.correctAnswers.length) / (this.correctAnswers.length + this.wrongAnswers.length);
  },
};

export { gameCallState };
