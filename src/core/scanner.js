const fs = require('fs');
const path = require('path');
const { COMBINED_SKIP_PATTERN, SUPPORTED_EXTENSIONS } = require('./patterns');

/**
 * Recursively searches a directory and its subdirectories for skipped tests
 *
 * @param {string} dirPath - The path to the directory to search for skipped tests
 * @return {Array<{ testName: string, filePath: string, line: string, lineNumber: number }>} 
 *   Array of objects representing the skipped tests
 */
function findSkippedTests(dirPath) {
  const skippedTests = [];

  const walkSync = (currentPath) => {
    try {
      const files = fs.readdirSync(currentPath);

      files.forEach((file) => {
        const filePath = path.join(currentPath, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
          walkSync(filePath);
        } else if (SUPPORTED_EXTENSIONS.some(ext => file.endsWith(ext))) {
          const fileContent = fs.readFileSync(filePath, 'utf8');
          
          let match;
          while ((match = COMBINED_SKIP_PATTERN.exec(fileContent)) !== null) {
            const testName = match.slice(1).find((m) => m);
            const startIndex = match.index;
            const lineNumber = (fileContent.substring(0, startIndex).match(/\n/g) || []).length + 1;

            skippedTests.push({
              testName,
              filePath,
              line: match[0],
              lineNumber,
            });
          }
        }
      });
    } catch (err) {
      if (err.code === 'ENOENT') {
        throw new Error(`The directory does not exist. Please enter a valid directory path.`);
      } else {
        throw new Error(`An error occurred while accessing the directory: ${err.message}`);
      }
    }
  };

  walkSync(dirPath);
  return skippedTests;
}

module.exports = {
  findSkippedTests
};
