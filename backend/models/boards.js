const debug = require('debug')('backend:models-board');
const dbHandler = require('../db');

const { board: boardErrorMessages } = require('../constants/error-messages');
async function getPermissions(db, userId, boardId) {
  const userPermission = await db.get(
    'SELECT is_developer FROM Memberships WHERE user_id = (?) AND board_id = (?)',
    userId,
    boardId
  );
  if (!userPermission) {
    throw boardErrorMessages.NOT_ENOUGH_PERMISSIONS;
  } else {
    return true;
  }
}

async function createBoard(title, userId) {
  const db = await dbHandler;

  try {
    const boardResult = await db.run(
      'INSERT INTO Boards (title) VALUES ("(?)")',
      title
    );
    await db.run(
      'INSERT INTO Memberships (board_id, user_id, is_developer) VALUES ((?), (?), 0)',
      boardResult.lastID,
      userId
    );

    return boardResult.lastID;
  } catch (err) {
    debug(err);
    throw boardErrorMessages.INSERT_FAILED;
  }
}

async function editBoard(boardId, newName, userId) {
  const db = await dbHandler;
  
  await getPermissions(db, userId, boardId);

  try {
    await db.run('UPDATE Boards SET title = "(?)" WHERE id = (?)', newName, boardId);
    debug(`Board renamed to ${newName}.`);

    return true;
  } catch (err) {
    debug(err);

    throw boardErrorMessages.EDIT_FAILED;
  }
}

async function deleteBoard(boardId, userId) {
  const db = await dbHandler;
  
  await getPermissions(db, userId, boardId);

  try {
    await db.run('DELETE FROM Boards WHERE board_id = (?)', boardId);

    return true;
  } catch (err) {
    debug(err);

    throw boardErrorMessages.DELETE_FAILED;
  }
}

async function getBoardsWithUser(userId) {
  const db = await dbHandler;

  try {
    const boards = await db.all(
      'SELECT id, title FROM Memberships JOIN Boards ON Memberships.board_id = Boards.id WHERE user_id = (?)',
      userId
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
  getBoardsWithUser
};
