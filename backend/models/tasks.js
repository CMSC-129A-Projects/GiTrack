/* eslint-disable prettier/prettier */
const debug = require('debug')('backend:models-tasks');
const dbHandler = require('../db');

const {
  board: boardErrorMessages,
  task: taskErrorMessages,
} = require('../constants/error-messages');

async function getPermissions(db, userId, boardId) {
  const userPermission = await db.get(`SELECT is_developer
    FROM Memberships WHERE user_id = ${userId} AND board_id = ${boardId}`);
  if (!userPermission) {
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
      `INSERT INTO Tasks (title, description, board_id, column_id) VALUES ("${title}", "${description}", ${boardId}, 0)`
    );

    return title;
  } catch (err) {
    debug(err);

    throw taskErrorMessages.INSERT_FAILED;
  }
}

async function removeTask(title, userId, boardId) {
  const db = await dbHandler;

  await getPermissions(db, userId, boardId);

  try {
    await db.run(
      `DELETE FROM Tasks WHERE title = "${title}" AND board_id = ${boardId}`
    );

    return title;
  } catch (err) {
    debug(err);
    
    throw taskErrorMessages.TASK_NOT_FOUND;
  }
};

async function getBoardTasks(userId, boardId) {
  const db = await dbHandler;

  await getPermissions(db, userId, boardId);

  try {
    const taskList = await db.all(
      `SELECT title FROM Tasks WHERE board_id = ${boardId}`
    );

    return taskList;
  } catch (err) {
    debug(err);
    throw taskErrorMessages.TASK_NOT_FOUND;
  }
}

module.exports = {
  addTask,
  removeTask,
  getBoardTasks
};
