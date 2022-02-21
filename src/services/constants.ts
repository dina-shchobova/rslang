export const BASE_URL = 'https://rs-learnwords.herokuapp.com/';

function getFormattedTodayDate() {
  const d = new Date();
  const year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
  const month = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
  const day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
  return `${year}.${month}.${day}`; // для облегчения сортировки
}

export { getFormattedTodayDate };
