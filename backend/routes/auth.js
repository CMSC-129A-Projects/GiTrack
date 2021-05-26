const express = require('express');
const jwt = require('jsonwebtoken');
const debug = require('debug')('backend:routes-auth');

const router = express.Router();

// Models
const { registerUser, loginUser } = require('../models/users');

// Middlewares
const { authJWT } = require('../middlewares/auth');

// Constants
const { user: userErrorMessages } = require('../constants/error-messages');

// Secrets
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = require('../constants/keys');

let refreshTokens = [];

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Authenticate and create users
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Chosen username
 *                 example: juan
 *               password:
 *                 type: string
 *                 description: Chosen password
 *                 example: generic123
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       201:
 *         description: User created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       400:
 *         description: Error parsing request body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: A user with that values already exist
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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
    return res.status(201).json({ error_message: null });
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

/**
 * @swagger
 * components:
 *   schemas:
 *     AuthLogin:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           nullable: true
 *           description: User ID
 *           example: 1
 *         username:
 *           type: string
 *           nullable: true
 *           description: Username of user
 *           example: juan
 *         access_token:
 *           type: string
 *           nullable: true
 *           description: Access JWT. Expires 20m after generation
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjE4MjA5NjA2LCJleHAiOjE2MTgyMTA4MDZ9.W51p-MrH5CLjVY0WYa5M4tOHFHAfSzxRxjKqf5eWIiU
 *         refresh_token:
 *           type: string
 *           nullable: true
 *           description: Refresh JWT. Does not expire. Used for requesting new access tokens.
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjE4MjA5NjA2fQ.t-cktkARN0sN70pHLIpo3KFI59CBHMhY14RvrEyZl54
 *         error_message:
 *           type: string
 *           nullable: true
 *           description: Specific error message causing the error
 *           example: MISSING_USERNAME
 *
 * /auth/login:
 *   post:
 *     summary: Login as a user.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username of user
 *                 example: juan
 *               password:
 *                 type: string
 *                 description: Password of user
 *                 example: generic123
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthLogin'
 *       400:
 *         description: Error parsing request body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthLogin'
 *       403:
 *         description: Forbidden. User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthLogin'
 *       500:
 *         description: Uncaught Exception. Contact backend dev if API returns this
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthLogin'
 *
 */
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!password) {
    return res.status(400).json({
      id: null,
      username: null,
      access_token: null,
      refresh_token: null,
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

    const accessToken = jwt.sign({ id }, ACCESS_TOKEN_SECRET, {
      expiresIn: '20m',
    });
    const refreshToken = jwt.sign({ id }, REFRESH_TOKEN_SECRET);
    refreshTokens.push(refreshToken);

    return res.json({
      id,
      username,
      access_token: accessToken,
      refresh_token: refreshToken,
      error_message: null,
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

/**
 * @swagger
 * components:
 *   schemas:
 *     AuthRefreshToken:
 *       type: object
 *       properties:
 *         access_token:
 *           type: string
 *           nullable: true
 *           description: New access JWT. Expires 20m after generation
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjE4MjA5NjA2LCJleHAiOjE2MTgyMTA4MDZ9.W51p-MrH5CLjVY0WYa5M4tOHFHAfSzxRxjKqf5eWIiU
 *         error_message:
 *           type: string
 *           nullable: true
 *           description: Specific error message causing the error
 *           example: MISSING_USERNAME
 *
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh token whenever authentication token has expired.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refresh_token:
 *                 type: string
 *                 description: Refresh Token
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjE4MjA5NjA2fQ.t-cktkARN0sN70pHLIpo3KFI59CBHMhY14RvrEyZl54
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthRefreshToken'
 *       400:
 *         description: Error parsing request body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthRefreshToken'
 *       403:
 *         description: Forbidden. Refresh token is invalid, malformed or not generated by the server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthRefreshToken'
 *
 */
router.post('/refresh-token', (req, res) => {
  const { refresh_token: refreshToken } = req.body;

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

  try {
    const user = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

    const accessToken = jwt.sign({ id: user.id }, ACCESS_TOKEN_SECRET, {
      expiresIn: '20m',
    });

    return res.json({ access_token: accessToken, error_message: null });
  } catch (err) {
    debug(err);
    return res
      .status(403)
      .json({ access_token: null, error_message: userErrorMessages.TOKEN_INVALID });
  }
});

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout of session and remove refresh token from pool of refresh tokens.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refresh_token:
 *                 type: string
 *                 description: Refresh token of user
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjE4MjA5NjA2fQ.t-cktkARN0sN70pHLIpo3KFI59CBHMhY14RvrEyZl54
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       400:
 *         description: Error parsing request body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/logout', authJWT, (req, res) => {
  const { refresh_token: refreshToken } = req.body;

  if (!refreshToken) {
    return res
      .status(400)
      .json({ error_message: userErrorMessages.MISSING_REFRESH_TOKEN });
  }

  refreshTokens = refreshTokens.filter((currToken) => currToken !== refreshToken);

  return res.json({ error_message: null });
});

module.exports = router;
