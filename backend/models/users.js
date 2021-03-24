const dbHandler = require('../db');
const debug = require('debug')('backend:models-users');
const bcrypt = require('bcrypt');

const userStatus = {
  HASH: 'HASH',
  DUPLICATE_USER: 'DUPLICATE_USER',
  DUPLICATE_EMAIL: 'DUPLICATE_EMAIL',
  INSERT_FAILED: 'INSERT_FAILED',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
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
  } catch (error) {
    debug(error);
    throw userStatus.INSERT_FAILED;
  }
}

async function loginUser(username, password, email) {
  const db = await dbHandler;

  let result = null;
  if (username !== null) {
    result = await db.get(`SELECT password From Users where username = "${username}"`);
    if (result === undefined) {
      debug('Username not found');
      throw userStatus.USER_NOT_FOUND;
    }
  } else if (email !== null) {
    result = await db.get(`SELECT password From Users where email = "${email}"`);
    if (result === undefined) {
      debug('Email not found');
      throw userStatus.USER_NOT_FOUND;
    }
  }

  try {
    const success = await bcrypt.compare(password, result.password);
    if (!success) {
      debug('Hash check failed');
      throw userStatus.USER_NOT_FOUND;
    }
  } catch (error) {
    if (error === userStatus.USER_NOT_FOUND) {
      throw error;
    } else {
      throw userStatus.HASH;
    }
  }
}

module.exports = { userStatus, registerUser, loginUser };
