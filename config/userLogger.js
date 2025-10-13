// userLogger.js
const fs = require('fs-extra');
const path = require('path');
const winston = require('winston');

// Ensure logs directory exists
const logDir = path.join(__dirname, 'logs');
fs.ensureDirSync(logDir);

// Winston setup
const { combine, timestamp, printf, colorize } = winston.format;
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

const userLogger = winston.createLogger({
  level: 'info',
  format: combine(colorize(), timestamp(), logFormat),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: path.join(logDir, 'user.log') })
  ],
  exitOnError: false
});

// Initialize the listener
function init(io) {
  io.on('connection', (socket) => {
    socket.on('chatMessage', ({ username, message }) => {
      userLogger.info(`${username}: ${message}`);
    });
  });
}

module.exports = { init };
