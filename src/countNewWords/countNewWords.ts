import { getUserWords } from './services';

let currentAmount = 0;

export class CountNewWords {
  private userId: string;

  constructor() {
    this.userId = JSON.parse(<string>localStorage.getItem('user'))?.userId;
  }

  countCurrentWords = async (): Promise<void> => {
    await getUserWords(this.userId)
      .then((res) => {
        currentAmount = res.length;
      });
  };

  countNewWords = async (): Promise<number> => getUserWords(this.userId)
    .then((res) => res.length - currentAmount);
}
