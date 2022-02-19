import { PageComponentThunk } from '../../services/types';

export const Games: PageComponentThunk = async () => {
  const view = '<div id="text-book">Play</div>';
  return { html: view };
};
