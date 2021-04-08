const express = require('express');
const jwt = require('jsonwebtoken');
const debug = require('debug')('backend:routes-auth');

const router = express.Router();

// Models
const { registerUser, loginUser } = require('../models/users');

// Middlewares
const { authJWT } = require('../middlewares/auth');

// Constants
const {
  user: userErrorMessages,
  logic: logicErrorMessages,
} = require('../constants/error-messages');

// Secrets
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

let refreshTokens = [];

router.post('/register', async (req, res) => {
  const { username, password, email } = req.body;
  if (!username) {
    return res.status(400).json({ error_message: userErrorMessages.MISSING_USERNAME });
  }

  if (!password) {
    return res.status(400).json({ error_message: userErrorMessages.MISSING_PASSWORD });
  }

  if (!email) {
    return res.status(400).json({ error_message: userErrorMessages.MISSING_EMAIL });
  }

  try {
    await registerUser(username, password, email);
    return res.sendStatus(201);
  } catch (error) {
    debug(error);
    if (
      error === userErrorMessages.DUPLICATE_EMAIL ||
      error === userErrorMessages.DUPLICATE_USER
    ) {
      return res.status(409).json({ error_message: error });
    }

    return res.status(500).json({ error_message: error });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!password) {
    return res.status(400).json({
      id: null,
      username: null,
      access_token: null,
      refrest_token: null,
      error_message: userErrorMessages.MISSING_PASSWORD,
    });
  }
  if (!username) {
    return res.status(400).json({
      id: null,
      username: null,
      access_token: null,
      refresh_token: null,
      error_message: userErrorMessages.MISSING_USERNAME,
    });
  }
  try {
    const id = await loginUser(username, password);

    const accessToken = jwt.sign({ id }, accessTokenSecret, {
      expiresIn: '20m',
    });
    const refreshToken = jwt.sign({ id }, refreshTokenSecret);
    refreshTokens.push(refreshToken);

    return res.json({
      id,
      username,
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  } catch (error) {
    debug(error);
    if (error === userErrorMessages.USER_NOT_FOUND) {
      return res.status(403).json({
        id: null,
        username: null,
        access_token: null,
        refresh_token: null,
        error_message: error,
      });
    }
    return res.status(500).json({
      id: null,
      username: null,
      access_Token: null,
      refresh_token: null,
      error_message: error,
    });
  }
});

router.post('/refresh-token', (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({
      access_token: null,
      error_message: userErrorMessages.MISSING_REFRESH_TOKEN,
    });
  }

  if (!refreshTokens.includes(refreshToken)) {
    return res
      .status(403)
      .json({ access_token: null, error_message: userErrorMessages.TOKEN_INVALID });
  }

  jwt.verify(refreshToken, refreshTokenSecret, (err, user) => {
    if (err) {
      debug(err);
      return res
        .status(403)
        .json({ access_token: null, error_message: userErrorMessages.TOKEN_INVALID });
    }

    const accessToken = jwt.sign({ id: user.id }, accessTokenSecret, {
      expiresIn: '20m',
    });

    return res.json({ access_token: accessToken, error_message: null });
  });

  return res
    .status(500)
    .json({ access_token: null, error_message: logicErrorMessages.INACCESSIBLE_CODE });
});

router.post('/logout', authJWT, (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res
      .status(400)
      .json({ error_message: userErrorMessages.MISSING_REFRESH_TOKEN });
  }

  refreshTokens = refreshTokens.filter((currToken) => currToken !== refreshToken);

  return res.sendStatus('200');
});

module.exports = router;
