#!/usr/bin/env node

const readline = require('readline');
const { findSkippedTests } = require('./core/scanner');
const { displayResults, displayHelp, displayScanStart, displayError, colorize, colors, createSeparator } = require('./output/console');
const { writeResultsToFile, validateFormat, SUPPORTED_FORMATS } = require('./output/file');
const { validateDirectory, isDirectoryWritable } = require('./core/utils');

class SkippedTestsFinder {
  constructor() {
    this.testsDir = null;
    this.outputToFile = false;
    this.skipPrompt = false;
    this.outputDir = null;
    this.outputFormat = 'text'; // Default format
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  /**
   * Parse command line arguments
   */
  parseArguments() {
    const args = process.argv.slice(2);

    args.forEach((arg) => {
      if (arg.startsWith('-d=')) {
        this.testsDir = arg.substring(3);
      } else if (arg === '-txt') {
        // Backward compatibility: treat -txt as -f=text
        this.outputFormat = 'text';
        this.outputToFile = true;
        this.skipPrompt = true;
      } else if (arg === '-cli') {
        this.skipPrompt = true;
      } else if (arg === '-h' || arg === '--help') {
        displayHelp();
        process.exit(0);
      } else if (arg.startsWith('-o=')) {
        this.outputDir = arg.substring(3);
      } else if (arg.startsWith('-f=') || arg.startsWith('--format=')) {
        this.outputFormat = arg.includes('--format=') ? arg.substring(9) : arg.substring(3);
        this.outputToFile = true;
        this.skipPrompt = true;
      }
    });
  }

  /**
   * Prompts the user to enter the path to their tests directory
   */
  async promptForDirectory() {
    process.stdin.setRawMode(true);
    process.stdin.resume();
    
    process.stdin.on('keypress', (ch, key) => {
      if (key && key.name === 'escape') {
        console.log(`\nExiting...`);
        this.rl.close();
        process.exit(0);
      }
    });

    try {
      const answer = await new Promise((resolve) => {
        this.rl.question(`Enter the file path of where your tests are (hit <escape> to exit): `, resolve);
      });
      
      const dirPath = answer.trim();
      
      if (!validateDirectory(dirPath)) {
        console.log(`The directory does not exist. Please enter a valid directory path.`);
        process.exit(1);
      }
      
      this.testsDir = dirPath;
    } catch (err) {
      displayError(`Directory access failed: ${err.message}`);
      process.exit(1);
    }
  }

  /**
   * Prompts the user to choose output format
   */
  async promptForOutputOption() {
    return new Promise((resolve) => {
      process.stdin.setRawMode(true);
      process.stdin.resume();
      
      process.stdin.on('keypress', (ch, key) => {
        if (key && key.name === 'escape') {
          console.log(`\nExiting...`);
          this.rl.close();
          process.exit(0);
        }
      });

      const askForOutputOption = () => {
        this.rl.question(`Do you want to output the results to a file? (y/n; hit <escape> to exit): `, (answer) => {
          const userResponse = answer.trim().toLowerCase();
          if (userResponse === 'y') {
            this.outputToFile = true;
            this.askForOutputPath(resolve);
          } else if (userResponse === 'n') {
            this.outputToFile = false;
            resolve();
          } else {
            console.log(`Invalid response. Please enter y or n.`);
            askForOutputOption();
          }
        });
      };

      askForOutputOption();
    });
  }

  /**
   * Prompts for output directory path
   */
  askForOutputPath(resolve) {
    this.rl.question(`Enter the file path of where you want the text file to be created in (leave blank for the same file path as the tests): `, (path) => {
      if (path.trim() === '') {
        this.outputDir = this.testsDir;
      } else {
        if (isDirectoryWritable(path.trim())) {
          this.outputDir = path.trim();
        } else {
          console.error(`Error: Unable to write to the specified directory.`);
          console.log('Using the tests directory instead.');
          this.outputDir = this.testsDir;
        }
      }
      resolve();
    });
  }

  /**
   * Main execution method
   */
  async run() {
    try {
      this.parseArguments();

      // Validate format if specified
      if (this.outputFormat !== 'text') {
        try {
          validateFormat(this.outputFormat);
        } catch (error) {
          displayError(`Invalid format: ${error.message}`);
          process.exit(1);
        }
      }

      if (!this.testsDir) {
        await this.promptForDirectory();
      }

      if (!this.skipPrompt) {
        await this.promptForOutputOption();
      }

      // Display scanning start message
      displayScanStart(this.testsDir);

      const skippedTests = findSkippedTests(this.testsDir);

      if (this.outputToFile && skippedTests.length > 0) {
        const outputPath = writeResultsToFile(skippedTests, this.testsDir, this.outputDir, this.outputFormat);
        
        console.log('\n' + createSeparator('═', 70, colors.green));
        console.log(colorize('  FILE OUTPUT COMPLETE', colors.bright + colors.white));
        console.log(createSeparator('═', 70, colors.green));
        console.log('\n' + colorize('✅ SUCCESS!', colors.green + colors.bright));
        console.log(`   ${colorize('📄', colors.green)} Results written to: ${colorize(outputPath, colors.cyan)}`);
        console.log(`   ${colorize('📊', colors.green)} Total skipped tests: ${colorize(skippedTests.length, colors.yellow)}`);
        console.log('\n' + createSeparator('═', 70, colors.green));
      } else if (this.outputToFile && skippedTests.length === 0) {
        displayResults(skippedTests);
      } else {
        displayResults(skippedTests);
      }

      this.rl.close();
    } catch (error) {
      displayError(error.message);
      this.rl.close();
      process.exit(1);
    }
  }
}

// Run the application
const finder = new SkippedTestsFinder();
finder.run();
