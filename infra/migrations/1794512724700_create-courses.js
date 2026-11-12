/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) =>
  pgm.createTable("courses", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    title: {
      type: "varchar(120)",
      notNull: true,
    },
    description: {
      type: "text",
    },
    status: {
      type: "varchar(20)",
      notNull: true,
      default: "planned",
      check: "status IN ('planned', 'in_progress', 'done')",
    },
    created_at: {
      type: "timestamptz",
      default: pgm.func("now()"),
    },
    updated_at: {
      type: "timestamptz",
      default: pgm.func("now()"),
    },
  });

exports.down = (pgm) => pgm.dropTable("courses");
