import { FC } from "react";
import WidgetTitle from "../widgettitle";

const CalendarWidget: FC = () => {
  return (
    <>
      <div className="calendarwidget">
        <div className="calendarwidgetheader">
          <WidgetTitle widgettitle="Google Calendar" />
        </div>
      </div>
    </>
  );
};
export default CalendarWidget;
