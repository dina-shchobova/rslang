import { WordData } from '../../sprint/script/dataTypes';

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
  fromBook: boolean;
}

interface ICallLevelsComponent extends ICallComponent {
  levelButtons?: NodeList;
  game: IGameCallComponent;
}

interface IAnswerOnPage {
  answerData: WordData;
  correct: undefined | boolean;
  inactive: boolean
}

interface IGameCallState {
  level: number;
  correctAnswers: WordData[];
  wrongAnswers: WordData[];
  maxSeries: number;
  newWordsPromises: Promise<boolean>[];
  soundEffectOn: boolean;
}

export {
  ICallComponent, IGameCallComponent, ICallLevelsComponent, SubPages, WordData, IAnswerOnPage, IGameCallState,
};
