export async function getAssignments(courseIds: string[], setAssignments) {
  try {
    console.log("multiple function calls!!");

    const allAssignments = await Promise.all(
      courseIds.map(async (courseId) => {
        const response = await gapi.client.classroom.courses.courseWork.list({
          courseId: courseId,
        });

        const { courseWork } = response.result;
        if (!courseWork) {
          console.error(`Could not find assignments for course ${courseId}`);
          return [];
        }

        return courseWork.map((assignment) => {
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
        });
      })
    );

    // Flatten the array of assignments
    const flattenedAssignments = allAssignments.flat();

    // Sort assignments by due date
    flattenedAssignments.sort((a, b) => {
      const dueDateA = a.coursework_dueDate;
      const dueDateB = b.coursework_dueDate;

      return dueDateA.localeCompare(dueDateB, undefined, {
        numeric: true,
        sensitivity: "base",
      });
    });

    setAssignments(flattenedAssignments);

    console.log(flattenedAssignments);
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

export async function getCourseWork(courseIds: string[], setGrades) {
  const allGrades = [];
  await Promise.all(
    courseIds.map(async (courseId) => {
      console.log(courseId)
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
              
              getGrades(courseId, courseWorkId, setGrades, allGrades);
            });
          }
        });
    })
  );
}
export async function getGrades(courseId: string, courseWorkId: string, setGrades, allGrades:object[]) {
  
  try {
    const response = await gapi.client.classroom.courses.courseWork.studentSubmissions.list({
      courseId: courseId,
      courseWorkId: courseWorkId,
      userId: 'me'
    });

    const studentSubmissions = response.result.studentSubmissions || [];
    

    studentSubmissions.forEach((submission) => {
      console.log(submission);

      // Add the entire submission object to the allGrades array
      allGrades.push(submission);
      console.log(allGrades)
    });

    // Set the grades in the state or perform any other necessary action
    setGrades(allGrades);
    console.log(allGrades)
    return allGrades;
  } catch (error) {
    console.error("Error fetching student submissions:", error);
    return [];
  }
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

export async function getClassRoster(courseIds: string[], getTeachers) {
  const allTeachers = [];
  await Promise.all(
    courseIds.map(async (courseId) => {
      const response = await gapi.client.classroom.courses.teachers.list({
        courseId: courseId,
      });
      if (response.result.teachers) {
        const courseTeachers = response.result.teachers.map((teacher) => {
          console.log(teacher);
          const { profile, courseId } = teacher;
          return {
            teacher_fullName: profile?.name?.fullName,
            teacher_courseId: courseId,
          };
        });
        allTeachers.push(...courseTeachers);
      }
    })
  );
  getTeachers(allTeachers);
}
