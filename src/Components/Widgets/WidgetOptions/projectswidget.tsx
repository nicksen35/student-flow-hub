import { FC } from "react";
import WidgetTitle from "../widgettitle";

const ProjectsWidget: FC = () => {
  return (
    <>
      <div className="projectswidget">
        <div className="projectswidgetheader">
          <WidgetTitle widgettitle="Projects" imageSource="src\assets\Projects.png"/>
        </div>
      </div>
    </>
  );
};
export default ProjectsWidget;
