import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChipTracker from "./ChipTracker";
import Settings from "./Settings";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router basename="/chip-tracker"> {/* ✅ Fix: Add basename */}
      <Routes>
        <Route path="/" element={<ChipTracker />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  </React.StrictMode>
);