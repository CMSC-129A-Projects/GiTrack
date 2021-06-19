const debug = require('debug')('backend:models-tasks');
const dbHandler = require('../db');

const { task: taskErrorMessages } = require('../constants/error-messages');

const { getAssignees } = require('./assignees');

/**
 * Adds a task to a board
 * @param {string} title - Title of the task
 * @param {string} description - description of the task. In HTML or plaintext
 * @param {string} targetDate - Date of the task. In ISO8601
 * @param {number} boardId - Id of the board the task is to be added
 */
async function addTask(title, description, targetDate, boardId) {
  const db = await dbHandler;

  try {
    const taskResult = await db.run(
      'INSERT INTO Tasks (title, description, target_date, board_id, column_id) VALUES (?, ?, ?, ?, 0)',
      title,
      description,
      targetDate,
      boardId
    );

    return taskResult.lastID;
  } catch (err) {
    debug(err);

    throw taskErrorMessages.INSERT_FAILED;
  }
}

/**
 * Get a task by its id
 * @param {number} id - ID of the task
 */
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

/**
 * Remove a task by its id
 * @param {number} id - ID of the task
 */
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

/**
 * Get all tasks that are in a board
 * @param {number} boardId - ID of the board
 */
async function getTasksInBoard(boardId) {
  const db = await dbHandler;
  const tasks = [];

  try {
    const taskList = await db.all('SELECT * FROM Tasks WHERE board_id = ?', boardId);

    // Get all assignees in a task and add to final return value
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

/**
 * Connect a Github branch and repository to a task
 * @param {number} taskID - ID of the task
 * @param {string} branch - Name of the branch
 * @param {number} repoId - ID of the repo
 */
async function connectBranch(taskId, branch, repoId) {
  const db = await dbHandler;

  try {
    // Automatically sets the task to doing whenever a branch is connected
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

/**
 * Get the board that the task is on
 * @param {number} taskID - ID of the task
 */
async function getBoardIdByTask(taskId) {
  const db = await dbHandler;

  try {
    const boardId = await db.get('SELECT board_id FROM Tasks WHERE id = ?', taskId);
    return boardId.board_id;
  } catch (err) {
    debug(err);
    throw taskErrorMessages.TASK_NOT_FOUND;
  }
}

/**
 * Moves a task to a specified column id using the repoId and branch name as the identifying feature
 * @param {string} branchName - name of the branch
 * @param {number} repoId - ID of the repo
 * @param {number} columnId - ID of the column. 0 for todo, 1 for doing, 2 for completed
 */
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
  getBoardIdByTask,
  moveTaskByBranchAndRepo,
};
