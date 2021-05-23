const express = require('express');
const debug = require('debug')('backend:routes-users');

const router = express.Router();

// Models
const { findUser, userExists } = require('../models/users');

// Middlewares
const { authJWT } = require('../middlewares/auth');

// Constants
const { user: userErrorMessages } = require('../constants/error-messages');

router.get('/:id(\\d+)', authJWT, async (req, res) => {
  const { id } = req.params;

  if (id === undefined) {
    return res
      .status(400)
      .json({ user_id: null, error_message: userErrorMessages.MISSING_ID });
  }

  try {
    await findUser(id);

    return res.json({ user_id: id, error_message: null });
  } catch (err) {
    debug(err);
    return res.status(404).json({ user_id: null, error_message: err });
  }
});

router.get('/exists', authJWT, async (req, res) => {
  const { email } = req.body;

  if (email === undefined) {
    return res
      .status(400)
      .json({ user_exists: null, error_message: userErrorMessages.MISSING_EMAIL });
  }

  try {
    await userExists(email);

    return res.json({ user_exists: true, error_message: null });
  } catch (err) {
    debug(err);
    return res.status(404).json({ user_exists: null, error_message: err });
  }
});

module.exports = router;
