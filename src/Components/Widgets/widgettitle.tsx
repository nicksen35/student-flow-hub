import { FC } from "react";

type widget = {
  widgettitle: string;
  imageSource: string;
};

const WidgetTitle: FC<widget> = (prop) => {
  return (
    <div className="widgettitleborder">
      <img src={prop.imageSource} className="widgetimage"/>
      <h1 className="widgettitle"> {prop.widgettitle} </h1>
    </div>
  );
};

export default WidgetTitle;
