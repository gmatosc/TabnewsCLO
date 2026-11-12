import { beforeAll, test, expect } from "@jest/globals";
import { createCourse, coursesUrl, resetDatabase } from "./helpers.js";

beforeAll(resetDatabase);

test("DELETE /api/v1/courses/[id] removes a course", async () => {
  const createdCourse = await createCourse();

  const response = await fetch(`${coursesUrl}/${createdCourse.id}`, {
    method: "DELETE",
  });
  expect(response.status).toBe(204);
  expect(await response.text()).toBe("");
});

test("DELETE /api/v1/courses/[id] returns 404 for a missing course", async () => {
  const id = "00000000-0000-0000-0000-000000000000";
  const response = await fetch(`${coursesUrl}/${id}`, { method: "DELETE" });

  expect(response.status).toBe(404);
  expect(await response.json()).toEqual({ error: "Course not found" });
});

test("DELETE /api/v1/courses/[id] returns 404 for an invalid UUID", async () => {
  const response = await fetch(`${coursesUrl}/not-a-uuid`, {
    method: "DELETE",
  });

  expect(response.status).toBe(404);
  expect(await response.json()).toEqual({ error: "Course not found" });
});
