import { Quiz } from "../model/quiz";
import { io } from "socket.io-client";
import { Player } from "../model/player";
import { makeAutoObservable, runInAction } from "mobx";

class QuizStore {
  socket = null;
  connected = false;
  registered = false;
  quiz = null;
  player = null;
  currentAnswerQuestion = undefined;
  currentAnswer = undefined;
  elapsedTime = 0;
  totalTime = 0;
  answerConfirmed = false;
  quizIsFinished = false;

  constructor() {
    this.quiz = new Quiz();
    this.player = new Player();
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
   * The number of seconds left on this question.
   */
  get timeLeft() {
    return this.totalTime - this.elapsedTime;
  };

  /**
   * Set the registered state.
   * 
   * @param {Boolean} registered True when the client is registered, false if not.
   */
  setRegistered = (registered) => {
    this.registered = registered;
  }

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
      this.connected = false;
      runInAction(() => {
        this.connected = false;
      });
      console.log('Lost connection to the quiz server');
    });

    this.socket.on('resetQuiz', () => {
      runInAction(() => {
        this.quiz = new Quiz();
        this.player = new Player();
        this.registered = false;
        this.currentAnswer = undefined;
        this.elapsedTime = 0;
        this.totalTime = 0;
        this.answerConfirmed = false;
        this.quizIsFinished = false;
      });

      this.getQuiz();
      this.connect();
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

    const handleNewQuestion = async (msg) => {
      /* Send the answer if it's not already sent */
      if(!this.answerConfirmed && this.quiz.currentQuestion.id > -1) {
        await this.sendAnswer();
      }

      runInAction(() => {
        this.quiz.setCurrentQuestion(msg);
        this.answerConfirmed = false;
        this.totalTime = msg.time;
        this.elapsedTime = 0;
        this.setAnswer(this.quiz.currentQuestion.type === "multiplechoice" ? -1 : undefined);
      });
    }

    this.socket.on('newQuestion', (msg) => {
      handleNewQuestion(msg);
    });

    this.socket.on('questionTick', msg => {
      if(msg.f) {
        /* The question is now finished, time to send the answer */
        this.sendAnswer();
      }

      runInAction(() => {
        this.elapsedTime = msg.e;
        this.totalTime = msg.t;

        if(msg.f) {
          if(msg.a) {
            if(msg.a.option) {
              this.quiz.currentQuestion.solution.option = msg.a.option;
            }

            if(msg.a.value) {
              this.quiz.currentQuestion.solution.value = msg.a.value;
            }
          }
        }
      });
    });

    const handleQuestionsFinished = async () => {
      /* Send the answer if it's not already sent */
      if(!this.answerConfirmed) {
        await this.sendAnswer();
      }

      runInAction(() => {
        this.quizIsFinished = true;
      });
    }

    this.socket.on('questionsFinished', () => {
      handleQuestionsFinished();
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
   * Register with the quiz server.
   * 
   * @param {String} name Your player's name or undefined for automatic name.
   * 
   * @return {Boolean} True upon succesfull registration.
   */
  register = (name = undefined) => {
    if (!this.socket) {
      return;
    }

    if (name) {
      this.socket.emit('registerPlayer', {
        name
      });
    } else {
      this.socket.emit('registerPlayer', {});
    }
  };

  /**
   * Set the current answer.
   * 
   * @param {Number} answer The currently selected answer.
   */
  setAnswer = (answer) => {
    if(this.timeLeft <= 0) {
      console.log('Not setting answer because the time is up');
      return;
    }

    this.currentAnswerQuestion = this.quiz.currentQuestion.id;
    this.currentAnswer = answer;
  };

  /**
   * Send the current answer to the backend.
   */
  sendAnswer = async () => {
    if (!this.socket) {
      return;
    }

    if(this.currentAnswer == undefined) {
      return;
    }

    try {
      const resp = await this.socket.emitWithAck('answerQuestion', {
        id: this.player.id,
        question: this.currentAnswerQuestion,
        token: this.player.token,
        answer: this.currentAnswer
      });

      if(resp.result) {
        runInAction(() => {
          this.answerConfirmed = true;
        });
      } else {
        //TODO
      }
    } catch {
      //TODO
    }
  };
}

export const quizStore = new QuizStore();