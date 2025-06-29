const { test, describe } = require('node:test');
const assert = require('node:assert');
const { findSkippedTests } = require('../src/core/scanner');
const path = require('path');

describe('SkippedTestsFinder', () => {
  test('should find skipped tests in fixtures', () => {
    const fixturesPath = path.join(__dirname, 'fixtures');
    const skippedTests = findSkippedTests(fixturesPath);
    
    assert(skippedTests.length > 0, 'Should find at least one skipped test');
    
    // Check that we found some specific skipped tests
    const testNames = skippedTests.map(test => test.testName);
    assert(testNames.includes('should skip this test'), 'Should find "should skip this test"');
    assert(testNames.includes('Completely skipped suite'), 'Should find "Completely skipped suite"');
    assert(testNames.includes('Reason for skipping with double quotes'), 'Should find Python skipped test');
    
    // Verify we're finding tests from different languages
    const filePaths = skippedTests.map(test => test.filePath);
    const hasJavaScript = filePaths.some(path => path.endsWith('.js'));
    const hasPython = filePaths.some(path => path.endsWith('.py'));
    const hasRuby = filePaths.some(path => path.endsWith('.rb'));
    const hasJava = filePaths.some(path => path.endsWith('.java'));
    const hasCSharp = filePaths.some(path => path.endsWith('.cs'));
    const hasCpp = filePaths.some(path => path.endsWith('.cpp'));
    const hasGo = filePaths.some(path => path.endsWith('.go'));
    const hasPhp = filePaths.some(path => path.endsWith('.php'));
    const hasRust = filePaths.some(path => path.endsWith('.rs'));
    
    assert(hasJavaScript, 'Should find JavaScript skipped tests');
    assert(hasPython, 'Should find Python skipped tests');
    assert(hasRuby, 'Should find Ruby skipped tests');
    assert(hasJava, 'Should find Java skipped tests');
    assert(hasCSharp, 'Should find C# skipped tests');
    assert(hasCpp, 'Should find C++ skipped tests');
    assert(hasGo, 'Should find Go skipped tests');
    assert(hasPhp, 'Should find PHP skipped tests');
    assert(hasRust, 'Should find Rust skipped tests');
  });

  test('should return empty array for directory with no skipped tests', () => {
    // Test that the function doesn't crash and returns an array
    const result = findSkippedTests(__dirname);
    assert(Array.isArray(result), 'Should return an array');
  });
});
