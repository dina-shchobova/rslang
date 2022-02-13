import './charts.scss';
import Chart, {
  ChartData, ChartItem, ChartTypeRegistry,
} from 'chart.js/auto';
import { ChartConfiguration, Chart as IChart } from 'chart.js';

const htmlCodeChartDay = `
  <div>
     <canvas id="chart-by-day" class="chart-field"></canvas>
  </div>
`;

class StatsChart {
  rootElement?: HTMLElement;

  chartType: keyof ChartTypeRegistry;

  myChart?: IChart;

  data: ChartData;

  options: object;

  constructor(type: keyof ChartTypeRegistry, data: ChartData, options = {}) {
    this.rootElement = undefined;
    this.chartType = type;
    this.data = data;
    this.options = options;
  }

  createRootElement(): HTMLElement {
    const rootElement = document.createElement('div');
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
      StatsChart.getChartConfiguration(this.data, this.chartType, this.options),
    );
  }

  static getChartConfiguration(
    data: ChartData,
    chartType: keyof ChartTypeRegistry,
    options: object,
  ): ChartConfiguration {
    return {
      type: chartType,
      data,
      options,
    };
  }

  addData(label: string, data: number[]) {
    // ((this.myChart as Chart).data.labels as string[]).push(label);
    (this.myChart as Chart).data.datasets.forEach((dataset) => {
      dataset.label = label;
      dataset.data = data;
    });
    (this.myChart as Chart).update();
  }

  removeData() {
    // ((this.myChart as Chart).data.labels as string[]).pop();
    (this.myChart as Chart).data.datasets.forEach((dataset) => {
      dataset.data.pop();
    });
    (this.myChart as Chart).update();
  }
}

export { StatsChart };
