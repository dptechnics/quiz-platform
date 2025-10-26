import { Quiz } from "../model/quiz";
import { io } from "socket.io-client";
import { makeAutoObservable, runInAction } from "mobx";

class QuizStore {
  socket = null;
  connected = false;
  quiz = null;
  elapsedTime = 0;
  totalTime = 0;
  quizIsFinished = false;

  constructor() {
    this.quiz = new Quiz();
    makeAutoObservable(this);
  };

  /**
   * A computed value that returns a percentage which represents the amount of 
   * time that is still left to answer the current question.
   */
  get percentRemaining() {
    if (this.totalTime == 0) {
      return 0;
    }

    return Math.max(0, ((this.totalTime - this.elapsedTime) / this.totalTime) * 100);
  };

  /**
   * This value is true when the user can still answer the current question.
   */
  get canAnswer() {
    return this.percentRemaining > 0;
  };

  /**
   * Connect to the backend.
   */
  connect = () => {
    if (this.socket) {
      return;
    }

    this.socket = io('');

    this.socket.on('connect', () => {
      runInAction(() => {
        this.connected = true;
      });
      console.log('Connected to the quiz server');
    });

    this.socket.on('disconnect', () => {
      runInAction(() => {
        this.connected = false;
      });
      console.log('Lost connection to the quiz server');
    });

    this.socket.on('registerPlayer', msg => {
      if (msg.result) {
        this.player.setPlayerData(msg.msg);
        this.setRegistered(true);
        console.log(`Registered with quiz backend as ${this.player.name}`);
      } else {
        //TODO
      }
    });

    this.socket.on('newQuestion', msg => {
      runInAction(() => {
        this.quizIsFinished = false;
        this.quiz.setCurrentQuestion(msg);
        this.totalTime = msg.time;
        this.elapsedTime = 0;
        this.setAnswer(this.quiz.currentQuestion.type === "multiplechoice" ? -1 : 0);
      });
      
    });

    this.socket.on('finishedQuestion', msg => {
      runInAction(() => {
        this.totalTime = 0;
        this.elapsedTime = 0;
      });
    });

    this.socket.on('questionTick', msg => {
      runInAction(() => {
        this.elapsedTime = msg.e;
        this.totalTime = msg.t;
      });
    });

    this.socket.on('answerQuestion', msg => {
      console.log(msg);
      //TODO
    });

    this.socket.on('questionsFinished', msg => {
      console.log(msg);
      runInAction(() => {
        this.quizIsFinished = true;
      });
    });
  };

  /**
   * Get the quiz data from the quiz server.
   */
  getQuiz = async () => {
    try {
      const quizData = await (await fetch('/api/quiz')).json();
      this.quiz.setQuizData(quizData);
    } catch (err) {
      console.error(`Could not get quiz data: ${err}`);
    }
  };

  /**
   * Restart the quiz and reset the question and score state.
   */
  restartQuiz = () => {
    if (!this.socket) {
      return;
    }

    this.socket.emit('quizReset', {});
  };

  /**
   * Go to the next question.
   */
  nextQuestion = () => {
    if (!this.socket) {
      return;
    }

    this.socket.emit('quizNextQuestion', {});
  };

  /**
   * Finish the current question.
   */
  finishQuestion = () => {
    if (!this.socket) {
      return;
    }

    this.socket.emit('quizFinishQuestion', {});
  };
}

export const quizStore = new QuizStore();