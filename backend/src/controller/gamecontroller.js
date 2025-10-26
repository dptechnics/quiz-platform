import { Quiz } from "../model/quiz.js";
import { Answer } from "../model/answer.js";
import { Player } from "../model/player.js";
import { Question } from "../model/question.js";
import { WsApi } from "../api/ws.js";

export class GameController {
  constructor(quizData) {
    this.quiz = new Quiz(quizData);
    this.answerTimeout = undefined;
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
      openToAnswers: this.quiz.openToAnswers,
      stats: {
        prizes: this.quiz.prizes.length,
        players: this.quiz.players.length,
        questions: this.quiz.questions.length
      }
    }
  };

  /**
   * Finish the current question. If a player has not answered the current question this question
   * will be marked as unanswered for this player.
   * 
   * @return {Question} A POJO object containing the question, answers and answer statistics or
   * undefined when there was no question found.
   */
  finishQuestion = async () => {
    console.log(`Finishing question ${this.currentQuestion}`);
    this.quiz.openToAnswers = false;

    if (this.answerTimeout != undefined) {
      clearTimeout(this.answerTimeout);
      this.answerTimeout = undefined;
    }

    if (this.quiz.currentQuestion < 0 || this.quiz.currentQuestion >= this.quiz.questions.length) {
      return undefined;
    }

    const question = this.quiz.questions.find(question => question.id == this.quiz.currentQuestion);
    if (question == undefined) {
      return undefined;
    }

    const answerValue = await question.getAnswer();

    question.stats.reset();

    this.quiz.players.forEach(player => {
      question.stats.totalPlayers += 1;

      const answer = player.answers.find(answer => answer.question == this.quiz.currentQuestion);
      if (answer == undefined) {
        player.answers.push(new Answer(this.quiz.currentQuestion, question.type, -1, false, false));
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

    if (question.stats.answered > 0) {
      question.stats.average = parseInt(question.stats.average / question.stats.answered);
    }

    const res = question.toJS(true, true);
    WsApi.get().emitFinishedQuestion(res);

    /* Check if the quiz has finished */
    if(this.quiz.currentQuestion + 1 >= this.quiz.questions.length) {
      console.log('All questions are finished, the full quiz is now finished');
      WsApi.get().emitQuestionsFinished();
    }
    return res;
  };

  /**
   * Go to the next question. If the quiz has not yet started this function will start the quiz. If 
   * the quiz has ended this function is a no-op.
   * 
   * @return {Question} The question to which the quiz has advanced.
   */
  nextQuestion = async () => {
    if (this.quiz.currentQuestion + 1 >= this.quiz.questions.length) {
      console.log('The quiz is finished, there is no next question');
      return {
        status: "The quiz has finished"
      };
    }

    /* Finish the current question before going to the next one */
    if (this.quiz.openToAnswers) {
      await this.finishQuestion();
    }

    this.quiz.currentQuestion += 1;

    this.quiz.openToAnswers = true;

    if (this.answerTimeout != undefined) {
      clearTimeout(this.answerTimeout);
      this.answerTimeout = undefined;
    }

    const question = this.quiz.questions.find(question => question.id == this.quiz.currentQuestion);
    if (question == undefined) {
      console.warn('The next question is undefined, cannot start timer');
      return {
        status: "Next question is undefined"
      };
    }

    if (question.time > 0) {
      this.passedTime = 0;

      const handleQuestionTimerTick = () => {
        if(this.passedTime >= question.time) {
          console.info(`Automatically finished question ${question.id} after ${question.time}s`);
          this.finishQuestion();
          return;
        }

        this.passedTime += 1;
        WsApi.get().emitQuestionTick(question.id, this.passedTime, question.time);
        this.answerTimeout = setTimeout(handleQuestionTimerTick, 1000);
      };

      this.answerTimeout = setTimeout(handleQuestionTimerTick, 1000);
    }

    const res = question.toJS();
    WsApi.get().emitNextQuestion(res);
    return res;
  };

  /**
   * Go to the start of the quiz and reset the answers of all players.
   */
  resetQuiz = () => {
    this.quiz.currentQuestion = -1;

    this.quiz.players.forEach(player => {
      player.resetAnswers();
    });

    this.quiz.questions.forEach(question => {
      question.stats.reset();
    });

    WsApi.get().emitResetQuiz();
  };

  /**
   * Post an answer for a player.
   * 
   * @param {String} id The id of the player that gave the answer.
   * @param {String} token The security token which authenticates the player.
   * @param {Number} answer The answer to the question.
   * 
   * @return The player or undefined when the player wasn't found.
   */
  processAnswer = async (id, token, answer) => {
    if (this.quiz.currentQuestion < 0) {
      console.warn('Could not process answer because the quiz has not yet started');
      return undefined;
    }

    if (this.quiz.currentQuestion > this.quiz.questions.length) {
      console.warn('Could not process answer because the quiz has ended');
      return undefined;
    }

    if (this.quiz.openToAnswers == false) {
      console.warn('Could not process answer because the answer window has expired');
      return undefined;
    }

    const player = this.quiz.players.find(player => player.id == id);
    if (player == undefined) {
      console.warn(`No player with id ${id} found, could not process answer`);
      return undefined;
    }

    if (player.token != token) {
      console.warn(`Player ${player.id}:${player.name} could not answer due to wrong token`);
      return undefined;
    }

    if (player.answers.find(answer => answer.question == this.quiz.currentQuestion) != undefined) {
      console.warn(`Player ${player.id}:${player.name} already answered the current question`);
      return undefined;
    }

    const question = this.quiz.questions.find(question => question.id == this.quiz.currentQuestion);
    if (question == undefined) {
      console.warn('Cannot process answer for unknown question');
      return undefined;
    }

    const result = await question.getResult(answer);

    player.answers.push(new Answer(this.quiz.currentQuestion, question.type, answer, result, true));
    console.info(`Player ${player.id}:${player.name} answered ${answer} to question ` +
      `${this.quiz.currentQuestion} with result ${result}`);

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
      /* Only rank questions that are already answered */
      if (question.id > this.quiz.currentQuestion) {
        continue;
      } else if (question.id == this.quiz.currentQuestion && this.quiz.openToAnswers) {
        continue;
      }

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
        return this.rankPlayersMultiplechoiceFirstValueSecond();
    }
  };
}