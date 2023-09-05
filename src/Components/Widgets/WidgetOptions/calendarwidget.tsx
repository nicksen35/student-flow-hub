import { FC } from "react";
import { useState } from "react";
import SPWidgetTitle from "../subpagewidgettitle";
import calendarImage from '../../../assets/Calendar.png'
type CalendarProp = {
  WidgetName: string;
  WidgetID: number;
};

const CalendarWidgetPage: FC = () => {
  const dropdownoptions = [
    "Events",
    "Monthly",
    "Weekly",
    "Daily",
    "Calendar",
  ];

  const [CRWidget, setCRWidget] = useState({
    widget1: dropdownoptions[0],
    widget2: dropdownoptions[1],
    widget3: dropdownoptions[2],
  });

  const CalendarWidgets: FC<CalendarProp> = (prop) => {
    const handleHeaderChange = (event: number) => {
      setCRWidget((prevState) => ({
        ...prevState,
        [`widget${prop.WidgetID}`]: dropdownoptions[event],
      }));
      console.log(event);
    };
    return (
      <div className={`widgetcontainer${prop.WidgetID}`}>
        <div className="calendarwidgetborder">
          <div className="calendardropdown">
            <div className="calendarsubtitle">
              <button className="widgetname">{prop.WidgetName}</button>
              <p>
                <i className="down"></i>
              </p>
            </div>
            <div className="dropdown-contentcalendar">
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
        imageSource={calendarImage}
        widgettitle="Google Calendar"
      />
      <div className="calendarboxcontainer">
        <CalendarWidgets WidgetName={CRWidget.widget1} WidgetID={1} />
        <CalendarWidgets WidgetName={CRWidget.widget2} WidgetID={2} />
        <CalendarWidgets WidgetName={CRWidget.widget3} WidgetID={3} />
      </div>
    </>
  );
};

export default CalendarWidgetPage;
