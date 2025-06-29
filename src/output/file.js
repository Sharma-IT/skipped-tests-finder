const fs = require('fs');
const path = require('path');
const { stripANSI } = require('../core/utils');

// Supported output formats
const SUPPORTED_FORMATS = ['text', 'json', 'markdown'];
const FORMAT_EXTENSIONS = {
  text: '.txt',
  json: '.json',
  markdown: '.md'
};

/**
 * Validates the output format
 * @param {string} format - The format to validate
 * @throws {Error} If format is invalid
 */
function validateFormat(format) {
  if (!SUPPORTED_FORMATS.includes(format)) {
    throw new Error(`Invalid format '${format}'. Supported formats: ${SUPPORTED_FORMATS.join(', ')}`);
  }
}

/**
 * Groups skipped tests by file for organized output
 * @param {Array} skippedTests - Array of skipped test objects
 * @returns {Object} Tests grouped by file path
 */
function groupTestsByFile(skippedTests) {
  return skippedTests.reduce((groups, test) => {
    const filePath = test.filePath;
    if (!groups[filePath]) {
      groups[filePath] = [];
    }
    groups[filePath].push(test);
    return groups;
  }, {});
}

/**
 * Generates text format output
 * @param {Array} skippedTests - Array of skipped test objects
 * @returns {string} Formatted text output
 */
function generateTextOutput(skippedTests) {
  let output = `Total skipped tests: ${skippedTests.length}\n\nSkipped Tests:\n\n`;
  const testOutput = skippedTests.map((test) => 
    `- ${test.testName} (${path.basename(test.filePath)}:${test.lineNumber})\n`
  ).join('');
  
  return stripANSI(output + testOutput);
}

/**
 * Generates JSON format output
 * @param {Array} skippedTests - Array of skipped test objects
 * @returns {string} Formatted JSON output
 */
function generateJsonOutput(skippedTests) {
  const groupedTests = groupTestsByFile(skippedTests);
  const summary = {
    totalSkippedTests: skippedTests.length,
    filesWithSkippedTests: Object.keys(groupedTests).length,
    generatedAt: new Date().toISOString(),
    summary: {}
  };

  // Create summary by file
  Object.keys(groupedTests).forEach(filePath => {
    const fileName = path.basename(filePath);
    const tests = groupedTests[filePath];
    summary.summary[fileName] = {
      filePath: filePath,
      skippedTestsCount: tests.length,
      tests: tests.map(test => ({
        testName: test.testName,
        lineNumber: test.lineNumber,
        line: test.line,
        reason: test.reason || null
      }))
    };
  });

  return JSON.stringify(summary, null, 2);
}

/**
 * Generates Markdown format output
 * @param {Array} skippedTests - Array of skipped test objects
 * @returns {string} Formatted Markdown output
 */
function generateMarkdownOutput(skippedTests) {
  const groupedTests = groupTestsByFile(skippedTests);
  const totalFiles = Object.keys(groupedTests).length;
  
  let markdown = `# Skipped Tests Report\n\n`;
  markdown += `**Generated:** ${new Date().toLocaleString()}\n\n`;
  markdown += `## Summary\n\n`;
  markdown += `- **Total Skipped Tests:** ${skippedTests.length}\n`;
  markdown += `- **Files with Skipped Tests:** ${totalFiles}\n\n`;

  // Summary Table
  markdown += `## Summary by File\n\n`;
  markdown += `| File | Skipped Tests | Language |\n`;
  markdown += `|------|---------------|----------|\n`;
  
  Object.keys(groupedTests).forEach(filePath => {
    const fileName = path.basename(filePath);
    const testsCount = groupedTests[filePath].length;
    const extension = path.extname(fileName);
    const language = getLanguageFromExtension(extension);
    markdown += `| ${fileName} | ${testsCount} | ${language} |\n`;
  });

  // Detailed sections
  markdown += `\n## Detailed Results\n\n`;
  
  Object.keys(groupedTests).forEach(filePath => {
    const fileName = path.basename(filePath);
    const tests = groupedTests[filePath];
    const extension = path.extname(fileName);
    const language = getLanguageFromExtension(extension).toLowerCase();
    
    markdown += `### ${fileName}\n\n`;
    markdown += `**File:** \`${filePath}\`\n\n`;
    markdown += `**Skipped Tests:** ${tests.length}\n\n`;
    
    tests.forEach((test, index) => {
      markdown += `#### ${index + 1}. ${test.testName}\n\n`;
      markdown += `- **Line:** ${test.lineNumber}\n`;
      if (test.reason) {
        markdown += `- **Reason:** ${test.reason}\n`;
      }
      markdown += `- **Code:**\n\n`;
      markdown += `\`\`\`${language}\n${test.line.trim()}\n\`\`\`\n\n`;
    });
  });

  return markdown;
}

/**
 * Maps file extensions to language names
 * @param {string} extension - File extension
 * @returns {string} Language name
 */
function getLanguageFromExtension(extension) {
  const languageMap = {
    '.js': 'JavaScript',
    '.ts': 'TypeScript',
    '.py': 'Python',
    '.rb': 'Ruby',
    '.java': 'Java',
    '.cs': 'C#',
    '.cpp': 'C++',
    '.cc': 'C++',
    '.cxx': 'C++',
    '.go': 'Go',
    '.php': 'PHP',
    '.rs': 'Rust',
    '.swift': 'Swift',
    '.kt': 'Kotlin',
    '.scala': 'Scala',
    '.dart': 'Dart',
    '.groovy': 'Groovy',
    '.pl': 'Perl',
    '.ex': 'Elixir',
    '.clj': 'Clojure',
    '.robot': 'Robot Framework'
  };
  return languageMap[extension] || 'Unknown';
}

/**
 * Writes skipped tests results to a file in the specified format
 *
 * @param {Array} skippedTests - Array of skipped test objects
 * @param {string} testsDir - Directory where tests are located
 * @param {string} outputDir - Directory where output file should be written
 * @param {string} format - Output format ('text', 'json', 'markdown')
 * @returns {string} Path to the output file
 */
function writeResultsToFile(skippedTests, testsDir, outputDir = null, format = 'text') {
  validateFormat(format);
  
  const extension = FORMAT_EXTENSIONS[format];
  const fileName = `skipped_tests${extension}`;
  const outputFilePath = outputDir 
    ? path.join(outputDir, fileName)
    : path.join(testsDir, fileName);

  let output;
  switch (format) {
    case 'json':
      output = generateJsonOutput(skippedTests);
      break;
    case 'markdown':
      output = generateMarkdownOutput(skippedTests);
      break;
    case 'text':
    default:
      output = generateTextOutput(skippedTests);
      break;
  }
  
  fs.writeFileSync(outputFilePath, output);
  
  return outputFilePath;
}

module.exports = {
  writeResultsToFile,
  SUPPORTED_FORMATS,
  FORMAT_EXTENSIONS,
  validateFormat,
  generateTextOutput,
  generateJsonOutput,
  generateMarkdownOutput
};
