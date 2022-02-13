import { Answer } from './dataTypes';
import { exitGame } from './sprintGameControl';
import { SaveStatistics, statistics } from '../../statistic/saveStatistics';
import { amountTrueAnswers } from './score';
import { CountNewAndLearnWords } from '../../countNewAndLearnWords/countNewAndLearnWords';

const htmlCodeResult = `
  <div class="sprint-result">
    <div class="title">Результаты</div>
    <div class="result-wrap">
      <div class="result-true">
          <div class="title-true">Знаю:</div>
      </div>
      <hr>
       <div class="result-false">
          <div class="title-false">Ошибок:</div>
      </div>
      <div class="result-navigation">
        <a href="#/"><div class="close-game">Выход</div></a>
      </div>
    </div>
  </div>
`;

export class SprintResult {
  private saveStatistics: SaveStatistics;

  private countNewWords: CountNewAndLearnWords;

  constructor() {
    this.saveStatistics = new SaveStatistics();
    this.countNewWords = new CountNewAndLearnWords();
  }

  createResult(answers: (string | boolean)[][]): void {
    const resultTrue = document.querySelector('.result-true') as HTMLElement;
    const resultFalse = document.querySelector('.result-false') as HTMLElement;
    const trueAnswers: (string | boolean)[][] = [];
    const falseAnswers: (string | boolean)[][] = [];

    answers.forEach((item) => (item[Answer.answer] ? trueAnswers.push(item) : falseAnswers.push(item)));

    this.typeAnswer(trueAnswers, resultTrue);
    this.typeAnswer(falseAnswers, resultFalse);
    this.countTrueAndFalseAnswer(true, trueAnswers.length);
    this.countTrueAndFalseAnswer(false, falseAnswers.length);
  }

  private typeAnswer = (allAnswers: (string | boolean)[][], resultWrap: HTMLElement) => {
    allAnswers.forEach((item) => {
      const oneWord = document.createElement('div');
      const word = document.createElement('div');
      const dash = document.createElement('div');
      const wordTranslate = document.createElement('div');
      const answer = document.createElement('div');

      oneWord.classList.add('one-word');
      word.classList.add('word-result', 'answer');
      wordTranslate.classList.add('word-result', 'answer');

      word.innerHTML = `${item[Answer.word]}`;
      dash.innerHTML = '-';
      wordTranslate.innerHTML = `${item[Answer.wordTranslate]}`;
      answer.classList.add(item[Answer.answer] ? 'true-answer' : 'false-answer');

      resultWrap.appendChild(oneWord);
      oneWord.append(answer, word, dash, wordTranslate);
      this.addAudioOnAnswer(item[Answer.audio] as string, answer);
    });
  };

  addAudioOnAnswer = (audio: string, answer: HTMLElement): void => {
    const sound = new Audio(`https://rs-learnwords.herokuapp.com/${audio}`);
    answer.addEventListener('click', () => {
      sound.play()
        .catch(() => sound.pause());
    });
  };

  countTrueAndFalseAnswer = (typeAnswer: boolean, amount: number): HTMLElement => {
    const titleFalse = document.querySelector('.title-false') as HTMLElement;
    const titleTrue = document.querySelector('.title-true') as HTMLElement;

    const amountAnswers = document.createElement('div');
    amountAnswers.classList.add('amount-answer');
    amountAnswers.innerHTML = `${amount}`;
    return typeAnswer ? titleTrue.appendChild(amountAnswers) : titleFalse.appendChild(amountAnswers);
  };

  async showResult(answers: (string | boolean)[][]): Promise<void> {
    const userId = JSON.parse(<string>localStorage.getItem('user'))?.userId;
    if (exitGame.isExit) return;

    const main = document.querySelector('main') as HTMLElement;
    const sprintWrap = document.querySelector('.sprint-wrap') as HTMLElement;
    const result = document.createElement('div');

    result.innerHTML = htmlCodeResult;
    result.classList.add('result');
    main.appendChild(result);
    sprintWrap.remove();
    if (document.fullscreenElement) document.exitFullscreen();
    this.createResult(answers);

    if (userId) {
      const sprintStat = JSON.parse(<string>localStorage.getItem('statistics')).sprint;
      const lastDay = sprintStat.length - 1;
      const amountNewWords = sprintStat[lastDay].newWords;
      const currentStatistics = JSON.parse(<string>localStorage.getItem('statistics'));
      const maxSeries = currentStatistics.sprint[currentStatistics.sprint.length - 1].series || 0;
      const compareSeries = amountTrueAnswers.maxCount > +maxSeries || amountTrueAnswers.maxCount === +maxSeries;
      Object(statistics.sprint[0]).series = compareSeries ? amountTrueAnswers.maxCount : maxSeries;
      Object(statistics.sprint[0]).newWords = amountNewWords + await this.countNewWords.countNewWords();
      await this.saveStatistics.saveStatistics('sprint');
      await this.saveStatistics.saveStatistics('words');
    }
  }
}
