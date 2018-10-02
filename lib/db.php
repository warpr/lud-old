<?php

require_once dirname(__FILE__) . '/../vendor/autoload.php';
require_once dirname(__FILE__) . '/../lib/config.php';

$lud_database_connection = null;

function __dbFilename()
{
    $cfg = loadConfig();
    return $cfg['index_root'] . '/index.sqlite';
}

function db()
{
    global $lud_database_connection;

    if (empty($lud_database_connection)) {
        $dbfile = __dbFilename();

        // FIXME: log this?
        // echo "Connecting to database at $dbfile\n";
        $lud_database_connection = new SQLite3($dbfile);
    }

    return $lud_database_connection;
}

function deleteDatabase()
{
    unlink(__dbFilename());
}

function initializeDatabase()
{
    $db = db();

    $ret = $db->exec(
        "CREATE VIRTUAL TABLE IF NOT EXISTS releases USING fts5(title, artist, year, path, duration, mbid UNINDEXED)"
    );
    if (!$ret) {
        echo "Error creating releases index in SQLite database\n";
    }
    $ret = $db->exec(
        "CREATE VIRTUAL TABLE IF NOT EXISTS tracks USING fts5(title, artist, path, duration, mbid UNINDEXED, pos, disc)"
    );
    if (!$ret) {
        echo "Error creating tracks index in SQLite database\n";
    }
    $ret = $db->exec(
        "CREATE VIRTUAL TABLE IF NOT EXISTS discs USING fts5(title, path, duration, mbid UNINDEXED, pos UNINDEXED)"
    );
    if (!$ret) {
        echo "Error creating discs index in SQLite database\n";
    }
}
