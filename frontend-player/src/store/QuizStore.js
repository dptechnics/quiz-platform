import { Quiz } from "../model/quiz";
import { io } from "socket.io-client";
import { Player } from "../model/player";
import { makeAutoObservable } from "mobx";

class QuizStore {
  socket = null;
  connected = false;
  registered = false;
  quiz = null;
  player = null;
  currentAnswer = undefined;

  constructor() {
    this.quiz = new Quiz();
    this.player = new Player();
    makeAutoObservable(this);
  }

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
    if(this.socket) {
      return;
    }

    this.socket = io('');
    
    this.socket.on('connect', () => {
      this.connected = true;
      console.log('Connected to the quiz server');
    });

    this.socket.on('disconnect', () => {
      this.connected = false;
      console.log('Lost connection to the quiz server');
    });

    this.socket.on('registerPlayer', msg => {
      if(msg.result) {
        this.player.setPlayerData(msg.msg);
        this.setRegistered(true);
        console.log(`Registered with quiz backend as ${this.player.name}`);
      } else {
        //TODO
      }
    });

    this.socket.on('newQuestion', msg => {
      this.quiz.setCurrentQuestion(msg);
      this.setAnswer(this.quiz.currentQuestion.type === "multiplechoice" ? -1 : 0);
    });

    this.socket.on('answerQuestion', msg => {
      console.log(msg);
      //TODO
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
    if(!this.socket) {
      return;
    }

    if(name) {
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
    this.currentAnswer = answer;
  };

  /**
   * Send the current answer to the backend.
   */
  sendAnswer = async () => {
    if(!this.socket) {
      return;
    }

    this.socket.emit('answerQuestion', {
      id: this.player.id,
      token: this.player.token,
      answer: this.currentAnswer
    });
  };
}

export const quizStore = new QuizStore();