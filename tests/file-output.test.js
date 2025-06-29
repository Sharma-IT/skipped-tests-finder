const { test, describe } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { 
  writeResultsToFile, 
  validateFormat, 
  generateTextOutput,
  generateJsonOutput,
  generateMarkdownOutput,
  SUPPORTED_FORMATS 
} = require('../src/output/file');

// Sample test data
const sampleSkippedTests = [
  {
    testName: 'should skip this test',
    filePath: '/path/to/test.js',
    lineNumber: 10,
    line: 'it.skip("should skip this test", () => {})',
    reason: 'Test skipped for refactoring'
  },
  {
    testName: 'another skipped test',
    filePath: '/path/to/test.py',
    lineNumber: 25,
    line: '@unittest.skip("reason")\ndef test_skipped(self):',
    reason: 'Not implemented yet'
  },
  {
    testName: 'ruby test',
    filePath: '/path/to/test.rb',
    lineNumber: 5,
    line: 'it "ruby test", skip: true do',
    reason: null
  }
];

const emptySkippedTests = [];

describe('File Output Formats', () => {
  const testOutputDir = path.join(__dirname, 'temp_output');
  
  // Setup: Create temp directory
  test('setup temp directory', () => {
    if (!fs.existsSync(testOutputDir)) {
      fs.mkdirSync(testOutputDir, { recursive: true });
    }
  });

  describe('Format Validation', () => {
    test('should accept valid formats', () => {
      SUPPORTED_FORMATS.forEach(format => {
        assert.doesNotThrow(() => validateFormat(format), `Should accept format: ${format}`);
      });
    });

    test('should reject invalid formats', () => {
      const invalidFormats = ['html', 'csv', 'xml', 'yaml', 'invalid'];
      invalidFormats.forEach(format => {
        assert.throws(() => validateFormat(format), `Should reject format: ${format}`);
      });
    });
  });

  describe('Text Format Output', () => {
    test('should generate correct text format with skipped tests', () => {
      const output = generateTextOutput(sampleSkippedTests);
      
      assert(output.includes('Total skipped tests: 3'), 'Should include total count');
      assert(output.includes('should skip this test'), 'Should include test names');
      assert(output.includes('test.js:10'), 'Should include file and line number');
      assert(output.includes('test.py:25'), 'Should include Python test info');
      assert(output.includes('test.rb:5'), 'Should include Ruby test info');
    });

    test('should handle empty skipped tests array', () => {
      const output = generateTextOutput(emptySkippedTests);
      
      assert(output.includes('Total skipped tests: 0'), 'Should show zero count');
      assert(output.includes('Skipped Tests:'), 'Should include header');
    });

    test('should write text file correctly', () => {
      const outputPath = writeResultsToFile(sampleSkippedTests, testOutputDir, null, 'text');
      
      assert(fs.existsSync(outputPath), 'Output file should exist');
      assert(outputPath.endsWith('.txt'), 'Should have .txt extension');
      
      const content = fs.readFileSync(outputPath, 'utf8');
      assert(content.includes('Total skipped tests: 3'), 'File should contain correct content');
    });
  });

  describe('JSON Format Output', () => {
    test('should generate valid JSON format', () => {
      const output = generateJsonOutput(sampleSkippedTests);
      
      // Should be valid JSON
      let parsed;
      assert.doesNotThrow(() => {
        parsed = JSON.parse(output);
      }, 'Should generate valid JSON');

      // Check structure
      assert.strictEqual(parsed.totalSkippedTests, 3, 'Should have correct total');
      assert.strictEqual(parsed.filesWithSkippedTests, 3, 'Should count files correctly');
      assert(parsed.generatedAt, 'Should include timestamp');
      assert(parsed.summary, 'Should include summary');
      
      // Check summary structure
      const summary = parsed.summary;
      assert(summary['test.js'], 'Should group by filename');
      assert(summary['test.py'], 'Should include Python file');
      assert(summary['test.rb'], 'Should include Ruby file');
      
      // Check test details
      const jsTests = summary['test.js'];
      assert.strictEqual(jsTests.skippedTestsCount, 1, 'Should count JS tests correctly');
      assert.strictEqual(jsTests.tests[0].testName, 'should skip this test', 'Should include test name');
      assert.strictEqual(jsTests.tests[0].lineNumber, 10, 'Should include line number');
      assert.strictEqual(jsTests.tests[0].reason, 'Test skipped for refactoring', 'Should include reason');
    });

    test('should handle empty results in JSON', () => {
      const output = generateJsonOutput(emptySkippedTests);
      const parsed = JSON.parse(output);
      
      assert.strictEqual(parsed.totalSkippedTests, 0, 'Should show zero tests');
      assert.strictEqual(parsed.filesWithSkippedTests, 0, 'Should show zero files');
      assert.deepStrictEqual(parsed.summary, {}, 'Summary should be empty object');
    });

    test('should write JSON file correctly', () => {
      const outputPath = writeResultsToFile(sampleSkippedTests, testOutputDir, null, 'json');
      
      assert(fs.existsSync(outputPath), 'JSON output file should exist');
      assert(outputPath.endsWith('.json'), 'Should have .json extension');
      
      const content = fs.readFileSync(outputPath, 'utf8');
      const parsed = JSON.parse(content);
      assert.strictEqual(parsed.totalSkippedTests, 3, 'JSON file should contain correct data');
    });
  });

  describe('Markdown Format Output', () => {
    test('should generate correct Markdown format', () => {
      const output = generateMarkdownOutput(sampleSkippedTests);
      
      // Check Markdown structure
      assert(output.includes('# Skipped Tests Report'), 'Should have main heading');
      assert(output.includes('## Summary'), 'Should have summary section');
      assert(output.includes('## Summary by File'), 'Should have file summary table');
      assert(output.includes('## Detailed Results'), 'Should have detailed section');
      
      // Check summary stats
      assert(output.includes('**Total Skipped Tests:** 3'), 'Should show total count');
      assert(output.includes('**Files with Skipped Tests:** 3'), 'Should show file count');
      
      // Check table structure
      assert(output.includes('| File | Skipped Tests | Language |'), 'Should have table header');
      assert(output.includes('|------|---------------|----------|'), 'Should have table separator');
      assert(output.includes('| test.js | 1 | JavaScript |'), 'Should include JS file');
      assert(output.includes('| test.py | 1 | Python |'), 'Should include Python file');
      assert(output.includes('| test.rb | 1 | Ruby |'), 'Should include Ruby file');
      
      // Check detailed sections
      assert(output.includes('### test.js'), 'Should have file section');
      assert(output.includes('#### 1. should skip this test'), 'Should have test subsection');
      assert(output.includes('```javascript'), 'Should have code block with language');
      assert(output.includes('**Line:** 10'), 'Should include line number');
      assert(output.includes('**Reason:** Test skipped for refactoring'), 'Should include reason when available');
    });

    test('should handle empty results in Markdown', () => {
      const output = generateMarkdownOutput(emptySkippedTests);
      
      assert(output.includes('# Skipped Tests Report'), 'Should have main heading');
      assert(output.includes('**Total Skipped Tests:** 0'), 'Should show zero count');
      assert(output.includes('**Files with Skipped Tests:** 0'), 'Should show zero files');
    });

    test('should write Markdown file correctly', () => {
      const outputPath = writeResultsToFile(sampleSkippedTests, testOutputDir, null, 'markdown');
      
      assert(fs.existsSync(outputPath), 'Markdown output file should exist');
      assert(outputPath.endsWith('.md'), 'Should have .md extension');
      
      const content = fs.readFileSync(outputPath, 'utf8');
      assert(content.includes('# Skipped Tests Report'), 'Markdown file should contain correct content');
      assert(content.includes('**Total Skipped Tests:** 3'), 'Should include summary');
    });
  });

  describe('Integration Tests', () => {
    test('should use custom output directory', () => {
      const customDir = path.join(testOutputDir, 'custom');
      if (!fs.existsSync(customDir)) {
        fs.mkdirSync(customDir, { recursive: true });
      }
      
      const formats = ['text', 'json', 'markdown'];
      formats.forEach(format => {
        const outputPath = writeResultsToFile(sampleSkippedTests, testOutputDir, customDir, format);
        assert(outputPath.startsWith(customDir), `Should use custom directory for ${format}`);
        assert(fs.existsSync(outputPath), `File should exist for ${format}`);
      });
    });

    test('should handle different file extensions correctly', () => {
      const formats = [
        { format: 'text', extension: '.txt' },
        { format: 'json', extension: '.json' },
        { format: 'markdown', extension: '.md' }
      ];
      
      formats.forEach(({ format, extension }) => {
        const outputPath = writeResultsToFile(sampleSkippedTests, testOutputDir, null, format);
        assert(outputPath.endsWith(extension), `Should use correct extension for ${format}`);
      });
    });

    test('should handle complex test data', () => {
      const complexTests = [
        {
          testName: 'test with "quotes" and special chars',
          filePath: '/complex/path/test-file.spec.js',
          lineNumber: 42,
          line: 'it.skip("test with \\"quotes\\" and special chars", () => {})',
          reason: 'Reason with "quotes" and \n newlines'
        }
      ];

      // Test all formats with complex data
      const textOutput = generateTextOutput(complexTests);
      assert(textOutput.includes('test with "quotes"'), 'Text should handle quotes');

      const jsonOutput = generateJsonOutput(complexTests);
      const parsed = JSON.parse(jsonOutput);
      assert(parsed.summary['test-file.spec.js'], 'JSON should handle complex filenames');

      const markdownOutput = generateMarkdownOutput(complexTests);
      assert(markdownOutput.includes('test with "quotes"'), 'Markdown should handle quotes');
    });
  });

  // Cleanup: Remove temp directory
  test('cleanup temp directory', () => {
    if (fs.existsSync(testOutputDir)) {
      fs.rmSync(testOutputDir, { recursive: true, force: true });
    }
  });
});
