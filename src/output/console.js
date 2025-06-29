/**
 * Console output formatting for skipped tests
 */

// ANSI color codes for enhanced console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  
  // Text colors
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',
  
  // Background colors
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m'
};

/**
 * Helper function to colorize text
 * @param {string} text - Text to colorize
 * @param {string} color - Color code
 * @returns {string} Colorized text
 */
function colorize(text, color) {
  return `${color}${text}${colors.reset}`;
}

/**
 * Creates a visual separator line
 * @param {string} char - Character to use for the line
 * @param {number} length - Length of the line
 * @param {string} color - Color for the line
 * @returns {string} Formatted separator line
 */
function createSeparator(char = '═', length = 60, color = colors.cyan) {
  return colorize(char.repeat(length), color);
}

/**
 * Formats a file path with syntax highlighting
 * @param {string} filePath - The file path
 * @returns {string} Formatted file path
 */
function formatFilePath(filePath) {
  const parts = filePath.split('/');
  const fileName = parts.pop();
  const directory = parts.join('/');
  
  if (directory) {
    return `${colorize(directory + '/', colors.dim)}${colorize(fileName, colors.cyan)}`;
  }
  return colorize(fileName, colors.cyan);
}

/**
 * Formats a test name with appropriate styling
 * @param {string} testName - The test name
 * @returns {string} Formatted test name
 */
function formatTestName(testName) {
  if (!testName || testName === 'undefined') {
    return colorize('(unnamed test)', colors.gray);
  }
  return colorize(testName, colors.white);
}

/**
 * Gets language/framework from file extension
 * @param {string} filePath - The file path
 * @returns {string} Language/framework name
 */
function getLanguageFromPath(filePath) {
  const ext = filePath.split('.').pop().toLowerCase();
  const languageMap = {
    'js': 'JavaScript',
    'ts': 'TypeScript',
    'jsx': 'React',
    'tsx': 'React/TS',
    'py': 'Python',
    'rb': 'Ruby',
    'java': 'Java',
    'cs': 'C#',
    'go': 'Go',
    'cpp': 'C++',
    'cxx': 'C++',
    'cc': 'C++',
    'php': 'PHP',
    'rs': 'Rust',
    'swift': 'Swift',
    'kt': 'Kotlin',
    'scala': 'Scala',
    'groovy': 'Groovy',
    'dart': 'Dart',
    'ex': 'Elixir',
    'clj': 'Clojure',
    'pl': 'Perl',
    'robot': 'Robot'
  };
  return languageMap[ext] || ext.toUpperCase();
}

/**
 * Groups skipped tests by language/framework
 * @param {Array} skippedTests - Array of skipped test objects
 * @returns {Object} Tests grouped by language
 */
function groupTestsByLanguage(skippedTests) {
  const grouped = {};
  
  skippedTests.forEach(test => {
    const language = getLanguageFromPath(test.filePath);
    if (!grouped[language]) {
      grouped[language] = [];
    }
    grouped[language].push(test);
  });
  
  return grouped;
}

/**
 * Formats and displays skipped tests to the console
 *
 * @param {Array} skippedTests - Array of skipped test objects
 */
function displayResults(skippedTests) {
  console.log('\n' + createSeparator('═', 70, colors.cyan));
  console.log(colorize('  SKIPPED TESTS FINDER - SCAN RESULTS', colors.bright + colors.white));
  console.log(createSeparator('═', 70, colors.cyan));
  
  if (skippedTests.length === 0) {
    console.log('\n' + colorize('✅ SUCCESS!', colors.green + colors.bright));
    console.log(colorize('   No skipped tests found in the scanned directory.', colors.green));
    console.log('\n' + createSeparator('─', 70, colors.green));
    return;
  }

  // Display summary header
  console.log('\n' + colorize('⚠️  FOUND SKIPPED TESTS', colors.yellow + colors.bright));
  console.log(colorize(`   Total: ${skippedTests.length} skipped test${skippedTests.length === 1 ? '' : 's'}`, colors.yellow));
  
  // Group tests by language
  const groupedTests = groupTestsByLanguage(skippedTests);
  const languages = Object.keys(groupedTests).sort();
  
  console.log('\n' + colorize('📊 BREAKDOWN BY LANGUAGE:', colors.blue + colors.bright));
  languages.forEach(language => {
    const count = groupedTests[language].length;
    console.log(`   ${colorize('•', colors.blue)} ${colorize(language, colors.white)}: ${colorize(count, colors.yellow)} test${count === 1 ? '' : 's'}`);
  });
  
  console.log('\n' + createSeparator('─', 70, colors.gray));
  console.log(colorize('📋 DETAILED RESULTS:', colors.magenta + colors.bright));
  
  // Display tests grouped by language
  languages.forEach((language, index) => {
    const tests = groupedTests[language];
    
    console.log(`\n   ${colorize(`${language} (${tests.length} test${tests.length === 1 ? '' : 's'})`, colors.bright + colors.white)}`);
    console.log('   ' + colorize('─'.repeat(Math.max(20, language.length + 10)), colors.gray));
    
    tests.forEach((test, testIndex) => {
      const prefix = testIndex === tests.length - 1 ? '└──' : '├──';
      const testName = formatTestName(test.testName);
      const filePath = formatFilePath(test.filePath);
      const lineNumber = colorize(`:${test.lineNumber}`, colors.yellow);
      
      console.log(`   ${colorize(prefix, colors.gray)} ${testName}`);
      console.log(`   ${colorize('    ', colors.gray)} ${colorize('📁', colors.blue)} ${filePath}${lineNumber}`);
    });
  });
  
  // Display summary footer
  console.log('\n' + createSeparator('─', 70, colors.gray));
  console.log(colorize('📈 SUMMARY STATISTICS:', colors.cyan + colors.bright));
  console.log(`   ${colorize('•', colors.cyan)} Total skipped tests: ${colorize(skippedTests.length, colors.bright + colors.yellow)}`);
  console.log(`   ${colorize('•', colors.cyan)} Languages affected: ${colorize(languages.length, colors.bright + colors.yellow)}`);
  console.log(`   ${colorize('•', colors.cyan)} Files with skipped tests: ${colorize(new Set(skippedTests.map(t => t.filePath)).size, colors.bright + colors.yellow)}`);
  
  console.log('\n' + colorize('💡 TIP:', colors.green + colors.bright));
  console.log(colorize('   Review and address these skipped tests before your next release.', colors.green));
  console.log(colorize('   Use -f=text flag to export results to a file for tracking.', colors.green));
  
  console.log('\n' + createSeparator('═', 70, colors.cyan));
}

/**
 * Displays help information
 */
function displayHelp() {
  console.log('\n' + createSeparator('═', 70, colors.cyan));
  console.log(colorize('  SKIPPED TESTS FINDER - HELP', colors.bright + colors.white));
  console.log(createSeparator('═', 70, colors.cyan));
  
  console.log('\n' + colorize('📋 USAGE:', colors.blue + colors.bright));
  console.log(`   ${colorize('skipped-tests-finder', colors.cyan)} ${colorize('[options]', colors.yellow)} ${colorize('-d=<path>', colors.green)}`);
  
  console.log('\n' + colorize('⚙️  OPTIONS:', colors.magenta + colors.bright));
  
  const options = [
    { flag: '-d=<path>', desc: 'Path to the directory to search for skipped tests', required: true },
    { flag: '-f=<format>, --format=<format>', desc: 'Output format: text, json, markdown (default: text)', required: false },
    { flag: '-cli', desc: 'Output results to the console (default behavior)', required: false },
    { flag: '-o=<path>', desc: 'Override the output directory for files (optional)', required: false },
    { flag: '-txt', desc: 'Legacy: same as -f=text (for backward compatibility)', required: false },
    { flag: '-h, --help', desc: 'Display this help message', required: false }
  ];
  
  options.forEach(option => {
    const flag = option.required 
      ? colorize(option.flag, colors.green + colors.bright)
      : colorize(option.flag, colors.yellow);
    const required = option.required 
      ? colorize('(required)', colors.red)
      : colorize('(optional)', colors.gray);
    
    console.log(`   ${flag}`);
    console.log(`   ${colorize('│', colors.gray)} ${option.desc} ${required}`);
    console.log(`   ${colorize('│', colors.gray)}`);
  });
  
  console.log('\n' + colorize('🚀 EXAMPLES:', colors.green + colors.bright));
  console.log(`   ${colorize('# Scan current directory', colors.gray)}`);
  console.log(`   ${colorize('skipped-tests-finder', colors.cyan)} ${colorize('-d=.', colors.green)}`);
  console.log();
  console.log(`   ${colorize('# Scan tests directory and output to console', colors.gray)}`);
  console.log(`   ${colorize('skipped-tests-finder', colors.cyan)} ${colorize('-d=./tests', colors.green)} ${colorize('-cli', colors.yellow)}`);
  console.log();
  console.log(`   ${colorize('# Save results as text file', colors.gray)}`);
  console.log(`   ${colorize('skipped-tests-finder', colors.cyan)} ${colorize('-d=./src', colors.green)} ${colorize('-f=text', colors.yellow)}`);
  console.log();
  console.log(`   ${colorize('# Save results as JSON', colors.gray)}`);
  console.log(`   ${colorize('skipped-tests-finder', colors.cyan)} ${colorize('-d=./tests', colors.green)} ${colorize('-f=json', colors.yellow)}`);
  console.log();
  console.log(`   ${colorize('# Save results as Markdown with custom output directory', colors.gray)}`);
  console.log(`   ${colorize('skipped-tests-finder', colors.cyan)} ${colorize('-d=./tests', colors.green)} ${colorize('-f=markdown', colors.yellow)} ${colorize('-o=./reports', colors.yellow)}`);
  console.log();
  console.log(`   ${colorize('# Legacy format (backward compatibility)', colors.gray)}`);
  console.log(`   ${colorize('skipped-tests-finder', colors.cyan)} ${colorize('-d=./tests', colors.green)} ${colorize('-txt', colors.yellow)} ${colorize('-o=./reports', colors.yellow)}`);
  
  console.log('\n' + colorize('🔍 SUPPORTED LANGUAGES:', colors.blue + colors.bright));
  const languages = [
    'JavaScript/TypeScript', 'Python', 'Ruby', 'Java', 'C#', 'C++', 
    'Go', 'PHP', 'Rust', 'Swift', 'Kotlin', 'Scala', 'Dart', 'Groovy',
    'Perl', 'Elixir', 'Clojure', 'Robot Framework'
  ];
  
  const chunked = [];
  for (let i = 0; i < languages.length; i += 3) {
    chunked.push(languages.slice(i, i + 3));
  }
  
  chunked.forEach(chunk => {
    const formatted = chunk.map(lang => colorize(lang, colors.cyan)).join(colorize(' • ', colors.gray));
    console.log(`   ${formatted}`);
  });
  
  console.log('\n' + colorize('💡 TIP:', colors.yellow + colors.bright));
  console.log(colorize('   For large codebases, scan specific directories (e.g., ./tests, ./src)', colors.yellow));
  console.log(colorize('   to avoid performance issues and get more targeted results.', colors.yellow));
  
  console.log('\n' + createSeparator('═', 70, colors.cyan));
}

/**
 * Displays scanning start message
 * @param {string} directory - Directory being scanned
 */
function displayScanStart(directory) {
  console.log('\n' + createSeparator('═', 70, colors.cyan));
  console.log(colorize('  SKIPPED TESTS FINDER - SCANNING', colors.bright + colors.white));
  console.log(createSeparator('═', 70, colors.cyan));
  
  console.log('\n' + colorize('🔍 SCANNING DIRECTORY:', colors.blue + colors.bright));
  console.log(`   ${colorize('📁', colors.blue)} ${formatFilePath(directory)}`);
  console.log('\n' + colorize('⏳ Please wait while scanning for skipped tests...', colors.yellow));
  console.log(createSeparator('─', 70, colors.gray));
}

/**
 * Displays error message with proper formatting
 * @param {string} message - Error message to display
 */
function displayError(message) {
  console.log('\n' + createSeparator('═', 70, colors.red));
  console.log(colorize('  ERROR', colors.bright + colors.white + colors.bgRed));
  console.log(createSeparator('═', 70, colors.red));
  
  console.log('\n' + colorize('❌ SCAN FAILED:', colors.red + colors.bright));
  console.log(`   ${colorize('⚠️', colors.red)} ${colorize(message, colors.red)}`);
  
  console.log('\n' + colorize('💡 TROUBLESHOOTING:', colors.yellow + colors.bright));
  console.log(colorize('   • Verify the directory path exists and is accessible', colors.yellow));
  console.log(colorize('   • Check file permissions for the target directory', colors.yellow));
  console.log(colorize('   • Use absolute paths to avoid navigation issues', colors.yellow));
  console.log(colorize('   • Run with -h flag for usage help', colors.yellow));
  
  console.log('\n' + createSeparator('═', 70, colors.red));
}

module.exports = {
  displayResults,
  displayHelp,
  displayScanStart,
  displayError,
  colorize,
  colors,
  createSeparator
};
