import Chart, { ChartItem } from 'chart.js/auto';
import { ChartConfiguration, Chart as IChart } from 'chart.js';

const htmlCodeChartDay = `
  <h2 class="title">Статистика за все время</h2>
  <div>
     <canvas id="chart-by-day" class="chart-field"></canvas>
  </div>
`;

class ChartLearnedWordsByDays {
  rootElement?: HTMLElement;

  levelButtons?: NodeList;

  myChart?: IChart;

  constructor() {
    this.rootElement = undefined;
    this.levelButtons = undefined;
  }

  createRootElement(): HTMLElement {
    const rootElement = document.createElement('div');
    rootElement.id = 'chart-by-days';
    rootElement.classList.add('chart-field');
    rootElement.innerHTML = htmlCodeChartDay;
    this.rootElement = rootElement;
    return rootElement;
  }

  mount(elem: HTMLElement): void {
    elem.appendChild(this.createRootElement());
    this.mounted();
  }

  mounted(): void {
    this.insertChart();
  }

  getElementBySelector(selector: string): HTMLElement {
    return (this.rootElement as HTMLElement).querySelector(selector) as HTMLElement;
  }

  insertChart(): void {
    this.myChart = new Chart(
      document.getElementById('chart-by-day') as ChartItem,
      ChartLearnedWordsByDays
        .getChartConfiguration(
          ['January', 'February', 'March', 'April', 'May', 'June'],
          [0, 10, 5, 2, 20, 30, 45],
        ),
    );
  }

  static getChartConfiguration(dates: string[], countWords: number[]): ChartConfiguration {
    const data = {
      labels: dates,
      datasets: [{
        label: 'My First dataset',
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: countWords,
      }],
    };
    return {
      type: 'line',
      data,
      options: {},
    };
  }
}

export { ChartLearnedWordsByDays };
