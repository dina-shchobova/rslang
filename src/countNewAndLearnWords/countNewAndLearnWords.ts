import { getUserWords } from './services';
import { UserWords } from '../sprint/script/dataTypes';

let currentAmount = 0;
let learnedAmount = 0;

export class CountNewAndLearnWords {
  private userId: string;

  constructor() {
    this.userId = JSON.parse(<string>localStorage.getItem('user'))?.userId;
  }

  countCurrentWords = async (): Promise<[UserWords]> => getUserWords(this.userId)
    .then((res) => {
      currentAmount = res.length;
      return res;
    });

  countNewWords = async (): Promise<number> => getUserWords(this.userId)
    .then((res) => res.length - currentAmount);

  countLearnedWords = async (totalLearnedWords: number): Promise<number> => {
    const userWords = await getUserWords(this.userId);
    let learnedWords = 0;
    userWords.forEach((word) => {
      if (word.optional.countRightAnswers === 3) learnedWords++;
    });

    return this.countCurrentLearnedWords() + (learnedWords - totalLearnedWords);
  };

  countCurrentLearnedWords = (): number => {
    const { words } = JSON.parse(<string>localStorage.getItem('statistics'));
    const totalWords = words.length - 1;
    learnedAmount = words[totalWords].learnedWords;
    return learnedAmount;
  };
}
