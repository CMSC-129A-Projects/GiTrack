module.exports = `CREATE TABLE IF NOT EXISTS "Tasks" (
  "id" INTEGER NOT NULL UNIQUE,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "column_id" INTEGER NOT NULL,
  PRIMARY KEY("id")
)`;
