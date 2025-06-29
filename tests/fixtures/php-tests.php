<?php

use PHPUnit\Framework\TestCase;

class PHPTestExample extends TestCase
{
    public function testNormal()
    {
        $this->assertTrue(true);
    }

    public function testSkipped()
    {
        $this->markTestSkipped('This test is skipped');
    }

    public function testIncomplete()
    {
        $this->markTestIncomplete('This test is incomplete');
    }

    /**
     * @skip This test should be skipped
     */
    public function testWithSkipAnnotation()
    {
        $this->assertTrue(false);
    }
}
