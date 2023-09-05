import { FC } from "react";
import SPWidgetTitle from "../subpagewidgettitle";
import { useNavigate, Routes, Route } from "react-router-dom";
import homeImage from '../../../assets/Projects.png'
import { useParams } from "react-router-dom";

interface SideBarProp {
  imgsrc: string;
  sbtext: string;
  onClick: () => void;
  active: boolean;
}

const ProjectsSideBarTitle: FC = (props) => {
  return <h1 className="projectssidebarheader"> Projects </h1>;
};
const ProjectsSideBar: FC<SideBarProp> = (props) => {
  return (
    <>
      <li
        className={"projectssidebaritems" + (props.active ? " active" : "")}
        onClick={props.onClick}
      >
        {" "}
        <img
          className="sidebarimg"
          src={props.imgsrc}
          alt="Hello Alt Text"
        />{" "}
        <p className={"sidebartext"}> {props.sbtext} </p>{" "}
      </li>
    </>
  );
};

const ProjectsWidgetPage: FC = () => {
  const navigate = useNavigate();
  const { page } = useParams();
  const widgettitle = page || "Default Widget Title";
  let twidgetimage: string;
  let WidgetSubPage: JSX.Element | null = null;
  switch (widgettitle) {
    case "Home":
      twidgetimage = homeImage;
      WidgetSubPage = (
      
      <h1 className="projectstitle"> Projects List </h1>   
      
      );
      break;
    default:
      twidgetimage = homeImage;
  }
  return (
    <>
    <div className="projectswidgettitle">
      <SPWidgetTitle widgettitle={widgettitle} imageSource={twidgetimage} />
      </div>
      <div className="projectswidgetcontainer">
        <div className="projectssidebar">
          <ProjectsSideBarTitle />
          <ul>
            <ProjectsSideBar
              sbtext="Home"
              imgsrc={homeImage}
              onClick={() => navigate("/projects/Home")}
              active={widgettitle === "Home"} 
            />
          </ul>
        </div>
        <div className="subpagewidget">
            {WidgetSubPage}
        </div>
      </div>
    </>
  );
};
export default ProjectsWidgetPage;