// ./layouts/Dashboard.js
import React from 'react';
import { Outlet, Link } from 'react-router-dom'; // Import Outlet and Link

function Dashboard() {
  return (
    <div>
      <header>
        <h1>Study Application Dashboard</h1>
        <nav style={{ marginBottom: '20px' }}>
          <Link to="/upload" style={{ marginRight: '10px' }}>Upload</Link>
          <Link to="/summary" style={{ marginRight: '10px' }}>Summary</Link>
          <Link to="/flashcards" style={{ marginRight: '10px' }}>Flashcards</Link>
          <Link to="/quiz" style={{ marginRight: '10px' }}>Quiz</Link>
          <Link to="/tutor" style={{ marginRight: '10px' }}>Tutor</Link>
          <Link to="/tracker">Study Tracker</Link>
        </nav>
      </header>
      <hr />
      <main>
        {/* Child route components (Upload, Summary, etc.) will render here */}
        <Outlet />
      </main>
      <footer style={{ marginTop: '20px', borderTop: '1px solid #ccc', paddingTop: '10px' }}>
        <p>&copy; {new Date().getFullYear()} Your Study App</p>
      </footer>
    </div>
  );
}

export default Dashboard; // This is the crucial part: default export