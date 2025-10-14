import { Quiz } from "../model/quiz.js";
import { Answer } from "../model/answer.js";
import { Player } from "../model/player.js";
import { Question } from "../model/question.js";

export class GameController {
  constructor(quizData) {
    this.quiz = new Quiz(quizData);
  };

  /**
   * Go to the next question. If the quiz has not yet started this function will start the quiz. If 
   * the quiz has ended this function is a no-op.
   * 
   * @return {Question} The question to which the quiz has advanced.
   */
  nextQuestion = () => {
    if (this.quiz.currentQuestion > this.quiz.questions.length) {
      return;
    }

    if (this.quiz.currentQuestion >= 0) {
      this.quiz.players.forEach(player => {
        if (player.answers.find(answer => answer.question == this.quiz.currentQuestion) == undefined) {
          player.answers.push(new Answer(this.quiz.currentQuestion, -1, false, false));
        }
      });
    }

    this.quiz.currentQuestion += 1;

    //TODO: emit events
    return this.quiz.getQuestion(this.quiz.currentQuestion);
  };

  /**
   * Go to the start of the quiz and reset the answers of all players.
   */
  resetQuiz = () => {
    this.quiz.currentQuestion = -1;

    this.quiz.players.forEach(player => {
      player.resetAnswers();
    });

    //TODO: emit events
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

    player.answers.push(new Answer(this.quiz.currentQuestion, answer, result, true));
    console.info(`Player ${player.id}:${player.name} answered ${answer} to question ` +
      `${this.quiz.currentQuestion} with result ${result}`);

    //TODO: emit events
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
}