import { Authorization } from '../../authorization/authorization';

export const AuthorizationPage = async (): Promise<string> => {
  const main = document.body.querySelector('main') as HTMLElement;
  main.innerHTML = '';
  const showAuthorization = new Authorization();
  showAuthorization.createFieldAuthorization();
  return '';
};
