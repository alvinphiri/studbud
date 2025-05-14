import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./layouts/Dashboard";
import Upload from "./components/Landing";
import Summary from "./components/Summary";
import Flashcards from "./components/Flashcards";
import Quiz from "./components/Quiz";
import Tutor from "./components/Tutor";
import Tracker from "./components/StudyTracker";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />}>
          <Route path="upload" element={<Upload />} />
          <Route path="summary" element={<Summary />} />
          <Route path="flashcards" element={<Flashcards />} />
          <Route path="quiz" element={<Quiz />} />
          <Route path="tutor" element={<Tutor />} />
          <Route path="tracker" element={<Tracker />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
