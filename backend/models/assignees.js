const debug = require('debug')('backend:models-assignees');
const dbHandler = require('../db');

const { assignee: assigneeErrorMessages } = require('../constants/error-messages');

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

async function replaceAssignees(taskId, assigneeIds) {
  const db = await dbHandler;

  try {
    const currentUsers = (
      await db.all('SELECT user_id FROM Assignees WHERE task_id = ?', taskId)
    ).map((user) => user.user_id);

    const newUsers = assigneeIds.filter((assignee) => !currentUsers.includes(assignee));

    const removedUsers = currentUsers.filter(
      (assignee) => !assigneeIds.includes(assignee)
    );

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

async function isUserAssignedInTask(taskId, userId) {
  const db = await dbHandler;

  const user = await db.get(
    'SELECT user_id FROM Assignees WHERE task_id = ? AND user_id = ?',
    taskId,
    userId
  );
  return user;
}

module.exports = {
  getAssignees,
  setAssignees,
  replaceAssignees,
  isUserAssignedInTask,
};
