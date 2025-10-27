import { makeAutoObservable } from "mobx";

export class Question {
    id = -1;
    question = `Press 'Play' to start the quiz`;
    time = 20;
    type = "";
    choices = [];
    solution = {
        option: -1,
        value: 0
    };

    /**
     * Construct a new question.
     */
    constructor() {
        makeAutoObservable(this);
    }

    /**
     * Update the question data.
     * 
     * @param {Object} questionData The raw question data to set.
     */
    setQuestionData = (questionData) => {
        this.id = questionData.id;
        this.question = questionData.question;
        this.time = questionData.time;
        this.type = questionData.type;
        this.choices = questionData.choices || [];
    };
}