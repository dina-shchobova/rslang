import { ChooseLevel } from './chooseLevel';
import { Sprint } from './sprint';

const deleteNode = (node: Element | undefined) => {
  if (node) node.remove();
};

const htmlCodeForChoose = `
<div>
   <div class="game-header">
     <div class="sound button"></div>
     <div class="zoom button"></div>
     <a href="#/"><div class="close button"></div></a>
   </div>
   <div class="game-sprint">

   </div>
</div>
`;

export class StartGameSprint {
  chooseLevel: ChooseLevel;

  choose?: HTMLElement;

  result?: HTMLElement;

  game?: HTMLElement;

  constructor() {
    this.chooseLevel = new ChooseLevel();
  }

  static getNumberGroup(): number {
    const indexAmpersand = window.location.hash.indexOf('&');
    const indexFirstEqual = window.location.hash.indexOf('=');
    const group = window.location.hash.slice(indexFirstEqual + 1, indexAmpersand);
    return +group - 1;
  }

  start = (): void => {
    if (window.location.hash.includes('level=')) {
      const main = document.querySelector('main') as HTMLElement;
      const gameContainer = document.createElement('div');
      gameContainer.innerHTML = htmlCodeForChoose;
      gameContainer.classList.add('game-sprint');
      main.appendChild(gameContainer);
      const group = StartGameSprint.getNumberGroup();
      const game = new Sprint();
      game.createPageGameSprint(group);
    } else {
      this.chooseLevel.createFieldChoose();
    }
    this.choose = document.querySelector('.choose-levels') as HTMLElement;
    this.result = document.querySelector('.sprint-result') as HTMLElement;
    this.game = document.querySelector('.sprint-wrap') as HTMLElement;
  };

  stop(): void {
    deleteNode(this.choose);
    deleteNode(this.result);
    deleteNode(this.game);
    this.chooseLevel.unmount();
  }
}
