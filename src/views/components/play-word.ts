import { BASE_URL } from '../../services/constants';
import { IWordObject } from '../../services/types';
import { speakImage } from '../../textbook/speak';

const PLAY_BUTTON_ROLE_NAME = 'play-button';

let isEventListenerAdded = false;
if (!isEventListenerAdded) {
  document.body.addEventListener('click', (e: MouseEvent) => {
    isEventListenerAdded = true;
    const target = e.target as HTMLElement;
    const button = target.closest('.play-button') as HTMLButtonElement;
    if (button && button.dataset.role === PLAY_BUTTON_ROLE_NAME) {
      const player = button.nextElementSibling as HTMLAudioElement;
      player.src = BASE_URL + player.dataset.audio;
      player.play();
    }
  });
}

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
