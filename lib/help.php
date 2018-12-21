<?php
/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2018  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 */

declare(strict_types=1);

function help()
{
    echo "This is lud.\n";
    echo "\n";
    echo "FIXME: help goes here\n";
}

/**
commands:

add                can be configured to be any of the following, defaults to "add-now".
add-now,   now     play the selected item immediately, any currently playing item will be split up, with the remaining time queued after the newly queued item.
add-next,  next    play the selected item after the currently playing item (typically an album, though it could be a single song or an album selection).
add-later, later   add the selected item after the most recently enqueued item by play-next / play-later, if that was less than a minute ago, otherwise add to the end of the current playlist.
add-last,  last    add the selected item at the end of the playlist

resume, play       resume playback
pause              pause playback

skip               skip the currently playing item, start playing the next item
skip-song          skip the currently playing song, start playing the next song
prev               return to the previously playing item
prev-song          return to the previously playing song
seek <amount>      seek to the specified position (e.g. "seek 12m20s" will seek to the position 12 minutes and 20 seconds into the current item)
seek [+-]<amount>  seek relative to current position

clear              clear the playlist
crop               remove all items from the playlist, except the current playling song

now-playing, np    display information about the currently playing item
list               display current playlist

*/
