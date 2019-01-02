<?php
/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2018  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 */

declare(strict_types=1);

require_once __DIR__ . '/../lib/db/playlist.php';
require_once __DIR__ . '/../lib/file.php';
require_once __DIR__ . '/../lib/metadata.php';

function findMedia($path)
{
    foreach (searchFile($path, "metadata.json") as $albumPath) {
        $webPath = findWebAccessiblePath($albumPath);
        if ($webPath) {
            $metadata = loadAlbum($webPath);
            yield $metadata;
        }
    }
}

function releaseDuration($release)
{
    $duration = null;
    foreach ($release['media'] as $disc) {
        $duration += $disc['duration'];
    }

    return $duration;
}

function insertItem($release)
{
    $duration = releaseDuration($release);

    $query = Playlist::connect()->prepare(
        "INSERT INTO playlist (path, mbid, artist, title, duration) VALUES (:path, :mbid, :artist, :title, :duration)"
    );
    $query->bindParam(':path', $release['path']);
    $query->bindParam(':mbid', $release['mbid']);
    $query->bindParam(':artist', $release['artist']);
    $query->bindParam(':title', $release['title']);
    $query->bindParam(':duration', $duration);
    $query->execute();
}

function formatDuration($str)
{
    $zero = new \DateTime('@0');
    $time = new \DateTime("@$str");
    $interval = $zero->diff($time);

    $units = ["%a" => " days, ", "%h" => "h", "%i" => "m", "%s" => "s"];
    $output = false;

    $ret = "";
    foreach ($units as $formatter => $suffix) {
        $value = $interval->format($formatter);
        if ($output || $value > 0) {
            $output = true;
            $ret .= $value . $suffix;
        }
    }

    return $ret;
}

function formatPlaylistItem($artist, $title, $duration)
{
    return sprintf("%s - %s (%s)", $artist, $title, formatDuration($duration));
}

function listPlaylist()
{
    $query = Playlist::connect()->prepare("SELECT * FROM playlist");
    $result = $query->execute();

    $pos = 1;
    $totalDuration = 0;
    while (($row = $result->fetchArray(SQLITE3_ASSOC))) {
        $totalDuration += $row['duration'];
        printf(
            "%3d. %s\n",
            $pos++,
            formatPlaylistItem($row['artist'], $row['title'], $row['duration'])
        );
    }

    echo "\n";
    echo "Total playlist length: " . formatDuration($totalDuration) . "\n";
}

function clearPlaylist()
{
    $query = Playlist::connect()->prepare("DELETE FROM playlist");
    $query->execute();
}

function ludAddLast($args)
{
    $path = array_shift($args);

    if (is_dir($path)) {
        foreach (findMedia($path) as $release) {
            insertItem($release);
            echo "Added " .
                formatPlaylistItem(
                    $release['artist'],
                    $release['title'],
                    releaseDuration($release)
                ) .
                "\n";
        }
    } else {
        echo "Argument not supported yet [$path]\n";
    }
}
