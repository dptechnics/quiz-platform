import { randomName, uuidv4 } from "../util.js";

/**
 * The Player class represents a quiz player.
 */
export class Player {
  /**
   * Construct a new player.
   * 
   * @param {String} name The name of the player.
   * @param {Number} websocket The id of the websocket this player is connected on.
   */
  constructor(name, websocket) {
    this.id = uuidv4();
    this.token = uuidv4();
    this.name = name || randomName();
    this.websocket = websocket || -1;
    this.answers = new Array();
    this.ranking = 0;
  };

  /**
   * Return a plain javascript object which represents this player.
   * 
   * @param includeToken When true, the security token of the player is returned.
   * 
   * @return {Object} A POJO representing a this player.
   */
  toJS = (includeToken = false) => {
    let player = {
      id: this.id,
      name: this.name,
      ranking: this.ranking,
      answers: this.answers.map(answer => answer.toJS())
    };

    if(includeToken) {
      player.token = this.token;
    }

    return player;
  };

  /**
   * Assign a new websocket to the player.
   * 
   * @param {Number} websocket The new websocket id. 
   */
  setWebsocket = (websocket) => {
    this.websocket = websocket;
    console.info(`Player ${this.name} changed to websocket ${this.websocket.id}`);
  };

  /**
   * Reset the answers array.
   */
  resetAnswers = () => {
    this.answers = new Array();
  };
}