<?php

require(dirname(__FILE__) . '/../lib/file.php');

function cueFile($filename) {
    $pi = pathinfo($filename);
    return $pi['dirname'] . '/' . $pi['filename'] . '.cue';
}

function loadLength($filename) {
    $lines = file(cueFile($filename));

    $durationMarker = 'REM LUD_DURATION_IN_SECONDS ';
    foreach ($lines as $line) {
        if (startsWith($line, $durationMarker)) {
            return (double) trim(str_replace($durationMarker, '', $line));
        }
    }

    return null;
}

function saveLength($filename, $duration) {
    if ($duration === null) {
        return;
    }

    $data = [
        'duration' => (int) $duration,
        'durationDouble' => (double) $duration
    ];

    // FIXME: make constant
    $durationMarker = 'REM LUD_DURATION_IN_SECONDS ';
    $durationLine = $durationMarker . $duration . "\n";

    $lines = file(cueFile($filename));

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
                return (double) $duration;
            }
            // remove any existing lines with a duration;
        } else {
            // copy all other input lines to the output
            $output[] = $line;
        }
    }

    file_put_contents(cueFile($filename), implode("", $output));

    return (double) $duration;
}

function discLength($filename) {
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

function processDisc($arg) {
    $path = abspath($arg);

    $durationDouble = loadLength($path);
    if ($durationDouble === null) {
        $durationDouble = saveLength($path, discLength($path));
    }

    if ($durationDouble === null) {
        echo "$arg duration: <unknown>\n";
    } else {
        echo "$arg duration: " . (int) $durationDouble . " seconds\n";
    }

    return $durationDouble;
}
