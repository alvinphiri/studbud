// App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./layouts/Dashboard";    // Expects a default export from Dashboard.js
import Upload from "./components/Landing";      // Expects a default export from Landing.js
import Summary from "./components/Summary";     // Expects a default export from Summary.js
import Flashcards from "./components/Flashcards"; // Expects a default export from Flashcards.js
import Quiz from "./components/Quiz";           // Expects a default export from Quiz.js
import Tutor from "./components/Tutor";         // Expects a default export from Tutor.js
import Tracker from "./components/StudyTracker";// Expects a default export from StudyTracker.js

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />}>
          <Route index element={<Upload />} />
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