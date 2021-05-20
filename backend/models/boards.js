const debug = require('debug')('backend:models-board');
const dbHandler = require('../db');

const {
  board: boardErrorMessages,
  user: userErrorMessages,
} = require('../constants/error-messages');

async function getPermissions(userId, boardId, isDeveloper = 0) {
  const db = await dbHandler;
  try {
    const userPermission = await db.get(
      'SELECT is_developer FROM Memberships WHERE user_id = (?) AND board_id = (?)',
      userId,
      boardId
    );

    if (userPermission === undefined || userPermission > isDeveloper) {
      throw boardErrorMessages.NOT_ENOUGH_PERMISSIONS;
    }
  } catch (err) {
    debug(err);
    throw boardErrorMessages.NOT_ENOUGH_PERMISSIONS;
  }
}

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

async function getBoardRepo(id) {
  const db = await dbHandler;

  try {
    const repo = await db.get('SELECT name FROM Repositories WHERE id = ?', id);
    return repo.name;
  } catch (err) {
    debug(err);
    throw boardErrorMessages.GET_FAILED;
  }
}

async function getBoardRepoId(boardId) {
  const db = await dbHandler;

  try {
    const id = await db.get('SELECT id FROM Repositories WHERE board_id = ?', boardId);
    return id;
  } catch (err) {
    debug(err);
    throw boardErrorMessages.GET_FAILED;
  }
}

async function userInBoard(boardId, userId) {
  const db = await dbHandler;

  const user = await db.get(
    'SELECT user_id FROM Memberships WHERE board_id = ? AND user_id = ?',
    boardId,
    userId
  );

  if (user !== undefined) {
    throw userErrorMessages.DUPLICATE_USER;
  } else {
    return user;
  }
}

async function addDevToBoard(boardId, devId) {
  const db = await dbHandler;

  try {
    const dev = await db.run(
      'INSERT INTO Memberships VALUES (?, ?, 1)',
      boardId,
      devId
    );

    return dev;
  } catch (err) {
    debug(err);
    throw boardErrorMessages.INSERT_FAILED;
  }
}

module.exports = {
  getPermissions,
  createBoard,
  editBoard,
  deleteBoard,
  getBoardById,
  getBoardsWithUser,
  getBoardRepo,
  getBoardRepoId,
  addDevToBoard,
  userInBoard,
};
