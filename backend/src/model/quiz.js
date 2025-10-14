import { Question } from "./question.js";

/**
 * The Quiz class represents the Quiz that we are currently playing.
 */
export class Quiz {
  constructor(data) {
    this.title = data.title || "Quiz";
    this.prizes = data.prizes || [];
    this.questions = data.questions?.map((question, idx) => new Question(idx, question));
    this.players = new Array();

    this.currentQuestion = -1;
  };

  /**
   * Get the quiz overview.
   * 
   * @returns {Object} An overview of the quiz.
   */
  getQuiz = () => {
    return {
      title: this.title,
      currentQuestion: this.getQuestion(this.currentQuestion),
      stats: {
        prizes: this.prizes.length,
        players: this.players.length,
        questions: this.questions.length
      }
    }
  };

  /**
   * Get a question, without the answer.
   * 
   * @param {Number} index The index of the question.
   * 
   * @return {Object} The question or message when quiz has not yet started or is ended.
   */
  getQuestion = (index) => {
    if(index < 0) {
      return { 
        status: "Quiz has not yet started"
      };
    } else if(index >= this.questions.length) {
      return {
        status: "Quiz has ended"
      };
    }

    return this.questions[index].toJS();
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