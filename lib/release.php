<?php
/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2018  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 */

declare(strict_types=1);

require_once __DIR__ . '/../lib/config.php';
require_once __DIR__ . '/../lib/file.php';

function firstDisc($albumPath)
{
    $cfg = loadConfig();

    $localAlbumPath = str_replace($cfg['web_path'], abspath($cfg['music_root']), $albumPath);

    foreach (["1", "01", "001", "0001"] as $discNo) {
        $discName = "disc${discNo}.cue";
        $fullPath = $localAlbumPath . '/' . $discName;

        if (is_readable($fullPath)) {
            return $discName;
        }
    }

    // FIXME: add fall back mechanism for releases where disc 1 is missing (perhaps the first
    // disc is a data disc, or a superfluous vinyl disc in a vinyl + cd release).
    // ps. Are there any releases with a disc0.cue ?

    return null;
}
