import { BASE_URL } from '../../services/constants';
import { IWordObject } from '../../services/types';

const PLAY_BUTTON_ROLE_NAME = 'play-button';

let isEventListenerAdded = false;
if (!isEventListenerAdded) {
  document.body.addEventListener('click', (e: MouseEvent) => {
    isEventListenerAdded = true;
    const target = e.target as HTMLElement;
    if (target.dataset.role === PLAY_BUTTON_ROLE_NAME) {
      const player = target.nextSibling as HTMLAudioElement;
      player.play();
    }
  });
}

export function createOneWordDiv(wordObject: IWordObject): string {
  return `<div data-name="${wordObject.word}">
  ${wordObject.word}${wordObject.transcription}
  <button data-role="${PLAY_BUTTON_ROLE_NAME}">play</button><audio src="${BASE_URL + wordObject.audio}"></audio>
  </div>
  `;
}
