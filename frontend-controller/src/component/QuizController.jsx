import { observer } from "mobx-react-lite";
import { quizStore } from "../store/QuizStore";
import { IconPlayerPlayFilled, IconRefresh, IconTrophy, IconLaurelWreath1, IconLaurelWreath2, IconLaurelWreath3 } from '@tabler/icons-react';

/**
 * Handle a press on the restart button.
 */
const handleRestartQuiz = () => {
  const confirmed = window.confirm("Are you sure you want to restart the quiz?");
  if (confirmed) {
    quizStore.restartQuiz();
  }
};

export const QuizController = observer(() => (
  <section className="quiz">
    <div className="data">
      <div className="dataContent">
        <div>
          <div>
            { !quizStore.quizIsFinished &&
              <p className="question">
                {quizStore.quiz.currentQuestion.question}
              </p>
            }
            { quizStore.quizIsFinished &&
              <>
                <p>The winners are:</p>
                {quizStore.ranking.map((winner, idx) => (
                  <label className="radioInput" key={idx}>
                   {idx == 0 && <IconLaurelWreath1 />}
                   {idx == 1 && <IconLaurelWreath2 />}
                   {idx == 2 && <IconLaurelWreath3 />}
                   {winner.name}
                  </label>
                ))}
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
      <div className="controlButtons">
        <button className="button" onClick={() => handleRestartQuiz()}>
          <IconRefresh size={25} stroke={2} /><br /> Restart
        </button>
        {
          !quizStore.quizIsFinished &&
            <button className="button" onClick={() => quizStore.nextQuestion()}>
              <IconPlayerPlayFilled size={25} stroke={2} /><br /> Next question
            </button>
        }
        {
          quizStore.quizIsFinished &&
            <button className="button" onClick={() => quizStore.rankPlayers()}>
              <IconTrophy size={25} stroke={2} /><br /> Rank players
            </button>
        }
      </div>
    </div>
  </section>
));