const dbHandler = require('../db');
const debug = require('debug')('backend:models-users');
const bcrypt = require('bcrypt');

const { user: userErrorMessages } = require('../constants/error-messages');

async function registerUser(username, password, email) {
  let hash = null;
  try {
    hash = await bcrypt.hash(password, 10);
  } catch (error) {
    debug(error);
    throw userErrorMessages.HASH;
  }

  const db = await dbHandler;

  const userResult = await db.get(
    `SELECT username From Users where username = "${username}"`
  );
  if (userResult !== undefined) {
    throw userErrorMessages.DUPLICATE_USER;
  }

  const emailResult = await db.get(`SELECT email From Users where email = "${email}"`);
  if (emailResult !== undefined) {
    throw userErrorMessages.DUPLICATE_EMAIL;
  }

  try {
    await db.run(
      `INSERT INTO Users (username, password, email)
     VALUES ("${username}", "${hash}", "${email}")`
    );

    debug(`Inserted ${username} into Users`);
  } catch (error) {
    debug(error);
    throw userErrorMessages.INSERT_FAILED;
  }
}

async function loginUser(username, password) {
  const db = await dbHandler;

  let result = null;
  if (username !== null) {
    result = await db.get(
      `SELECT password, id From Users where username = "${username}"`
    );
    if (result === undefined) {
      debug('Username not found');
      throw userErrorMessages.USER_NOT_FOUND;
    }
  }

  try {
    const success = await bcrypt.compare(password, result.password);
    if (!success) {
      debug('Hash check failed');
      throw userErrorMessages.USER_NOT_FOUND;
    }

    return result.id;
  } catch (error) {
    if (error === userErrorMessages.USER_NOT_FOUND) {
      throw error;
    } else {
      throw userErrorMessages.HASH;
    }
  }
}

module.exports = { userErrorMessages, registerUser, loginUser };
