import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter as Router} from 'react-router-dom'
import { GoogleOAuthProvider } from "@react-oauth/google"
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <GoogleOAuthProvider clientId="389992701916-753vivjpdsjn0fk6r292gdhjldei82s7.apps.googleusercontent.com">
        <App />
      </GoogleOAuthProvider>
    </Router>
  </React.StrictMode>
);