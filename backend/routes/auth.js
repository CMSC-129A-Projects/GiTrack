const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const debug = require('debug')('backend:routes-auth');

// Models
const { registerUser, loginUser } = require('../models/users');

// Middlewares
const { authJWT } = require('../middlewares/auth');

// Constants
const { user: userErrorMessages } = require('../constants/error-messages');

// Secrets
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

let refreshTokens = [];

router.post('/register', async function (req, res) {
  const { username, password, email } = req.body;
  if (!username) {
    return res.status(400).json({ message: userErrorMessages.MISSING_USERNAME });
  }

  if (!password) {
    return res.status(400).json({ message: userErrorMessages.MISSING_PASSWORD });
  }

  if (!email) {
    return res.status(400).json({ message: userErrorMessages.MISSING_EMAIL });
  }

  try {
    await registerUser(username, password, email);
    res.sendStatus(201);
  } catch (error) {
    debug(error);
    if (
      error === userErrorMessages.DUPLICATE_EMAIL ||
      error === userErrorMessages.DUPLICATE_USER
    ) {
      return res.status(409).json({ message: error });
    } else {
      return res.status(500).json({ message: error });
    }
  }
});

router.post('/login', async function (req, res) {
  const { username, password } = req.body;
  if (!password) {
    return res.status(400).json({ message: userErrorMessages.MISSING_PASSWORD });
  }
  if (!username) {
    return res.status(400).json({
      message: userErrorMessages.MISSING_USERNAME,
    });
  }
  try {
    const id = await loginUser(username, password);

    const accessToken = jwt.sign({ id: id }, accessTokenSecret, {
      expiresIn: '20m',
    });
    const refreshToken = jwt.sign({ id: id }, refreshTokenSecret);
    refreshTokens.push(refreshToken);

    res.json({ id, username, accessToken, refreshToken });
  } catch (error) {
    debug(error);
    if (error === userErrorMessages.USER_NOT_FOUND) {
      res.status(403).json({ message: error });
    } else {
      res.status(500).json({ message: error });
    }
  }
});

router.post('/refresh-token', function (req, res) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: userErrorMessages.MISSING_REFRESH_TOKEN });
  }

  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json({ message: userErrorMessages.TOKEN_INVALID });
  }

  jwt.verify(refreshToken, refreshTokenSecret, function (err, user) {
    if (err) {
      debug(err);
      return res.status(403).json({ message: userErrorMessages.TOKEN_INVALID });
    }

    const accessToken = jwt.sign({ id: user.id }, accessTokenSecret, {
      expiresIn: '20m',
    });

    return res.json({ accessToken });
  });
});

router.post('/logout', authJWT, function (req, res) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: userErrorMessages.MISSING_REFRESH_TOKEN });
  }

  refreshTokens = refreshTokens.filter((currToken) => currToken !== refreshToken);

  return res.sendStatus('200');
});

module.exports = router;
