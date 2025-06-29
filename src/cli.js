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
   * Displays an enhanced welcome message
   */
  displayWelcome() {
    console.log('\n' + createSeparator('═', 70, colors.cyan));
    console.log(colorize('  SKIPPED TESTS FINDER - INTERACTIVE MODE', colors.bright + colors.white));
    console.log(createSeparator('═', 70, colors.cyan));
    
    console.log('\n' + colorize('👋 WELCOME!', colors.green + colors.bright));
    console.log(colorize('   Let\'s find those skipped tests in your codebase.', colors.green));
    console.log('\n' + colorize('💡 TIP:', colors.yellow + colors.bright));
    console.log(colorize('   • Use absolute or relative paths for best results', colors.yellow));
    console.log(colorize('   • Press', colors.yellow) + ' ' + colorize('ESC', colors.red + colors.bright) + ' ' + colorize('anytime to exit', colors.yellow));
    console.log(colorize('   • For large codebases, scan specific directories (./tests, ./src)', colors.yellow));
    console.log('\n' + createSeparator('─', 70, colors.gray));
  }

  /**
   * Prompts the user to enter the path to their tests directory
   */
  async promptForDirectory() {
    this.displayWelcome();
    
    // Only set raw mode if we're in a TTY
    if (process.stdin.isTTY && process.stdin.setRawMode) {
      process.stdin.setRawMode(true);
      process.stdin.resume();
      
      process.stdin.on('keypress', (ch, key) => {
        if (key && key.name === 'escape') {
          console.log('\n' + colorize('👋 Goodbye!', colors.cyan + colors.bright));
          console.log(colorize('   Thanks for using Skipped Tests Finder!', colors.cyan));
          console.log('\n' + createSeparator('═', 70, colors.cyan));
          this.rl.close();
          process.exit(0);
        }
      });
    }

    try {
      console.log('\n' + colorize('📁 DIRECTORY SELECTION:', colors.blue + colors.bright));
      console.log(colorize('   Please specify the directory to scan for skipped tests.', colors.blue));
      
      const answer = await new Promise((resolve) => {
        this.rl.question(colorize('\n📍 Enter the path to your tests directory: ', colors.cyan + colors.bright), resolve);
      });
      
      const dirPath = answer.trim();
      
      if (!validateDirectory(dirPath)) {
        console.log('\n' + colorize('❌ ERROR:', colors.red + colors.bright));
        console.log(colorize('   The directory does not exist or is not accessible.', colors.red));
        console.log(colorize('   Please check the path and try again.', colors.red));
        console.log('\n' + createSeparator('═', 70, colors.red));
        process.exit(1);
      }
      
      console.log('\n' + colorize('✅ DIRECTORY CONFIRMED:', colors.green + colors.bright));
      console.log(`   ${colorize('📁', colors.green)} ${colorize(dirPath, colors.cyan)}`);
      
      this.testsDir = dirPath;
    } catch (err) {
      displayError(`Directory access failed: ${err.message}`);
      process.exit(1);
    }
  }

  /**
   * Prompts the user to choose output format with enhanced UI
   */
  async promptForOutputOption() {
    return new Promise((resolve) => {
      // Only set raw mode if we're in a TTY
      if (process.stdin.isTTY && process.stdin.setRawMode) {
        process.stdin.setRawMode(true);
        process.stdin.resume();
        
        process.stdin.on('keypress', (ch, key) => {
          if (key && key.name === 'escape') {
            console.log('\n' + colorize('👋 Goodbye!', colors.cyan + colors.bright));
            console.log(colorize('   Thanks for using Skipped Tests Finder!', colors.cyan));
            console.log('\n' + createSeparator('═', 70, colors.cyan));
            this.rl.close();
            process.exit(0);
          }
        });
      }

      this.displayOutputOptions();

      const askForOutputOption = () => {
        this.rl.question(colorize('\n🎯 Choose your output preference: ', colors.magenta + colors.bright), (answer) => {
          const userResponse = answer.trim().toLowerCase();
          
          switch (userResponse) {
            case 'c':
            case 'console':
              this.outputToFile = false;
              console.log('\n' + colorize('✅ CONSOLE OUTPUT SELECTED', colors.green + colors.bright));
              console.log(colorize('   Results will be displayed in your terminal.', colors.green));
              resolve();
              break;
              
            case 't':
            case 'text':
              this.outputFormat = 'text';
              this.outputToFile = true;
              console.log('\n' + colorize('✅ TEXT FILE OUTPUT SELECTED', colors.green + colors.bright));
              console.log(colorize('   Results will be saved as skipped_tests.txt', colors.green));
              this.askForOutputPath(resolve);
              break;
              
            case 'j':
            case 'json':
              this.outputFormat = 'json';
              this.outputToFile = true;
              console.log('\n' + colorize('✅ JSON OUTPUT SELECTED', colors.green + colors.bright));
              console.log(colorize('   Results will be saved as skipped_tests.json', colors.green));
              this.askForOutputPath(resolve);
              break;
              
            case 'm':
            case 'markdown':
              this.outputFormat = 'markdown';
              this.outputToFile = true;
              console.log('\n' + colorize('✅ MARKDOWN OUTPUT SELECTED', colors.green + colors.bright));
              console.log(colorize('   Results will be saved as skipped_tests.md', colors.green));
              this.askForOutputPath(resolve);
              break;
              
            default:
              console.log('\n' + colorize('❌ INVALID CHOICE', colors.red + colors.bright));
              console.log(colorize('   Please enter one of the valid options (c/t/j/m).', colors.red));
              askForOutputOption();
              break;
          }
        });
      };

      askForOutputOption();
    });
  }

  /**
   * Displays the enhanced output options menu
   */
  displayOutputOptions() {
    console.log('\n' + createSeparator('─', 70, colors.gray));
    console.log(colorize('📤 OUTPUT FORMAT SELECTION:', colors.magenta + colors.bright));
    console.log(colorize('   Choose how you\'d like to receive your results.', colors.magenta));
    
    console.log('\n' + colorize('📋 AVAILABLE OPTIONS:', colors.blue + colors.bright));
    
    const options = [
      { 
        key: colorize('c', colors.cyan + colors.bright), 
        name: colorize('Console', colors.white + colors.bright),
        desc: colorize('Display results in terminal with colors and formatting', colors.gray),
        icon: '🖥️'
      },
      { 
        key: colorize('t', colors.yellow + colors.bright), 
        name: colorize('Text', colors.white + colors.bright),
        desc: colorize('Save as plain text file (skipped_tests.txt)', colors.gray),
        icon: '📄'
      },
      { 
        key: colorize('j', colors.green + colors.bright), 
        name: colorize('JSON', colors.white + colors.bright),
        desc: colorize('Save as structured JSON file (skipped_tests.json)', colors.gray),
        icon: '📊'
      },
      { 
        key: colorize('m', colors.blue + colors.bright), 
        name: colorize('Markdown', colors.white + colors.bright),
        desc: colorize('Save as formatted Markdown report (skipped_tests.md)', colors.gray),
        icon: '📝'
      }
    ];

    options.forEach(option => {
      console.log(`   ${colorize('•', colors.gray)} ${option.icon} ${option.key} - ${option.name}`);
      console.log(`     ${option.desc}`);
    });
    
    console.log('\n' + colorize('💡 HINT:', colors.yellow + colors.bright));
    console.log(colorize('   • Press', colors.yellow) + ' ' + colorize('c', colors.cyan + colors.bright) + 
               colorize(' for console,', colors.yellow) + ' ' + colorize('t', colors.yellow + colors.bright) + 
               colorize(' for text,', colors.yellow) + ' ' + colorize('j', colors.green + colors.bright) + 
               colorize(' for JSON,', colors.yellow) + ' ' + colorize('m', colors.blue + colors.bright) + 
               colorize(' for Markdown', colors.yellow));
    console.log(colorize('   • You can also type the full name (e.g., "console", "json")', colors.yellow));
  }

  /**
   * Prompts for output directory path with enhanced formatting
   */
  askForOutputPath(resolve) {
    console.log('\n' + createSeparator('─', 70, colors.gray));
    console.log(colorize('📁 OUTPUT LOCATION:', colors.blue + colors.bright));
    console.log(colorize('   Specify where to save your results file.', colors.blue));
    
    console.log('\n' + colorize('💡 OPTIONS:', colors.yellow + colors.bright));
    console.log(colorize('   • Press', colors.yellow) + ' ' + colorize('ENTER', colors.green + colors.bright) + 
               colorize(' to save in the same directory as your tests', colors.yellow));
    console.log(colorize('   • Or enter a custom directory path', colors.yellow));
    
    this.rl.question(colorize('\n📍 Output directory (leave blank for tests directory): ', colors.cyan + colors.bright), (path) => {
      const trimmedPath = path.trim();
      
      if (trimmedPath === '') {
        this.outputDir = this.testsDir;
        console.log('\n' + colorize('✅ USING TESTS DIRECTORY:', colors.green + colors.bright));
        console.log(`   ${colorize('📁', colors.green)} ${colorize(this.testsDir, colors.cyan)}`);
      } else {
        if (isDirectoryWritable(trimmedPath)) {
          this.outputDir = trimmedPath;
          console.log('\n' + colorize('✅ CUSTOM DIRECTORY CONFIRMED:', colors.green + colors.bright));
          console.log(`   ${colorize('📁', colors.green)} ${colorize(trimmedPath, colors.cyan)}`);
        } else {
          console.log('\n' + colorize('⚠️  DIRECTORY ACCESS WARNING:', colors.yellow + colors.bright));
          console.log(colorize('   Unable to write to the specified directory.', colors.yellow));
          console.log(colorize('   Using tests directory instead for safety.', colors.yellow));
          console.log(`   ${colorize('📁', colors.yellow)} ${colorize(this.testsDir, colors.cyan)}`);
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
        
        // Format-specific icons and messages
        const formatInfo = {
          text: { icon: '📄', name: 'Text File', color: colors.yellow },
          json: { icon: '📊', name: 'JSON File', color: colors.green },
          markdown: { icon: '📝', name: 'Markdown Report', color: colors.blue }
        };
        
        const format = formatInfo[this.outputFormat] || formatInfo.text;
        
        console.log('\n' + createSeparator('═', 70, format.color));
        console.log(colorize(`  ${format.icon} ${format.name.toUpperCase()} CREATED`, colors.bright + colors.white));
        console.log(createSeparator('═', 70, format.color));
        
        console.log('\n' + colorize('✅ SUCCESS!', colors.green + colors.bright));
        console.log(`   ${colorize(format.icon, format.color)} Results saved as: ${colorize(outputPath.split('/').pop(), colors.cyan + colors.bright)}`);
        console.log(`   ${colorize('📁', colors.blue)} Location: ${colorize(outputPath.replace(/\/[^/]*$/, ''), colors.cyan)}`);
        console.log(`   ${colorize('📊', colors.green)} Total skipped tests: ${colorize(skippedTests.length, colors.yellow + colors.bright)}`);
        console.log(`   ${colorize('🎯', colors.magenta)} Format: ${colorize(this.outputFormat.toUpperCase(), format.color + colors.bright)}`);
        
        console.log('\n' + colorize('💡 NEXT STEPS:', colors.yellow + colors.bright));
        if (this.outputFormat === 'json') {
          console.log(colorize('   • Use the JSON file with other tools or scripts', colors.yellow));
          console.log(colorize('   • Parse the structured data for automated reporting', colors.yellow));
        } else if (this.outputFormat === 'markdown') {
          console.log(colorize('   • View the Markdown file in any text editor', colors.yellow));
          console.log(colorize('   • Include in documentation or share with your team', colors.yellow));
        } else {
          console.log(colorize('   • Open the text file to review skipped tests', colors.yellow));
          console.log(colorize('   • Share the results with your team', colors.yellow));
        }
        
        console.log('\n' + createSeparator('═', 70, format.color));
      } else if (this.outputToFile && skippedTests.length === 0) {
        console.log('\n' + createSeparator('═', 70, colors.green));
        console.log(colorize('  ✅ NO SKIPPED TESTS FOUND', colors.bright + colors.white));
        console.log(createSeparator('═', 70, colors.green));
        
        console.log('\n' + colorize('🎉 EXCELLENT!', colors.green + colors.bright));
        console.log(colorize('   No skipped tests were found in your codebase.', colors.green));
        console.log(colorize('   No output file was created since there are no results to save.', colors.green));
        console.log('\n' + createSeparator('═', 70, colors.green));
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
