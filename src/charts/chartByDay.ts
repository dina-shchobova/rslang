import Chart, { ChartItem } from 'chart.js/auto';

const htmlCodeChartDay = `
  <h2 class="title">Статистика за все время</h2>
  <div>
     <canvas id="chart-by-day" class="chart-field"></canvas>
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

interface ConfigCharts {
  type: string,
  data: ChartData,
  options: any,
}

class ChartDay {
  rootElement?: HTMLElement;

  levelButtons?: NodeList;

  data: ChartData;

  configChart: any;

  constructor() {
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
    this.configChart = {
      type: 'line',
      data: this.data,
      options: {},
    };
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
    const myChart = new Chart(
      document.getElementById('chart-by-day') as ChartItem,
      this.configChart,
    );
  }
}

export { ChartDay };
