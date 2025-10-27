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
                    <label className={`radioInput ${((quizStore.timeLeft <= 0) && (idx == quizStore.quiz.currentQuestion.solution.option)) ? 'correct' : ''}`} key={idx}>
                      <input
                        type="radio"
                        name="answers"
                        value={idx}
                        checked={quizStore.currentAnswer === idx}
                        onChange={() => quizStore.setAnswer(idx)}
                        disabled={quizStore.timeLeft <= 0}
                      />
                      {choice}
                    </label>
                  ))}
                </>
              )
            }
            {
              quizStore.quiz.currentQuestion.type == "value" &&
              <>
                <input className="textInput" type="number" onChange={(e) => quizStore.setAnswer(e.target.value)} disabled={quizStore.timeLeft <= 0} />
                {
                  quizStore.timeLeft <= 0 &&
                  <p>Solution: {quizStore.quiz.currentQuestion.solution.value}</p>
                }
              </>
            }
          </>
        }
      </div>
    </div>
    {(quizStore.quiz.currentQuestion.id >= 0 && !quizStore.quizIsFinished) &&
      <div className={`timerDisplay ${quizStore.timeLeft <= 0 ? "timesUp" : ""}`}>
          {quizStore.timeLeft > 0 ? (
            <p>⏳ Time left: {quizStore.timeLeft}s</p>
          ) : (
            <p>⏰ Time's up!</p>
          )}
        </div>
    }
  </div>
));