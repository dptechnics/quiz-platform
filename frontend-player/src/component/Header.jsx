import { observer } from "mobx-react-lite";
import { quizStore } from "../store/QuizStore";

export const Header = observer(() => (
  <section className="header">
    <h1>{quizStore.quiz.title}</h1>
    <p>
        Player: {quizStore.player.name}
    </p>
  </section>
));