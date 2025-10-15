import { GameController } from "../controller/gamecontroller.js";

/**
 * The HttpApi class groups the HTTP calls and routes.
 */
export class HttpApi {

  /**
   * Construct a new HttpApi.
   * 
   * @param {GameController} gameController The instance of the GameController used in this API.
   */
  constructor(gameController) {
    this.gameController = gameController;
  };

  getQuiz = (req, res) => {
    res.send(this.gameController.getQuiz());
  };

  postFinishQuestion = async (req, res) => {
    const question = await this.gameController.finishQuestion();
    if (question == undefined) {
      res.status(409).send({ error: 'no active question found' });
      return;
    }

    res.status(200).send(question);
  };

  postNextQuestion = async (req, res) => {
    res.send(await this.gameController.nextQuestion());
  };

  postResetQuestion = (req, res) => {
    this.gameController.resetQuiz();
    res.status(200).send({});
  };

  postAnswer = async (req, res) => {
    const player = await this.gameController.processAnswer(
      req.params?.id,
      req.body?.token,
      req.body?.answer);

    if (player == undefined) {
      res.status(401).send({ error: `Player, token or question is invalid` });
      return;
    }

    res.status(200).send(player);
  };

  getPrizes = (req, res) => {
    res.send(this.gameController.quiz.prizes);
  };

  getQuestions = (req, res) => {
    res.send(this.gameController.quiz.getQuestions());
  };

  getPlayers = (req, res) => {
    res.send(this.gameController.quiz.players.map(player => player.toJS()));
  };

  getRanking = async (req, res) => {
    res.send(await this.gameController.rankPlayers());
  }

  postPlayer = (req, res) => {
    const player = this.gameController.addPlayer(req.body?.name);
    if (player == undefined) {
      res.status(409).send({ error: `Player with name '${req.body?.name}' already exists` });
      return;
    }

    res.send(player.toJS(true));
  };

  deletePlayer = (req, res) => {
    const player = this.gameController.removePlayer(req.params?.id);
    if (player == undefined) {
      res.status(404).send({ error: `No player with found with id '${req.params?.id}'` });
      return;
    }

    res.send(player.toJS());
  }
}