<?php

function getTerminalDimensions()
{
    $output = `stty -a`;

    if (preg_match("/speed.*baud; rows ([0-9]+); columns ([0-9]+)/", $output, $matches)) {
        return [(int) $matches[2], (int) $matches[1]];
    }

    return [80, 40];
}

function getTerminalWidth()
{
    list($x, $y) = getTerminalDimensions();

    return $x;
}

function getTerminalHeight()
{
    list($x, $y) = getTerminalDimensions();

    return $y;
}

function clearLine()
{
    echo "\033[A\r\033[2K";
}
