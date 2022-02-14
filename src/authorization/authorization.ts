import './authorization.scss';
import { signin } from './services';
import { htmlCodeAuthorization, htmlCodeLogout } from './createFieldAuthorization';
import { getStat, saveStat } from '../statistic/services';
import { statistics, SaveStatistics } from '../statistic/saveStatistics';

const path = {
  user: 'https://rs-learnwords.herokuapp.com/users',
  signin: 'https://rs-learnwords.herokuapp.com/signin',
};

let userAuthorized = localStorage.getItem('userAuthorized') || false;

export class Authorization {
  private saveStatistics: SaveStatistics;

  constructor() {
    this.saveStatistics = new SaveStatistics();
  }

  async createFieldAuthorization(): Promise<void> {
    const main = document.querySelector('main') as HTMLElement;
    const login = document.querySelector('.login') as HTMLElement;
    const authorizationTitle = document.createElement('div');
    const authorizationWrap = document.createElement('div');
    const authorizationElement = document.createElement('div');

    authorizationTitle.classList.add('title');
    authorizationWrap.classList.add('authorization-container');
    authorizationElement.classList.add('authorization-wrap');
    authorizationTitle.innerHTML = 'Авторизация';
    authorizationElement.innerHTML = !userAuthorized ? htmlCodeAuthorization : htmlCodeLogout;
    authorizationWrap.append(authorizationTitle, authorizationElement);
    main.append(authorizationWrap);

    this.logOut();
    await this.checkIfUserIsLoggedIn();
    if (userAuthorized) {
      login.classList.add('logout');
      return;
    }

    this.showFieldAuthorization();
    this.switchForm();
    this.createUser();
    this.loginUser();
  }

  showUserStatistics = async (): Promise<void> => {
    const { userId } = JSON.parse(<string>localStorage.getItem('user'));
    const statistic = await getStat(userId);
    localStorage.setItem('statistics', JSON.stringify(statistic.optional.statistics));
    await this.saveStatistics.addTodayDate();
  };

  createUserStatistics = async (): Promise<void> => {
    // const keysStatistics = Object.keys(statistics);
    // keysStatistics.forEach((stat) => {
    //   const keys = Object.keys(statistics[stat][0]);
    //   keys.forEach((key) => {
    //     // @ts-ignore
    //     if (typeof statistics[stat][0][key] !== 'string') {
    //       // @ts-ignore
    //       statistics[stat][0][key] = 0;
    //     }
    //   });
    // });

    const userId = JSON.parse(<string>localStorage.getItem('user'))?.userId;
    return saveStat(userId, { learnedWords: 0, optional: { statistics } });
  };

  async checkIfUserIsLoggedIn(): Promise<void> {
    const name = localStorage.getItem('user name') as string;
    if (JSON.parse(<string>localStorage.getItem('userAuthorized'))) {
      await this.showUserName(name, 'login');
    }
  }

  showFieldAuthorization = (): void => {
    const loginIcon = document.querySelector('.login') as HTMLElement;
    const authorization = document.querySelector('.authorization-wrap') as HTMLElement;

    loginIcon.addEventListener('click', () => {
      authorization.classList.add('active-signin');
    });
  };

  switchForm = (): void => {
    const authorization = document.querySelector('.authorization') as HTMLElement;
    const login = document.querySelector('.signin') as HTMLElement;
    const titleAuthorization = document.querySelector('.title-authorization') as HTMLElement;
    const titleLogin = document.querySelector('.title-login') as HTMLElement;

    const toggleForm = (element: HTMLElement) => {
      element?.addEventListener('click', () => {
        element.classList.add('title-active');

        if (element === titleAuthorization) {
          authorization.classList.add('form-active');
          login.classList.remove('form-active');
          titleLogin.classList.remove('title-active');
        } else {
          login.classList.add('form-active');
          authorization.classList.remove('form-active');
          titleAuthorization.classList.remove('title-active');
        }
      });
    };

    toggleForm(titleAuthorization);
    toggleForm(titleLogin);
  };

  createUser(): void {
    const buttonCreate = document.querySelector('.create-account') as HTMLElement;
    const name = document.getElementById('name') as HTMLInputElement;
    const email = document.getElementById('email') as HTMLInputElement;
    const password = document.getElementById('password') as HTMLInputElement;

    buttonCreate?.addEventListener('click', async () => {
      const userName = name.value;
      const userEmail = email.value;
      const userPassword = password.value;

      if (!userName || !userEmail || !userPassword) return;
      await signin({ name: userName, email: userEmail, password: userPassword }, path.user);
      await this.logIn(userEmail, userPassword, 'createUser')
        .then(async () => {
          // await this.createUserStatistics();
          // await this.showUserStatistics();
        });
      name.value = ''; email.value = ''; password.value = '';
    });
  }

  loginUser(): void {
    const buttonLogin = document.querySelector('.button-login') as HTMLElement;
    const email = document.getElementById('signin-email') as HTMLInputElement;
    const password = document.getElementById('signin-password') as HTMLInputElement;

    buttonLogin.addEventListener('click', async () => {
      const userEmail = email.value;
      const userPassword = password.value;
      await this.logIn(userEmail, userPassword);
      email.value = ''; password.value = '';
    });
  }

  logIn = async (userEmail: string, userPassword: string, state = 'login'): Promise<void> => {
    if (!userEmail || !userPassword) return;
    await signin({ email: userEmail, password: userPassword }, path.signin)
      .then((res) => {
        const login = document.querySelector('.login') as HTMLElement;
        userAuthorized = true;
        login.classList.add('logout');
        localStorage.setItem('userAuthorized', JSON.stringify(userAuthorized));
        localStorage.setItem('user', JSON.stringify(res));
        this.showUserName(`${res.name}`, state);
      });
  };

  logOut = (): void => {
    if (!userAuthorized) return;
    const logout = document.querySelector('.button-logout') as HTMLElement;
    const login = document.querySelector('.login') as HTMLElement;

    logout.addEventListener('click', () => {
      const lastUser = document.querySelector('.user-name') as HTMLElement;
      lastUser.innerHTML = '';
      ['user', 'user name', 'userAuthorized', 'statistics'].forEach((item) => localStorage.removeItem(item));
      userAuthorized = false;
      login.classList.remove('logout');
    });
  };

  showUserName = async (name: string, state: string): Promise<void> => {
    const userName = document.querySelector('.user-name') as HTMLElement;
    userName.innerHTML = name;
    localStorage.setItem('user name', name);
    // if (state === 'login') await this.showUserStatistics();
  };
}
