# Usage Examples

## Basic Usage

### Scan current directory
```bash
skipped-tests-finder -d=.
```

### Scan specific test directory
```bash
skipped-tests-finder -d=./tests
```

### Output to file
```bash
skipped-tests-finder -d=./tests -txt
```

### Output to specific directory
```bash
skipped-tests-finder -d=./tests -txt -o=./reports
```

## Interactive Mode

Run without arguments to enter interactive mode:
```bash
skipped-tests-finder
```

The tool will prompt you for:
1. Test directory path
2. Output preference (console or file)
3. Output directory (if file output is chosen)

## Programmatic Usage

```javascript
const { findSkippedTests } = require('skipped-tests-finder/src/core/scanner');

// Find skipped tests in a directory
const skippedTests = findSkippedTests('./tests');

console.log(`Found ${skippedTests.length} skipped tests:`);
skippedTests.forEach(test => {
  console.log(`- ${test.testName} (${test.filePath}:${test.lineNumber})`);
});
```

## Example Output

### Console Output
```
Total skipped tests: 3

Skipped Tests:

- should skip this test (./tests/example.test.js:10)
- should skip this test too (./tests/example.test.js:14)
- Reason for skipping (./tests/python-test.py:8)
```

### File Output
The same information is written to `skipped_tests.txt` in the specified directory.
