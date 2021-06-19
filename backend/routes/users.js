const express = require('express');
const debug = require('debug')('backend:routes-users');

const router = express.Router();

// Models
const { doesUserExistById, doUsersExistsByEmail } = require('../models/users');

// Middlewares
const { authJWT } = require('../middlewares/auth');

// Constants
const { user: userErrorMessages } = require('../constants/error-messages');

/**
 * @swagger
 * tags:
 *  name: Users
 *  description: Perform operations on users
 */

/**
 * @swagger
 *  /{id}:
 *   get:
 *     summary: Get a specific user.
 *     tags: [Users]
 *     security:
 *       - JWTBearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: true
 *         description: Numeric ID of the user to fetch
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_id:
 *                   type: integer
 *                   description: ID of the user to be fetched
 *                   example: 1
 *                 error_message:
 *                   type: string
 *                   description: Specific error message causing the error
 *                   example: MISSING_TITLE
 *       400:
 *         description: Error parsing request body
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_id:
 *                   type: integer
 *                   description: ID of the created task
 *                   example: 1
 *                 error_message:
 *                   type: string
 *                   description: Specific error message causing the error
 *                   example: MISSING_TITLE
 */
router.get('/:id(\\d+)', authJWT, async (req, res) => {
  const { id } = req.params;

  if (id === undefined) {
    return res
      .status(400)
      .json({ user_id: null, error_message: userErrorMessages.MISSING_ID });
  }

  try {
    await doesUserExistById(id);

    return res.json({ user_id: id, error_message: null });
  } catch (err) {
    debug(err);
    return res.status(404).json({ user_id: null, error_message: err });
  }
});

/**
 * @swagger
 *  /exists:
 *   get:
 *     summary: Check if a user exists using their email address.
 *     tags: [Users]
 *     security:
 *       - JWTBearerAuth: []
 *     parameters:
 *       - in: query
 *         name: emails
 *         schema:
 *           type: string
 *         required: true
 *         description: Email address of the user to check, separated by commas
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ids:
 *                   type: array
 *                   description: Email/s of the user/s to be checked
 *                   items:
 *                     type: integer
 *                     description: ID/s of the user/s to be checked
 *                     example: [1, 2, 5]
 *                 error_message:
 *                   type: string
 *                   description: Specific error message causing the error
 *                   example: MISSING_TITLE
 *       400:
 *         description: Error parsing request body
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ids:
 *                   type: array
 *                   description: Email/s of the user/s to be checked
 *                   items:
 *                     type: integer
 *                     description: ID/s of the user/s to be checked
 *                     example: [1, 2, 5]
 *                 error_message:
 *                   type: string
 *                   description: Specific error message causing the error
 *                   example: MISSING_TITLE
 */
router.get('/exists', authJWT, async (req, res) => {
  const { emails } = req.query;

  if (emails === undefined) {
    return res
      .status(400)
      .json({ ids: null, error_message: userErrorMessages.MISSING_EMAIL });
  }

  try {
    const ids = await doUsersExistsByEmail(emails.split(','));
    debug(ids);

    return res.json({ ids, error_message: null });
  } catch (err) {
    debug(err);
    return res.status(404).json({ ids: null, error_message: err });
  }
});

module.exports = router;
