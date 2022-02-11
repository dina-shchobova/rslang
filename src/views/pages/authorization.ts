import { Authorization } from '../../authorization/authorization';
import { PageComponentThunk } from '../../services/types';

export const AuthorizationPage: PageComponentThunk = async () => {
  const main = document.body.querySelector('main') as HTMLElement;
  main.innerHTML = '';
  const showAuthorization = new Authorization();
  showAuthorization.createFieldAuthorization();
  return { html: '' };
};
