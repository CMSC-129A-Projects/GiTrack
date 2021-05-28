const debug = require('debug')('backend:models-tasks');
const dbHandler = require('../db');

const { task: taskErrorMessages } = require('../constants/error-messages');

const { getAssignees } = require('./assignees');

// NOT TESTED
async function getTaskPermissions(userId, taskId, isDeveloper = 0) {
  const db = await dbHandler;
  try {
    const userPermission = await db.get(
      'SELECT is_developer FROM Memberships WHERE user_id = (?) AND board_id = (SELECT board_id FROM Tasks where task_id = ?)',
      userId,
      taskId
    );

    if (userPermission === undefined || userPermission > isDeveloper) {
      throw taskErrorMessages.NOT_ENOUGH_PERMISSIONS;
    }
  } catch (err) {
    debug(err);
    throw taskErrorMessages.NOT_ENOUGH_PERMISSIONS;
  }
}

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
    const task = await db.get('SELECT * FROM Tasks where id = ?', id);

    const assigneeIds = await getAssignees(id);

    return {
      ...task,
      assignee_ids: assigneeIds,
    };
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

async function getTasksInBoard(boardId) {
  const db = await dbHandler;
  const tasks = [];

  try {
    const taskList = await db.all('SELECT * FROM Tasks WHERE board_id = ?', boardId);

    const assigneePromise = taskList.map((task) => getAssignees(task.id));

    const assignees = await Promise.all(assigneePromise);

    assignees.forEach((assignee, index) => {
      tasks.push({ ...taskList[index], assignee_ids: assignee });
    });

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
  getTaskPermissions,
  addTask,
  getTask,
  removeTask,
  getTasksInBoard,
  connectBranch,
  getTaskBoard,
  moveTaskByBranchAndRepo,
};
