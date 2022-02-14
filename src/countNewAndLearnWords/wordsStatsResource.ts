import { IUsersStats, UserWord } from '../sprint/script/dataTypes';
import { BASE_URL } from '../services/constants';

const wordsStatsResource = {

  // проверка есть ли слово в списке пользователя
  async checkWordIsInUserWordsList(wordId: string): Promise<UserWord | undefined> {
    const token = JSON.parse(<string>localStorage.getItem('user'))?.token;
    const userId = JSON.parse(<string>localStorage.getItem('user'))?.id;
    const rawResponse = await fetch(`${BASE_URL}users/${userId}/words/${wordId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
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
    const token = JSON.parse(<string>localStorage.getItem('user'))?.token;
    const userId = JSON.parse(<string>localStorage.getItem('user'))?.id;
    const rawResponse = await fetch(`${BASE_URL}users/${userId}/words/${word.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(word),
    });
    return rawResponse.json();
  },

  // добавляем слов
  async addWordToUsersList(wordId: string, countRightAnswersInRow = 0): Promise<UserWord> {
    const token = JSON.parse(<string>localStorage.getItem('user'))?.token;
    const userId = JSON.parse(<string>localStorage.getItem('user'))?.id;

    const rawResponse = await fetch(`${BASE_URL}users/${userId}/words/${wordId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
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

  async getUsersStat(): Promise<IUsersStats> {
    const token = JSON.parse(<string>localStorage.getItem('user'))?.token;
    const userId = JSON.parse(<string>localStorage.getItem('user'))?.id;
    const rawResponse = await fetch(`${BASE_URL}users/${userId}/statistics`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    return rawResponse.json();
  },

  async setUsersStat(stats: IUsersStats): Promise<void> {
    const token = JSON.parse(<string>localStorage.getItem('user'))?.token;
    const userId = JSON.parse(<string>localStorage.getItem('user'))?.id;
    const rawResponse = await fetch(`${BASE_URL}users/${userId}/statistics`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stats),
    });
    return rawResponse.json();
  },
};

export default wordsStatsResource;
