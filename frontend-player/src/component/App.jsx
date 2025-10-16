import { observer } from "mobx-react-lite";
import { quizStore } from "../store/QuizStore";
import { useEffect } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Quiz } from "./Quiz";

const App = observer(() => {
  useEffect(() => {
    quizStore.getQuiz();
    quizStore.connect();

  }, []);

  return (
    <>
      <div className="content">
        <Header />
        <Quiz />
      </div>
      <Footer />
    </>
  )
});

export default App
