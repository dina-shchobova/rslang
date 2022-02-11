import { saveStat } from './services';

export const statistics = {
  audiocall: {
    newWords: 0,
    trueAnswers: 0,
    falseAnswers: 0,
    series: 0,
  },
  sprint: {
    newWords: 0,
    trueAnswers: 0,
    falseAnswers: 0,
    series: 0,
  },
  words: {
    newWords: 0,
    trueAnswers: 0,
    falseAnswers: 0,
    series: 0,
  },
};

const stat = {
  audiocall: 'Аудиовызов',
  sprint: 'Спринт',
  words: 'Слова',
};

export class SaveStatistics {
  saveStatistics = async (): Promise<void> => {
    const { userId } = JSON.parse(<string>localStorage.getItem('user'));
    localStorage.setItem('statistics', JSON.stringify(statistics));
    await saveStat(userId, { learnedWords: 0, optional: { statistics } });
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
    const amountWords = currentStat[typeStatistics].trueAnswers + currentStat[typeStatistics].falseAnswers;
    const percent = Math.round((currentStat[typeStatistics].trueAnswers * 100) / amountWords) || 0;
    amountStat[0].innerHTML = currentStat[typeStatistics].newWords;
    amountStat[1].innerHTML = currentStat[typeStatistics].series;
    amountStat[2].innerHTML = `${percent}%`;
  };
}
