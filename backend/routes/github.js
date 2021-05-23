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
const { getBoardRepo } = require('../models/boards');

// Middlewares
const { authJWT } = require('../middlewares/auth');

// Constants
const { github: githubErrorMessages } = require('../constants/error-messages');

// Secrets
const { GH_API_CLIENT_ID, GH_API_SECRET } = process.env;

let states = [];

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

    if (status !== 200) {
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
    fullName = await getBoardRepo(id);
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
module.exports = router;
