import { beforeAll, test, expect } from "@jest/globals";
import { createCourse, coursesUrl, resetDatabase } from "./helpers.js";

beforeAll(resetDatabase);

test("GET /api/v1/courses returns the courses list", async () => {
  const createdCourse = await createCourse({ title: "Foundations" });

  const response = await fetch(coursesUrl);
  expect(response.status).toBe(200);

  const responseBody = await response.json();
  expect(responseBody).toEqual([createdCourse]);
});

test("GET /api/v1/courses/[id] returns a course", async () => {
  const createdCourse = await createCourse({
    title: "Foundations",
    description: "Core concepts",
    status: "in_progress",
  });

  const response = await fetch(`${coursesUrl}/${createdCourse.id}`);
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual(createdCourse);
});

test.each([
  ["unknown UUID", "00000000-0000-0000-0000-000000000000"],
  ["invalid UUID", "not-a-uuid"],
])("GET /api/v1/courses/%s returns 404", async (_label, id) => {
  const response = await fetch(`${coursesUrl}/${id}`);
  expect(response.status).toBe(404);
  expect(await response.json()).toEqual({ error: "Course not found" });
});

test("unsupported methods return a JSON 405 error", async () => {
  const response = await fetch(coursesUrl, { method: "PUT" });
  expect(response.status).toBe(405);
  expect(await response.json()).toEqual({
    error: 'Method "PUT" not allowed',
  });
});

test("unsupported methods on a course return a JSON 405 error", async () => {
  const response = await fetch(
    `${coursesUrl}/00000000-0000-0000-0000-000000000000`,
    { method: "PUT" },
  );
  expect(response.status).toBe(405);
  expect(await response.json()).toEqual({
    error: 'Method "PUT" not allowed',
  });
});
