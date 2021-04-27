const express = require('express');
const debug = require('debug')('backend:routes-boards');

const router = express.Router();

// Models
const {
  getPermissions,
  createBoard,
  deleteBoard,
  getBoardsWithUser,
  getBoardById,
  editBoard,
} = require('../models/boards');

// Middlewares
const { authJWT } = require('../middlewares/auth');

// Constants
const { board: boardErrorMessages } = require('../constants/error-messages');

router.get('/', authJWT, (req, res) => {
  res.json({ error_message: req.user });
});

/**
 * @swagger
 * tags:
 *  name: Boards
 *  description: Perform operations on boards
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    CreateBoard:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *          nullable: true
 *          description: Board ID
 *          example: 1
 *        error_message:
 *          type: string
 *          nullable: true
 *          description: Specific error message causing the error
 *          example: MISSING_TITLE
 *
 * /boards/create-board:
 *   post:
 *     summary: Create a board.
 *     tags: [Boards]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Board title
 *                 example: GiTrack
 *               id:
 *                 type: integer
 *                 description: User ID
 *                 example: 1
 *     responses:
 *       201:
 *         description: Board created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateBoard'
 *       400:
 *         description: Error parsing request body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateBoard'
 */
router.post('/create-board', authJWT, async (req, res) => {
  const { title } = req.body;
  const { id: userId } = req.user;

  if (title === undefined) {
    return res
      .status(400)
      .json({ id: null, error_message: boardErrorMessages.MISSING_TITLE });
  }

  try {
    const boardId = await createBoard(title, userId);

    return res.status(201).json({ id: boardId, error_message: null });
  } catch (err) {
    debug(err);
    return res.status(500).json({ id: null, error_message: err });
  }
});

/**
 * @swagger
 *  /boards/edit-board:
 *   patch:
 *     summary: Edit a board.
 *     tags: [Boards]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: New board title
 *                 example: GiTrack
 *               id:
 *                 type: integer
 *                 description: Board ID
 *                 example: 1
 *     responses:
 *       200:
 *         description: Board successfully edited
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateBoard'
 *       400:
 *         description: Error parsing request body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateBoard'
 *       403:
 *         description: User lacking permissions to perform current action
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateBoard'
 *       409:
 *         description:  Current name and new name are the same
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateBoard'
 */

router.patch('/edit-board', authJWT, async (req, res) => {
  const { id, name } = req.body;
  const { id: userId } = req.user;

  if (id === undefined) {
    return res
      .status(400)
      .json({ id: null, error_message: boardErrorMessages.MISSING_ID });
  }

  if (name === undefined) {
    return res
      .status(400)
      .json({ id: null, error_message: boardErrorMessages.MISSING_NAME });
  }

  try {
    const userPermissions = await getPermissions(userId, id);
    if (!userPermissions) {
      return res
        .status(403)
        .json({ id: null, error_message: boardErrorMessages.NOT_ENOUGH_PERMISSIONS });
    }
  } catch (err) {
    debug(err);
    return res
      .status(403)
      .json({ id: null, error_message: boardErrorMessages.NOT_ENOUGH_PERMISSIONS });
  }

  const currentName = await getBoardById(id);

  if (name === currentName.title) {
    return res
      .status(409)
      .json({ id: null, error_message: boardErrorMessages.SAME_NAME });
  }

  try {
    const boardId = await editBoard(id, name);

    return res.json({ id: boardId, title: name, error_message: null });
  } catch (err) {
    debug(err);
    return res.status(500).json({ id: null, error_message: err });
  }
});

/**
 * @swagger
 *  /boards/delete-board:
 *   delete:
 *     summary: Delete a board.
 *     tags: [Boards]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: Board ID
 *                 example: 1
 *               userId:
 *                 type: integer
 *                 description: User ID
 *                 example: 1
 *     responses:
 *       200:
 *         description: Board successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateBoard'
 *       400:
 *         description: Error parsing request body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateBoard'
 *       403:
 *         description: User lacking permissions to perform current action
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateBoard'
 */

router.delete('/delete-board', authJWT, async (req, res) => {
  const { id } = req.body;
  const { id: userId } = req.user;

  if (id === undefined) {
    return res
      .status(400)
      .json({ id: null, error_message: boardErrorMessages.MISSING_ID });
  }

  if (userId === undefined) {
    return res
      .status(400)
      .json({ id: null, error_message: boardErrorMessages.MISSING_USER_ID });
  }

  try {
    const userPermissions = await getPermissions(userId, id);
    if (!userPermissions) {
      return res
        .status(403)
        .json({ id: null, error_message: boardErrorMessages.NOT_ENOUGH_PERMISSIONS });
    }
  } catch (err) {
    debug(err);
    return res
      .status(403)
      .json({ id: null, error_message: boardErrorMessages.NOT_ENOUGH_PERMISSIONS });
  }

  if ((await getBoardById(id)) === undefined) {
    return res
      .status(400)
      .json({ id: null, error_message: boardErrorMessages.DELETE_FAILED });
  }

  try {
    const boardId = await deleteBoard(id);

    return res.json({ id: boardId, error_message: null });
  } catch (err) {
    debug(err);
    return res.status(500).json({ id: null, error_message: err });
  }
});

/**
 * @swagger
 *  /boards/get-board:
 *   get:
 *     summary: Get boards of which user with id userId is a member.
 *     tags: [Boards]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: User ID
 *                 example: 1
 *     responses:
 *       200:
 *         description: Board successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 boardId:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       nullable: false
 *                       description: Board ID
 *                       example: 1
 *                   nullable: false
 *                   description: Collection of Board IDs of boards where the user is a member
 *       400:
 *         description: Error parsing request body
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 boardId:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       nullable: false
 *                       description: Board ID
 *                       example: 1
 *                   nullable: false
 *                   description: Collection of Board IDs of boards where the user is a member
 */

router.get('/get-board', authJWT, async (req, res) => {
  const { id: userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error_message: boardErrorMessages.MISSING_USER_ID });
  }

  try {
    const boardId = await getBoardsWithUser(userId);

    return res.json(boardId);
  } catch (err) {
    debug(err);
    return res.status(500).json({ error_message: err });
  }
});

module.exports = router;
