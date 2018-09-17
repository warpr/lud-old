<?php

require_once dirname(__FILE__) . '/../lib/config.php';
require_once dirname(__FILE__) . '/../lib/metadata.php';

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

function updateIndex()
{
    $cfg = loadConfig();

    $root = $cfg['music_root'];

    $dir = new RecursiveDirectoryIterator($root);
    $filter = new RecursiveCallbackFilterIterator($dir, 'isAlbumFolder');
    $iterator = new RecursiveIteratorIterator($filter);
    $files = array();
    foreach ($iterator as $info) {
        loadAlbum($info->getPath());
        $files[] = $info->getPath();
    }
}
