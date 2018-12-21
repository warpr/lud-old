<?php
/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2018  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 */

declare(strict_types=1);

require_once dirname(__FILE__) . '/../lib/file.php';

function loadLength($cueFile)
{
    $lines = @file($cueFile);
    if (empty($lines)) {
        return null;
    }

    $durationMarker = 'REM LUD_DURATION_IN_SECONDS ';
    foreach ($lines as $line) {
        if (startsWith($line, $durationMarker)) {
            return (float) trim(str_replace($durationMarker, '', $line));
        }
    }

    return null;
}

function saveLength($cueFile, $duration)
{
    if ($duration === null) {
        return;
    }

    $data = [
        'duration' => (int) $duration,
        'durationDouble' => (float) $duration
    ];

    // FIXME: make constant
    $durationMarker = 'REM LUD_DURATION_IN_SECONDS ';
    $durationLine = $durationMarker . $duration . "\n";

    if (!is_readable($cueFile)) {
        return;
    }

    $lines = file($cueFile);

    $output = [];
    $inserted = false;
    foreach ($lines as $line) {
        if (!$inserted && !startsWith($line, 'REM ')) {
            $inserted = true;
            $output[] = $durationLine;
        }

        if (startsWith($line, $durationMarker)) {
            if ($line == $durationLine) {
                // duration already recorded in .cue file, and unchanged
                return (float) $duration;
            }
            // remove any existing lines with a duration;
        } else {
            // copy all other input lines to the output
            $output[] = $line;
        }
    }

    file_put_contents($cueFile, implode("", $output));

    return (float) $duration;
}

function discLength($cueFile)
{
    $lines = @file($cueFile);
    if (empty($lines)) {
        return null;
    }

    $files = [];
    foreach ($lines as $line) {
        if (preg_match("/^FILE\s+(.*)\s+[A-Z0-9]+$/", $line, $matches)) {
            $filename = dirname($cueFile) . '/' . trim(trim($matches[1]), '"');

            if (is_readable($filename)) {
                $files[] = $filename;
            }
        }
    }

    if (empty($files)) {
        $files[] = preg_replace("/\.cue$/", ".m4a", $cueFile);
    }

    $durations = [];
    foreach ($files as $file) {
        $durations[] = mediaLength($file);
    }

    return array_sum($durations);
}

function mediaLength($filename)
{
    $ffprobe = `which ffprobe`;

    if (empty($ffprobe)) {
        echo "WARNING: ffprobe not installed, cannot determine duration of $filename\n";
        return null;
    } else {
        $arg = escapeshellarg($filename);
        $cmd = "ffprobe -i $arg -show_entries format=duration -v quiet";

        $output = `$cmd`;

        if (preg_match("/\[FORMAT\].*duration=([0-9.]*).*\[\/FORMAT\]/ms", $output, $matches)) {
            return $matches[1];
        }
    }

    echo "WARNING: ffprobe failed on $filename\n";
    return null;
}

function processDisc($arg, $options = [])
{
    $path = abspath($arg);

    if (preg_match(",/\.git/,", $path)) {
        echo "Skipping files in .git folder: $path\n";
        return;
    }

    if (!preg_match(",\.cue$,", $path)) {
        echo "Not a .cue file: $path\n";
        return;
    }

    $durationDouble = loadLength($path);
    if ($durationDouble === null) {
        $durationDouble = saveLength($path, discLength($path));
    }

    if (!empty($options['verbose'])) {
        if ($durationDouble === null) {
            echo "$arg duration: <unknown>\n";
        } else {
            echo "$arg duration: " . (int) $durationDouble . " seconds\n";
        }
    }

    return $durationDouble;
}
