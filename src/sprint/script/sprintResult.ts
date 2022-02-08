import { Answer } from './dataTypes';

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
        <div class="close-game">Выход</div>
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

    const typeAnswer = (allAnswers: (string | boolean)[][], resultWrap: HTMLElement) => {
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
    typeAnswer(trueAnswers, resultTrue);
    typeAnswer(falseAnswers, resultFalse);
    this.countTrueAndFalseAnswer(true, trueAnswers.length);
    this.countTrueAndFalseAnswer(false, falseAnswers.length);
  }

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

  showResult(answers: (string | boolean)[][]): void {
    const body = document.querySelector('body') as HTMLElement;
    const sprintWrap = document.querySelector('.sprint-wrap') as HTMLElement;
    const result = document.createElement('div');

    result.innerHTML = htmlCodeResult;
    result.classList.add('result');
    body.appendChild(result);
    sprintWrap.remove();
    if (document.fullscreenElement) document.exitFullscreen();
    this.createResult(answers);
    this.closeGame();
  }

  closeGame = (): void => {
    const closeGame = document.querySelector('.close-game') as HTMLElement;
    const result = document.querySelector('.result') as HTMLElement;
    closeGame.addEventListener('click', () => {
      result.remove();
    });
  };
}
