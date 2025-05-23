import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./layouts/Dashboard";        // Your main layout component
import Upload from "./components/Landing";        // Component for the "upload" page (assuming Landing.js exports 'Upload')
import Summary from "./components/Summary";       // Component for the "summary" page
import Flashcards from "./components/Flashcards"; // Component for the "flashcards" page
import Quiz from "./components/Quiz";           // Component for the "quiz" page
import Tutor from "./components/Tutor";         // Component for the "tutor" page
import Tracker from "./components/StudyTracker";  // Component for the "tracker" page

function App() {
  return (
    <Router>
      <Routes>
        {/* All routes under here will render inside the Dashboard layout */}
        <Route path="/" element={<Dashboard />}>
          {/* Index route: Renders <Upload /> when the path is exactly "/" */}
          <Route index element={<Upload />} />

          {/* Specific child routes */}
          <Route path="upload" element={<Upload />} />
          <Route path="summary" element={<Summary />} />
          <Route path="flashcards" element={<Flashcards />} />
          <Route path="quiz" element={<Quiz />} />
          <Route path="tutor" element={<Tutor />} />
          <Route path="tracker" element={<Tracker />} />

          {/* Optional: You could add a "Not Found" component for paths within the dashboard
              that don't match any of the above, e.g.:
          <Route path="*" element={<DashboardNotFound />} />
          */}
        </Route>

        {/* Optional: You could add a top-level "Not Found" component for paths
            that don't match "/" or its children, e.g.:
        <Route path="*" element={<GlobalNotFound />} />
        */}
      </Routes>
    </Router>
  );
}

export default App;