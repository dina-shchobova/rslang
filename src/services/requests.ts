import { BASE_URL } from './constants';
import { Authorization } from '../authorization/authorization';
import { User } from '../authorization/dataTypes';

export const updateToken = async (): Promise<User | undefined> => {
  const user = JSON.parse(<string>localStorage.getItem('user'));
  const refreshToken = user?.refreshToken;
  const rawResponse = await fetch(`${BASE_URL}users/${user?.userId}/tokens`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${refreshToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (rawResponse.ok) {
    const response = await rawResponse.json();
    user.token = response?.token;
    user.refreshToken = response?.refreshToken;
    localStorage.setItem('user', JSON.stringify(user));
  }

  if (rawResponse.status === 403) {
    const login = document.querySelector('.login') as HTMLElement;
    login.classList.remove('logout');
    ['user', 'userAuthorized', 'user name'].forEach((item) => localStorage.removeItem(item));
    await new Authorization().checkIfUserIsLoggedIn();
    return undefined;
  }

  return user;
};

export const getUser = async (): Promise<User | undefined> => {
  let user = JSON.parse(<string>localStorage.getItem('user'));
  const rawResponse = await fetch(`${BASE_URL}users/${user?.userId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${user.token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (rawResponse.status === 401) {
    user = await updateToken();
  }

  return user;
};
