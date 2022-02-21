import wordsStatsResource from '../countNewAndLearnWords/wordsStatsResource';

export class LearnedWords {
  makeWordLearned = async () => {
    await wordsStatsResource.getUserWordsList()
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
    this.makePageInactive();
  };

  makePageInactive = () => {
    const pageContainer = document.querySelector('.word-cards-container') as HTMLElement;
    const learned = document.querySelectorAll('.learned') as unknown as HTMLElement[];
    const bookGames = document.querySelectorAll('.book-game') as unknown as HTMLElement[];
    const bookGameLinks = document.querySelectorAll('.textbook-games-link') as unknown as HTMLElement[];
    const currentPage = document.querySelector('.current-page') as HTMLElement;
    if (learned.length === 20) {
      pageContainer.classList.add('page-learned');
      bookGames.forEach((button) => button.setAttribute('disabled', 'disabled'));
      bookGameLinks.forEach((button) => button.classList.add('disabled'));
      currentPage.classList.add('button-learned');
    } else {
      pageContainer.classList.remove('page-learned');
      bookGames.forEach((button) => button.removeAttribute('disabled'));
      bookGameLinks.forEach((button) => button.classList.remove('disabled'));
      currentPage.classList.remove('page-learned');
    }
  };
}
