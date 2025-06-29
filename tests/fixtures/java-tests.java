package com.example.test;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Disabled;
import org.junit.Ignore;
import org.testng.annotations.Test;

public class JavaTestExample {
    @Test
    public void normalTest() {
        // This test runs normally
    }

    @Ignore("This test is ignored in JUnit 4")
    @Test
    public void junit4IgnoredTest() {
        // This should not run
    }

    @Disabled("This test is disabled in JUnit 5")
    @Test
    public void junit5DisabledTest() {
        // This should not run
    }

    @Disabled
    @Test
    public void junit5DisabledTestSimple() {
        // This should not run
    }

    @org.testng.annotations.Test(enabled = false)
    public void testNgDisabledTest() {
        // This should not run
    }
}
