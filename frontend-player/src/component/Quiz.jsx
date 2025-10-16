import { observer } from "mobx-react-lite";
import { quizStore } from "../store/QuizStore";
import { Register } from "./Register";
import { Questions } from "./Questions";

export const Quiz = observer(() => (
  <section className="quiz">
    {
      !quizStore.registered && <Register />
    }

    {
      quizStore.registered && <Questions />
    }
  </section>
));