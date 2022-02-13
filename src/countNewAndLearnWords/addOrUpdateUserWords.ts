import { createUserWord, getUserWord, updateUserWords } from './services';

export class AddOrUpdateUserWords {
  private userId: string;

  constructor() {
    this.userId = JSON.parse(<string>localStorage.getItem('user'))?.userId;
  }

  addUserWords = async (wordId: string) => {
    if (this.userId) {
      await createUserWord(this.userId, wordId, {
        difficulty: 'weak',
        optional: { isTest: true, countRightAnswers: 0 },
      });
    }
  };

  updateWords = async (wordId: string, typeAnswer: boolean) => {
    await getUserWord(this.userId, wordId)
      .then(async (res) => {
        let { countRightAnswers } = res.optional;
        if (res.optional.isTest) {
          if (typeAnswer) {
            if (countRightAnswers < 3) {
              countRightAnswers++;
            }
          } else {
            countRightAnswers = 0;
          }
        }

        return updateUserWords(this.userId, wordId, {
          difficulty: 'weak',
          optional: { isTest: true, countRightAnswers },
        });
      })
      .catch((err) => Error(err));
  };
}
