const express = require('express');
const debug = require('debug')('backend:routes-tasks');

const router = express.Router();

// Models
const {
  addTask,
  getTask,
  removeTask,
  getBoardIdByTask,
  connectBranch,
  getTasksInBoard,
} = require('../models/tasks');

const { setAssignees, replaceAssignees } = require('../models/assignees');

const { getPermissions } = require('../models/memberships');

// Middlewares
const { authJWT } = require('../middlewares/auth');

// Constants
const {
  task: taskErrorMessages,
  board: boardErrorMessages,
} = require('../constants/error-messages');

/**
 * @swagger
 * tags:
 *  name: Tasks
 *  description: Perform operations on tasks
 */

/**
 * @swagger
 *  /task:
 *   post:
 *     summary: Create a task.
 *     tags: [Tasks]
 *     security:
 *       - JWTBearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               boardId:
 *                 type: integer
 *                 description: ID of the board to which the task will be added
 *                 example: 1
 *               title:
 *                 type: string
 *                 description: Title of the task
 *                 example: Get eggs
 *               description:
 *                 type: string
 *                 description: Description of the task
 *                 example: Get eggs from the supermarket by 5:00 PM on Feb 31
 *               targetDate:
 *                 type: string
 *                 description: Target date of completion of the task, IOSO8601 format
 *                 example: 2021-04-20
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID of the created task
 *                   example: 1
 *                 column_id:
 *                   type: integer
 *                   description: Column in which the task is categorized
 *                   example: 0
 *                 board_id:
 *                   type: integer
 *                   description: ID of the board to which the task has been added
 *                   example: 1
 *                 title:
 *                   type: string
 *                   description: Title of the task
 *                   example: Get eggs
 *                 description:
 *                   type: string
 *                   description: Description of the task
 *                   example: Get eggs from the supermarket by 5:00 PM on Feb 31
 *                 target_date:
 *                   type: string
 *                   description: Target date of completion of the task, IOSO8601 format
 *                   example: 2021-04-20
 *                 error_message:
 *                   type: string
 *                   description: Specific error message causing the error
 *                   example: MISSING_TITLE
 *       400:
 *         description: Error parsing request body
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID of the created task
 *                   example: 1
 *                 column_id:
 *                   type: integer
 *                   description: Column in which the task is categorized
 *                   example: 0
 *                 board_id:
 *                   type: integer
 *                   description: ID of the board to which the task has been added
 *                   example: 1
 *                 title:
 *                   type: string
 *                   description: Title of the task
 *                   example: Get eggs
 *                 description:
 *                   type: string
 *                   description: Description of the task
 *                   example: Get eggs from the supermarket by 5:00 PM on Feb 31
 *                 target_date:
 *                   type: string
 *                   description: Target date of completion of the task, IOSO8601 format
 *                   example: 2021-04-20
 *                 error_message:
 *                   type: string
 *                   description: Specific error message causing the error
 *                   example: MISSING_TITLE
 *       403:
 *         description: User lacking permissions to perform current action
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID of the created task
 *                   example: 1
 *                 column_id:
 *                   type: integer
 *                   description: Column in which the task is categorized
 *                   example: 0
 *                 board_id:
 *                   type: integer
 *                   description: ID of the board to which the task has been added
 *                   example: 1
 *                 title:
 *                   type: string
 *                   description: Title of the task
 *                   example: Get eggs
 *                 description:
 *                   type: string
 *                   description: Description of the task
 *                   example: Get eggs from the supermarket by 5:00 PM on Feb 31
 *                 target_date:
 *                   type: string
 *                   description: Target date of completion of the task, IOSO8601 format
 *                   example: 2021-04-20
 *                 error_message:
 *                   type: string
 *                   description: Specific error message causing the error
 *                   example: MISSING_TITLE
 */
router.post('/', authJWT, async (req, res) => {
  const { board_id: boardId, title, description, target_date: targetDate } = req.body;
  const { id: userId } = req.user;

  if (boardId === undefined) {
    return res.status(400).json({
      id: null,
      column_id: null,
      board_id: null,
      title: null,
      description: null,
      target_date: null,
      error_message: taskErrorMessages.MISSING_BOARD_ID,
    });
  }

  if (title === undefined) {
    return res.status(400).json({
      id: null,
      column_id: null,
      board_id: null,
      title: null,
      description: null,
      target_date: null,
      error_message: taskErrorMessages.MISSING_TITLE,
    });
  }

  if (description === undefined) {
    return res.status(400).json({
      id: null,
      column_id: null,
      board_id: null,
      title: null,
      description: null,
      target_date: null,
      error_message: taskErrorMessages.MISSING_DESCRIPTION,
    });
  }

  if (targetDate === undefined) {
    return res.status(400).json({
      id: null,
      column_id: null,
      board_id: null,
      title: null,
      description: null,
      target_date: null,
      error_message: taskErrorMessages.MISSING_TARGET_DATE,
    });
  }

  try {
    await getPermissions(userId, boardId);
  } catch (err) {
    debug(err);
    return res.status(403).json({
      id: null,
      column_id: null,
      board_id: null,
      title: null,
      description: null,
      target_date: null,
      error_message: err,
    });
  }

  try {
    const taskId = await addTask(title, description, targetDate, boardId);

    return res.json({
      id: taskId,
      column_id: 0,
      board_id: boardId,
      title,
      description,
      target_date: targetDate,
      error_message: null,
    });
  } catch (err) {
    debug(err);
    return res.status(500).json({
      id: null,
      column_id: null,
      board_id: null,
      title: null,
      description: null,
      target_date: null,
      error_message: err,
    });
  }
});

/**
 * @swagger
 *  /task/{id}:
 *   get:
 *     summary: Get specific task.
 *     tags: [Tasks]
 *     security:
 *       - JWTBearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: true
 *         description: Numeric ID of the task to fetch
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID of the fetched task
 *                   example: 1
 *                 column_id:
 *                   type: integer
 *                   description: Column in which the task is categorized
 *                   example: 0
 *                 board_id:
 *                   type: integer
 *                   description: ID of the board to which the task has been added
 *                   example: 1
 *                 title:
 *                   type: string
 *                   description: Title of the task
 *                   example: Get eggs
 *                 description:
 *                   type: string
 *                   description: Description of the task
 *                   example: Get eggs from the supermarket by 5:00 PM on Feb 31
 *                 target_date:
 *                   type: string
 *                   description: Target date of completion of the task, IOSO8601 format
 *                   example: 2021-04-20
 *                 branch_name:
 *                   type: string
 *                   description: Name of the branch under which the task is assigned
 *                   example: feat/gather-ingredients-for-cake
 *                 error_message:
 *                   type: string
 *                   description: Specific error message causing the error
 *                   example: MISSING_TITLE
 *       400:
 *         description: Error parsing request body
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID of the fetched task
 *                   example: 1
 *                 column_id:
 *                   type: integer
 *                   description: Column in which the task is categorized
 *                   example: 0
 *                 board_id:
 *                   type: integer
 *                   description: ID of the board to which the task has been added
 *                   example: 1
 *                 title:
 *                   type: string
 *                   description: Title of the task
 *                   example: Get eggs
 *                 description:
 *                   type: string
 *                   description: Description of the task
 *                   example: Get eggs from the supermarket by 5:00 PM on Feb 31
 *                 target_date:
 *                   type: string
 *                   description: Target date of completion of the task, IOSO8601 format
 *                   example: 2021-04-20
 *                 branch_name:
 *                   type: string
 *                   description: Name of the branch under which the task is assigned
 *                   example: feat/gather-ingredients-for-cake
 *                 error_message:
 *                   type: string
 *                   description: Specific error message causing the error
 *                   example: MISSING_TITLE
 */
router.get('/:id(\\d+)', authJWT, async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user;

  let task = null;

  try {
    task = await getTask(id);
  } catch (err) {
    return res.status(500).json({
      id: null,
      column_id: null,
      board_id: null,
      title: null,
      description: null,
      target_date: null,
      branch_name: null,
      error_message: err,
    });
  }

  if (task === undefined) {
    return res.status(400).json({
      id: null,
      column_id: null,
      board_id: null,
      title: null,
      description: null,
      target_date: null,
      branch_name: null,
      error_message: taskErrorMessages.TASK_NOT_FOUND,
    });
  }

  try {
    await getPermissions(userId, task.board_id);
  } catch (err) {
    debug(err);
    return res.status(403).json({
      id: null,
      column_id: null,
      board_id: null,
      title: null,
      description: null,
      target_date: null,
      branch_name: null,
      error_message: err,
    });
  }

  return res.json({
    ...task,
    error_message: null,
  });
});

/**
 * @swagger
 *  /task/{id}:
 *   delete:
 *     summary: Delete a specific task.
 *     tags: [Tasks]
 *     security:
 *       - JWTBearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: true
 *         description: Numeric ID of the task to delete
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID of the deleted task
 *                   example: 1
 *                 column_id:
 *                   type: integer
 *                   description: Column in which the task is categorized
 *                   example: 0
 *                 board_id:
 *                   type: integer
 *                   description: ID of the board to which the task has been added
 *                   example: 1
 *                 title:
 *                   type: string
 *                   description: Title of the task
 *                   example: Get eggs
 *                 description:
 *                   type: string
 *                   description: Description of the task
 *                   example: Get eggs from the supermarket by 5:00 PM on Feb 31
 *                 target_date:
 *                   type: string
 *                   description: Target date of completion of the task, IOSO8601 format
 *                   example: 2021-04-20
 *                 error_message:
 *                   type: string
 *                   description: Specific error message causing the error
 *                   example: MISSING_TITLE
 *       400:
 *         description: Error parsing request body
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID of the deleted task
 *                   example: 1
 *                 column_id:
 *                   type: integer
 *                   description: Column in which the task is categorized
 *                   example: 0
 *                 board_id:
 *                   type: integer
 *                   description: ID of the board to which the task has been added
 *                   example: 1
 *                 title:
 *                   type: string
 *                   description: Title of the task
 *                   example: Get eggs
 *                 description:
 *                   type: string
 *                   description: Description of the task
 *                   example: Get eggs from the supermarket by 5:00 PM on Feb 31
 *                 target_date:
 *                   type: string
 *                   description: Target date of completion of the task, IOSO8601 format
 *                   example: 2021-04-20
 *                 error_message:
 *                   type: string
 *                   description: Specific error message causing the error
 *                   example: MISSING_TITLE
 *       403:
 *         description: User lacking permissions to perform current action
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID of the created task
 *                   example: 1
 *                 column_id:
 *                   type: integer
 *                   description: Column in which the task is categorized
 *                   example: 0
 *                 board_id:
 *                   type: integer
 *                   description: ID of the board to which the task has been added
 *                   example: 1
 *                 title:
 *                   type: string
 *                   description: Title of the task
 *                   example: Get eggs
 *                 description:
 *                   type: string
 *                   description: Description of the task
 *                   example: Get eggs from the supermarket by 5:00 PM on Feb 31
 *                 target_date:
 *                   type: string
 *                   description: Target date of completion of the task, IOSO8601 format
 *                   example: 2021-04-20
 *                 error_message:
 *                   type: string
 *                   description: Specific error message causing the error
 *                   example: MISSING_TITLE
 */
router.delete('/:id(\\d+)', authJWT, async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user;

  let task = null;

  try {
    task = await getTask(id);
  } catch (err) {
    return res.status(500).json({
      id: null,
      column_id: null,
      board_id: null,
      title: null,
      target_date: null,
      error_message: err,
    });
  }

  if (task === undefined) {
    return res.status(403).json({
      id: null,
      column_id: null,
      board_id: null,
      title: null,
      description: null,
      target_date: null,
      error_message: boardErrorMessages.NOT_ENOUGH_PERMISSIONS,
    });
  }

  try {
    await getPermissions(userId, task.board_id);
  } catch (err) {
    debug(err);
    return res.status(403).json({
      id: null,
      column_id: null,
      board_id: null,
      title: null,
      description: null,
      target_date: null,
      error_message: err,
    });
  }

  try {
    await removeTask(id);

    return res.json({
      ...task,
      error_message: null,
    });
  } catch (err) {
    debug(err);
    return res.status(404).json({ title: null, error_message: err });
  }
});

// TODO: Move to /board/{id}/tasks
router.get('/get-board-tasks', authJWT, async (req, res) => {
  const { id } = req.body;

  try {
    const tasks = await getTasksInBoard(id);

    return res.json(tasks);
  } catch (err) {
    debug(err);

    return res.status(204).json({ title: null, error_message: err });
  }
});

/**
 * @swagger
 *  /task/{id}/connect:
 *   patch:
 *     summary: Connect a branch to a task.
 *     tags: [Tasks]
 *     security:
 *       - JWTBearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: true
 *         description: Numeric ID of the task to delete
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               repoId:
 *                 type: integer
 *                 description: ID of the repository of which the branch is a part
 *                 example: 344388797
 *               branchName:
 *                 type: string
 *                 description: Name of the branch to be connected to the task
 *                 example: feat/gather-ingredients-for-cake
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: Name of the branch to be connected to the task
 *                   example: feat/gather-ingredients-for-cake
 *                 repo_id:
 *                   type: integer
 *                   description: ID of the repository of which the branch is a part
 *                   example: 344388797
 *                 error_message:
 *                   type: string
 *                   description: Specific error message causing the error
 *                   example: MISSING_TITLE
 *       400:
 *         description: Error parsing request body
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: Name of the branch to be connected to the task
 *                   example: feat/gather-ingredients-for-cake
 *                 repo_id:
 *                   type: integer
 *                   description: ID of the repository of which the branch is a part
 *                   example: 344388797
 *                 error_message:
 *                   type: string
 *                   description: Specific error message causing the error
 *                   example: MISSING_TITLE
 *       403:
 *         description: User lacking permissions to perform current action
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: Name of the branch to be connected to the task
 *                   example: feat/gather-ingredients-for-cake
 *                 repo_id:
 *                   type: integer
 *                   description: ID of the repository of which the branch is a part
 *                   example: 344388797
 *                 error_message:
 *                   type: string
 *                   description: Specific error message causing the error
 *                   example: MISSING_TITLE
 */
router.patch('/:id(\\d+)/connect', authJWT, async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user;
  const { repo_id: repoId, name: branchName } = req.body;

  if (id === undefined) {
    return res
      .status(400)
      .json({ name: null, repo_id: null, error_message: taskErrorMessages.MISSING_ID });
  }

  if (repoId === undefined) {
    return res.status(400).json({
      name: null,
      repo_id: null,
      error_message: taskErrorMessages.MISSING_REPO_ID,
    });
  }

  if (branchName === undefined) {
    return res.status(400).json({
      name: null,
      repo_id: null,
      error_message: taskErrorMessages.MISSING_BRANCH_NAME,
    });
  }

  let boardId = null;

  try {
    boardId = await getBoardIdByTask(id);
  } catch (err) {
    debug(err);
    return res.status(500).json({ name: null, repo_id: null, error_message: err });
  }

  try {
    await getPermissions(userId, boardId, 1);
  } catch (err) {
    debug(err);
    return res.status(403).json({
      name: null,
      repo_id: null,
      error_message: err,
    });
  }

  try {
    await connectBranch(id, branchName, repoId);

    return res.json({ name: branchName, repo_id: repoId, error_message: null });
  } catch (err) {
    debug(err);
    return res.status(403).json({
      name: null,
      repo_id: null,
      error_message: err,
    });
  }
});

/**
 * @swagger
 *  /task/{id}/assign-task:
 *   post:
 *     summary: Assign a task to developer/s.
 *     tags: [Tasks]
 *     security:
 *       - JWTBearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: true
 *         description: Numeric ID of the task to delete
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               board_id:
 *                 type: integer
 *                 description: ID of the board where the task is
 *                 example: 1
 *               assignee_ids:
 *                 type: array
 *                 description: ID/s of the developer/s to be assigned to the task
 *                 items:
 *                   type: integer
 *                   example: [2, 3, 5]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 board_id:
 *                   type: integer
 *                   description: Id of the board where the task is
 *                   example: 1
 *                 task_id:
 *                   type: integer
 *                   description: ID of the task to which developers have been assigned
 *                   example: 1
 *                 assignee_ids:
 *                   type: string
 *                   description: IDs of the developers assigned to the task, separated by commas
 *                   example: 2, 3, 5
 *                 error_message:
 *                   type: string
 *                   description: Specific error message causing the error
 *                   example: MISSING_TITLE
 *       400:
 *         description: Error parsing request body
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 board_id:
 *                   type: integer
 *                   description: Id of the board where the task is
 *                   example: 1
 *                 task_id:
 *                   type: integer
 *                   description: ID of the task to which developers have been assigned
 *                   example: 1
 *                 assignee_ids:
 *                   type: string
 *                   description: IDs of the developers assigned to the task, separated by commas
 *                   example: 2, 3, 5
 *                 error_message:
 *                   type: string
 *                   description: Specific error message causing the error
 *                   example: MISSING_TITLE
 *       403:
 *         description: User lacking permissions to perform current action
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 board_id:
 *                   type: integer
 *                   description: Id of the board where the task is
 *                   example: 1
 *                 task_id:
 *                   type: integer
 *                   description: ID of the task to which developers have been assigned
 *                   example: 1
 *                 assignee_ids:
 *                   type: string
 *                   description: IDs of the developers assigned to the task, separated by commas
 *                   example: 2, 3, 5
 *                 error_message:
 *                   type: string
 *                   description: Specific error message causing the error
 *                   example: MISSING_TITLE
 */
router.post('/:id(\\d+)/assign-task', authJWT, async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user;
  const { board_id: boardId, assignee_ids: assigneeIds } = req.body;

  if (assigneeIds === undefined || assigneeIds.length === 0) {
    return res.status(400).json({
      board_id: null,
      task_id: null,
      assignee_ids: null,
      error_message: taskErrorMessages.MISSING_ASSIGNEE_IDS,
    });
  }

  try {
    await getPermissions(userId, boardId);
  } catch (err) {
    debug(err);
    return res.status(403).json({
      board_id: null,
      task_id: null,
      assignee_ids: null,
      error_message: err,
    });
  }

  try {
    await setAssignees(id, assigneeIds);

    return res.json({
      board_id: boardId,
      task_id: id,
      assignee_ids: assigneeIds,
      error_message: null,
    });
  } catch (err) {
    debug(err);
    return res.status(500).json({
      board_id: null,
      task_id: null,
      assignee_ids: null,
      error_message: err,
    });
  }
});

/**
 * @swagger
 *  /task/{id}/assign-task:
 *   put:
 *     summary: Assign a task to developer/s.
 *     tags: [Tasks]
 *     security:
 *       - JWTBearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: true
 *         description: Numeric ID of the task to delete
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               board_id:
 *                 type: integer
 *                 description: ID of the board where the task is
 *                 example: 1
 *               assignee_ids:
 *                 type: array
 *                 description: ID/s of the developer/s to be assigned to the task
 *                 items:
 *                   type: integer
 *                   example: [2, 3, 5]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 board_id:
 *                   type: integer
 *                   description: Id of the board where the task is
 *                   example: 1
 *                 task_id:
 *                   type: integer
 *                   description: ID of the task to which developers have been assigned
 *                   example: 1
 *                 assignee_ids:
 *                   type: string
 *                   description: IDs of the developers assigned to the task, separated by commas
 *                   example: 2, 3, 5
 *                 error_message:
 *                   type: string
 *                   description: Specific error message causing the error
 *                   example: MISSING_TITLE
 *       400:
 *         description: Error parsing request body
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 board_id:
 *                   type: integer
 *                   description: Id of the board where the task is
 *                   example: 1
 *                 task_id:
 *                   type: integer
 *                   description: ID of the task to which developers have been assigned
 *                   example: 1
 *                 assignee_ids:
 *                   type: string
 *                   description: IDs of the developers assigned to the task, separated by commas
 *                   example: 2, 3, 5
 *                 error_message:
 *                   type: string
 *                   description: Specific error message causing the error
 *                   example: MISSING_TITLE
 *       403:
 *         description: User lacking permissions to perform current action
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 board_id:
 *                   type: integer
 *                   description: Id of the board where the task is
 *                   example: 1
 *                 task_id:
 *                   type: integer
 *                   description: ID of the task to which developers have been assigned
 *                   example: 1
 *                 assignee_id:
 *                   type: string
 *                   description: IDs of the developers assigned to the task, separated by commas
 *                   example: 2, 3, 5
 *                 error_message:
 *                   type: string
 *                   description: Specific error message causing the error
 *                   example: MISSING_TITLE
 */
router.put('/:id(\\d+)/assign-task', authJWT, async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user;
  const { board_id: boardId, assignee_ids: assigneeIds } = req.body;

  if (boardId === undefined) {
    return res.status(400).json({
      board_id: null,
      task_id: null,
      assignee_ids: null,
      error_message: taskErrorMessages.MISSING_BOARD_ID,
    });
  }

  if (assigneeIds === undefined || assigneeIds.length === 0) {
    return res.status(400).json({
      board_id: null,
      task_id: null,
      assignee_ids: null,
      error_message: taskErrorMessages.MISSING_ASSIGNEE_IDS,
    });
  }

  try {
    await getPermissions(userId, boardId);
  } catch (err) {
    debug(err);
    return res.status(403).json({
      board_id: null,
      task_id: null,
      assignee_ids: null,
      error_message: err,
    });
  }

  try {
    await replaceAssignees(id, assigneeIds);

    return res.json({
      board_id: boardId,
      task_id: parseInt(id, 10),
      assignee_ids: assigneeIds.sort((a, b) => a - b),
      error_message: null,
    });
  } catch (err) {
    debug(err);
    return res.status(500).json({
      board_id: null,
      task_id: null,
      assignee_ids: null,
      error_message: err,
    });
  }
});

module.exports = router;
