import { beforeAll, test, expect } from "@jest/globals";
import { coursesUrl, resetDatabase } from "./helpers.js";

beforeAll(resetDatabase);

test("POST /api/v1/courses creates a course", async () => {
  const response = await fetch(coursesUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: "Foundations",
      description: "Core concepts",
    }),
  });
  expect(response.status).toBe(201);

  const responseBody = await response.json();
  expect(responseBody).toEqual(
    expect.objectContaining({
      id: expect.any(String),
      title: "Foundations",
      description: "Core concepts",
      status: "planned",
      created_at: expect.any(String),
      updated_at: expect.any(String),
    }),
  );
});

test.each([
  [{}, "title must be a non-empty string of at most 120 characters"],
  [{ title: "Foundations", status: "invalid" }, "Invalid course status"],
])("POST /api/v1/courses rejects invalid data", async (courseData, error) => {
  const response = await fetch(coursesUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(courseData),
  });

  expect(response.status).toBe(400);
  expect(await response.json()).toEqual({ error });
});
