<?php

declare(strict_types=1);

require_once __DIR__ . '/../lib/db/devices.php';
require_once __DIR__ . '/../lib/db/playlist.php';
require_once __DIR__ . '/../lib/metadata.php';
require_once __DIR__ . '/../lib/playback.php';
require_once __DIR__ . '/../vendor/autoload.php';

/**
 * JSON expected in a POST request to now-playing.php:
 *
 * {
 *     "action" => "sync",
 *     "device" => "Chrome on macOS",
 *     "playlist_id" => 2,
 *     "pos" => 1297,
 *     "updated_at" => 1546357559541,
 *     "paused" => 0
 * }
 *
 * Fields:
 *
 * action       - see below
 * device       - a description of the connected device / application
 * playlist_id  - if currently playing something, the playlist ID
 * pos          - if currently playing something, position inside the
 *                item in milliseconds
 * updated_at   - time of when the playlist_id/pos values were accurate
 *                (in milliseconds, e.g. from Date.now() in Javascript)
 *
 * Action:
 *
 * sync         - sync current player state to the database, the user
 *                did not trigger this update
 * pause        - request playback to be paused
 * resume       - request playback to resume
 * next         - proceed to next playlist item
 * prev         - return to previous playlist item
 * seek         - change to the specified position in the current playlist
 *                item (use the "pos" field to specify the new position)
 */
function processPost()
{
}

function formatPlaylist($playlist)
{
    $playlist['path'] = webUrl($playlist['path']);

    return $playlist;
}

function formatNowPlaying($np)
{
    return [
        "pos" => $np['pos'],
        "updated_at" => $np['updated_at'],
        "paused" => (bool) $np['paused'],
        "playlist" => formatPlaylist($np['playlist'])
    ];
}

function main()
{
    header('Content-Type: application/json');

    processPost();

    $np = nowPlaying(['details' => true]);

    echo json_encode(formatNowPlaying($np), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n";
}

main();

Devices::connect()->close();
Playlist::connect()->close();
