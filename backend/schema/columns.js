module.exports = `CREATE TABLE IF NOT EXISTS "Columns" (
  "id" INTEGER NOT NULL UNIQUE,
  "title" INTEGER NOT NULL,
  "board_id" INTEGER NOT NULL,
  PRIMARY KEY("id")
)`;
