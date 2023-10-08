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
      const dueDateA =
        a.coursework_dueDate === "No Due Date" ? null : new Date(a.coursework_dueDate);
      const dueDateB =
        b.coursework_dueDate === "No Due Date" ? null : new Date(b.coursework_dueDate);

      if (dueDateA === null && dueDateB === null) {
        return 0;
      } else if (dueDateA === null) {
        return 1; 
      } else if (dueDateB === null) {
        return -1; 
      }

      return dueDateB - dueDateA;
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

export async function getGrades(courseIds: string[], setGrades) {
  let start = Date.now();
  try {
    const allGrades = [];
    await Promise.all(
      courseIds.map(async (courseId) => {
        const courseworkResponse =
          await gapi.client.classroom.courses.courseWork.list({
            courseId: courseId,
          });
        const coursework = courseworkResponse.result.courseWork;
        for (const courseWork of coursework) {
          const courseWorkId = courseWork.id;

          // Step 5: Get student submissions for the current coursework.
          const submissionsResponse =
            await gapi.client.classroom.courses.courseWork.studentSubmissions.list(
              {
                courseId: courseId,
                courseWorkId: courseWorkId,
                userId: "me", // Fetch your own submissions.
              }
            );
          const submissions =
            submissionsResponse.result.studentSubmissions || [];
          if (submissions.length != 0) {
            const CourseInfo = courseWork;
            const { dueDate, creationTime, title, maxPoints } = CourseInfo;
            const formattedDueDate = dueDate
              ? new Date(
                  dueDate.year,
                  dueDate.month - 1,
                  dueDate.day
                ).toLocaleDateString()
              : "No Due Date";
            const gradeInfo = {
              assigned_grade: submissions.at(0)?.assignedGrade || "Not Graded",
              max_grade: maxPoints,
              course_name: title,
              course_dueDate: formattedDueDate,
              course_creationDate: creationTime,
            };
            console.log(gradeInfo);
            allGrades.push(gradeInfo);
          }
        }
      })
    );
    const flattenedGrades = allGrades.flat();

    // ...

    // Sort assignments by due date
    flattenedGrades.sort((a, b) => {
      const dueDateA =
        a.course_dueDate === "No Due Date" ? null : new Date(a.course_dueDate);
      const dueDateB =
        b.course_dueDate === "No Due Date" ? null : new Date(b.course_dueDate);

      if (dueDateA === null && dueDateB === null) {
        return 0;
      } else if (dueDateA === null) {
        return 1; 
      } else if (dueDateB === null) {
        return -1; 
      }

      return dueDateB - dueDateA;
    });

    setGrades(flattenedGrades);
    console.log(flattenedGrades);

    // ...

    let timeTaken = Date.now() - start;
    console.log("Total time taken : " + timeTaken + " milliseconds");
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
