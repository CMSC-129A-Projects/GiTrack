const express = require('express');
const debug = require('debug')('backend:routes-boards');

const router = express.Router();

// Models
const {
  getPermissions,
  createBoard,
  deleteBoard,
  getBoardsWithUser,
  getBoardById,
  editBoard,
} = require('../models/boards');

// Middlewares
const { authJWT } = require('../middlewares/auth');

// Constants
const { board: boardErrorMessages } = require('../constants/error-messages');

router.get('/', authJWT, (req, res) => {
  res.json({ error_message: req.user });
});

router.post('/create-board', authJWT, async (req, res) => {
  const { title } = req.body;
  const { id: userId } = req.user;

  if (title === undefined) {
    return res
      .status(400)
      .json({ id: null, error_message: boardErrorMessages.MISSING_TITLE });
  }

  try {
    const boardId = await createBoard(title, userId);

    return res.status(201).json({ id: boardId, error_message: null });
  } catch (err) {
    debug(err);
    return res.status(500).json({ id: null, error_message: err });
  }
});

router.patch('/edit-board', authJWT, async (req, res) => {
  const { id, name } = req.body;
  const { id: userId } = req.user;

  if (id === undefined) {
    return res
      .status(400)
      .json({ id: null, error_message: boardErrorMessages.MISSING_ID });
  }

  if (name === undefined) {
    return res
      .status(400)
      .json({ id: null, error_message: boardErrorMessages.MISSING_NAME });
  }

  const userPermissions = await getPermissions(userId, id);

  if (userPermissions === undefined) {
    return res
      .status(403)
      .json({ id: null, error_message: boardErrorMessages.NOT_ENOUGH_PERMISSIONS });
  }

  const currentName = await getBoardById(id);

  if (name === currentName) {
    return res
      .status(409)
      .json({ id: null, error_message: boardErrorMessages.SAME_NAME });
  }

  try {
    const boardId = await editBoard(id, name, userId);

    return res.json({ id: boardId, title: name, error_message: null });
  } catch (err) {
    debug(err);
    return res.status(500).json({ id: null, error_message: err });
  }
});

router.post('/delete-board', authJWT, async (req, res) => {
  const { id } = req.body;
  const { id: userId } = req.user;

  if (!id) {
    return res
      .status(400)
      .json({ id: null, error_message: boardErrorMessages.MISSING_ID });
  }

  if (!userId) {
    return res
      .status(400)
      .json({ id: null, error_message: boardErrorMessages.MISSING_USER_ID });
  }

  try {
    const boardId = await deleteBoard(id, userId);

    return res.json({ id: boardId, error_message: null });
  } catch (err) {
    debug(err);
    return res.status(500).json({ id: null, error_message: err });
  }
});

router.get('/get-board', authJWT, async (req, res) => {
  const { id: userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error_message: boardErrorMessages.MISSING_USER_ID });
  }

  try {
    const boardId = await getBoardsWithUser(userId);

    return res.json(boardId);
  } catch (err) {
    debug(err);
    return res.status(500).json({ error_message: err });
  }
});

module.exports = router;
