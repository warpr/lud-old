<?php

header('Content-Type: application/json');

function displayError($msg)
{
    echo json_encode(['status' => 'error', 'message' => $msg], JSON_PRETTY_PRINT) . "\n";
    die();
}

function mpdLoad($playlists)
{
    // FIXME: don't hardcode this
    putenv('MPD_HOST=10.237.0.81');
    foreach ($playlists as $p) {
        exec('mpc load ' . escapeshellarg($p), $output, $exitCode);
    }
}

$requestBody = file_get_contents('php://input');
$data = json_decode($requestBody, true);
if ($data === null) {
    displayError('Invalid JSON?');
}

// FIXME: validate data
switch ($data['command']) {
    case 'load':
        mpdLoad($data['values']);
        break;
    default:
        displayError('Unknown command: ' . $data['command']);
}

echo json_encode(['status' => 'ok'], JSON_PRETTY_PRINT) . "\n";
