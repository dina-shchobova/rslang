import { AggregatedWordsResponse, AggregatedWordsResponsePaginatedResults, WordData } from '../sprint/script/dataTypes';
import { backendRequest } from '../services/requests';
import { UserData } from '../authorization/dataTypes';

const getUsersWordsOnPage = async (words:string[]): Promise<AggregatedWordsResponsePaginatedResults[]> => {
  const user: UserData = JSON.parse(<string>localStorage.getItem('user'));
  if (!user) {
    return [];
  }
  const options:{ [key:string]:string }[] = [];
  words.forEach((word) => {
    options.push({
      word,
    });
  });
  const filter = JSON.stringify({
    $or: options,
  });
  const resp = await backendRequest(
    `users/${user?.userId}/aggregatedWords`,
    'GET',
    {
      page: 0,
      wordsPerPage: 20,
      filter,
    },
  ) as AggregatedWordsResponse[];
  return resp[0].paginatedResults;
};

const getHardWords = async (): Promise<WordData[]> => {
  const user: UserData = JSON.parse(<string>localStorage.getItem('user'));
  const filter = JSON.stringify({
    'userWord.difficulty': 'hard',
  });
  const resp = await backendRequest(
    `users/${user?.userId}/aggregatedWords`,
    'GET',
    {
      page: 0,
      wordsPerPage: 200,
      filter,
    },
  ) as AggregatedWordsResponse[];
  // eslint-disable-next-line no-underscore-dangle
  return resp[0].paginatedResults.map((w) => { w.id = w._id; return w; });
};

export { getUsersWordsOnPage, getHardWords };
