module.exports = `CREATE TABLE IF NOT EXISTS "Users" (
  "id"          INTEGER NOT NULL UNIQUE,
  "username"    TEXT NOT NULL UNIQUE,
  "password"    TEXT NOT NULL,
  "email"       TEXT NOT NULL UNIQUE,
  "github_auth" TEXT DEFAULT NULL,
  "github_iv"   TEXT DEFAULT NULL,
  PRIMARY KEY("id")
)`;
