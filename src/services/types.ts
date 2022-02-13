export type PageComponent = Promise<{ html: string, mount?: () => void, unmount?: () => void }>;
export type PageComponentThunk = (...pageParams: Record<string, string>[]) => PageComponent;
export type PageRoutes = { [Key in string]: PageComponentThunk };
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
