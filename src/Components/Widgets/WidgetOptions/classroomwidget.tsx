import { FC } from "react";
import { useEffect, useState } from "react";
import SPWidgetTitle from "../subpagewidgettitle";
import {
  getAssignments,
  fetchCourses,
  getAnnouncementsForCourse,
  getClassRoster,
  getGrades,
} from "../classroomfunctions";
type ClassroomProp = {
  WidgetName: string;
  WidgetID: number;
  WidgetContent: object;
};
import "./classroomwidget.scss";

const ClassroomWidgetPage: FC = () => {
  const [classroomInfo, setClassroomInfo] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [teachers, getTeachers] = useState([]);
  const [courseWork, setCourseWork] = useState();
  const [grades, setGrades] = useState([]);
  const dropdownoptions = [
    "Assignments",
    "Classes",
    "Announcements",
    "Grades",
    "Teachers",
  ];

  let widgetcontent1;
  let widgetcontent2;
  let widgetcontent3;
  const [CRWidget, setCRWidget] = useState({
    widget1: dropdownoptions[0],
    widget2: dropdownoptions[1],
    widget3: dropdownoptions[2],
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
    fetchCourses()
      .then((courses) => {
        setClassroomInfo(courses);
      })
      .catch((error) => {
        console.error("Error parsing classroom info", error);
      });
  }, []);
  const handleWidgetChange = (widget) => {
    switch (widget) {
      case dropdownoptions[0]:
        fetchWithCourseId("Assignments");
        break;
      case dropdownoptions[1]:
        fetchCourses()
          .then((courses) => {
            setClassroomInfo(courses);
          })
          .catch((error) => {
            console.error("Error parsing classroom info", error);
          });
        break;
      case dropdownoptions[2]:
        fetchWithCourseId("Announcements");
        break;
      case dropdownoptions[3]:
        fetchWithCourseId("Grades");
        console.log("This is being sdfaljf");
        break;
      case dropdownoptions[4]:
        console.log("This is being fetched");
        fetchWithCourseId("Teacher");
        break;
      default:
        // Handle default case if needed
        break;
    }
  };

  useEffect(() => {
    handleWidgetChange(CRWidget.widget1);
  }, [CRWidget.widget1]);

  useEffect(() => {
    handleWidgetChange(CRWidget.widget2);
  }, [CRWidget.widget2]);

  useEffect(() => {
    handleWidgetChange(CRWidget.widget3);
  }, [CRWidget.widget3]);

  const classroomContent = (
    <div className="container">
      {assignments.map((assignment, index) => (
        <p key={index} className="classroom-contentp">
          {" "}
          <b> {assignment.coursework_courseName}: </b>
          {assignment.coursework_title} <br /> Due Date:{" "}
          {assignment.coursework_dueDate}{" "}
        </p>
      ))}
    </div>
  );
  const assignmentsContent = (
    <>
      <div className="container">
        {classroomInfo.map((course) => (
          <div className="class" key={course.id}>
            {course.name}
          </div>
        ))}
      </div>
    </>
  );
  const announcementsContent = (
    <>
      <div className="container">
        {announcements.map((announcement, index) => (
          <p key={index} className="classroom-contentp">
            {" "}
            <b>{announcement.announcement_coursename}: </b>
            {announcement.announcement_text} <br /> Posted At{" "}
            {announcement.announcement_creationTime}
          </p>
        ))}
      </div>
    </>
  );
  const gradesContent = (
    <>
      <div className="container">
        {grades.map((coursework, index) => (
          <p key={index} className="classroom-contentp">
            {coursework.course_courseName} -<b> {coursework.course_name} </b>{" "}
            Due Date: {coursework.course_dueDate} - {coursework.assigned_grade}/
            {coursework.max_grade}
          </p>
        ))}
      </div>
    </>
  );
  const teachersContent = (
    <>
      <div className="container">
        {teachers.map((teachers, index) => (
          <p key={index} className="classroom-contentp">
            {" "}
            <b> {teachers.teacher_fullName} </b> - Class:{" "}
            {teachers.teacher_courseId}
          </p>
        ))}
      </div>
    </>
  );
  switch (CRWidget.widget1) {
    case dropdownoptions[0]:
      widgetcontent1 = classroomContent;
      break;

    case dropdownoptions[1]:
      widgetcontent1 = assignmentsContent;
      break;

    case dropdownoptions[2]:
      widgetcontent1 = announcementsContent;
      break;

    case dropdownoptions[3]:
      widgetcontent1 = gradesContent;
      break;

    case dropdownoptions[4]:
      widgetcontent1 = teachersContent;
      break;

    default:
      // Default case for widget1
      break;
  }

  switch (CRWidget.widget2) {
    case dropdownoptions[0]:
      widgetcontent2 = classroomContent;
      break;

    case dropdownoptions[1]:
      widgetcontent2 = assignmentsContent;
      break;

    case dropdownoptions[2]:
      widgetcontent2 = announcementsContent;
      break;

    case dropdownoptions[3]:
      widgetcontent2 = gradesContent;
      break;

    case dropdownoptions[4]:
      widgetcontent2 = teachersContent;
      break;

    default:
      // Default case for widget1
      break;
  }

  switch (CRWidget.widget3) {
    case dropdownoptions[0]:
      widgetcontent3 = classroomContent;
      break;

    case dropdownoptions[1]:
      widgetcontent3 = assignmentsContent;
      break;

    case dropdownoptions[2]:
      widgetcontent3 = announcementsContent;
      break;

    case dropdownoptions[3]:
      widgetcontent3 = gradesContent;
      break;

    case dropdownoptions[4]:
      widgetcontent3 = teachersContent;
      break;

    default:
      // Default case for widget1
      break;
  }
  const ClassroomWidgets: FC<ClassroomProp> = (prop) => {
    const handleHeaderChange = (event: number) => {
      setCRWidget((prevState) => ({
        ...prevState,
        [`widget${prop.WidgetID}`]: dropdownoptions[event],
      }));
      console.log(event);
    };
    return (
      <div className={`widgetcontainer${prop.WidgetID}`}>
        <div className="classroomwidgetborder">
          <div className="classroomdropdown">
            <div className="classroomsubtitle">
              <button className="widgetname">{prop.WidgetName}</button>
              <p>
                <i className="down"></i>
              </p>
            </div>
            <div className="dropdown-contentclassroom">
              {dropdownoptions.map((options, index) => (
                <>
                  <a key={index} onClick={() => handleHeaderChange(index)}>
                    {" "}
                    {options}{" "}
                  </a>
                </>
              ))}
            </div>
          </div>
        </div>
        {prop.WidgetContent}
      </div>
    );
  };

  return (
    <>
      <SPWidgetTitle
        imageSource="src\assets\Google_Classroom_Logo.png"
        widgettitle="Google Classroom"
      />
      <div className="classroomboxcontainer">
        <ClassroomWidgets
          WidgetName={CRWidget.widget1}
          WidgetID={1}
          WidgetContent={widgetcontent1}
        />
        <ClassroomWidgets
          WidgetName={CRWidget.widget2}
          WidgetID={2}
          WidgetContent={widgetcontent2}
        />
        <ClassroomWidgets
          WidgetName={CRWidget.widget3}
          WidgetID={3}
          WidgetContent={widgetcontent3}
        />
      </div>
    </>
  );
};

export default ClassroomWidgetPage;
