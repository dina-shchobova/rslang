import '../style/sprint.scss';
import { Sprint } from './sprint';
import { exitGame, SprintGameControl } from './sprintGameControl';

const htmlCodeForChoose = `
<div>
   <div class="game-header">
     <div class="sound button"></div>
     <div class="zoom button"></div>
     <a href="#/"><div class="close button"></div></a>
   </div>
   <div class="game-sprint">
     <div class="choose-wrap">
       <h2 class="title">Спринт</h2>
       <div class="subtitle">Выбрать соответствует ли перевод предложенному слову</div>
       <h3 class="text-advantages">Выберите уровень</h3>
       <div class="levels-wrap"></div>
       <div class="button-choose button">Старт</div>
     </div>
   </div>
</div>
`;

export class ChooseLevel {
  private sprint: Sprint;

  private controlButtons: SprintGameControl;

  constructor() {
    this.sprint = new Sprint();
    this.controlButtons = new SprintGameControl();
  }

  unmount() {
    this.sprint.removeKeyPressListeners();
  }

  createFieldChoose(): void {
    exitGame.isExit = true;
    const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const main = document.querySelector('main') as HTMLElement;
    const chooseLevels = document.createElement('div');

    chooseLevels.innerHTML = htmlCodeForChoose;
    chooseLevels.classList.add('choose-levels');
    main.appendChild(chooseLevels);

    levels.forEach((item) => {
      const levelsWrap = document.querySelector('.levels-wrap') as HTMLElement;
      const level = document.createElement('div');
      level.innerHTML = item;
      level.classList.add('level', 'button');
      levelsWrap.appendChild(level);
    });
    this.chooseLevel(levels);

    this.controlButtons.controlGame();
  }

  chooseLevel = (levels: string[]): void => {
    const level = document.querySelectorAll('.level') as unknown as HTMLElement[];
    const buttonChoose = document.querySelector('.button-choose') as HTMLElement;
    let selectLevel = 0;

    level.forEach((item) => {
      item.addEventListener('click', () => {
        level.forEach((lvl) => lvl.classList.remove('choose'));

        if (typeof item.textContent === 'string') {
          selectLevel = levels.indexOf(item.textContent);
          item.classList.add('choose');
        }
      });
    });

    buttonChoose.addEventListener('click', async () => {
      await this.sprint.createPageGameSprint(selectLevel);
    });
  };
}
