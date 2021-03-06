/* eslint-disable no-await-in-loop */
const express = require('express');
const debug = require('debug')('backend:routes-boards');
const { request } = require('@octokit/request');

const router = express.Router();

// Models
const {
  createBoard,
  deleteBoard,
  getBoardById,
  editBoard,
} = require('../models/boards');

const {
  getPermissions,
  getBoardsByUser,
  addDevToBoard,
  getMembersInBoard,
  isUserInBoard,
  removeMembers,
} = require('../models/memberships');

const { getGithubToken } = require('../models/users');

const { getTasksInBoard } = require('../models/tasks');

const {
  connectRepository,
  getRepositoriesInBoard,
  removeRepositoryfromBoard,
} = require('../models/repositories');

// Middlewares
const { authJWT } = require('../middlewares/auth');

// Constants
const { board: boardErrorMessages } = require('../constants/error-messages');

// KEYS
const { GH_SHA_SECRET } = require('../constants/keys');

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
    const boardId = await getBoardsByUser(userId);

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
 *     summary: Create a board
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

/**
 * @swagger
 *  /board/{id}/connect:
 *   post:
 *     summary: Connect a repository to a board.
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               repoId:
 *                 type: integer
 *                 description: ID of the repository to be connected to the board
 *                 example: 344388797
 *               full_name:
 *                 type: string
 *                 description: Full name of the repository to be connected to the board
 *                 example: CMSC-129A-Projects/GiTrack
 *               url:
 *                 type: string
 *                 description: URL of the repository to be connected to the board
 *                 example: https://api.github.com/repos/CMSC-129A-Projects/GiTrack
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID of the repository to be connected to the board
 *                   example: 344388797
 *                 full_name:
 *                   type: string
 *                   description: Full name of the repository to be connected to the board
 *                   example: CMSC-129A-Projects/GiTrack
 *                 board_id:
 *                   type: integer
 *                   description: ID of the board to which the repository has been connected
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
 *                 id:
 *                   type: integer
 *                   description: ID of the repository to be connected to the board
 *                   example: 344388797
 *                 full_name:
 *                   type: string
 *                   description: Full name of the repository to be connected to the board
 *                   example: CMSC-129A-Projects/GiTrack
 *                 board_id:
 *                   type: integer
 *                   description: ID of the board to which the repository has been connected
 *                   example: 1
 *                 error_message:
 *                   type: string
 *                   description: Specific error message causing the error
 *                   example: MISSING_TITLE
 *       403:
 *         description: User lacking permissions to perform current action
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID of the repository to be connected to the board
 *                   example: 344388797
 *                 full_name:
 *                   type: string
 *                   description: Full name of the repository to be connected to the board
 *                   example: CMSC-129A-Projects/GiTrack
 *                 board_id:
 *                   type: integer
 *                   description: ID of the board to which the repository has been connected
 *                   example: 1
 *                 error_message:
 *                   type: string
 *                   description: Specific error message causing the error
 *                   example: MISSING_TITLE
 */

router.post('/:id(\\d+)/connect', authJWT, async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user;
  const { id: repoId, full_name: fullName, url } = req.body;

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

  let authToken = '';
  try {
    authToken = await getGithubToken(userId);
  } catch (err) {
    return res.status(403).json({
      id: null,
      full_name: null,
      board_id: null,
      error_message: err,
    });
  }

  try {
    await connectRepository(repoId, fullName, url, id);

    const rep = fullName.split('/');

    debug(authToken);

    const { data, status } = await request('POST /repos/{owner}/{repo}/hooks', {
      headers: {
        authorization: `token ${authToken}`,
      },
      owner: rep[0],
      repo: rep[1],
      config: {
        content_type: 'json',
        url:
          process.env.NODE_ENV === 'PROD'
            ? 'https://api.gitrack.codes/github/payload'
            : `${process.env.NGROK_URL}/github/payload`,
        secret: GH_SHA_SECRET,
      },
      events: ['pull_request'],
    });

    if (status !== 201 || (data && data.error)) {
      throw data;
    }

    return res.json({
      id: repoId,
      full_name: fullName,
      board_id: id,
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

/**
 * @swagger
 *  /board/{id}/tasks:
 *   get:
 *     summary: Get all tasks of a board.
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
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tasks:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: ID of the task
 *                         example: 1
 *                       title:
 *                         type: string
 *                         description: Title of the Task
 *                         example: Login
 *                       description:
 *                         type: string
 *                         description: Description of the Task
 *                         example: User can Login
 *                       branch_name:
 *                         type: string
 *                         description: Branch that the task is connected to
 *                         example: feat/login
 *                       repo_id:
 *                         type: number
 *                         description: ID of the Repository that the task is connected
 *                         example: 372441494
 *                       board_id:
 *                         type: integer
 *                         description: Id of the board where the task is
 *                         example: 1
 *                       column_id:
 *                         type: number
 *                         description: ID of the column that the task is in
 *                         example: 2
 *                       assignee_ids:
 *                         type: string
 *                         description: IDs of the developers assigned to the task, separated by commas
 *                         example: 2, 3, 5
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
 *                 tasks:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: ID of the task
 *                         example: 1
 *                       title:
 *                         type: string
 *                         description: Title of the Task
 *                         example: Login
 *                       description:
 *                         type: string
 *                         description: Description of the Task
 *                         example: User can Login
 *                       branch_name:
 *                         type: string
 *                         description: Branch that the task is connected to
 *                         example: feat/login
 *                       repo_id:
 *                         type: number
 *                         description: ID of the Repository that the task is connected
 *                         example: 372441494
 *                       board_id:
 *                         type: integer
 *                         description: Id of the board where the task is
 *                         example: 1
 *                       column_id:
 *                         type: number
 *                         description: ID of the column that the task is in
 *                         example: 2
 *                       assignee_ids:
 *                         type: string
 *                         description: IDs of the developers assigned to the task, separated by commas
 *                         example: 2, 3, 5
 *                 error_message:
 *                   type: string
 *                   description: Specific error message causing the error
 *                   example: MISSING_TITLE
 */
router.get('/:id(\\d+)/tasks', authJWT, async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user;

  if (id === undefined) {
    return res.status(400).json({
      tasks: null,
      error_message: boardErrorMessages.MISSING_ID,
    });
  }

  try {
    await getPermissions(userId, id);
  } catch (err) {
    debug(err);
    return res.status(403).json({
      tasks: null,
      error_message: err,
    });
  }

  try {
    const tasks = await getTasksInBoard(id);

    return res.json({
      tasks,
      error_message: null,
    });
  } catch (err) {
    debug(err);
    return res.status(500).json({ tasks: null, error_message: err });
  }
});

/**
 * @swagger
 *  /board/{id}/repos:
 *   get:
 *     summary: Get all repos of a board.
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
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 repos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: ID of the repository
 *                         example: 1
 *                       full_name:
 *                         type: string
 *                         description: Full name of the repository
 *                         example: ohhskar/jollibee-delivery
 *                       url:
 *                         type: string
 *                         description: URL of the repo
 *                         example: https://api.github.com/repos/ohhskar/jollibee-delivery
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
 *                 repos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: ID of the repository
 *                         example: 1
 *                       full_name:
 *                         type: string
 *                         description: Full name of the repository
 *                         example: ohhskar/jollibee-delivery
 *                       url:
 *                         type: string
 *                         description: URL of the repo
 *                         example: https://api.github.com/repos/ohhskar/jollibee-delivery
 *                 error_message:
 *                   type: string
 *                   description: Specific error message causing the error
 *                   example: MISSING_TITLE
 */
router.get('/:id(\\d+)/repos', authJWT, async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user;

  if (id === undefined) {
    return res.status(400).json({
      repos: null,
      error_message: boardErrorMessages.MISSING_ID,
    });
  }

  try {
    await getPermissions(userId, id);
  } catch (err) {
    debug(err);
    return res.status(403).json({
      repos: null,
      error_message: err,
    });
  }

  try {
    const repos = await getRepositoriesInBoard(id);

    return res.json({
      repos: repos === undefined ? null : repos,
      error_message: null,
    });
  } catch (err) {
    debug(err);
    return res.status(500).json({ repos: null, error_message: err });
  }
});

/**
 * @swagger
 *  /board/{id}/add-developer:
 *   post:
 *     summary: Add developers to a board.
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               developer_ids:
 *                 type: array
 *                 description: IDs of the users to be added to the board
 *                 items:
 *                   type: integer
 *                   example: [1, 2, 3, 4, 5]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 board_id:
 *                   type: string
 *                   description: ID of the board where the developers have been added
 *                   example: 1
 *                 dev_id:
 *                   type: string
 *                   description: IDs of the developers added to the board, separated by commas
 *                   example: 2, 3, 4
 *                 duplicate_devs:
 *                   type: string
 *                   description: IDs of the developers not added to the board, separated by commas
 *                   example: 1, 5, 8
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
 *                 board_id:
 *                   type: string
 *                   description: ID of the board where the developers have been added
 *                   example: 1
 *                 dev_id:
 *                   type: string
 *                   description: IDs of the developers added to the board, separated by commas
 *                   example: 2, 3, 4
 *                 duplicate_devs:
 *                   type: string
 *                   description: IDs of the developers not added to the board, separated by commas
 *                   example: 1, 5, 8
 *                 error_message:
 *                   type: string
 *                   description: Specific error message causing the error
 *                   example: MISSING_TITLE
 *       403:
 *         description: User lacking permissions to perform current action
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 board_id:
 *                   type: string
 *                   description: ID of the board where the developers have been added
 *                   example: 1
 *                 dev_id:
 *                   type: string
 *                   description: IDs of the developers added to the board, separated by commas
 *                   example: 2, 3, 4
 *                 duplicate_devs:
 *                   type: string
 *                   description: IDs of the developers not added to the board, separated by commas
 *                   example: 1, 5, 8
 *                 error_message:
 *                   type: string
 *                   description: Specific error message causing the error
 *                   example: MISSING_TITLE
 */
router.post('/:id(\\d+)/add-developer', authJWT, async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user;
  const { developer_ids: devIds } = req.body;
  const devsToAdd = [];

  if (id === undefined) {
    return res.status(400).json({
      board_id: null,
      dev_id: null,
      duplicate_devs: null,
      error_message: boardErrorMessages.MISSING_ID,
    });
  }

  try {
    await getPermissions(userId, id);
  } catch (err) {
    debug(err);
    return res
      .status(403)
      .json({ board_id: null, dev_id: null, duplicate_devs: null, error_message: err });
  }

  for (let i = 0; i < devIds.length; i += 1) {
    if ((await isUserInBoard(id, devIds[i])) === undefined) {
      devsToAdd.push(devIds[i]);
    }
  }
  try {
    await addDevToBoard(id, devsToAdd);

    return res.json({
      board_id: id,
      dev_id: devsToAdd.toString(),
      duplicate_devs: devIds.filter((el) => !devsToAdd.includes(el)).toString(),
      error_message: null,
    });
  } catch (err) {
    debug(err);
    return res.status(500).json({
      board_id: null,
      dev_id: null,
      duplicate_devs: null,
      error_message: err,
    });
  }
});

/**
 * @swagger
 *  /board/{id}/members:
 *   get:
 *     summary: List the members of a board.
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
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 board_id:
 *                   type: string
 *                   description: ID of the board where the developers have been added
 *                   example: 1
 *                 members:
 *                   type: array
 *                   description: IDs of the developers added to the board, separated by commas
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: ID of the user who is a member of the board
 *                         example: 1
 *                       username:
 *                         type: string
 *                         description: Username of the user who is a member of the board
 *                         example: peepeepoopoo
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
 *                 board_id:
 *                   type: string
 *                   description: ID of the board where the developers have been added
 *                   example: 1
 *                 members:
 *                   type: array
 *                   description: IDs of the developers added to the board, separated by commas
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: ID of the user who is a member of the board
 *                         example: 1
 *                       username:
 *                         type: string
 *                         description: Username of the user who is a member of the board
 *                         example: peepeepoopoo
 *                 error_message:
 *                   type: string
 *                   description: Specific error message causing the error
 *                   example: MISSING_TITLE
 */
router.get('/:id(\\d+)/members', authJWT, async (req, res) => {
  const { id } = req.params;

  if (id === undefined) {
    return res.status(400).json({
      board_id: null,
      members: null,
      error_message: boardErrorMessages.MISSING_ID,
    });
  }

  if ((await getBoardById(id)) === undefined) {
    return res.status(400).json({
      board_id: null,
      members: null,
      error_message: boardErrorMessages.NOT_FOUND,
    });
  }

  try {
    const mem = await getMembersInBoard(id);

    return res.json({ board_id: id, members: mem, error_message: null });
  } catch (err) {
    debug(err);
    return res.status(400).json({ board_id: null, members: null, error_message: err });
  }
});

/**
 * @swagger
 *  /board/{id}/remove-members:
 *   delete:
 *     summary: Remove developers from a board.
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               member_ids:
 *                 type: array
 *                 description: IDs of the users to be removed from the board
 *                 items:
 *                   type: integer
 *                   example: [1, 2, 3, 4, 5]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 board_id:
 *                   type: string
 *                   description: ID of the board where the developers have been added
 *                   example: 1
 *                 members_removed:
 *                   type: string
 *                   description: IDs of the developers removed from the board, separated by commas
 *                   example: 2, 3, 4
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
 *                 board_id:
 *                   type: string
 *                   description: ID of the board where the developers have been added
 *                   example: 1
 *                 members_removed:
 *                   type: string
 *                   description: IDs of the developers removed from the board, separated by commas
 *                   example: 2, 3, 4
 *                 error_message:
 *                   type: string
 *                   description: Specific error message causing the error
 *                   example: MISSING_TITLE
 *       403:
 *         description: User lacking permissions to perform current action
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 board_id:
 *                   type: string
 *                   description: ID of the board where the developers have been added
 *                   example: 1
 *                 members_removed:
 *                   type: string
 *                   description: IDs of the developers removed from the board, separated by commas
 *                   example: 2, 3, 4
 *                 error_message:
 *                   type: string
 *                   description: Specific error message causing the error
 *                   example: MISSING_TITLE
 */
router.delete('/:id(\\d+)/remove-members', authJWT, async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user;
  const { member_ids: memberId } = req.body;

  if (id === undefined || memberId === undefined) {
    return res.status(400).json({
      board_id: null,
      members_removed: null,
      error_message: boardErrorMessages.MISSING_ID,
    });
  }

  try {
    await getPermissions(userId, id);
  } catch (err) {
    debug(err);
    return res
      .status(403)
      .json({ board_id: null, members_removed: null, error_message: err });
  }

  try {
    await removeMembers(id, memberId);
    return res.json({
      board_id: id,
      members_removed: memberId.toString(),
      error_message: null,
    });
  } catch (err) {
    debug(err);
    return res
      .status(400)
      .json({ board_id: null, members_removed: null, error_message: err });
  }
});

/**
 * @swagger
 *  /board/{id}/remove-repository:
 *   delete:
 *     summary: Remove developers from a board.
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               repo_id:
 *                 type: number
 *                 description: ID of the repository
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
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
 *                 error_message:
 *                   type: string
 *                   description: Specific error message causing the error
 *                   example: MISSING_TITLE
 *       403:
 *         description: User lacking permissions to perform current action
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error_message:
 *                   type: string
 *                   description: Specific error message causing the error
 *                   example: MISSING_TITLE
 */
router.delete('/:id(\\d+)/remove-repository', authJWT, async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user;
  const { repo_id: repoId } = req.body;

  if (id === undefined) {
    return res.status(400).json({ error_message: boardErrorMessages.MISSING_ID });
  }

  try {
    await getPermissions(userId, id);
  } catch (err) {
    debug(err);
    return res.status(403).json({ error_message: err });
  }

  try {
    await removeRepositoryfromBoard(id, repoId);

    return res.json({ error_message: null });
  } catch (err) {
    debug(err);
    return res.status(500).json({ error_message: err });
  }
});

module.exports = router;
