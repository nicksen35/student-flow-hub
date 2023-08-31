import { FC } from "react";
import WidgetTitle from "../widgettitle";

const ClassroomWidget: FC = () => {
  return (
    <>
      <div className="classroomwidget">
        <div className="classroomwidgetheader">
          <WidgetTitle widgettitle="Google Classroom" />
        </div>
      </div>
    </>
  );
};
export default ClassroomWidget;
