const path = 'https://rs-learnwords.herokuapp.com/';

export const saveStat = async (userId: string, stat: object) => {
  const token = JSON.parse(<string>localStorage.getItem('user'))?.token;
  const rawResponse = await fetch(`${path}users/${userId}/statistics`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(stat),
  });
  return rawResponse.json();
};

export const getStat = async (userId: string) => {
  const token = JSON.parse(<string>localStorage.getItem('user'))?.token;
  const rawResponse = await fetch(`${path}users/${userId}/statistics`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  return rawResponse.json();
};
