const sqlite = require('sqlite3');
const debug = require('debug')('backend:db');

function initDB() {
  const db = new sqlite.Database('./app.db', sqlite.OPEN_READWRITE, (err) => {
    if (err) {
      debug('Error connecting to the database');
      debug(err);
    } else {
      debug('Connected to the tables database');
    }
  });

  return db;
}

module.exports = initDB();
