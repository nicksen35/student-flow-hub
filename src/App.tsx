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
import axios from "axios";

interface User {
  access_token: string;
  // Add other properties you expect in the user object here
}

interface UserProfile {
  // Define the profile properties you expect here
  id: string;
  email: string;
  // Add other properties you expect in the profile here
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log("Login Failed:", error),
  });

  useEffect(() => {
    if (user) {
      axios
        .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
            Accept: "application/json",
          },
        })
        .then((res: any) => {
          setProfile(res.data);
          console.log(res.data)
          console.log(user.access_token)
          axios.post("http://localhost:3000/api/save-token", { accessToken: user.access_token })
            .then((response) => {
              console.log(response)
              console.log(response.data);
            })
            .catch((error) => {
              console.error('Failed to send access token to server:', error);
            });
        })
        .catch((err: any) => console.log(err));
    }
  }, [user]);


  const logOut = () => {
    googleLogout(); 
    setProfile(null);
  };

  return (
    <>
      {profile ? (
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
      ) : (
        <button onClick={() => login()}>Sign in with Google 🚀 </button>
      )}
    </>
  );
}
export default App;

