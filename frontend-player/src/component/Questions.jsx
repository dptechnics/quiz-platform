import { observer } from "mobx-react-lite";
import { quizStore } from "../store/QuizStore";

export const Questions = observer(() => (
  <div className="data">
    <div className="dataContent">
      <div>
        <p className="question">
          {quizStore.quizIsFinished ? `🎉 The winners are now being announced! Please keep this webapp open to preserve proof of your player name (${quizStore.player.name}) to claim your prize.` : quizStore.quiz.currentQuestion.question}
        </p>
        {
          !quizStore.quizIsFinished &&
          <>
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
          </>
        }
      </div>
    </div>
    {(quizStore.quiz.currentQuestion.id >= 0 && !quizStore.quizIsFinished) &&
      <button className={`button ${quizStore.canAnswer && !quizStore.answerConfirmed > 0 ? '' : 'disabled'}`} onClick={() => quizStore.sendAnswer()}>
        {
          !quizStore.answerConfirmed &&
          <>
            {
              quizStore.canAnswer && <>Send answer</>
            }
            {
              !quizStore.canAnswer && <>Time's up</>
            }
          </>
        }
        {
          quizStore.answerConfirmed &&
          <>
            Thank you
          </>
        }

      </button>
    }
  </div>
));