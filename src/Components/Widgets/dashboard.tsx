import CalendarWidget from "./WidgetOptions/calendarwidget";
import ClassroomWidget from "./WidgetOptions/classroomwidget";
import GmailWidget from "./WidgetOptions/gmailwidget";
import ToDoWidget from "./WidgetOptions/todowidget";
import ProjectsWidget from "./WidgetOptions/projectswidget";
import TimerWidget from "./WidgetOptions/timerwidget";
const Dashboard = () => {
  return (
    <>
      <div className="widgetcontainer">
        <div className="topwidgetcontainer">
          <ClassroomWidget />
          <CalendarWidget />
          <GmailWidget /> 
        </div>
        <div className="bottomwidgetcontainer">
            <TimerWidget />
            <ToDoWidget /> 
            <ProjectsWidget /> 
        </div>
      </div>
    </>
  );
};

export default Dashboard;
