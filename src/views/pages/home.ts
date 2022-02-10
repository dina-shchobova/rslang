import { Main } from '../../mainPage/main';

export const Home = async (): Promise<string> => {
  const mainPage = new Main();
  mainPage.createMainPage();

  return '';
};
