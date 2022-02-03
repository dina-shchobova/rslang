const url = 'https://rs-learnwords.herokuapp.com';
const path = {
  user: `${url}/users`,
  signin: `${url}/signin`,
};

type UserData = {
  name: string,
  email: string,
  password: string
};

type SignIn = {
  email: string,
  password: string
};

type ResNewUser = {
  id: string,
  name: string,
  email: string
};

type ResSignIn = {
  message: string,
  name: string,
  refreshToken: string,
  token: string,
  userId: string
};

export const createNewUser = async (body: UserData): Promise<ResNewUser> => {
  const response = await fetch(path.user, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const content = await response.json();
  return content;
};

export const signin = async (body: SignIn): Promise<ResSignIn> => {
  const response = await fetch(path.signin, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const content = await response.json();
  return content;
};
