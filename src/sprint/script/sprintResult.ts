import { Answer, gameCallState } from './dataTypes';
import { exitGame } from './sprintGameControl';
import { wordStatToday } from '../../countNewAndLearnWords/wordsStat';

const htmlCodeResult = `
<div>
  <div class="sprint-result">
    <h2 class="title">Результаты</h2>
    <div class="field_white field_scroll field_words">
      <div class="result-true">
          <div class="title-true">Вы знаете</div>
      </div>
      <hr>
       <div class="result-false">
          <div class="title-false">Вы не знаете</div>
      </div>
    </div>
    <div class="result-navigation">
      <a href="#/"><div class="close-game">Закрыть</div></a>
    </div>
  </div>
</div>
`;

export class SprintResult {
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

  static async sendGameFinishedStats(): Promise<void> {
    Promise.all(gameCallState.newWordsPromises).then((newWordsMarks: boolean[]) => {
      const newWordsCount = newWordsMarks.filter((m) => m).length;
      wordStatToday.updateTodayGameStatOnGameFinish(
        'sprint',
        gameCallState.maxSeries,
        gameCallState.trueAnswers,
        gameCallState.falseAnswers,
        newWordsCount,
      );
    });
  }

  async showResult(answers: (string | boolean)[][]): Promise<void> {
    if (exitGame.isExit) return;

    const gameSprint = document.querySelector('.game-sprint') as HTMLElement;
    const sprintWrap = document.querySelector('.sprint-wrap') as HTMLElement;
    const result = document.createElement('div');

    result.innerHTML = htmlCodeResult;
    result.classList.add('result');
    gameSprint.appendChild(result);
    sprintWrap.remove();
    if (document.fullscreenElement) document.exitFullscreen();
    this.createResult(answers);

    await SprintResult.sendGameFinishedStats();
  }
}
