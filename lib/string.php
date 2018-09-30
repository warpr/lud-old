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

function getYear($dateStr)
{
    if (empty($dateStr)) {
        return null;
    }

    if (preg_match("/([0-9]{4})-[0-9]{2}-[0-9]{2}/", $dateStr, $matches)) {
        return $matches[1];
    }

    return null;
}
