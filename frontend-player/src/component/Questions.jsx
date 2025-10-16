import { observer } from "mobx-react-lite";
import { quizStore } from "../store/QuizStore";

export const Questions = observer(() => (
  <div className="data">
    <div className="dataContent">
      <div>
        <p className="question">
          {quizStore.quiz.currentQuestion.question}
        </p>
        {
          quizStore.quiz.currentQuestion.type === "multiplechoice" && (
            <>
              {quizStore.quiz.currentQuestion.choices.map((choice, idx) => (
                <label className="radioInput" key={idx}>
                  <input
                    type="radio"
                    name="answers"
                    value={idx}
                    checked={quizStore.currentAnswer === idx}
                    onChange={() => quizStore.setAnswer(idx)}
                  />
                  {choice}
                </label>
              ))}
            </>
          )
        }
        {
          quizStore.quiz.currentQuestion.type == "value" &&
          <input className="textInput" type="number" onChange={(e) => quizStore.setAnswer(e.target.value)} />
        }
      </div>
    </div>
    {quizStore.quiz.currentQuestion.id >= 0 &&
      <button className="button" onClick={() => quizStore.sendAnswer()}>
        Send answer
      </button>
    }
  </div>
));