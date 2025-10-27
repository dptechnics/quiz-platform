import { observer } from "mobx-react-lite";
import { quizStore } from "../store/QuizStore";
import { QRCodeSVG } from 'qrcode.react';

export const QuizPresenter = observer(() => (
  <section className="quiz">
    <div className="data">
      <div className="dataContent">
        <div>


          <p className="question">
            {quizStore.quiz.currentQuestion.id < 0 &&
              <>
                <p>Scan the QR code to play</p>
                <QRCodeSVG size="320" fgColor="#FFFFFF" bgColor="#00000000" level="H"  value="https://play.quiz.platform.dptechnics.com" />
              </>
            }
            {quizStore.quiz.currentQuestion.id >= 0 &&
              <>
                {quizStore.quizIsFinished &&
                  <>
                    And the winners are
                  </>
                }

                {!quizStore.quizIsFinished &&
                  <>
                    {quizStore.quiz.currentQuestion.question}
                  </>
                }
              </>
            }

          </p>
          {
            quizStore.quiz.currentQuestion.type === "multiplechoice" && (
              <>
                {quizStore.quiz.currentQuestion.choices.map((choice, idx) => (
                  <label className="radioInput" key={idx}>
                    {choice}
                  </label>
                ))}
              </>
            )
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
  </section>
));