import { observer } from "mobx-react-lite";
import { quizStore } from "../store/QuizStore";

export const ProgressBar = observer(() => (
  <>
    {
      (quizStore.registered && !quizStore.quizIsFinished ) &&
      <div className="progressBar" style={{ width: `${quizStore.percentRemaining}%` }}></div>
    }
  </>
));