const fs = require('fs');
const path = require('path');
const readline = require('readline');
const console = require('console');

let testDir = null;
let outputToFile = false;
let skipPrompt = false;

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

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const args = process.argv.slice(2);

args.forEach((arg) => {
  if (arg.startsWith('-d=')) {
    testDir = arg.substring(3);
  } else if (arg === '-txt') {
    outputToFile = true;
    skipPrompt = true;
  } else if (arg === '-cli') {
    skipPrompt = true;
  } else if (arg === '-h' || arg === '--help') {
    console.log(`\n  Usage: skipped-tests-finder [options] -d=[<path>]

  Options:

    -d=             Path to the directory to search for skipped tests
    -txt            Print the results to a plain text file
    -cli            Print the results to the console
    -h, --help      Display this help message\n`);
    process.exit(0);
  }
});

/**
 * Recursively searches a directory and its subdirectories for skipped tests, and returns an array of information about the skipped tests.
 *
 * @param {string} dirPath - The path to the directory to search for skipped tests.
 * @return {Array<{ testName: string, filePath: string, line: string, lineNumber: number }>} - An array of objects representing the skipped tests. Each object has the following properties:
 *   - testName: The name of the skipped test.
 *   - filePath: The path to the file where the skipped test is located.
 *   - line: The line of code where the skipped test is defined.
 *   - lineNumber: The line number where the skipped test is defined.
 */
const findSkippedTests = (dirPath) => {
  const skippedTests = [];

  const walkSync = (currentPath) => {
    try {
      const files = fs.readdirSync(currentPath);

      files.forEach((file) => {
        const filePath = path.join(currentPath, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
          walkSync(filePath);
        } else if (['.js', '.ts', '.jsx', '.tsx', '.coffee', '.py', '.rb', '.php', '.java', '.cs', '.go', '.cpp', '.groovy'].some(ext => file.endsWith(ext))) {
          const fileContent = fs.readFileSync(filePath, 'utf8');
          const skippedTestRegex =
          /it\.skip\('((?:\\.|[^'\\])*)',|xdescribe\('((?:\\.|[^'\\])*)',|describe\.skip\('((?:\\.|[^'\\])*)',|test\.skip\('((?:\\.|[^'\\])*)',|xtest\('((?:\\.|[^'\\])*)',|@unittest\.skip\("((?:\\.|[^"\\])*)",|@pytest\.mark\.skip\(reason="((?:\\.|[^"\\])*)",|it\s+"((?:\\.|[^"\\])*)",\s*:\s*skip\s*=>\s*"((?:\\.|[^"\\])*)",|def\s+test_((?:\\.|[^:;\\])*);skip\s*"((?:\\.|[^"\\])*)",|@requires((?:\\.|[^"\\])*)",|@Ignore\("((?:\\.|[^"\\])*)",|@Disabled\("((?:\\.|[^"\\])*)",|\[Ignore\("((?:\\.|[^"\\])*)",|\[IgnoreAttribute\("((?:\\.|[^"\\])*)",|SKIP_TEST\("((?:\\.|[^"\\])*)",|DISABLED_TEST\(((?:\\.|[^)\\])*)\)\s*\{|\.xscenario\("((?:\\.|[^"\\])*)"?,|Test\.(Ignore|Ignored)\(\)|@IgnoreTest\("((?:\\.|[^"\\])*)",/g;

          let match;
          while ((match = skippedTestRegex.exec(fileContent)) !== null) {
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
        console.log(`The directory does not exist. Please enter a valid directory path.`);
        process.exit(1);
      } else {
        console.error(`An error occurred while accessing the directory: ${err.message}`);
      }
    }
  };

  walkSync(dirPath);
  return skippedTests;
};

/**
 * Prompts the user to enter the path to their tests directory, and stores the path if it is valid.
 *
 * This function sets the `testDir` variable to the user-provided path if it is valid, and exits the script if the path is invalid.
 *
 * @returns {Promise<void>} - A promise that resolves when the user has provided a valid directory path.
 */
const promptForDirectory = () => {
  const askForDirectory = async () => {
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('keypress', (ch, key) => {
      if (key && key.name === 'escape') {
        console.log(`\nExiting...`);
        rl.close();
        process.exit(0);
      }
    });

    try {
      const answer = await new Promise((resolve) => {
        rl.question(`Enter the path to your tests directory (hit <escape> to exit): `, resolve);
      });
      const dirPath = answer.trim();
      fs.statSync(dirPath);
      testDir = dirPath;
    } catch (err) {
      if (err.code === 'ENOENT') {
        console.log(`The directory does not exist. Please enter a valid directory path.`);
      } else {
        console.error(`An error occurred while accessing the directory: ${err.message}`);
      }
      process.exit(1);
    }
  };
  return askForDirectory();
};

/**
 * Prompts the user to choose whether to output the results of the skipped tests to a file or to the console.
 *
 * This function sets the `outputToFile` flag based on the user's response, and resolves the promise when the user has made their choice.
 *
 * @returns {Promise<void>} - A promise that resolves when the user has made their choice.
 */
const promptForOutputOption = () => {
  return new Promise((resolve) => {
    // Listen for keypress events to handle escape key
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('keypress', (ch, key) => {
      if (key && key.name === 'escape') {
        console.log(`\nExiting...`);
        rl.close();
        process.exit(0);
      }
    });
    const askForOutputOption = () => {
      rl.question(`Do you want to output the results to a file? (y/n; hit <escape> to exit): `, (answer) => {
        const userResponse = answer.trim().toLowerCase();
        if (userResponse === 'y') {
          outputToFile = true;
          resolve();
        } else if (userResponse === 'n') {
          outputToFile = false;
          resolve();
        } else {
          console.log(`Invalid response. Please enter y or n.`);
          askForOutputOption();
        }
      });
    };

    askForOutputOption();
  });
};

/**
 * Finds and prints the names and locations of any skipped tests in the specified directory.
 *
 * If the test directory was not provided as a command line argument, the user will be prompted to enter it.
 * If the user was not prompted whether to output the results to a file, they will be prompted to choose.
 *
 * The function will search the specified directory for any skipped tests and print their names and locations.
 * If there are no skipped tests, a success message will be printed.
 *
 * If the user chooses to output the results to a file, the skipped test information will be written to a file named 'skipped-tests.txt' in the current working directory.
 * Otherwise, the skipped test information will be printed to the console.
 */
const findAndPrintSkippedTests = async () => {
  if (!testDir) {
    await promptForDirectory();
  }

  if (!skipPrompt) {
    await promptForOutputOption();
  }

  const skippedTests = findSkippedTests(testDir);

  if (skippedTests.length > 0) {
    let output = `\nTotal skipped tests: ${skippedTests.length}\n\nSkipped Tests:\n\n`;
    const testOutput = skippedTests.map((test) => `- ${test.testName} (${test.filePath}:${test.lineNumber})\n`).join('');

    if (outputToFile) {
      output = stripANSI(output);
      const outputFilePath = path.join(process.cwd(), 'skipped-tests.txt');
      fs.writeFileSync(outputFilePath, output + testOutput);
      console.log(`Skipped tests output written to ${outputFilePath}`);
    } else {
      console.log(output + testOutput);
    }
  } else {
    console.log('No skipped tests found.');
  }

  rl.close();
};

findAndPrintSkippedTests();
