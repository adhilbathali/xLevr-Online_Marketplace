import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // Keep BrowserRouter here
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter> {/* Keep BrowserRouter here */}
    <App />
  </BrowserRouter>
);