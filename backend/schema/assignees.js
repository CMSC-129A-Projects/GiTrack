module.exports = `CREATE TABLE IF NOT EXISTS "Assignees" (
  "user_id"       INTEGER NOT NULL,
  "task_id"       INTEGER NOT NULL,
  "is_developer"  INTEGER NOT NULL
)`;
