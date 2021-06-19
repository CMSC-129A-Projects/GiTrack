const debug = require('debug')('backend:models-board');
const dbHandler = require('../db');

const {
  user: userErrorMessages,
  membership: membershipErrorMessages,
} = require('../constants/error-messages');

/**
 * Check if the user has permissions to edit the board
 * @param {number} userId - ID of the user
 * @param {number} boardId - ID of the board
 * @param {number|undefined} isDeveloper - Set to 1 to check if the person is a developer. Defaults to checking if PM only
 */
async function getPermissions(userId, boardId, isDeveloper = 0) {
  const db = await dbHandler;
  try {
    const userPermission = await db.get(
      'SELECT is_developer FROM Memberships WHERE user_id = (?) AND board_id = (?)',
      userId,
      boardId
    );

    // userPermission is set to 0 if a PM, 1 if a developer
    if (userPermission === undefined || userPermission > isDeveloper) {
      throw membershipErrorMessages.NOT_ENOUGH_PERMISSIONS;
    }
  } catch (err) {
    debug(err);
    throw membershipErrorMessages.NOT_ENOUGH_PERMISSIONS;
  }
}

/**
 * Get board id and title of all boards that the user is a member
 * @param {number} userId - ID of the user
 */
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

/**
 * Check if the user is a member of the board
 * @param {number} boardId - ID of the board
 * @param {number} userId - ID of the user
 */
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

/**
 * Add developers to a board
 * @param {number} boardId - ID of the board
 * @param {Array.<number>} devIds - IDs of the developers
 */
async function addDevToBoard(boardId, devIds) {
  const db = await dbHandler;

  // Check if the user exists
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

/**
 * Get all members in a board
 * @param {number} boardId - ID of the board
 */
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

/**
 * Remove members of a board
 * @param {number} boardId - ID of the board
 * @param {Array.<number>} memberIds- IDs of all members to be removed
 */
async function removeMembers(boardId, memberIds) {
  const db = await dbHandler;

  // Check if a member to be removed is a PM
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
