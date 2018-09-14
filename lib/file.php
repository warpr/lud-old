<?php

function startsWith($haystack, $needle)
{
    $length = strlen($needle);
    return (substr($haystack, 0, $length) === $needle);
}

function abspath($filename) {
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
