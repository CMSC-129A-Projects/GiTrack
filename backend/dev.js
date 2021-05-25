#!/usr/bin/env node
/* eslint-disable no-console */

const ngrok = require('ngrok');
/* eslint-disable-next-line */
const nodemon = require('nodemon');
const debug = require('debug')('backend:dev');

const { NGROK_AUTH_TOKEN } = require('./constants/keys');

async function open() {
  let url = '';
  try {
    url = await ngrok.connect({ authToken: NGROK_AUTH_TOKEN, addr: 3000 });
    debug(`Ngrok tunnel opened at ${url}`);
    debug('Open the ngrok dashboard at: https://localhost:4040');

    nodemon({
      script: './app.js',
      exec: `env NGROK_URL=${url} node`,
    })
      .on('start', () => {
        debug('The application has started');
      })
      .on('restart', (files) => {
        debug('Application restarted due to:');
        files.forEach((file) => debug(file));
      })
      .on('quit', () => {
        debug('The application has quit, closing ngrok tunnel');
        ngrok.kill().then(() => process.exit(0));
      });

    return url;
  } catch (err) {
    debug('Error connecting to ngrok');
    debug(err);
    return process.exit(1);
  }
}

function checkEnv() {
  if (process.env.NODE_ENV === 'PROD') {
    console.error('This should only be run on dev environments');
    return process.exit(1);
  }

  return 0;
}

checkEnv();
open();
