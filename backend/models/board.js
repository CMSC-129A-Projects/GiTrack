//create Board in database
function newBoard(db, title) {
  db.serialize(function () {
    db.run("INSERT INTO Boards (title) VALUES ('" + title + "')", (err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log('Inserted "' + title + '" into table Boards');
      }
    });
  });
}

//edit Board in database
function editBoard(db, oldName, newName) {
  db.serialize(function () {
    db.run(
      "UPDATE Boards SET title = '" + newName + "' WHERE title = '" + oldName + "'",
      (err) => {
        if (err) {
          console.error(err.message);
        } else {
          console.log('Board ' + oldName + ' renamed into ' + newName + '.');
        }
      }
    );
  });
}

//delete Board in database
function deleteBoard(db, title) {
  db.serialize(function () {
    db.run("DELETE FROM Boards WHERE title = '" + title + "'", (err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log('Board ' + title + ' has been deleted.');
      }
    });
  });
}

module.exports = {
  newBoard,
  editBoard,
  deleteBoard,
};
