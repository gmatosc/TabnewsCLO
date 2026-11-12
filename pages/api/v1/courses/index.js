import course, { courseStatuses } from "models/course.js";

export default async function courses(request, response) {
  const allowedMethods = ["GET", "POST"];
  if (!allowedMethods.includes(request.method)) {
    return response.status(405).json({
      error: `Method "${request.method}" not allowed`,
    });
  }

  if (request.method === "GET") {
    try {
      const courses = await course.findAll();
      return response.status(200).json(courses);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: "Internal server error" });
    }
  }

  const courseData = request.body;
  if (!isObject(courseData) || hasUnsupportedFields(courseData)) {
    return response.status(400).json({ error: "Invalid course data" });
  }

  if (!isValidTitle(courseData.title)) {
    return response.status(400).json({
      error: "title must be a non-empty string of at most 120 characters",
    });
  }

  if (
    courseData.status !== undefined &&
    !courseStatuses.includes(courseData.status)
  ) {
    return response.status(400).json({ error: "Invalid course status" });
  }

  if (
    courseData.description !== undefined &&
    courseData.description !== null &&
    typeof courseData.description !== "string"
  ) {
    return response.status(400).json({ error: "description must be a string" });
  }

  try {
    const createdCourse = await course.create(courseData);
    return response.status(201).json(createdCourse);
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: "Internal server error" });
  }
}

function isObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isValidTitle(title) {
  return (
    typeof title === "string" &&
    title.trim().length > 0 &&
    Array.from(title).length <= 120
  );
}

function hasUnsupportedFields(courseData) {
  const allowedFields = ["title", "description", "status"];
  return Object.keys(courseData).some(
    (field) => !allowedFields.includes(field),
  );
}
