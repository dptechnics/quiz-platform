import { observer } from "mobx-react-lite";
import { quizStore } from "./store/QuizStore";
import { useEffect } from "react";

const Register = observer(() => (
  <div className="card">
    <p>
      Click register to take part in the Quiz.
    </p>
    <button onClick={() => quizStore.register()}>Register</button>
  </div>
));

const Questions = observer(() => (
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

const App = observer(() => {
  useEffect(() => {
    quizStore.getQuiz();
    quizStore.connect();

  }, []);

  return (
    <>
      <h1>{quizStore.quiz.title}</h1>
      <p className="read-the-docs">
        You are {quizStore.player.name}
      </p>

      {
        !quizStore.registered && <Register />
      }

      {
        quizStore.registered && <Questions />
      }
    </>
  )
});

export default App
