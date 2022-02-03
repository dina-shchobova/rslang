import './authorization.scss';
import { createNewUser, signin } from './services';

const htmlCodeAuthorization = `
  <div class="header-authorization">
      <div class="title title-authorization title-active">Регистрация</div>
      <div class="title title-login">Вход</div>
  </div>
  <div class="form-field authorization form-active">
    <div class="input-wrap">
      <input name="name" class="name input" type="text" placeholder="Имя" required>
      <span class="error">Имя должно содержать минимум 4 символа</span>
    </div>
    <div class="input-wrap">
      <input name="email" class="email input" type="email" placeholder="E-mail" required>
      <span class="error">Некоректный адрес электронной почты</span>
    </div>
    <div class="input-wrap">
      <input name="password" class="password input" type="password" placeholder="Пароль" minlength="8" required>
      <span class="error">Пароль должен содержать не менее 8 символов</span>
    </div>
  <button class="create-account">Создать аккаунт</button>
  </div>
  <div class="form-field login">
    <div class="input-wrap">
      <input name="email" class="email email-login input" type="email" placeholder="E-mail" required>
      <span class="error">Некоректный адрес электронной почты</span>
    </div>
    <div class="input-wrap">
      <input name="password" class="password password-login input" type="password" placeholder="Пароль"
      minlength="8" required>
      <span class="error">Пароль должен содержать не менее 8 символов</span>
    </div>
  <button class="button-login">Войти</button>
  </div>
`;

export class Authorization {
  createFieldAuthorization(): void {
    const body = document.querySelector('body') as HTMLElement;
    const authorizationElement = document.createElement('div');
    authorizationElement.classList.add('authorization-wrap');
    authorizationElement.innerHTML = htmlCodeAuthorization;

    body.appendChild(authorizationElement);
    this.switchForm();
    this.createUser();
    this.loginUser();
  }

  switchForm = (): void => {
    const authorization = document.querySelector('.authorization') as HTMLElement;
    const login = document.querySelector('.login') as HTMLElement;
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
    const name = document.querySelector('.name') as HTMLInputElement;
    const email = document.querySelector('.email') as HTMLInputElement;
    const password = document.querySelector('.password') as HTMLInputElement;

    buttonCreate.addEventListener('click', async () => {
      const userName = name.value;
      const userEmail = email.value;
      const userPassword = password.value;

      await createNewUser({ name: userName, email: userEmail, password: userPassword });
      await this.logIn(userEmail, userPassword);
    });
  }

  loginUser(): void {
    const buttonLogin = document.querySelector('.button-login') as HTMLElement;
    const email = document.querySelector('.email') as HTMLInputElement;
    const password = document.querySelector('.password') as HTMLInputElement;

    buttonLogin.addEventListener('click', async () => {
      const userEmail = email.value;
      const userPassword = password.value;
      await this.logIn(userEmail, userPassword);
    });
  }

  logIn = async (userEmail: string, userPassword: string): Promise<void> => {
    const user = await signin({ email: userEmail, password: userPassword });
    localStorage.setItem(user.name, JSON.stringify({ name: user.name, id: user.userId, token: user.token }));
  };
}
