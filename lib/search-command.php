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
require_once __DIR__ . '/../lib/search.php';
require_once __DIR__ . '/../lib/config.php';
require_once __DIR__ . '/../lib/db/index.php';

function searchCommand($argv)
{
    $terms = implode(" ", $argv);
    $results = search($terms, 0, 25);
    $total = searchCount($terms);
    Index::connect()->close();

    $cfg = loadConfig();

    foreach ($results as $row) {
        $location = str_replace($cfg['web_path'] . '/', '', $row['path']);

        if ($row['type'] == 'track') {
            echo $row['artist'] .
                ' - ' .
                $row['title'] .
                ' (' .
                $location .
                ', ' .
                $row['disc'] .
                '-' .
                $row['pos'] .
                ")\n";
        } elseif ($row['type'] == 'disc') {
            echo $row['title'] . ' (' . $location . ")\n";
        } else {
            echo $row['artist'] . ' - ' . $row['title'] . ' (' . $location . ")\n";
        }
    }

    echo "Total results: $total.\n";
}
