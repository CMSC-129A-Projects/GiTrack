/* eslint-disable no-await-in-loop */
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const debug = require('debug')('backend:models-users');

const dbHandler = require('../db');

const {
  user: userErrorMessages,
  github: githubErrorMessages,
} = require('../constants/error-messages');

const { AES_SECRET } = require('../constants/keys');

const AES_KEY = Buffer.from(AES_SECRET.split('.').map(Number));

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
    'SELECT username FROM Users WHERE username = ?',
    username
  );
  if (userResult !== undefined) {
    throw userErrorMessages.DUPLICATE_USER;
  }

  const emailResult = await db.get('SELECT email FROM Users WHERE email = ?', email);
  if (emailResult !== undefined) {
    throw userErrorMessages.DUPLICATE_EMAIL;
  }

  try {
    await db.run(
      'INSERT INTO Users (username, password, email) VALUES (?,?,?)',
      username,
      hash,
      email
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
      'SELECT password, id FROM Users WHERE username = ?',
      username
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

function encrypt(token) {
  const iv = crypto.randomBytes(16);
  debug(AES_SECRET);
  debug(AES_KEY);
  const cipher = crypto.createCipheriv('aes-192-ctr', AES_KEY, iv);
  const encrypted = Buffer.concat([cipher.update(token), cipher.final()]);
  return { token: encrypted.toString('hex'), iv: iv.toString('hex') };
}

function decrypt(tokenObj) {
  const iv = Buffer.from(tokenObj.iv, 'hex');
  const token = Buffer.from(tokenObj.token, 'hex');
  const decipher = crypto.createDecipheriv('aes-192-ctr', AES_KEY, iv);
  const decrypted = Buffer.concat([decipher.update(token), decipher.final()]);
  return decrypted.toString();
}

async function addGithubToken(id, githubAuthToken) {
  const db = await dbHandler;

  const currentAuth = await db.get('SELECT github_auth FROM Users WHERE id = ?', id);

  if (currentAuth && currentAuth.github_auth !== null) {
    throw githubErrorMessages.ALREADY_GITHUB_AUTHENTICATED;
  }

  const { token, iv } = encrypt(githubAuthToken);

  try {
    await db.run(
      'UPDATE Users SET github_auth = ?, github_iv = ? WHERE id = ?',
      token,
      iv,
      id
    );
  } catch (err) {
    debug(err);
    throw userErrorMessages.INSERT_FAILED;
  }
}

async function getGithubToken(id) {
  const db = await dbHandler;

  const auth = await db.get(
    'SELECT github_auth, github_iv FROM Users where id = ?',
    id
  );

  if (auth.github_auth === null) {
    throw githubErrorMessages.NOT_GITHUB_AUTHENTICATED;
  }

  return decrypt({ token: auth.github_auth, iv: auth.github_iv });
}

async function removeGithubToken(id) {
  const db = await dbHandler;

  await db.run(
    'UPDATE Users SET github_auth = NULL, github_iv = NULL WHERE id = ?',
    id
  );
}

async function findUser(id) {
  const db = await dbHandler;

  try {
    const user = db.get('SELECT id FROM Users WHERE id = ?', id);

    return user;
  } catch (err) {
    debug(err);
    throw userErrorMessages.USER_NOT_FOUND;
  }
}

async function usersExist(emails) {
  const db = await dbHandler;
  const users = [];

  try {
    for (let i = 0; i < emails.length; i += 1) {
      const user = await db.get('SELECT id FROM Users WHERE email = ?', emails[i]);
      users.push(user.id);
    }

    return users;
  } catch (err) {
    debug(err);
    throw userErrorMessages.USER_NOT_FOUND;
  }
}

module.exports = {
  registerUser,
  loginUser,
  addGithubToken,
  getGithubToken,
  removeGithubToken,
  findUser,
  usersExist,
};
