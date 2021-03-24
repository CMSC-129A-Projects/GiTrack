const dbHandler = require('../db');
const debug = require('debug')('backend:models-users');
const bcrypt = require('bcrypt');

const userStatus = {
  SUCCESS: 'SUCCESS',
  HASH: 'HASH',
  DUPLICATE_USER: 'DUPLICATE_USER',
  DUPLICATE_EMAIL: 'DUPLICATE_EMAIL',
  INSERT_FAILED: 'INSERT_FAILED',
};

async function registerUser(username, password, email) {
  let hash = null;
  try {
    hash = await bcrypt.hash(password, 10);
  } catch (error) {
    debug(error);
    throw userStatus.HASH;
  }
  const db = await dbHandler;

  const userResult = await db.get(
    `SELECT username From Users where username = "${username}"`
  );
  if (userResult !== undefined) {
    throw userStatus.DUPLICATE_USER;
  }

  const emailResult = await db.get(`SELECT email From Users where email = "${email}"`);
  if (emailResult !== undefined) {
    throw userStatus.DUPLICATE_EMAIL;
  }

  try {
    await db.run(
      `INSERT INTO Users (username, password, email)
     VALUES ("${username}", "${hash}", "${email}")`
    );

    debug(`Inserted ${username} into Users`);
    return userStatus.SUCCESS;
  } catch (error) {
    debug(error);
    throw userStatus.INSERT_FAILED;
  }
}

module.exports = { userStatus, registerUser };
