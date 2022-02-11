import { PageComponentThunk } from '../../services/types';
import { Main } from '../../mainPage/main';

export const Home: PageComponentThunk = async () => {
  const mainPage = new Main();
  mainPage.createMainPage();
  const view = '<div id="">RsLang</div>';
  return { html: '' };
}
