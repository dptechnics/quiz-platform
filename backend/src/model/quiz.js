import { Question } from "./question.js";
import fs from 'fs';
import path from 'path';

/**
 * The Quiz class represents the Quiz that we are currently playing.
 */
export class Quiz {
  /**
   * The supported question types.
   */
  static RANKING_MECHANISM = Object.freeze({
    MULTIPLECHOICE_FIRST_VALUE_SECOND: 'muliplechoice-first-value-second'
  });

  constructor(data) {
    this.title = data.title || "Quiz";
    this.rankingMechanism = Quiz.RANKING_MECHANISM.MULTIPLECHOICE_FIRST_VALUE_SECOND;
    this.prizes = data.prizes || [];
    this.questions = data.questions?.map((question, idx) => new Question(idx, question));
    this.players = new Array();
    this.currentQuestion = -1;
  };

  /**
   * Get all quiz questions.
   * 
   * @return {Array} An array which contains the quiz questions without the answers.
   */
  getQuestions = () => {
    return this.questions.map(question => question.toJS());
  };

  /**
   * Save the current game to disk.
   */
  saveGame = () => {
    const fileContent = this.players.map(player => player.toJS());
    const json = JSON.stringify(fileContent, null, 2);
    
    const now = new Date();
    const timestamp = now.toISOString().replace(/:/g, '-').split('.')[0];

    const fileName = `savegames/game-save-${timestamp}.json`;
    const filePath = path.join(process.cwd(), fileName);

    fs.writeFileSync(filePath, json, 'utf8');
    console.log(`Game saved to ${filePath}`);
  };
}