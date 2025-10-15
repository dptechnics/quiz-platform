import { makeAutoObservable } from "mobx";
import { Question } from "./question";

export class Quiz {
  title = '';
  currentQuestion = null;

  /**
   * Construct a new quiz.
   * 
   * @param {String} title The title of the quiz.
   */
  constructor(title = '') {
    this.title = title;
    this.currentQuestion = new Question();

    makeAutoObservable(this);
  };

  /**
   * Update the quiz data.
   * 
   * @param {Object} quizData The raw quiz data to set.
   */
  setQuizData = (quizData) => {
    this.title = quizData.title || '';
  }

  /**
   * Set the current question.
   * 
   * @param {Object} question The new current question.  
   */
  setCurrentQuestion = (question) => {
    this.currentQuestion.setQuestionData(question);
  };
}