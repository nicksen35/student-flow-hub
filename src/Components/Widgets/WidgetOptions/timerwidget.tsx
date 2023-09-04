import { FC } from "react";
import SPWidgetTitle from "../subpagewidgettitle";
import { useNavigate, Routes, Route } from "react-router-dom";
import timerImage from '../../../assets/Timer.png'
import statsImage from '../../../assets/Stats.png';
import spotifyImage from '../../../assets/Spotify.png';
import settingsImage from '../../../assets/Settings.png';
import { useParams } from "react-router-dom";

interface SideBarProp {
  imgsrc: string;
  sbtext: string;
  onClick: () => void;
  active: boolean;
}
interface TimerTitleProp {
    headertext: string;
}
const TimerBar: FC<TimerTitleProp> = (props) => {
  return <h1> {props.headertext} </h1>;
};

const TimerSideBarTitle: FC = (props) => {
  return <h1 className="timersidebarheader"> Timer </h1>;
};
const TimerSideBar: FC<SideBarProp> = (props) => {
  return (
    <>
      <li className={"timersidebaritems" + (props.active ? " active" : "")} onClick={props.onClick}>
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

const TimerPage:FC = () =>
{
  return(
    <div className="timerpage">
      <h1> Hello </h1>
    </div>
  )
}
const TimerWidgetPage: FC = () => {
  const navigate = useNavigate();
  const {page} = useParams();
  const widgettitle = page || 'Default Widget Title';
  let twidgetimage:string;
  let WidgetSubPage:JSX.Element | null = null;
  switch(widgettitle){
    case 'Timer':
        twidgetimage = timerImage;
        WidgetSubPage = (
          <h1> Hello from TimerPage </h1>
        )
        break;
    case 'Stats':
        twidgetimage = statsImage;
        break;
    case 'Spotify':
        twidgetimage = spotifyImage;
        break;
    case 'Settings':
        twidgetimage = settingsImage;
        break;
    default:
        twidgetimage = timerImage;
  }
  return (
    <>
      <SPWidgetTitle widgettitle={widgettitle} imageSource={twidgetimage} />
      <div className="timerwidgetcontainer">
      <div className="timersidebar">
        <TimerSideBarTitle />
        <ul>
          <TimerSideBar
            sbtext="Timer"
            imgsrc={timerImage}
            onClick={() => navigate("/timer/Timer")}
            active={widgettitle === 'Timer'} // Set active based on the current widget
          />
          <TimerSideBar
            sbtext="Stats"
            imgsrc={statsImage}
            onClick={() => navigate("/timer/Stats")}
            active={widgettitle === 'Stats'} // Set active based on the current widget
          />
          <TimerSideBar
            sbtext="Spotify"
            imgsrc={spotifyImage}
            onClick={() => navigate("/timer/Spotify")}
            active={widgettitle === 'Spotify'} // Set active based on the current widget
          />
          <TimerSideBar
            sbtext="Settings"
            imgsrc={settingsImage}
            onClick={() => navigate("/timer/Settings")}
            active={widgettitle === 'Settings'} // Set active based on the current widget
          />
        </ul>
      </div>
      {WidgetSubPage}
      </div> 
      
    </>
  );
};
export default TimerWidgetPage;
