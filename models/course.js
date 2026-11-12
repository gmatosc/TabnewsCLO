import database from "infra/database.js";

export const courseStatuses = ["planned", "in_progress", "done"];

async function create(course) {
  const result = await database.query({
    text: `
      INSERT INTO courses (title, description, status)
      VALUES ($1, $2, $3)
      RETURNING *;
    `,
    values: [
      course.title,
      course.description ?? null,
      course.status ?? "planned",
    ],
  });

  return result.rows[0];
}

async function findAll() {
  const result = await database.query(
    "SELECT * FROM courses ORDER BY created_at ASC, id ASC;",
  );
  return result.rows;
}

async function findById(id) {
  const result = await database.query({
    text: "SELECT * FROM courses WHERE id = $1;",
    values: [id],
  });
  return result.rows[0] ?? null;
}

async function update(id, course) {
  const fields = ["title", "description", "status"];
  const values = [id];
  const assignments = [];

  for (const field of fields) {
    if (Object.prototype.hasOwnProperty.call(course, field)) {
      values.push(course[field]);
      assignments.push(`${field} = $${values.length}`);
    }
  }

  if (assignments.length === 0) {
    return null;
  }

  assignments.push("updated_at = NOW()");

  const result = await database.query({
    text: `
      UPDATE courses
      SET ${assignments.join(", ")}
      WHERE id = $1
      RETURNING *;
    `,
    values,
  });

  return result.rows[0] ?? null;
}

async function remove(id) {
  const result = await database.query({
    text: "DELETE FROM courses WHERE id = $1 RETURNING id;",
    values: [id],
  });
  return result.rowCount > 0;
}

export default {
  create,
  findAll,
  findById,
  update,
  remove,
};
