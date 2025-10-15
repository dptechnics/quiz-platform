import { Question } from "./question.js";

/**
 * The Quiz class represents the Quiz that we are currently playing.
 */
export class Quiz {
  /**
   * The supported question types.
   */
  static RANKING_MECHANISM = Object.freeze({
    MULTIPLECHOICE_FIRST_VALUE_SECOND: Symbol('muliplechoice-first-value-second')
  });

  constructor(data) {
    this.title = data.title || "Quiz";
    this.rankingMechanism = Quiz.RANKING_MECHANISM.MULTIPLECHOICE_FIRST_VALUE_SECOND;
    this.prizes = data.prizes || [];
    this.questions = data.questions?.map((question, idx) => new Question(idx, question));
    this.players = new Array();

    this.currentQuestion = -1;
    this.openToAnswers = false;
  };

  /**
   * Get all quiz questions.
   * 
   * @return {Array} An array which contains the quiz questions without the answers.
   */
  getQuestions = () => {
    return this.questions.map(question => question.toJS());
  };
}