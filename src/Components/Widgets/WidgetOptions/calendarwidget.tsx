import { FC } from "react";
import SPWidgetTitle from "../subpagewidgettitle";
import calendarImage from '../../../assets/Calendar.png'

const CalendarWidgetPage:FC = () => {
    return (

        <SPWidgetTitle widgettitle="Google Calendar" imageSource={calendarImage}/>
    )
}
export default CalendarWidgetPage;