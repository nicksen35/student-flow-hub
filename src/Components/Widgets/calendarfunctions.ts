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

export async function GetEvents(setEvents, maxresults) {
  const allEvents = [];
  const CalendarIds: string[] = await GetCalendarsIds();
  console.log(CalendarIds);
  const currentDate = new Date(); // Get the current date and time
  const currentDateTimeRFC3339 = currentDate
    .toISOString()
    .replace(/\.\d+Z$/, "Z"); // Convert to RFC3339 format
    
  const AllEvents = await Promise.all(
    CalendarIds.map(async (calendarid) => {
      const response = await gapi.client.calendar.events.list({
        calendarId: calendarid,
        maxResults: maxresults,
        timeMin: currentDate.toISOString(),
        singleEvents: true,
      });

      response.result.items.map((event) => {
        const {
          etag,
          creator,
          description,
          start,
          end,
          updated,
          status,
          summary,
          created,
        } = event;
        const hasDateTime: boolean = start.dateTime ? true : false
        const startTime = hasDateTime ? new Date(start.dateTime) : new Date(start.date); 
        const endTime = new Date(end.dateTime);

        const startTimeText = startTime.toLocaleString(); // Convert to a localized date and time string
        const endTimeText = endTime.toLocaleString();
        const userEvent = {
          event_etag: etag,
          event_creator: creator || "No Creator",
          event_description: description || "No Description",
          event_starttime: startTimeText,
          event_endtime: endTimeText,
          event_updatedtime: updated,
          event_status: status,
          event_summary: summary,
          event_created: created,
        };
        allEvents.push(userEvent);
      });
      allEvents.sort((eventA, eventB) => {
        const now = new Date();
        const startTimeA = new Date(
          eventA.event_starttime
        );
        const startTimeB = new Date(
          eventB.event_starttime
        );
        const timeRemainingA = startTimeA - now;
        const timeRemainingB = startTimeB - now;
        return timeRemainingA - timeRemainingB;
      });
    })
  );
  const limitedEvents = allEvents.slice(0, maxresults);
  limitedEvents.sort((eventA, eventB) => {
    const now = new Date();
    const startTimeA = new Date(
      eventA.event_starttime
    );
    const startTimeB = new Date(
      eventB.event_starttime
    );
    const timeRemainingA = startTimeA - now;
    const timeRemainingB = startTimeB - now;
    return timeRemainingA - timeRemainingB;
  });
  setEvents(limitedEvents);
  console.log(limitedEvents);
}
