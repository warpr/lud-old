/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2018  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 *
 *   @flow
 */

function framesToSeconds(str /* : string */) {
    const parts = str.split(':');
    if (parts.length < 3) {
        return null;
    }

    const minutes = parseInt(parts[0], 10);
    const seconds = parseInt(parts[1], 10);
    const frames = parseInt(parts[2], 10);

    // 75 frames per second.

    return minutes * 60 + seconds + frames / 75;
}

function removeQuotes(str /* : string */) {
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
    switch (command) {
        case 'REM':
            if (args[0] == 'MUSICBRAINZ_ALBUM_ID' && args.length > 1) {
                return { mbid: args[1] };
            }

            if (args[0] == 'COMMENT' && args.length > 1) {
                args.shift();
                const comments = track.comments ? track.comments : [];
                comments.push(args.join(' '));
                return { comments: comments };
            }

            if (args[0] == 'LUD_DURATION_IN_SECONDS') {
                const duration = parseFloat(args[1]);
                return { duration: Number.isNaN(duration) ? null : duration };
            }

            console.log('Skipping unrecognized REM line', command, args);
            return {};
        case 'CATALOG':
            return { barcode: args.join(' ') };
        case 'TITLE':
            return { title: removeQuotes(args.join(' ')) };
        case 'PERFORMER':
            return { artist: removeQuotes(args.join(' ')) };
        case 'FILE':
            const format = args.pop();
            return {
                filename: removeQuotes(args.join(' ')),
                format: format,
            };
        case 'TRACK':
            if (args.pop() != 'AUDIO') {
                console.log('WARNING: non-audio tracks are untested');
            }
            return { pos: parseInt(args[0], 10) };
        case 'INDEX':
            const startTime = args.pop();
            const idx = args.pop();
            if (parseInt(idx, 10) !== 1) {
                // INDEX 01 should take precedence, but some files don't have INDEX 01 on each
                // track, fall back to any INDEX line in that case.
                if (track.start) {
                    console.log('WARNING: only INDEX 01 is supported');
                    return {};
                }
            }

            const seconds = framesToSeconds(startTime);
            if (seconds === null) {
                return { start: null };
            }

            return { start: { 'minutes-seconds-frames': startTime, seconds } };
        case 'ISRC':
        case '':
            return {};
        default:
            console.log('Unrecognized command:', command, args);
            return {};
    }
}

/*::
export type CueTrackStart = {
   'minutes-seconds-frames': string,
   seconds: number,
}

export type CueRecord = {
    artist: ?string,
    barcode: ?string,
    comments: ?Array<string>,
    filename: ?string,
    format: ?string,
    mbid: string,
    duration: ?number,
    pos: number,
    start: ?CueTrackStart,
    title: string,
}

*/

export function parseCue(cueStr /* : string */) /* : Array<CueRecord> */ {
    const lines = cueStr.split(/[\n|\r|\r\n]/).map(x => x.trim());

    const tracks = lines.reduce((memo, line) => {
        if (!memo.length) {
            memo[0] = {};
        }

        const parts = line.split(/ /);

        const command = parts.shift();
        if (command == 'TRACK') {
            memo.push({});
        }

        Object.assign(memo[memo.length - 1], parseCommand(command, parts, memo[memo.length - 1]));

        return memo;
    }, []);

    return tracks;
}

export function indexCue(records /* : Array<CueRecord> */) /* : Array<number> */ {
    let error = false;

    if (records.length < 2) {
        return [];
    }

    const ret = records.slice(1).map((item, pos) => {
        if (item.start) {
            return item.start.seconds;
        } else {
            error = true;
            return 0;
        }
    });

    return error ? [] : ret;
}

export function addTrackLengths(records /*: Array<CueRecord> */) /*: Array<CueRecord> */ {
    if (records.length < 2) {
        return records; // no tracks.
    }

    const lastIdx = records.length - 1;
    const discLength = records[0].duration;
    if (!discLength) {
        if (window.lûd.verbose) {
            console.log(
                'ERROR: disc length unknown for [' +
                    (records[0].artist || '') +
                    ' - ' +
                    (records[0].title || '')
            );
        }
        return records; // disc length unknown.
    }

    return records.map((record, idx) => {
        if (idx === 0 || record.duration) {
            return record;
        }

        if (!record.start) {
            return record;
        }

        if (idx == lastIdx) {
            record.duration = discLength - record.start.seconds;
        } else {
            const nextRecord = records[idx + 1];
            if (!nextRecord.start) {
                return record;
            }

            record.duration = nextRecord.start.seconds - record.start.seconds;
        }

        return record;
    });
}
