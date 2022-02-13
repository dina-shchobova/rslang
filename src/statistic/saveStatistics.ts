import { saveStat } from './services';

const date = new Date();
const today = `${date.getUTCDate()}.${date.getUTCMonth() + 1}.${date.getUTCFullYear()}`;

type Stat = {
  [key: string]: string | [object];
};

export const statistics: Stat = {
  date: today,
  audiocall: [{
    date: today,
    newWords: 0,
    trueAnswers: 0,
    falseAnswers: 0,
    series: 0,
  }],
  sprint: [{
    date: today,
    newWords: 0,
    trueAnswers: 0,
    falseAnswers: 0,
    series: 0,
  }],
  words: [{
    date: today,
    newWords: 0,
    trueAnswers: 0,
    falseAnswers: 0,
    series: 0,
  }],
};

export const stat = {
  audiocall: 'Аудиовызов',
  sprint: 'Спринт',
  words: 'Слова',
};

export class SaveStatistics {
  saveStatistics = async (typeStat: string): Promise<void> => {
    const { userId } = JSON.parse(<string>localStorage.getItem('user'));
    const currentStat = JSON.parse(<string>localStorage.getItem('statistics'));

    [currentStat[typeStat][currentStat[typeStat].length - 1]] = [statistics[typeStat][0]];
    localStorage.setItem('statistics', JSON.stringify(currentStat));
    await saveStat(userId, { learnedWords: 0, optional: { statistics: currentStat } });
  };

  addTodayDate = async (): Promise<void> => {
    const { userId } = JSON.parse(<string>localStorage.getItem('user'));
    const currentStat = JSON.parse(<string>localStorage.getItem('statistics'));
    const all = Object.keys(statistics);

    if (currentStat.date !== today) {
      currentStat.date = today;
      all.forEach((item) => {
        if (Array.isArray(currentStat[item])) currentStat[item].push(statistics[item][0]);
      });
      localStorage.setItem('statistics', JSON.stringify(currentStat));
    }

    await saveStat(userId, { learnedWords: 0, optional: { statistics: currentStat } });
  };
}
