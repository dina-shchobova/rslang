export const exitGame = {
  isExit: false,
};

export class SprintGameControl {
  controlGame = (): void => {
    const volume = document.querySelector('.sound') as HTMLElement;
    const zoom = document.querySelector('.zoom') as HTMLElement;
    const close = document.querySelector('.close') as HTMLElement;
    const sprintWrap = document.querySelector('.sprint-wrap') as HTMLElement;

    volume.addEventListener('click', () => {
      volume.classList.toggle('sound-active');
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

    close.addEventListener('click', () => {
      if (document.fullscreenElement) document.exitFullscreen();
      sprintWrap.remove();
      exitGame.isExit = true;
    });
  };
}
