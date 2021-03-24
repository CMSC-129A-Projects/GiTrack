const express = require('express');
const router = express.Router();
const debug = require('debug')('backend:routes-auth');
const { registerUser, loginUser, userStatus } = require('../models/users');

router.post('/register', async function (req, res) {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    res.status(400);
  }

  try {
    await registerUser(username, password, email);
    res.status(201).json({ username, email });
  } catch (error) {
    debug(error);
    if (error === userStatus.DUPLICATE_EMAIL || error === userStatus.DUPLICATE_USER) {
      res.status(409).json({ message: error });
    } else {
      res.status(500).json({ message: error });
    }
  }
});

router.post('/login', async function (req, res) {
  const { username, password, email } = req.body;
  if (!password || (!email && !username)) {
    res.status(400);
  }
  try {
    await loginUser(username, password, email);
    res.status(200).json({ username, email, token: 'test' });
  } catch (error) {
    debug(error);
    if (error === userStatus.USER_NOT_FOUND) {
      res.status(403).json({ message: error });
    } else {
      res.status(500).json({ message: error });
    }
  }
});

module.exports = router;
