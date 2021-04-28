const debug = require('debug')('backend:models-repositories');
const dbHandler = require('../db');

const { repo: repoErrorMessages } = require('../constants/error-messages');

async function connectRepository(id, name, url, boardId) {
  const db = await dbHandler;

  try {
    await db.run(
      'INSERT INTO Repositories (id, name, url, board_id) VALUES (?, ?, ?, ?)',
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

module.exports = {
  connectRepository,
};
