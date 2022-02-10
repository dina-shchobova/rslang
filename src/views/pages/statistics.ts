import { StatisticsPage } from '../../statistic/statistics';

export const Statistics = async (): Promise<string> => {
  const main = document.body.querySelector('main') as HTMLElement;
  main.innerHTML = '';
  const statisticsPage = new StatisticsPage();
  statisticsPage.createFieldStatistics();
  return '';
};
