import { Quiz } from "../model/quiz.js";
import { Answer } from "../model/answer.js";
import { Player } from "../model/player.js";
import { Question } from "../model/question.js";
import { WsApi } from "../api/ws.js";

export class GameController {
  constructor(quizData) {
    this.quiz = new Quiz(quizData);
    this.questionTimeout = undefined;
    this.passedTime = 0;
  };

  /**
   * Get the quiz overview.
   * 
   * @return {Object} An overview of the quiz.
   */
  getQuiz = () => {
    let prevQuestion = "";
    let curQuestion = "";

    if (this.quiz.currentQuestion < 0) {
      prevQuestion = "The quiz has not yet started";
      curQuestion = "The quiz has not yet started";
    } else if (this.quiz.currentQuestion == 0) {
      prevQuestion = "The quiz is only at the first question";
      curQuestion = this.quiz.questions[this.quiz.currentQuestion].toJS();
    } else if (this.quiz.currentQuestion >= this.quiz.questions.length) {
      prevQuestion = this.quiz.questions[this.quiz.questions.length - 1].toJS(true);
      curQuestion = "The quiz has finished";
    } else {
      prevQuestion = this.quiz.questions[this.quiz.currentQuestion - 1].toJS(true);
      curQuestion = this.quiz.questions[this.quiz.currentQuestion].toJS();
    }

    return {
      title: this.quiz.title,
      rankingMechanism: this.quiz.rankingMechanism.description,
      previousQuestion: prevQuestion,
      currentQuestion: curQuestion,
      stats: {
        prizes: this.quiz.prizes.length,
        players: this.quiz.players.length,
        questions: this.quiz.questions.length
      }
    }
  };

  /**
   * Go to the next question. If the quiz has not yet started this function will start the quiz. If 
   * the quiz has ended this function is a no-op.
   * 
   * @return {Question} The question to which the quiz has advanced.
   */
  nextQuestion = async () => {
    /* Clear the timeout of the current question */
    if (this.questionTimeout != undefined) {
      clearTimeout(this.questionTimeout);
      this.questionTimeout = undefined;
    }

    if (this.quiz.currentQuestion + 1 >= this.quiz.questions.length) {
      console.log('There is no next question, the quiz is finished');
      this.quiz.currentQuestion += 1;
      WsApi.get().emitQuestionsFinished();
      return {
        status: "The quiz has finished"
      };
    }

    /* Increase the id of the current question and search the object */
    this.quiz.currentQuestion += 1;
    const question = this.quiz.questions.find(question => question.id == this.quiz.currentQuestion);
    if (question == undefined) {
      console.warn('The next question is undefined, cannot start timer');
      return {
        status: "Next question is undefined"
      };
    }

    /* Start a timer if this is a timed question */
    if (question.time > 0) {
      this.passedTime = 0;

      const handleQuestionTimerTick = async () => {
        this.passedTime += 1;
        const finished = this.passedTime >= question.time;

        let answer = undefined;
        if(finished) {
          answer = await question.getAnswer();
        }

        WsApi.get().emitQuestionTick(question.id, this.passedTime, question.time, finished, answer);

        if(!finished) {
          this.questionTimeout = setTimeout(handleQuestionTimerTick, 1000);
        }
      };

      this.questionTimeout = setTimeout(handleQuestionTimerTick, 1000);
    }

    const res = question.toJS();
    WsApi.get().emitNextQuestion(res);
    return res;
  };

  /**
   * Go to the start of the quiz and reset the answers of all players.
   */
  resetQuiz = () => {
    if(this.questionTimeout) {
      clearTimeout(this.questionTimeout);
      this.questionTimeout = undefined;
    }

    this.quiz.currentQuestion = -1;

    this.quiz.players.forEach(player => {
      player.resetAnswers();
    });
    this.quiz.players = new Array();

    this.quiz.questions.forEach(question => {
      question.stats.reset();
    });

    console.log('The quiz has been reset');
    WsApi.get().emitResetQuiz();
  };

  /**
   * Post an answer for a player.
   * 
   * @param {String} id The id of the player that gave the answer.
   * @param {String} token The security token which authenticates the player.
   * @param {Number} questionId The id of the question that is answered.
   * @param {Number} answer The answer to the question.
   * 
   * @return The player or undefined when the player wasn't found.
   */
  processAnswer = async (id, token, questionId, answer) => {
    if (this.quiz.currentQuestion < 0) {
      console.warn('Could not process answer because the quiz has not yet started');
      return undefined;
    }

    const player = this.quiz.players.find(player => player.id == id);
    if (player == undefined) {
      console.warn(`No player with id ${id} found, could not process answer`);
      return undefined;
    }

    if (player.token != token) {
      console.warn(`Player ${player.name} could not answer due to wrong token`);
      return undefined;
    }

    if (player.answers.find(answer => answer.question == questionId) != undefined) {
      console.warn(`Player ${player.name} already answered question ${questionId}`);
      return undefined;
    }

    const question = this.quiz.questions.find(question => question.id == questionId);
    if (question == undefined) {
      console.warn(`Cannot process answer for unknown question ${questionId}`);
      return undefined;
    }

    const result = await question.getResult(answer);

    player.answers.push(new Answer(questionId, question.type, answer, result, true));
    console.info(`Player ${player.name} answered ${answer} to question ` +
      `${questionId} with result ${result}`);

    return player;
  };

  /**
   * Add a player to the quiz.
   * 
   * @param {String} name The name of the new player or undefined to generate one.
   * 
   * @return {Player} The player that was added to the quiz or undefined if the name is already 
   * in use.
   */
  addPlayer = (name) => {
    if (name != undefined && this.quiz.players.find(player => player.name == name) != undefined) {
      return undefined;
    }

    // The while loop generates a player until the name is unique
    let player = new Player(name);
    while (this.quiz.players.find(player => player.name == name) != undefined) {
      player = new Player(name);
    }

    this.quiz.players.push(player);
    return player;
  };

  /**
   * Remove a player from the quiz.
   * 
   * @param {String} id The id of the player to remove.
   * 
   * @return {Player} The player that was removed or undefined when the player doesn't exist.
   */
  removePlayer = (id) => {
    const index = this.quiz.players.findIndex(player => player.id === id);
    return index >= 0 ? this.quiz.players.splice(index, 1)[0] : undefined;
  };

  /**
   * Rank the players with the winning player at index 0. This function will use the multiple choice
   * first and value second ranking mechanism. This means that players are first ranked based on the
   * amount of correctly answered multiple choice questions. In the second step players are ranked 
   * using the value questions, meaning the value questions are effectively used as tie-break 
   * questions. It is therefore assumed that there are no value questions before multiplechoice 
   * questions in the quiz data.
   * 
   * Scores on a question are normalized between [0, 100]:
   *  - For multiple-choice: 0 is wrong, 100 is right
   *  - For value questions: The player that answered with the value closest to the right value gets
   *    100 and the player that answered with the value the most different from the right value gets
   *    0. 
   * 
   * This way we can combine multiple value questions.
   * 
   * @return {Array} An array of all players ranked with the winning player at index 0. 
   */
  rankPlayersMultiplechoiceFirstValueSecond = async () => {
    /* Reset the player ranking */
    this.quiz.players.forEach(player => {
      player.ranking = 0;
    });

    for (const question of this.quiz.questions) {
      /* Only rank questions that are already asked */
      if (question.id >= this.quiz.currentQuestion) {
        console.log(`Skipping question ${question.id} for ranking as it is not already answered`);
        continue;
      }

      /* Calculate the statistics for the questions */
      const answerValue = await question.getAnswer();
      question.stats.reset();

      this.quiz.players.forEach(player => {
        question.stats.totalPlayers += 1;

        const answer = player.answers.find(answer => answer.question == this.quiz.currentQuestion);
        if (answer == undefined) {
          //player.answers.push(new Answer(this.quiz.currentQuestion, question.type, -1, false, false));
          question.stats.unanswered += 1;
        } else {
          question.stats.answered += 1;

          switch (question.type) {
            case Question.TYPE.MULTIPLECHOICE:
              if (answer.result) {
                question.stats.correct += 1;
              } else {
                question.stats.wrong += 1;
              }
              break;

            case Question.TYPE.VALUE:
              question.stats.average += answer.answer;

              if (answerValue != undefined) {
                const diff = Math.abs(answer.answer - answerValue);

                if (question.stats.worstAnswer == undefined) {
                  question.stats.worstAnswer = answer.answer;
                } else {
                  const worstDiff = Math.abs(question.stats.worstAnswer - answerValue);
                  if (diff > worstDiff) {
                    question.stats.worstAnswer = answer.answer;
                    question.stats.worstDiff = answer.diff;
                  }
                }

                if (question.stats.bestAnswer == undefined) {
                  question.stats.bestAnswer = answer.answer;
                } else {
                  const bestDiff = Math.abs(question.stats.bestAnswer - answerValue);
                  if (diff < bestDiff) {
                    question.stats.bestAnswer = answer.answer;
                    question.stats.bestDiff = diff;
                  }
                }
              }
              break;
          }
        }
      });

      /* Perform ranking of the question for each player */
      for (const player of this.quiz.players) {
        const answer = player.answers.find(answer => answer.question == question.id);
        if (answer != undefined) {
          if (answer.type === Question.TYPE.MULTIPLECHOICE && answer.answered && answer.result) {
            player.ranking += 100;
          } else if (answer.type === Question.TYPE.VALUE && answer.answered) {
            player.ranking += await question.getValueRanking(answer.answered);
          }
        }
      }
    }

    return this.quiz.players.slice().sort((a, b) => b.ranking - a.ranking)
      .map(player => player.toJS());
  };

  /**
   * Rank the players with the winning player at index 0.
   * 
   * @return {Array} An array of all players ranked with the winning player at index 0.
   */
  rankPlayers = async () => {
    switch (this.quiz.rankingMechanism) {
      case Quiz.RANKING_MECHANISM.MULTIPLECHOICE_FIRST_VALUE_SECOND:
      default:
        const ranking = await this.rankPlayersMultiplechoiceFirstValueSecond();
        WsApi.get().emitRanking(ranking);
        return ranking;
    }
  };
}