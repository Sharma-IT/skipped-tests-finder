/**
 * Utility functions for the skipped tests finder
 */

/**
 * Strips ANSI escape codes from a given string.
 *
 * @param {string} str - The input string containing ANSI escape codes.
 * @return {string} The string with ANSI escape codes removed.
 */
function stripANSI(str) {
  const pattern = [
    '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
    '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))',
  ].join('|');

  const ansiPattern = new RegExp(pattern, 'g');
  return str.replace(ansiPattern, '');
}

/**
 * Validates if a directory path exists and is accessible
 *
 * @param {string} dirPath - The directory path to validate
 * @returns {boolean} True if the directory exists and is accessible
 */
function validateDirectory(dirPath) {
  const fs = require('fs');
  try {
    fs.statSync(dirPath);
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Validates if a directory is writable
 *
 * @param {string} dirPath - The directory path to check
 * @returns {boolean} True if the directory is writable
 */
function isDirectoryWritable(dirPath) {
  const fs = require('fs');
  try {
    fs.accessSync(dirPath, fs.constants.W_OK);
    return true;
  } catch (err) {
    return false;
  }
}

module.exports = {
  stripANSI,
  validateDirectory,
  isDirectoryWritable
};
