using NUnit.Framework;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Xunit;

namespace TestProject
{
    [TestFixture]
    public class CSharpTestExample
    {
        [Test]
        public void NormalTest()
        {
            // This test runs normally
        }

        [Test]
        [Ignore("This test is ignored in NUnit")]
        public void NUnitIgnoredTest()
        {
            // This should not run
        }

        [Test]
        [Ignore]
        public void NUnitIgnoredTestSimple()
        {
            // This should not run
        }

        [TestMethod]
        [Ignore("This test is ignored in MSTest")]
        public void MSTestIgnoredTest()
        {
            // This should not run
        }

        [Fact(Skip = "This test is skipped in xUnit")]
        public void XUnitSkippedTest()
        {
            // This should not run
        }

        [Theory(Skip = "This theory is skipped in xUnit")]
        [InlineData(1)]
        public void XUnitSkippedTheory(int value)
        {
            // This should not run
        }
    }
}
