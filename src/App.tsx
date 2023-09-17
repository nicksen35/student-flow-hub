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
import { googleLogout } from "@react-oauth/google";
import { gapi } from "gapi-script";
import axios from "axios";

const scopes = [
  "https://www.googleapis.com/auth/classroom.courses",
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/calendar.readonly",
  // Add more scopes as needed
];
const scope = scopes.join(" "); // Combine the scopes into a single string
const discoverydocs = [
  "https://classroom.googleapis.com/$discovery/rest?version=v1",
  "https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest",
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
];

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
  const [isSignedIn, setSignedIn] = useState<boolean>(false)
  const [profile, setProfile] = useState<UserProfile | null>(null);
  function initClient() {
    gapi.load("client:auth2", function () {
      gapi.client
        .init({
          apiKey: import.meta.env.VITE_APIKEY,
          clientId: import.meta.env.VITE_CLIENTID,
          discoveryDocs: discoverydocs,
          scope: scope,
        })
        .then(function () {
          gapi.auth2
            .getAuthInstance()
            .signIn()
            .then(() => {
              // After sign-in, get the access token
              const accessToken = gapi.auth2
                .getAuthInstance()
                .currentUser.get()
                .getAuthResponse().access_token;
              const user = gapi.auth2.getAuthInstance().currentUser.get();
              setSignedIn(gapi.auth2.getAuthInstance().currentUser.get().isSignedIn());
              setUser(user);
              gapi.auth2.getAuthInstance().currentUser.get().grantOfflineAccess().then((response) => {
                const authCode = response.code;
                // Now you have the authorization code (authCode)
                console.log('Authorization Code:', authCode);
                if (user) {
                  axios
                    .post('http://localhost:3000/exchange-tokens', {
                      code: authCode,
                    })
                    .then((response) => {
                      const refresh_token = response.data.refresh_token
                      console.log(refresh_token);
                    })
                    .catch((error) => {
                      console.error(error);
                    });
                }
              })
              
            })
            .catch(function (error) {
              console.error("Error initializing Google API client:", error);
            });

              
            
        });
    });
  }
  
  function classroomAPICall() {
    gapi.client.classroom.courses
      .list()
      .then(function (response) {
        console.log(response.result);
      })
      .catch(function (error) {
        console.error("Error making Classroom API request:", error);
      });
  }
  function gmailAPICall() {
    gapi.client.gmail.users.messages
      .get()
      .then(function (response) {
        console.log(response.result);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  useEffect(() => {
    if (user) {
      classroomAPICall();
      //gmailAPICall();
    }
  }, [user]);

  const logOut = () => {
    googleLogout();
    setProfile(null);
  };

  return (
    <>
      {isSignedIn ? (
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
        <button onClick={() => initClient()}>Sign in with Google 🚀 </button>
      )}
    </>
  );
}
export default App;
