import { IGameCallState } from './audiocallTypes';

const gameCallState: IGameCallState = {
  level: 1,
  correctAnswers: [],
  wrongAnswers: [],
  maxSeries: 0,
  newWordsPromises: [],
  soundEffectOn: true,
};

export { gameCallState };
