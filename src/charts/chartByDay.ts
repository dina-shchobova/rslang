import Chart from 'chart.js/auto';
import { ICallLevelsComponent, IGameCallComponent } from '../audiocall/scripts/audiocallTypes';

const htmlCodeChartDay = `
  <h2 class="title">Статистика за все время</h2>
  <div>
     <canvas id="chart-by-day"></canvas>
  </div>
`;

interface ChartData {
  labels: string[];
  datasets: [{
    label: string,
    backgroundColor: string,
    borderColor: string,
    data: number[],
  }]
}

// interface ConfigCharts {
//
// }

class ChartDay {
  rootElement?: HTMLElement;

  game: IGameCallComponent;

  levelButtons?: NodeList;

  data: ChartData;

  // configChart: ConfigCharts;

  constructor(game: IGameCallComponent) {
    this.game = game;
    this.rootElement = undefined;
    this.levelButtons = undefined;
    this.data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June'],
      datasets: [{
        label: 'My First dataset',
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: [0, 10, 5, 2, 20, 30, 45],
      }],
    };
    // this.configChart = {
    //   type: 'line',
    //   // data,
    //   options: {},
    // };
  }

  createRootElement(): HTMLElement {
    const rootElement = document.createElement('div');
    rootElement.id = 'chart-by-days';
    rootElement.classList.add('field');
    rootElement.innerHTML = htmlCodeChartDay;
    this.rootElement = rootElement;
    return rootElement;
  }

  mount(elem: HTMLElement): void {
    elem.appendChild(this.createRootElement());
    // this.mounted();
  }

  // mounted(): void {
  //
  // }

  getElementBySelector(selector: string): HTMLElement {
    return (this.rootElement as HTMLElement).querySelector(selector) as HTMLElement;
  }
}

export { ChartDay };
