import { observer } from "mobx-react-lite";
import { quizStore } from "../store/QuizStore";
import { IconPlayerStopFilled, IconPlayerPlayFilled, IconPlayerTrackPrevFilled } from '@tabler/icons-react';

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
          <p className="question">
            {quizStore.quizIsFinished ? 'The quiz is finished, announce the winners' : quizStore.quiz.currentQuestion.question}
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
      <div className="controlButtons">
        <button className="button" onClick={() => handleRestartQuiz()}>
          <IconPlayerTrackPrevFilled size={25} stroke={2} />
        </button>
        <button className={`button ${quizStore.canAnswer ? '' : 'disabled'}`} onClick={() => quizStore.finishQuestion()}>
          <IconPlayerStopFilled size={25} stroke={2} />
        </button>
        <button className={`button ${quizStore.quizIsFinished ? 'disabled' : ''}`} onClick={() => quizStore.nextQuestion()}>
          <IconPlayerPlayFilled size={25} stroke={2} />
        </button>
      </div>
    </div>
  </section>
));