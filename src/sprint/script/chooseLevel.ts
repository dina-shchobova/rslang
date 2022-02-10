import '../style/sprint.scss';
import { Sprint } from './sprint';
import { exitGame } from './sprintGameControl';

const htmlCodeForChoose = `
   <div class="choose-wrap">
     <div class="title">Спринт</div>
     <div class="subtitle">Вам нужно выбрать соответствует ли перевод предложенному слову</div>
     <div class="levels-wrap"></div>
     <button class="button-choose button">Выбрать</button>
   </div>
`;

export class ChooseLevel {
  private sprint: Sprint;

  constructor() {
    this.sprint = new Sprint();
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
      await new Sprint().createPageGameSprint(selectLevel);
    });
  };
}
