import { FC } from "react";
import WidgetTitle from "../widgettitle";

const GmailWidget: FC = () => {
  return (
    <>
      <div className="gmailwidget">
        <div className="gmailwidgetheader">
          <WidgetTitle widgettitle="Gmail" />
        </div>
      </div>
    </>
  );
};
export default GmailWidget;
