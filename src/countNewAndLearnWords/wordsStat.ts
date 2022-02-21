import wordsStatsResource from './wordsStatsResource';
import { GameName, MiniGameStats, UserWord } from '../sprint/script/dataTypes';
import { getFormattedTodayDate } from '../services/constants';

const wordStatToday = {
  async updateTodayGameStatOnGameFinish(
    gameName: GameName,
    maxSeries: number,
    correctAnswers: number,
    incorrectAnswers: number,
    newWords: number,
  ): Promise<void> {
    // 1) подтягиваем статистику пользователя
    // 2) проверяем есть ли сегодняшний день, если нет то создаем с нулями
    // 3) обновляем данные по игре
    if (localStorage.getItem('userAuthorized') !== 'true') {
      return;
    }
    const usersStat = await wordsStatsResource.getOrCreateUsersStat();
    if ('id' in usersStat) {
      delete usersStat.id;
    }
    if (!usersStat.optional) {
      usersStat.optional = {};
    }
    if (!usersStat.optional.miniGames) {
      usersStat.optional.miniGames = {};
    }
    if (!usersStat.optional.miniGames[gameName]) {
      usersStat.optional.miniGames[gameName] = [];
    }
    const gameStatRecords: MiniGameStats[] = usersStat.optional.miniGames[gameName] || [];
    let currentDayRecord: MiniGameStats | undefined;
    gameStatRecords.forEach((gameStatRecord) => {
      if (gameStatRecord.date === getFormattedTodayDate()) {
        currentDayRecord = gameStatRecord;
      }
    });
    if (!currentDayRecord) {
      currentDayRecord = {
        date: getFormattedTodayDate(),
        newWords: 0,
        correctAnswers: 0,
        incorrectAnswers: 0,
        maxSeries: 0,
      };
      gameStatRecords.push(currentDayRecord);
    }
    currentDayRecord.newWords += newWords;
    currentDayRecord.incorrectAnswers += incorrectAnswers;
    currentDayRecord.correctAnswers += correctAnswers;
    currentDayRecord.maxSeries = Math.max(currentDayRecord.maxSeries, maxSeries);
    wordsStatsResource.setUsersStat(usersStat);
  },
};

const wordsStatLongTerm = {
  async wordAnsweredCorrectlyInGame(wordId: string): Promise<boolean> {
    // 1) проверяем есть ли слово в списке пользовательских
    // 2) если да, то
    // 2.1) в долгосрочной статистике:
    // 2.1.1) обновляем кол-во правильных ответов на нем
    // 2.1.2) если их больше 3, то помечаем как изученное и ставим difficulty = weak
    // 3) если нет, то
    // 3.1) в долгосрочной статистике:
    // 3.1.1) добавляем слово
    // 3.1.2) количество правильных ответов ставим 1
    // Метод возвращает true если слово новое
    if (localStorage.getItem('userAuthorized') !== 'true') {
      return false;
    }
    const wordInList = await wordsStatsResource.checkWordIsInUserWordsList(wordId);
    if (wordInList) {
      wordInList.optional.countRightAnswersInRow += 1;
      if ((wordInList.difficulty === 'weak' && wordInList.optional.countRightAnswersInRow >= 3)
        || (wordInList.difficulty === 'hard' && wordInList.optional.countRightAnswersInRow >= 5)) {
        wordInList.optional.isLearned = true;
        wordInList.optional.dateLearned = getFormattedTodayDate();
        wordInList.difficulty = 'weak';
      }
      if (!wordInList.optional.progress) {
        wordInList.optional.progress = {
          right: 0,
          wrong: 0,
        };
      }
      wordInList.optional.progress.right += 1;
      wordsStatsResource.updateWordInUsersWordsList(wordInList);
      return false;
    }
    wordsStatsResource.addWordToUsersList(wordId, 1, false, 'weak', 1);
    return true;
  },

  async wordAnsweredIncorrectlyInGame(wordId: string): Promise<boolean> {
    // 1) проверяем есть ли слово в списке пользовательских
    // 2) если да, то
    // 2.1) в долгосрочной статистике:
    // 2.1.1) обнуляем кол-во правильных ответов на нем
    // 2.1.2) если маркировано выученным, размаркировываем
    // 3) если нет, то
    // 3.1) в долгосрочной статистике:
    // 3.1.1) добавляем слово с колв-ом правильных = 0
    // Метод возвращает true если слово новое
    if (localStorage.getItem('userAuthorized') !== 'true') {
      return false;
    }
    const wordInList = await wordsStatsResource.checkWordIsInUserWordsList(wordId);
    if (wordInList) {
      wordInList.optional.countRightAnswersInRow = 0;
      wordInList.optional.isLearned = false;
      wordInList.optional.dateLearned = undefined;
      if (!wordInList.optional.progress) {
        wordInList.optional.progress = {
          right: 0,
          wrong: 0,
        };
      }
      wordInList.optional.progress.wrong += 1;
      wordsStatsResource.updateWordInUsersWordsList(wordInList);
      return false;
    }
    wordsStatsResource.addWordToUsersList(wordId, 0, false, 'weak', 0, 1);
    return true;
  },

  async markWordAsLearned(wordId: string): Promise<void> {
    // только для явного вызова из словаря.
    // маркируем как выученное. кол-во ответов игнорируем
    if (localStorage.getItem('userAuthorized') !== 'true') {
      return;
    }
    const wordInList = await wordsStatsResource.checkWordIsInUserWordsList(wordId);
    if (wordInList) {
      wordInList.optional.isLearned = true;
      wordInList.optional.dateLearned = getFormattedTodayDate();
      wordInList.difficulty = 'weak';
      wordsStatsResource.updateWordInUsersWordsList(wordInList);
    } else {
      wordsStatsResource.addWordToUsersList(wordId, 0, true, 'weak');
    }
  },

  async markWordAsHard(wordId: string): Promise<void> {
    // только для явного вызова из словаря.
    // маркируем как сложное.
    if (localStorage.getItem('userAuthorized') !== 'true') {
      return;
    }
    const wordInList = await wordsStatsResource.checkWordIsInUserWordsList(wordId);
    if (wordInList) {
      wordInList.optional.isLearned = false;
      delete wordInList.optional.dateLearned;
      wordInList.difficulty = 'hard';
      wordsStatsResource.updateWordInUsersWordsList(wordInList);
    }
    wordsStatsResource.addWordToUsersList(wordId, 0, false, 'hard');
  },

  async removeMarkWordAsHard(wordId: string): Promise<void> {
    // только для явного вызова из страницы сложных слов.
    // маркируем как легкое.
    if (localStorage.getItem('userAuthorized') !== 'true') {
      return;
    }
    const wordInList = await wordsStatsResource.checkWordIsInUserWordsList(wordId) as UserWord;
    wordInList.difficulty = 'weak';
    wordsStatsResource.updateWordInUsersWordsList(wordInList);
  },
};

export { wordsStatLongTerm, wordStatToday };
