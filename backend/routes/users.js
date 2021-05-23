const express = require('express');
const debug = require('debug')('backend:routes-boards');

const router = express.Router();

// Models
const { findUser } = require('../models/users');

// Middlewares
const { authJWT } = require('../middlewares/auth');

// Constants
const { user: userErrorMessages } = require('../constants/error-messages');

router.get('/', authJWT, async (req, res) => {
  const { id: userId } = req.body;

  if (userId === undefined) {
    return res
      .status(400)
      .json({ user_id:null, error_message: userErrorMessages.MISSING_ID });
  }

  try {
    await findUser(userId);

    return res.json({ user_id: userId, error_message: null });
  } catch (err) {
    debug(err);
    return res.status(404).json({ user_id: null, error_message: err });
  }
});

module.exports = router;
