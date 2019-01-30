<?php
/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2018  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 */

declare(strict_types=1);

require_once __DIR__ . '/../lib/string.php';
require_once __DIR__ . '/../lib/config.php';

function searchFile($root, $filename)
{
    $results = new RegexIterator(
        new RecursiveIteratorIterator(new RecursiveDirectoryIterator($root)),
        ',/' . preg_quote($filename) . '$,',
        RecursiveRegexIterator::GET_MATCH
    );
    foreach ($results as $fullPath => $filename) {
        yield dirname(abspath($fullPath));
    }
}

function mkdirIfNotExists($dir)
{
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
}

function fixPermissions()
{
    $cfg = loadConfig();
    $group = $cfg['www_group'];
    $dir = $cfg['index_root'];

    $userInfo = posix_getpwuid(posix_getuid());
    $user = $userInfo['name'];

    // FIXME: do this the PHP native way
    if (is_executable("/bin/chown")) {
        system("/bin/chown -R" . " " . escapeshellarg("$user:$group") . " " . escapeshellarg($dir));
        system("/bin/chmod -R g+ws " . escapeshellarg($dir));
    }
}

function abspath($filename)
{
    $fullPath = startsWith($filename, '/') ? $filename : getcwd() . '/' . $filename;
    $parts = explode("/", $fullPath);

    $ret = [];
    foreach ($parts as $part) {
        if (empty($part) || $part == '.') {
            continue;
        }

        if ($part == '..') {
            if (count($ret) > 0) {
                array_pop($ret);
            }
        } else {
            $ret[] = $part;
        }
    }

    return '/' . implode("/", $ret);
}
