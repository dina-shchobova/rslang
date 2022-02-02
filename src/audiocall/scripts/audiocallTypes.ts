type SubPages = {
  [key: string]: new(game: IGameCallComponent) => ICallComponent;
};

interface ICallComponent {
  rootElement?: HTMLElement;
  mount:(elem: HTMLElement) => void;
  // TODO: destroy:() => void;
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

export {
  ICallComponent, IGameCallComponent, ICallLevelsComponent, SubPages,
};
