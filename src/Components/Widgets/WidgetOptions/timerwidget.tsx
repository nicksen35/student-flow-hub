import { FC } from "react";
import WidgetTitle from "../widgettitle";

const TimerWidget: FC = () => {
  return (
    <>
      <div className="timerwidget">
        <div className="timerwidgetheader">
          <WidgetTitle widgettitle="Timer" imageSource="src\assets\Timer.png"/>
        </div>
      </div>
    </>
  );
};
export default TimerWidget;
