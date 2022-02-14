export interface WordData {
  id: string,
  group: number,
  page: number,
  word: string,
  image: string,
  audio: string,
  audioMeaning: string,
  audioExample: string,
  textMeaning: string,
  textExample: string,
  transcription: string,
  wordTranslate: string,
  textMeaningTranslate: string,
  textExampleTranslate: string,
}

export type Difficulty = 'weak' | 'hard';
export type GameName = 'sprint' | 'audiocall';

export interface UserWords {
  id: string,
  difficulty: string,
  optional: {
    isTest: boolean,
    countRightAnswers: number,
  },
  wordId: string
}

export interface UserWord {
  id: string,
  difficulty: Difficulty,
  optional: {
    countRightAnswersInRow: number,
    isLearned: boolean,
    dateLearned?: string,
  },
  wordId: string
}

export interface MiniGameStats {
  date: string,
  newWords: number,
  correctAnswers: number,
  incorrectAnswers: number,
  maxSeries: number
}

type MiniGamesStats = {
  [Key in GameName]?: MiniGameStats[];
};

export interface IUsersStats {
  learnedWords: number,
  optional: {
    miniGames?: MiniGamesStats;
  }
}

export interface ISprint {
  removeKeyPressListeners: () => void;
}

export enum Answer {
  word,
  wordTranslate,
  audio,
  answer,
}

export enum Points {
  ten = 10,
  twenty = 20,
  forty = 40,
  eighty = 80,
}

export enum MaxPoints {
  four = 4,
  seven = 7,
  ten = 10,
  twelve = 12,
}

export enum Levels {
  A1,
  A2,
  B1,
  B2,
  C1,
  C2,
}

export const sound = new Audio();
