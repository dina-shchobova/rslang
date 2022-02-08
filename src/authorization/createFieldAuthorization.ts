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
      <div class="title title-authorization">Регистрация</div>
      <div class="title title-login title-active">Вход</div>
  </div>
  <div class="form-field authorization">
    ${createInput('name', 'Имя', 'Имя должно содержать минимум 4 символа',
    '^[A-Za-zА-Яа-яЁё0-9\\s]{4,}', 'name')}
    ${createInput('email', 'E-mail', 'Некоректный адрес электронной почты',
    '^[\\w-]{1,}@[a-z]{1,}\\.[a-z]{2,}', 'email')}
    ${createInput('password', 'Пароль', 'Пароль должен содержать не менее 8 символов',
    '.{8,}', 'password')}
    <button class="create-account">Создать аккаунт</button>
  </div>
  <div class="form-field signin form-active">
    ${createInput('email', 'E-mail', 'Некоректный адрес электронной почты',
    '^[\\w-]{1,}@[a-z]{1,}\\.[a-z]{2,}', 'signin-email')}
    ${createInput('password', 'Пароль', 'Пароль должен содержать не менее 8 символов',
    '.{8,}', 'signin-password')}
    <button class="button-login">Войти</button>
    <button class="button-logout">Выйти</button>
  </div>
`;
