const axios = require('axios');
const crypto = require('crypto');
const express = require('express');
const debug = require('debug')('backend:routes-github');
const { request } = require('@octokit/request');

const router = express.Router();

// Models
const {
  addGithubToken,
  getGithubToken,
  removeGithubToken,
} = require('../models/users');

const { moveTaskByBranchAndRepo } = require('../models/tasks');

const { getRepository } = require('../models/repositories');

// Middlewares
const { authJWT } = require('../middlewares/auth');
const { verifyPostData } = require('../middlewares/github');

// Constants
const { github: githubErrorMessages } = require('../constants/error-messages');

// Secrets
const { GH_API_CLIENT_ID, GH_API_SECRET } = require('../constants/keys');

let states = [];

/**
 * @swagger
 * tags:
 *  name: Github
 *  description: Perform operations relating to Github
 */

/**
 * @swagger
 * /github/link:
 *   get:
 *     summary: Get link for github authentication.
 *     tags: [Github]
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
 *                 url:
 *                   type: string
 *                   description: URL for oauth authorization
 *                   example: https://github.com/login/oauth/authorize?scope=repo%20write:repo_hook&client_id=afcb6a7747d3e1abef5a&state=eyJybmQiOiJhMmFkNWYxMjcwYTlhNDY3YjU4OTc2YTk0MmE2YmM4OCIsImlkIjoyfQ==
 *                 error_message:
 *                   type: string
 *                   nullable: true
 *                   description: Specific error message causing the error
 *                   example: MISSING_TITLE
 */
router.get('/link', authJWT, (req, res) => {
  const scope = ['repo', 'write:repo_hook'];

  const state = Buffer.from(
    JSON.stringify({
      rnd: crypto.randomBytes(16).toString('hex'),
      id: req.user.id,
    }),
    'utf-8'
  ).toString('base64');
  states.push(state);

  return res.json({
    url: `https://github.com/login/oauth/authorize?scope=${scope.join(
      '%20'
    )}&client_id=${GH_API_CLIENT_ID}&state=${state}`,
    error_message: null,
  });
});

/**
 * @swagger
 * /github/link/callback:
 *   get:
 *     summary: Handle github callback after user has granted access.
 *     tags: [Github]
 *     security:
 *       - JWTBearerAuth: []
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         required: true
 *         description: Code value as required by Github auth token
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *         required: true
 *         description: State value as required by Github auth token
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
 *                   nullable: true
 *                   description: Specific error message causing the error
 *                   example: MISSING_TITLE
 *       400:
 *         description: Error parsing query
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error_message:
 *                   type: string
 *                   nullable: true
 *                   description: Specific error message causing the error
 *                   example: MISSING_TITLE
 *       403:
 *         description: Forbidden. Error in state
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error_message:
 *                   type: string
 *                   nullable: true
 *                   description: Specific error message causing the error
 *                   example: MISSING_TITLE
 */
router.get('/link/callback', async (req, res) => {
  const { code, state } = req.query;

  if (code === undefined) {
    return res.status(400).json({ error_message: githubErrorMessages.MISSING_CODE });
  }

  if (state === undefined) {
    return res.status(400).json({ error_message: githubErrorMessages.MISSING_STATE });
  }

  if (!states.includes(state)) {
    return res.status(403).json({ error_message: githubErrorMessages.STATE_MISMATCH });
  }

  try {
    const { status, data } = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: GH_API_CLIENT_ID,
        client_secret: GH_API_SECRET,
        code,
        state,
      },
      {
        headers: {
          Accept: 'application/json',
        },
      }
    );

    if (status !== 200 || (data && data.error)) {
      throw data;
    }

    states = states.filter((currState) => currState !== state);

    const { id } = JSON.parse(Buffer.from(state, 'base64').toString('utf-8'));

    try {
      await addGithubToken(id, data.access_token);
    } catch (err) {
      debug(err);
      return res.status(500).json({ error_message: err });
    }

    return res.json({ error_message: null });
  } catch (err) {
    debug(err);
    return res.status(500).json({ error_message: JSON.stringify(err) });
  }
});

/**
 * @swagger
 * /github/repos:
 *   get:
 *     summary: Get all repos of user
 *     tags: [Github]
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
 *                 repos:
 *                   type: array
 *                   description: Repositories that the user has access
 *                   nullable: true
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                         description: Repository ID
 *                         example: 344388465
 *                       full_name:
 *                         type: string
 *                         description: Full name of the repository
 *                         example: 'CMSC-129A-Projects/Ayo'
 *                       url:
 *                         type: string
 *                         description: API URI
 *                         example: 'https://api.github.com/repos/CMSC-129A-Projects/Ayo'
 *                 error_message:
 *                   type: string
 *                   nullable: true
 *                   description: Specific error message causing the error
 *                   example: MISSING_TITLE
 *       400:
 *         description: Error parsing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 repos:
 *                   type: array
 *                   description: Repositories that the user has access
 *                   nullable: true
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                         description: Repository ID
 *                         example: 344388465
 *                       full_name:
 *                         type: string
 *                         description: Full name of the repository
 *                         example: 'CMSC-129A-Projects/Ayo'
 *                       url:
 *                         type: string
 *                         description: API URI
 *                         example: 'https://api.github.com/repos/CMSC-129A-Projects/Ayo'
 *                 error_message:
 *                   type: string
 *                   nullable: true
 *                   description: Specific error message causing the error
 *                   example: MISSING_TITLE
 *       403:
 *         description: Forbidden. Error in state
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 repos:
 *                   type: array
 *                   description: Repositories that the user has access
 *                   nullable: true
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                         description: Repository ID
 *                         example: 344388465
 *                       full_name:
 *                         type: string
 *                         description: Full name of the repository
 *                         example: 'CMSC-129A-Projects/Ayo'
 *                       url:
 *                         type: string
 *                         description: API URI
 *                         example: 'https://api.github.com/repos/CMSC-129A-Projects/Ayo'
 *                 error_message:
 *                   type: string
 *                   nullable: true
 *                   description: Specific error message causing the error
 *                   example: MISSING_TITLE
 */
router.get('/repos', authJWT, async (req, res) => {
  const { id: userId } = req.user;

  let authToken = null;

  try {
    authToken = await getGithubToken(userId);
  } catch (err) {
    return res.status(403).json({ repos: null, error_message: err });
  }

  try {
    const { data } = await request('GET /user/repos', {
      headers: {
        authorization: `token ${authToken}`,
      },
      visibility: 'all',
    });

    const repos = data.map((curr) => ({
      id: curr.id,
      full_name: curr.full_name,
      url: curr.url,
    }));

    return res.json({ repos, error_message: null });
  } catch (err) {
    if (err.status === 401) {
      await removeGithubToken(userId);

      return res.status(403).json({
        repos: null,
        error_message: githubErrorMessages.NOT_GITHUB_AUTHENTICATED,
      });
    }

    return res.status(500).json({ repos: null, error_message: JSON.stringify(err) });
  }
});

/**
 * @swagger
 * /github/token-status:
 *   get:
 *     summary: Check if the user is already authenticated with github
 *     tags: [Github]
 *     security:
 *       - JWTBearerAuth: []
 *     responses:
 *       200:
 *         description:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 properties:
 *                   github_authenticated:
 *                     type: boolean
 *                     description: Status of github authentication
 *                 error_message:
 *                   type: string
 *                   nullable: true
 *                   description: Specific error message causing the error
 *                   example: MISSING_TITLE
 *       400:
 *         description: Error parsing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 properties:
 *                   github_authenticated:
 *                     type: boolean
 *                     description: Status of github authentication
 *                 error_message:
 *                   type: string
 *                   nullable: true
 *                   description: Specific error message causing the error
 *                   example: MISSING_TITLE
 */
router.get('/token-status', authJWT, async (req, res) => {
  const { id: userId } = req.user;

  try {
    await getGithubToken(userId);

    return res.json({ github_authenticated: true, error_message: null });
  } catch (err) {
    return res.json({ github_authenticated: false, error_message: err });
  }
});

router.get('/:id(\\d+)/branches', authJWT, async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user;

  let authToken = null;
  let fullName = null;
  let rep = null;

  if (id === undefined) {
    return res.status(400).json({
      id: null,
      title: null,
      error_message: githubErrorMessages.MISSING_REPO_ID,
    });
  }

  try {
    authToken = await getGithubToken(userId);
  } catch (err) {
    return res.status(403).json({ branches: null, error_message: err });
  }

  try {
    fullName = await getRepository(id);
  } catch (err) {
    return res.status(400).json({ branches: null, error_message: err });
  }

  rep = fullName.split('/');

  try {
    const { data } = await request('GET /repos/{owner}/{repo}/branches', {
      headers: {
        authorization: `token ${authToken}`,
      },
      owner: rep[0],
      repo: rep[1],
    });

    const branches = data.map((curr) => ({
      repo_id: id,
      name: curr.name,
    }));

    return res.json({ branches, error_message: null });
  } catch (err) {
    if (err.status === 401) {
      await removeGithubToken(userId);

      return res.status(403).json({
        repos: null,
        error_message: githubErrorMessages.NOT_GITHUB_AUTHENTICATED,
      });
    }

    return res.status(500).json({ repos: null, error_message: JSON.stringify(err) });
  }
});

router.get('/:id(\\d+)/commits', authJWT, async (req, res) => {
  const { id } = req.params;
  const { branch_name: branchName } = req.query;
  const { id: userId } = req.user;

  let authToken = null;
  let fullName = null;
  let rep = null;

  if (id === undefined) {
    return res.status(400).json({
      id: null,
      title: null,
      error_message: githubErrorMessages.MISSING_REPO_ID,
    });
  }

  if (branchName === undefined) {
    return res.status(400).json({
      id: null,
      title: null,
      error_message: githubErrorMessages.MISSING_BRANCH_NAME,
    });
  }

  try {
    authToken = await getGithubToken(userId);
  } catch (err) {
    return res.status(403).json({ branches: null, error_message: err });
  }

  try {
    fullName = await getRepository(id);
  } catch (err) {
    return res.status(400).json({ branches: null, error_message: err });
  }

  rep = fullName.split('/');

  try {
    const { data } = await request('GET /repos/{owner}/{repo}/commits', {
      headers: {
        authorization: `token ${authToken}`,
      },
      owner: rep[0],
      repo: rep[1],
      sha: branchName,
    });

    const commits = data.map((curr) => ({
      hash: curr.sha,
      url: curr.url,
      message: curr.commit.message,
    }));

    return res.json({ commits, error_message: null });
  } catch (err) {
    if (err.status === 401) {
      await removeGithubToken(userId);

      return res.status(403).json({
        repos: null,
        error_message: githubErrorMessages.NOT_GITHUB_AUTHENTICATED,
      });
    }

    return res.status(500).json({ repos: null, error_message: JSON.stringify(err) });
  }
});

router.post('/payload', verifyPostData, async (req, res) => {
  const type = req.header('X-GitHub-Event');

  if (type !== 'pull_request') {
    return res.json({
      error_message: 'NOT_NEEDED',
    });
  }

  const {
    action,
    pull_request: {
      head: { ref: branchName },
      merged,
    },
    repository: { id: repoId },
  } = req.body;

  if (action === 'closed' && merged) {
    const ret = await moveTaskByBranchAndRepo(branchName, repoId, 2);
    return res.json(ret);
  }

  return res.json({
    error_message: 'NOT_NEEDED',
  });
});

module.exports = router;
