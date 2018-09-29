<?php

require_once dirname(__FILE__) . '/../lib/config.php';
require_once dirname(__FILE__) . '/../lib/metadata.php';
require_once dirname(__FILE__) . '/../lib/string.php';
require_once dirname(__FILE__) . '/../lib/tty.php';

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
    $dateStr = empty($album['date']) ? '' : $album['date'] . ", ";
    if (preg_match("/([0-9]{4})-[0-9]{2}-[0-9]{2}/", $dateStr, $matches)) {
        $dateStr = $matches[1] . ", ";
    }

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

    // For debugging purposes, stop after 2 albums for now.
    $maxAlbums = 1;

    $root = $cfg['music_root'];

    $dir = new RecursiveDirectoryIterator($root);
    $filter = new RecursiveCallbackFilterIterator($dir, 'isAlbumFolder');
    $iterator = new RecursiveIteratorIterator($filter);

    $count = 0;
    $prevCategory = "";
    foreach ($iterator as $info) {
        if (++$count > $maxAlbums) {
            break;
        }

        $album = loadAlbum($info->getPath());

        list($category, $path) = categoryAndPath($root, $info->getPath());
        if ($category !== $prevCategory) {
            printCategory($prevCategory = $category);
        }
        printIndexed($path, $album);

        /* indexRelease($album); */
        /* indexDiscs($album); */
        /* indexTracks($album); */
    }

    echo "Finished indexing\n";
}
