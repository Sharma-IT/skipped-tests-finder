const { test, describe } = require('node:test');
const assert = require('node:assert');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const execAsync = promisify(exec);

describe('CLI Integration Tests', () => {
  const tempDir = path.join(__dirname, 'temp_cli_output');
  
  // Setup: Create temp directory
  test('setup temp directory', () => {
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
  });

  describe('Format Option Tests', () => {
    test('should generate JSON output via CLI', async () => {
      const { stdout } = await execAsync(`node src/cli.js -d=tests/fixtures -f=json -o=${tempDir}`);
      
      assert(stdout.includes('Results written to:'), 'Should show success message');
      assert(stdout.includes('skipped_tests.json'), 'Should mention JSON file');
      
      const jsonPath = path.join(tempDir, 'skipped_tests.json');
      assert(fs.existsSync(jsonPath), 'JSON file should exist');
      
      const content = fs.readFileSync(jsonPath, 'utf8');
      const parsed = JSON.parse(content);
      assert(parsed.totalSkippedTests > 0, 'Should have skipped tests');
      assert(parsed.summary, 'Should have summary');
    });

    test('should generate Markdown output via CLI', async () => {
      const { stdout } = await execAsync(`node src/cli.js -d=tests/fixtures -f=markdown -o=${tempDir}`);
      
      assert(stdout.includes('Results written to:'), 'Should show success message');
      assert(stdout.includes('skipped_tests.md'), 'Should mention Markdown file');
      
      const mdPath = path.join(tempDir, 'skipped_tests.md');
      assert(fs.existsSync(mdPath), 'Markdown file should exist');
      
      const content = fs.readFileSync(mdPath, 'utf8');
      assert(content.includes('# Skipped Tests Report'), 'Should have Markdown header');
      assert(content.includes('## Summary'), 'Should have summary section');
    });

    test('should generate text output via CLI (backward compatibility)', async () => {
      const { stdout } = await execAsync(`node src/cli.js -d=tests/fixtures -txt -o=${tempDir}`);
      
      assert(stdout.includes('Results written to:'), 'Should show success message');
      assert(stdout.includes('skipped_tests.txt'), 'Should mention text file');
      
      const txtPath = path.join(tempDir, 'skipped_tests.txt');
      assert(fs.existsSync(txtPath), 'Text file should exist');
      
      const content = fs.readFileSync(txtPath, 'utf8');
      assert(content.includes('Total skipped tests:'), 'Should have text format');
      assert(content.includes('Skipped Tests:'), 'Should have section header');
    });

    test('should handle invalid format gracefully', async () => {
      try {
        await execAsync(`node src/cli.js -d=tests/fixtures -f=invalid -o=${tempDir}`);
        assert.fail('Should have thrown an error');
      } catch (error) {
        assert(error.stdout.includes('Invalid format'), 'Should show format error');
        assert(error.stdout.includes('Supported formats:'), 'Should show supported formats');
      }
    });

    test('should show help with format option', async () => {
      const { stdout } = await execAsync('node src/cli.js --help');
      
      assert(stdout.includes('-f=<format>, --format=<format>'), 'Should show format flag');
      assert(stdout.includes('Output format: text, json, markdown'), 'Should show format options');
      assert(stdout.includes('Save results as JSON'), 'Should show JSON example');
      assert(stdout.includes('Save results as Markdown'), 'Should show Markdown example');
    });
  });

  // Cleanup: Remove temp directory
  test('cleanup temp directory', () => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });
});
