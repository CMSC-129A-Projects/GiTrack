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

async function getAssignees(boardId, taskId) {
  const db = await dbHandler;
  const assigneeArray = [];

  const assignees = await db.all(
    'SELECT user_id FROM Assignees WHERE board_id = ? AND task_id = ?',
    boardId,
    taskId
  );

  for (let i = 0; i < assignees.length; i += 1) {
    assigneeArray.push(assignees[i].user_id);
  }

  return assigneeArray;
}

async function getTasksInBoard(boardId) {
  const db = await dbHandler;
  const tasks = [];
  let assignees;

  try {
    const taskList = await db.all('SELECT * FROM Tasks WHERE board_id = ?', boardId);

    for (let i = 0; i < taskList.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      assignees = await getAssignees(boardId, taskList[i].id);
      tasks.push({ ...taskList[i], assignee_id: assignees });
    }

    return tasks;
  } catch (err) {
    debug(err);
    throw taskErrorMessages.TASK_NOT_FOUND;
  }
}

async function connectBranch(taskId, branch, repoId) {
  const db = await dbHandler;

  try {
    await db.run(
      'UPDATE Tasks SET branch_name = ?, repo_id = ?, column_id = ? WHERE id = ?',
      branch,
      repoId,
      1,
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

async function userInTask(boardId, taskId, userId) {
  const db = await dbHandler;

  const user = await db.get(
    'SELECT user_id FROM Assignees WHERE board_id = ? AND task_id = ? AND user_id = ?',
    boardId,
    taskId,
    userId
  );
  return user;
}

async function assignTask(boardId, taskId, assigneeIds) {
  const db = await dbHandler;

  try {
    const assign = await db.prepare('INSERT INTO Assignees VALUES (?, ?, ?)');
    const assignments = [];
    for (let i = 0; i < assigneeIds.length; i += 1) {
      assignments.push(assign.run(boardId, taskId, assigneeIds[i]));
    }

    Promise.all(assignments)
      .catch((err) => {
        debug(err);
        throw err;
      })
      .finally(async () => {
        debug('Inserted all assignees');
        await assign.finalize();
      });
  } catch (err) {
    debug(err);
    throw taskErrorMessages.INSERT_FAILED;
  }
}

async function moveTaskByBranchAndRepo(branchName, repoId, columnId) {
  const db = await dbHandler;

  try {
    const res = await db.run(
      'UPDATE Tasks SET column_id = ? WHERE branch_name = ? AND repo_id = ?',
      columnId,
      branchName,
      repoId
    );

    return res;
  } catch (err) {
    debug(err);
    throw taskErrorMessages.MOVE_FAILED;
  }
}

module.exports = {
  addTask,
  getTask,
  removeTask,
  getTasksInBoard,
  connectBranch,
  getTaskBoard,
  userInTask,
  assignTask,
  moveTaskByBranchAndRepo,
};
