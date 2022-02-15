import { IUsersStats, UserWord } from '../sprint/script/dataTypes';
import { BASE_URL } from '../services/constants';
import { getUser } from '../services/requests';

const wordsStatsResource = {

  // проверка есть ли слово в списке пользователя
  async checkWordIsInUserWordsList(wordId: string): Promise<UserWord | undefined> {
    const user = await getUser();
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
  async updateWordInUsersWordsList(word: UserWord): Promise<UserWord> {
    const user = await getUser();
    const rawResponse = await fetch(`${BASE_URL}users/${user?.userId}/words/${word.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${user?.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(word),
    });
    return rawResponse.json();
  },

  // добавляем слов
  async addWordToUsersList(wordId: string, countRightAnswersInRow = 0): Promise<UserWord | undefined> {
    const user = await getUser();
    const rawResponse = await fetch(`${BASE_URL}users/${user?.userId}/words/${wordId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${user?.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        difficulty: 'weak',
        optional: {
          countRightAnswersInRow,
          isLearned: false,
        },
      }),
    });
    return rawResponse.json();
  },

  async createUsersStat(): Promise<void> {
    const user = await getUser();
    await fetch(`${BASE_URL}users/${user?.userId}/statistics`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${user?.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        learnedWords: 0,
        optional: {},
      }),
    });
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

  async setUsersStat(stats: IUsersStats): Promise<void> {
    const user = await getUser();
    const rawResponse = await fetch(`${BASE_URL}users/${user?.userId}/statistics`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${user?.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stats),
    });
    return rawResponse.json();
  },
};

export default wordsStatsResource;
