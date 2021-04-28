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
const { connectRepository } = require('../models/repositories');

// Middlewares
const { authJWT } = require('../middlewares/auth');

// Constants
const { board: boardErrorMessages } = require('../constants/error-messages');

/**
 * @swagger
 * tags:
 *  name: Boards
 *  description: Perform operations on boards
 * components:
 *  schemas:
 *    Board:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *          nullable: true
 *          description: Board ID
 *          example: 1
 *        title:
 *          type: integer
 *          description: Board Title
 *          example: "Ayo"
 *        error_message:
 *          type: string
 *          nullable: true
 *          description: Specific error message causing the error
 *          example: MISSING_TITLE
 *  responses:
 *    Board200:
 *      description: OK
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Board'
 *    Board400:
 *      description: Error parsing request body
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Board'
 *    Board403:
 *      description: User lacking permissions to perform current action
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Board'
 */

/**
 * @swagger
 * /board:
 *   get:
 *     summary: Get boards of which user is a member.
 *     tags: [Boards]
 *     security:
 *       - JWTBearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 boards:
 *                   type: array
 *                   description: Collection of Board IDs of boards where the user is a member
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: Board ID
 *                         example: 1
 *                       title:
 *                         type: integer
 *                         description: Board Title
 *                         example: "Ayo"
 *                 error_message:
 *                   type: string
 *                   nullable: true
 *                   description: Specific error message causing the error
 *                   example: MISSING_TITLE
 */

router.get('/', authJWT, async (req, res) => {
  const { id: userId } = req.user;

  try {
    const boardId = await getBoardsWithUser(userId);

    return res.json({ boards: boardId, error_message: null });
  } catch (err) {
    debug(err);
    return res.status(500).json({ boards: null, error_message: err });
  }
});

/**
 * @swagger
 *
 * /board:
 *   post:
 *     summary: Create a board.
 *     tags: [Boards]
 *     security:
 *       - JWTBearerAuth: []
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
 *     responses:
 *       201:
 *         description: Board created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Board'
 *       400:
 *         $ref: '#/components/responses/Board400'
 */
router.post('/', authJWT, async (req, res) => {
  const { title } = req.body;
  const { id: userId } = req.user;

  if (title === undefined) {
    return res
      .status(400)
      .json({ id: null, title: null, error_message: boardErrorMessages.MISSING_TITLE });
  }

  try {
    const boardId = await createBoard(title, userId);

    return res.status(201).json({ id: boardId, title, error_message: null });
  } catch (err) {
    debug(err);
    return res.status(500).json({ id: null, title, error_message: err });
  }
});

/**
 * @swagger
 *  /board/{id}:
 *   get:
 *     summary: Get specific board.
 *     tags: [Boards]
 *     security:
 *       - JWTBearerAuth: []
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Board200'
 *       400:
 *         $ref: '#/components/responses/Board400'
 *       403:
 *         $ref: '#/components/responses/Board403'
 */

router.get('/:id(\\d+)', authJWT, async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user;

  if (id === undefined) {
    return res
      .status(400)
      .json({ id: null, title: null, error_message: boardErrorMessages.MISSING_ID });
  }

  try {
    await getPermissions(userId, id);
  } catch (err) {
    debug(err);
    return res.status(403).json({
      id: null,
      title: null,
      error_message: err,
    });
  }

  try {
    const board = await getBoardById(id);

    return res.json({
      id: board.id,
      title: board.title,
      error_message: null,
    });
  } catch (err) {
    debug(err);

    return res.status(500).json({
      id: null,
      title: null,
      error_message: err,
    });
  }
});

/**
 * @swagger
 *  /board/{id}:
 *   patch:
 *     summary: Edit a board.
 *     security:
 *       - JWTBearerAuth: []
 *     tags: [Boards]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: true
 *         description: Numeric ID of the board to edit
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
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Board200'
 *       400:
 *         $ref: '#/components/responses/Board400'
 *       403:
 *         $ref: '#/components/responses/Board403'
 */

router.patch('/:id(\\d+)', authJWT, async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const { id: userId } = req.user;

  if (id === undefined) {
    return res
      .status(400)
      .json({ id: null, title: null, error_message: boardErrorMessages.MISSING_ID });
  }

  if (name === undefined) {
    return res
      .status(400)
      .json({ id: null, title: null, error_message: boardErrorMessages.MISSING_NAME });
  }

  try {
    await getPermissions(userId, id);
  } catch (err) {
    debug(err);
    return res.status(403).json({
      id: null,
      title: null,
      error_message: err,
    });
  }

  try {
    await editBoard(id, name);

    return res.json({ id: parseInt(id, 10), title: name, error_message: null });
  } catch (err) {
    debug(err);
    return res.status(500).json({ id: null, title: null, error_message: err });
  }
});

/**
 * @swagger
 *  /board/{id}:
 *   delete:
 *     summary: Delete a board.
 *     tags: [Boards]
 *     security:
 *       - JWTBearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: true
 *         description: Numeric ID of the board to edit
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Board200'
 *       400:
 *         $ref: '#/components/responses/Board400'
 *       403:
 *         $ref: '#/components/responses/Board403'
 */

router.delete('/:id(\\d+)', authJWT, async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user;

  if (id === undefined) {
    return res
      .status(400)
      .json({ id: null, title: null, error_message: boardErrorMessages.MISSING_ID });
  }

  try {
    await getPermissions(userId, id);
  } catch (err) {
    debug(err);
    return res.status(403).json({ id: null, title: null, error_message: err });
  }

  let board = null;

  try {
    board = await getBoardById(id);
  } catch (err) {
    debug(err);

    return res.json({
      id: null,
      title: null,
      error_message: err,
    });
  }

  try {
    await deleteBoard(id);

    return res.json({ id: board.id, title: board.title, error_message: null });
  } catch (err) {
    debug(err);
    return res.status(500).json({ id: null, title: null, error_message: err });
  }
});

router.post('/:id(\\d+)/connect', authJWT, async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user;
  const { id: repoId, full_name: fullName, url, board_id: boardId } = req.body;

  if (id === undefined) {
    return res.status(400).json({
      id: null,
      full_name: null,
      board_id: null,
      error_message: boardErrorMessages.MISSING_ID,
    });
  }

  if (fullName === undefined) {
    return res.status(400).json({
      id: null,
      full_name: null,
      board_id: null,
      error_message: boardErrorMessages.MISSING_FULL_NAME,
    });
  }

  if (url === undefined) {
    return res.status(400).json({
      id: null,
      full_name: null,
      board_id: null,
      error_message: boardErrorMessages.MISSING_URL,
    });
  }

  try {
    await getPermissions(userId, id, 1);
  } catch (err) {
    debug(err);
    return res
      .status(403)
      .json({ id: null, full_name: null, board_id: null, error_message: err });
  }

  let board = null;

  try {
    board = await getBoardById(id);
  } catch (err) {
    debug(err);

    return res.json({
      id: null,
      full_name: null,
      board_id: null,
      error_message: err,
    });
  }

  if (board === undefined) {
    return res.status(403).json({
      id: null,
      full_name: null,
      board_id: null,
      error_message: boardErrorMessages.NOT_ENOUGH_PERMISSIONS,
    });
  }

  try {
    await connectRepository(repoId, fullName, url, boardId);

    return res.json({
      id: repoId,
      full_name: fullName,
      board_id: boardId,
      error_message: null,
    });
  } catch (err) {
    return res.status(500).json({
      id: null,
      full_name: null,
      board_id: null,
      error_message: err,
    });
  }
});

module.exports = router;
