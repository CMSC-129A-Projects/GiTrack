const express = require('express');
const router = express.Router();
const debug = require('debug')('backend:routes-boards');

// Models
const { createBoard } = require('../models/boards');

// Middlewares
const { authJWT } = require('../middlewares/auth');

router.get('/', authJWT, function (req, res) {
  res.json({ message: req.user });
});

router.post('/create-board', authJWT, async function (req, res) {
  const { title } = req.body;
  const { id: userId } = req.user;

  try {
    await createBoard(title, userId);
  } catch (err) {
    debug(err);
    res.status(500).json({ message: error });
  }
});

module.exports = router;
