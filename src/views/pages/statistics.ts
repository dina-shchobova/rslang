import { PageComponentThunk } from '../../services/types';

export const Statistics: PageComponentThunk = async () => {
  const view = '<div id="garage-view">Стата</div>';
  return { html: view };
};
