const express = require('express');
const router = express.Router();
const debug = require('debug')('backend:routes-boards');


// Models
const { createBoard, deleteBoard, getBoardsWithUser, editBoard } = require('../models/boards');

// Middlewares
const { authJWT } = require('../middlewares/auth');

// Constants
const { board: boardErrorMessages } = require('../constants/error-messages');

router.get('/', authJWT, function (req, res) {
  res.json({ message: req.user });
});

router.post('/create-board', authJWT, async function (req, res) {
  const { title } = req.body;
  const { id: userId } = req.user;

  if (!title) {
    return res.status(400).json({ message: boardErrorMessages.MISSING_TITLE });
  }

  if (!userId) {
    return res.status(400).json({ message: boardErrorMessages.MISSING_ID });
  }

  try {
    const boardId = await createBoard(title, userId);

    res.json({ boardId });
  } catch (err) {
    debug(err);
    res.status(500).json({ message: error });
  }
});

router.post('/edit-board', authJWT, async function (req, res) {
  const { id } = req.body;
  const { name: newName } = req.body;
  const { id: userId } = req.user;

  if (!id) {
    return res.status(400).json({ message: boardErrorMessages.MISSING_ID });
  }

  if(!newName){
    return res.status(400).json({ message: boardErrorMessages.MISSING_NAME });
  }

  if(!userId){
    return res.status(400).json({ message: boardErrorMessages.MISSING_USER_ID });
  }

  try {
    const boardId = await editBoard(id, newName, userId);

    res.json({ boardId });
  } catch (err) {
    debug(err);
    res.status(500).json({ message: error });
  }
});

router.post('/delete-board', authJWT, async function (req, res) {
  const { id } = req.body;
  const { id: userId } = req.user;

  if (!id) {
    return res.status(400).json({ message: boardErrorMessages.MISSING_ID });
  }

  if(!userId){
    return res.status(400).json({ message: boardErrorMessages.MISSING_USER_ID });
  }

  try {
    const boardId = await deleteBoard(id, userId);

    res.json({ boardId });
  } catch (err) {
    debug(err);
    res.status(500).json({ message: error });
  }
});

router.post('/get-board', authJWT, async function (req, res) {
  const { id: userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: boardErrorMessages.MISSING_USER_ID });
  }

  try {
    const boardId = await getBoardsWithUser(userId);

    res.json({ boardId });
  } catch (err) {
    debug(err);
    res.status(500).json({ message: error });
  }
});

module.exports = router;
