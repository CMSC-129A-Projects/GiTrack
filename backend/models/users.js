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

/**
 * Registers a user. Password is hashed using bcrypt using 10 salt rounds
 * @param {string} username - Username of the user
 * @param {string} password - Password of the user
 * @param {string} email - Email of the user
 */
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

/**
 * Logs a user in based on username and password
 * @param {string} username - Username of the user
 * @param {string} password - Password of the user
 */
async function loginUser(username, password) {
  const db = await dbHandler;

  let result = null;

  // Check if user is in DB
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

  // Check if password is corret
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

/**
 * Encrypts the github auth token using aes-192
 * @param {string} token - Github token
 */
function encrypt(token) {
  debug(token);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-192-ctr', AES_KEY, iv);
  const encrypted = Buffer.concat([cipher.update(token), cipher.final()]);
  return { token: encrypted.toString('hex'), iv: iv.toString('hex') };
}

/**
 * Decrpyts the github auth token
 * @param {Object} tokenObj - Github token
 * @param {string} tokenObj.iv - Initialization vector of the token
 * @param {string} tokenObj.token - Initialization vector of the token
 */
function decrypt(tokenObj) {
  const iv = Buffer.from(tokenObj.iv, 'hex');
  const token = Buffer.from(tokenObj.token, 'hex');
  const decipher = crypto.createDecipheriv('aes-192-ctr', AES_KEY, iv);
  const decrypted = Buffer.concat([decipher.update(token), decipher.final()]);
  return decrypted.toString();
}

/**
 * Add the encrypted github token to the user
 * @param {number} id - ID of the user
 * @param {string} githubAuthToken - unencrypted auth token from GitHub
 */
async function addGithubToken(id, githubAuthToken) {
  const db = await dbHandler;

  // Check if auth already exists
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

/**
 * Gets the unencrypted github token of the user
 * @param {number} id - ID of the user
 */
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

/**
 * Removes the Github token of the user
 * @param {number} id - ID of the user
 */
async function removeGithubToken(id) {
  const db = await dbHandler;

  await db.run(
    'UPDATE Users SET github_auth = NULL, github_iv = NULL WHERE id = ?',
    id
  );
}

/**
 * Checks if user exists through ID
 * @param {number} id - ID of the user
 */
async function doesUserExistById(id) {
  const db = await dbHandler;

  try {
    const user = db.get('SELECT id FROM Users WHERE id = ?', id);

    return user;
  } catch (err) {
    debug(err);
    throw userErrorMessages.USER_NOT_FOUND;
  }
}

/**
 * Checks if users exists through email
 * @param {Array.<string>} emails - Emails of the user to check
 */
async function doUsersExistsByEmail(emails) {
  const db = await dbHandler;

  const select = await db.prepare('SELECT id FROM Users WHERE email = ?');

  const selectPromises = emails.map((email) => select.get(email));

  const ids = await Promise.all(selectPromises)
    .catch((err) => {
      debug(err);
      throw userErrorMessages.USER_NOT_FOUND;
    })
    .finally(async () => {
      debug('Selected Users based on Email');
      await select.finalize();
    });

  return ids.map((id) => id.id);
}

/**
 * Change password of user
 * @param {number} id - ID of user
 * @param {string} password - unencrypted password
 */
async function changePassword(id, password) {
  let hash = null;
  try {
    hash = await bcrypt.hash(password, 10);
  } catch (error) {
    debug(error);
    throw userErrorMessages.HASH;
  }

  const db = await dbHandler;

  try {
    await db.run('UPDATE Users SET password = ? WHERE id = ?', hash, id);
  } catch (err) {
    debug(err);

    throw userErrorMessages.PASSWORD_CHANGE_FAILED;
  }
}

module.exports = {
  registerUser,
  loginUser,
  addGithubToken,
  getGithubToken,
  removeGithubToken,
  doesUserExistById,
  doUsersExistsByEmail,
  changePassword,
};
