const express = require('express');
const router = express.Router();
const debug = require('debug')('backend:routes-auth');
const { registerUser, userStatus } = require('../models/users');

/* Register */
router.post('/register', async function (req, res) {
  const { username, password, email } = req.body;
  try {
    await registerUser(username, password, email);
    res.status(201).json({ username, email });
  } catch (error) {
    if (error === userStatus.DUPLICATE_EMAIL || error === userStatus.DUPLICATE_USER) {
      res.status(409).json({ message: error });
    } else {
      res.status(500).json({ message: error });
    }
  }
});

module.exports = router;
