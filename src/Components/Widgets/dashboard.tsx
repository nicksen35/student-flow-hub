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
            getAssignments(courseIds, setAssignments);
            break;
          case "Announcements":
            getAnnouncementsForCourse(courseIds, setAnnouncements);
            break;
          case "Grades":
            getGrades(courseIds, setGrades);
            break;
          case "Teacher":
            getClassRoster(courseIds, getTeachers);
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
          console.log("hI MOM");
          fetchCourses(setClassroomInfo);
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
                            <b> {assignment.coursework_title} </b> - Due Date:{" "}
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
                            <b> {announcement.announcement_text} </b> - Posted
                            At {announcement.announcement_creationTime}
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
