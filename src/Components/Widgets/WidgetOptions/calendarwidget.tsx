import { FC } from "react";
import { useState, useEffect } from "react";
import SPWidgetTitle from "../subpagewidgettitle";
import calendarImage from "../../../assets/Calendar.png";
import { GetEvents } from "../calendarfunctions";
import Calendar from "react-calendar";
type CalendarProp = {
  WidgetName: string;
  WidgetID: number;
  WidgetContent: object;
};


const CalendarWidgetPage: FC = () => {
  useEffect(() => {
    GetEvents(setEvents, 200);
  }, []);
  const [date, setDate] = useState(new Date());
  const [userevents, setEvents] = useState([]);
  const dropdownoptions = ["Events", "Calendar"];

  const [CRWidget, setCRWidget] = useState({
    widget1: dropdownoptions[0],
    widget2: dropdownoptions[1],
    widget3: dropdownoptions[2],
  });
  const EventsContent = (
    <div className="widgetcalendarContent">
      <div className="widgetcalendarEventsContent">
        <div className="widgetcalendarEventsContentText">
          {userevents.map((userEvent) => {
            return (
              <div className="widgeteventContent">
                {" "}
                {userEvent.event_summary}: {userEvent.event_starttime}{" "}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
  const CalendarContent = (
    <div className="largeCalendar">
      <Calendar onChange={setDate} value={date} />
    </div>
  );
  
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
              <button className="widgetname" id="calendarWidgetName">
                {prop.WidgetName}
              </button>
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
        imageSource={calendarImage}
        widgettitle="Google Calendar"
      />
      <div className="calendarboxcontainer">
        <CalendarWidgets
          WidgetName={CRWidget.widget1}
          WidgetID={1}
          WidgetContent={EventsContent}
        />
        <CalendarWidgets
          WidgetName={CRWidget.widget2}
          WidgetID={2}
          WidgetContent={CalendarContent}
        />
      </div>
    </>
  );
};

export default CalendarWidgetPage;
