const debug = require('debug')('backend:models-assignees');
const dbHandler = require('../db');

const { assignee: assigneeErrorMessages } = require('../constants/error-messages');

/**
 * Get the assignees of a task based on the ID of a task
 * @param {number} taskId - The ID of the task
 */
async function getAssignees(taskId) {
  const db = await dbHandler;

  try {
    const assignees = (
      await db.all('SELECT user_id FROM Assignees WHERE task_id = ?', taskId)
    )
      .map((assignee) => assignee.user_id)
      .sort((a, b) => a - b);

    return assignees;
  } catch (err) {
    debug(err);

    throw assigneeErrorMessages.GET_FAILED;
  }
}

/**
 * Set the assignees of a task based on the ID of the task and the IDs of the assignees
 * @param {number} taskId - The ID of the task
 * @param {Array.<number>} assigneeIds - The IDs of the assignees
 */
async function setAssignees(taskId, assigneeIds) {
  const db = await dbHandler;

  try {
    const assign = await db.prepare(
      'INSERT INTO Assignees (task_id, user_id) VALUES (?, ?)'
    );
    const assignments = [];
    for (let i = 0; i < assigneeIds.length; i += 1) {
      assignments.push(assign.run(taskId, assigneeIds[i]));
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
    throw assigneeErrorMessages.INSERT_FAILED;
  }
}

/**
 * Replace all assignees of a task with the new assignees
 * @param {number} taskId - The ID of the task
 * @param {Array.<number>} assigneeIds - The IDs of the assignees
 */
async function replaceAssignees(taskId, assigneeIds) {
  const db = await dbHandler;

  try {
    // Get the current users
    const currentUsers = (
      await db.all('SELECT user_id FROM Assignees WHERE task_id = ?', taskId)
    ).map((user) => user.user_id);

    // Get the additional users assigned to the task
    const newUsers = assigneeIds.filter((assignee) => !currentUsers.includes(assignee));

    // Get the users that are removed as assignatory for the task
    const removedUsers = currentUsers.filter(
      (assignee) => !assigneeIds.includes(assignee)
    );

    // Add all new assignees to the db
    const assign = await db.prepare(
      'INSERT INTO Assignees (task_id, user_id) VALUES (?, ?)'
    );
    const assignments = newUsers.map((userId) => assign.run(taskId, userId));

    Promise.all(assignments)
      .catch((err) => {
        debug(err);
        throw err;
      })
      .finally(async () => {
        debug('Inserted all assignees');
        await assign.finalize();
      });

    // Remove all users that are removed as an assignatory for the task
    const remove = await db.prepare(
      'DELETE FROM Assignees WHERE task_id = ? AND user_id = ?'
    );

    const removals = removedUsers.map((userId) => remove.run(taskId, userId));
    Promise.all(removals)
      .catch((err) => {
        debug(err);
        throw err;
      })
      .finally(async () => {
        debug('Inserted all assignees');
        await remove.finalize();
      });
  } catch (err) {
    debug(err);
    throw assigneeErrorMessages.INSERT_FAILED;
  }
}

module.exports = {
  getAssignees,
  setAssignees,
  replaceAssignees,
};
