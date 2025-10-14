export class Question {
  /**
   * The supported question types.
   */
  static TYPE = Object.freeze({
    MULTIPLECHOICE: Symbol('multiplechoice'),
    VALUE: Symbol('value')
  });

  /**
   * Construct a new question.
   * 
   * @param {Number} idx The index of the question.
   * @param {Object} data The raw question data. 
   */
  constructor(idx, data) {
    this.id = idx;
    this.question = data.question || "";
    this.type = data.type == "multiplechoice" ? Question.TYPE.MULTIPLECHOICE : Question.TYPE.VALUE;
    this.choices = data.choices || [];
    this.datasource = data.datasource || "";
    this.answer = data.answer || -1;
  };

  /**
   * Get the answer of this question.
   * 
   * @return {Number} The answer to the question or undefined.
   */
  getAnswer = async () => {
    switch (this.type) {
      case Question.TYPE.MULTIPLECHOICE:
        return {
          option: this.answer,
          value: this.choices[this.answer]
        };

      case Question.TYPE.VALUE:
        //TODO: download value from datasource if it's not already in cache.
        break;
    };

    console.warn(`Cannot get : ${this.type}`);
    return undefined;
  };

  /**
   * 
   * @param {Number} answer The answer to this question.
   * 
   * @returns {Boolean|Number} The result the answer.
   */
  getResult = async (answer) => {
    switch (this.type) {
      case Question.TYPE.MULTIPLECHOICE:
        return this.answer == answer;

      case Question.TYPE.VALUE:
        //TODO: download value from datasource if it's not already in cache.
        break;
    };

    console.warn(`Could not calculate result for question of unknown type: ${this.type}`);
    return false;
  };

  /**
   * Get the question as a javascript object.
   */
  toJS = () => {
    const res = {
      id: this.id,
      question: this.question,
      type: this.type.description
    };

    if (this.type === Question.TYPE.MULTIPLECHOICE) {
      res.choices = this.choices;
    }

    return res;
  };
}