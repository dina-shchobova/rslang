import { backendRequest, getUser } from '../services/requests';
import { AggregatedWordsResponse, IUsersStats, UserWord } from '../sprint/script/dataTypes';
import { BASE_URL, getFormattedTodayDate } from '../services/constants';

const wordsStatsResource = {

  // проверка есть ли слово в списке пользователя
  async checkWordIsInUserWordsList(wordId: string): Promise<UserWord | undefined> {
    const user = await getUser();
    if (!user) return undefined;
    const rawResponse = await fetch(`${BASE_URL}users/${user?.userId}/words/${wordId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${user?.token}`,
        Accept: 'application/json',
      },
    });
    if (rawResponse.ok) {
      return rawResponse.json();
    }
    if (rawResponse.status === 404) {
      return undefined;
    } // TODO: process no auth error?
    return undefined;
  },

  // обновить кол-во правильных ответов на слове в долгосрочной статитстике
  async updateWordInUsersWordsList(word: UserWord) {
    const user = JSON.parse(<string>localStorage.getItem('user'));
    const getParams = {
      word,
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
    const user = await getUser();
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
    const user = JSON.parse(<string>localStorage.getItem('user'));
    return backendRequest(`users/${user?.userId}/statistics`, 'PUT', {}, stats);
  },

  async getCountOfTodayLearnedWords(): Promise<number> {
    const user = await getUser();
    // if (!user) return undefined;
    const url = new URL(`${BASE_URL}users/${user?.userId}/aggregatedWords`);

    const params = [['page', '1'],
      ['wordsPerPage', '1'],
      ['filter',
        JSON.stringify({
          $and: [{ 'userWord.optional.dateLearned': getFormattedTodayDate(), 'userWord.optional.isLearned': true },
          ],
        }),
      ],
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
      return (resp[0].totalCount[0]?.count || 0) as number;
    }
    return 0;
  },

  async getUserWordsList(): Promise<UserWord[]> {
    const user = await getUser();
    // if (!user) return;
    const rawResponse = await fetch(`${BASE_URL}users/${user?.userId}/words`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${user?.token}`,
        Accept: 'application/json',
      },
    });
    if (rawResponse.ok) {
      return rawResponse.json();
    }
    return [];
  },
};

export default wordsStatsResource;
