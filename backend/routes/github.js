const axios = require('axios');
const crypto = require('crypto');
const express = require('express');
const debug = require('debug')('backend:routes-github');
const { request } = require('@octokit/request');

const router = express.Router();

// Models
const { addGithubToken, getGithubToken } = require('../models/users');

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

    debug(data.access_token);

    try {
      await addGithubToken(id, data.access_token);
    } catch (err) {
      debug(err);
      return res.status(503).json({ error_message: err });
    }

    return res.json({ error_message: null });
  } catch (err) {
    debug(err);
    return res.status(503).json({ error_message: JSON.stringify(err) });
  }
});

router.get('/repo', authJWT, async (req, res) => {
  const { id: userId } = req.user;

  let authToken = null;

  try {
    authToken = await getGithubToken(userId);
  } catch (err) {
    return res.status(403).json({ repos: null, error_message: err });
  }

  try {
    const { data, status } = await request('GET /user/repos', {
      headers: {
        authorization: `token ${authToken}`,
      },
      visibility: 'all',
    });

    if (status !== 200) {
      throw JSON.stringify({ status, data });
    }

    const repos = data.map((curr) => ({
      id: curr.id,
      full_name: curr.full_name,
      url: curr.url,
    }));

    return res.json({ repos, error_message: null });
  } catch (err) {
    debug(err);
    return res.status(503).json({ repos: null, error_message: JSON.stringify(err) });
  }
});

module.exports = router;
