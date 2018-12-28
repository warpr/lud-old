<?php
/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2018  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 */

declare(strict_types=1);

require_once __DIR__ . '/../lib/disc-length.php';
require_once __DIR__ . '/../lib/config.php';

function webUrl($filename)
{
    $cfg = loadConfig();

    return str_replace(abspath($cfg['music_root']), $cfg['web_path'], abspath($filename));
}

function parseMedia($obj, $dir)
{
    if (empty($obj)) {
        return [];
    }

    $media = [];
    $idx = 0;
    foreach ($obj['media'] as $medium) {
        $item = [];

        $idxStr = "" . ++$idx;
        while (strlen($idxStr) < 5) {
            $filename = $dir . "/disc" . $idxStr . ".cue";
            if (is_readable($filename)) {
                $item['filename'] = "disc" . $idxStr;
                break;
            }

            $filename = null;
            $idxStr = "0" . $idxStr;
        }

        if (!empty($medium['title'])) {
            $item['title'] = $medium['title'];
        }

        // position is the 1-based disc number, this is useful in cases where the first disc is not
        // included in the library (e.g. because it is a data disc).
        if (!empty($medium['position'])) {
            $pos = $medium['position'];
        } else {
            $pos = $idx;
        }

        $item['position'] = $pos;
        /* $item['objectID'] = 'https://musicbrainz.org/release/' . $obj['id'] . '/disc/' . $item['position'] . '#disc' . $item['position']; */

        $documentName = $obj['id'] . '-disc-' . $pos;

        if (!empty($filename)) {
            $duration = processDisc($filename, ["verbose" => false]);
            $item['duration'] = empty($duration) ? null : (int) $duration;
        } else {
            $item['duration'] = null;
        }

        if (!empty($item['filename'])) {
            /* $item['filename'] = webUrl($item['filename']); */
            $media[$item['position'] - 1] = $item;
        }
    }

    return $media;
}

function parseArtist($obj)
{
    if (empty($obj) || empty($obj['artist-credit'])) {
        return [];
    }

    $artists = [];
    $credited = [];
    $completeName = '';

    foreach ($obj['artist-credit'] as $credit) {
        $doc = [
            'names' => array_unique([$credit['artist']['name'], $credit['artist']['sort-name']]),
            'type' => 'artist'
        ];

        $credited[] = [
            'artist' => $credit['name'],
            'id' => $credit['artist']['id'],
            'joinphrase' => $credit['joinphrase']
        ];

        $artists[$credit['artist']['id']] = $doc;

        $completeName .= $credit['name'];
        $completeName .= $credit['joinphrase'];
    }

    return ['artist' => $completeName, 'credit' => $credited];
}

function parseRelease($obj, $dir)
{
    $summary = ['type' => 'release'];

    if (empty($obj)) {
        return $summary;
    }

    $fields = ['date', 'title'];
    foreach ($fields as $f) {
        if (!empty($obj[$f])) {
            $summary[$f] = $obj[$f];
        }
    }

    $summary['mbid'] = $obj['id'];
    $summary['objectID'] = 'https://musicbrainz.org/release/' . $obj['id'];
    $summary['path'] = webUrl($dir);

    return $summary;
}

function parseTracks($obj)
{
    $tracks = [];

    if (empty($obj)) {
        return $tracks;
    }

    $allArtists = [];
    $discNo = 0;
    foreach ($obj['media'] as $medium) {
        $discNo++;
        $trackNo = 0;
        foreach ($medium['tracks'] as $trk) {
            $trackNo++;
            $song = [
                'position' => $trackNo,
                'length' => $trk['length'],
                'title' => $trk['title'],
                'discNo' => $discNo,
                'type' => 'track'
            ];

            if (!empty($trk['artist-credit'])) {
                $song += parseArtist($trk);
            } elseif (!empty($trk['recording']['artist-credit'])) {
                $song += parseArtist($trk['recording']);
            }

            $tracks[$trk['id']] = $song;
        }
    }

    return $tracks;
}

function loadAlbum($dir)
{
    // FIXME: make robust against parse errors
    $metadata = json_decode(file_get_contents("$dir/metadata.json"), true);

    $release = parseRelease($metadata, $dir);
    if (empty($release)) {
        return;
    }

    $release += parseArtist($metadata);
    $release['media'] = parseMedia($metadata, $dir);
    $release['tracks'] = parseTracks($metadata);

    return $release;
}
