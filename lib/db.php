<?php

require_once dirname(__FILE__) . '/../vendor/autoload.php';
require_once dirname(__FILE__) . '/../lib/config.php';

$lud_database_connection = null;

function db()
{
    global $lud_database_connection;

    if (empty($lud_database_connection)) {
        $cfg = loadConfig();
        $dbfile = $cfg['data_root'] . '/index.sqlite';

        echo "Connecting to database at $dbfile\n";
        $lud_database_connection = new SQLite3($dbfile);
    }

    return $lud_database_connection;
}

function initialize_database()
{
    db()->exec("CREATE VIRTUAL TABLE IF NOT EXISTS releases USING fts4(title, artists, mbid)");
    db()->exec("CREATE VIRTUAL TABLE IF NOT EXISTS tracks USING fts4(title, artists, mbid)");
    db()->exec("CREATE VIRTUAL TABLE IF NOT EXISTS discs USING fts4(title, mbid, pos)");
}
