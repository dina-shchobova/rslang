import wordsStatsResource from './wordsStatsResource';
import { GameName, MiniGameStats } from '../sprint/script/dataTypes';
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
    if (localStorage.getItem('userAuthorized') !== 'true') {
      return false;
    }
    const wordInList = await wordsStatsResource.checkWordIsInUserWordsList(wordId);
    if (wordInList) {
      wordInList.optional.countRightAnswersInRow += 1;
      if (wordInList.optional.countRightAnswersInRow >= 3) {
        wordInList.optional.isLearned = true;
        wordInList.optional.dateLearned = getFormattedTodayDate();
        wordInList.difficulty = 'weak';
      }
      wordsStatsResource.updateWordInUsersWordsList(wordInList);
      return false;
    }
    wordsStatsResource.addWordToUsersList(wordId, 1);
    return true;
  },

  async wordAnsweredIncorrectlyInGame(wordId: string): Promise<boolean> {
    if (localStorage.getItem('userAuthorized') !== 'true') {
      return false;
    }
    const wordInList = await wordsStatsResource.checkWordIsInUserWordsList(wordId);
    if (wordInList) {
      wordInList.optional.countRightAnswersInRow = 0;
      wordInList.optional.isLearned = false;
      wordInList.optional.dateLearned = undefined;
      wordsStatsResource.updateWordInUsersWordsList(wordInList);
      return false;
    }
    wordsStatsResource.addWordToUsersList(wordId, 0);
    return true;
  },

  markWordAsLearned(wordId: string) {
    // только для явного вызова из словаря.
    // маркируем как выученное. кол-во ответов игнорируем
  },

  markWordAsHard(wordId: string) {
    // только для явного вызова из словаря.
    // маркируем как сложное.
  },
};

export { wordsStatLongTerm, wordStatToday };
