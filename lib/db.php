<?php
/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2018  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 */

declare(strict_types=1);

require_once dirname(__FILE__) . '/../vendor/autoload.php';
require_once dirname(__FILE__) . '/../lib/config.php';

$lud_database_connection = null;

function __dbFilename(string $name)
{
    $cfg = loadConfig();
    return $cfg['index_root'] . "/$name.sqlite";
}

function db(string $name)
{
    global $lud_database_connection;

    if (empty($lud_database_connection)) {
        $dbfile = __dbFilename($name);

        // FIXME: log this?
        // echo "Connecting to database at $dbfile\n";
        $lud_database_connection = new SQLite3($dbfile);
        $lud_database_connection->busyTimeout(1000);
        $lud_database_connection->exec('PRAGMA journal_mode = wal;');
    }

    return $lud_database_connection;
}

function deleteDatabase(string $name)
{
    unlink(__dbFilename($name));
}

function databaseExists(string $name)
{
    return is_readable(__dbFilename($name));
}

function createIndex($db)
{
    $ret = $db->exec(
        "CREATE VIRTUAL TABLE IF NOT EXISTS records USING fts5(title, artist, year, path, duration, type, mbid UNINDEXED, pos, disc)"
    );
    if (!$ret) {
        echo "Error creating records index in SQLite database\n";
    }
}

function createPlaylist($db)
{
    $sql = [
        "CREATE TABLE playlist (id INTEGER PRIMARY KEY, path TEXT, mbid TEXT, ranges TEXT)",
        // device 0 is master entry
        "CREATE TABLE devices (id INTEGER PRIMARY KEY, playlist_id INTEGER, device TEXT, pos INTEGER, paused INTEGER)"
    ];

    foreach ($sql as $query) {
        $ret = $db->exec($query);
        if (!$ret) {
            echo "Error creating playlists in SQLite database\n";
        }
    }
}

function initializeDatabase(string $name)
{
    $db = db($name);

    if ($name == 'index') {
        return createIndex($db);
    }

    if ($name == 'playlist') {
        return createPlaylist($db);
    }
}
