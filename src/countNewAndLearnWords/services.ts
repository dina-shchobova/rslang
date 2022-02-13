import { UserWords } from '../sprint/script/dataTypes';

const path = 'https://rs-learnwords.herokuapp.com/';

export const createUserWord = async (userId: string, wordId: string, word: Partial<UserWords>) => {
  const token = JSON.parse(<string>localStorage.getItem('user'))?.token;
  await fetch(`${path}users/${userId}/words/${wordId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(word),
  })
    .then(async (res) => res.json())
    .catch(async () => {
      // Error('That word was already there today');
    });
};

export const getUserWords = async (userId: string): Promise<[UserWords]> => {
  const token = JSON.parse(<string>localStorage.getItem('user'))?.token;
  const rawResponse = await fetch(`${path}users/${userId}/words`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  return rawResponse.json();
};

export const getUserWord = async (userId: string, wordId: string): Promise<UserWords> => {
  const token = JSON.parse(<string>localStorage.getItem('user'))?.token;
  const rawResponse = await fetch(`${path}users/${userId}/words/${wordId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  return rawResponse.json();
};

export const updateUserWords = async (userId: string, wordId: string, word: Partial<UserWords>) => {
  const token = JSON.parse(<string>localStorage.getItem('user'))?.token;
  await fetch(`${path}users/${userId}/words/${wordId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(word),
  });
};
