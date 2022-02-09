import { DataWords } from './dataTypes';

const path = 'https://rs-learnwords.herokuapp.com/words';

export const getWord = async (group: number, page: number): Promise<[DataWords]> => {
  const response = await fetch(`${path}?group=${group}&page=${page}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.json();
};
