module.exports = `CREATE TABLE IF NOT EXISTS "Repositories" (
  "id" INTEGER NOT NULL UNIQUE,
  "name" TEXT NOT NULL,
  "authToken" TEXT NOT NULL UNIQUE,
  "board_id" INTEGER NOT NULL,
  PRIMARY KEY("id")
)`;
