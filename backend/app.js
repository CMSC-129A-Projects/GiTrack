#!/usr/bin/env node
const express = require('express');
const path = require('path');
const http = require('http');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const debug = require('debug')('backend:server');
require('dotenv').config();

// Routers
const authRouter = require('./routes/auth');
const boardsRouter = require('./routes/boards');

const app = express();
const db = require('./db');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routers
app.use('/auth', authRouter);
app.use('/boards', boardsRouter);

// Cleanup Middleware
let isShuttingDown = false;

app.use((_, res, next) => {
  if (!isShuttingDown) {
    next();
  }

  res.setHeader('Connection', 'close');
  res.status(503).json({
    message: 'Server is closing',
  });
});

// Creating Server
function normalizePort(val) {
  const tempPort = parseInt(val, 10);

  if (Number.isNaN(tempPort)) {
    // named pipe
    return val;
  }

  if (tempPort >= 0) {
    // port number
    return tempPort;
  }

  return false;
}

const port = normalizePort(process.env.PORT || '3000');

app.set('port', port);
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);

/**
 * Normalize a port into a number, string, or false.
 */

/**
 * Cleanup connections on exit
 */

function cleanup() {
  isShuttingDown = true;
  server.close(() => {
    debug('Closing remaining connections');
    db.then((_db) => _db.close().then(process.exit()));
  });

  setTimeout(() => {
    debug('Could not close connections in time, forcing shutdown');
    process.exit(1);
  }, 30 * 1000);
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      debug(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      debug(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
}

server.on('error', onError);
server.on('listening', onListening);
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
