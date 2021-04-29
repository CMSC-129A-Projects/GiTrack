const debug = require('debug')('backend:models-tasks');
const dbHandler = require('../db');

const { task: taskErrorMessages } = require('../constants/error-messages');

async function addTask(title, description, boardId) {
  const db = await dbHandler;

  try {
    const taskResult = await db.run(
      'INSERT INTO Tasks (title, description, board_id, column_id) VALUES (?, ?, ?, 0)',
      title,
      description,
      boardId
    );

    return taskResult.lastID;
  } catch (err) {
    debug(err);

    throw taskErrorMessages.INSERT_FAILED;
  }
}

async function getTask(id) {
  const db = await dbHandler;

  try {
    const task = await db.get(
      'SELECT title, description, id, board_id, column_id FROM Tasks where id = ?',
      id
    );

    return task;
  } catch (err) {
    debug(err);

    throw taskErrorMessages.GET_FAILED;
  }
}

async function removeTask(id) {
  const db = await dbHandler;

  try {
    const result = await db.run('DELETE FROM Tasks WHERE id = ?', id);

    if (result.changes === 0) {
      throw taskErrorMessages.TASK_NOT_FOUND;
    }

    return id;
  } catch (err) {
    debug(err);

    throw err;
  }
}

async function getBoardTasks(userId, boardId) {
  const db = await dbHandler;

  try {
    const taskList = await db.all(
      'SELECT title FROM Tasks WHERE board_id = ?',
      boardId
    );

    return taskList;
  } catch (err) {
    debug(err);
    throw taskErrorMessages.TASK_NOT_FOUND;
  }
}

async function connectBranch(taskId, branch, repoId) {
  const db = await dbHandler;

  try {
    await db.run(
      'UPDATE Tasks SET branch_name = ?, repo_id = ? WHERE id = ?',
      branch,
      repoId,
      taskId
    );
  } catch (err) {
    debug(err);
    throw taskErrorMessages.CONNECTION_FAILED;
  }
}

async function getTaskBoard(taskId) {
  const db = await dbHandler;

  try {
    const boardId = await db.get('SELECT board_id FROM Tasks WHERE id = ?', taskId);
    return boardId.board_id;
  } catch (err) {
    debug(err);
    throw taskErrorMessages.TASK_NOT_FOUND;
  }
}

module.exports = {
  addTask,
  getTask,
  removeTask,
  getBoardTasks,
  connectBranch,
  getTaskBoard,
};
