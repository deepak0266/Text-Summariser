import React from "react";
import ReactDOM from "react-dom/client"; // 👈 Yeh 'client' se import karo
import "./styles/index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root")); // 👈 createRoot() ka use karo
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
