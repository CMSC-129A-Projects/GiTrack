const debug = require('debug')('backend:models-repositories');
const dbHandler = require('../db');

const { repo: repoErrorMessages } = require('../constants/error-messages');

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

async function getReposInBoard(boardId) {
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
  getReposInBoard,
  removeRepositoryfromBoard,
};
