import { Authorization } from '../../authorization/authorization';
import { PageComponentThunk } from '../../services/types';

export const AuthorizationPage: PageComponentThunk = async () => {
  const showAuthorization = new Authorization();
  return {
    html: '',
    mount: () => showAuthorization.createFieldAuthorization(),
  };
};
