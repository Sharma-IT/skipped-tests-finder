# API Documentation

## Core Modules

### Scanner (`src/core/scanner.js`)

#### `findSkippedTests(dirPath)`

Recursively searches a directory and its subdirectories for skipped tests.

**Parameters:**
- `dirPath` (string): The path to the directory to search for skipped tests

**Returns:**
- Array of objects with the following properties:
  - `testName` (string): The name of the skipped test
  - `filePath` (string): The path to the file where the skipped test is located
  - `line` (string): The line of code where the skipped test is defined
  - `lineNumber` (number): The line number where the skipped test is defined

### Patterns (`src/core/patterns.js`)

Contains regular expressions for identifying skipped tests in various testing frameworks.

#### Supported Test Frameworks

- **JavaScript/TypeScript**: Jest, Mocha, Jasmine, Cypress, Playwright, Puppeteer
- **Python**: unittest, pytest, nose
- **Ruby**: RSpec, MiniTest
- **Java**: JUnit 4, JUnit 5, TestNG
- **C#**: NUnit, MSTest, xUnit
- **C++**: Google Test, Catch2
- **Go**: Standard testing package
- **PHP**: PHPUnit
- **Rust**: Built-in test framework
- **Swift**: XCTest
- **Kotlin**: JUnit, Spek
- **Scala**: ScalaTest
- **Dart**: Built-in test framework
- **Groovy**: Spock
- **Perl**: Test::More
- **Elixir**: ExUnit
- **Clojure**: Built-in test framework
- **Robot Framework**: Robot Framework
- **Selenium**: Various language bindings

### Utils (`src/core/utils.js`)

Utility functions for common operations.

#### `stripANSI(str)`

Removes ANSI escape codes from a string.

#### `validateDirectory(dirPath)`

Validates if a directory path exists and is accessible.

#### `isDirectoryWritable(dirPath)`

Checks if a directory is writable.

## Output Modules

### Console Output (`src/output/console.js`)

#### `displayResults(skippedTests)`

Formats and displays skipped tests to the console.

#### `displayHelp()`

Displays help information for the CLI.

### File Output (`src/output/file.js`)

#### `writeResultsToFile(skippedTests, testsDir, outputDir)`

Writes skipped tests results to a text file.

## CLI Usage

```bash
skipped-tests-finder [options] -d=[<path>]

Options:
  -d=             Path to the directory to search for skipped tests
  -txt            Print the results to a plain text file in the same directory as the tests
  -cli            Print the results to the console
  -o=<path>       Override the output directory for the text file (optional)
  -h, --help      Display this help message
```
