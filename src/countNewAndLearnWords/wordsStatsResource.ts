import { backendRequest } from '../services/requests';
import { AggregatedWordsResponse, IUsersStats, UserWord } from '../sprint/script/dataTypes';
import { BASE_URL, getFormattedTodayDate } from '../services/constants';
import { UserData } from '../authorization/dataTypes';

const wordsStatsResource = {

  // проверка есть ли слово в списке пользователя
  async checkWordIsInUserWordsList(wordId: string): Promise<UserWord | undefined> {
    const user: UserData = JSON.parse(<string>localStorage.getItem('user'));
    if (!user) return undefined;
    try {
      return await backendRequest(`users/${user?.userId}/words/${wordId}`);
    } catch (e) {
      return undefined;
    }
  },

  // обновить кол-во правильных ответов на слове в долгосрочной статитстике
  async updateWordInUsersWordsList(word: UserWord) {
    const user: UserData = JSON.parse(<string>localStorage.getItem('user'));
    const getParams = {
    };
    const postParams = {
      optional: word.optional,
      difficulty: word.difficulty,
    };
    return backendRequest(`users/${user?.userId}/words/${word.wordId}`, 'PUT', getParams, postParams);
  },

  // добавляем слов
  async addWordToUsersList(
    wordId: string,
    countRightAnswersInRow = 0,
    isLearned = false,
    difficulty = 'weak',
    right = 0,
    wrong = 0,
  ): Promise<UserWord | undefined> {
    const user = JSON.parse(<string>localStorage.getItem('user'));
    const getParams = {
      wordId,
      countRightAnswersInRow,
      isLearned,
      difficulty,
    };
    const postParams = {
      difficulty,
      optional: {
        countRightAnswersInRow,
        isLearned,
        progress: {
          right,
          wrong,
        },
        dateAdded: getFormattedTodayDate(),
      },
    };
    return backendRequest(`users/${user?.userId}/words/${wordId}`, 'POST', getParams, postParams);
  },

  async createUsersStat() {
    const user = JSON.parse(<string>localStorage.getItem('user'));
    const postParams = {
      learnedWords: 0,
      optional: {},
    };
    return backendRequest(`users/${user?.userId}/statistics`, 'PUT', {}, postParams);
  },

  async getOrCreateUsersStat(): Promise<IUsersStats> {
    const user: UserData = JSON.parse(<string>localStorage.getItem('user'));
    const rawResponse = await fetch(`${BASE_URL}users/${user?.userId}/statistics`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${user?.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    if (rawResponse.status === 404) {
      await this.createUsersStat();
      return this.getOrCreateUsersStat();
    }
    return rawResponse.json();
  },

  async setUsersStat(stats: IUsersStats) {
    const user: UserData = JSON.parse(<string>localStorage.getItem('user'));
    return backendRequest(`users/${user?.userId}/statistics`, 'PUT', {}, stats);
  },

  async getCountOfTodayLearnedWords(): Promise<number> {
    const user: UserData = JSON.parse(<string>localStorage.getItem('user'));
    if (!user) return 0;
    const filter = JSON.stringify({
      $and: [{
        'userWord.optional.dateLearned': getFormattedTodayDate(),
        'userWord.optional.isLearned': true,
      },
      ],
    });
    const resp = await backendRequest(
      `users/${user?.userId}/aggregatedWords`,
      'GET',
      {
        page: 1,
        wordsPerPage: 1,
        filter,
      },
    ) as AggregatedWordsResponse[];
    return (resp[0].totalCount[0]?.count || 0) as number;
  },

  async getUserWordsList(): Promise<UserWord[]> {
    const user: UserData = JSON.parse(<string>localStorage.getItem('user'));
    if (!user) {
      return [];
    }
    return await backendRequest(`users/${user?.userId}/words`) as UserWord[];
  },
};

export default wordsStatsResource;
