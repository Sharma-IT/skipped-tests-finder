import unittest
import pytest

class TestExampleExtended(unittest.TestCase):
    def test_normal_test(self):
        self.assertTrue(True)

    @unittest.skip("Reason for skipping with double quotes")
    def test_skipped_test_double_quotes(self):
        self.assertTrue(False)

    @unittest.skip('Reason for skipping with single quotes')
    def test_skipped_test_single_quotes(self):
        self.assertTrue(False)

    @unittest.skipIf(True, "Skip if condition is true")
    def test_skipped_if(self):
        self.assertTrue(False)

    @unittest.skipUnless(False, "Skip unless condition is true")
    def test_skipped_unless(self):
        self.assertTrue(False)

class TestPytestExample:
    def test_normal_pytest(self):
        assert True
    
    @pytest.mark.skip(reason="Pytest skip with reason")
    def test_pytest_skip_with_reason(self):
        assert False
    
    @pytest.mark.skip
    def test_pytest_skip_simple(self):
        assert False
    
    @pytest.mark.skipif(True, reason="Pytest skipif")
    def test_pytest_skipif(self):
        assert False

if __name__ == '__main__':
    unittest.main()
