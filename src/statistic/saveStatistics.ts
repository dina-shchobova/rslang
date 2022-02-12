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
    learnWords: 0,
  }],
};

const stat = {
  audiocall: 'Аудиовызов',
  sprint: 'Спринт',
  words: 'Слова',
};

export class SaveStatistics {
  saveStatistics = async (typeStat: string): Promise<void> => {
    const currentStat = JSON.parse(<string>localStorage.getItem('statistics'));
    [currentStat[typeStat][currentStat[typeStat].length - 1]] = [statistics[typeStat][0]];
    localStorage.setItem('statistics', JSON.stringify(currentStat));

    await this.createStatisticsByWords();
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

  showStatistics = (typeStat: string): void => {
    const typeGame = Object.entries(stat);
    let typeStatistics = '';
    const currentStat = JSON.parse(<string>localStorage.getItem('statistics'));
    const amountStat = document.querySelectorAll('.amount-stat') as unknown as HTMLElement[];

    typeGame.forEach((arr) => {
      arr.forEach((item) => {
        if (item === typeStat) typeStatistics = `${arr[0]}`;
      });
    });

    const lastStat = currentStat[typeStatistics].length - 1;
    const { trueAnswers } = currentStat[typeStatistics][lastStat];
    const { falseAnswers } = currentStat[typeStatistics][lastStat];
    const amountWords = trueAnswers + falseAnswers;
    const percent = Math.round((currentStat[typeStatistics][lastStat].trueAnswers * 100) / amountWords) || 0;
    const seriesOrLearnWords = currentStat[typeStatistics][lastStat].series === undefined
      ? currentStat[typeStatistics][lastStat].learnWords
      : currentStat[typeStatistics][lastStat].series;

    amountStat[0].innerHTML = currentStat[typeStatistics][lastStat].newWords;
    amountStat[1].innerHTML = seriesOrLearnWords;
    amountStat[2].innerHTML = `${percent}%`;
  };

  createStatisticsByWords = async (): Promise<void> => {
    const { userId } = JSON.parse(<string>localStorage.getItem('user'));
    const currentStat = JSON.parse(<string>localStorage.getItem('statistics'));
    const keys = Object.keys(currentStat);
    let newWords = 0;
    const learnWords = 0;
    let trueWords = 0;
    let falseWords = 0;

    keys.pop();
    keys.forEach((item) => {
      const statWords = currentStat[item];

      if (typeof currentStat[item] === 'object') {
        newWords += statWords[statWords.length - 1].newWords;
        trueWords += statWords[statWords.length - 1].trueAnswers;
        falseWords += statWords[statWords.length - 1].falseAnswers;
      }
    });

    currentStat.words[currentStat.words.length - 1].newWords = newWords;
    currentStat.words[currentStat.words.length - 1].learnWords = learnWords;
    currentStat.words[currentStat.words.length - 1].trueAnswers = trueWords;
    currentStat.words[currentStat.words.length - 1].falseAnswers = falseWords;

    localStorage.setItem('statistics', JSON.stringify(currentStat));
    await saveStat(userId, { learnedWords: 0, optional: { statistics: currentStat } });
  };

  getLongTermStatistics = (): void => {
    const currentStat = JSON.parse(<string>localStorage.getItem('statistics'));
    const { words } = currentStat;
    const newWords: object[] = [];
    const learnWords: object[] = [];

    words.forEach((item: { date: string, newWords: number; learnWords: number }) => {
      newWords.push({date: item.date, countWords: item.newWords});
      learnWords.push({date: item.date, countWords: item.learnWords});
    });
  };
}
