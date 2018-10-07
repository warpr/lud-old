<?php

require_once dirname(__FILE__) . '/../lib/auto-progress.php';
require_once dirname(__FILE__) . '/../lib/config.php';
require_once dirname(__FILE__) . '/../lib/db.php';
require_once dirname(__FILE__) . '/../lib/metadata.php';
require_once dirname(__FILE__) . '/../lib/string.php';
require_once dirname(__FILE__) . '/../lib/tty.php';

function printDebug($line)
{
    // echo "$line\n";
}

function printInfo($line)
{
    $cfg = loadConfig();

    if ($cfg['verbose']) {
        echo "$line\n";
    }
}

function printWarning($line)
{
    echo "WARNING: $line\n";
}

function printError($line)
{
    echo "WARNING: $line\n";
}

function indexDiscs($album)
{
    foreach ($album['media'] as $disc) {
        if (empty($disc['title'])) {
            continue;
        }

        // FIXME: include year

        $url = $album['path'] . '/' . $disc['filename'];
        $duration = empty($disc['duration']) ? null : $disc['duration'];

        $query = db()->prepare(
            "INSERT INTO records (title, path, duration, mbid, pos) VALUES(:title, :path, :duration, :mbid, :pos)"
        );
        $query->bindParam(':title', $disc['title']);
        $query->bindParam(':path', $url);
        $query->bindParam(':duration', $duration);
        $query->bindParam(':mbid', $album['mbid']);
        $query->bindParam(':pos', $disc['position']);
        $query->execute();
    }
}

function indexRelease($album)
{
    $year = getYear(empty($album['date']) ? '' : $album['date']);

    $duration = null;
    foreach ($album['media'] as $disc) {
        if (!empty($disc['duration'])) {
            $duration += $disc['duration'];
        }
    }

    // FIXME: releases should just point to the first disc

    $query = db()->prepare(
        "INSERT INTO records (title, artist, year, path, duration, mbid) VALUES(:title, :artist, :year, :path, :duration, :mbid)"
    );
    $query->bindParam(':title', $album['title']);
    $query->bindParam(':artist', $album['artist']);
    $query->bindParam(':year', $year);
    $query->bindParam(':path', $album['path']);
    $query->bindParam(':duration', $duration);
    $query->bindParam(':mbid', $album['mbid']);
    $query->execute();
}

function indexTracks($album)
{
    print_r($album);

    foreach ($album['tracks'] as $mbid => $track) {
        if (empty($album['media'][$track['discNo'] - 1])) {
            // FIXME: save these somewhere to easily re-index failed tracks
            printWarning("disc not found for " . $album['path']);
            $url = '';
        } else {
            $disc = $album['media'][$track['discNo'] - 1];
            $url = $album['path'] . '/' . $disc['filename'];
        }

        $duration = empty($track['length']) ? null : $track['length'];

        // FIXME: include year
        $query = db()->prepare(
            "INSERT INTO records (title, artist, path, duration, mbid, pos, disc) VALUES(:title, :artist, :path, :duration, :mbid, :pos, :disc)"
        );
        $query->bindParam(':title', $track['title']);
        $query->bindParam(':artist', $track['artist']);
        $query->bindParam(':path', $url);
        $query->bindParam(':duration', $duration);
        $query->bindParam(':mbid', $mbid);
        $query->bindParam(':pos', $track['position']);
        $query->bindParam(':disc', $track['discNo']);
        $query->execute();
    }
}

function isAlbumFolder($current, $key, $iterator)
{
    // Skip hidden files and directories.
    if ($current->getFilename()[0] === '.') {
        return false;
    }

    if ($current->isDir()) {
        return true;
    }

    // FIXME: something may be needed here to prevent infinite loops
    /* if ($current->isDir()) { */
    /*     // Only recurse into intended subdirectories. */
    /*     return $current->getFilename() === 'wanted_dirname'; */
    /* } */

    if ($current->getFilename() === 'metadata.json') {
        return is_readable(realpath($current->getPathname()));
    }
}

function printCategory($category)
{
    $heading = "Indexing " . $category;
    printInfo($heading);
    printInfo(str_repeat("=", strlen($heading)));
}

function printIndexed($dir, $album)
{
    $year = getYear(empty($album['date']) ? '' : $album['date']);
    $dateStr = $year ? ($year . ', ') : '';

    $pathWidth = (int) (getTerminalWidth() * 0.4);

    printInfo(
        fixLength($dir, $pathWidth) . "  " . $dateStr . $album['artist'] . ' - ' . $album['title']
    );
}

function categoryAndPath($root, $dir)
{
    $dir = str_replace($root, '', $dir);
    $parts = explode('/', trim($dir, '/'));
    $category = array_shift($parts);

    return [$category, implode("/", $parts)];
}

function updateIndex($query)
{
    $cfg = loadConfig();

    if (empty($query)) {
        $autoprogress = new AutoProgress('lud', 'index-all');
    } else {
        echo "Using " . slug('index-' . $query) . " as autoprogress slug\n";
        $autoprogress = new AutoProgress('lud', slug('index-' . $query));
    }

    // start fresh when doing a full index, as I don't know how
    // to avoid duplicates in SQLite FTS5 tables.
    deleteDatabase();
    initializeDatabase();

    // For debugging purposes, stop after 2 albums for now.
    // $maxAlbums = 30;

    $root = $cfg['music_root'];

    $dir = new RecursiveDirectoryIterator($root);
    $filter = new RecursiveCallbackFilterIterator($dir, 'isAlbumFolder');
    $iterator = new RecursiveIteratorIterator($filter);

    $count = 0;
    $prevCategory = "";
    foreach ($iterator as $info) {
        $autoprogress->next(true);

        $currentPath = $info->getPath();

        if (!empty($query) && !contains($currentPath, $query)) {
            printDebug("Skipping $currentPath");
            continue;
        }

        $album = loadAlbum($currentPath);

        list($category, $path) = categoryAndPath($root, $currentPath);
        if ($category !== $prevCategory) {
            printCategory($prevCategory = $category);
        }
        printIndexed($path, $album);

        $discTitle = false;
        foreach ($album['media'] as $disc) {
            if (!empty($disc['title'])) {
                $discTitle = true;
            }
        }

        indexDiscs($album);
        indexRelease($album);
        indexTracks($album);

        /* if (++$count >= $maxAlbums) { */
        /*     break; */
        /* } */
    }

    $autoprogress->done();
    echo "Finished indexing\n";
}
