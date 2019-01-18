<?php
/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2018  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 */

declare(strict_types=1);

require_once __DIR__ . '/../lib/db/devices.php';
require_once __DIR__ . '/../lib/db/playlist.php';
require_once __DIR__ . '/../lib/playlist.php';
require_once __DIR__ . '/../lib/release.php';

function pauseCommand()
{
    $query = Devices::connect()->prepare(
        "UPDATE devices SET paused = 1, updated_at = strftime('%s', 'now') WHERE id = 0"
    );
    $query->execute();
}

function resumeCommand()
{
    $query = Devices::connect()->prepare(
        "UPDATE devices SET paused = 0, updated_at = strftime('%s', 'now') WHERE id = 0"
    );
    $query->execute();
}

function playCommand()
{
    $nowPlaying = nowPlaying();
    if (!empty($nowPlaying['playlist_id'])) {
        /* return resumeCommand(); */
    }

    $query = Playlist::connect()->prepare("SELECT * FROM playlist ORDER BY id LIMIT 1");
    $result = $query->execute();

    $row = $result->fetchArray(SQLITE3_ASSOC);
    if (empty($row)) {
        echo "Nothing to play, queue up some stuff first\n";
        pauseCommand();
        return;
    }

    $playlistId = $row['id'];
    $firstDisc = basename(firstDisc($row['path']), '.cue');

    $now = "" . floor(microtime(true) * 1000);

    $query = Devices::connect()->prepare(
        "UPDATE devices SET paused = 0, updated_at = :now, playlist_id = :playlist, disc = :disc, pos = 0 WHERE id = 0"
    );
    $query->bindParam(':playlist', $playlistId);
    $query->bindParam(':disc', $firstDisc);
    $query->bindParam(':now', $now);
    $query->execute();
}

function nowPlaying($options = [])
{
    $query = Devices::connect()->prepare("SELECT * FROM devices WHERE id = 0");
    $result = $query->execute();

    $row = $result->fetchArray(SQLITE3_ASSOC);

    if (empty($row) || empty($row['playlist_id']) || empty($options['details'])) {
        return $row;
    }

    $query = Playlist::connect()->prepare("SELECT * FROM playlist WHERE id = :playlist");
    $query->bindParam(':playlist', $row['playlist_id']);
    $result = $query->execute();

    $row['playlist'] = $result->fetchArray(SQLITE3_ASSOC);

    return $row;
}

function nowPlayingCommand()
{
    $np = nowPlaying(['details' => true]);

    if (empty($np) || empty($np['playlist_id'])) {
        echo "Not playing anything.\n";
        return;
    }

    $item = $np['playlist'];

    echo "Now " .
        ($np['paused'] ? "paused" : "playing") .
        ": " .
        formatPlaylistItem($item['artist'], $item['title'], $item['duration']) .
        "\n";
}

function status($options = [])
{
    $query = Devices::connect()->prepare("SELECT * FROM devices ORDER BY id");
    $result = $query->execute();

    while (($row = $result->fetchArray(SQLITE3_ASSOC))) {
        yield $row;
    }

    /* } */

    /* $query = Playlist::connect()->prepare("SELECT * FROM playlist WHERE id = :playlist"); */
    /* $query->bindParam(':playlist', $row['playlist_id']); */
    /* $result = $query->execute(); */

    /* $row['playlist'] = $result->fetchArray(SQLITE3_ASSOC); */

    /* return $row; */
}

function statusCommand()
{
    $devices = status();

    foreach ($devices as $device) {
        printf(
            "%4d. [%16s] %s %s\n",
            $device['id'],
            formatDurationMilliseconds($device['pos']),
            $device['paused'] ? "⏸ " : "▶️ ",
            $device['device']
        );
    }
}
