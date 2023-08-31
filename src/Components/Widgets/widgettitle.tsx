import { FC } from "react";

type widget = {
  widgettitle: string;
};

const WidgetTitle: FC<widget> = (prop) => {
  return (
    <div className="widgettitleborder">
      <h1 className="widgettitle"> {prop.widgettitle} </h1>
    </div>
  );
};

export default WidgetTitle;
