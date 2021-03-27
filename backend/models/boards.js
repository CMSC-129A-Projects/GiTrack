const debug = require('debug')('backend:models-board');

function newBoard(db, title) {
  db.run("INSERT INTO Boards (title) VALUES ('" + title + "')", (err) => {
    if (err) {
      debug(err.message);
    } else {
      debug('Inserted "' + title + '" into table Boards');
    }
  });
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
  newBoard,
  editBoard,
  deleteBoard,
};
