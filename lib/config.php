<?php

require_once dirname(__FILE__) . '/../vendor/autoload.php';
require_once dirname(__FILE__) . '/../lib/file.php';

// FIXME: read from config file
function loadConfig()
{
    $config = [
        "verbose" => false,
        "music_root" => abspath(dirname(__FILE__) . '/../www/music/'),
        "index_root" => abspath(dirname(__FILE__) . '/../www/cache/'),
        "search_root" => '/lud/search/',
        "web_path" => '/lud/music',
        "www_user" => 'www-data',
        "www_group" => 'www-data'
    ];

    mkdirIfNotExists($config['index_root']);

    return $config;
}
