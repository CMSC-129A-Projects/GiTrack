module.exports = `CREATE TABLE IF NOT EXISTS "Tasks" (
  "id" INTEGER NOT NULL UNIQUE,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "branch_name" TEXT DEFAULT NULL,
  "latest_commit" TEXT DEFAULT NULL,
  "repo_id" INTEGER DEFAULT NULL,
  "board_id" INTEGER NOT NULL, 
  "column_id" INTEGER NOT NULL,
  PRIMARY KEY("id")
)`;
