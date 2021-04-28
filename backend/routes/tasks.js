const express = require('express');
const debug = require('debug')('backend:routes-tasks');

const router = express.Router();

// Models
const { addTask, getTask, getBoardTasks, removeTask } = require('../models/tasks');
const { getPermissions } = require('../models/boards');

// Middlewares
const { authJWT } = require('../middlewares/auth');

// Constants
const {
  task: taskErrorMessages,
  board: boardErrorMessages,
} = require('../constants/error-messages');

router.post('/', authJWT, async (req, res) => {
  const { board_id: boardId, title, description } = req.body;
  const { id: userId } = req.user;

  if (boardId === undefined) {
    return res.status(400).json({
      id: null,
      column_id: null,
      board_id: null,
      title: null,
      description: null,
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
      error_message: taskErrorMessages.MISSING_DESCRIPTION,
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
      error_message: err,
    });
  }

  try {
    const taskId = await addTask(title, description, boardId);

    return res.json({
      id: taskId,
      column_id: 0,
      board_id: boardId,
      title,
      description,
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
      error_message: err,
    });
  }
});

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
      error_message: err,
    });
  }

  if (!task) {
    return res.status(403).json({
      id: null,
      column_id: null,
      board_id: null,
      title: null,
      description: null,
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
      error_message: err,
    });
  }

  return res.json({
    ...task,
    error_message: null,
  });
});

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
      description: null,
      error_message: err,
    });
  }

  if (!task) {
    return res.status(403).json({
      id: null,
      column_id: null,
      board_id: null,
      title: null,
      description: null,
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
  const { id: userId } = req.user;

  try {
    const tasks = await getBoardTasks(userId, id);

    return res.json(tasks);
  } catch (err) {
    debug(err);

    return res.status(204).json({ title: null, error_message: err });
  }
});

module.exports = router;
