<?php
/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2019  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 */

$dir = __DIR__ . $_SERVER['PATH_INFO'];

require_once __DIR__ . '/../lib/string.php';
require_once __DIR__ . '/../lib/disc-length.php';

function notFound()
{
    http_response_code(404);
    header('Content-Type: text/plain');
    echo "Not Found\n";
    die();
}

function pathJoin()
{
    $paths = array_filter(func_get_args());
    return preg_replace(',/+,', '/', join('/', $paths));
}

function webPath($filename)
{
    $webRoot = dirname($_SERVER['SCRIPT_NAME']);
    $filePath = $_SERVER['PATH_INFO'];

    return pathJoin($webRoot, $filePath, $filename);
}

// FIXME: this duplicates functionality from lib/metadata.php, maybe merge them.
function parseArtist($obj)
{
    if (empty($obj) || empty($obj['artist-credit'])) {
        return '';
    }

    $completeName = '';

    foreach ($obj['artist-credit'] as $credit) {
        $completeName .= $credit['name'];
        $completeName .= $credit['joinphrase'];
    }

    return $completeName;
}

// FIXME: this duplicates functionality from lib/metadata.php, maybe merge them.
function parseMedia($obj, $dir)
{
    if (empty($obj)) {
        return [];
    }

    $media = [];
    $idx = 0;
    foreach ($obj['media'] as $medium) {
        $item = [];

        $idxStr = '' . ++$idx;
        while (strlen($idxStr) < 5) {
            $filename = $dir . '/disc' . $idxStr . '.cue';
            if (is_readable($filename)) {
                $item['lud:cueFile'] = 'disc' . $idxStr . '.cue';
                break;
            }

            $filename = null;
            $idxStr = '0' . $idxStr;
        }

        if (!empty($medium['title'])) {
            $item['dc:title'] = $medium['title'];
        }

        // position is the 1-based disc number, this is useful in cases where the first disc is not
        // included in the library (e.g. because it is a data disc).
        if (!empty($medium['position'])) {
            $pos = $medium['position'];
        } else {
            $pos = $idx;
        }

        $item['mo:record_number'] = $pos;
        /* $item['objectID'] = 'https://musicbrainz.org/release/' . $obj['id'] . '/disc/' . $item['position'] . '#disc' . $item['position']; */

        $documentName = $obj['id'] . '-disc-' . $pos;

        if (!empty($filename)) {
            $duration = processDisc($filename, ['verbose' => false]);
            $item['mo:duration'] = empty($duration) ? null : (int) $duration * 1000;
        } else {
            $item['mo:duration'] = null;
        }

        if (!empty($item['lud:cueFile'])) {
            $media[$item['mo:record_number'] - 1] = $item;
        }
    }

    return $media;
}

function loadMetadata($dir, $actualFile)
{
    $metadata = json_decode(file_get_contents($actualFile), true);

    // parse basic release data, like
    // - album artist
    // - album title
    // - total duration
    // - disc titles
    // - disc durations
    // - disc artists

    $ret = ['@id' => 'mb-release:' . $metadata['id']];
    if (!empty($metadata['date'])) {
        $ret['dc:date'] = $metadata['date'];
    }

    $ret['dc:title'] = $metadata['title'];
    $ret['schema:creditedTo'] = parseArtist($metadata);
    $ret['mo:record'] = parseMedia($metadata, $dir);

    return $ret;
}

if (!is_dir($dir)) {
    notFound();
    die();
}

$response = [];
$response['@context'] = [
    'dc' => 'http://purl.org/dc/terms/',
    'foaf' => 'http://purl.org/vocab/frbr/core#',
    'frbr' => 'http://purl.org/vocab/frbr/core#',
    'lud' => 'https://lûd.app/vocab/',
    'mo' => 'http://purl.org/ontology/mo/',
    'mb-release' => 'https://musicbrainz.org/release/',
    'mb-artist' => 'https://musicbrainz.org/artist/',
    'nfo' => 'http://www.semanticdesktop.org/ontologies/2007/03/22/nfo#',
    'nie' => 'http://www.semanticdesktop.org/ontologies/2007/01/19/nie#'
];

$response['@id'] = webPath('');
$response['lud:isRelease'] = false;
$response['@reverse']['nfo:belongsToContainer'] = [];

$files = scandir($dir);
$includeFiles = false;
if (in_array('metadata.json', $files)) {
    $includeFiles = true;
}

foreach ($files as $file) {
    if (startsWith($file, '.')) {
        continue;
    }

    $actualFile = realpath(pathJoin($dir, $file));

    $type = filetype($actualFile);
    if (!in_array($type, ['dir', 'file'])) {
        continue;
    }

    if (!$includeFiles && $type == 'file') {
        continue;
    }

    if ($file === 'metadata.json') {
        $response['lud:isRelease'] = true;

        $response['foaf:primaryTopic'] = loadMetadata($dir, $actualFile);
    }

    $metadata = [];
    $metadata['@type'] = filetype($actualFile) == 'dir' ? 'nfo:Folder' : 'nfo:FileDataObject';
    $metadata['nfo:fileSize'] = filesize($actualFile);
    $metadata['nie:mimeType'] = mime_content_type($actualFile);
    $metadata['nfo:fileUrl'] = webPath($file);

    $response['@reverse']['nfo:belongsToContainer'][] = $metadata;
}

// header('Content-Type: application/json');
header('Content-Type: application/ld+json');

echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) .
    "\n";
