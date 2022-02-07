export interface DataWords {
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
