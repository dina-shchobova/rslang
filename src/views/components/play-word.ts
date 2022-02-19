import { IWordObject } from '../../services/types';
import { speakImage } from '../../textbook/speak-image';
import { BASE_URL } from '../../services/constants';

const PLAY_BUTTON_ROLE_NAME = 'play-button';

export function createOneWordDiv(wordObject: IWordObject): string {
  return `
    <div class="one-word-container">
      <span class="word-name" data-name="${wordObject.word}">
        ${wordObject.word}
      </span>
      <span class="word-transcription"> ${wordObject.transcription}</span>
      <button class="${PLAY_BUTTON_ROLE_NAME}" data-role="${PLAY_BUTTON_ROLE_NAME}">
        ${speakImage}
      </button>
      <audio
        data-audio="${wordObject.audio}"
        data-meaning ="${wordObject.audioMeaning}"
        data-example="${wordObject.audioExample}">
      </audio>
    </div>
  `;
}

export const createHandler = (d: HTMLElement) => {
  const wordsContainerClickHandler = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const button = target.closest(`.${PLAY_BUTTON_ROLE_NAME}`) as HTMLButtonElement;
    if (button && button.dataset.role === PLAY_BUTTON_ROLE_NAME) {
      const player = button.nextElementSibling as HTMLAudioElement;
      const files = Object.values(player.dataset);
      const playerHandler = () => {
        if (files) {
          player.src = BASE_URL + files.shift();
          player.play().catch(() => { });
        } else {
          player.removeEventListener('ended', playerHandler);
        }
      };
      player.addEventListener('ended', playerHandler);
      playerHandler();
    }
  };
  d.addEventListener('click', wordsContainerClickHandler);
  return () => d.removeEventListener('click', wordsContainerClickHandler);
};
