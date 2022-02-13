import { PageComponentThunk } from '../../services/types';

export const Home: PageComponentThunk = async () => {
  const view = '<div id="">RsLang</div>';
  return { html: view };
};
