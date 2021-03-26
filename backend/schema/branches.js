module.exports = `CREATE TABLE IF NOT EXISTS "Branches" (
  "id" INTEGER NOT NULL UNIQUE,
  "repository_id" INTEGER NOT NULL,
  PRIMARY KEY("id")
)`;
