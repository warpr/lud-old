/**
 * This file is part of lûd, an opinionated browser based media player.
 * Copyright (C) 2019  Kuno Woudt <kuno@frob.nl>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 *
 * @flow
 */

import package_json from '../package.json';

export function version() {
    return package_json.version;
}

export function copyright() {
    console.log("lûd v" + version());
    console.log("Copyright 2019  Kuno Woudt <kuno@frob.nl>");
    console.log("");
    console.log("This program is free software: you can redistribute it and/or modify");
    console.log("it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.");
    console.log("");
}

export function help() {
    console.log('running exported help');
    copyright();
    usage();
}

export function usage()
{
    console.log("Usage: lud <command> [arguments]");
    console.log(`
Arguments:

    <music>     Any album folder, an album folder should have these files (see README.md):
                  - metadata.json, MusicBrainz metadata about the release
                  - cover.jpg, cover art as .jpg
                  - disc*.cue, one or more cue files, numbered e.g. disc1.cue, disc2.cue.
                  - disc*.mp4, one or more mp4 files, should match the .cue file.

    <time>      When seeking, any integer will be interpreted in seconds.  \"h\" and \"m\"
                suffixes are supported to signify hours and minutes.  Where appropriate \"+\"
                and \"-\" are used to seek forward or backward.  Examples:

                  lud seek 2m30s     # seek to 2:30 in the current song
                  lud seek -15       # go back 15 seconds

Commands:

    help                       This help

    add-last, last   <music>   Add the selected item at the end of the playlist
    list                       Display current playlist

    clear                      Clear the playlist

    index                      Rebuild the search index
                `);
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

crop               remove all items from the playlist, except the current playling song

now-playing, np    display information about the currently playing item

*/
