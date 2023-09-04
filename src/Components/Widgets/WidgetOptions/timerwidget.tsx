import { FC } from "react";
import SPWidgetTitle from "../subpagewidgettitle";
import { useNavigate } from "react-router-dom";
import timerImage from '../../../assets/Timer.png'
import statsImage from '../../../assets/Stats.png';
import spotifyImage from '../../../assets/Spotify.png';
import settingsImage from '../../../assets/Settings.png';
import { useParams } from "react-router-dom";

interface SideBarProp {
  imgsrc: string;
  sbtext: string;
  onClick: () => void;
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
      <li className="timersidebaritems" onClick={props.onClick}>
        {" "}
        <img
          className="sidebarimg"
          src={props.imgsrc}
          alt="Hello Alt Text"
        />{" "}
        <p className="sidebartext"> {props.sbtext} </p>{" "}
      </li>
    </>
  );
};
const TimerWidgetPage: FC = () => {
  const navigate = useNavigate();
  const {page} = useParams();
  const widgettitle = page || 'Default Widget Title';
  let twidgetimage:string;
  switch(widgettitle){
    case 'Timer':
        twidgetimage = timerImage;
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
      <SPWidgetTitle widgettitle={widgettitle} imageSource={twidgetimage}/>
      <div className="timersidebar">
        <TimerSideBarTitle />
        <ul>
          <TimerSideBar
            sbtext="Timer"
            imgsrc={timerImage}
            onClick={() => navigate("/timer/Timer")}
          />
          <TimerSideBar sbtext="Stats" imgsrc={statsImage} onClick={() => navigate("/timer/Stats")} />
          <TimerSideBar sbtext="Spotify" imgsrc={spotifyImage} onClick={() => navigate("/timer/Spotify")}/>
          <TimerSideBar sbtext="Settings" imgsrc={settingsImage} onClick={() => navigate("/timer/Settings")}/>
        </ul>
      </div>
    </>
  );
};
export default TimerWidgetPage;
