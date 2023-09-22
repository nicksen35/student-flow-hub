import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FC } from "react";
import WidgetTitle from "../Widgets/widgettitle";
import calendarImage from "../../assets/Calendar.png";
import gmailImage from "../../assets/GmailLogo.png";
import classroomImage from "../../assets/Google_Classroom_Logo.png";
import projectsImage from "../../assets/Projects.png";
import todoImage from "../../assets/ToDoList.png";
import timerImage from "../../assets/Timer.png";

const Dashboard = () => {
  const [classes, setClasses] = useState([]);
  const classroomdropdownoptions = [
    "Assignments",
    "Classes",
    "Announcements",
    "Grades",
    "Teachers",
  ];
  const [CRWidget, setCRWidget] = useState({
    widget1: classroomdropdownoptions[0]
  });
  function classroomAPICall() {
    gapi.client.classroom.courses
      .list()
      .then(function (response) {
        console.log(response.result.courses);
        setClasses(response.result.courses);
      })
      .catch(function (error) {
        console.error("Error making Classroom API request:", error);
      });
  }

  useEffect(() => {
    classroomAPICall();
  }, []);

  useEffect(() => {
    // This useEffect will run whenever the "classes" state changes
    console.log(classes);
  }, [classes]);

  interface WidgetProp {
    onClick: () => void;
    WidgetName?: string;
    WidgetID?: number;
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
    const handleHeaderChange = (event: number) => {
      setCRWidget((prevState) => ({
        ...prevState,
        [`widget${prop.WidgetID}`]: classroomdropdownoptions[event],
      }));
      console.log(event);
    };
    return (
      <>
        <div className="classroomwidget" onClick={prop.onClick}>
          <div className="classroomwidgetheader">
            <WidgetTitle
              widgettitle="Google Classroom"
              imageSource={classroomImage}
            />
          </div>
          <div className="dsb-classroomdropdown">
            <div className="dsb-subtitle">
              <button className="dsb-widgetname">{prop.WidgetName} <i className="dashboarddown" ></i></button>

                
            </div>
            <div className="dsbclassroom-content">
              {classroomdropdownoptions.map((options, index) => (
                <>
                  <a key={index} onClick={() => handleHeaderChange(index)}>
                    {" "}
                    {options}{" "}
                  </a>
                </>
              ))}
            </div>
          </div>
          <div className="classroomcontent">
            {classes.map((course) => (
              <div className="class" key={course.id}>
                {course.name}
              </div>
            ))}
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
  const navigate = useNavigate();
  return (
    <>
      <div className="widgetcontainer">
        <div className="topwidgetcontainer">
          <ClassroomWidget onClick={() => navigate("/classroom")} WidgetName={CRWidget.widget1} WidgetID={0} />
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
