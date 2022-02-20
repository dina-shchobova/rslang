import { wordsStatLongTerm } from '../../countNewAndLearnWords/wordsStat';
import { BASE_URL } from '../../services/constants';
import { PageComponentThunk } from '../../services/types';
import { TextBookClass } from '../../textbook/textbook';
import { createHandler as createAudioHandler } from '../components/play-word';

let textbook: TextBookClass | null;
let pager: HTMLDivElement | null;
let difficultWordButton: NodeListOf<HTMLElement> | null;
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

const mount = () => {
  pager = document.getElementById('pagination-buttons') as HTMLDivElement;
  difficultWordButton = document.querySelectorAll<HTMLElement>('.difficult-word');
  pager.addEventListener('click', pagerClickHandler);
  difficultWordButton.forEach((button) => button.addEventListener('click', difficultWordClickHandler));
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

  if (Number.isNaN(group) || Number.isNaN(page)) {
    window.location.hash = textbook.formatHash();
    return { html: '' };
  }

  textbook.setGroup(group);
  textbook.setPage(page);
  await textbook.getUserWords();

  return { html: await textbook.getWordsConainer(), mount, unmount };
};
