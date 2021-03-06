const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const debug = require('debug')('backend:db');
const schema = require('./schema');

let filename;

switch (process.env.NODE_ENV) {
  case 'PROD':
    filename = './gitrack-prod.db';
    break;
  case 'TEST':
    filename = './gitrack-test.db';
    sqlite3.verbose();
    break;
  default:
  case 'DEV':
    filename = './gitrack-dev.db';
    sqlite3.verbose();
    break;
}

async function initDB() {
  try {
    const db = await open({
      filename,
      driver: sqlite3.cached.Database,
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
