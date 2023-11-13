export async function getAssignments(courseIds: string[], setAssignments, courses) {
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
          const {
            title,
            dueDate,
            dueTime,
            description,
            alternateLink,
            courseId,
          } = assignment;
        let courseName = "";
          const formattedDueDate = dueDate
            ? new Date(
                dueDate.year,
                dueDate.month - 1,
                dueDate.day
              ).toLocaleDateString()
            : "No Due Date";
          const matchedCourse =
            courses.find((course) => course.id === courseId);
          if (matchedCourse) {
            courseName = matchedCourse.name;
          }
          return {
            coursework_title: title || "No Title",
            coursework_dueDate: formattedDueDate,
            coursework_dueTime: dueTime || "No Due Time",
            coursework_description: description || "No Description",
            coursework_altlink: alternateLink || "No Alt Link",
            coursework_courseName: courseName || "No Course Name",
          };
        });
      })
    );

    // Flatten the array of assignments
    const flattenedAssignments = allAssignments.flat();

    // Sort assignments by due date
    flattenedAssignments.sort((a, b) => {
      const dueDateA =
        a.coursework_dueDate === "No Due Date"
          ? null
          : new Date(a.coursework_dueDate);
      const dueDateB =
        b.coursework_dueDate === "No Due Date"
          ? null
          : new Date(b.coursework_dueDate);

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

export async function fetchCourses() {
  try {
    const response = await gapi.client.classroom.courses.list();
    console.log(response.result.courses);
    return response.result.courses;
  } catch (error) {
    console.error("Error making Classroom API request:", error);
    throw error; // You might want to handle the error further up in the call chain.
  }
}

export async function getGrades(courseIds: string[], setGrades, courses) {
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
            const { dueDate, creationTime, title, maxPoints, courseId } = CourseInfo;
            let courseName = courseId;
            const matchedCourse =
            courses.find((course) => course.id === courseId);
          if (matchedCourse) {
            courseName = matchedCourse.name;
          }
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
              course_courseName: courseName,
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
  setAnnouncements,
  courses
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
            let courseName = courseId;
            const matchedCourse =
              courses.find((course) => course.id === courseId) ||
              courses.find((course) => course.id);
            if (matchedCourse) {
              courseName = matchedCourse.name;
            }
            return {
              announcement_courseid: courseId,
              announcement_coursename: courseName,
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

export async function getClassRoster(
  courseIds: string[],
  getTeachers,
  courses
) {
  const allTeachers = [];
  await Promise.all(
    courseIds.map(async (courseId) => {
      const response = await gapi.client.classroom.courses.teachers.list({
        courseId: courseId,
      });
      if (response.result.teachers) {
        const courseTeachers = response.result.teachers.map((teacher) => {
          let courseName = courseId;
          const { profile, courseId: teacherCourseId } = teacher;
          const matchedCourse = courses.find(
            (course) => course.id === teacherCourseId
          );
          if (matchedCourse) {
            courseName = matchedCourse.name;
          }
          return {
            teacher_fullName: profile?.name?.fullName,
            teacher_courseId: courseName,
          };
        });
        console.log(courseTeachers);
        allTeachers.push(...courseTeachers);
      }
    })
  );
  getTeachers(allTeachers);
}
