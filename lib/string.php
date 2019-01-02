<?php
/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2018  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 */

declare(strict_types=1);

function contains($haystack, $needle)
{
    return strpos($haystack, $needle) !== false;
}

function startsWith($haystack, $needle)
{
    $length = strlen($needle);
    return substr($haystack, 0, $length) === $needle;
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

function slug($str)
{
    return trim(
        preg_replace('/--+/', '-', preg_replace('/[^A-Za-z0-9-]+/', '-', strtolower(trim($str)))),
        '-'
    );
}
