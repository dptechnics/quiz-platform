import { observer } from "mobx-react-lite";
import { quizStore } from "../store/QuizStore";
import { useEffect } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { ProgressBar } from "./ProgressBar";
import { QuizPresenter } from "./QuizPresenter";

const App = observer(() => {
  useEffect(() => {
    quizStore.getQuiz();
    quizStore.connect();

  }, []);

  return (
    <>
      <div className="content">
        <Header />
        <QuizPresenter />
        <ProgressBar />
      </div>
      <Footer />
    </>
  )
});

export default App
