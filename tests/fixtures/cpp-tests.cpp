#include <gtest/gtest.h>

// Normal test
TEST(ExampleTest, NormalTest) {
    EXPECT_EQ(1, 1);
}

// Disabled test
DISABLED_TEST(ExampleTest, DisabledTest) {
    EXPECT_EQ(1, 2);  // This should not run
}

// Another disabled test with different naming
DISABLED_TEST(AnotherTest, AnotherDisabledTest) {
    EXPECT_TRUE(false);  // This should not run
}
