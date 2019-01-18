<?php

declare(strict_types=1);

require_once __DIR__ . '/../../lib/db/devices.php';
require_once __DIR__ . '/../../lib/db/playlist.php';
require_once __DIR__ . '/../../lib/metadata.php';
require_once __DIR__ . '/../../lib/playback.php';
require_once __DIR__ . '/../../vendor/autoload.php';

/**
 * JSON expected in a POST request to now-playing.php:
 *
 * {
 *     "action" => "sync",
 *     "cue_file" => "/lud/music/soundtracks/wipeout/1999.wip3out/disc1.cue",
 *     "device" => "Chrome on macOS",
 *     "paused" => 0,
 *     "playlist_id" => 2,
 *     "pos" => 1297,
 *     "updated_at" => 1546357559541,
 * }
 *
 * Fields:
 *
 * action       - see below
 * cue_file     - if currently playing something, the cue file
 * device       - a description of the connected device / application
 * paused       - set to true if not playing
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
    $post = json_decode(file_get_contents('php://input'), true);

    // validate POST data
    $deviceName = $post['device'];

    $deviceId = null;
    if (!empty($_COOKIE['lud-device-id'])) {
        $deviceId = $_COOKIE['lud-device-id'];

        $query = Devices::connect()->prepare("SELECT id FROM devices WHERE id = :deviceId");
        $query->bindParam(':deviceId', $deviceId);
        $result = $query->execute();

        $row = $result->fetchArray(SQLITE3_ASSOC);
        if (empty($row)) {
            $deviceId = null;
        }
    }

    if (empty($deviceId)) {
        $now = "" . floor(microtime(true) * 1000);

        $query = Devices::connect()->prepare(
            "INSERT INTO devices (device, updated_at, paused) VALUES (:device, :updated, 1)"
        );
        $query->bindParam(':device', $deviceName);
        $query->bindParam(':updated', $now);
        $query->execute();

        $deviceId = Devices::connect()->lastInsertRowID();
    } else {
        $deviceId = $_COOKIE['lud-device-id'];
    }

    $cookieOptions = [
        'expires' => time() + 60 * 60 * 24 * 365,
        'path' => '/lud/',
        'domain' => 'kuno.app',
        'secure' => true,
        'httponly' => true
    ];

    setcookie(
        'lud-device-id',
        "$deviceId",
        $cookieOptions['expires'],
        $cookieOptions['path'],
        $cookieOptions['domain'],
        $cookieOptions['secure'],
        $cookieOptions['httponly']
    );

    $disc = basename($post['cue_file'], '.cue');
    $paused = (int) $post['paused'];
    $playlistId = $post['playlist_id'];
    $pos = $post['pos'];
    $updated = $post['updated_at'];

    $query = Devices::connect()->prepare(
        "UPDATE devices SET playlist_id = :playlist, pos = :pos, disc = :disc, updated_at = :updated, paused = :paused WHERE id = :id"
    );
    $query->bindParam(':disc', $disc);
    $query->bindParam(':pos', $pos);
    $query->bindParam(':paused', $paused);
    $query->bindParam(':playlist', $playlistId);
    $query->bindParam(':updated', $updated);
    $query->bindParam(':id', $deviceId);
    $query->execute();

    return $deviceId;
}

function formatNowPlaying($np)
{
    $playlist = $np['playlist'];

    $cueFile = webUrl($playlist['path']) . '/' . $np['disc'] . '.cue';

    return [
        "cue_file" => $cueFile,
        "paused" => (bool) $np['paused'],
        "playlist_id" => $playlist['id'],
        "pos" => $np['pos'],
        "updated_at" => $np['updated_at']
    ];
}

function reconcileDevices($deviceId)
{
    // FIXME: Move this elsewhere.

    // for now just copy over the value the server sent.

    $query = Devices::connect()->prepare("SELECT * FROM devices WHERE id = :id");
    $query->bindParam(':id', $deviceId);
    $result = $query->execute();

    $row = $result->fetchArray(SQLITE3_ASSOC);
    $pos = $row['pos'];
    $updated = $row['updated_at'];
    $paused = $row['paused'];

    $query = Devices::connect()->prepare(
        "UPDATE devices SET pos = :pos, updated_at = :updated, paused = :paused WHERE id = 0"
    );
    $query->bindParam(':paused', $paused);
    $query->bindParam(':pos', $pos);
    $query->bindParam(':updated', $updated);
    $query->execute();
}

function main()
{
    header('Content-Type: application/json');

    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        $deviceId = processPost();
        reconcileDevices($deviceId);
    }

    $np = nowPlaying(['details' => true]);

    echo json_encode(formatNowPlaying($np), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n";
}

main();

Devices::connect()->close();
Playlist::connect()->close();
