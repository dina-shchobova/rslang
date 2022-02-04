import './authorization.scss';
import { signin } from './services';

const path = {
  user: 'https://rs-learnwords.herokuapp.com/users',
  signin: 'https://rs-learnwords.herokuapp.com/signin',
};

function createInput(inputType: string, placeholder: string, textError: string, pattern: string, id: string) {
  return `
    <div class="input-wrap">
      <input id=${id} name=${inputType} class="${inputType} input" type=${inputType} placeholder=${placeholder}
             pattern=${pattern} required>
      <span class="error">${textError}</span>
    </div>
  `;
}

export const htmlCodeAuthorization = `
  <div class="header-authorization">
      <div class="title title-authorization title-active">Регистрация</div>
      <div class="title title-login">Вход</div>
  </div>
  <div class="form-field authorization form-active">
    ${createInput('name', 'Имя', 'Имя должно содержать минимум 4 символа',
    '^[A-Za-zА-Яа-яЁё0-9\\s]{4,}', 'name')}
    ${createInput('email', 'E-mail', 'Некоректный адрес электронной почты',
    '^[\\w-]{1,}@[a-z]{1,}\\.[a-z]{2,}', 'email')}
    ${createInput('password', 'Пароль', 'Пароль должен содержать не менее 8 символов',
    '.{8,}', 'password')}
    <button class="create-account">Создать аккаунт</button>
  </div>
  <div class="form-field login">
    ${createInput('email', 'E-mail', 'Некоректный адрес электронной почты',
    '^[\\w-]{1,}@[a-z]{1,}\\.[a-z]{2,}', 'signin-email')}
    ${createInput('password', 'Пароль', 'Пароль должен содержать не менее 8 символов',
    '.{8,}', 'signin-password')}
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
    const name = document.getElementById('name') as HTMLInputElement;
    const email = document.getElementById('email') as HTMLInputElement;
    const password = document.getElementById('password') as HTMLInputElement;

    buttonCreate.addEventListener('click', async () => {
      const userName = name.value;
      const userEmail = email.value;
      const userPassword = password.value;

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
    const user = await signin({ email: userEmail, password: userPassword }, path.signin);
    localStorage.setItem(`${user.name}`, JSON.stringify({ name: user.name, id: user.userId, token: user.token }));
  };
}
