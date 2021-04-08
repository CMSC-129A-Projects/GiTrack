const debug = require('debug')('backend:models-board');
const dbHandler = require('../db');

const { board: boardErrorMessages } = require('../constants/error-messages');

async function createBoard(title, userId) {
  const db = await dbHandler;

  try {
    const boardResult = await db.run(`INSERT INTO Boards (title) VALUES ("${title}")`);
    await db.run(
      `INSERT INTO Memberships (board_id, user_id) VALUES (${boardResult.lastID}, ${userId})`
    );

    return boardResult.lastID;
  } catch (err) {
    debug(err);
    throw boardErrorMessages.INSERT_FAILED;
  }
}

async function editBoard(boardId, newName, userId) {
  const db = await dbHandler;

  const userPermission = await db.get(`SELECT is_developer
  FROM Columns JOIN Tasks ON Tasks.column_id = Columns.id
  JOIN Assignees ON Assignees.task_id = Tasks.id
  JOIN Memberships ON Assignees.user_id = Memberships.user_id
  WHERE Memberships.user_id = ${userId} AND Columns.board_id = ${boardId}`);
  if (userPermission) {
    throw boardErrorMessages.NOT_ENOUGH_PERMISSIONS;
  }

  try {
    await db.run(`UPDATE Boards SET title = "${newName}" WHERE id = ${boardId}`);
    debug(`Board renamed to ${newName}.`);

    return true;
  } catch (err) {
    debug(err);

    throw boardErrorMessages.EDIT_FAILED;
  }
}

async function deleteBoard(boardId, userId) {
  const db = await dbHandler;

  const userPermission = await db.get(`SELECT is_developer
  FROM Columns JOIN Tasks ON Tasks.column_id = Columns.id
  JOIN Assignees ON Assignees.task_id = Tasks.id
  JOIN Memberships ON Assignees.user_id = Memberships.user_id
  WHERE Memberships.user_id = ${userId} AND Columns.board_id = ${boardId}`);
  if (userPermission) {
    throw boardErrorMessages.NOT_ENOUGH_PERMISSIONS;
  }

  try {
    await db.run(`DELETE FROM Boards WHERE board_id = ${boardId}`);

    return true;
  } catch (err) {
    debug(err);

    throw boardErrorMessages.DELETE_FAILED;
  }
}

async function getBoardsWithUser(userId) {
  const db = await dbHandler;

  try {
    const boards = await db.run(
      `SELECT title FROM Memberships JOIN Boards ON Memberships.board_id = Boards.id WHERE user_id = ${userId}`
    );

    return boards;
  } catch (err) {
    debug(err);

    throw boardErrorMessages.GET_FAILED;
  }
}

module.exports = {
  createBoard,
  editBoard,
  deleteBoard,
  getBoardsWithUser,
};
