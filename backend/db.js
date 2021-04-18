const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const debug = require('debug')('backend:db');
const schema = require('./schema');

sqlite3.verbose();

async function initDB() {
  try {
    const db = await open({
      filename: './gitrack.db',
      driver: sqlite3.Database,
    });

    debug('Connected to the tables database');
    debug('Adding tables to DB');
    schema.forEach(async (val) => {
      try {
        db.run(val);
      } catch (err) {
        debug('Error creating table');
        debug(err);
      }
    });

    return db;
  } catch (err) {
    debug('Error connecting to the database');
    debug(err);
    return process.exit(1);
  }
}

module.exports = initDB();
