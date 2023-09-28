import { FC } from "react";
import { useState } from "react";
import SPWidgetTitle from "../subpagewidgettitle";

type ClassroomProp = {
  WidgetName: string;
  WidgetID: number;
};


const ClassroomWidgetPage: FC = () => {
  const dropdownoptions = [
    "Classes",
    "Assignments",
    "Announcements",
    "Grades",
    "Teachers",
  ];

  const [CRWidget, setCRWidget] = useState({
    widget1: dropdownoptions[0],
    widget2: dropdownoptions[1],
    widget3: dropdownoptions[2],
  });

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
        <ClassroomWidgets WidgetName={CRWidget.widget1} WidgetID={1} />
        <ClassroomWidgets WidgetName={CRWidget.widget2} WidgetID={2} />
        <ClassroomWidgets WidgetName={CRWidget.widget3} WidgetID={3} />
      </div>
    </>
  );
};

export default ClassroomWidgetPage;
