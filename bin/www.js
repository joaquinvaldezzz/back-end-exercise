#!/usr/bin/env node

/** Module dependencies. */
// const http = require('http');
// const debugLib = require('debug');

// const app = require('../app');
import http from 'http';
import debugLib from 'debug';

import app from '../app.js';

const debug = debugLib('back-end-exercise:server');

/**
 * Normalize a port into a number, string, or false.
 *
 * @param {string} val Port value
 * @returns {number | string | boolean} Normalized port value
 */
function normalizePort(val) {
  const port = parseInt(val, 10);

  if (Number.isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/** Get port from environment and store in Express. */
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/** Create HTTP server. */

const server = http.createServer(app);

/**
 * Event listener for HTTP server "error" event.
 *
 * @param {NodeJS.ErrnoException} error Error object
 * @returns {void}
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      // eslint-disable-next-line no-console
      console.error(`${bind} requires elevated privileges`);
      return process.exit(1);
    case 'EADDRINUSE':
      // eslint-disable-next-line no-console
      console.error(`${bind} is already in use`);
      return process.exit(1);
    default:
      throw error;
  }
}

/** Event listener for HTTP server "listening" event. */
function onListening() {
  const address = server.address();
  const bind =
    typeof address === 'string' ? `pipe ${address}` : address != null && `port ${address.port}`;
  debug(`Listening on ${bind}`);
}

/** Listen on provided port, on all network interfaces. */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
