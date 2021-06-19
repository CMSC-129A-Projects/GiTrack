const debug = require('debug')('backend:models-repositories');
const dbHandler = require('../db');

const { repo: repoErrorMessages } = require('../constants/error-messages');

/**
 * Connect a repository to a board
 * @param {number} id - Repository ID from GitHub
 * @param {number} name - Repository Name
 * @param {string} url - Repository URL
 * @param {number} boardId - ID of the board to be connected
 */
async function connectRepository(id, name, url, boardId) {
  const db = await dbHandler;

  try {
    await db.run(
      'INSERT INTO Repositories (id, full_name, url, board_id) VALUES (?, ?, ?, ?)',
      id,
      name,
      url,
      boardId
    );
  } catch (err) {
    debug(err);
    throw repoErrorMessages.CONNECTION_FAILED;
  }
}

/**
 * Get full name of a repository
 * @param {number} id - Repository ID from GitHub
 */
async function getRepository(id) {
  const db = await dbHandler;

  try {
    const repo = await db.get('SELECT full_name FROM Repositories WHERE id = ?', id);
    return repo.full_name;
  } catch (err) {
    debug(err);
    throw repoErrorMessages.GET_FAILED;
  }
}

/**
 * Get repositories that are connected to a board
 * @param {number} boardId - ID of the board
 */
async function getRepositoriesInBoard(boardId) {
  const db = await dbHandler;

  try {
    const repos = await db.all(
      'SELECT id, full_name, url FROM Repositories WHERE board_id = ?',
      boardId
    );

    return repos;
  } catch (err) {
    debug(err);
    throw repoErrorMessages.CONNECTION_FAILED;
  }
}

/**
 * Remove repository connection
 * @param {number} boardId - ID of the board
 * @param {number} repoId - ID of the repo to be removed
 */
async function removeRepositoryfromBoard(boardId, repoId) {
  const db = await dbHandler;

  try {
    await db.run(
      'DELETE FROM Repositories WHERE id = ? AND board_id = ?',
      repoId,
      boardId
    );
  } catch (err) {
    debug(err);
    throw repoErrorMessages.CONNECTION_FAILED;
  }
}

module.exports = {
  connectRepository,
  getRepository,
  getRepositoriesInBoard,
  removeRepositoryfromBoard,
};
