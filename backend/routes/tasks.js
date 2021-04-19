const express = require('express');
const debug = require('debug')('backend:routes-tasks');

const router = express.Router();

// Models
const { addTask, getBoardTasks, removeTask } = require('../models/tasks');

// Middlewares
const { authJWT } = require('../middlewares/auth');

// Constants
const { task: taskErrorMessages } = require('../constants/error-messages');

router.post('/add-task', authJWT, async (req, res) => {
  const { id, title, description } = req.body;
  const { id: userId } = req.user;

  if (!title) {
    return res.status(400).json({
      title: null,
      description: null,
      error_message: taskErrorMessages.MISSING_TITLE,
    });
  }

  if (!description) {
    return res.status(400).json({
      title: null,
      description: null,
      error_message: taskErrorMessages.MISSING_DESCRIPTION,
    });
  }

  try {
    const taskId = await addTask(title, description, userId, id);

    return res.json({ title: taskId, board: id, error_message: null });
  } catch (err) {
    debug(err);
    return res.status(403).json({ title: null, error_message: err });
  }
});

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

router.delete('/remove-task', authJWT, async (req, res) => {
  const { title, id } = req.body;
  const { id: userId } = req.user;

  try {
    const taskId = await removeTask(title, userId, id);

    return res.json({ title: taskId, error_message: null });
  } catch (err) {
    debug(err);
    return res.status(403).json({ title: null, error_message: err });
  }
});

module.exports = router;
