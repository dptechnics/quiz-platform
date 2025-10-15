import express from "express";
import http from "http";
import { Server } from "socket.io";
import config from './config.js';
import quizData from './quizdata.js';
import { HttpApi } from "./api/http.js";
import { WebsocketApi } from "./api/ws.js";

import { GameController } from "./controller/gamecontroller.js";

const app = express();
app.use(express.json());
const server = http.createServer(app);
const ws = new Server(server);

const gameController = new GameController(quizData);

const httpApi = new HttpApi(gameController);
const wsApi = new WebsocketApi(gameController);

/* Quiz API */
app.get('/api/quiz', httpApi.getQuiz);
app.get('/api/quiz/prizes', httpApi.getPrizes);
app.get('/api/quiz/questions', httpApi.getQuestions);
app.post('/api/quiz/question/finish', httpApi.postFinishQuestion);
app.post('/api/quiz/question/next', httpApi.postNextQuestion);
app.post('/api/quiz/reset', httpApi.postResetQuestion);

/* Players API */
app.get('/api/players', httpApi.getPlayers);
app.get('/api/players/ranking', httpApi.getRanking);
app.post('/api/players', httpApi.postPlayer);
app.post('/api/players/:id/answer', httpApi.postAnswer);
app.delete('/api/players/:id', httpApi.deletePlayer);

app.listen(config.port, () => {
  console.log(`DPTechnics backend started on ${config.port}`)
})