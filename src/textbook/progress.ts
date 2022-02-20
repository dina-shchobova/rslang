import wordsStatsResource from '../countNewAndLearnWords/wordsStatsResource';

export class Progress {
  showProgress = () => {
    wordsStatsResource.getUserWordsList()
      .then((res) => {
        const progress = document.querySelectorAll('.progress') as unknown as HTMLElement[];
        res.forEach((word) => {
          progress.forEach((item) => {
            const progressId = ({ ...item.dataset }).progressid;

            if (progressId === word.wordId) {
              const addAmount = (type: string) => {
                const answer = item.querySelector(`.${type}`) as HTMLElement;
                const amountAnswer = answer.querySelector(`.amount-${type}`) as HTMLElement;
                amountAnswer.innerHTML = String(type === 'right'
                  ? word.optional.progress.right : word.optional.progress.wrong);
              };
              addAmount('right');
              addAmount('wrong');
            }
          });
        });
      });
    return '';
  };
}
