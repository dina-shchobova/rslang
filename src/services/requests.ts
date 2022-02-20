import { BASE_URL } from './constants';
import { Authorization } from '../authorization/authorization';
import { User } from '../authorization/dataTypes';
import { UserWord } from '../sprint/script/dataTypes';

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
    document.location.href = '#/authorization';
  }

  return user;
};

export const getUser = async (): Promise<User | undefined> => {
  let user = JSON.parse(<string>localStorage.getItem('user'));
  if (user) {
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
  }
  return user;
};

export const backendRequest = async (url: string, method: string, getParams = {},
  postParams = {}): Promise<UserWord | undefined> => {
  let user = JSON.parse(<string>localStorage.getItem('user'));
  const newUrl = new URL(BASE_URL + url);

  if (Object.values(getParams).length) {
    newUrl.search = new URLSearchParams(Object.entries(getParams)).toString();
  }

  const response = await fetch(newUrl.toString(), {
    method,
    headers: {
      Authorization: `Bearer ${user.token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postParams),
  });

  if (response.ok) {
    return response.json();
  }

  if (response.status === 401) {
    const oldToken = user.token;
    user = await updateToken();

    if (user.token && oldToken !== user.token) {
      return backendRequest(url, method, getParams, postParams);
    }
    document.location.href = '#/authorization';
  }
  return undefined;
};
