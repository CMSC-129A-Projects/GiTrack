module.exports = `CREATE TABLE IF NOT EXISTS "Boards" (
  "id"      INTEGER NOT NULL UNIQUE,
  "title"   TEXT NOT NULL,
  PRIMARY KEY("id")
)`;
