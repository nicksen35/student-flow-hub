import { useNavigate } from "react-router-dom";
import { FC } from "react";
import WidgetTitle from "../Widgets/widgettitle";
import calendarImage from "../../assets/Calendar.png";
import gmailImage from "../../assets/GmailLogo.png";
import classroomImage from "../../assets/Google_Classroom_Logo.png";
import projectsImage from "../../assets/Projects.png";
import todoImage from "../../assets/ToDoList.png";
import timerImage from "../../assets/Timer.png";

interface WidgetProp {
  onClick: () => void;
}
const CalendarWidget: FC<WidgetProp> = (prop) => {
  return (
    <>
      <div className="calendarwidget" onClick={prop.onClick}>
        <div className="calendarwidgetheader">
          <WidgetTitle
            widgettitle="Google Calendar"
            imageSource={calendarImage}
          />
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
          <WidgetTitle widgettitle="Gmail" imageSource={gmailImage} />
        </div>
        <p> Hello</p>
      </div>
    </>
  );
};
const ClassroomWidget: FC<WidgetProp> = (prop) => {
  return (
    <>
      <div className="classroomwidget" onClick={prop.onClick}>
        <div className="classroomwidgetheader">
          <WidgetTitle
            widgettitle="Google Classroom"
            imageSource={classroomImage}
          />
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
          <WidgetTitle widgettitle="Projects" imageSource={projectsImage} />
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
          <WidgetTitle widgettitle="To-Do List" imageSource={todoImage} />
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
          <WidgetTitle widgettitle="Timer" imageSource={timerImage} />
        </div>
      </div>
    </>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="widgetcontainer">
        <div className="topwidgetcontainer">
          <ClassroomWidget onClick={() => navigate("/classroom")} />
          <CalendarWidget onClick={() => navigate("/calendar")} />
          <GmailWidget onClick={() => navigate("/gmail")} />
        </div>
        <div className="bottomwidgetcontainer">
          <TimerWidget onClick={() => navigate("/timer/Timer")} />
          <ToDoWidget onClick={() => navigate("/todo/Home")} />
          <ProjectsWidget onClick={() => navigate("/projects/Home")} />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
