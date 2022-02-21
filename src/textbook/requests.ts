import { AggregatedWordsResponse, AggregatedWordsResponsePaginatedResults } from '../sprint/script/dataTypes';
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

export { getUsersWordsOnPage };
