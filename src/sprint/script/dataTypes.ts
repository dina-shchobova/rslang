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
    progress: {
      right: number,
      wrong: number
    },
    dateLearned?: string,
    dateAdded?: string,
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
  id?: string,
  learnedWords: number,
  optional?: {
    miniGames?: MiniGamesStats;
  }
}

export interface AggregatedWordsResponseTotalCount {
  count: number
}

export interface AggregatedWordsResponsePaginatedResults extends WordData {
  _id: string
  userWord: UserWord
}

export interface AggregatedWordsResponse {
  paginatedResults: AggregatedWordsResponsePaginatedResults[];
  totalCount: AggregatedWordsResponseTotalCount[];
}

export interface ISprint {
  removeKeyPressListeners: () => void;
  noWords: boolean;
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

export const gameCallState = {
  maxSeries: 0,
  trueAnswers: 0,
  falseAnswers: 0,
  newWordsPromises: [] as boolean[],
};

export type DateCountDict = { [k: string]:number };
