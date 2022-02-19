import './statistics.scss';
import { StatsChart } from '../charts/StatsChart';
import wordsStatsResource from '../countNewAndLearnWords/wordsStatsResource';
import {
  DateCountDict,
  GameName, IUsersStats, MiniGameStats, UserWord,
} from '../sprint/script/dataTypes';
import { getFormattedTodayDate } from '../services/constants';

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
      <div class="statistics-container">
        <div class="statistics-container_long"></div>
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

const defaultTodayMiniGameZeroRecord: MiniGameStats = {
  date: getFormattedTodayDate(),
  newWords: 0,
  correctAnswers: 0,
  incorrectAnswers: 0,
  maxSeries: 0,
};

export class StatisticsPage {
  private rootElement?: HTMLElement;

  shortStatsChart?: StatsChart;

  longStatsChart?: StatsChart;

  private currentStat: IUsersStats | undefined;

  private todayLearnedWordCount: number | undefined;

  private userWordsList: UserWord[] | undefined;

  constructor() {
    this.rootElement = undefined;
    this.shortStatsChart = undefined;
    this.longStatsChart = undefined;
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
    this.getTodayLearnedWordCount();
    statisticsWrap.classList.remove('no-authorization');
    this.createStatisticsShortTerm('Аудиовызов');
    this.createStatisticsLongTerm('allNewWord');
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

    this.toggle(learnWords, words, 'allLearnedWord', 'long');
    this.toggle(newWords, words, 'allNewWord', 'long');
  }

  showSubtitleStatisticsLongTerm = (typeInfo: string): void => {
    const subtitle = document.querySelector('.subtitle-long-term') as HTMLElement;
    let title = '';
    if (typeInfo === 'allLearnedWord') {
      title = 'Количества изученных слов за весь период обучения';
    } else {
      title = 'Количества новых слов за весь период обучения';
    }
    subtitle.innerHTML = title;
  };

  toggle = (button: HTMLElement, allButtons: HTMLElement[], typeInfo: string, typeStatistics: string): void => {
    button.addEventListener('click', () => {
      allButtons.forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      return typeStatistics === 'short'
        ? this.createStatisticsShortTerm(typeInfo)
        : this.createStatisticsLongTerm(typeInfo);
    });
  };

  showShorTermChart(
    header: string,
    column1Value: number,
    column2Value: number,
    column3Value: number,
    labels: string[] = ['Новые слова', 'Максимальная серия', '% правильных ответов'],
  ): void {
    if (this.shortStatsChart) {
      // this.shortStatsChart.removeData();
      this.shortStatsChart.addData(
        header,
        [column1Value, column2Value, column3Value],
        labels,
      );
    } else {
      this.shortStatsChart = this.addChartShortStat(
        header,
        [column1Value, column2Value, column3Value],
        labels,
      );
    }
  }

  static showShortTermHeaderValues(value1: number, value2: number, value3: number): void {
    const amountStat = document.querySelectorAll('.amount-stat') as unknown as HTMLElement[];
    amountStat[0].innerHTML = `${value1}`;
    amountStat[1].innerHTML = `${value2}`;
    amountStat[2].innerHTML = `${value3}`;
  }

  async getTodayLearnedWordCount(): Promise<number> {
    if (this.todayLearnedWordCount === undefined) {
      this.todayLearnedWordCount = await wordsStatsResource.getCountOfTodayLearnedWords();
    }
    return this.todayLearnedWordCount;
  }

  async findTodayRecordInMiniGameStats(miniGameName: GameName): Promise<MiniGameStats> {
    let currentStat: IUsersStats;
    if (this.currentStat) {
      currentStat = this.currentStat;
    } else {
      currentStat = await wordsStatsResource.getOrCreateUsersStat();
      this.currentStat = currentStat;
    }
    const gameStatsRecords: MiniGameStats[] = currentStat.optional?.miniGames?.[miniGameName] || [];
    let todayRecord: MiniGameStats = ({ ...defaultTodayMiniGameZeroRecord }) as MiniGameStats;
    gameStatsRecords.forEach((record) => {
      if (record.date === getFormattedTodayDate()) {
        todayRecord = record;
      }
    });
    return todayRecord;
  }

  async showStatisticsAudiocall(): Promise<void> {
    const todayRecord = await this.findTodayRecordInMiniGameStats('audiocall');
    const correctAnswersPercentage = (
      todayRecord.correctAnswers + todayRecord.incorrectAnswers > 0
    ) ? Math.ceil((100 * todayRecord.correctAnswers) / (todayRecord.correctAnswers + todayRecord.incorrectAnswers)) : 0;
    StatisticsPage.showShortTermHeaderValues(todayRecord.newWords, todayRecord.maxSeries, correctAnswersPercentage);
    this.showShorTermChart(
      'Аудиовызов',
      todayRecord.newWords,
      todayRecord.maxSeries,
      todayRecord.correctAnswers,
    );
  }

  async showStatisticsSprint(): Promise<void> {
    const todayRecord = await this.findTodayRecordInMiniGameStats('sprint');
    const correctAnswersPercentage = (
      todayRecord.correctAnswers + todayRecord.incorrectAnswers > 0
    ) ? Math.ceil((100 * todayRecord.correctAnswers) / (todayRecord.correctAnswers + todayRecord.incorrectAnswers)) : 0;
    StatisticsPage.showShortTermHeaderValues(todayRecord.newWords, todayRecord.maxSeries, correctAnswersPercentage);
    this.showShorTermChart(
      'Спринт',
      todayRecord.newWords,
      todayRecord.maxSeries,
      todayRecord.correctAnswers,
    );
  }

  async showStatisticsWords(): Promise<void> {
    const todayRecordAudiocall = await this.findTodayRecordInMiniGameStats('audiocall');
    const todayRecordSprint = await this.findTodayRecordInMiniGameStats('sprint');
    const countLearnedWords = await this.getTodayLearnedWordCount();
    const todayCorrectAnswer = todayRecordAudiocall.correctAnswers + todayRecordSprint.correctAnswers;
    const todayIncorrectAnswer = todayRecordAudiocall.incorrectAnswers + todayRecordSprint.incorrectAnswers;
    const newWords = todayRecordAudiocall.newWords + todayRecordSprint.newWords;
    const correctAnswersPercentage = (
      todayCorrectAnswer + todayIncorrectAnswer > 0
    ) ? Math.ceil((100 * todayCorrectAnswer) / (todayCorrectAnswer + todayIncorrectAnswer)) : 0;
    StatisticsPage.showShortTermHeaderValues(newWords, countLearnedWords, correctAnswersPercentage);
    this.showShorTermChart(
      'Слова',
      newWords,
      countLearnedWords,
      correctAnswersPercentage,
      ['Новые слова', 'Изученные слова', '% правильных ответов'],
    );
  }

  showStatistics = async (typeStat: string): Promise<void> => {
    if (typeStat === 'Аудиовызов') {
      this.showStatisticsAudiocall();
    } else if (typeStat === 'Спринт') {
      this.showStatisticsSprint();
    } else {
      this.showStatisticsWords();
    }
  };

  addChartShortStat(
    label: string,
    data: number[],
    dataLabels: string[] = [],
  ): StatsChart {
    const shortContainer = (this.rootElement as HTMLElement).querySelector('.statistics-container_short');
    const chart = new StatsChart('bar', {
      labels: dataLabels,
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

  // long term

  createStatisticsLongTerm(typeInfo: string) {
    this.showLongStatistics(typeInfo);
  }

  showLongStatistics = async (typeStat: string): Promise<void> => {
    if (typeStat === 'allNewWord') {
      this.showStatisticsNewWord();
    } else {
      this.showStatisticsLearnedWord();
    }
    this.showSubtitleStatisticsLongTerm(typeStat);
  };

  async showStatisticsNewWord() {
    const wordsList = await this.getWordsList();
    const availableDates: DateCountDict = wordsList.reduce(
      (
        availableDatesAccumulator: DateCountDict,
        userWord:UserWord,
      ): DateCountDict => {
        if (userWord.optional.dateAdded) {
          if (userWord.optional.dateAdded in availableDatesAccumulator) {
            availableDatesAccumulator[userWord.optional.dateAdded] += 1;
          } else {
            availableDatesAccumulator[userWord.optional.dateAdded] = 1;
          }
        }
        return availableDatesAccumulator;
      }, {},
    );
    const labels:string[] = [];
    const values:number[] = [];
    Object.entries(availableDates).map(([key, value]): void => {
      labels.push(key);
      values.push(value);
      return undefined;
    });
    if (this.longStatsChart) {
      this.longStatsChart.addData('Новые слова', values, labels);
    } else {
      this.longStatsChart = this.addChartLongStat(values, labels);
    }
  }

  async showStatisticsLearnedWord() {
    const wordsList = await this.getWordsList();
    let countWord = 0;
    const availableDates: DateCountDict = wordsList.reduce(
      (
        availableDatesAccumulator: DateCountDict,
        userWord:UserWord,
      ): DateCountDict => {
        if (userWord.optional.dateLearned) {
          countWord += 1;
          if (userWord.optional.dateLearned in availableDatesAccumulator) {
            availableDatesAccumulator[userWord.optional.dateLearned] = countWord;
          } else {
            availableDatesAccumulator[userWord.optional.dateLearned] = countWord;
          }
        }
        return availableDatesAccumulator;
      }, {},
    );
    const labels:string[] = [];
    const values:number[] = [];
    Object.entries(availableDates).map(([key, value]): void => {
      labels.push(key);
      values.push(value);
      return undefined;
    });
    if (this.longStatsChart) {
      this.longStatsChart.addData('Изученные слова', values, labels);
    }
  }

  async getWordsList(): Promise<UserWord[]> {
    if (this.userWordsList === undefined) {
      this.userWordsList = await wordsStatsResource.getUserWordsList();
    }
    return this.userWordsList;
  }

  addChartLongStat(data: number[], labels: string[]): StatsChart {
    const chartLongStatContainer = (this.rootElement as HTMLElement)
      .querySelector('.statistics-container_long') as HTMLElement;
    const chart = new StatsChart('line', {
      labels,
      datasets: [{
        label: 'Новые слова',
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgb(75, 192, 192)',
        data,
      }],
    });
    chart.mount(chartLongStatContainer as HTMLElement);
    return chart;
  }
}
