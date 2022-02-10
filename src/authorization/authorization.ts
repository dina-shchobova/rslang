import './authorization.scss';
import { signin } from './services';
import { htmlCodeAuthorization } from './createFieldAuthorization';

const path = {
  user: 'https://rs-learnwords.herokuapp.com/users',
  signin: 'https://rs-learnwords.herokuapp.com/signin',
};

let userAuthorized = localStorage.getItem('userAuthorized') || false;

export class Authorization {
  createFieldAuthorization(): void {
    const main = document.querySelector('main') as HTMLElement;
    const authorizationWrap = document.createElement('div');
    const authorizationElement = document.createElement('div');
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    authorizationWrap.classList.add('authorization-container');
    authorizationElement.classList.add('authorization-wrap');
    authorizationElement.innerHTML = htmlCodeAuthorization;

    authorizationWrap.append(overlay, authorizationElement);
    main.append(authorizationWrap);
    this.checkIfUserIsLoggedIn();
    this.showFieldAuthorization();
    this.switchForm();
    this.createUser();
    this.loginUser();
    this.logOut();
  }

  checkIfUserIsLoggedIn(): void {
    const name = localStorage.getItem('user name') as string;
    if (JSON.parse(<string>localStorage.getItem('userAuthorized'))) {
      this.showUserName(name);
    }
  }

  showFieldAuthorization = (): void => {
    const loginIcon = document.querySelector('.login') as HTMLElement;
    const overlay = document.querySelector('.overlay') as HTMLElement;
    const authorization = document.querySelector('.authorization-wrap') as HTMLElement;

    loginIcon.addEventListener('click', () => {
      overlay.classList.add('active-signin');
      authorization.classList.add('active-signin');
    });
  };

  switchForm = (): void => {
    const authorization = document.querySelector('.authorization') as HTMLElement;
    const login = document.querySelector('.signin') as HTMLElement;
    const titleAuthorization = document.querySelector('.title-authorization') as HTMLElement;
    const titleLogin = document.querySelector('.title-login') as HTMLElement;

    const toggleForm = (element: HTMLElement) => {
      element.addEventListener('click', () => {
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

    buttonCreate.addEventListener('click', async () => {
      const userName = name.value;
      const userEmail = email.value;
      const userPassword = password.value;

      if (!userName || !userEmail || !userPassword) return;
      await signin({ name: userName, email: userEmail, password: userPassword }, path.user);
      await this.logIn(userEmail, userPassword);
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

  logIn = async (userEmail: string, userPassword: string): Promise<void> => {
    if (!userEmail || !userPassword) return;
    const user = await signin({ email: userEmail, password: userPassword }, path.signin);
    this.showUserName(`${user.name}`);
    userAuthorized = true;
    localStorage.setItem('userAuthorized', JSON.stringify(userAuthorized));
    localStorage.setItem('user', JSON.stringify(user));
  };

  logOut = (): void => {
    if (!userAuthorized) return;
    const logout = document.querySelector('.button-logout') as HTMLElement;
    logout.addEventListener('click', () => {
      const lastUser = document.querySelector('.user-name') as HTMLElement;
      lastUser.innerHTML = '';
      ['user', 'user name', 'userAuthorized'].forEach((item) => localStorage.removeItem(item));
      userAuthorized = false;
    });
  };

  showUserName = (name: string): void => {
    const userName = document.querySelector('.user-name') as HTMLElement;
    userName.innerHTML = name;
    localStorage.setItem('user name', name);
  };
}
