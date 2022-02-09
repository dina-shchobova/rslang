export type PageContentThunk = (...routeParams: Record<string, string>[]) => Promise<string>;
export type PageContentRoutes = { [Key in string]: PageContentThunk };
export interface IWordObject {
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
  textExampleTranslate: string,
  textMeaningTranslate: string,
  wordTranslate: string
}
