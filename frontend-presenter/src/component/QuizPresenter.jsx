import { observer } from "mobx-react-lite";
import { quizStore } from "../store/QuizStore";
import { QRCodeSVG } from 'qrcode.react';
import { IconLaurelWreath1, IconLaurelWreath2, IconLaurelWreath3 } from '@tabler/icons-react';

export const QuizPresenter = observer(() => (
  <section className="quiz">
    <div className="data">
      <div className="dataContent">
        <div>
          <div>
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
                    <p className="question">
                      {quizStore.ranking.length > 0 ? '🎉 The winners are' : '⏳ The winners are going to be announced soon!'} 
                    </p>
                    {quizStore.ranking.map((winner, idx) => (
                      <label className="radioInput" key={idx}>
                        {idx == 0 && <IconLaurelWreath1 />}
                        {idx == 1 && <IconLaurelWreath2 />}
                        {idx == 2 && <IconLaurelWreath3 />}
                        {winner.name} ({winner.ranking} points)
                      </label>
                    ))}
                  </>
                }

                {!quizStore.quizIsFinished &&
                  <p className="question">
                    {quizStore.quiz.currentQuestion.question}
                  </p>
                }
              </>
            }

          </div>
          {
            quizStore.quiz.currentQuestion.type === "multiplechoice" && (
              <>
                {quizStore.quiz.currentQuestion.choices.map((choice, idx) => (
                  <label className={`radioInput ${((quizStore.timeLeft <= 0) && (idx == quizStore.quiz.currentQuestion.solution.option)) ? 'correct' : ''}`} key={idx}>
                    {choice}
                  </label>
                ))}
              </>
            )
          }
          {
            (quizStore.quiz.currentQuestion.type == "value" && quizStore.timeLeft <= 0 && !quizStore.quizIsFinished) &&
              <p>Solution: {quizStore.quiz.currentQuestion.solution.value}</p>
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