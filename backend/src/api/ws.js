import { Server } from "socket.io";
import { GameController } from "../controller/gamecontroller.js";

/**
 * The WsApi class groups the websocket calls and routes.
 */
export class WsApi {

  /**
   * Singleton instance of this class.
   */
  static instance = undefined;

  /**
   * Get the instance of the websocket API.
   * 
   * @returns The instance of the websocket API.
   */
  static get = () => {
    return WsApi.instance;
  }

  /**
   * Construct a new WsApi.
   * 
   * @param {GameController} gameController The instance of the GameController used in this API.
   * @param {Server} io The websocket server instance.
   */
  constructor(gameController, io) {
    this.gameController = gameController;
    this.io = io;

    WsApi.instance = this;
  };

  emitResetQuiz = () => {
    this.io.emit('resetQuiz', { msg: "The quiz has restarted" });
  };

  emitNextQuestion = (question) => {
    this.io.emit('newQuestion', question);
  };

  emitFinishedQuestion = (question) => {
    this.io.emit('finishedQuestion', question);
  };

  defineRoutes = () => {
    this.io.on("connection", (socket) => {

      /* Register a new player on this socket connection */
      socket.on('registerPlayer', msg => {
        let player =
          this.gameController.quiz.players.find(player => player.websocket?.id == socket.id);
        if (player != undefined) {
          socket.emit("registerPlayer", {
            result: false,
            msg: `Player '${player.name}' already registered on this socket connection`
          });
          return;
        }

        player = this.gameController.addPlayer(msg.name);
        if (player == undefined) {
          socket.emit("registerPlayer", {
            result: false,
            msg: `Player with name '${req.body?.name}' already exists`
          });
          return;
        }

        player.setWebsocket(socket);
        socket.emit("registerPlayer", {
          result: true,
          msg: player.toJS(true)
        });
      });

      /* Post an answer to a question */
      socket.on('answerQuestion', async msg => {
        const id = msg.id;
        const token = msg.token;
        const answer = msg.answer;

        if (id == undefined || token == undefined || answer == undefined) {
          socket.emit("answerQuestion", {
            result: false,
            msg: `Missing id, token or answer in message`
          });
          return;
        }

        const p = this.gameController.quiz.players.find(player => {
          return player.id == id && player.token == token && player.websocket.id == socket.id
        });
        if (p == undefined) {
          socket.emit("answerQuestion", {
            result: false,
            msg: `Player id or token is invalid or socket session was hijacked`
          });
          return;
        }

        const player = await this.gameController.processAnswer(id, token, answer);
        if (player == undefined) {
          socket.emit("answerQuestion", {
            result: false,
            msg: `Player id or token is invalid`
          });
          return;
        }

        socket.emit("answerQuestion", {
          result: true,
          msg: player.toJS()
        });
      });

      /* Go to the next question */
      socket.on('quizNextQuestion', () => {
        this.gameController.nextQuestion();
      });

      /* Finish the current question */
      socket.on('quizFinishQuestion', () => {
        this.gameController.finishQuestion();
      });

      /* Reset the quiz */
      socket.on('quizReset', () => {
        this.gameController.resetQuiz();
        socket.emit("quizReset", {
          result: true
        });
      });

    });
  };
}