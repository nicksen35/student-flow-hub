import { FC } from "react";
import SPWidgetTitle from "../subpagewidgettitle";
import { useState, useEffect } from "react";
import { GetMail } from "../gmailfunctions";
import './gmailwidget.scss'

type GmailProp = {
  WidgetName: string;
  WidgetID: number;
};

const GmailWidgetPage: FC = () => {
  const dropdownoptions = [
    "Inbox",
  ];

  const [CRWidget, setCRWidget] = useState({
    widget1: dropdownoptions[0],
    widget2: dropdownoptions[1],
    widget3: dropdownoptions[2],
  });

  const GmailWidgets: FC<GmailProp> = (prop) => {
    const [fetchMail, setFetchMail] = useState(true);
    const [mail, setMail] = useState([]);
    function limitText(text: string, wordLimit: number) {
      const words = text.split(" ");
      if (words.length > wordLimit) {
        return words.slice(0, wordLimit).join(" ") + "..."; // Add ellipsis if text is truncated
      }
      return text;
    }
    useEffect(() => {
      if (fetchMail) {
        GetMail(setMail, 25);
        setFetchMail(false); // Set to false to avoid repeated calls
      }
      console.log("This function should not loop from UseEffect");
    }, [fetchMail]); // Only depend on fetchMail, not mail
    const handleHeaderChange = (event: number) => {
      setCRWidget((prevState) => ({
        ...prevState,
        [`widget${prop.WidgetID}`]: dropdownoptions[event],
      }));
      console.log(event);
    };
    return (
      <>
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
                  <a key={index} onClick={() => handleHeaderChange(index)}>
                    {options}
                  </a>
                ))}
              </div>
            </div>
            </div>
            <div className="gmailcontentholder">
              {mail.map((mail, index) => {
                let isUnread = false;
                mail.gmail_labelsId.forEach((element) => {
                  if (element === "UNREAD") {
                    isUnread = true;
                  }
                });
    
                const sender = mail.gmail_sender;
                const subject = mail.gmail_subject;
                const snippet = mail.gmail_snippet;
    
                const trimmedSubject = subject.slice(0, -2);
                const combinedText = `${sender}: ${trimmedSubject} ${snippet}`;
    
                const limitedText = limitText(combinedText, 27);
    
                const gmailContentClass = `gmailwidgetcontent${isUnread ? " unread" : ""}`;
    
                return (
                  <div className={gmailContentClass} key={index}>
                    <div className="gmailcontenttext">
                    <p className="gmailcontentp">
                      <span className="gmailcontentsender">{sender}: </span>
                      <span className="gmailcontentsubject">{subject} - </span>
                      {limitedText.substring(sender.length + subject.length)}
                    </p>
                    <p className="gmailcontentdate">
                      {" "}
                      Sent At: {mail.gmail_date}
                    </p>
                  </div>
                  </div>
                );
              })}
            </div>
          
        </div>
      </>
    );
            }    

  return (
    <>
      <SPWidgetTitle
        imageSource="src\assets\GmailLogo.png"
        widgettitle="Gmail"
      />
      <div className="gmailboxcontainer">
        <GmailWidgets WidgetName={CRWidget.widget1} WidgetID={1} />
      </div>
    </>
  );
};

export default GmailWidgetPage;
