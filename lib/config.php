<?php
/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2018  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 */

declare(strict_types=1);

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../lib/file.php';

// FIXME: read from config file
function loadConfig()
{
    $config = [
        "verbose" => false,
        "music_root" => abspath(__DIR__ . '/../www/music/'),
        "index_root" => abspath(__DIR__ . '/../data/'),
        "search_root" => '/lud/search.php',
        "web_path" => '/lud/music',
        "www_user" => 'www-data',
        "www_group" => 'www-data'
    ];

    mkdirIfNotExists($config['index_root']);

    return $config;
}
