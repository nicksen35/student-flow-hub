import { FC, useEffect } from "react";
import SPWidgetTitle from "../subpagewidgettitle";
import { useNavigate, Routes, Route, useAsyncError } from "react-router-dom";
import timerImage from "../../../assets/Timer.png";
import spotifyImage from "../../../assets/Spotify.png";
import settingsImage from "../../../assets/Settings.png";
import ClockImage from '../../../assets/Clock.png'
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useStopwatch, useTimer } from "react-timer-hook";

interface SideBarProp {
  imgsrc: string;
  sbtext: string;
  onClick: () => void;
  active: boolean;
}

const TimerSideBarTitle: FC = (props) => {
  return <h1 className="timersidebarheader"> Timer </h1>;
};
const TimerSideBar: FC<SideBarProp> = (props) => {
  return (
    <>
      <li
        className={"timersidebaritems" + (props.active ? " active" : "")}
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

const TimerWidgetPage: FC = ({ expiryTimestamp }) => {
  const timerDuration:Date = new Date();
  const navigate = useNavigate();
  const { page } = useParams();
  const [isOverlayOpen, setOverlayOpen] = useState(false);
  const [isTimerRunning, setTimerRunning] = useState(false);
  const [timerHours, setTimerHours] = useState(0);
  const [timerMinutes, setTimerMinutes] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const widgettitle = page || "Default Widget Title";
  let twidgetimage: string;
  let WidgetSubPage: JSX.Element | null = null;
  const {
    totalSeconds,
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({
    expiryTimestamp,
    onExpire: () => console.warn("onExpire called"),
    autoStart: false,
  });

  const {
    seconds: stopwatchSeconds,
    minutes: stopwatchMinutes,
    hours: stopwatchHours,
    isRunning: stopwatchIsRunning,
    start: stopwatchStart,
    pause: stopwatchPause,
    reset: stopwatchReset,
  } = useStopwatch({ autoStart: false  });

  const formattedTime = `${String(hours).padStart(2, "0")}:${String(
    minutes
  ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  const stopwatchFormattedTime = `${String(stopwatchHours).padStart(2, "0")}:${String(
    stopwatchMinutes
  ).padStart(2, "0")}:${String(stopwatchSeconds).padStart(2, "0")}`;
  const handleHoursChange = (event) => {
    const maxhours: number = 23
    let value = parseInt(event.target.value, 10);
    if (isNaN(value) || value < 0) {
      value = 0;
    } else if (value > maxhours) {
      value = maxhours;
    }  
    value = Math.max(0, Math.min(99, value));
  
    setTimerHours(value);
    console.log('value is:', value);
  };

  const handleMinutesChange = (event) => {
    const maxminutes: number = 59
    let value = parseInt(event.target.value, 10);
    if (isNaN(value) || value < 0) {
      value = 0;
    } else if (value > maxminutes) {
      value = 59;
    }  
    value = Math.max(0, Math.min(maxminutes, value));
  
    setTimerMinutes(value);
    console.log('value is:', value);
  };
  const handleSecondsChange = (event) => {
    const maxseconds: number = 59
    let value = parseInt(event.target.value, 10);
    if (isNaN(value) || value < 0) {
      value = 0;
    } else if (value > maxseconds) {
      value = 59;
    }  
    value = Math.max(0, Math.min(maxseconds, value));
    setTimerSeconds(value);
    console.log('value is:', value);
  };
  
  useEffect(()=> {
    timerDuration.setSeconds(timerDuration.getSeconds() + timerSeconds);
    timerDuration.setMinutes(timerDuration.getMinutes() + timerMinutes);
    timerDuration.setHours(timerDuration.getHours() + timerHours);
    console.log(timerDuration);
    restart(timerDuration, false);
  },[timerMinutes, timerSeconds, timerHours])

  useEffect(() => {
    console.log(timerDuration)
  }, [timerDuration])
  const TimerOverlay = (
    <>
    <div className="overlayTimer">
      <div className="editTimerHeader">
        <h1> Edit Timer </h1> <span className="close" onClick={() => setOverlayOpen(false)} >x</span>
      </div>
      <div className="editTimerBody">
        <div className="editTimerInput">
          <ul className="inputcontainertimer">
            <li className="timerinput">
              <input className="hoursinput" onChange={handleHoursChange} value={timerHours}/>
              <label className="timerlabels" id="hourlabel">
                {" "}
                Hours{" "}
              </label>
            </li>
            <li className="timerinput">
              <input className="minutesinput" onChange={handleMinutesChange} value={timerMinutes}/>
              <label className="timerlabels" id="minutelabel">
                {" "}
                Minutes{" "}
              </label>
            </li>
            <li className="timerinput">
              <input className="secondsinput" onChange={handleSecondsChange} value={timerSeconds} />
              <label className="timerlabels" id="secondlabel">
                {" "}
                Seconds{" "}
              </label>
            </li>
          </ul>
        </div>
        <div className="editTimerSettings">
          <ul className="timersettings">
            <li className="nameTimer">
              {" "}
              <label className="timerNameLabel">Timer Name: </label>
              <input className="timerNameInput" />
            </li>
            <li className="alarmNoise">
              {" "}
              <label className="timerAlarmSound">Timer End Alarm: </label>
              <select>
                <option value={"Hello"}> Hello </option>
              </select>
            </li>
          </ul>
        </div>
        <div className="timerButtons">
          <ul className="timerButtonList">
            <li className="deleteTimerButton">
              <button className="timerButton" id="deleteTimer"> Delete Timer </button>
               </li>
            <li className="saveTimerButton">
              <button className="timerButton" id="savetimer" onClick={() => setOverlayOpen(false)}> Done </button>
               </li>
          </ul>
        </div>
      </div>
    </div>
    </>
  );
  switch (widgettitle) {
    case "Timer":
      twidgetimage = timerImage;
      WidgetSubPage = (
        <>
          <h1 className="timertitle"> Set Your Timer </h1>
          <h1
            className="timer"
            onClick={() => {
              setOverlayOpen(true);
            }}
          >
            {formattedTime}
          </h1>
          {isOverlayOpen ? (
            <div className="overlayTimerContainer">{TimerOverlay}</div>
          ) : (
            ""
          )}
          <p>{isRunning ? "Running" : "Not running"}</p>
          <ul className="timerpagelist">
            {isTimerRunning ? (
              ""
            ) : (
              <li className="timerbuttons">
                <button
                  className="timerbutton"
                  onClick={() => {
                    if (!isTimerRunning) {
                      setTimerRunning(true);
                      start();
                    }
                  }}
                >
                  Start
                </button>
              </li>
            )}
            {isTimerRunning ? (
              <>
                <li className="timerbuttons">
                  <button
                    className="timerbutton"
                    onClick={isRunning ? pause : resume}
                  >
                    {isRunning ? "Pause" : "Resume"}
                  </button>
                </li>
                <li className="timerbuttons">
                  <button
                    className="timerbutton"
                    onClick={() => {
                      timerDuration.setSeconds(timerDuration.getSeconds() + timerSeconds);
                      timerDuration.setMinutes(timerDuration.getMinutes() + timerMinutes);
                      timerDuration.setHours(timerDuration.getHours() + timerHours);
                      console.log(timerDuration)
                      restart(timerDuration, false);
                      setTimerRunning(false);
                    }}
                  >
                    Restart
                  </button>
                </li>
              </>
            ) : (
              ""
            )}
          </ul>
        </>
      );
      break;
    case "Stopwatch":
      twidgetimage = ClockImage;

      

      WidgetSubPage = (
        <>
          <h1 className="timertitle"> Click to Use Stopwatch! </h1>
          <h1
            className="timer"
          >
            {stopwatchFormattedTime}
          </h1>
          <p>{stopwatchIsRunning ? "Running" : "Not running"}</p>
          <ul className="timerpagelist">
            {stopwatchIsRunning ? (
              ""
            ) : (
              <li className="timerbuttons">
                <button
                  className="timerbutton"
                  onClick={() => {
                    if (!stopwatchIsRunning) {
                      stopwatchStart();
                    }
                  }}
                >
                  Start
                </button>
              </li>
            )}
            {stopwatchIsRunning ? (
              <>
                <li className="timerbuttons">
                  <button
                    className="timerbutton"
                    onClick={stopwatchIsRunning ? stopwatchPause : stopwatchStart}
                  >
                    {stopwatchIsRunning ? "Pause" : "Resume"}
                  </button>
                </li>
                <li className="timerbuttons">
                  <button
                    className="timerbutton"
                    onClick={() => {
                      console.log(timerDuration);
                      stopwatchReset();
                    }}
                  >
                    Reset Stopwatch
                  </button>
                </li>
              </>
            ) : (
              ""
            )}
          </ul>
        </>
      );
      break;
    case "Spotify":
      twidgetimage = spotifyImage;
      WidgetSubPage = <h1> Hello From the Spotify Page</h1>;
      break;
    case "Settings":
      twidgetimage = settingsImage;
      WidgetSubPage = <h1> Hello From the Settings Page</h1>;
      break;
    default:
      twidgetimage = timerImage;
  }
  return (
    <>
      <div className="timerwidgettitle">
        <SPWidgetTitle widgettitle={widgettitle} imageSource={twidgetimage} />
      </div>
      <div className="timerwidgetcontainer">
        <div className="timersidebar">
          <TimerSideBarTitle />
          <ul>
            <TimerSideBar
              sbtext="Timer"
              imgsrc={timerImage}
              onClick={() => navigate("/timer/Timer")}
              active={widgettitle === "Timer"} // Set active based on the current widget
            />
            <TimerSideBar
              sbtext="Stopwatch"
              imgsrc={ClockImage}
              onClick={() => navigate("/timer/Stopwatch")}
              active={widgettitle === "Stopwatch"} // Set active based on the current widget
            />
            <TimerSideBar
              sbtext="Spotify"
              imgsrc={spotifyImage}
              onClick={() => navigate("/timer/Spotify")}
              active={widgettitle === "Spotify"} // Set active based on the current widget
            />
            <TimerSideBar
              sbtext="Settings"
              imgsrc={settingsImage}
              onClick={() => navigate("/timer/Settings")}
              active={widgettitle === "Settings"} // Set active based on the current widget
            />
          </ul>
        </div>
        <div className="subpagewidget">{WidgetSubPage}</div>
      </div>
    </>
  );
};
export default TimerWidgetPage;
