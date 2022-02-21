import wordsStatsResource from '../countNewAndLearnWords/wordsStatsResource';

export class LearnedWords {
  makeWordLearned = () => {
    wordsStatsResource.getUserWordsList()
      .then((res) => {
        res.forEach((word) => {
          if (word.optional.isLearned) {
            const wordCards = document.querySelectorAll('.word-card') as unknown as HTMLElement[];
            const buttonLearned = document.querySelectorAll('.learned-word') as unknown as HTMLElement[];
            wordCards.forEach((card, ind) => {
              const cardId = ({ ...card.dataset }).cardid;
              if (cardId === word.wordId) {
                wordCards[ind].classList.add('learned');
                buttonLearned[ind].classList.add('button-learned-word');
              }
            });
          }
        });
      });
    return '';
  };
}
