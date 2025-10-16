import { observer } from "mobx-react-lite";
import { quizStore } from "../store/QuizStore";

export const Questions = observer(() => (
  <div className="card">
    <p>
      {quizStore.quiz.currentQuestion.question}
    </p>
    {
      quizStore.quiz.currentQuestion.type === "multiplechoice" && (
        <>
          {quizStore.quiz.currentQuestion.choices.map((choice, idx) => (
            <p key={idx}>
              <input 
                type="radio"
                name="answers" 
                value={idx}
                checked={quizStore.currentAnswer === idx}
                onChange={() => quizStore.setAnswer(idx)}
              />
              <label htmlFor={`choice-${idx}`}>{choice}</label>
            </p>
          ))}
          <button onClick={() => quizStore.sendAnswer()}>Send answer</button>
        </>
      )
    }
    {
      quizStore.quiz.currentQuestion.type == "value" &&
      <>
        <input type="number" onChange={ (e) => quizStore.setAnswer(e.target.value) }/>
        <button onClick={() => quizStore.sendAnswer()}>Send answer</button>
      </>
    }
  </div>
));