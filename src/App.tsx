import "./App.scss";
import Header from "./Components/Header/header";
import { Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "./Components/Widgets/dashboard";
import ClassroomWidgetPage from "./Components/Widgets/WidgetOptions/classroomwidget";
import GmailWidgetPage from "./Components/Widgets/WidgetOptions/gmailwidget";
import ToDoWidgetPage from "./Components/Widgets/WidgetOptions/todowidget";
import ProjectsWidgetPage from "./Components/Widgets/WidgetOptions/projectswidget";
import TimerWidgetPage from "./Components/Widgets/WidgetOptions/timerwidget";
import CalendarWidgetPage from "./Components/Widgets/WidgetOptions/calendarwidget";


function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="dashboard" replace={true} />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="classroom" element={<ClassroomWidgetPage />} />
        <Route path="gmail" element={<GmailWidgetPage />} />
        <Route path="calendar" element={<CalendarWidgetPage />} />
        <Route path="projects/:page" element={<ProjectsWidgetPage />} />
        <Route path="timer/:page" element= {<TimerWidgetPage />} />
        <Route path="todo/:page" element={<ToDoWidgetPage />} />
      </Routes>
    </>
  );
}

export default App;
