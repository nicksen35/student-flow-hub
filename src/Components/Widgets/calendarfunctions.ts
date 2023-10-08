export async function GetCalendarsIds() {
    try {
      const response = await gapi.client.calendar.calendarList.list({});
      const calendars = response.result.items;
      const calendarIds = calendars.map((calendar) => calendar.id);
      console.log(calendarIds);
      return calendarIds;
    } catch (error) {
      console.error("Error fetching calendar IDs:", error);
      return [];
    }
  }
  
export async function GetEvents() {
    const CalendarIds:string[] = await GetCalendarsIds()
    console.log(CalendarIds)
    const AllEvents = await Promise.all(
        CalendarIds.map(async (calendarid) => {
            const response = await gapi.client.calendar.events.list({
                calendarId: calendarid
            })
            console.log(response)
        })

    )
}
