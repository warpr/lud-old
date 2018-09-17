<?php

require_once dirname(__FILE__) . '/../lib/file.php';

// FIXME: read from config file
function loadConfig()
{
    return [
        "music_root" => abspath(dirname(__FILE__) . '/../www/music/'),
        "index_root" => abspath(dirname(__FILE__) . '/../.cache'),
        "web_root" => '/lud/music'
    ];
}
