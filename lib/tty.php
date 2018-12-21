<?php
/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2018  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 */

declare(strict_types=1);

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
