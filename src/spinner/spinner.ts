import './spinner.scss';

export class Spinner {
  addSpinner = (node: HTMLElement): void => {
    const containerSpinner = document.createElement('div');
    containerSpinner.innerHTML = '<div class="spinner"></div>';
    containerSpinner.classList.add('container-spinner');
    node.appendChild(containerSpinner);
  };
}
