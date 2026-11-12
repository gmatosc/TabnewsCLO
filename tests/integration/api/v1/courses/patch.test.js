import { beforeAll, test, expect } from "@jest/globals";
import { createCourse, coursesUrl, resetDatabase } from "./helpers.js";

beforeAll(resetDatabase);

test("PATCH /api/v1/courses/[id] updates a course", async () => {
  const createdCourse = await createCourse({ title: "Foundations" });
  await new Promise((resolve) => setTimeout(resolve, 10));

  const response = await fetch(`${coursesUrl}/${createdCourse.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: "Advanced foundations",
      description: "Updated concepts",
      status: "done",
    }),
  });
  expect(response.status).toBe(200);

  const responseBody = await response.json();
  expect(responseBody).toEqual(
    expect.objectContaining({
      id: createdCourse.id,
      title: "Advanced foundations",
      description: "Updated concepts",
      status: "done",
    }),
  );
  expect(responseBody.updated_at).not.toBe(createdCourse.updated_at);
});

test("PATCH /api/v1/courses/[id] returns 400 for an invalid status", async () => {
  const createdCourse = await createCourse();

  const response = await fetch(`${coursesUrl}/${createdCourse.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "invalid" }),
  });
  expect(response.status).toBe(400);
  expect(await response.json()).toEqual({ error: "Invalid course status" });
});

test.each([
  ["unknown UUID", "00000000-0000-0000-0000-000000000000"],
  ["invalid UUID", "not-a-uuid"],
])("PATCH /api/v1/courses/%s returns 404", async (_label, id) => {
  const response = await fetch(`${coursesUrl}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "Updated" }),
  });
  expect(response.status).toBe(404);
  expect(await response.json()).toEqual({ error: "Course not found" });
});
