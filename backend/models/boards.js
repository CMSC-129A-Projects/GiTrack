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
    const repo = await db.get('SELECT full_name FROM Repositories WHERE id = ?', id);
    return repo.full_name;
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
  return user;
}

async function addDevToBoard(boardId, devIds) {
  const db = await dbHandler;

  const userCheck = await db.all('SELECT id FROM Users');

  for (let i = 0; i < devIds.length; i += 1) {
    if (!userCheck.some((member) => member.id === devIds[i])) {
      throw userErrorMessages.USER_NOT_FOUND;
    }
  }

  try {
    await db.getDatabaseInstance().serialize(async function addDevs() {
      const dev = await db.prepare('INSERT INTO Memberships VALUES (?, ?, 1)');
      for (let i = 0; i < devIds.length; i += 1) {
        dev.run(boardId, devIds[i]);
      }
    });
  } catch (err) {
    debug(err);
    throw boardErrorMessages.INSERT_FAILED;
  }
}

async function getBoardMembers(boardId) {
  const db = await dbHandler;

  const members = await db.all(
    'SELECT id, username FROM Memberships JOIN Users ON user_id = id WHERE board_id = ?',
    boardId
  );
  return members;
}

async function removeMembers(boardId, memberIds) {
  const db = await dbHandler;

  const boardPM = await db.get(
    'SELECT user_id FROM Memberships WHERE board_id = ? AND is_developer = 0',
    boardId
  );

  if (memberIds.includes(boardPM.user_id)) {
    throw boardErrorMessages.CANNOT_REMOVE_PM;
  }

  const memberCheck = await db.all(
    'SELECT user_id FROM Memberships WHERE board_id = ?',
    boardId
  );

  for (let i = 0; i < memberIds.length; i += 1) {
    if (!memberCheck.some((member) => member.user_id === memberIds[i])) {
      throw boardErrorMessages.MEMBER_NOT_FOUND;
    }
  }

  try {
    const remove = await db.prepare(
      'DELETE FROM Memberships WHERE board_id = ? AND user_id = ?'
    );
    const removal = [];
    for (let i = 0; i < memberIds.length; i += 1) {
      removal.push(remove.run(boardId, memberIds[i]));
    }

    Promise.all(removal)
      .catch((err) => {
        debug(err);
        throw err;
      })
      .finally(async () => {
        debug('Removed all members');
        await remove.finalize();
      });
  } catch (err) {
    debug(err);
    throw boardErrorMessages.REMOVE_FAILED;
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
  getBoardMembers,
  removeMembers,
};
