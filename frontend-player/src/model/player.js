import { makeAutoObservable } from "mobx";

export class Player {
    id = "";
    token = "";
    name = "---";
    ranking = 0;
    answers = [];

    /**
     * Construct a new player.
     * 
     * @param {String} id The id of the player.
     * @param {String} token The token of the player.
     * @param {String} name The name of the player.
     */
    constructor(id = "", token = "", name = "---") {
        this.id = id;
        this.token = token;
        this.name = name;

        makeAutoObservable(this);
    };

    /**
     * Store player data in this model.
     * 
     * @param {Object} playerData The raw player data.
     */
    setPlayerData = (playerData) => {
        this.id = playerData.id;
        this.token = playerData.token;
        this.name = playerData.name;
        
        if(playerData.ranking) {
            this.ranking = playerData.ranking;
        }

        if(playerData.answers) {
            this.answers = playerData.answers;
        }
    }
}