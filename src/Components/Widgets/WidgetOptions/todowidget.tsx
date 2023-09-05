import { FC } from "react";
import SPWidgetTitle from "../subpagewidgettitle";
import { useNavigate, Routes, Route } from "react-router-dom";
import homeImage from '../../../assets/ToDoList.png'
import todayImage from '../../../assets/CalendarIcon.png'
import upcomingImage from '../../../assets/UpcomingIcon.png'
import starredImage from '../../../assets/StarredIcon.png'
import { useParams } from "react-router-dom";

interface SideBarProp {
  imgsrc: string;
  sbtext: string;
  onClick: () => void;
  active: boolean;
}

const ToDoSideBarTitle: FC = (props) => {
  return <h1 className="todosidebarheader"> To-Do </h1>;
};
const ToDoSideBar: FC<SideBarProp> = (props) => {
  return (
    <>
      <li
        className={"todosidebaritems" + (props.active ? " active" : "")}
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

const ToDoWidgetPage: FC = () => {
  const navigate = useNavigate();
  const { page } = useParams();
  const widgettitle = page || "Default Widget Title";
  let twidgetimage: string;
  let WidgetSubPage: JSX.Element | null = null;
  switch (widgettitle) {
    case "Home":
      twidgetimage = homeImage;
      WidgetSubPage = (
      
      <h1 className="todotitle"> To-Do List </h1>   
      
      );
      break;
    case "Today":
      twidgetimage = todayImage;
      WidgetSubPage = <h1> Hello From the Stats Page</h1>;
      break;
    case "Upcoming":
      twidgetimage = upcomingImage;
      WidgetSubPage = <h1> Hello From the Spotify Page</h1>;
      break;
    case "Starred":
      twidgetimage = starredImage;
      WidgetSubPage = <h1> Hello From the Settings Page</h1>;
      break;
    default:
      twidgetimage = homeImage;
  }
  return (
    <>
    <div className="todowidgettitle">
      <SPWidgetTitle widgettitle={widgettitle} imageSource={twidgetimage} />
      </div>
      <div className="todowidgetcontainer">
        <div className="todosidebar">
          <ToDoSideBarTitle />
          <ul>
            <ToDoSideBar
              sbtext="Home"
              imgsrc={homeImage}
              onClick={() => navigate("/todo/Home")}
              active={widgettitle === "Inbox"} 
            />
            <ToDoSideBar
              sbtext="Today"
              imgsrc={todayImage}
              onClick={() => navigate("/todo/Today")}
              active={widgettitle === "Today"} 
            />
            <ToDoSideBar
              sbtext="Upcoming"
              imgsrc={upcomingImage}
              onClick={() => navigate("/todo/Upcoming")}
              active={widgettitle === "Upcoming"} // Set active based on the current widget
            />
            <ToDoSideBar
              sbtext="Starred"
              imgsrc={starredImage}
              onClick={() => navigate("/todo/Starred")}
              active={widgettitle === "Starred"} // Set active based on the current widget
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
export default ToDoWidgetPage;