<?php

function startsWith($haystack, $needle)
{
    $length = strlen($needle);
    return (substr($haystack, 0, $length) === $needle);
}

function fixLength($str, $length)
{
    if (strlen($str) === $length) {
        return $str;
    }

    if (strlen($str) < $length) {
        return str_pad($str, $length);
    }

    $sliceLength = $length - 3;
    $slice = substr($str, 0 - $sliceLength);

    return "..." . $slice;
}
