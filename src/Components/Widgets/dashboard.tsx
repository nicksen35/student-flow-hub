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
import { GetCalendarsIds, GetEvents } from "./calendarfunctions";
import Calendar from "react-calendar";
import "../../ReactCalendar.scss";
import Cookies from "js-cookie";
import {
  getAssignments,
  fetchCourses,
  getAnnouncementsForCourse,
  getClassRoster,
  getGrades,
} from "./classroomfunctions";

import { GetMail } from "./gmailfunctions";
const Dashboard = () => {
  const [classroomInfo, setClassroomInfo] = useState([]);
  const [user, setCurrentUser] = useState();
  const [assignments, setAssignments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [teachers, getTeachers] = useState([]);
  const [mail, setMail] = useState([]);
  const [fetchMail, setFetchMail] = useState(true);
  const [courseWork, setCourseWork] = useState();
  const [grades, setGrades] = useState([]);
  const [userevents, setEvents] = useState([]);

  const classroomdropdownoptions = [
    "Assignments",
    "Classes",
    "Announcements",
    "Grades",
    "Teachers",
  ];
  const todolistdropdown = ["Home", "Today", "Upcoming", "Starred"];
  const [TDWidget, setTDWidget] = useState({
    widget1: todolistdropdown[0],
  });
  const [CRWidget, setCRWidget] = useState({
    widget1: classroomdropdownoptions[0],
  });

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
            getAssignments(courseIds, setAssignments, classroomInfo);
            break;
          case "Announcements":
            getAnnouncementsForCourse(
              courseIds,
              setAnnouncements,
              classroomInfo
            );
            break;
          case "Grades":
            getGrades(courseIds, setGrades, classroomInfo);
            break;
          case "Teacher":
            getClassRoster(courseIds, getTeachers, classroomInfo);
        }
      } else {
        console.log("No courses found.");
      }
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
          fetchCourses()
            .then((courses) => {
              setClassroomInfo(courses);
            })
            .catch((error) => {
              console.error("Error parsing classroom info", error);
            });
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
    fetchCourses()
      .then((courses) => {
        setClassroomInfo(courses);
      })
      .catch((error) => {
        console.error("Error parsing classroom info", error);
      });
  }, []);

  interface WidgetProp {
    onClick: () => void;
    WidgetName?: string;
    WidgetID?: number;
  }

  useEffect(() => {
    GetEvents(setEvents, 200);
  }, []);
  const CalendarWidget: FC<WidgetProp> = (prop) => {
    const [date, setDate] = useState(new Date());
    return (
      <>
        <div className="calendarwidget">
          <div className="calendarwidgetheader" onClick={prop.onClick}>
            <WidgetTitle
              widgettitle="Google Calendar"
              imageSource={calendarImage}
            />
          </div>
          <div className="calendarContent">
            <div className="calendarEventsContent" onClick={prop.onClick}>
              <div className="calendarEventsContentText">
                <div className="calendarEventHeaderContainer">
                  <h2 className="eventsHeader"> Events </h2>
                </div>
                {userevents.map((userEvent) => {
                  return (
                    <div className="eventContent" >
                      {" "}
                      {userEvent.event_summary}: {userEvent.event_starttime}{" "}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="miniCalendar">
              <Calendar onChange={setDate} value={date} />
            </div>
          </div>
        </div>
      </>
    );
  };

  useEffect(() => {
    if (fetchMail) {
      GetMail(setMail, 25);
      setFetchMail(false); // Set to false to avoid repeated calls
    }
    console.log("This function should not loop from UseEffect");
  }, [fetchMail]); // Only depend on fetchMail, not mail

  const GmailWidget: FC<WidgetProp> = (prop) => {
    function limitText(text: string, wordLimit: number) {
      const words = text.split(" ");
      if (words.length > wordLimit) {
        return words.slice(0, wordLimit).join(" ") + "..."; // Add ellipsis if text is truncated
      }
      return text;
    }

    return (
      <>
        <div className="gmailwidget" onClick={prop.onClick}>
          <div className="gmailwidgetheader">
            <WidgetTitle widgettitle="Gmail" imageSource={gmailImage} />
          </div>
          <div className="maildashboardcontent">
            <p className="maildashboardtitle"> Recent Mail: </p>

            {mail.map((mail, index) => {
              let isUnread = false;
              mail.gmail_labelsId.forEach((element) => {
                if (element == "UNREAD") {
                  isUnread = element.includes("UNREAD");
                }
              });
              const sender = mail.gmail_sender;
              const subject = mail.gmail_subject;
              const snippet = mail.gmail_snippet;

              const combinedText = `${sender}: ${subject} - ${snippet}`;
              const limitedText = limitText(combinedText, 27);

              const gmailContentClass = `gmailcontent${
                isUnread ? " unread" : ""
              }`;

              return (
                <div className={gmailContentClass} key={index}>
                  <div className="gmailcontenttext">
                    <p className="gmailcontentp">
                      <span className="gmailcontentsender">{sender}: </span>
                      <span className="gmailcontentsubject">{subject} - </span>
                      {limitedText.substring(sender.length + subject.length)}
                    </p>
                    <p className="gmailcontentdate">
                      {" "}
                      Sent At: {mail.gmail_date}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
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
          <div className="content-wrapper">
            {user &&
              (() => {
                switch (CRWidget.widget1) {
                  case classroomdropdownoptions[0]:
                    return (
                      <>
                        {assignments.map((assignment, index) => (
                          <p key={index} className="classroom-contentp">
                            {" "}
                            <b> {assignment.coursework_courseName}: </b>
                            {assignment.coursework_title} <br /> Due Date:{" "}
                            {assignment.coursework_dueDate}{" "}
                          </p>
                        ))}
                      </>
                    );
                  case classroomdropdownoptions[1]:
                    return (
                      <>
                        {classroomInfo.map((course) => (
                          <div className="class" key={course.id}>
                            {course.name}
                          </div>
                        ))}
                      </>
                    );
                    break;
                  case classroomdropdownoptions[2]:
                    return (
                      <>
                        {announcements.map((announcement, index) => (
                          <p key={index} className="classroom-contentp">
                            {" "}
                            <b>{announcement.announcement_coursename}: </b>
                            {announcement.announcement_text} <br /> Posted At{" "}
                            {announcement.announcement_creationTime}
                          </p>
                        ))}
                      </>
                    );
                    break;
                  case classroomdropdownoptions[3]:
                    return (
                      <>
                        {grades.map((coursework, index) => (
                          <p key={index} className="classroom-contentp">
                            {coursework.course_courseName} -
                            <b> {coursework.course_name} </b> Due Date:{" "}
                            {coursework.course_dueDate} -{" "}
                            {coursework.assigned_grade}/{coursework.max_grade}
                          </p>
                        ))}
                      </>
                    );
                    break;
                  case classroomdropdownoptions[4]:
                    return (
                      <>
                        {teachers.map((teachers, index) => (
                          <p key={index} className="classroom-contentp">
                            {" "}
                            <b> {teachers.teacher_fullName} </b> - Class:{" "}
                            {teachers.teacher_courseId}
                          </p>
                        ))}
                      </>
                    );
                    break;
                  default:
                    break;
                }
              })()}
          </div>
        </div>
      </div>
    );
  };

  const ProjectsWidget: FC<WidgetProp> = (prop) => {
    const ProjectsContent: Array = [
      "Example Project 1",
      "Example Project 2",
      "Example Project 3",
    ];
    return (
      <>
        <div className="projectswidget" onClick={prop.onClick}>
          <div className="projectswidgetheader">
            <WidgetTitle widgettitle="Projects" imageSource={projectsImage} />
          </div>
          <div className="projectcontent">
            <div className="projectstitle">
              <h1 className="activeprojects"> Active Projects: </h1>
              <div className="projects">
                {ProjectsContent.map((projects) => {
                  return <div className="projectdsb"> {projects} </div>;
                })}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const ToDoWidget: FC<WidgetProp> = (prop) => {
    let TDWidgetContent;
    const TodoContent: Array = [
      "Example Project 1",
      "Example Project 2",
      "Example Project 3",
    ];
    const [todos, setTodos] = useState([]);
    function isToday(formattedDateString) {
      const today = new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
      }).format(new Date());

      return formattedDateString === today;
    }
    function isUpcoming(formattedDateString) {
      const today = new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
      }).format(new Date());
    
      return formattedDateString > today;
    }

    switch (TDWidget.widget1) {
      case "Home":
        TDWidgetContent = (
          <ul>
            {todos.map((todo) => (
              <li className="toDoInfo" key={todo.id}>
                <p className="toDoTitle"> {todo.text} </p>
                {todo.description ? (
                  <p className="todoDescription"> {todo.description} </p>
                ) : null}
                {todo.dueDate ? (
                  <p className="todoDueDate"> {todo.dueDate} </p>
                ) : null}
              </li>
            ))}
          </ul>
        );
        break;

      case "Today":
        TDWidgetContent = (
          <ul>
            {todos.map((todo) =>
              isToday(todo.dueDate) ? (
                <li className="toDoInfo" key={todo.id}>
                  <p className="toDoTitle">{todo.text}</p>
                  {todo.description ? (
                    <p className="todoDescription">{todo.description}</p>
                  ) : null}
                  {todo.dueDate ? (
                    <p className="todoDueDate">{todo.dueDate}</p>
                  ) : null}
                </li>
              ) : null
            )}
          </ul>
        );
        break;

      case "Upcoming":
        TDWidgetContent = (
          <ul>
            {todos.map((todo) =>
              isUpcoming(todo.dueDate) == true ? (
                <li className="toDoInfo" key={todo.id}>
                  <p className="toDoTitle">{todo.text}</p>
                  {todo.description ? (
                    <p className="todoDescription">{todo.description}</p>
                  ) : null}
                  {todo.dueDate ? (
                    <p className="todoDueDate">{todo.dueDate}</p>
                  ) : null}
                </li>
              ) : null
            )}
          </ul>
        );
        break;

      case "Starred":
        break;
    }
    useEffect(() => {
      (async () => {
        const storedTodos = Cookies.get("todos");
        try {
          if (storedTodos) {
            const parsedTodos = JSON.parse(storedTodos);
            console.log(parsedTodos);
            await setTodos(parsedTodos || "Cannot Find");
          }
        } catch (error) {
          console.log(storedTodos);
          console.error(error);
        }
      })();
    }, []);
    const handleHeaderChange = (event: number) => {
      setTDWidget((prevState) => ({
        ...prevState,
        [`widget${prop.WidgetID}`]: todolistdropdown[event],
      }));
      console.log(event);
    };
    return (
      <>
        <div className="todowidget">
          <div className="todowidgetheader" onClick={prop.onClick}>
            <WidgetTitle widgettitle="To-Do List" imageSource={todoImage} />
          </div>
          <div className="dsb-tododropdown">
            <div className="dsb-todosubtitle">
              <button className="dsb-todowidgetname">
                {prop.WidgetName} <i className="dashboarddown"></i>
              </button>
            </div>
            <div className="dsbtodo-content" >
              {todolistdropdown.map((options, index) => (
                <a key={index} onClick={() => handleHeaderChange(index)}>
                  {options}
                </a>
              ))}
            </div>
          </div>
          <div className="todoitems" onClick={prop.onClick} >{TDWidgetContent}</div>
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
          <div className="recentTimer">
            <h1 className="recentTimertext"> Recent Timer </h1>
          </div>
          <div className="timerTextContainer">
            <h1 className="timerText"> 30:00 </h1>
          </div>
          <div className="timerbuttonsdsb">
            <button className="starttimerbuttondsb"> Start </button>
            <button className="endtimerbuttondsb"> End </button>
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
          <ToDoWidget
            onClick={() => navigate("/todo/Home")}
            WidgetName={TDWidget.widget1}
            WidgetID={1}
          />
          <ProjectsWidget onClick={() => navigate("/projects/Home")} />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
