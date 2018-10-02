<?php

require_once dirname(__FILE__) . '/../lib/auto-progress.php';
require_once dirname(__FILE__) . '/../lib/config.php';
require_once dirname(__FILE__) . '/../lib/db.php';
require_once dirname(__FILE__) . '/../lib/metadata.php';
require_once dirname(__FILE__) . '/../lib/string.php';
require_once dirname(__FILE__) . '/../lib/tty.php';

function indexDiscs($album)
{
    foreach ($album['media'] as $disc) {
        if (empty($disc['title'])) {
            continue;
        }

        $url = $album['path'] . '/' . $disc['filename'];
        $duration = empty($disc['duration']) ? null : $disc['duration'];

        $query = db()->prepare("INSERT INTO discs VALUES(:title, :path, :duration, :mbid, :pos)");
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

    $query = db()->prepare(
        "INSERT INTO releases VALUES(:title, :artist, :year, :path, :duration, :mbid)"
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
    foreach ($album['tracks'] as $mbid => $track) {
        if (empty($album['media'][$track['discNo'] - 1])) {
            echo "WARNING: disc not found for " . $album['path'] . "\n";
            $url = '';
        } else {
            $disc = $album['media'][$track['discNo'] - 1];
            $url = $album['path'] . '/' . $disc['filename'];
        }

        $duration = empty($track['length']) ? null : $track['length'];

        $query = db()->prepare(
            "INSERT INTO tracks VALUES(:title, :artist, :path, :duration, :mbid, :pos, :disc)"
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
    echo $heading . "\n";
    echo str_repeat("=", strlen($heading)) . "\n";
}

function printIndexed($dir, $album)
{
    $year = getYear(empty($album['date']) ? '' : $album['date']);
    $dateStr = $year ? ($year . ', ') : '';

    $pathWidth = (int) (getTerminalWidth() * 0.4);

    echo fixLength($dir, $pathWidth) .
        "  " .
        $dateStr .
        $album['artist'] .
        ' - ' .
        $album['title'] .
        "\n";
}

function categoryAndPath($root, $dir)
{
    $dir = str_replace($root, '', $dir);
    $parts = explode('/', trim($dir, '/'));
    $category = array_shift($parts);

    return [$category, implode("/", $parts)];
}

function updateIndex()
{
    $cfg = loadConfig();

    $autoprogress = new AutoProgress('lud', 'index-all');

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

        $album = loadAlbum($info->getPath());

        list($category, $path) = categoryAndPath($root, $info->getPath());
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
