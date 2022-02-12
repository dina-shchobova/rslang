type SubPages = {
  [key: string]: new(game: IGameCallComponent) => ICallComponent;
};

interface ICallComponent {
  rootElement?: HTMLElement;
  mount:(elem: HTMLElement) => void;
  unmount?:() => void;
  getElementBySelector:(selector: string) => HTMLElement;
}

interface IGameCallComponent extends ICallComponent {
  contentContainer?: HTMLElement;
  subPage: string;
  subPages: SubPages;
  startGame:() => void;
  showResults:() => void;
  chooseLevel:() => void;
}

interface ICallLevelsComponent extends ICallComponent {
  levelButtons?: NodeList;
  game: IGameCallComponent;
}

interface IWordData{
  id: string,
  group: 0,
  page: 0,
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
  textExampleTranslate: string
}

interface IAnswerOnPage {
  answerData: IWordData;
  correct: undefined | boolean;
  inactive: boolean
}

interface IGameCallState {
  level: number;
  correctAnswers: IWordData[];
  wrongAnswers: IWordData[];
  maxSeries: number;
  percentCorrectAnswer: number;
  soundEffectOn: boolean;
  getPercentCorrectAnswer: () => number;
}

export {
  ICallComponent, IGameCallComponent, ICallLevelsComponent, SubPages, IWordData, IAnswerOnPage, IGameCallState,
};
