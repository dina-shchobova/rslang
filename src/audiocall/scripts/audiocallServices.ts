import { IWordData } from './audiocallTypes';
import { BASE_URL } from '../../services/constants';
import { getUser } from '../../services/requests';
import {
  AggregatedWordsResponse,
  AggregatedWordsResponsePaginatedResults,
} from '../../sprint/script/dataTypes';

export const getWords = async (group: number, page: number): Promise<IWordData[]> => {
  const rawResponse = await fetch(`${BASE_URL}words?group=${group}&page=${page}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (rawResponse.ok) {
    return rawResponse.json();
  }
  throw new Error(`Ошибка HTTP: ${rawResponse.status}`);
};

export const getIsLearnedWordsList = async (words: IWordData[]): Promise<AggregatedWordsResponsePaginatedResults[]> => {
  const user = await getUser();

  const url = new URL(`${BASE_URL}users/${user?.userId}/aggregatedWords`);

  const arr: { [key: string]: string | boolean | number }[] = [];

  words.map((word) => arr.push({ 'userWord.optional.isLearned': true, word: word.word }));

  const params = [['page', '0'],
    ['wordsPerPage', '30'],
    ['filter',
      JSON.stringify({ $or: arr })],
  ];
  url.search = new URLSearchParams(params).toString();

  const rawResponse = await fetch(`${url}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${user?.token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  if (rawResponse.ok) {
    const resp = await rawResponse.json() as AggregatedWordsResponse[];
    return resp[0].paginatedResults as AggregatedWordsResponsePaginatedResults[];
  }
  return [];
};
