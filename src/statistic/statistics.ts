import './statistics.scss';
import { StatsChart } from '../charts/chartByDay';
import wordsStatsResource from '../countNewAndLearnWords/wordsStatsResource';
import { GameName, IUsersStats, MiniGameStats } from '../sprint/script/dataTypes';
import { getFormattedTodayDate } from '../countNewAndLearnWords/wordsStat';

const htmlCodeStatistic = `
  <div class="statistics">
    <div class="title">Статистика</div>
    <div class="short-term-statistics title">Ваш прогресс на сегодня:
      <div class="subtitle subtitle-short-term"></div>
      <div class="statistics-container">
        <div class="statistics-info"></div>
        <div class="statistics-container_short"></div>
        <div class="icon-game">
          <div class="statistics-audiocall game button active"></div>
          <div class="statistics-sprint game button"></div>
          <div class="statistics-words game button"></div>
        </div>
      </div>
    </div>
    <div class="long-term-statistics">
      <div class="title">Ваш прогресс за все время:</div>
      <div class="subtitle subtitle-long-term">Количества новых слов за весь период обучения</div>
      <div class="statistics-container statistics-container_long">
        <div class="icon-game">
          <div class="statistics-new-words words button active">Новые слова</div>
          <div class="statistics-learn-words words button">Изученные слова</div>
        </div>
      </div>
    </div>
  </div>
`;

const dontShowStatistics = `
  <div class="statistics">
    <div class="title">Статистика</div>
    <div class="subtitle">Только авторизированные пользователи могут просматривать статистику!</div>
  </div>
`;

const statisticsGames = {
  pointOne: ['new-words', 'Количество новых слов за день:'],
  pointTwo: ['true-answers', 'Самая длинная серия правильных ответов:'],
  pointThree: ['max-true-answers', 'Процент правильных ответов:'],
};

const statisticsWords = {
  pointOne: ['new-words', 'Количество новых слов за день:'],
  pointTwo: ['learn-words', 'Количество изученных слов за день:'],
  pointThree: ['true-answers', 'Процент правильных ответов за день:'],
};

export class StatisticsPage {
  private rootElement?: HTMLElement;

  shortStatsChart?: StatsChart;

  constructor() {
    this.rootElement = undefined;
    this.shortStatsChart = undefined;
  }

  createFieldStatistics = (): void => {
    const main = document.querySelector('main') as HTMLElement;
    const statisticsWrap = document.createElement('div');
    this.rootElement = statisticsWrap;

    const isAuthorized = JSON.parse(<string>localStorage.getItem('userAuthorized')) || false;
    statisticsWrap.innerHTML = isAuthorized ? htmlCodeStatistic : dontShowStatistics;
    statisticsWrap.classList.add('statistics-wrap');
    main.appendChild(statisticsWrap);
    if (!isAuthorized) {
      statisticsWrap.classList.add('no-authorization');
      return;
    }

    statisticsWrap.classList.remove('no-authorization');
    this.createStatisticsShortTerm('Аудиовызов');
    this.toggleStatistics();
    this.addListenerToLongTermStatistics();
  };

  createStatisticsShortTerm = (typeInfo: string): void => {
    const getStatistics = (info: object) => {
      const statisticsInfo = document.querySelector('.statistics-info') as HTMLElement;
      const subtitle = document.querySelector('.subtitle-short-term') as HTMLElement;
      statisticsInfo.innerHTML = '';
      subtitle.innerHTML = typeInfo;
      const gamesInfo = Object.entries(info);

      gamesInfo.forEach((item) => {
        const statisticPoint = document.createElement('div');
        const titlePoint = document.createElement('div');
        const statisticValue = document.createElement('div');

        statisticPoint.classList.add(`${item[1][0]}`, 'statistics-point');
        titlePoint.classList.add('title-point');
        titlePoint.innerHTML = `${item[1][1]}`;
        statisticValue.classList.add(`amount-${item[1][0]}`, 'amount-stat');
        statisticValue.innerHTML = '0';

        statisticsInfo.appendChild(statisticPoint);
        statisticPoint.append(titlePoint, statisticValue);
      });
    };
    getStatistics(typeInfo === 'Аудиовызов' || typeInfo === 'Спринт' ? statisticsGames : statisticsWords);
    this.showStatistics(typeInfo);
  };

  toggleStatistics() {
    const audiocall = document.querySelector('.statistics-audiocall') as HTMLElement;
    const sprint = document.querySelector('.statistics-sprint') as HTMLElement;
    const words = document.querySelector('.statistics-words') as HTMLElement;
    const allIcons = document.querySelectorAll('.game') as unknown as HTMLElement[];

    this.toggle(audiocall, allIcons, 'Аудиовызов', 'short');
    this.toggle(sprint, allIcons, 'Спринт', 'short');
    this.toggle(words, allIcons, 'Слова', 'short');
  }

  addListenerToLongTermStatistics() {
    const words = document.querySelectorAll('.words') as unknown as HTMLElement[];
    const learnWords = document.querySelector('.statistics-learn-words') as HTMLElement;
    const newWords = document.querySelector('.statistics-new-words') as HTMLElement;

    this.toggle(learnWords, words, 'Количества изученных слов за весь период обучения', 'long');
    this.toggle(newWords, words, 'Количества новых слов за весь период обучения', 'long');
  }

  showSubtitleStatisticsLongTerm = (typeInfo: string): void => {
    const subtitle = document.querySelector('.subtitle-long-term') as HTMLElement;
    subtitle.innerHTML = typeInfo;
  };

  toggle = (button: HTMLElement, allButtons: HTMLElement[], typeInfo: string, typeStatistics: string): void => {
    button.addEventListener('click', () => {
      allButtons.forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      return typeStatistics === 'short'
        ? this.createStatisticsShortTerm(typeInfo)
        : this.showSubtitleStatisticsLongTerm(typeInfo);
    });
  };

  showStatistics = async (typeStat: string): Promise<void> => {
    let validTypeStatistics: GameName;
    const currentStat :IUsersStats = await wordsStatsResource.getOrCreateUsersStat();
    const amountStat = document.querySelectorAll('.amount-stat') as unknown as HTMLElement[];

    validTypeStatistics = 'audiocall';
    if (typeStat === 'Спринт') {
      validTypeStatistics = 'sprint';
    }
    if (validTypeStatistics) {
      const gameStatsRecords: MiniGameStats[] = currentStat.optional?.miniGames?.[validTypeStatistics] || [];
      let todayRecord: MiniGameStats = {
        date: getFormattedTodayDate(),
        newWords: 0,
        correctAnswers: 0,
        incorrectAnswers: 0,
        maxSeries: 0,
      };
      gameStatsRecords.forEach((record) => {
        if (record.date === getFormattedTodayDate()) {
          todayRecord = record;
        }
      });

      amountStat[0].innerHTML = `${todayRecord.newWords}`;
      amountStat[1].innerHTML = `${todayRecord.maxSeries}`;
      amountStat[2].innerHTML = (
        todayRecord.correctAnswers + todayRecord.incorrectAnswers > 0
      ) ? `${
          Math.ceil((100 * todayRecord.correctAnswers) / (todayRecord.correctAnswers + todayRecord.incorrectAnswers))
        }%` : '0';
      if (this.shortStatsChart) {
        this.shortStatsChart.removeData();
        this.shortStatsChart.addData(
          typeStat,
          [todayRecord.newWords, todayRecord.maxSeries, todayRecord.correctAnswers],
        );
      } else {
        this.shortStatsChart = this.addChartShortStat(
          typeStat,
          [todayRecord.newWords, todayRecord.maxSeries, todayRecord.correctAnswers],
        );
      }
    }
  };

  addChartShortStat(label: string, data: number[]): StatsChart {
    const shortContainer = (this.rootElement as HTMLElement).querySelector('.statistics-container_short');
    const chart = new StatsChart('bar', {
      labels: ['Новые слова', 'Серия слов', 'Правильные ответы'],
      datasets: [{
        label,
        barPercentage: 0.8,
        barThickness: 45,
        maxBarThickness: 50,
        minBarLength: 2,
        data,
        backgroundColor: [
          'rgba(255, 159, 64, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
        ],
        borderColor: [
          'rgb(255, 159, 64)',
          'rgb(75, 192, 192)',
          'rgb(153, 102, 255)',
        ],
        borderWidth: 1,
      }],
    },
    {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    });
    chart.mount(shortContainer as HTMLElement);
    return chart;
  }
}
