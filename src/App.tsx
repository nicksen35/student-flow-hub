import "./App.scss";
import React, { useState, useEffect } from "react";
import Header from "./Components/Header/header";
import { Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "./Components/Widgets/dashboard";
import ClassroomWidgetPage from "./Components/Widgets/WidgetOptions/classroomwidget";
import GmailWidgetPage from "./Components/Widgets/WidgetOptions/gmailwidget";
import ToDoWidgetPage from "./Components/Widgets/WidgetOptions/todowidget";
import ProjectsWidgetPage from "./Components/Widgets/WidgetOptions/projectswidget";
import TimerWidgetPage from "./Components/Widgets/WidgetOptions/timerwidget";
import CalendarWidgetPage from "./Components/Widgets/WidgetOptions/calendarwidget";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function App() {

  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/oauthcallback')
      .then((response) => {
        console.log(response)
        if (response.data.loggedIn) {
          setIsLoggedIn(true);
        }
      })
      .catch((error) => {
        console.error('Error checking login status:', error);
      });
  }, []);

  const handleLogin = () => {
    window.location.href = '/auth/google'; 
  };

  const handleLogout = () => {
    axios.get('/logout') 
      .then(() => {
        setIsLoggedIn(false);
      })
      .catch((error) => {
        console.error('Error logging out:', error);
      });
  };

  return (
    <>
     {isLoggedIn ? (
      <>
          <Header />
          <Routes>
            <Route
              path="/"
              element={<Navigate to="dashboard" replace={true} />}
            />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="classroom" element={<ClassroomWidgetPage />} />
            <Route path="gmail" element={<GmailWidgetPage />} />
            <Route path="calendar" element={<CalendarWidgetPage />} />
            <Route path="projects/:page" element={<ProjectsWidgetPage />} />
            <Route path="timer/:page" element={<TimerWidgetPage />} />
            <Route path="todo/:page" element={<ToDoWidgetPage />} />
          </Routes>
          </>
     ):(
      <button onClick={handleLogin} > Login With Google </button>
     )}
    </>
  );
}

export default App;
