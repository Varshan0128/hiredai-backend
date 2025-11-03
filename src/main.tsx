import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
// IMPORT YOUR AUTHPROVIDER HERE
import { AuthProvider } from './context/AuthContext'; // <--- THIS PATH IS CRUCIAL!

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    {/* WRAP YOUR ENTIRE APP WITH AUTHPROVIDER */}
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);