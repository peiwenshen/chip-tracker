import React from "react";
import ReactDOM from "react-dom/client";
import ChipTracker from "./ChipTracker";
import "./index.css"; // Ensures Tailwind styles are imported

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChipTracker />
  </React.StrictMode>
);