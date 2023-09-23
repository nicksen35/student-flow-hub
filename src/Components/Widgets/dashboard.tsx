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
  const [classroomInfo, setClassroomInfo] = useState([]);
  const classroomdropdownoptions = [
    "Assignments",
    "Classes",
    "Announcements",
    "Grades",
    "Teachers",
  ];
  const [CRWidget, setCRWidget] = useState({
    widget1: classroomdropdownoptions[0],
  });
  function fetchCourses() {
    gapi.client.classroom.courses
      .list()
      .then(function (response) {
        console.log(response.result.courses);
        setClassroomInfo(response.result.courses);
      })
      .catch(function (error) {
        console.error("Error making Classroom API request:", error);
      });
  }
  function getAssignments(courseId: string) {
    gapi.client.classroom.courses.courseWork
      .list({
        courseId: courseId,
      })
      .then(function (response) {
        console.log(response.result);
      });
  }
  function getCourseWork(courseId: string) {
    gapi.client.classroom.courses.courseWork
      .list({
        courseId: courseId,
      })
      .then(function (response) {
        console.log(response.result);
        const courseWorks = response.result.courseWork;
        if (courseWorks && courseWorks.length > 0) {
          courseWorks.forEach(function (courseWork) {
            const courseWorkId: string = courseWork.id;
            console.log(courseWorkId);
            getGrades(courseId, courseWorkId);
          });
        }
      });
  }
  function getGrades(courseId: string, courseWorkId: string) {
    gapi.client.classroom.courses.courseWork.studentSubmissions
      .list({
        courseId: courseId,
        courseWorkId: courseWorkId,
      })
      .then(function (response) {
        console.log(response.result);
      })
      .catch(function (error) {
        console.error("Error fetching student submissions:", error);
      });
  }

  function fetchWithCourseId(type: string) {
    gapi.client.classroom.courses.list().then(function (response) {
      const courses = response.result.courses;

      if (courses && courses.length > 0) {
        courses.forEach(function (course) {
          const courseId = course.id;
          console.log("Fetching announcements for course with ID: " + courseId);
          switch (type) {
            case "Assignments":
              getAssignments(courseId);
              break;
            case "Announcements":
              getAnnouncementsForCourse(courseId);
              break;
            case "Grades":
              getCourseWork(courseId);
              break;
            case "Teacher":
              getClassRoster(courseId);
          }
        });
      } else {
        console.log("No courses found.");
      }
    });
  }
  function getAnnouncementsForCourse(courseId: string) {
    gapi.client.classroom.courses.announcements
      .list({
        courseId: courseId,
      })
      .then(function (response) {
        console.log("Announcements for course with ID " + courseId + ":");
        console.log(response.result);
      });
  }
  function getClassRoster(courseId: string) {
    gapi.client.classroom.courses.teachers
      .list({
        courseId: courseId,
      })
      .then(function (response) {
        console.log(response.result);
      });
  }
  useEffect(() => {
    switch (CRWidget.widget1) {
      case classroomdropdownoptions[0]:
        fetchWithCourseId("Assignments");
        break;
      case classroomdropdownoptions[1]:
        console.log("hI MOM");
        fetchCourses();
        break;
      case classroomdropdownoptions[2]:
        fetchWithCourseId("Announcements");
        break;
      case classroomdropdownoptions[3]:
        fetchWithCourseId("Grades");
        break;
      case classroomdropdownoptions[4]:
        fetchWithCourseId("Teacher");
    }
  }, [CRWidget.widget1]);

  useEffect(() => {
    // This useEffect will run whenever the "classes" state changes
    console.log(classroomInfo);
  }, [classroomInfo]);

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
        <div className="classroomwidget">
          <div className="classroomwidgetheader">
            <WidgetTitle
              widgettitle="Google Classroom"
              imageSource={classroomImage}
            />
          </div>
          <div className="dsb-classroomdropdown">
            <div className="dsb-subtitle">
              <button className="dsb-widgetname">
                {prop.WidgetName} <i className="dashboarddown"></i>
              </button>
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
          <div className="classroomcontent" onClick={prop.onClick}>
            {classroomInfo.map((course) => (
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
          <ClassroomWidget
            onClick={() => navigate("/classroom")}
            WidgetName={CRWidget.widget1}
            WidgetID={1}
          />
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
