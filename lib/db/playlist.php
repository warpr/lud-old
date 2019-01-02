<?php
/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2018  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 */

declare(strict_types=1);

require_once __DIR__ . '/model.php';

class Playlist
{
    use Model;

    public static function create()
    {
        // device 0 is master entry
        static::_createTable("
            CREATE TABLE playlist (
                id INTEGER PRIMARY KEY,
                path TEXT,
                mbid TEXT,
                artist TEXT,
                title TEXT,
                duration INTEGER,
                ranges TEXT
            )
        ");
    }
}
