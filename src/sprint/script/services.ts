import { DataWords, UserWords } from './dataTypes';

const path = 'https://rs-learnwords.herokuapp.com/';

export const getWord = async (group: number, page: number): Promise<[DataWords]> => {
  const response = await fetch(`${path}words?group=${group}&page=${page}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.json();
};

const token = JSON.parse(<string>localStorage.getItem('user'))?.token;
export const createUserWord = async (userId: string, wordId: string, word: object): Promise<[UserWords]> => {
  const rawResponse = await fetch(`${path}users/${userId}/words/${wordId}`, {
    method: 'POST',
    // withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(word),
  });
  // const content = await rawResponse.json();
  // console.log(content);
  return rawResponse.json();
};

export const getUserWord = async (userId: string, wordId: string): Promise<[UserWords]> => {
  const rawResponse = await fetch(`${path}users/${userId}/words/${wordId}`, {
    method: 'GET',
    // withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });
  // const content = await rawResponse.json();
  // console.log(content);
  return rawResponse.json();
};
