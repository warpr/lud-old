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
require_once __DIR__ . '/../lib/db/index.php';
require_once __DIR__ . '/../lib/db/playlist.php';
require_once __DIR__ . '/../lib/help.php';
require_once __DIR__ . '/../lib/playlist.php';
require_once __DIR__ . '/../lib/playback.php';
require_once __DIR__ . '/../lib/update-index.php';
require_once __DIR__ . '/../lib/search-command.php';

function init()
{
    $createdDatabase = false;
    if (!Devices::exists()) {
        Devices::create();
        $createdDatabase = true;
    }

    if (!Index::exists()) {
        Index::create();
        $createdDatabase = true;
    }

    if (!Playlist::exists()) {
        Playlist::create();
        $createdDatabase = true;
    }

    if ($createdDatabase) {
        fixPermissions();
    }
}

function main($argv)
{
    $script = array_shift($argv);
    if (empty($argv)) {
        return help();
    }

    $command = array_shift($argv);
    if (empty($command) || $command == 'help' || $command == '--help') {
        return help();
    }

    init();

    switch ($command) {
        case "add-last":
            ludAddLast($argv);
            break;
        case "list":
            listPlaylist();
            break;
        case "reset-databases":
            Devices::reset();
            // Don't reset the index, as it takes a long time to rebuild... and it is
            // reset automatically whenever it is rebuilt.
            Playlist::reset();
            fixPermissions();
            break;
        case "clear":
            clearPlaylist();
            break;
        case "np":
        case "now-playing":
            nowPlayingCommand();
            break;
        case "pause":
            pauseCommand();
            break;
        case "play":
            playCommand();
            break;
        case "search":
            searchCommand($argv);
            break;
        case "index":
            $cmd = array_shift($argv);
            $terms = implode(" ", $argv);
            updateIndex($terms);
            fixPermissions();
            break;
        default:
            help();
    }
}
