export async function getAssignments(courseIds: string[], setAssignments) {
  try {
    console.log("multiple function calls!!");
    const allAssignments = [];
    // Use Promise.all to make API calls for each course in parallel
    await Promise.all(
      courseIds.map(async (courseId) => {
        const response = await gapi.client.classroom.courses.courseWork.list({
          courseId: courseId,
        });

        if (response.result.courseWork) {
          const courseAssignments = response.result.courseWork.map(
            (assignment) => {
              const { title, dueDate, dueTime, description, alternateLink } =
                assignment;
              const formattedDueDate = dueDate
                ? new Date(
                    dueDate.year,
                    dueDate.month - 1,
                    dueDate.day
                  ).toLocaleDateString()
                : "No Due Date";
              return {
                coursework_title: title || "No Title",
                coursework_dueDate: formattedDueDate,
                coursework_dueTime: dueTime || "No Due Time",
                coursework_description: description || "No Description",
                coursework_altlink: alternateLink || "No Alt Link",
              };
            }
          );
          allAssignments.push(...courseAssignments);
        } else {
          console.error(`Could not find assignments for course ${courseId}`);
        }
      })
    );

    // Sort assignments by due date
    allAssignments.sort((a, b) => {
      const dueDateA =
        a.coursework_dueDate === "No Due Date"
          ? ""
          : new Date(a.coursework_dueDate).toLocaleDateString();
      const dueDateB =
        b.coursework_dueDate === "No Due Date"
          ? ""
          : new Date(b.coursework_dueDate).toLocaleDateString();

      return dueDateB.localeCompare(dueDateA); // Compare as strings
    });

    setAssignments(allAssignments);
    console.log(allAssignments);
  } catch (error) {
    console.error("Error fetching assignments:", error);
    return;
  }
}
export function fetchCourses(setClassroomInfo) {
  gapi.client.classroom.courses
    .list()
    .then(function (response) {
      console.log(response.result.courses);
      setClassroomInfo(response.result.courses);
    })
    .catch(function (error) {
      console.error("Error making Classroom API request:", error);
    });
}

export function getCourseWork(courseIds: string[]) {
  gapi.client.classroom.courses.courseWork
    .list({
      courseId: courseId,
    })
    .then(function (response) {
      console.log(response.result);
      const courseWorks = response.result.courseWork;
      if (courseWorks && courseWorks.length > 0) {
        courseWorks.forEach(function (courseWork) {
          const courseWorkId: string = courseWork.id;
          console.log(courseWorkId);
          getGrades(courseId, courseWorkId);
        });
      }
    });
}
export function getGrades(courseIds: string[], courseWorkId: string) {
  gapi.client.classroom.courses.courseWork.studentSubmissions
    .list({
      courseId: courseId,
      courseWorkId: courseWorkId,
    })
    .then(function (response) {
      console.log(response.result);
    })
    .catch(function (error) {
      console.error("Error fetching student submissions:", error);
    });
}

export async function getAnnouncementsForCourse(
  courseIds: string[],
  setAnnouncements
) {
  console.log("multiple function calls!!");
  const allAnnouncements = [];
  // Use Promise.all to make API calls for each course in parallel
  await Promise.all(
    courseIds.map(async (courseId) => {
      const response = await gapi.client.classroom.courses.announcements.list({
        courseId: courseId,
      });
      if (response.result.announcements) {
        const courseAnnouncements = response.result.announcements.map(
          (announcement) => {
            const {
              courseId,
              creatorUserId,
              text,
              alternateLink,
              id,
              creationTime,
              updateTime,
            } = announcement;
            return {
              announcement_courseid: courseId,
              announcement_creatorUserId: creatorUserId,
              announcement_text: text,
              announcement_alternateLink: alternateLink,
              announcement_id: id,
              announcement_creationTime: creationTime,
              announcement_updateTime: updateTime,
            };
          }
        );
        allAnnouncements.push(...courseAnnouncements);
      } else {
        console.error(`Could not find announcements for course ${courseId}`);
      }
    })
  );

  // Sort announcements by updateTime
  allAnnouncements.sort((a, b) => {
    const timeA = new Date(a.announcement_updateTime).getTime();
    const timeB = new Date(b.announcement_updateTime).getTime();
    return timeB - timeA; // Sort in descending order
  });

  setAnnouncements(allAnnouncements);
  console.log(allAnnouncements);
}

export function getClassRoster(courseIds: string[]) {
  gapi.client.classroom.courses.teachers
    .list({
      courseId: courseId,
    })
    .then(function (response) {
      console.log(response.result);
    });
}
