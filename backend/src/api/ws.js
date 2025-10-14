import { GameController } from "../controller/gamecontroller.js";

/**
 * The WebsocketApi class groups the websocket calls and routes.
 */
export class WebsocketApi {

    /**
     * Construct a new WebsocketApi.
     * 
     * @param {GameController} gameController The instance of the GameController used in this API.
     */
    constructor(gameController) {
        this.gameController = gameController;
    };
}