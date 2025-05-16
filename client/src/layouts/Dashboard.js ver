import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <nav>
        <NavLink to="/upload">Upload</NavLink>
        <NavLink to="/summary">Summary</NavLink>
        <NavLink to="/flashcards">Flashcards</NavLink>
        <NavLink to="/quiz">Quiz</NavLink>
        <NavLink to="/tutor">Tutor</NavLink>
        <NavLink to="/tracker">Progress</NavLink>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
