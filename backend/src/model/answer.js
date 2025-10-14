export class Answer {
  
  /**
   * Construct a new anser object.
   * 
   * @param {Number} question The question  
   * @param {Number} answer The answer that was given. 
   * @param {Boolean|Number} result True/False for binary questions, a number for value questions.
   * @param {Boolean} answered When false it means the player has not answered in time.
   */
  constructor(question, answer, result, answered) {
    this.question = question || 0;
    this.answer = answer || 0;
    this.result = result || false;
    this.answered = answered || false;
  };

  /**
   * Return a plain javascript object which represents this player.
   * 
   * @returns {Object} A POJO representing this answer.
   */
  toJS = () => {
    return {
      question: this.question,
      answer: this.answer,
      result: this.result,
      answered: this.answered
    };
  };
}