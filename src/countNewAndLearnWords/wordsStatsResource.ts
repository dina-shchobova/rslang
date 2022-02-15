import { IUsersStats, UserWord } from '../sprint/script/dataTypes';
import { BASE_URL } from '../services/constants';
import { Authorization } from '../authorization/authorization';

const wordsStatsResource = {

  async updateToken(): Promise<void> {
    const user = JSON.parse(<string>localStorage.getItem('user'));
    const refreshToken = JSON.parse(<string>localStorage.getItem('user'))?.refreshToken;
    const rawResponse = await fetch(`${BASE_URL}users/${user.userId}/tokens`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${refreshToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    if (rawResponse.ok) {
      const response = await rawResponse.json();
      user.token = response.token;
      user.refreshToken = response.refreshToken;
      localStorage.setItem('user', JSON.stringify(user));
    }
    if (rawResponse.status === 403) {
      const login = document.querySelector('.login') as HTMLElement;
      login.classList.remove('logout');
      ['user', 'userAuthorized', 'user name'].forEach((item) => localStorage.removeItem(item));
      await new Authorization().checkIfUserIsLoggedIn();
      return undefined;
    }
    return undefined;
  },

  // проверка есть ли слово в списке пользователя
  async checkWordIsInUserWordsList(wordId: string): Promise<UserWord | undefined> {
    const token = JSON.parse(<string>localStorage.getItem('user'))?.token;
    const userId = JSON.parse(<string>localStorage.getItem('user'))?.userId;
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
    if (rawResponse.status === 401) {
      await this.updateToken();
    }
    if (rawResponse.status === 404) {
      return undefined;
    } // TODO: process no auth error?
    return undefined;
  },

  // обновить кол-во правильных ответов на слове в долгосрочной статитстике
  async updateWordInUsersWordsList(word: UserWord): Promise<UserWord> {
    const token = JSON.parse(<string>localStorage.getItem('user'))?.token;
    const userId = JSON.parse(<string>localStorage.getItem('user'))?.userId;
    const rawResponse = await fetch(`${BASE_URL}users/${userId}/words/${word.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(word),
    });
    if (rawResponse.status === 401) {
      await this.updateToken();
    }
    return rawResponse.json();
  },

  // добавляем слов
  async addWordToUsersList(wordId: string, countRightAnswersInRow = 0): Promise<UserWord | undefined> {
    const token = JSON.parse(<string>localStorage.getItem('user'))?.token;
    const userId = JSON.parse(<string>localStorage.getItem('user'))?.userId;

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
    if (rawResponse.status === 401) {
      await this.updateToken();
      return undefined;
    }
    return rawResponse.json();
  },

  async createUsersStat(): Promise<void> {
    const token = JSON.parse(<string>localStorage.getItem('user'))?.token;
    const userId = JSON.parse(<string>localStorage.getItem('user'))?.userId;
    const rawResponse = await fetch(`${BASE_URL}users/${userId}/statistics`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        learnedWords: 0,
        optional: {},
      }),
    });
    if (rawResponse.status === 401) {
      await this.updateToken();
    }
  },

  async getOrCreateUsersStat(): Promise<IUsersStats> {
    const token = JSON.parse(<string>localStorage.getItem('user'))?.token;
    const userId = JSON.parse(<string>localStorage.getItem('user'))?.userId;
    const rawResponse = await fetch(`${BASE_URL}users/${userId}/statistics`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    if (rawResponse.status === 401) {
      await this.updateToken();
    }
    if (rawResponse.status === 404) {
      await this.createUsersStat();
      const stats = await this.getOrCreateUsersStat();
      return stats;
    }
    return rawResponse.json();
  },

  async setUsersStat(stats: IUsersStats): Promise<void> {
    const token = JSON.parse(<string>localStorage.getItem('user'))?.token;
    const userId = JSON.parse(<string>localStorage.getItem('user'))?.userId;
    const rawResponse = await fetch(`${BASE_URL}users/${userId}/statistics`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stats),
    });
    if (rawResponse.status === 401) {
      await this.updateToken();
    }
    return rawResponse.json();
  },
};

export default wordsStatsResource;
