<div align="center">

# skipped-tests-finder

**Analyses your project or a specific directory for skipped tests**

</div>

<br>

Skipped Tests Finder is a command-line tool that scans your project or test suites and identifies any skipped tests or test suites. It provides a convenient way to keep track of skipped tests and ensure that they are addressed before releasing your application. Skipped Tests Finder works for the majority of test frameworks, including but not limited to Playwright, Puppeteer, Cypress, Robot Framework, Selenium, Katalon Studio, Jest, Mocha, Jasmine, unittest, pytest, RSpec, MiniTest, PHPUnit, JUnit, NUnit, MSTest, Catch2 and GoogleTest.

**Note:** this tool appears to struggle with scanning very large codebases in their entirety. If you encounter the error message `The directory does not exist. Please enter a valid directory path.` after running the script to scan your entire codebase, please rerun the tool, this time targeting either your test directory or the `src` folder specifically. Additionally, it's advisable to run the tool separately on different directories to segregate results for distinct types of test suites within your project. For instance, you might run this script to identify Jest tests located in `./src` and Cypress tests in `./cypress/e2e` separately.


## Features

- Recursively scans a directory and its subdirectories for test files (`.js`, `.ts`, `.jsx`, `.tsx`, `.coffee`, `.py`, `.rb`, `.php`, `.java`, `.cs`, `.go`, `.cpp` and `.groovy` files)
- Identifies skipped tests for many different types of syntaxes, such as `it.skip(...)`, `test.skip(...)`, `xtest(...)`, `@unittest.skip("reason")`, `@pytest.mark.skip(reason="reason")`, `it "test name"` and much more
- Displays the total number of skipped tests found
- Outputs a list of skipped tests with their names, file paths, and line numbers
- Supports outputting the results to a file (`skipped-tests.txt`) for easier integration with other tools or further processing

## Installation

### Requirements

- **skipped-tests-finder** requires **NodeJS 10** (or higher) to be installed

1. Clone this repository:

```sh
git clone https://github.com/Sharma-IT/skipped-tests-finder.git
```

2. Change into this respository's directory:

```sh
cd skipped-tests-finder
```

### For Linux

3. To install `skipped-tests-finder` on Linux-based Operating Systems (including macOS), run:

```bash
./install.sh
```

### For Windows

3. To install `skipped-tests-finder` on Windows Operating Systems, run:

```powershell
.\install.ps1
```

## Usage

1. Install `skipped-tests-finder`.
2. Navigate to your home directory, using `cd` in your terminal (on either Linux or Windows).
3. Run the `skipped-tests-finder` command:
```sh
node skipped-tests-finder.js
```
4. Upon execution, the script will request the path to your tests directory. You have the option to input the path after initiating the script or beforehand using the `-d` argument. For example, `node skipped-tests-finder.js -d=projects/project_name/cypress/e2e`.
5. Following that, the script will inquire whether you wish to save the results to a text file. Respond with either "y" or "n" as appropriate, "y" will save the results to a text file (`skipped-tests.txt`) and "n" will print the results in your console. Alternatively, you can bypass this prompt by utilising the following arguments when executing the script: `-cli` or `-txt`. The `-cli` option will display the results directly in your console, while `-txt` will generate a plain text file named `skipped-tests.txt`.
6. The script will proceed to scan your test directory and its subdirectories to identify skipped tests. Subsequently, it will print the results in the console or write them into the `skipped-tests.txt` file, depending on your choice.

**Note:** you can also copy the script manually into your project directory and run the script from the project directory.

### Commands

```
Usage: skipped-tests-finder [options] -d=[<path>]

Options:

 -d=              Path to the directory to search for skipped tests
 -txt             Output the results to a plain text file
 -cli             Output the results to the terminal
 -h, --help       Display this help message
```

### Example Output

```
my-name@my-computers-name my application % node skipped-tests-finder.js -d=.projects/project_1/cypress/e2e -cli

Total skipped tests: 2

Skipped Tests:

- test 1 (cypress/e2e/tests.spec.js:4)
- test 2 (cypress/e2e/tests.spec.js:12)
```

## Contributing

Pull requests are welcomed. For major changes, please open an issue first to discuss what you would like to change.

## Contact

Shubham Sharma - [My LinkedIn](https://www.linkedin.com/in/sharma-it/) - shubhamsharma.emails@gmail.com.

## License

This project is licensed under the GPL 3.0 License - see the [LICENSE](LICENSE) file for details.
