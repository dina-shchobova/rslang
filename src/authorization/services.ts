import { UserData } from './dataTypes';

export const signin = async (body: Partial<UserData>, path: string): Promise<Partial<UserData>> => {
  const response = await fetch(path, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  return response.json();
};
