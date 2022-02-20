import { wordsStatLongTerm } from '../../countNewAndLearnWords/wordsStat';
import { BASE_URL } from '../../services/constants';
import { PageComponentThunk } from '../../services/types';
import { TextBookClass } from '../../textbook/textbook';
import { createHandler as createAudioHandler } from '../components/play-word';
import { Spinner } from '../../spinner/spinner';

let textbook: TextBookClass | null;
let pager: HTMLDivElement | null;
let difficultWordButton: NodeListOf<HTMLElement> | null;
let learnedWordButton: NodeListOf<HTMLElement> | null;
let scroolUp: HTMLButtonElement;
let tbContainer: HTMLDivElement;

let removeAudioListener: () => void;

const pagerClickHandler = async (e: MouseEvent): Promise<void> => {
  const target = e.target as HTMLElement;
  if (target.dataset.href) window.location.hash = target.dataset.href;
};

const difficultWordClickHandler = async (e: MouseEvent): Promise<void> => {
  const target = e.target as HTMLElement;
  const { isexist, wordid } = target.dataset;
  if (!wordid) return;
  if (isexist === 'false') {
    await wordsStatLongTerm.markWordAsHard(wordid);
    if (textbook) {
      textbook.userWords.add(wordid as string);
      // eslint-disable-next-line no-console
      // console.log(1, textbook.userWords);
      target.dataset.isexist = 'true';
      target.textContent = 'Удалить из списка';
    }
  } else {
    await Promise.resolve('вызвать метод, который убирает wordId из списка пользователя.');
    if (textbook) {
      textbook.userWords.delete(wordid as string);
      // eslint-disable-next-line no-console
      // console.log(2, textbook.userWords);
      target.dataset.isexist = 'false';
      target.textContent = 'Сложное слово';
    }
  }
};

const learnedWordClickHandler = async (e: MouseEvent): Promise<void> => {
  const wordCards = document.querySelectorAll('.word-card') as unknown as HTMLElement[];
  const target = e.target as HTMLElement;
  const wordId = { ...target.dataset };
  if (!wordId) return;
  await wordsStatLongTerm.markWordAsLearned(wordId.learnedid as string)
    .then(() => {
      wordCards.forEach((card, ind) => {
        const cardId = { ...card.dataset };
        if (cardId.cardid === wordId.learnedid) {
          wordCards[ind].classList.add('learned');
        }
      });
      target.classList.add('button-learned-word');
    });
};

const mount = () => {
  pager = document.getElementById('pagination-buttons') as HTMLDivElement;
  difficultWordButton = document.querySelectorAll<HTMLElement>('.difficult-word');
  learnedWordButton = document.querySelectorAll<HTMLElement>('.learned-word');
  pager.addEventListener('click', pagerClickHandler);
  difficultWordButton.forEach((button) => button.addEventListener('click', difficultWordClickHandler));
  learnedWordButton.forEach((button) => button.addEventListener('click', learnedWordClickHandler));
  scroolUp = document.getElementById('scroll-up') as HTMLButtonElement;
  tbContainer = document.querySelector('.textbook-container') as HTMLDivElement;
  scroolUp.addEventListener('click', () => tbContainer.scrollTo(0, 0));
  removeAudioListener = createAudioHandler(document.getElementById('words-container') as HTMLDivElement);
};

const unmount = () => {
  // userWords = new Set();
  if (pager) pager.removeEventListener('click', pagerClickHandler);
  if (difficultWordButton) {
    difficultWordButton.forEach((button) => button.removeEventListener('click', difficultWordClickHandler));
  }
  if (learnedWordButton) {
    learnedWordButton.forEach((button) => button.removeEventListener('click', learnedWordClickHandler));
  }
  tbContainer = document.querySelector('.textbook-container') as HTMLDivElement;
  if (scroolUp) scroolUp.removeEventListener('click', () => tbContainer.scrollTo(0, 0));
  removeAudioListener();
  pager = null;
  difficultWordButton = null;
};

export const TextBook: PageComponentThunk = async (params) => {
  textbook = new TextBookClass(BASE_URL, document.querySelector('#page_container') || document.body, 1, 1);
  const args = params as { group: string, page: string };
  const group = +args.group;
  const page = +args.page;

  const main = document.querySelector('main') as HTMLElement;
  new Spinner().addSpinner(main);

  if (Number.isNaN(group) || Number.isNaN(page)) {
    window.location.hash = textbook.formatHash();
    return { html: '' };
  }

  textbook.setGroup(group);
  textbook.setPage(page);
  await textbook.getUserWords();

  return { html: await textbook.getWordsConainer(), mount, unmount };
};
