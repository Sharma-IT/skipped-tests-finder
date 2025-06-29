const { test, describe } = require('node:test');
const assert = require('node:assert');
const { displayResults, displayHelp, colorize, colors } = require('../src/output/console');

describe('Console Output Formatting', () => {
  test('should colorize text correctly', () => {
    const colorizedText = colorize('test', colors.red);
    assert(colorizedText.includes('\x1b[31m'), 'Should include red color code');
    assert(colorizedText.includes('test'), 'Should include the original text');
    assert(colorizedText.includes('\x1b[0m'), 'Should include reset color code');
  });

  test('should handle empty skipped tests array', () => {
    // This should not throw an error
    assert.doesNotThrow(() => {
      displayResults([]);
    });
  });

  test('should handle skipped tests with various test names', () => {
    const mockTests = [
      { testName: 'Test with normal name', filePath: 'test.js', lineNumber: 1 },
      { testName: undefined, filePath: 'test.py', lineNumber: 2 },
      { testName: '', filePath: 'test.rb', lineNumber: 3 }
    ];

    // This should not throw an error
    assert.doesNotThrow(() => {
      displayResults(mockTests);
    });
  });

  test('should handle help display without errors', () => {
    // This should not throw an error
    assert.doesNotThrow(() => {
      displayHelp();
    });
  });
});
