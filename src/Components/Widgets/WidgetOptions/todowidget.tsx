import { FC } from "react";
import WidgetTitle from "../widgettitle";

const ToDoWidget: FC = () => {
  return (
    <>
      <div className="todowidget">
        <div className="todowidgetheader">
          <WidgetTitle widgettitle="To-Do List" imageSource="src\assets\ToDoList.png"/>
        </div>
      </div>
    </>
  );
};
export default ToDoWidget;
