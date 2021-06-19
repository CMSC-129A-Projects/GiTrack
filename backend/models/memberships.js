const debug = require('debug')('backend:models-board');
const dbHandler = require('../db');

const {
  user: userErrorMessages,
  membership: membershipErrorMessages,
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
      throw membershipErrorMessages.NOT_ENOUGH_PERMISSIONS;
    }
  } catch (err) {
    debug(err);
    throw membershipErrorMessages.NOT_ENOUGH_PERMISSIONS;
  }
}

async function getBoardsByUser(userId) {
  const db = await dbHandler;

  try {
    const boards = await db.all(
      'SELECT id, title FROM Memberships JOIN Boards ON Memberships.board_id = Boards.id WHERE user_id = (?)',
      userId
    );

    return boards;
  } catch (err) {
    debug(err);

    throw membershipErrorMessages.GET_FAILED;
  }
}

async function isUserInBoard(boardId, userId) {
  const db = await dbHandler;

  try {
    const user = await db.get(
      'SELECT user_id FROM Memberships WHERE board_id = ? AND user_id = ?',
      boardId,
      userId
    );
    return user;
  } catch (err) {
    throw membershipErrorMessages.GET_FAILED;
  }
}

async function addDevToBoard(boardId, devIds) {
  const db = await dbHandler;

  const userCheck = await db.prepare('SELECT id FROM Users WHERE id = ?');
  const users = devIds.map((devId) => userCheck.get(boardId, devId));

  Promise.all(users)
    .then((check) => {
      if (check.some((member) => member === undefined)) {
        throw userErrorMessages.USER_NOT_FOUND;
      }
    })
    .catch((err) => {
      debug(err);
      throw err;
    })
    .finally(async () => {
      debug('Checked all members');
      await userCheck.finalize();
    });

  const dev = await db.prepare('INSERT INTO Memberships VALUES (?, ?, 1)');
  const inserts = devIds.map((devId) => dev.run(boardId, devId));

  Promise.all(inserts)
    .catch((err) => {
      debug(err);
      throw err;
    })
    .finally(async () => {
      debug('Inserted all assignees');
      await dev.finalize();
    });
}

async function getMembersInBoard(boardId) {
  const db = await dbHandler;

  try {
    const members = await db.all(
      'SELECT id, username FROM Memberships JOIN Users ON user_id = id WHERE board_id = ?',
      boardId
    );

    return members;
  } catch (err) {
    debug(err);
    throw membershipErrorMessages.GET_FAILED;
  }
}

async function removeMembers(boardId, memberIds) {
  const db = await dbHandler;

  const boardPM = await db.get(
    'SELECT user_id FROM Memberships WHERE board_id = ? AND is_developer = 0',
    boardId
  );

  if (memberIds.includes(boardPM.user_id)) {
    throw membershipErrorMessages.CANNOT_REMOVE_PM;
  }

  const memberCheck = await db.prepare(
    'SELECT user_id FROM Memberships WHERE board_id = ? AND user_id = ?'
  );
  const members = memberIds.map((memberId) => memberCheck.get(boardId, memberId));

  Promise.all(members)
    .then((check) => {
      if (check.some((member) => member === undefined)) {
        throw membershipErrorMessages.MEMBER_NOT_FOUND;
      }
    })
    .catch((err) => {
      debug(err);
      throw err;
    })
    .finally(async () => {
      debug('Checked all members');
      await memberCheck.finalize();
    });

  const remove = await db.prepare(
    'DELETE FROM Memberships WHERE board_id = ? AND user_id = ?'
  );
  const removal = memberIds.map((memberId) => remove.run(boardId, memberId));

  Promise.all(removal)
    .catch((err) => {
      debug(err);
      throw err;
    })
    .finally(async () => {
      debug('Removed all members');
      await remove.finalize();
    });
}

module.exports = {
  getPermissions,
  getBoardsByUser,
  addDevToBoard,
  isUserInBoard,
  getMembersInBoard,
  removeMembers,
};
