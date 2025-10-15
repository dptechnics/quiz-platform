export class AnswerStats {

  /**
   * Construct a new answer statistics object.
   */
  constructor() {
    this.totalPlayers = 0;
    this.answered = 0;
    this.unanswered = 0;
    this.correct = 0;
    this.wrong = 0;
    this.average = 0;
    this.bestAnswer = undefined;
    this.worstAnswer = undefined;
    this.bestDiff = undefined;
    this.worstDiff = undefined;
  };

  /**
   * Reset the answer statistics to zero.
   */
  reset = () => {
    this.totalPlayers = 0;
    this.answered = 0;
    this.unanswered = 0;
    this.correct = 0;
    this.wrong = 0;
    this.average = 0;
    this.bestAnswer = undefined;
    this.worstAnswer = undefined;
    this.bestDiff = undefined;
    this.worstDiff = undefined;
  };

  /**
 * Return a plain javascript object which represents the answer statistics.
 * 
 * @return {Object} A POJO representing the answer statistics.
 */
  toJS = () => {
    return {
      totalPlayers: this.totalPlayers,
      answered: this.answered,
      unanswered: this.unanswered,
      correct: this.correct,
      wrong: this.wrong,
      average: this.average,
      bestAnswer: this.bestAnswer,
      worstAnswer: this.worstAnswer,
      bestDiff: this.bestDiff,
      worstDiff: this.worstDiff
    }
  };
}