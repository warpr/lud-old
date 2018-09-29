<?php

require_once dirname(__FILE__) . '/../vendor/autoload.php';
require_once dirname(__FILE__) . '/../lib/file.php';

// FIXME: read from config file
function loadConfig()
{
    $xdg = new \XdgBaseDir\Xdg();

    $config = [
        "data_root" => abspath($xdg->getHomeDataDir() . '/lud/'),
        "music_root" => abspath(dirname(__FILE__) . '/../www/music/'),
        "index_root" => abspath(dirname(__FILE__) . '/../.cache'),
        "web_root" => '/lud/music'
    ];

    mkdirIfNotExists($config['data_root']);

    return $config;
}
