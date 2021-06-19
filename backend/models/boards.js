const debug = require('debug')('backend:models-board');
const dbHandler = require('../db');

const { board: boardErrorMessages } = require('../constants/error-messages');

async function createBoard(title, userId) {
  const db = await dbHandler;

  try {
    const boardResult = await db.run('INSERT INTO Boards (title) VALUES (?)', title);
    await db.run(
      'INSERT INTO Memberships (board_id, user_id, is_developer) VALUES (?, ?, 0)',
      boardResult.lastID,
      userId
    );

    return boardResult.lastID;
  } catch (err) {
    debug(err);
    throw boardErrorMessages.INSERT_FAILED;
  }
}

async function editBoard(boardId, newName) {
  const db = await dbHandler;

  try {
    await db.run('UPDATE Boards SET title = ? WHERE id = ?', newName, boardId);
  } catch (err) {
    debug(err);

    throw boardErrorMessages.EDIT_FAILED;
  }
}

async function deleteBoard(boardId) {
  const db = await dbHandler;

  try {
    await db.run('DELETE FROM Boards WHERE id = (?)', boardId);
    await db.run('DELETE FROM Memberships WHERE board_id = (?)', boardId);
    await db.run('DELETE FROM Repositories WHERE board_id = (?)', boardId);
    await db.run(
      'DELETE FROM Assignees WHERE task_id IN ( SELECT id FROM Tasks WHERE board_id=(?) )',
      boardId
    );
    await db.run('DELETE FROM Tasks WHERE board_id = (?)', boardId);
  } catch (err) {
    debug(err);
    throw boardErrorMessages.DELETE_FAILED;
  }
}

async function getBoardById(boardId) {
  const db = await dbHandler;

  try {
    const board = await db.get('SELECT title, id FROM Boards WHERE id = ?', boardId);

    return board;
  } catch (err) {
    debug(err);

    throw boardErrorMessages.GET_FAILED;
  }
}

module.exports = {
  createBoard,
  editBoard,
  deleteBoard,
  getBoardById,
};
