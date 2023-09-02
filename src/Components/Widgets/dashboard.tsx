
import {useState} from 'react'
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import { FC } from "react";
import WidgetTitle from "../Widgets/widgettitle";
import ClassroomWidgetPage from './WidgetOptions/classroomwidget';

interface WidgetProp {
    onClick: () => void;
  }
  const CalendarWidget: FC<WidgetProp> = (prop) => {
    return (
      <>
        <div className="calendarwidget" onClick={prop.onClick}>
          <div className="calendarwidgetheader">
            <WidgetTitle widgettitle="Google Calendar" imageSource="src\assets\Calendar.png"/>
          </div>
        </div>
      </>
    );
  };
  
  const GmailWidget: FC<WidgetProp> = (prop) => {
    return (
      <>
        <div className="gmailwidget" onClick={prop.onClick}>
          <div className="gmailwidgetheader">
            <WidgetTitle widgettitle="Gmail" imageSource="src\assets\GmailLogo.png"/>
          </div>
        </div>
      </>
    );
  };
  const ClassroomWidget: FC<WidgetProp> = (prop) => {
    return (
      <>
        <div className="classroomwidget" onClick={prop.onClick}>
          <div className="classroomwidgetheader">
            <WidgetTitle widgettitle="Google Classroom" imageSource="src\assets\Google_Classroom_Logo.png"/>
          </div>
        </div>
      </>
    );
  };

  const ProjectsWidget: FC<WidgetProp> = (prop) => {
    return (
      <>
        <div className="projectswidget" onClick={prop.onClick}>
          <div className="projectswidgetheader">
            <WidgetTitle widgettitle="Projects" imageSource="src\assets\Projects.png"/>
          </div>
        </div>
      </>
    );
  };

  const ToDoWidget: FC<WidgetProp> = (prop) => {
    return (
      <>
        <div className="todowidget" onClick={prop.onClick}>
          <div className="todowidgetheader">
            <WidgetTitle widgettitle="To-Do List" imageSource="src\assets\ToDoList.png"/>
          </div>
        </div>
      </>
    );
  };
  const TimerWidget: FC<WidgetProp> = (prop) => {
    return (
      <>
        <div className="timerwidget" onClick={prop.onClick}>
          <div className="timerwidgetheader">
            <WidgetTitle widgettitle="Timer" imageSource="src\assets\Timer.png"/>
          </div>
        </div>
      </>
    );
  };
  




const Dashboard = () => {
  const [activeWidget, setActiveWidget] = useState("");
  console.log(activeWidget)
  const renderWidgetPage = () => {
    switch (activeWidget) {
      case 'Google Classroom':
        console.log("HEllo");
        return (
          <ClassroomWidgetPage />
        ) 
      /*case 'Google Calendar':
        return <CalendarWidgetPage />;
      case 'Gmail':
        return <GmailWidgetPage />;
      case 'To-Do List':
        return <ToDoWidgetPage />;
      case 'Projects':
        return <ProjectsWidgetPage />;
      case 'Timer':
        return <TimerWidgetPage />; */
      default:
        return null;
    }}
  return (
    <>
    <Router>
    {activeWidget === "" ? (
      <div className="widgetcontainer">
        <div className="topwidgetcontainer">
          <ClassroomWidget onClick={() => setActiveWidget("Google Classroom")}/>
          <CalendarWidget onClick={() => setActiveWidget("Google Calendar")} />
          <GmailWidget onClick={() => setActiveWidget("Gmail")} /> 
        </div>
        <div className="bottomwidgetcontainer">
            <TimerWidget onClick={() => setActiveWidget("Timer")} />
            <ToDoWidget onClick={() => setActiveWidget("To-Do List")}/> 
            <ProjectsWidget onClick={() => setActiveWidget("Projects")}/> 
        </div>
      </div>
    ): (
      renderWidgetPage()
    )}
      </Router>
    </>
  );
};

export default Dashboard;
