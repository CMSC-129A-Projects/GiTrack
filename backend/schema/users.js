module.exports = `CREATE TABLE IF NOT EXISTS "Users" (
  "id"    INTEGER NOT NULL UNIQUE,
  "name"  TEXT NOT NULL,
  PRIMARY KEY("id")
)`;
