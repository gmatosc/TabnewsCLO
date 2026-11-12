import course, { courseStatuses } from "models/course.js";

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function courseById(request, response) {
  const allowedMethods = ["GET", "PATCH", "DELETE"];
  if (!allowedMethods.includes(request.method)) {
    return response.status(405).json({
      error: `Method "${request.method}" not allowed`,
    });
  }

  const courseId = request.query.id;
  if (typeof courseId !== "string" || !uuidPattern.test(courseId)) {
    return response.status(404).json({ error: "Course not found" });
  }

  if (request.method === "GET") {
    try {
      const existingCourse = await course.findById(courseId);
      if (!existingCourse) {
        return response.status(404).json({ error: "Course not found" });
      }

      return response.status(200).json(existingCourse);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: "Internal server error" });
    }
  }

  if (request.method === "PATCH") {
    const courseData = request.body;
    if (
      !isObject(courseData) ||
      Object.keys(courseData).length === 0 ||
      hasUnsupportedFields(courseData)
    ) {
      return response.status(400).json({ error: "Invalid course data" });
    }

    if (
      Object.prototype.hasOwnProperty.call(courseData, "title") &&
      !isValidTitle(courseData.title)
    ) {
      return response.status(400).json({
        error: "title must be a non-empty string of at most 120 characters",
      });
    }

    if (
      Object.prototype.hasOwnProperty.call(courseData, "status") &&
      !courseStatuses.includes(courseData.status)
    ) {
      return response.status(400).json({ error: "Invalid course status" });
    }

    if (
      Object.prototype.hasOwnProperty.call(courseData, "description") &&
      courseData.description !== null &&
      typeof courseData.description !== "string"
    ) {
      return response
        .status(400)
        .json({ error: "description must be a string" });
    }

    try {
      const updatedCourse = await course.update(courseId, courseData);
      if (!updatedCourse) {
        return response.status(404).json({ error: "Course not found" });
      }

      return response.status(200).json(updatedCourse);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: "Internal server error" });
    }
  }

  try {
    const wasRemoved = await course.remove(courseId);
    if (!wasRemoved) {
      return response.status(404).json({ error: "Course not found" });
    }

    return response.status(204).end();
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
