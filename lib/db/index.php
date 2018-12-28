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

class Index
{
    use Model;

    public static function create()
    {
        // device 0 is master entry
        static::_createTable("
            CREATE VIRTUAL TABLE IF NOT EXISTS records USING fts5(
                title,
                artist,
                year,
                path,
                duration,
                type,
                mbid UNINDEXED,
                pos,
                disc
            )
        ");
    }
}
