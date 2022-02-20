import { BASE_URL } from '../../services/constants';
import { PageComponentThunk } from '../../services/types';
import { TextBookClass, ZERO_GROUP, ZERO_PAGE } from '../../textbook/textbook';

let textbook: TextBookClass | null;
let scroolUp: HTMLButtonElement;
let tbContainer: HTMLDivElement;

const mount = () => {
  scroolUp = document.getElementById('scroll-up') as HTMLButtonElement;
  tbContainer = document.querySelector('.textbook-container') as HTMLDivElement;
  scroolUp.addEventListener('click', () => tbContainer.scrollTo(0, 0));
};

const unmount = () => {
  scroolUp = document.getElementById('scroll-up') as HTMLButtonElement;
  tbContainer = document.querySelector('.textbook-container') as HTMLDivElement;
  if (scroolUp) scroolUp.removeEventListener('click', () => tbContainer.scrollTo(0, 0));
};

export const DifficultWords: PageComponentThunk = async () => {
  const tb = new TextBookClass(
    BASE_URL, document.querySelector('#page_container') || document.body, ZERO_GROUP, ZERO_PAGE,
  );
  textbook = tb;
  await tb.getUserWords();
  const b: string[] = [];
  const arrFromSetUserWords = Array.from(textbook.userWords || []);

  arrFromSetUserWords.forEach(async (wordId) => {
    b.push(await tb.getCardFromId(wordId));
  });
  await textbook.getCardFromId(arrFromSetUserWords[0]);
  return {
    html: `
      <div class="textbook-container">
        <h1 class="hard-header">Сложные слова</h1>
        <button id="scroll-up" class="scroll-up">»</button>
        <div class="word-cards-container">${b.join('')}</div>
      </div>`,
    mount,
    unmount,
  };
};
