import { sound } from './dataTypes';

export const exitGame = {
  isExit: false,
};

export class SprintGameControl {
  controlGame = (): void => {
    const volume = document.querySelector('.sound') as HTMLElement;
    const zoom = document.querySelector('.zoom') as HTMLElement;
    const close = document.querySelector('.close') as HTMLElement;

    volume.addEventListener('click', () => {
      volume.classList.toggle('sound-active');
      sound.muted = !!document.querySelector('.sound-active');
    });

    zoom.addEventListener('click', () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
        zoom.classList.remove('zoom-active');
      } else {
        document.documentElement.requestFullscreen();
        zoom.classList.add('zoom-active');
      }
    });

    close.addEventListener('click', async () => {
      if (document.fullscreenElement) await document.exitFullscreen();
      exitGame.isExit = true;
    });
  };
}
