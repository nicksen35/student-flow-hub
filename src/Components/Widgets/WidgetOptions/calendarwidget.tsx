import { FC } from "react";
import WidgetTitle from "../widgettitle";

const CalendarWidget: FC = () => {
  return (
    <>
      <div className="calendarwidget">
        <div className="calendarwidgetheader">
          <WidgetTitle widgettitle="Google Calendar" imageSource="src\assets\Calendar.png"/>
        </div>
      </div>
    </>
  );
};
export default CalendarWidget;
