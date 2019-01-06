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

class Devices
{
    use Model;

    public static function create()
    {
        // NOTE: pos and updated_at store their times in milliseconds, to
        // allow multiple devices to sync up their playback fairly accurately.
        //
        // disc is text, so that we can distinguish between "disc2.cue" and
        // "disc02.cue".  The value stored is the disc basename, e.g. "disc2".
        static::_createTable("
            CREATE TABLE devices (
                id INTEGER PRIMARY KEY,
                device TEXT,
                playlist_id INTEGER,
                pos INTEGER,
                disc TEXT,
                updated_at INTEGER,
                paused INTEGER
            )
        ");

        // device 0 is master entry
        $query = static::connect()->prepare(
            "INSERT INTO devices VALUES (0, 'master', NULL, 0, NULL, 0, 1)"
        );
        $query->execute();
    }
}
