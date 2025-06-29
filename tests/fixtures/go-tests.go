package main

import (
    "testing"
)

func TestNormal(t *testing.T) {
    // This test runs normally
}

func TestSkipped(t *testing.T) {
    t.Skip("This test is skipped")
}

func TestSkippedSimple(t *testing.T) {
    t.Skip()
}

func TestSkippedWithFormat(t *testing.T) {
    t.Skipf("This test is skipped with format: %s", "reason")
}

func TestSkippedNow(t *testing.T) {
    t.SkipNow()
}
