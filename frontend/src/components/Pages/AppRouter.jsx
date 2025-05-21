import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CalendarPage from "../CalendarPage/CalendarPage";
import DiaryPage from "../DiaryPage/Diary";

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CalendarPage />} />
        <Route path="/diary/:date" element={<DiaryPage />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
