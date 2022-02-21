import { wordsStatLongTerm } from '../../countNewAndLearnWords/wordsStat';
import { BASE_URL } from '../../services/constants';
import { PageComponentThunk } from '../../services/types';
import { TextBookClass } from '../../textbook/textbook';
import { createHandler as createAudioHandler } from '../components/play-word';
import { LearnedWords } from '../../textbook/learnedWords';
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
  const { wordId, isHard } = target.dataset;
  if (!wordId) return;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (textbook.hardWordsMode) {
    (target.closest('.word-card') as HTMLElement).remove();
  }
  if (isHard === 'true') {
    target.dataset.isHard = String(false);
    target.classList.remove('button-hard-word');
    (target.closest('.word-card') as HTMLElement).classList.remove('hard');
    await wordsStatLongTerm.unmarkWordAsHard(wordId);
  } else {
    target.dataset.isHard = String(true);
    target.classList.add('button-hard-word');
    (target.closest('.word-card') as HTMLElement).classList.add('hard');
    (target.closest('.word-card') as HTMLElement).classList.remove('learned');
    ((target.closest('.word-card') as HTMLElement)
      .querySelector('.learned-word.button-word') as HTMLElement)
      .classList.remove('button-learned-word');
    ((target.closest('.word-card') as HTMLElement)
      .querySelector('.learned-word.button-word') as HTMLElement)
      .dataset.isLearned = String(false);
    await wordsStatLongTerm.markWordAsHard(wordId);
  }
};

const learnedWordClickHandler = async (e: MouseEvent): Promise<void> => {
  const target = e.target as HTMLElement;
  const { wordId, isLearned } = target.dataset;
  if (!wordId) return;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (textbook.hardWordsMode) {
    (target.closest('.word-card') as HTMLElement).remove();
  }
  if (isLearned === 'true') {
    target.dataset.isLearned = String(false);
    target.classList.remove('button-learned-word');
    (target.closest('.word-card') as HTMLElement).classList.remove('learned');
    await wordsStatLongTerm.unmarkWordAsLearned(wordId);
  } else {
    target.dataset.isLearned = String(true);
    target.classList.add('button-learned-word');
    (target.closest('.word-card') as HTMLElement).classList.add('learned');
    (target.closest('.word-card') as HTMLElement).classList.remove('hard');
    ((target.closest('.word-card') as HTMLElement)
      .querySelector('.difficult-word.button-word') as HTMLElement)
      .classList.remove('button-hard-word');
    ((target.closest('.word-card') as HTMLElement)
      .querySelector('.difficult-word.button-word') as HTMLElement)
      .dataset.isHard = String(false);
    await wordsStatLongTerm.markWordAsLearned(wordId);
  }
  new LearnedWords().makePageInactive();
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
  main.classList.add('without-scroll');
  new Spinner().addSpinner(main);

  if (Number.isNaN(group) || Number.isNaN(page)) {
    window.location.hash = textbook.formatHash();
    return { html: '' };
  }

  textbook.setGroup(group);
  textbook.setPage(page);

  return { html: await textbook.getRenderedPage(), mount, unmount };
};
