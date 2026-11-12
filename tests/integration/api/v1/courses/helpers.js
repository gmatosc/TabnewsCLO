import database from "infra/database.js";

const coursesUrl = "http://localhost:3000/api/v1/courses";

export async function resetDatabase() {
  await database.query("drop schema public cascade; create schema public");

  const migrationResponse = await fetch(
    "http://localhost:3000/api/v1/migrations",
    { method: "POST" },
  );
  expect(migrationResponse.status).toBe(201);

  const migrationResults = await migrationResponse.json();
  expect(Array.isArray(migrationResults)).toBe(true);
  expect(migrationResults.length).toBeGreaterThan(0);
}

export async function createCourse(courseData = { title: "Test course" }) {
  const response = await fetch(coursesUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(courseData),
  });
  expect(response.status).toBe(201);
  return response.json();
}

export { coursesUrl };
