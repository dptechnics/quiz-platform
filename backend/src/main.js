import express from "express";
import http from "http";
import { Server } from "socket.io";
import config from './config.js';
import quizData from './quizdata.js';
import { HttpApi } from "./api/http.js";
import { WsApi } from "./api/ws.js";

import { GameController } from "./controller/gamecontroller.js";

const app = express();
app.use(express.json());
const server = http.createServer(app);
const io = new Server(server);

const gameController = new GameController(quizData);

const httpApi = new HttpApi(gameController);
const wsApi = new WsApi(gameController, io);

httpApi.defineRoutes(app);
wsApi.defineRoutes();

server.listen(config.port, () => {
  console.log(`Quiz server started on ${config.port}`);
})