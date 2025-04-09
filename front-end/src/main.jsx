import React from "react";
import ReactDOM from "react-dom/client";
// Remove the BrowserRouter import from here if it's not used elsewhere in this file
// import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <BrowserRouter> {/* <-- REMOVE THIS WRAPPER */}
    <React.StrictMode> {/* Optional: Keep StrictMode if you had it */}
      <App /> {/* Render App directly. App component itself contains the Router */}
    </React.StrictMode>
  // </BrowserRouter> {/* <-- REMOVE THIS WRAPPER */}
);