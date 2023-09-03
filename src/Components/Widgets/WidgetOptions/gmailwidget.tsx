import { FC } from "react";
import SPWidgetTitle from "../subpagewidgettitle";
import { useState } from "react";

type GmailProp = {
  WidgetName: string;
  WidgetID: number;
};

const GmailWidgetPage: FC = () => {
  const dropdownoptions = [
    "Inbox",
    "Starred",
    "Important",
    "All Mail",
    "Updates",
  ];

  const [CRWidget, setCRWidget] = useState({
    widget1: dropdownoptions[0],
    widget2: dropdownoptions[1],
    widget3: dropdownoptions[2],
  });

  const ClassroomWidgets: FC<GmailProp> = (prop) => {
    const handleHeaderChange = (event: number) => {
      setCRWidget((prevState) => ({
        ...prevState,
        [`widget${prop.WidgetID}`]: dropdownoptions[event],
      }));
      console.log(event);
    };
    return (
      <div className={`widgetcontainer${prop.WidgetID}`}>
        <div className="gmailwidgetborder">
          <div className="gmaildropdown">
            <div className="gmailsubtitle">
              <button className="widgetname">{prop.WidgetName}</button>
              <p>
                <i className="down"></i>
              </p>
            </div>
            <div className="dropdown-contentgmail">
              {dropdownoptions.map((options, index) => (
                <>
                  <a key={index} onClick={() => handleHeaderChange(index)}>
                    {" "}
                    {options}{" "}
                  </a>
                </>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <SPWidgetTitle
        imageSource="src\assets\GmailLogo.png"
        widgettitle="Gmail"
      />
      <div className="gmailboxcontainer">
        <ClassroomWidgets WidgetName={CRWidget.widget1} WidgetID={1} />
        <ClassroomWidgets WidgetName={CRWidget.widget2} WidgetID={2} />
        <ClassroomWidgets WidgetName={CRWidget.widget3} WidgetID={3} />
      </div>
    </>
  );
};

export default GmailWidgetPage;
