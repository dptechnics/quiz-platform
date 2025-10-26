import { observer } from "mobx-react-lite";
import { quizStore } from "../store/QuizStore";
import { QuizController } from "./QuizController";
import { useEffect } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { ProgressBar } from "./ProgressBar";

const App = observer(() => {
  useEffect(() => {
    quizStore.getQuiz();
    quizStore.connect();

  }, []);

  return (
    <>
      <div className="content">
        <Header />
        <QuizController />
        <ProgressBar />
      </div>
      <Footer />
    </>
  )
});

export default App
