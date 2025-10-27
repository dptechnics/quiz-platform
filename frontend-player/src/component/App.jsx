import { observer } from "mobx-react-lite";
import { quizStore } from "../store/QuizStore";
import { useEffect } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Quiz } from "./Quiz";
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
        <Quiz />
        <ProgressBar />
      </div>
      <Footer />
    </>
  )
});

export default App
