import { observer } from "mobx-react-lite";
import { quizStore } from "../store/QuizStore";

export const Register = observer(() => (
  <div className="data">
    <p className="dataContent">
      Click 'Start playing' to take part in the quiz. Your player's name will be automatically
      assigned and is visible at the top of the screen.
    </p>

    <button className="button" onClick={() => quizStore.register()}>
      Start playing
    </button>
  </div>
));