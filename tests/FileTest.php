<?php
/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2018  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 */

require_once __DIR__ . '/../lib/file.php';

use PHPUnit\Framework\TestCase;

class FileTest extends TestCase
{
    public function testAbsPath()
    {
        chdir('/');

        $this->assertEquals("/", abspath("/"), "root");
        $this->assertEquals("/", abspath("/../../"), "beyond root");
        $this->assertEquals("/foo/bar", abspath("/foo/qux/../bar"), "one up");
        $this->assertEquals("/bar", abspath("/foo/qux/../../bar/"), "double up");
        $this->assertEquals("/foo/bar", abspath("/foo/././qux././//.//../bar"), "nonsense");

        chdir('/tmp');

        $this->assertEquals("/", abspath("/"), "tmp root");
        $this->assertEquals("/tmp", abspath(""), "tmp tmp");
        $this->assertEquals("/tmp", abspath("."), "tmp dot");
        $this->assertEquals("/", abspath("../../"), "tmp beyond root");
        $this->assertEquals("/tmp/foo/bar", abspath("foo/qux/../bar"), "tmp one up");
        $this->assertEquals("/tmp/bar", abspath("foo/qux/../../bar/"), "tmp double up");
        $this->assertEquals("/tmp/foo/bar", abspath("foo/././qux././//.//../bar"), "tmp nonsense");
        $this->assertEquals("/foo/bar", abspath("/foo/bar"), "root anchored");
    }
}
