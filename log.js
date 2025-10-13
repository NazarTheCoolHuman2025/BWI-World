// log.js
const fs = require('fs-extra');
const path = require('path');
const winston = require('winston');

// Config path
const setup = ("./config/settings.json");

// Ensure logs directory exists
const logDir = path.join(__dirname, 'logs');
fs.ensureDirSync(logDir);

// ---------------- Winston Setup ----------------
const { combine, timestamp, printf, colorize } = winston.format;
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

const logger = winston.createLogger({
  level: 'info',
  format: combine(colorize(), timestamp(), logFormat),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: path.join(logDir, 'errors.log'), level: 'error' }),
    new winston.transports.File({ filename: path.join(logDir, 'warnings.log'), level: 'warn' }),
    new winston.transports.File({ filename: path.join(logDir, 'combined.log') })
  ],
  exitOnError: false
});

// ---------------- Read settings.json ----------------
let settings = {};
try {
  settings = fs.readJsonSync(setup);
  logger.info(`Successfully read settings.json from ${setup}`);
} catch (err) {
  logger.error(`Failed to read settings.json from ${setup}: ${err.message}`);
}

// ---------------- Process crash handling ----------------
process.on('uncaughtException', (err) => {
  logger.error(`Server crashed: ${err.message}\n${err.stack}`);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.error(`Unhandled Promise Rejection: ${reason}`);
});

// Export logger, setup path, and settings
module.exports = { logger, setup, settings };
