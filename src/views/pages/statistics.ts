import { StatisticsPage } from '../../statistic/statistics';
import { PageComponentThunk } from '../../services/types';

export const Statistics: PageComponentThunk = async () => {
  const statisticsPage = new StatisticsPage();
  return {
    html: '',
    mount: () => statisticsPage.createFieldStatistics(),
  };
};
