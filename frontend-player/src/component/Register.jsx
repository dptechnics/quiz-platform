import { observer } from "mobx-react-lite";
import { quizStore } from "../store/QuizStore";

export const Register = observer(() => (
  <div className="register">
    <p>
      Click register to take part in the Quiz.
    </p>
    
    <button className="button" onClick={() => quizStore.register()}>
      <span>Register</span>
    </button>
  </div>
));