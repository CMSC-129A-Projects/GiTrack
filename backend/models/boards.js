const dbHandler = require('../db');
const debug = require('debug')('backend:models-board');

const { board: boardErrorMessages } = require('../constants/error-messages');

async function createBoard(title, userId) {
  const db = await dbHandler;

  try {
    const boardResult = await db.run(`INSERT INTO Boards (title) VALUES ("${title}")`);
    await db.run(
      `INSERT INTO Memberships (board_id, user_id) VALUES ("${boardResult.lastID}", ${userId})`
    );

    return boardResult.lastID;
  } catch (err) {
    debug(err);
    throw boardErrorMessages.INSERT_FAILED;
  }
}

function editBoard(db, oldName, newName) {
  db.run(
    "UPDATE Boards SET title = '" + newName + "' WHERE title = '" + oldName + "'",
    (err) => {
      if (err) {
        debug(err.message);
      } else {
        debug('Board ' + oldName + ' renamed into ' + newName + '.');
      }
    }
  );
}

function deleteBoard(db, title) {
  db.run("DELETE FROM Boards WHERE title = '" + title + "'", (err) => {
    if (err) {
      debug(err.message);
    } else {
      debug('Board ' + title + ' has been deleted.');
    }
  });
}

module.exports = {
  createBoard,
  editBoard,
  deleteBoard,
};
