import './statistics.scss';

const htmlCodeStatistic = `
  <div class="statistics">
    <div class="title">Статистика</div>
    <div class="subtitle">Название игры</div>
    <div class="statistics-container">
      <div class="statistics-info"></div>
      <div class="icon-game">
        <div class="statistics-audiocall game button active"></div>
        <div class="statistics-sprint game button"></div>
        <div class="statistics-words game button"></div>
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
  pointTwo: ['true-answers', 'Процент правильных ответов:'],
  pointThree: ['max-true-answers', 'Самая длинная серия правильных ответов:'],
};

const statisticsWords = {
  pointOne: ['new-words', 'Количество новых слов за день:'],
  pointTwo: ['learn-words', 'Количество изученных слов за день:'],
  pointThree: ['true-answers', 'Процент правильных ответов за день:'],
};

export class StatisticsPage {
  createFieldStatistics = (): void => {
    const main = document.querySelector('main') as HTMLElement;
    const statisticsWrap = document.createElement('div');
    const isAuthorized = JSON.parse(<string>localStorage.getItem('userAuthorized')) || false;

    statisticsWrap.innerHTML = isAuthorized ? htmlCodeStatistic : dontShowStatistics;
    statisticsWrap.classList.add('statistics-wrap');
    main.appendChild(statisticsWrap);
    this.createStatisticsInfo('game');
  };

  createStatisticsInfo = (typeInfo: string): void => {
    const getStatistics = (info: object) => {
      const statisticsInfo = document.querySelector('.statistics-info') as HTMLElement;
      const gamesInfo = Object.entries(info);
      gamesInfo.forEach((item) => {
        const statisticPoint = document.createElement('div');
        const titlePoint = document.createElement('div');
        const statisticValue = document.createElement('div');

        statisticPoint.classList.add(`${item[1][0]}`, 'statistics-point');
        titlePoint.classList.add('title-point');
        titlePoint.innerHTML = `${item[1][1]}`;
        statisticValue.classList.add(`amount-${item[0][1]}`);

        statisticsInfo.appendChild(statisticPoint);
        statisticPoint.append(titlePoint, statisticValue);
      });
    };
    getStatistics(typeInfo === 'game' ? statisticsGames : statisticsWords);
  }
}
