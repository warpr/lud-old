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
        "CREATE VIRTUAL TABLE IF NOT EXISTS records USING fts5(title, artist, year, path, duration, type, mbid UNINDEXED, pos, disc)"
    );
    if (!$ret) {
        echo "Error creating records index in SQLite database\n";
    }
}
