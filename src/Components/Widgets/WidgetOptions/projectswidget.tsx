import { FC } from "react";
import WidgetTitle from "../widgettitle";

const ProjectsWidget: FC = () => {
  return (
    <>
      <div className="projectswidget">
        <div className="projectswidgetheader">
          <WidgetTitle widgettitle="Projects" />
        </div>
      </div>
    </>
  );
};
export default ProjectsWidget;
