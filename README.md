<div align="center">

# skipped-tests-finder

**Analyses your project or a specific directory for skipped tests**

</div>

<br>

Skipped Tests Finder is a command-line tool that scans your project or test suites and identifies any skipped tests or test suites. It provides a convenient way to keep track of skipped tests and ensure that they are addressed before releasing your application. 

**Supported Languages & Frameworks:**
- **JavaScript/TypeScript**: Jest, Mocha, Jasmine, Cypress, Playwright, Puppeteer
- **Python**: unittest, pytest, nose
- **Ruby**: RSpec, MiniTest  
- **Java**: JUnit 4/5, TestNG
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

And many more through generic comment patterns (SKIP, TODO, FIXME).

**Note:** this tool appears to struggle with scanning very large codebases in their entirety. If you encounter the error message `The directory does not exist. Please enter a valid directory path.` after running the script to scan your entire codebase, please rerun the tool, this time targeting either your test directory or the `src` folder specifically. Additionally, it's advisable to run the tool separately on different directories to segregate results for distinct types of test suites within your project. For instance, you might run this script to identify Jest tests located in `./src` and Cypress tests in `./cypress/e2e` separately.


## Features

- **Multi-language Support**: Scans test files in 15+ programming languages
- **Comprehensive Framework Coverage**: Supports 50+ testing frameworks and patterns
- **Recursive Scanning**: Recursively scans directories and subdirectories
- **Flexible File Types**: Supports `.js`, `.ts`, `.py`, `.rb`, `.java`, `.cs`, `.go`, `.cpp`, `.rs`, `.swift`, `.kt`, `.php`, `.dart`, `.pl`, `.ex`, `.clj`, `.robot` and many more
- **Rich Pattern Detection**: Identifies various skip syntaxes like `it.skip()`, `@unittest.skip()`, `@Ignore`, `#[ignore]`, `t.Skip()`, etc.
- **Detailed Output**: Shows test names, file paths, and line numbers
- **Multiple Output Formats**: Console output or file export (`skipped_tests.txt`)
- **Comment Pattern Detection**: Finds TODO, FIXME, and SKIP comments in code

## Installation

### Requirements

- **skipped-tests-finder** requires **NodeJS 10** (or higher) to be installed

### NPM Installation (Recommended)

```sh
npm install -g skipped-tests-finder
```

This will install the tool globally on your system, making it available from any directory.

1. Clone this repository:

```sh
git clone https://github.com/Sharma-IT/skipped-tests-finder.git
```

2. Change into this respository's directory:

```sh
cd skipped-tests-finder
```

### For Linux/macOS

3. To install `skipped-tests-finder` globally on Linux-based Operating Systems (including macOS), run:

```bash
./scripts/install.sh
```

This will make the tool accessible from anywhere by running `skipped-tests-finder`.

### For Windows

3. To install `skipped-tests-finder` globally on Windows, run PowerShell as Administrator and execute:

```powershell
.\scripts\install.ps1
```

This will make the tool accessible from anywhere by running `skipped-tests-finder`. You may need to restart your terminal for the changes to take effect.

## Uninstallation

### NPM Uninstallation

If you installed via npm:

```sh
npm uninstall -g skipped-tests-finder
```

### Manual Uninstallation

#### For Linux/macOS

```bash
./scripts/uninstall.sh
```

#### For Windows

Run PowerShell as Administrator and execute:

```powershell
.\scripts\uninstall.ps1
```

## Usage

1. Install `skipped-tests-finder` using the instructions above.
2. From any directory in your terminal, run:
```sh
skipped-tests-finder
```
3. Upon execution, the script will request the path to your tests directory. You have the option to input the path after initiating the script or beforehand using the `-d` argument. For example, `skipped-tests-finder -d=projects/project_name/cypress/e2e`.
4. Following that, the script will inquire whether you wish to save the results to a text file. Respond with either "y" or "n" as appropriate, "y" will save the results to a text file (`skipped_tests.txt`) and "n" will print the results in your console. If you choose "y", you'll be prompted to enter the file path where you want the text file to be created. Leaving this blank will create the output in the same directory as the tests.
5. Alternatively, you can bypass this prompt by utilising the following arguments when executing the script:
   - `-cli`: Display the results directly in your console
   - `-txt`: Generate a plain text file named `skipped_tests.txt` in the same directory as your tests
   - `-o=<path>`: Override the output directory for the text file (optional)
   - `-d=<path>`: Specify the directory to scan for skipped tests (e.g., `skipped-tests-finder -d=projects/project_name/cypress/e2e`)

6. The script will proceed to scan your test directory and its subdirectories to identify skipped tests. Subsequently, it will print the results in the console or write them into the `skipped_tests.txt` file, depending on your choice.

### Commands

```
Usage: skipped-tests-finder [options] -d=[<path>]

Options:

 -d=<path>        Path to the directory to search for skipped tests
 -txt             Output the results to a plain text file
 -cli             Output the results to the terminal
 -o=<path>        Path to the directory for the text output
 -h, --help       Display this help message
```

### Example Output

```
my-name@my-computers-name my_application % skipped-tests-finder.js -d=.projects/project_1/cypress/e2e -cli

Total skipped tests: 2

Skipped Tests:

- test 1 (cypress/e2e/tests.spec.js:4)
- test 2 (cypress/e2e/tests.spec.js:12)
```

## Project Structure

The project has been organized into a modular structure for better maintainability:

```
skipped-tests-finder/
├── src/
│   ├── cli.js                    # Main CLI entry point
│   ├── core/
│   │   ├── scanner.js           # Core scanning logic
│   │   ├── patterns.js          # Test framework patterns
│   │   └── utils.js             # Utility functions
│   └── output/
│       ├── console.js           # Console output formatting
│       └── file.js              # File output handling
├── scripts/
│   ├── install.sh               # Linux/macOS installation
│   ├── install.ps1              # Windows installation
│   ├── uninstall.sh             # Linux/macOS uninstallation
│   └── uninstall.ps1            # Windows uninstallation
├── tests/
│   ├── fixtures/                # Test files for testing
│   └── *.test.js                # Unit tests
├── docs/
│   ├── api.md                   # API documentation
│   └── examples/                # Usage examples
├── bin/
│   └── skipped-tests-finder     # CLI executable
└── package.json
```

## Development

### Running from Source

```bash
# Clone the repository
git clone https://github.com/Sharma-IT/skipped-tests-finder.git
cd skipped-tests-finder

# Run directly
node src/cli.js -d=./tests

# Or use npm script
npm start -- -d=./tests
```

### Testing

```bash
# Run tests (when available)
npm test
```

## Contributing

Pull requests are welcomed. For major changes, please open an issue first to discuss what you would like to change.

## Contact

Shubham Sharma - [My LinkedIn](https://www.linkedin.com/in/sharma-it/) - shubhamsharma.emails@gmail.com.

## License

This project is licensed under the GPL 3.0 License - see the [LICENSE](LICENSE) file for details.
