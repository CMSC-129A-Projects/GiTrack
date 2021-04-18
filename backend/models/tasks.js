const debug = require('debug')('backend:models-board');
const dbHandler = require('../db');

const {
  board: boardErrorMessages,
  task: taskErrorMessages,
} = require('../constants/error-messages');

async function getPermissions(db, userId, boardId) {
  const userPermission = await db.get(`SELECT is_developer
    FROM Memberships WHERE user_id = ${userId} AND board_id = ${boardId}`);
  if (userPermission) {
    throw boardErrorMessages.NOT_ENOUGH_PERMISSIONS;
  } else {
    return true;
  }
}

async function addTask(title, description, userId, boardId) {
  const db = await dbHandler;

  await getPermissions(db, userId, boardId);

  try {
    await db.run(
      `INSERT INTO Tasks (title, description, board_id, column_id) VALUES (${title}, ${description}, ${boardId}, 0)`
    );

    return title;
  } catch (err) {
    debug(err);

    throw taskErrorMessages.INSERT_FAILED;
  }
}

module.exports = {
  addTask,
};
