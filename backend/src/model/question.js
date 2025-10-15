import { Datasource } from "./datasource.js";
import { AnswerStats } from "./answerstats.js";

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
    this.type = data.type == 'multiplechoice' ? Question.TYPE.MULTIPLECHOICE : Question.TYPE.VALUE;
    this.choices = data.choices || [];
    this.datasource = new Datasource(data.datasource?.type, data.datasource);
    this.answer = data.answer || -1;
    this.time = data.time || 30;
    this.stats = new AnswerStats();
  };

  /**
   * Get a normalized ranking for an answered value. This function will calculate a ranking,
   * normalized in [0, 100] for a question of the value type.
   * 
   * @param {Number} answeredValue The value that was answered.
   * 
   * @return {Number} The normalized ranking
   */
  getValueRanking = async (answeredValue) => {
    if(answeredValue == undefined) {
      return 0;
    }

    const correctAnswer = await this.getAnswer();
    if(correctAnswer == undefined) {
      return 0;
    }

    const diff = Math.abs(correctAnswer - answeredValue);

    let score = 0;
    if(this.stats.worstDiff == this.stats.bestDiff) {
      score = 100;
    } else {
      score = ((this.stats.worstDiff - diff) / (this.stats.worstDiff - this.stats.bestDiff)) * 100;
    }

    return score;
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
        return {
          value: await this.datasource.getValue()
        };
    };

    console.warn(`Cannot get answer from question of type: ${this.type.description}`);
    return undefined;
  };

  /**
   * 
   * @param {Number} answer The answer to this question.
   * 
   * @return {Boolean|Number} The result the answer.
   */
  getResult = async (answer) => {
    switch (this.type) {
      case Question.TYPE.MULTIPLECHOICE:
        return this.answer == answer;

      case Question.TYPE.VALUE:
        const correct = await this.datasource.getValue();
        return Math.abs(correct - answer);
    };

    console.warn(`Could not calculate result for question of unknown type: ${this.type.description}`);
    return false;
  };

  /**
   * Get the question as a javascript object.
   * 
   * @param {Boolean} includeStats When true the answer stats are included.
   * * @param {Boolean} includeAnswer When true the answer is included.
   */
  toJS = (includeStats = false, includeAnswer = false) => {
    const res = {
      id: this.id,
      question: this.question,
      type: this.type.description,
      time: this.time,
    };

    if (this.type === Question.TYPE.MULTIPLECHOICE) {
      res.choices = this.choices;
    }

    if(includeStats) {
      res.stats = this.stats.toJS();
    }

    return res;
  };
}