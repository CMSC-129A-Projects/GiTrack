const sqlite = require('sqlite3');
const debug = require('debug')('backend:db');
const schema = require('./schema');

function initDB() {
  const db = new sqlite.Database(
    './app.db',
    sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE,
    (err) => {
      if (err) {
        debug('Error connecting to the database');
        debug(err);
      } else {
        debug('Connected to the tables database');
        debug('Adding tables to DB');
        schema.forEach((val) => {
          db.run(val);
        });
      }
    }
  );

  return db;
}

module.exports = initDB();
