import { FC } from "react";

type widget = {
  widgettitle: string;
  imageSource: string;
};

const SPWidgetTitle: FC<widget> = (prop) => {
  return (
    <div className="subpagewidgettitleborder">
      <img src={prop.imageSource} className="widgetimagesubpage"/>
      <h1 className="subpagewidgettitle"> {prop.widgettitle} </h1>
    </div>
  );
};

export default SPWidgetTitle;
