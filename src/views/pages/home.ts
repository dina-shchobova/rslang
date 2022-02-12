import { PageComponentThunk } from '../../services/types';
import { Main } from '../../mainPage/main';

export const Home: PageComponentThunk = async () => {
  const mainPage = new Main();
  return {
    html: '',
    mount: () => mainPage.createMainPage(),
  };
};
