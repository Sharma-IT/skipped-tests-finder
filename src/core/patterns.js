/**
 * Test framework patterns for identifying skipped tests
 */

const SKIP_PATTERNS = {
  // JavaScript/TypeScript patterns
  JEST_SKIP: /it\.skip\('((?:\\.|[^'\\])*)',/g,
  JEST_SKIP_DOUBLE: /it\.skip\("((?:\\.|[^"\\])*)",/g,
  JEST_SKIP_TEMPLATE: /it\.skip\(`((?:\\.|[^`\\])*)`/g,
  TEST_SKIP: /test\.skip\('((?:\\.|[^'\\])*)',/g,
  TEST_SKIP_DOUBLE: /test\.skip\("((?:\\.|[^"\\])*)",/g,
  TEST_SKIP_TEMPLATE: /test\.skip\(`((?:\\.|[^`\\])*)`/g,
  XTEST: /xtest\('((?:\\.|[^'\\])*)',/g,
  XTEST_DOUBLE: /xtest\("((?:\\.|[^"\\])*)",/g,
  XIT: /xit\('((?:\\.|[^'\\])*)',/g,
  XIT_DOUBLE: /xit\("((?:\\.|[^"\\])*)",/g,
  XDESCRIBE: /xdescribe\('((?:\\.|[^'\\])*)',/g,
  XDESCRIBE_DOUBLE: /xdescribe\("((?:\\.|[^"\\])*)",/g,
  DESCRIBE_SKIP: /describe\.skip\('((?:\\.|[^'\\])*)',/g,
  DESCRIBE_SKIP_DOUBLE: /describe\.skip\("((?:\\.|[^"\\])*)",/g,
  MOCHA_SKIP: /it\.skip\(/g,
  JASMINE_XDESCRIBE: /xdescribe\(/g,
  JASMINE_XIT: /xit\(/g,
  SKIP_ATTRIBUTE: /\.skip\s*=\s*true/g,
  TODO_TEST: /it\.todo\('((?:\\.|[^'\\])*)',/g,
  TODO_TEST_DOUBLE: /it\.todo\("((?:\\.|[^"\\])*)",/g,
  TEST_TODO: /test\.todo\('((?:\\.|[^'\\])*)',/g,
  TEST_TODO_DOUBLE: /test\.todo\("((?:\\.|[^"\\])*)",/g,
  
  // Python patterns
  UNITTEST_SKIP: /@unittest\.skip\("((?:\\.|[^"\\])*)"\)/g,
  UNITTEST_SKIP_SINGLE: /@unittest\.skip\('((?:\\.|[^'\\])*)'\)/g,
  UNITTEST_SKIP_IF: /@unittest\.skipIf\([^,]+,\s*"((?:\\.|[^"\\])*)"\)/g,
  UNITTEST_SKIP_UNLESS: /@unittest\.skipUnless\([^,]+,\s*"((?:\\.|[^"\\])*)"\)/g,
  PYTEST_SKIP: /@pytest\.mark\.skip\(reason="((?:\\.|[^"\\])*)"\)/g,
  PYTEST_SKIP_SIMPLE: /@pytest\.mark\.skip\s*$/gm,
  PYTEST_SKIPIF: /@pytest\.mark\.skipif\([^,]+,\s*reason="((?:\\.|[^"\\])*)"\)/g,
  PYTEST_XFAIL: /@pytest\.mark\.xfail\(reason="((?:\\.|[^"\\])*)"\)/g,
  PYTEST_XFAIL_SIMPLE: /@pytest\.mark\.xfail\s*$/gm,
  NOSE_SKIP: /@skip\("((?:\\.|[^"\\])*)"\)/g,
  NOSE_SKIP_IF: /@skipIf\([^,]+,\s*"((?:\\.|[^"\\])*)"\)/g,
  NOSE_SKIP_UNLESS: /@skipUnless\([^,]+,\s*"((?:\\.|[^"\\])*)"\)/g,
  
  // Ruby patterns (RSpec, MiniTest)
  RSPEC_SKIP: /it\s+'([^']*)',\s*skip:\s*true/g,
  RSPEC_SKIP_DOUBLE: /it\s+"([^"]*)",\s*skip:\s*true/g,
  RSPEC_SKIP_REASON: /it\s+'([^']*)',\s*skip:\s*'([^']*)'/g,
  RSPEC_SKIP_REASON_DOUBLE: /it\s+"([^"]*)",\s*skip:\s*"([^"]*)"/g,
  RSPEC_PENDING_INSIDE: /it\s+'([^']*)'\s+do\s*\n\s*pending\s+'([^']*)'/g,
  RSPEC_XDESCRIBE: /xdescribe\s+'([^']*)'/g,
  RSPEC_XDESCRIBE_DOUBLE: /xdescribe\s+"([^"]*)"/g,
  RSPEC_XIT: /xit\s+'([^']*)'/g,
  RSPEC_XIT_DOUBLE: /xit\s+"([^"]*)"/g,
  MINITEST_SKIP: /skip\("((?:\\.|[^"\\])*)"\)/g,
  MINITEST_SKIP_SIMPLE: /skip\s*$/gm,
  
  // Java patterns (JUnit 4, JUnit 5, TestNG)
  JUNIT4_IGNORE: /@Ignore\("((?:\\.|[^"\\])*)"\)/g,
  JUNIT4_IGNORE_SIMPLE: /@Ignore\s*$/gm,
  JUNIT5_DISABLED: /@Disabled\("((?:\\.|[^"\\])*)"\)/g,
  JUNIT5_DISABLED_SIMPLE: /@Disabled\s*$/gm,
  JUNIT5_DISABLED_IF: /@DisabledIf\([^)]+\)/g,
  JUNIT5_DISABLED_UNLESS: /@DisabledUnless\([^)]+\)/g,
  JUNIT5_DISABLED_ON_OS: /@DisabledOnOs\([^)]+\)/g,
  JUNIT5_DISABLED_ON_JRE: /@DisabledOnJre\([^)]+\)/g,
  TESTNG_IGNORE: /@Test\([^)]*enabled\s*=\s*false[^)]*\)/g,
  
  // C# patterns (NUnit, MSTest, xUnit)
  NUNIT_IGNORE: /\[Ignore\("((?:\\.|[^"\\])*)"\)\]/g,
  NUNIT_IGNORE_SIMPLE: /\[Ignore\]\s*\n\s*public\s+void\s+(\w+)/g,
  NUNIT_IGNORE_ATTR: /\[IgnoreAttribute\("((?:\\.|[^"\\])*)"\)\]/g,
  MSTEST_IGNORE: /\[Ignore\("((?:\\.|[^"\\])*)"\)\]/g,
  MSTEST_IGNORE_SIMPLE: /\[Ignore\]\s*\n\s*public\s+void\s+(\w+)/g,
  XUNIT_SKIP: /\[Fact\(Skip\s*=\s*"((?:\\.|[^"\\])*)"\)\]/g,
  XUNIT_THEORY_SKIP: /\[Theory\(Skip\s*=\s*"((?:\\.|[^"\\])*)"\)\]/g,
  
  // C++ patterns (Google Test, Catch2)
  GTEST_DISABLED: /DISABLED_TEST\(((?:\\.|[^,)])*),\s*((?:\\.|[^)])*)\)/g,
  GTEST_SKIP: /SKIP_TEST\("((?:\\.|[^"\\])*)"\)/g,
  CATCH2_SKIP: /TEST_CASE\([^)]*\[\.skip\]/g,
  CATCH2_HIDE: /TEST_CASE\([^)]*\[\.hide\]/g,
  
  // Go patterns
  GO_SKIP: /t\.Skip\("([^"]*)"\)/g,
  GO_SKIP_SIMPLE: /func\s+(\w+)\([^)]*\)\s*\{[^}]*t\.Skip\(\)/g,
  GO_SKIPF: /t\.Skipf\("([^"]*)"/g,
  GO_SKIPNOW: /func\s+(\w+)\([^)]*\)\s*\{[^}]*t\.SkipNow\(\)/g,
  
  // PHP patterns (PHPUnit)
  PHPUNIT_SKIP: /\$this->markTestSkipped\('((?:\\.|[^'\\])*)'\)/g,
  PHPUNIT_SKIP_DOUBLE: /\$this->markTestSkipped\("((?:\\.|[^"\\])*)"\)/g,
  PHPUNIT_INCOMPLETE: /\$this->markTestIncomplete\('((?:\\.|[^'\\])*)'\)/g,
  PHPUNIT_INCOMPLETE_DOUBLE: /\$this->markTestIncomplete\("((?:\\.|[^"\\])*)"\)/g,
  PHPUNIT_SKIP_ANNOTATION: /@skip\s+(.*)/g,
  
  // Rust patterns
  RUST_IGNORE: /#\[ignore\]\s*\n\s*fn\s+(\w+)/g,
  RUST_IGNORE_REASON: /#\[ignore\s*=\s*"([^"]*)"\]/g,
  
  // Kotlin patterns (JUnit, Spek)
  KOTLIN_IGNORE: /@Ignore\("((?:\\.|[^"\\])*)"\)/g,
  KOTLIN_DISABLED: /@Disabled\("((?:\\.|[^"\\])*)"\)/g,
  SPEK_SKIP: /skip\("((?:\\.|[^"\\])*)"\)/g,
  
  // Swift patterns (XCTest)
  SWIFT_SKIP: /XCTSkip\("((?:\\.|[^"\\])*)"\)/g,
  SWIFT_SKIP_SIMPLE: /XCTSkip\(\)/g,
  
  // Scala patterns (ScalaTest)
  SCALATEST_IGNORE: /ignore\("((?:\\.|[^"\\])*)"\)/g,
  SCALATEST_PENDING: /pending/g,
  
  // Dart patterns
  DART_SKIP: /skip:\s*"((?:\\.|[^"\\])*)"/g,
  DART_SKIP_SIMPLE: /skip:\s*true/g,
  
  // Groovy patterns (Spock)
  SPOCK_IGNORE: /@Ignore\("((?:\\.|[^"\\])*)"\)/g,
  SPOCK_IGNORE_REST: /@IgnoreRest/g,
  GROOVY_XSCENARIO: /\.xscenario\("((?:\\.|[^"\\])*)"?\)/g,
  
  // Perl patterns (Test::More)
  PERL_SKIP: /SKIP:\s*\{\s*skip\s+"((?:\\.|[^"\\])*)"/g,
  PERL_TODO: /TODO:\s*\{\s*local\s+\$TODO\s*=\s*"((?:\\.|[^"\\])*)"/g,
  
  // Elixir patterns (ExUnit)
  ELIXIR_SKIP: /@tag\s+:skip/g,
  ELIXIR_SKIP_REASON: /@tag\s+skip:\s*"((?:\\.|[^"\\])*)"/g,
  
  // Clojure patterns
  CLOJURE_SKIP: /\^:skip/g,
  
  // Cypress patterns
  CYPRESS_SKIP: /it\.skip\('((?:\\.|[^'\\])*)',/g,
  CYPRESS_SKIP_DOUBLE: /it\.skip\("((?:\\.|[^"\\])*)",/g,
  
  // Playwright patterns
  PLAYWRIGHT_SKIP: /test\.skip\('((?:\\.|[^'\\])*)',/g,
  PLAYWRIGHT_SKIP_DOUBLE: /test\.skip\("((?:\\.|[^"\\])*)",/g,
  PLAYWRIGHT_FIXME: /test\.fixme\('((?:\\.|[^'\\])*)',/g,
  PLAYWRIGHT_FIXME_DOUBLE: /test\.fixme\("((?:\\.|[^"\\])*)",/g,
  
  // Puppeteer patterns
  PUPPETEER_SKIP: /it\.skip\('((?:\\.|[^'\\])*)',/g,
  PUPPETEER_SKIP_DOUBLE: /it\.skip\("((?:\\.|[^"\\])*)",/g,
  
  // Robot Framework patterns
  ROBOT_SKIP: /\[Tags\]\s+skip/gi,
  
  // Selenium patterns (various languages)
  SELENIUM_IGNORE: /@Ignore\("((?:\\.|[^"\\])*)"\)/g,
  
  // Generic patterns
  TEST_IGNORE: /Test\.(Ignore|Ignored)\(\)/g,
  SKIP_COMMENT: /\/\/\s*SKIP:?\s*.*test.*|\/\/\s*.*test.*SKIP:?/gi,
  TODO_COMMENT: /\/\/\s*TODO:?\s*.*test.*|\/\/\s*.*test.*TODO:?/gi,
  FIXME_COMMENT: /\/\/\s*FIXME:?\s*.*test.*|\/\/\s*.*test.*FIXME:?/gi,
  HASH_SKIP_COMMENT: /#\s*SKIP:?\s*.*test.*|#\s*.*test.*SKIP:?/gi,
  HASH_TODO_COMMENT: /#\s*TODO:?\s*.*test.*|#\s*.*test.*TODO:?/gi,
  HASH_FIXME_COMMENT: /#\s*FIXME:?\s*.*test.*|#\s*.*test.*FIXME:?/gi
};

/**
 * Combined regex pattern for all skip patterns
 */
const COMBINED_SKIP_PATTERN = new RegExp(
  Object.values(SKIP_PATTERNS)
    .map(pattern => pattern.source)
    .join('|'),
  'g'
);

/**
 * File extensions to scan for tests
 */
const SUPPORTED_EXTENSIONS = [
  // JavaScript/TypeScript
  '.js', '.ts', '.jsx', '.tsx', '.mjs', '.cjs', '.coffee',
  // Python
  '.py', '.pyi', '.pyw',
  // Ruby
  '.rb', '.rbw',
  // Java/Kotlin/Scala/Groovy
  '.java', '.kt', '.kts', '.scala', '.groovy', '.gradle',
  // C/C++
  '.c', '.cpp', '.cxx', '.cc', '.c++', '.h', '.hpp', '.hxx',
  // C#
  '.cs', '.csx',
  // Go
  '.go',
  // PHP
  '.php', '.phtml', '.php3', '.php4', '.php5', '.phps',
  // Rust
  '.rs',
  // Swift
  '.swift',
  // Dart
  '.dart',
  // Perl
  '.pl', '.pm', '.t',
  // Elixir
  '.ex', '.exs',
  // Clojure
  '.clj', '.cljs', '.cljc', '.edn',
  // Robot Framework
  '.robot', '.resource',
  // Other
  '.feature', '.spec', '.test'
];

module.exports = {
  SKIP_PATTERNS,
  COMBINED_SKIP_PATTERN,
  SUPPORTED_EXTENSIONS
};
