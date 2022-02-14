import wordsStatsResource from './wordsStatsResource';
import { GameName, MiniGameStats } from '../sprint/script/dataTypes';

function getFormattedTodayDate() {
  const d = new Date(2010, 7, 5);
  const year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
  const month = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
  const day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
  return `${year}.${month}.${day}`; // для облегчения сортировки
}

const WordStatToday = {
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
    const usersStat = await wordsStatsResource.getUsersStat();
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
    return wordsStatsResource.setUsersStat(usersStat);
  },
};

const WordsStatLongTerm = {
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
    const wordInList = await wordsStatsResource.checkWordIsInUserWordsList(wordId);
    if (wordInList) {
      wordInList.optional.countRightAnswersInRow += 1;
      if (wordInList.optional.countRightAnswersInRow >= 3) {
        wordInList.optional.isLearned = true;
        wordInList.difficulty = 'weak';
      }
      wordsStatsResource.updateWordInUsersWordsList(wordInList);
      return false;
    }
    wordsStatsResource.addWordToUsersList(wordId, 1);
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
