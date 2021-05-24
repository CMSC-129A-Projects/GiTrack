/* eslint-disable no-await-in-loop */
const express = require('express');
const debug = require('debug')('backend:routes-users');

const router = express.Router();

// Models
const { findUser, usersExist } = require('../models/users');

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
  const { emails } = req.query;

  if (emails === undefined) {
    return res
      .status(400)
      .json({ ids: null, error_message: userErrorMessages.MISSING_EMAIL });
  }

  try {
    const ids = await usersExist(emails.split(','));

    return res.json({ ids, error_message: null });
  } catch (err) {
    debug(err);
    return res.status(404).json({ ids: null, error_message: err });
  }
});

module.exports = router;
