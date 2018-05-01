/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2018  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 */

function framesToSeconds(str) {
    const parts = str.split(':');
    if (parts.length < 3) {
        return null;
    }

    const minutes = parseInt(parts[0], 10);
    const seconds = parseInt(parts[1], 10);
    const frames = parseInt(parts[2], 10);

    // 75 frames per second.

    return (minutes * 60) + seconds + (frames / 75);
}

function removeQuotes(str) {
    if (str[0] != str[str.length - 1]) {
        // start and end quotes don't match
        return str;
    }

    if (str[0] === '"' || str[0] === "'") {
        return str.substr(1, str.length - 2);
    }

    return str;
}

function parseCommand(command, args, track) {
    switch(command) {
    case "REM":
        if (args[0] == 'MUSICBRAINZ_ALBUM_ID' && args.length > 1) {
            return { "mbid": args[1] };
        }

        if (args[0] == 'COMMENT' && args.length > 1) {
            args.shift();
            const comments = track.comments ? track.comments : [];
            comments.push(args.join(' '));
            return { comments: comments };
        }

        console.log("Skipping unrecognized REM line", command, args);
        return {};
    case "CATALOG":
        return { "barcode": args.join(' ') };
    case "TITLE":
        return { "title": removeQuotes(args.join(' ')) };
    case "PERFORMER":
        return { "artist": removeQuotes(args.join(' ')) };
    case "FILE":
        const format = args.pop();
        return {
            "filename": removeQuotes(args.join(' ')),
            "format": format
        };
    case "TRACK":
        if (args.pop() != "AUDIO") {
            console.log("WARNING: non-audio tracks are untested");
        }
        return { "pos": parseInt(args[0], 10) };
    case "INDEX":
        const startTime = args.pop();
        const idx = args.pop();
        if (parseInt(idx, 10) !== 1) {
            console.log("WARNING: only INDEX 01 is supported");
            return {};
        }

        const start = {
            "minutes-seconds-frames": startTime,
            "seconds": framesToSeconds(startTime),
        };

        return { start: start };
    case "":
        return {};
    default:
        console.log("Unrecognized command:", command, args);
        return {};
    }
}

export function parseCue(cueStr) {
    const lines = cueStr.split(/[\n|\r|\r\n]/).map(x => x.trim());

    const tracks = lines.reduce((memo, line) => {
        if (!memo.length) {
            memo[0] = {}
        }

        const parts = line.split(/ /);

        const command = parts.shift();
        if (command == 'TRACK') {
            memo.push({})
        }

        Object.assign(memo[memo.length - 1],
            parseCommand(command, parts, memo[memo.length - 1]));

        return memo;
    }, []);

    // return lines;
    return tracks;
}


