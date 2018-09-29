<?php

function mkdirIfNotExists($dir)
{
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
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
