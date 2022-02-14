import { getUserWords } from './services';

let currentAmount = 0;

export class CountNewWords {
  private userId: string;

  constructor() {
    this.userId = JSON.parse(<string>localStorage.getItem('user'))?.userId;
  }

  countCurrentWords = async (): Promise<number> => {
    const res = await getUserWords(this.userId);
    currentAmount = res.length;
    return currentAmount;
  };

  countNewWords = async (): Promise<number> => getUserWords(this.userId)
    .then((res) => res.length - currentAmount);
}
