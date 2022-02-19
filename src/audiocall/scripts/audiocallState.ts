import { IGameCallState } from './audiocallTypes';

const gameCallState: IGameCallState = {
  level: 1,
  fromBook: false,
  correctAnswers: [],
  wrongAnswers: [],
  maxSeries: 0,
  newWordsPromises: [],
  soundEffectOn: true,
};

export { gameCallState };
