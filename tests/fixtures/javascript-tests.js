const { describe, it, test } = require('@jest/globals');

describe('Sample test suite', () => {
  it('should run this test', () => {
    expect(true).toBe(true);
  });

  it.skip('should skip this test', () => {
    expect(false).toBe(true);
  });

  test.skip('should skip this test too', () => {
    expect(1).toBe(2);
  });
});

xdescribe('Completely skipped suite', () => {
  it('should never run', () => {
    expect(true).toBe(false);
  });
});
