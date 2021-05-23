module.exports = `CREATE TABLE IF NOT EXISTS "Repositories" (
  "id" INTEGER NOT NULL UNIQUE,
  "full_name" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "board_id" INTEGER NOT NULL
)`;
