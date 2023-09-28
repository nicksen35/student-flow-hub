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
  const [user, setCurrentUser] = useState();
  const [assignments, setAssignments] = useState([]);
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
  async function getAssignments(courseIds: string[]) {
    try {
      console.log("multiple function calls!!");
      const allAssignments = [];
      // Use Promise.all to make API calls for each course in parallel
      await Promise.all(
        courseIds.map(async (courseId) => {
          const response = await gapi.client.classroom.courses.courseWork.list({
            courseId: courseId,
          });

          if (response.result.courseWork) {
            const courseAssignments = response.result.courseWork.map(
              (assignment) => {
                const { title, dueDate, dueTime, description, alternateLink } =
                  assignment;
                return {
                  coursework_title: title,
                  coursework_dueDate: dueDate,
                  coursework_dueTime: dueTime,
                  coursework_description: description,
                  coursework_altlink: alternateLink,
                };
              }
            );
            allAssignments.push(...courseAssignments);
          } else {
            console.error(`Could not find assignments for course ${courseId}`);
          }
        })
      );

      // Sort assignments by due date
      allAssignments.sort((a, b) => {
        if (a.coursework_dueDate && b.coursework_dueDate) {
          const dueDateA = new Date(
            a.coursework_dueDate.year,
            a.coursework_dueDate.month - 1,
            a.coursework_dueDate.day
          );
          const dueDateB = new Date(
            b.coursework_dueDate.year,
            b.coursework_dueDate.month - 1,
            b.coursework_dueDate.day
          );
          return dueDateB - dueDateA;
        } else if (a.coursework_dueDate) {
          return -1;
        } else if (b.coursework_dueDate) {
          return 1;
        } else {
          return 0;
        }
      });
      setAssignments(allAssignments);
      console.log(assignments);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  }

  function getCourseWork(courseIds: string[]) {
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
  function getGrades(courseIds: string[], courseWorkId: string) {
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
        const courseIds = [];
        courses.forEach(function (course) {
          courseIds.push(course.id);
          console.log(courseIds);
        });
        console.log("Fetching announcements for course with ID: " + courseIds);
        switch (type) {
          case "Assignments":
            console.log("calling this function mroe than once");
            getAssignments(courseIds);
            break;
          case "Announcements":
            getAnnouncementsForCourse(courseIds);
            break;
          case "Grades":
            getCourseWork(courseIds);
            break;
          case "Teacher":
            getClassRoster(courseIds);
        }
      } else {
        console.log("No courses found.");
      }
    });
  }
  function getAnnouncementsForCourse(courseIds: string[]) {
    gapi.client.classroom.courses.announcements
      .list({
        courseId: courseId,
      })
      .then(function (response) {
        console.log("Announcements for course with ID " + courseId + ":");
        console.log(response.result);
      });
  }
  function getClassRoster(courseIds: string[]) {
    gapi.client.classroom.courses.teachers
      .list({
        courseId: courseId,
      })
      .then(function (response) {
        console.log(response.result);
      });
  }
  useEffect(() => {
    const authInstance = gapi.auth2.getAuthInstance();
    setCurrentUser(authInstance.currentUser.get());
    if (user) {
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
    }
  }, [CRWidget.widget1, user]);

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
              <a key={index} onClick={() => handleHeaderChange(index)}>
                {" "}
                {options}{" "}
              </a>
            ))}
          </div>
        </div>
        <div className="classroomcontent" onClick={prop.onClick}>
          {user &&
            (() => {
              switch (CRWidget.widget1) {
                case classroomdropdownoptions[0]:
                  return (
                    <div className="content-wrapper">
                      {assignments.map((assignment, index) => (
                        <p key={index} className="classroom-contentp">{assignment.coursework_title} - OverflowingTxextjktljr </p>
                      ))}
                    </div>
                  );
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
                  break;
                default:
                  break;
              }
            })()}
        </div>
      </div>
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
