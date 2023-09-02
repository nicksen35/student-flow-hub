import { useState } from "react";
import "./App.scss";
import Header from "./Components/Header/header";
import { Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "./Components/Widgets/dashboard";
import ClassroomWidgetPage from "./Components/Widgets/WidgetOptions/classroomwidget";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="dashboard" replace={true} />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="classroom" element={<ClassroomWidgetPage />} />
      </Routes>
    </>
  );
}

export default App;
