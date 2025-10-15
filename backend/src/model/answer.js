import { Question } from "./question.js";

export class Answer {
  
  /**
   * Construct a new anser object.
   * 
   * @param {Number} question The question that was answered.
   * @param {Question.TYPE} type The type of question that was answered.
   * @param {Number} answer The answer that was given. 
   * @param {Boolean|Number} result True/False for binary questions, a number for value questions.
   * @param {Boolean} answered When false it means the player has not answered in time.
   */
  constructor(question, type, answer, result, answered) {
    this.question = question || 0;
    this.type = type || Question.TYPE.VALUE;
    this.answer = answer || 0;
    this.result = result || false;
    this.answered = answered || false;
  };

  /**
   * Return a plain javascript object which represents this answer.
   * 
   * @return {Object} A POJO representing this answer.
   */
  toJS = () => {
    return {
      question: this.question,
      type: this.type.description,
      answer: this.answer,
      result: this.result,
      answered: this.answered
    };
  };
}